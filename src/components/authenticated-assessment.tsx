"use client";

import { useState } from "react";
import { AssessmentExperience } from "@/components/assessment-experience";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthenticatedAssessment({ initialEmail }: { initialEmail: string | null }) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [code, setCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [signedInEmail, setSignedInEmail] = useState(initialEmail);
  const [verificationError, setVerificationError] = useState("");
  const [verifying, setVerifying] = useState(false);
  if (signedInEmail) return <AssessmentExperience authenticatedEmail={signedInEmail} />;

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setVerifying(true); setVerificationError("");
    try {
      const { data, error } = await createSupabaseBrowserClient().auth.verifyOtp({ email: pendingEmail, token: code, type: "email" });
      if (error || !data.session || !data.user?.email) throw error ?? new Error("Missing session");
      setSignedInEmail(data.user.email);
    } catch { setVerificationError("This code is invalid or has expired. Enter the latest code or request a new one."); }
    finally { setVerifying(false); }
  };

  const sendLink = async (event: React.FormEvent) => {
    event.preventDefault(); setStatus("sending");
    try {
      const supabase = createSupabaseBrowserClient();
      const base = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, "");
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${base}/auth/confirm?next=/` } });
      if (error) throw error; setPendingEmail(email.trim()); setCode(""); setStatus("sent");
    } catch { setStatus("error"); }
  };

  return <><header className="site-header"><img src="/concentrix-logo.png" alt="Concentrix"/><span>HIMAP Program Technology Profile</span></header><main id="main" className="shell"><section className="panel narrow">
    <p className="eyebrow">Secure assessment access</p><h1>Sign in to begin or resume</h1>
    <p className="lead">Enter your email. We will send a verification code. No password required.</p>
    <form onSubmit={sendLink}>
      <label htmlFor="sign-in-email">Email address</label>
      <input id="sign-in-email" type="email" autoComplete="email" required value={email} disabled={verifying || status === "sending"} onChange={event => { setEmail(event.target.value); setPendingEmail(""); setCode(""); setStatus("idle"); setVerificationError(""); }}/>
      <div className="button-row"><button className="button" disabled={status === "sending" || verifying}>{status === "sending" ? "Sending code…" : pendingEmail ? "Send a new code" : "Email me a verification code"}</button></div>
    </form>
    {pendingEmail && <>
      <div className="notice" role="status">Check your inbox or spam folder for the code sent to {pendingEmail}. You can read the email on any device and enter the code here.</div>
      <form onSubmit={verifyCode}>
        <label htmlFor="sign-in-code">Verification code (enter all digits)</label>
        <input id="sign-in-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}" maxLength={8} required value={code} disabled={verifying || status === "sending"} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 8))}/>
        <div className="button-row"><button className="button" disabled={verifying || status === "sending" || !/^[0-9]{6,8}$/.test(code)}>{verifying ? "Verifying…" : "Verify and continue"}</button></div>
      </form>
    </>}
    {status === "error" && <p className="error" role="alert">We could not send your code. Check your email address and try again. If you just requested a code, wait one minute before retrying.</p>}
    {verificationError && <p className="error" role="alert">{verificationError}</p>}
  </section></main></>;
}
