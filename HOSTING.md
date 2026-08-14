# Foolproof hosting — step by step

Two tracks. **Track A** gets the app online today with zero backend (the fastest, most
reliable path). **Track B** adds the database and email once you're ready. Do A first;
add B later without redoing A.

---

## Track A — Put it online today (no backend, ~10 minutes)

The app runs as plain static files, so any static host works. Cloudflare Pages is used
here because it's free, fast, and doesn't need a credit card.

### A1. Get the files into a folder
Keep all of these together in one folder (this is your whole site):
`index.html`, `styles.css`, `app.js`, `assessment-data.js`, `config.js`, `solutions.js`,
`engine.js`, `vercel.json`, and the `assets/` and `api/` folders.

### A2. Put the folder in GitHub (recommended) — or skip to A3 for drag-and-drop
1. Create a free account at https://github.com and click **New repository**.
2. Name it (e.g. `pta-assessment`), keep it **Private**, click **Create**.
3. On the repo page, choose **uploading an existing file**, drag in everything from your
   folder, and **Commit changes**.

### A3. Deploy on Cloudflare Pages
1. Create a free account at https://dash.cloudflare.com.
2. In the sidebar choose **Workers & Pages → Create → Pages**.
3. **If you used GitHub:** choose **Connect to Git**, pick your repo, and on the build
   screen set **Framework preset: None**, leave **Build command empty**, and set
   **Build output directory** to `/` (the root). Click **Save and Deploy**.
   **If you skipped GitHub:** choose **Upload assets** instead and drag your folder in.
4. Wait ~1 minute. You'll get a live URL like `https://pta-assessment.pages.dev`.
5. Open it on a phone and a laptop to confirm it works. Done.

> On this track the "Email My Results" button will show a friendly "not configured" message
> — that's expected. Everything else (assessment, scoring, CSV, executive report download)
> works fully. Add email in Track B.

**Want a custom domain** (e.g. `assessment.yourcompany.com`)? In the Pages project go to
**Custom domains → Set up a domain**, type it, and follow the one DNS record it shows you.
HTTPS is automatic.

*(Vercel and Netlify work identically: import the repo, framework "Other/None," deploy.
The included `vercel.json` makes Vercel deploy correctly with no extra settings.)*

---

## Track B — Add the database + email (when you're ready)

### B1. Create the Supabase database (~15 minutes)
1. Sign up at https://supabase.com and click **New project**. Choose a name, a strong
   database password (save it), and a **region** that matches your data-residency rules.
2. Wait for it to finish provisioning.
3. Open **SQL Editor → New query**. Open `supabase-schema.sql` from your folder, copy
   **all** of it, paste, and click **Run**. This creates every table and the access rules.
4. Open **Authentication → Providers → Email** and enable it. For a pilot, "magic link"
   (one-time email link) sign-in is simplest.
5. Open **Storage → New bucket**, name it exactly `assessment-artifacts`, and keep it
   **Private**.
6. From **Project Settings → API**, copy two values you'll need later: the **Project URL**
   and the **anon/public key**. Never copy or use the *service-role* key in the browser.

### B2. Make yourself an admin
1. Sign in through the app once (this creates your user).
2. In Supabase open **Table Editor → profiles**, find your row, and change `role` from
   `respondent` to `admin`. That's what unlocks admin features safely — no passwords.

### B3. Turn on "Email My Results" (~10 minutes)
The endpoint is already written (`api/email-results.js`); it just needs a sender and a key.
Email needs a serverless host, so deploy this track on **Vercel** (it runs the `api/` folder
automatically).

1. Sign up at https://resend.com, then **Add domain** and verify your organization's sending
   domain (Resend shows you the exact DNS records to add).
2. Sign up at https://vercel.com, click **Add New → Project**, and import the same GitHub repo.
   Framework preset **Other**, no build command. Deploy.
3. In the Vercel project: **Settings → Environment Variables**, add two (mark them for
   Production):
   - `RESEND_API_KEY` = your Resend API key (starts with `re_`)
   - `RESULTS_FROM_EMAIL` = `Assessment <assessment@yourdomain.com>`
4. Click **Redeploy**. Send a test to an internal mailbox and confirm the content with
   Privacy, Legal, and Information Security before wider use.

### B4. Point Supabase at your live site
In Supabase **Authentication → URL Configuration**, add your final site URL and the allowed
sign-in redirect URLs. Otherwise magic-link sign-in will be rejected.

---

## What "foolproof" means here — the guardrails

- **Only the public keys ever touch the browser.** The Supabase *service-role* key and the
  Resend key live only in server settings. The included endpoint reads the Resend key from an
  environment variable and never returns it.
- **The database enforces access, not the UI.** Row-level security in `supabase-schema.sql`
  means a signed-in user can only read their own assessments, and admin-only tables are locked
  to `role = 'admin'` server-side — so a tampered browser can't get around it.
- **No PHI, by design.** The prototype uploads no files, the email sends only approved
  executive fields, and the storage bucket is private. Keep it that way unless the full
  architecture and agreements are approved for PHI.
- **Failures degrade safely.** If email isn't configured, the app keeps the finished
  assessment on screen and shows a clear message instead of losing anything.

## Quick decision guide

| You want… | Use |
|---|---|
| Online today, simplest possible | **Track A** on Cloudflare Pages (drag-and-drop) |
| Online + a real login and stored results | **Track A** + **Track B** database on Vercel |
| The "Email My Results" button to work | **Track B** on Vercel (needs the `api/` function) |
| A custom company domain | Any host's **Custom domain** step + one DNS record |
