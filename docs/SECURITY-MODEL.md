# Security model

## Identity and authorization

Supabase Auth is the identity provider. Assessment access is owner-scoped by default. Organization administrators can access assessments only in organizations where they hold an authorized membership. Platform administration is represented separately and cannot be granted through respondent-facing policies.

All application tables use Row Level Security. Calculated domain rows, assessment results, recommendations, and email delivery logs are read-only to authenticated browser sessions and are written only by trusted server code.

## Evidence

Evidence is optional and must not contain PHI. The `assessment-evidence` bucket is private, limits files to 10 MiB, and permits PDF, PNG, JPEG, and plain text. Object paths are owner and assessment scoped. Metadata includes scan state and a checksum field; production upload publication must remain disabled until malware scanning is connected.

Evidence files and free-form evidence notes are excluded from email payloads and reports. Signed links must be short-lived and issued only after server authorization.

## Secrets

Only the Supabase URL and publishable browser key may use the `NEXT_PUBLIC_` prefix. Supabase service-role credentials, Brevo/Postmark/Resend credentials, and rate-limit tokens are server-only Vercel environment variables. Preview must not reuse production secrets.

## Email

The email route validates inputs, enforces 42 answers, recalculates results through the authoritative module, strips evidence notes, excludes artifacts, and sends a fixed whitelist of executive fields. Production fails closed when distributed rate limiting is not configured. Delivery logs must contain status metadata only, not content.

## Operational requirements

- HTTPS and HSTS on the production domain.
- Content Security Policy and anti-framing headers.
- Secret and dependency scanning in CI.
- Point-in-time database recovery and tested restoration.
- Explicit retention and deletion schedules.
- Audit monitoring for role changes and evidence access.
- Privacy, Legal, Information Security, and healthcare governance approval before launch.
