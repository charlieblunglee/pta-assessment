"use client";

import { useState } from "react";
import { AssessmentExperience } from "@/components/assessment-experience";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthenticatedAssessment({ initialEmail }: { initialEmail: string | null }) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  if (initialEmail) return <AssessmentExperience authenticatedEmail={initialEmail} />;

  const sendLink = async (event: React.FormEvent) => {
    event.preventDefault(); setStatus("sending");
    try {
      const supabase = createSupabaseBrowserClient();
      const base = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, "");
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${base}/auth/confirm?next=/` } });
      if (error) throw error; setStatus("sent");
    } catch { setStatus("error"); }
  };

  return <><header className="site-header"><img src="/concentrix-logo.png" alt="Concentrix"/><span>HIMAP Program Technology Profile</span></header><main id="main" className="shell"><section className="panel narrow"><p className="eyebrow">Secure assessment access</p><h1>Sign in to begin or resume</h1><p className="lead">Enter your work email. We will send a secure, one-time sign-in link—no password required.</p><form onSubmit={sendLink}><label htmlFor="sign-in-email">Work email</label><input id="sign-in-email" type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)}/><div className="button-row"><button className="button" disabled={status==="sending"}>{status==="sending"?"Sending link…":"Email me a sign-in link"}</button></div></form>{status==="sent"&&<div className="notice" role="status"><strong>Check your inbox.</strong><br/>Open the link from this same browser to continue. The link expires and can only be used once.</div>}{status==="error"&&<p className="error" role="alert">We could not send the sign-in link. Confirm the email address and try again.</p>}</section></main></>;
}
