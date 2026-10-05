import { NextResponse } from "next/server";
import { adminAccess,sameOrigin } from "@/server/admin/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { deliverSubmissionNotification } from "@/server/admin/notifications";
export async function POST(request:Request){
  if(!sameOrigin(request)||!(await adminAccess())?.owner)return NextResponse.json({error:"Owner required"},{status:403});
  const db=createSupabaseAdminClient();
  await db.from("submission_notifications").update({status:"failed"}).eq("status","sending").lt("attempted_at",new Date(Date.now()-600000).toISOString());
  const {data,error}=await db.from("submission_notifications").select("assessment_id").in("status",["queued","failed"]).limit(10);
  if(error)return NextResponse.json({error:"Could not load notification queue"},{status:500});
  const sent=await Promise.all((data??[]).map(n=>deliverSubmissionNotification(n.assessment_id)));
  return NextResponse.json({sent:sent.filter(Boolean).length,failed:sent.filter(x=>!x).length});
}
