# Program Technology Profile Assessment — setup guide

This folder contains a working, responsive prototype. It runs on mobile and PC in a modern browser. The questionnaire and scoring rules come from the supplied Excel workbook.

## What is already built

- Email, company, and line-of-business entry
- Instructions with required acknowledgment
- Confidentiality, anonymized-research, and “do not upload PHI” notices
- Healthcare industry selection, with room for future industries
- Clinical, non-clinical, and HIM archetypes
- All 42 questions from six domains
- Yellow (1), Green (2), and Blue (3) scoring anchors specific to each archetype
- Optional artifact picker and evidence notes
- Weighted 0–100 result, profile, and P1–P5 package
- D4-Q5 privacy/security compliance cap and D5-Q2 Clinical/HIM governance cap
- CSV summary download
- Prototype admin page for adding future-industry drafts
- Keyboard-friendly controls, visible focus, high contrast, responsive layout, and reduced-motion support

## Step 1 — try the prototype on your PC

1. Open this folder.
2. Double-click `index.html`.
3. Complete the assessment in your browser.
4. To test the prototype Admin page, choose **Admin** and use password `change-me`.

The prototype saves drafts only in that browser. The artifact picker records only a filename; it does not upload the file. This is intentional until secure backend storage is configured.

If your browser blocks local files, open PowerShell in this folder and run:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Step 2 — create the Supabase backend

Supabase is a good fit because it provides sign-in, a PostgreSQL database, private file storage, access rules, and an admin-friendly dashboard.

1. Go to `https://supabase.com`, create an account, and choose **New project**.
2. Choose a project name, strong database password, and a region appropriate for your data-residency requirements.
3. Wait for the project to finish provisioning.
4. In Supabase, open **SQL Editor**.
5. Open `supabase-schema.sql` from this folder, copy everything, paste it into SQL Editor, and choose **Run**.
6. Open **Authentication → Providers → Email**. Enable email sign-in. For a simple pilot, use one-time email links; for production, follow your company’s identity and security requirements.
7. Open **Storage**, create a bucket named `assessment-artifacts`, and keep it **private**.
8. Ask a technical administrator to add Storage policies that permit a signed-in user to access only paths beginning with that user’s ID. Admins may access all paths only when their `profiles.role` is `admin`.
9. Create your own account through the app, then use Supabase **Table Editor → profiles** to change your role from `respondent` to `admin`.
10. Never place the Supabase service-role key in browser code. The browser may use only the project URL and public anonymous/publishable key; database policies provide protection.

## Step 3 — connect this prototype to Supabase

This prototype deliberately works without a backend. For production, a developer should make these small connections:

1. Add the Supabase JavaScript client to `index.html`.
2. Replace the prototype sign-in form action with Supabase email authentication.
3. After sign-in, create or update the user’s row in `profiles` with the company name.
4. When the user acknowledges instructions, create an `assessments` row and store the acknowledgment timestamp.
5. Save each answer into the assessment’s `answers` JSON field, or create a separate answers table if detailed reporting is required.
6. Upload redacted artifacts to the private `assessment-artifacts` bucket and write only the storage path into `artifacts`.
7. On submission, recompute scoring on a trusted server function, save the score/package/cap fields, and mark the assessment `submitted`.
8. Replace the local prototype Admin screen with forms that manage `industries` and `questionnaires`. Publish only validated questionnaire versions.

The production admin route must rely on the database role, not the visible prototype password.

## Step 4 — publish for mobile and PC

The simplest hosting options are Vercel, Netlify, Cloudflare Pages, or your company’s approved web host.

1. Put this folder in a private Git repository.
2. Connect the repository to the hosting provider.
3. Set the publish directory to this folder and deploy it as a static site.
4. Add your custom domain, such as `assessment.yourcompany.com`.
5. Require HTTPS. All mainstream hosts enable it automatically.
6. In Supabase **Authentication → URL Configuration**, add the final site URL and allowed sign-in redirect URLs.
7. Test on a phone, tablet, and desktop before inviting users.

### Enable “Email My Results”

The app includes a server-side endpoint at `api/email-results.js`. It sends only the approved executive result fields; artifacts and evidence notes are never included.

1. Deploy on Vercel or adapt this endpoint to your approved serverless platform.
2. Create a Resend account and verify an organizational sending domain.
3. In the hosting provider’s encrypted environment-variable settings, add `RESEND_API_KEY` and `RESULTS_FROM_EMAIL`.
4. Redeploy the application.
5. Send test results to an internal mailbox and confirm the content with Privacy, Legal, and Information Security.
6. For a public production launch, replace the included single-instance rate limiter with your hosting platform’s distributed rate-limiting service and add monitoring.

Never add the email API key to `app.js`, HTML, or any browser-delivered file. Without server configuration, the app shows a safe delivery-error state and retains the completed assessment.

## Step 5 — production checklist

- Obtain written approval to use the Concentrix logo and branding.
- Have privacy, legal, security, and compliance teams review the disclaimer and data handling.
- Define data retention, deletion, breach response, and research anonymization procedures.
- Prohibit PHI uploads unless the entire architecture and agreements are approved for PHI.
- Set file-type and file-size limits; scan uploads for malware.
- Add audit logging, backups, monitoring, and an incident-response owner.
- Confirm applicable HIPAA, Philippine Data Privacy Act, contractual, and data-residency obligations.
- Test keyboard navigation, screen readers, zoom to 200%, mobile layouts, and color-independent labels.
- Conduct user acceptance testing with representatives from Clinical, Non-clinical, and HIM teams.
- Validate all scoring and package rules with the workbook owner before production launch.

## How the scoring works

Each domain has seven questions. Yellow = 1, Green = 2, and Blue = 3.

`domain score = (sum of seven answers − 7) / 14 × 100`

The program score is the weighted average:

- D1 10%
- D2 15%
- D3 15%
- D4 25%
- D5 20%
- D6 15%

Packages use these bands: P1 0–47, P2 48–61, P3 62–75, P4 76–89, and P5 90–100. If D4-Q5 is Yellow, the result is capped at Enhanced/P2. For Clinical and HIM, a Yellow D5-Q2 also applies the cap.

## Files in this folder

- `index.html` — app page
- `styles.css` — Concentrix-inspired responsive design
- `app.js` — workflow, calculations, admin prototype, and CSV export
- `assessment-data.js` — workbook-derived questionnaire data
- `config.js` — centralized domains, thresholds, confidence, governance, and deep-dive configuration
- `engine.js` — single recommendation, confidence, and further-analysis engine
- `solutions.js` — separate Non-Clinical, Clinical, and HIM P1–P5 catalogs
- `tests.mjs` — automated business-rule tests
- `api/email-results.js` — server-side, rate-limited email delivery abstraction
- `assets/concentrix-logo.png` — supplied logo image
- `supabase-schema.sql` — starter database and access policies
