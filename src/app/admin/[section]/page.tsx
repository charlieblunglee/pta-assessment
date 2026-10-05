import { redirect, notFound } from "next/navigation";
import { adminAccess, type Permission } from "@/server/admin/access";
import { adminRows } from "@/server/admin/data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminAccessForm } from "@/components/admin-access-form";
import { AdminNotificationRetry } from "@/components/admin-notification-retry";
import { AdminCleanup } from "@/components/admin-cleanup";

export default async function AdminSection({params,searchParams}:{params:Promise<{section:string}>;searchParams:Promise<{page?:string;assessmentId?:string}>}) {
  const {section}=await params; const search=await searchParams;
  if(!["access","respondents","results","answers"].includes(section)) notFound();
  const access=await adminAccess(); if(!access) redirect("/admin");
  if(section==="access") {
    if(!access.owner) return <section className="panel"><h1>Access denied</h1><p>Only the owner can manage permissions.</p></section>;
    const {data,error}=await createSupabaseAdminClient().from("admin_access").select("email,respondents,results,answers").order("email");
    if(error) throw new Error("Could not load access settings");
    return <section className="panel"><p className="eyebrow">Owner only</p><h1>Access management</h1><AdminAccessForm grants={data??[]}/><AdminNotificationRetry/><AdminCleanup/></section>;
  }
  const kind=section as Permission;
  if(!access.permissions[kind]) return <section className="panel"><h1>Access denied</h1><p>You have not been granted access to this data.</p></section>;
  const page=Number(search.page??0); if(!Number.isInteger(page)||page<0) notFound();
  const id=search.assessmentId; if(id&&!/^[a-f0-9-]{36}$/i.test(id)) notFound();
  const data=await adminRows(kind,access.permissions.respondents,page,id);
  const query=new URLSearchParams({kind,page:String(page),download:"1"});if(id)query.set("assessmentId",id);
  return <section className="panel"><p className="eyebrow">Authorized data only</p><h1>{section.charAt(0).toUpperCase()+section.slice(1)}</h1><p>{data.totalAssessments} assessments · Page {page+1}. Downloads contain this page (up to 50 assessments). Select an assessment to download only its data.</p>{!access.permissions.respondents&&<div className="notice">Respondent identity is hidden under your current permissions. Assessment references are used instead.</div>}<a className="button admin-download" href={`/api/admin/data?${query}`}>Download this page in Excel</a>{id&&<p><a href={`/admin/${section}`}>Show all assessments</a></p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr>{Object.keys(data.rows[0]??{}).map(k=><th key={k}>{k.replaceAll("_"," ")}</th>)}<th>Download</th></tr></thead><tbody>{data.rows.map((row,i)=><tr key={i}>{Object.entries(row).map(([key,value])=><td key={key}>{typeof value==="object"&&value!==null?<pre>{JSON.stringify(value,null,2)}</pre>:String(value??"—")}</td>)}<td><a href={`/admin/${kind}?assessmentId=${row.assessment_id}`}>Select assessment</a></td></tr>)}</tbody></table></div>{!data.rows.length&&<p>No records to display.</p>}<div className="button-row">{page>0&&<a href={`/admin/${kind}?page=${page-1}`}>Previous page</a>}{data.hasMore&&<a href={`/admin/${kind}?page=${page+1}`}>Next page</a>}</div><p className="landing-note">Keep exports confidential. Access revocation blocks future viewing and downloads; it cannot recall files already downloaded.</p></section>;
}
