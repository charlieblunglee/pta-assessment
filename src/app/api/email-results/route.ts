import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { evaluateAssessment } from "@/domain/assessment/scoring";
import { buildExecutiveEmailHtml } from "@/domain/assessment/executive-email";
import type { AnswerInput, HealthcareArchetype } from "@/domain/assessment/types";
import { getEmailProvider } from "@/server/email/provider";
import { enforceEmailRateLimit } from "@/server/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (value: unknown, max = 200) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error:"Authentication required." }, { status:401 });
    const body = await request.json() as Record<string, unknown>;
    const email = user.email.toLowerCase();
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
    const admin = createSupabaseAdminClient();
    const assessment = await admin.from("assessments").select("id").eq("owner_user_id",user.id).in("status",["in_progress","submitted"]).order("updated_at",{ascending:false}).limit(1).maybeSingle();
    if (assessment.data) await admin.from("email_delivery_log").insert({ assessment_id:assessment.data.id, requested_by:user.id, recipient_domain:email.split("@")[1]??null, recipient_hash:createHash("sha256").update(email).digest("hex"), provider:"brevo", provider_message_id:delivery.id, status:"sent" });
    return NextResponse.json({ ok: true, deliveryId: createHash("sha256").update(delivery.id).digest("hex").slice(0,16) });
  } catch (error) {
    const code = error instanceof Error && error.message === "EMAIL_NOT_CONFIGURED" ? 503 : 502;
    return NextResponse.json({ error: "We couldn't send your results. Your assessment remains available." }, { status: code });
  }
}
