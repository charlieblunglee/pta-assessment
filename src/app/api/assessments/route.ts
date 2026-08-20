import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateAssessment } from "@/domain/assessment/scoring";
import { buildExecutiveRoadmap } from "@/domain/assessment/roadmap";
import type { AnswerInput, AssessmentDisposition, ConfidenceLevel } from "@/domain/assessment/types";
import type { Json } from "@/lib/database.types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const answerSchema = z.object({
  questionId: z.string().regex(/^D[1-6]-Q[1-7]$/),
  domainId: z.enum(["D1","D2","D3","D4","D5","D6"]),
  value: z.union([z.literal(1),z.literal(2),z.literal(3)]),
  evidenceNote: z.string().max(2000).nullable().optional(),
  hasArtifact: z.boolean().optional()
}).refine(value => value.questionId.startsWith(`${value.domainId}-`), "Question/domain mismatch");

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action:z.literal("start"), company:z.string().trim().min(1).max(200), lineOfBusiness:z.string().trim().min(1).max(200), archetype:z.enum(["nonclinical","clinical","him"]), mixedWork:z.boolean(), acknowledged:z.literal(true) }),
  z.object({ action:z.literal("save"), assessmentId:z.string().uuid(), answers:z.array(answerSchema).max(42) }),
  z.object({ action:z.literal("submit"), assessmentId:z.string().uuid(), archetype:z.enum(["nonclinical","clinical","him"]), mixedWork:z.boolean(), answers:z.array(answerSchema).length(42) })
]);

const json = (value: unknown) => value as Json;
const confidence = (value: ConfidenceLevel) => value.toLowerCase() as "low"|"moderate"|"high";
const disposition = (value: AssessmentDisposition) => ({
  "Recommendation Ready":"recommendation_ready",
  "Targeted Further Analysis Recommended":"targeted_further_analysis",
  "Deep-Dive Assessment Required":"deep_dive_required"
} as const)[value];

async function authenticatedUser() {
  const client = await createSupabaseServerClient();
  const { data:{ user }, error } = await client.auth.getUser();
  return error ? null : user;
}

export async function GET() {
  const user = await authenticatedUser();
  if (!user) return NextResponse.json({ error:"Authentication required" }, { status:401 });
  const admin = createSupabaseAdminClient();
  const { data: assessment, error } = await admin.from("assessments").select("*").eq("owner_user_id",user.id).eq("status","in_progress").order("updated_at",{ascending:false}).limit(1).maybeSingle();
  if (error) return NextResponse.json({ error:"Could not load assessment" }, { status:500 });
  if (!assessment) return NextResponse.json({ assessment:null, answers:[] });
  const { data: responses, error: responseError } = await admin.from("assessment_responses").select("domain_code,question_code,score,evidence_note").eq("assessment_id",assessment.id);
  if (responseError) return NextResponse.json({ error:"Could not load responses" }, { status:500 });
  return NextResponse.json({ assessment, answers:responses ?? [] });
}

