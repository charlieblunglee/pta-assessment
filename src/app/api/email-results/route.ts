import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { evaluateAssessment } from "@/domain/assessment/scoring";
import type { AnswerInput, HealthcareArchetype } from "@/domain/assessment/types";
import { getEmailProvider } from "@/server/email/provider";
import { enforceEmailRateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]!));
const text = (value: unknown, max = 200) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const email = text(body.email, 320).toLowerCase();
    const company = text(body.company);
    const lineOfBusiness = text(body.lineOfBusiness);
    const archetype = body.archetype as HealthcareArchetype;
    const answers = Array.isArray(body.answers) ? body.answers as AnswerInput[] : [];
    if (!emailPattern.test(email) || !company || !lineOfBusiness || !["nonclinical","clinical","him"].includes(archetype) || answers.length !== 42) {
      return NextResponse.json({ error: "Invalid assessment request." }, { status: 400 });
    }
    const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!await enforceEmailRateLimit(`${client}:${email}`)) return NextResponse.json({ error: "Please wait before trying again." }, { status: 429 });
    const result = evaluateAssessment({ answers: answers.map(a=>({...a,evidenceNote:null,hasArtifact:Boolean(a.hasArtifact)})), archetype });
    if (result.status !== "scored") return NextResponse.json({ error: "The assessment is incomplete." }, { status: 422 });
    const immediate = [`${result.lowestDomain.name} diagnostic`, "Governed implementation roadmap", "Outcome measurement baseline"];
    const track = {nonclinical:"Non-Clinical Interaction",clinical:"Clinical Interaction",him:"HIM Production"}[archetype];
    const rows = [
      ["Company", company], ["Line of Business", lineOfBusiness], ["Healthcare Track", track], ["Assessment date", new Date().toISOString().slice(0,10)],
      ["Program Technology Profile Score", `${result.programScore} / 100`], ["Maturity", result.maturity], ["Recommended package", `${result.finalPackage.code} - ${result.finalPackage.name}`],
      ["Primary domain focus", `${result.lowestDomain.id} - ${result.lowestDomain.name}`], ["Assessment Confidence", `${result.confidenceScore}% - ${result.confidenceLevel}`],
      ["Assessment Disposition", result.assessmentDisposition], ["Recommended further analysis", `${result.recommendedDeepDive} - ${result.lowestDomain.name} Deep Dive`]
    ];
    const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#102733"><h1 style="color:#003b5c">HIMAP Program Technology Profile Assessment</h1>${rows.map(([label,value])=>`<p><span style="color:#5b6e78;font-size:12px;text-transform:uppercase">${escapeHtml(label)}</span><br><strong>${escapeHtml(value)}</strong></p>`).join("")}<h2>Top immediate priorities</h2><ul>${immediate.map(item=>`<li>${escapeHtml(item)}</li>`).join("")}</ul><p style="font-size:12px;color:#5b6e78">This email contains assessment findings only. Uploaded artifacts, evidence files, evidence notes, PHI, and patient information are excluded.</p></div>`;
    const delivery = await getEmailProvider().send({ to: email, subject: "Your HIMAP Program Technology Profile Assessment Results", html });
    // Persist only delivery metadata in email_delivery_log after Supabase server authentication is configured.
    return NextResponse.json({ ok: true, deliveryId: createHash("sha256").update(delivery.id).digest("hex").slice(0,16) });
  } catch (error) {
    const diagnostic = error instanceof Error ? error.message : "EMAIL_UNKNOWN_ERROR";
    console.error("Email delivery failed", { diagnostic });
    const code = error instanceof Error && error.message === "EMAIL_NOT_CONFIGURED" ? 503 : 502;
    return NextResponse.json({ error: "We couldn't send your results. Your assessment remains available." }, { status: code });
  }
}
