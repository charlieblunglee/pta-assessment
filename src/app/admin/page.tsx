import { redirect } from "next/navigation";
import { adminAccess } from "@/server/admin/access";
import { AdminLogin } from "@/components/admin-login";
export default async function AdminHome() {
  const access=await adminAccess();
  if (!access) return <AdminLogin/>;
  if(access.owner) redirect("/admin/access");
  const first=(["respondents","results","answers"] as const).find(p=>access.permissions[p]);
  if(first) redirect(`/admin/${first}`);
  return <section className="panel"><h1>Access not granted</h1><p>Your email is verified, but you have not been granted admin data access. Please contact the assessment owner.</p></section>;
}
