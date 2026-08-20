import { AuthenticatedAssessment } from "@/components/authenticated-assessment";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <AuthenticatedAssessment initialEmail={user?.email ?? null} />;
}
