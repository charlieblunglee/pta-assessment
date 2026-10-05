# HIMAP Assessment ADMIN deployment

The admin app is a separate Vercel project built from this repository. Do not change ADMIN_APP on the existing respondent project.

1. Import charlieblunglee/pta-assessment into a NEW Vercel project named himap-assessment-admin, using Next.js and the main branch.
2. Set ADMIN_APP=true on the new project only.
3. Configure NEXT_PUBLIC_SUPABASE_URL for project vwyejoetdnqovzcqyedj and its matching NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Configure SUPABASE_SERVICE_ROLE_KEY server-side only. Use the same configured HIMAP database credentials; never commit or paste them into chat.
4. Configure EMAIL_PROVIDER=brevo and BREVO_API_KEY to enable notification retries. Sender techandinnovationcouncil@himap.ph must be verified in Brevo. The respondent app needs this code update to dispatch alerts after submission.
5. Deploy, then sign in with meeyam0103@gmail.com. Only this verified email can manage access. Other verified emails need explicit per-page grants.
6. Verify denied access with an ungranted account; grant one permission, verify other pages AND /api/admin/data are denied, then revoke and retry. Export permissions are checked on each request.

Downloads are real .xlsx files, one page of up to 50 assessments or one selected assessment. Exact saved scores are exported with selected answer text. If the original question configuration is absent, the current library is used and explicitly labeled as a legacy fallback. No evidence notes/artifacts are exposed to delegated users.

Notifications: database trigger queues NEW submitted assessments, including submissions from the existing site. This release sends after the submission response and logs failures; the owner can retry pending/failed alerts on Access management. Delivery is at-least-once; an interrupted delivery may result in a duplicate. Existing completed assessments are not back-notified.

The admin site does not change respondent permissions or grant database organization-admin roles. Access is enforced by verified server auth and server-only grants, independent of editable user metadata. Direct browser access to grants/queue is revoked and RLS enabled. Exports already downloaded cannot be recalled.
