import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Permission } from "./access";

export async function adminRows(kind:Permission, identities:boolean, page:number, assessmentId?:string) {
  const db = createSupabaseAdminClient();
  let query = db.from("assessments").select("id,owner_user_id,company,line_of_business,status,submitted_at,created_at,healthcare_archetype,industry_configuration_id",{count:"exact"}).order("created_at",{ascending:false}).order("id");
  if (kind !== "respondents") query = query.eq("status","submitted");
  if (assessmentId) query = query.eq("id",assessmentId);
  const {data:assessments,error,count} = await query.range(page*50,page*50+49);
  if (error) throw new Error("Could not load assessments");
  const rows:Record<string,unknown>[] = [];
  const source = await readFile(join(process.cwd(),"public/assessment-data.js"),"utf8");
  const definition = JSON.parse(source.slice(source.indexOf("{" )).replace(/;\s*$/, "")) as LegacyAssessmentData;
  const fallback = definition.domains.flatMap(d=>d.questions);
  for (const a of assessments ?? []) {
    const base:Record<string,unknown> = {assessment_id:a.id,status:a.status,submitted_at:a.submitted_at};
    if (identities) {
      const {data,error:userError} = await db.auth.admin.getUserById(a.owner_user_id);
      if (userError) throw new Error("Could not load respondent identity");
      Object.assign(base,{email:data.user?.email ?? "",company:a.company,line_of_business:a.line_of_business});
    }
    if (kind === "respondents") {rows.push({...base,created_at:a.created_at});continue;}
    if (kind === "results") {
      const {data:r,error:re} = await db.from("assessment_results").select("id,overall_weighted_score,maturity,final_package,lowest_domain,strongest_domain,confidence_score,confidence_level,assessment_disposition,recommended_deep_dive,recommendation_explanation").eq("assessment_id",a.id).maybeSingle();
      if (re) throw new Error("Could not load results");
      if (!r) continue;
      const {data:recommendations,error:recError} = await db.from("recommendations").select("title,description,rationale,expected_outcome").eq("assessment_result_id",r.id).order("sort_order");
      if (recError) throw new Error("Could not load recommendations");
      const {id,...result} = r; void id;
      rows.push({...base,...result,recommendations});
    } else {
      const {data:answers,error:ae} = await db.from("assessment_responses").select("question_code,domain_code,score").eq("assessment_id",a.id).order("question_code");
      if (ae) throw new Error("Could not load answers");
      // Prefer the configuration tied to the assessment; label legacy fallback explicitly.
      const {data:config} = await db.from("industry_configuration").select("definition").eq("id",a.industry_configuration_id).maybeSingle();
      const stored = config?.definition as unknown as LegacyAssessmentData | undefined;
      const questions = stored?.domains?.flatMap(d=>d.questions) ?? fallback;
      for (const answer of answers ?? []) {
        const question = questions.find(q=>q.id===answer.question_code);
        const anchor = question?.anchors?.[a.healthcare_archetype]?.[String(answer.score) as "1"|"2"|"3"];
        rows.push({...base,question_code:answer.question_code,domain:answer.domain_code,question:question?.question ?? "Question text unavailable",score:answer.score,selected_answer:anchor ?? "Answer text unavailable",question_source:stored?.domains ? "Assessment configuration" : "Current question library (legacy fallback)"});
      }
    }
  }
  return { rows, totalAssessments:count ?? 0, page, hasMore:(page+1)*50<(count??0) };
}
