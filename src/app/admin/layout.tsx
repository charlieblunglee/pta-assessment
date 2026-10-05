import Link from "next/link";
import { adminAccess } from "@/server/admin/access";
export const dynamic = "force-dynamic";
export const metadata={title:"HIMAP Assessment ADMIN"};
export default async function AdminLayout({children}:{children:React.ReactNode}) {
  const access=await adminAccess();
  return <><header className="site-header"><img src="/himap-email-logo.png" alt="HIMAP"/><span>HIMAP Assessment ADMIN</span></header><main id="main" className="shell">{access&&<><nav className="admin-nav" aria-label="Administration">{access.owner&&<Link href="/admin/access">Access management</Link>}{access.permissions.respondents&&<Link href="/admin/respondents">Respondents</Link>}{access.permissions.results&&<Link href="/admin/results">Results</Link>}{access.permissions.answers&&<Link href="/admin/answers">Answers</Link>}<form action="/api/admin/signout" method="post"><button className="button secondary">Sign out</button></form></nav><p className="admin-session">Signed in as {access.user.email}</p></>}{children}</main></>;
}
