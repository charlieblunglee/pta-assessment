import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAccess,sameOrigin } from "@/server/admin/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic="force-dynamic";
export async function GET(request:Request){
  if(!(await adminAccess())?.owner)return NextResponse.json({error:"Owner access required"},{status:403});
  const page=Number(new URL(request.url).searchParams.get("page")??0);
  if(!Number.isInteger(page)||page<0)return NextResponse.json({error:"Invalid page"},{status:400});
  const {data,error,count}=await createSupabaseAdminClient().from("assessments").select("id,company,line_of_business,status,created_at,updated_at",{count:"exact"}).order("created_at",{ascending:false}).order("id").range(page*20,page*20+19);
  if(error)return NextResponse.json({error:"Could not load assessments"},{status:500});
  return NextResponse.json({assessments:data,hasMore:(page+1)*20<(count??0)},{headers:{"Cache-Control":"private, no-store"}});
}
export async function DELETE(request:Request){
  if(!sameOrigin(request)||!(await adminAccess())?.owner)return NextResponse.json({error:"Owner access required"},{status:403});
  const parsed=z.object({assessmentId:z.string().uuid(),confirmation:z.string(),updatedAt:z.string().datetime({offset:true})}).safeParse(await request.json().catch(()=>null));
  if(!parsed.success||parsed.data.confirmation!==parsed.data.assessmentId)return NextResponse.json({error:"Type the exact assessment reference to confirm"},{status:400});
  const {data,error}=await createSupabaseAdminClient().rpc("delete_assessment_admin",{target_id:parsed.data.assessmentId,expected_updated_at:parsed.data.updatedAt});
  if(error){
    const messages:Record<string,string>={ASSESSMENT_NOT_FOUND:"This assessment no longer exists.",ASSESSMENT_CHANGED:"This assessment changed. Refresh the list before deleting.",EVIDENCE_CLEANUP_REQUIRED:"This assessment has stored evidence. Secure file cleanup is required before deletion.",NOTIFICATION_IN_PROGRESS:"A notification is being sent. Wait a moment and retry."};
    const key=Object.keys(messages).find(k=>error.message.includes(k));
    return NextResponse.json({error:key?messages[key]:"Could not delete the assessment. No partial deletion was committed."},{status:key==="ASSESSMENT_NOT_FOUND"?404:key?409:500});
  }
  return NextResponse.json({deleted:data,accountPreserved:true});
}
