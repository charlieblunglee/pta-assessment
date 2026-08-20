# Vercel and Supabase deployment

## Environments

Use isolated Development, Preview, and Production configuration. Prefer separate Supabase projects for production and non-production. Never expose production service-role or email credentials to Preview deployments.

## Required Vercel variables

See `.env.example`. Configure public Supabase variables for all environments using the matching project. Configure the service-role key, Brevo API key, sender identity, and Upstash variables as encrypted server-only values. Postmark and Resend remain optional alternatives.

## Release sequence

1. Create the Supabase environment and run migrations in order.
2. Run `supabase db lint` and `supabase test db`.
3. Generate database types from the migrated project and confirm there is no unexpected diff.
4. Import the GitHub repository into Vercel using the Next.js preset.
5. Configure environment variables and Supabase Auth redirect URLs.
6. Deploy Preview and run the full verification matrix.
7. Obtain business, privacy, security, and accessibility approval.
8. Promote the verified commit to Production.

## Verification matrix

- Welcome, organization, track, confidentiality, assessment, review, results, recommendation, further-analysis, and admin routes.
- Exactly six domains and 42 questions, including all three archetype anchors.
- Raw 7/14/21 normalize to 20/60/100.
- Incomplete domains and assessments show Not Scored.
- Every P1-P5 boundary, domain override, and healthcare governance cap.
- Confidence thresholds and further-analysis triggers.
- CSV export, printable executive report, and email results.
- Owner-only access and authorized administrator access.
- Evidence isolation and exclusion from email.
- Keyboard-only navigation, visible focus, semantic labels, 200% zoom, reduced motion, screen readers, and automated accessibility checks.
- Mobile widths 320/375/390/430 px, tablet widths 768/1024 px, and desktop widths 1280/1440 px.

No production URL should be published until every required check has a recorded pass or an approved exception.
