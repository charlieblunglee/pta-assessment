import { NextResponse } from "next/server";
import { excelWorkbook } from "@/server/admin/excel";
import { adminAccess, type Permission } from "@/server/admin/access";
import { adminRows } from "@/server/admin/data";

export const dynamic = "force-dynamic";
export async function GET(request:Request) {
  const access = await adminAccess();
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") as Permission;
  if (!access || !["respondents","results","answers"].includes(kind) || !access.permissions[kind]) return NextResponse.json({error:"Access denied"},{status:403});
  const page = Number(url.searchParams.get("page") ?? 0);
  const id = url.searchParams.get("assessmentId") ?? undefined;
  if (!Number.isInteger(page)||page<0|| (id && !/^[a-f0-9-]{36}$/i.test(id))) return NextResponse.json({error:"Invalid request"},{status:400});
  try {
    const data = await adminRows(kind,access.permissions.respondents,page,id);
    if (url.searchParams.get("download") !== "1") return NextResponse.json(data,{headers:{"Cache-Control":"private, no-store"}});
    const bytes = excelWorkbook(data.rows);
    return new Response(new Uint8Array(bytes),{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":`attachment; filename="himap-${kind}-page-${page+1}.xlsx"`,"Cache-Control":"private, no-store"}});
  } catch {return NextResponse.json({error:"Could not load admin data. Please retry."},{status:500});}
}
