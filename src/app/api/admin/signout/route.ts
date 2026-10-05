import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sameOrigin } from "@/server/admin/access";
export async function POST(request:Request){if(!sameOrigin(request))return new Response("Forbidden",{status:403});await (await createSupabaseServerClient()).auth.signOut();return NextResponse.redirect(new URL("/admin",request.url),303);}
