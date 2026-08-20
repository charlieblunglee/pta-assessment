import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { evaluateAssessment } from "@/domain/assessment/scoring";
import { buildExecutiveEmailHtml } from "@/domain/assessment/executive-email";
import type { AnswerInput, HealthcareArchetype } from "@/domain/assessment/types";
import { getEmailProvider } from "@/server/email/provider";
import { enforceEmailRateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    const html = buildExecutiveEmailHtml({ company, lineOfBusiness, archetype, assessmentDate: new Date().toISOString().slice(0,10), answers, result });
    const delivery = await getEmailProvider().send({ to: email, subject: "Your HIMAP Program Technology Profile Assessment Results", html });
    // Persist only delivery metadata in email_delivery_log after Supabase server authentication is configured.
    return NextResponse.json({ ok: true, deliveryId: createHash("sha256").update(delivery.id).digest("hex").slice(0,16) });
  } catch (error) {
    const code = error instanceof Error && error.message === "EMAIL_NOT_CONFIGURED" ? 503 : 502;
    return NextResponse.json({ error: "We couldn't send your results. Your assessment remains available." }, { status: code });
  }
}