export async function POST(request: Request) {
  const user = await authenticatedUser();
  if (!user) return NextResponse.json({ error:"Authentication required" }, { status:401 });
  const parsed = requestSchema.safeParse(await request.json().catch(()=>null));
  if (!parsed.success) return NextResponse.json({ error:"Invalid assessment data" }, { status:400 });
  const admin = createSupabaseAdminClient();

  if (parsed.data.action === "start") {
    const existing = await admin.from("assessments").select("id").eq("owner_user_id",user.id).eq("status","in_progress").order("updated_at",{ascending:false}).limit(1).maybeSingle();
    if (existing.data) return NextResponse.json({ assessmentId:existing.data.id, resumed:true });
    const profile = await admin.from("profiles").upsert({ id:user.id }, { onConflict:"id" });
    if (profile.error) return NextResponse.json({ error:"Could not initialize profile" }, { status:500 });
    let membership = await admin.from("organization_memberships").select("organization_id").eq("user_id",user.id).limit(1).maybeSingle();
    let organizationId = membership.data?.organization_id;
    if (!organizationId) {
      const organization = await admin.from("organizations").insert({ name:parsed.data.company }).select("id").single();
      if (organization.error) return NextResponse.json({ error:"Could not create organization" }, { status:500 });
      organizationId = organization.data.id;
      membership = await admin.from("organization_memberships").insert({ organization_id:organizationId, user_id:user.id, role:"respondent" }).select("organization_id").single();
      if (membership.error) return NextResponse.json({ error:"Could not create organization membership" }, { status:500 });
    }
    const industry = await admin.from("industry_configuration").select("id").eq("status","published").order("version",{ascending:false}).limit(1).single();
    if (industry.error) return NextResponse.json({ error:"Published industry configuration is missing" }, { status:503 });
    const archetype = await admin.from("archetype_configuration").select("id").eq("industry_configuration_id",industry.data.id).eq("archetype",parsed.data.archetype).eq("status","published").order("version",{ascending:false}).limit(1).single();
    if (archetype.error) return NextResponse.json({ error:"Published healthcare-track configuration is missing" }, { status:503 });
    const created = await admin.from("assessments").insert({ organization_id:organizationId, owner_user_id:user.id, industry_configuration_id:industry.data.id, archetype_configuration_id:archetype.data.id, status:"in_progress", healthcare_archetype:parsed.data.archetype, company:parsed.data.company, line_of_business:parsed.data.lineOfBusiness, confidentiality_acknowledged_at:new Date().toISOString(), mixed_work:parsed.data.mixedWork }).select("id").single();
    if (created.error) return NextResponse.json({ error:"Could not create assessment" }, { status:500 });
    return NextResponse.json({ assessmentId:created.data.id, resumed:false });
  }

  if (parsed.data.action !== "save" && parsed.data.action !== "submit") return NextResponse.json({ error:"Invalid action" }, { status:400 });
  const assessmentId = parsed.data.assessmentId;
  const owned = await admin.from("assessments").select("id,status").eq("id",assessmentId).eq("owner_user_id",user.id).maybeSingle();
  if (!owned.data) return NextResponse.json({ error:"Assessment not found" }, { status:404 });
  const rows = parsed.data.answers.map(answer=>({ assessment_id:assessmentId, domain_code:answer.domainId, question_code:answer.questionId, score:answer.value, evidence_note:answer.evidenceNote?.trim()||null }));
  if (rows.length) {
    const saved = await admin.from("assessment_responses").upsert(rows,{onConflict:"assessment_id,question_code"});
    if (saved.error) return NextResponse.json({ error:"Could not save responses" }, { status:500 });
  }
  if (parsed.data.action === "save") return NextResponse.json({ saved:true });
  if (parsed.data.action !== "submit") return NextResponse.json({ error:"Invalid submission" }, { status:400 });
  const submittedArchetype = parsed.data.archetype;

  const answers = parsed.data.answers as AnswerInput[];
  const result = evaluateAssessment({ answers, archetype:parsed.data.archetype, mixedWork:parsed.data.mixedWork });
  if (result.status !== "scored") return NextResponse.json({ error:"All 42 responses are required" }, { status:400 });
  const domains = result.domainResults.map(domain=>({ assessment_id:assessmentId, domain_code:domain.id, answered_count:7, weight:domain.weight, raw_score:domain.rawScore, normalized_score:domain.preciseScore, maturity:domain.maturity }));
  const domainWrite = await admin.from("assessment_domains").upsert(domains,{onConflict:"assessment_id,domain_code"});
  if (domainWrite.error) return NextResponse.json({ error:"Could not save domain results" }, { status:500 });
  const summary = { programScore:result.programScore, maturity:result.maturity, finalPackage:result.finalPackage, primaryDomain:result.lowestDomain, confidenceScore:result.confidenceScore, confidenceLevel:result.confidenceLevel, assessmentDisposition:result.assessmentDisposition };
  const resultWrite = await admin.from("assessment_results").upsert({ assessment_id:parsed.data.assessmentId, calculation_version:"2.0.0", overall_weighted_score:result.programPreciseScore, maturity:result.maturity, base_package:result.basePackage.code, triggered_overrides:json(result.triggeredOverrides), healthcare_governance_caps:json(result.healthcareGovernanceCaps), final_package:result.finalPackage.code, lowest_domain:result.lowestDomain.id, strongest_domain:result.strongestDomain.id, confidence_score:result.confidenceScore, confidence_level:confidence(result.confidenceLevel), assessment_disposition:disposition(result.assessmentDisposition), recommended_deep_dive:result.recommendedDeepDive, executive_summary_data:json(summary), recommendation_explanation:json(result.recommendationExplanation) },{onConflict:"assessment_id"}).select("id").single();
  if (resultWrite.error) return NextResponse.json({ error:"Could not save assessment result" }, { status:500 });
  await admin.from("recommendations").delete().eq("assessment_result_id",resultWrite.data.id);
  const phases = buildExecutiveRoadmap(result,answers,parsed.data.archetype);
  const recommendationWrite = await admin.from("recommendations").insert(phases.map((phase,index)=>({ assessment_result_id:resultWrite.data.id, archetype:submittedArchetype, package:result.finalPackage.code, priority:index===0?"Immediate":index===1?"Near-Term":"Roadmap", domain_code:result.lowestDomain.id, component:`Phase ${index+1}`, title:phase.title, description:phase.objective, rationale:phase.decisionGate, expected_outcome:phase.outcomes.join("; "), dependencies:json(phase.leadershipActions), guardrails:json(result.healthcareGovernanceCaps), metrics:json(phase.outcomes), sort_order:index })));
  if (recommendationWrite.error) return NextResponse.json({ error:"Could not save recommendations" }, { status:500 });
  const completed = await admin.from("assessments").update({ status:"submitted", submitted_at:new Date().toISOString() }).eq("id",parsed.data.assessmentId).eq("owner_user_id",user.id);
  if (completed.error) return NextResponse.json({ error:"Could not finalize assessment" }, { status:500 });
  return NextResponse.json({ submitted:true, result:summary });
}
