import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAccess, OWNER_EMAIL, sameOrigin } from "@/server/admin/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export async function GET() {
  const access = await adminAccess();
  if (!access?.owner) return NextResponse.json({error:"Owner access required"},{status:403});
  const { data, error } = await createSupabaseAdminClient().from("admin_access").select("email,respondents,results,answers,updated_at").order("email");
  if (error) return NextResponse.json({error:"Could not load access"},{status:500});
  return NextResponse.json({ grants:data },{headers:{"Cache-Control":"private, no-store"}});
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({error:"Invalid origin"},{status:403});
  const access = await adminAccess();
  if (!access?.owner) return NextResponse.json({error:"Owner access required"},{status:403});
  const parsed = z.object({email:z.string().trim().email().max(254),respondents:z.boolean(),results:z.boolean(),answers:z.boolean()}).safeParse(await request.json().catch(()=>null));
  if (!parsed.success) return NextResponse.json({error:"Invalid access settings"},{status:400});
  const email = parsed.data.email.toLowerCase();
  if (email === OWNER_EMAIL) return NextResponse.json({error:"Owner access cannot be changed"},{status:400});
  const { error } = await createSupabaseAdminClient().from("admin_access").upsert({...parsed.data,email,updated_by:access.user.id,updated_at:new Date().toISOString()});
  return NextResponse.json(error ? {error:"Could not save access"} : {saved:true},{status:error?500:200});
}
