# HIMAP Program Technology Profile Assessment

Production-oriented Next.js and TypeScript implementation of the HIMAP executive healthcare technology diagnostic.

## Local development

1. Install Node.js 20 or later and pnpm.
2. Copy `.env.example` to `.env.local` and provide non-production values.
3. Run `pnpm install`.
4. Start local Supabase with `supabase start` and apply migrations with `supabase db reset`.
5. Run `pnpm dev`.

## Quality gates

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
supabase db lint
supabase test db
```

The calculation module under `src/domain/assessment` is the only authoritative source for maturity, package, override, governance-cap, confidence, and further-analysis decisions. Database rows store its results but do not replace it.

## Data handling

Do not enter or upload PHI. Evidence storage is private and optional. Evidence files and notes are never included in result emails. Server-only credentials must never use the `NEXT_PUBLIC_` prefix.

The original browser prototype remains at the repository root for migration traceability. Vercel deploys the Next.js application under `src/app`.
