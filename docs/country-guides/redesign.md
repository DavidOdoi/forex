# Country-guide visual redesign

Reference: the BrokerChooser Japan page supplied by the user as a saved HTML file. It was inspected locally with its JavaScript disabled and external requests blocked. Its original embedded styling could be rendered; no competitor scripts, fonts, photos, logos, broker claims, rankings, ratings, author credentials, sponsorships or freshness claims are imported into the application.

## Implemented layout

- Full-width pale slate title band with compact breadcrumbs and an actual commercial-disclosure anchor.
- Existing author identity, rendered with initials instead of an invented portrait. The byline keeps the pending legal-review state and labels the dossier date as reported research, not a publication or expert-review date.
- Sticky section navigation with working overflow controls, native anchor links and active-section tracking. Header and rail dimensions are observed so linked headings remain below the sticky elements. Native horizontal scrolling and links remain usable without JavaScript.
- Two-column research overview with five actual evidence questions and a methodology link. These are explicitly labelled as evidence checks, not broker rankings; no unsupported broker list or scores were added.
- Compact legal-status notice before the overview; the full sourced legal summary, supplied-research provenance and all substantive article sections remain available in the initial HTML.
- Main article with a right-side sticky research-status and contents panel, responsive full-contents disclosure and existing native FAQ accordions.
- Existing Manrope typography and Devin Forex identity retained. Body copy, source status, quotes and dates remain distinct and readable. No new dependency, data fetch, tracking collector or external image asset was introduced.

The country remains draft/noindex with commercial links disabled. Legal, editorial, source-verification, affiliate and country/entity safeguards are unchanged. The only editorial copy adjustment is a shorter direct answer carrying the same pending-review and unresolved-eligibility meaning; the detailed research remains intact.

## Files

- `src/components/country-guides/country-guide.tsx`: reusable page structure and research overview.
- `src/components/country-guides/section-nav.tsx`: lightweight interactive rail, overflow controls, sizing and active-section behavior.
- `src/app/forex-brokers/country-guides.css`: guide-scoped visual layout, responsive rules and reduced-motion behavior. Existing country-index and comparison styles remain available.
- `src/lib/country-guides/sri-lanka-dossier.ts`: concise direct answer; no legal conclusion or approval changed.
- `tests/country-guide-design.spec.ts`: functional sticky navigation, visible anchor landing, overflow controls, keyboard interaction, responsive checks and screenshots.
- Existing screenshot helpers suppress sticky layers during element-only captures; assertions about research, approvals, indexing and commercial links remain intact.

## Verification and release

- TypeScript, ESLint and the production build pass.
- The browser regression suite passes all 46 tests, covering the new navigation and responsive layout alongside country-guide safeguards, research provenance, crawlability, site navigation and existing broker reviews. The affiliate checks exercise 51 independent failure conditions.
- Desktop and mobile screenshots were inspected. Responsive checks cover 320, 390, 768 and 1440 pixels; keyboard navigation, heading visibility below the sticky header, horizontal controls and active-section tracking are exercised.
- `git diff --check` passes. No new dependencies were installed.

The user authorized the redesign and previously requested the guide on the live site. Release uses the feature branch and production `main` branch, retaining the research-draft state. The existing Vercel integration handles deployment; external live-site verification is blocked by this environment's network policy.
