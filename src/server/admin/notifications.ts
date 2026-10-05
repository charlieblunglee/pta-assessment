import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getEmailProvider } from "@/server/email/provider";

export async function deliverSubmissionNotification(assessmentId:string) {
  const db=createSupabaseAdminClient();
  const {data,error}=await db.from("submission_notifications").update({status:"sending",attempted_at:new Date().toISOString()}).eq("assessment_id",assessmentId).in("status",["queued","failed"]).select("assessment_id").maybeSingle();
  if(error||!data)return false;
  try {
    await getEmailProvider().send({to:"techandinnovationcouncil@himap.ph",subject:"HIMAP: a new assessment has been submitted",html:`<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f8f9fd;color:#20243a"><div style="max-width:600px;margin:auto;background:white;padding:28px;border-top:4px solid #ffce00"><img src="https://himap-pi.vercel.app/himap-email-logo.png" width="220" alt="HIMAP"/><h1 style="color:#1010a8;font-size:24px">New assessment submitted</h1><p>A respondent has completed and submitted a HIMAP Technology Profile Assessment.</p><p>Assessment reference: ${assessmentId}</p><p>Sign in to HIMAP Assessment ADMIN to view the information your account is authorized to access.</p><p style="font-size:12px">This notification intentionally excludes respondent identities, answers, and results.</p><img src="https://himap-pi.vercel.app/powered-by-concentrix.png" width="150" alt="Powered by Concentrix"/></div></body></html>`});
    await db.from("submission_notifications").update({status:"sent",sent_at:new Date().toISOString()}).eq("assessment_id",assessmentId);
    return true;
  }catch{await db.from("submission_notifications").update({status:"failed"}).eq("assessment_id",assessmentId);return false;}
}
