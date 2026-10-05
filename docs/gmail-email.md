# Google Workspace results email

Verification-code email remains configured in Supabase. Results email and submission notifications use the server email provider.

After deploying this change, configure the Vercel **himap** project in Production:

- `EMAIL_PROVIDER`: Config, value `gmail`.
- `GMAIL_APP_PASSWORD`: Secret, the Google-generated app password for `techandinnovationcouncil@himap.ph`. Never use the normal account password or a NEXT_PUBLIC variable.

Redeploy after saving both values. For admin notification retries to use the same provider, add these values to **himap-assessment-admin** and redeploy it too. Leave Brevo credentials available for rollback; set EMAIL_PROVIDER back to brevo to roll back.

Use the app to send your own results and confirm actual receipt. SMTP acceptance does not guarantee inbox placement. Google Workspace sending quotas and administrator restrictions apply. A separate app password is recommended; revoking a password shared with Supabase also stops verification email.
