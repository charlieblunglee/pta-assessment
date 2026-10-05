import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const OWNER_EMAIL = "meeyam0103@gmail.com";
export type Permission = "respondents" | "results" | "answers";
export async function adminAccess() {
  const client = await createSupabaseServerClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user?.email || !user.email_confirmed_at) return null;
  const email = user.email.toLowerCase();
  const owner = email === OWNER_EMAIL;
  if (owner) return { user, owner, permissions: { respondents:true, results:true, answers:true } };
  const { data, error: permissionError } = await createSupabaseAdminClient().from("admin_access").select("respondents,results,answers").eq("email",email).maybeSingle();
  if (permissionError) throw new Error("Could not verify admin permissions");
  return { user, owner, permissions: data ?? { respondents:false, results:false, answers:false } };
}
export function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}
