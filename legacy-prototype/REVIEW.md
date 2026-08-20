# Flow & framework review

A candid assessment of the prototype as it stands, plus what I changed. The scoring
engine is genuinely well-built — this is mostly about production-readiness, not rescue work.

## What's strong

**Architecture.** For a no-build vanilla app, the separation of concerns is excellent:
questionnaire data (`assessment-data.js`), tunable rules (`config.js`), a pure scoring
engine (`engine.js`), solution catalogs (`solutions.js`), and the UI/workflow (`app.js`)
are cleanly split. You can change scoring thresholds or add questions without touching UI code.

**The engine is deterministic and tested.** `tests.mjs` covers the package bands, the
domain override rules, the healthcare governance caps, the confidence model, the
further-analysis triggers, and catalog isolation — and it passes. That's rare in a prototype
and it's the part you'd most want to trust.

**The business logic is thoughtful.** Weighted domains, a D4 (data foundation) override, a
broad-foundation-gap override, a work-execution cap, Tech-Led qualification, the P5/D5
constraint, the D4-Q5 privacy cap, and the Clinical/HIM D5-Q2 AI-governance cap all layer
sensibly. The evidence-driven confidence score and "disposition" (recommendation ready vs.
deep-dive required) add real credibility.

**Security & privacy instincts are present.** User-supplied text is HTML-escaped, the
prototype records only a filename (no upload), there are clear PHI/confidentiality notices,
and the email payload is a strict whitelist of executive fields.

**Accessibility baseline is real.** Skip link, focus moves to `<main>` on navigation, an
`aria-live` toast, required radio choices, visible focus, high contrast, and reduced-motion
support.

## Issues and risks (ordered by priority)

1. **No real backend yet — the app is entirely client-side.** State lives in `localStorage`
   and scoring runs in the browser, which means results can be tampered with and nothing is
   stored centrally. This is fine for a pilot, but for a real assessment you should recompute
   the score on a trusted server (the Supabase schema and hosting guide set you up for this).

2. **Missing files on upload — now handled.** The `assets/` and `api/` folders came through
   empty, so there was no logo (broken image) and the "Email My Results" endpoint didn't
   exist (guaranteed 404). Fixed: the header now falls back to a clean "Concentrix" wordmark
   if the logo PNG is absent, and I wrote `api/email-results.js`.

3. **Admin gate is cosmetic.** The `change-me` password is hardcoded in `app.js`, so anyone
   can read it. Keep it for the local prototype, but the production admin route must rely on
   the database role (`profiles.role = 'admin'`), never a client-side password. The Supabase
   policies already enforce this server-side.

4. **Completeness isn't enforced before scoring.** You can reach the review screen with a
   domain incomplete; unanswered questions score as 0 and silently drag the result down.
   Recommend disabling "Generate executive results" until all 42 are answered (a small change
   in `review()`).

5. **Hard-coded question count.** `app.js` assumes exactly 42 questions and treats index 41
   as the last. If the questionnaire length ever changes, the progress bar, "Question x of 7,"
   and the final-step check break. Derive these from the data instead of literals.

6. **Draft persistence is single-browser.** Saved drafts don't survive clearing the browser
   and don't sync across devices — expected for a prototype, resolved once Supabase is wired in.

7. **Email rate limiting is single-instance.** The limiter I included protects one server
   instance. For a public launch, swap in a distributed limiter (Upstash / Vercel KV).

8. **Minor:** `scrollTo({behavior:'smooth'})` ignores the reduced-motion preference; and the
   app assumes its global data files loaded successfully with no error boundary.

9. **Branding & compliance are gating, not optional.** Using the real Concentrix logo needs
   written approval, and any real healthcare data pulls in HIPAA / Philippine Data Privacy Act
   / data-residency obligations. Validate before going live with real respondents.

## What I changed in this pass

- Rewrote `styles.css` as a proper enterprise design system (typography scale, spacing rhythm,
  refined navy/teal palette, depth, and a responsive results scorecard) — same class names, so
  no logic changed.
- Added Inter / Inter Tight web fonts and a logo wordmark fallback in `index.html`.
- Added a stepped progress rail in the header and a radial score gauge on the results screen
  (`app.js`) — purely presentational additions; the engine and its tests are untouched and
  still pass.
- Created the missing `api/email-results.js` (Resend + rate limiting, approved fields only)
  and a `vercel.json` with sensible security headers.
