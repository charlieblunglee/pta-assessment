# Specification traceability

Authoritative source: `HIMAP-Program-Technology-Profile-Assessment-Enhancement-Specification-Revised-Scoring.pdf`.

| Requirement | Implementation |
|---|---|
| Yellow/Green/Blue = 1/2/3 | `calculateQuestionScore()` |
| Raw domain score 7-21 | `calculateDomainRawScore()` and database constraints |
| Normalization 7→20, 14→60, 21→100 | `normalizeDomainScore()` and unit tests |
| Incomplete is Not Scored, never zero | discriminated `DomainResult`, review gate, unit tests, nullable DB scores |
| Weighted program score | `calculateProgramScore()` |
| P1-P5 maturity and package boundaries | centralized `config.ts`, `getMaturityBand()`, `getBasePackage()` |
| Ordered domain overrides | `evaluateDomainOverrides()` |
| Healthcare governance caps | `evaluateHealthcareGovernanceCaps()` |
| Final package | `determineFinalPackage()` |
| Lowest/strongest domain | `determineLowestDomain()`, `determineStrongestDomain()` |
| Evidence confidence | `calculateAssessmentConfidence()` |
| Further-analysis decision | `evaluateFurtherAnalysis()` |
| Explainability object | `buildRecommendationExplanation()` |
| Executive/mobile assessment UX | `src/components/assessment-experience.tsx`, `src/app/globals.css` |
| Normalized Supabase schema and RLS | `supabase/migrations/202608140001_initial_production_schema.sql` |
| Generated TypeScript DB types | `src/lib/database.types.ts` |
| Seed/test data | `supabase/seed.sql` |
| Database tests | `supabase/tests/schema_test.sql` |
| Server-only email provider | `src/server/email/provider.ts` |
| Recalculated, whitelisted result email | `src/app/api/email-results/route.ts` |
| Distributed production rate limit | `src/server/rate-limit.ts` |
| Environment documentation | `.env.example` |

## Outstanding production gates

- Run the dependency-backed quality gates after npm registry access is available.
- Generate `src/lib/database.types.ts` again from the target Supabase project after migrations are applied.
- Connect authenticated persistence and delivery logging to the selected Supabase environments.
- Complete stakeholder validation of all question wording and solution-catalog descriptions.
- Complete automated browser accessibility and device checks.
- Deploy Preview, conduct UAT, then promote the same commit to Production.
