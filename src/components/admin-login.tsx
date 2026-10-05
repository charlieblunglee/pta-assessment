"use client";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLogin() {
  const [email,setEmail]=useState(""); const [code,setCode]=useState(""); const [sent,setSent]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function submit(event:React.FormEvent) {
    event.preventDefault();setBusy(true);setError("");
    try {
      const auth=createSupabaseBrowserClient().auth;
      if (sent) {
        const {error}=await auth.verifyOtp({email:email.trim(),token:code,type:"email"});
        if(error) throw error;
        window.location.assign("/admin");
      } else {
        const {error}=await auth.signInWithOtp({email:email.trim()});
        if(error) throw error;setSent(true);
      }
    } catch {setError(sent?"The code is invalid or expired. Request a new code and retry.":"Could not send a code. Check your email and wait a minute before retrying.");}
    finally{setBusy(false);}
  }
  return <section className="panel narrow"><p className="eyebrow">Restricted administration</p><h1>HIMAP Assessment ADMIN</h1><p>Sign in with your authorized email. Access to each data page is controlled by the owner.</p><form onSubmit={submit}><label htmlFor="admin-email">Email</label><input id="admin-email" type="email" autoComplete="email" required value={email} disabled={sent||busy} onChange={e=>setEmail(e.target.value)}/>{sent&&<><label htmlFor="admin-code">Verification code</label><input id="admin-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}" maxLength={8} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,8))}/><p>Check your inbox and spam folder, then enter the complete code.</p></>}<div className="button-row"><button className="button" disabled={busy}>{busy?"Please wait…":sent?"Verify and sign in":"Email me a code"}</button>{sent&&<button className="button secondary" type="button" onClick={()=>{setSent(false);setCode("");}}>Request another code</button>}</div></form>{error&&<p role="alert" className="error">{error}</p>}</section>;
}
