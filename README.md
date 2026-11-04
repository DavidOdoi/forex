# Devin Forex — Lovable design rebuild

This project reproduces the user-provided `forex-pathway-compass.zip` design in Next.js App Router for the existing Vercel project. The source’s hero image, fonts, colours, layout, ticker, and calculator formulas are retained. Unsupported hands-on testing claims, fabricated broker ratings, and recommendation badges have since been removed at the user’s request. The previous editorial design remains recoverable in Git history.

## Run locally

Use Node.js 24 (minimum supported version: 20.9) and npm. From the repository root:

```sh
npm ci
npm run dev
```

Production: `npm run build`, then `npm start`. The default port is 3000.

## Pages from the export

- `/`: hero, ticker, broker cards, three-step section, FAQs
- `/best-brokers`: unverified broker examples and comparison preview; no rankings or ratings
- `/reviews`: research previews and verification checklists; no completed reviews or ratings
- `/tools`: pip value, position size, and profit calculators
- `/insights`: six original coming-soon content cards
- `/about`: publication purpose, planned research, commercial disclosures, and contact copy
- `/find-my-broker`: three-question preference demonstration using explicitly unverified data
- Custom 404, plus technical `/robots.txt` and `/sitemap.xml` routes

## Source fidelity and boundaries

The supplied export is the content and visual reference, not an independent source of verified financial research. Regulation claims, fees, minimum deposits, leverage, payment-method flags, the contact email, and market ticker figures came from the export without independent verification. Discovery cards use entity-dependent placeholders; sourced financial terms belong to the individual research pages. Numerical ratings, recommendation badges, fabricated pros/cons, hands-on testing claims, and the invented company backstory have been removed; research is described as planned work. The ticker contains static sample figures, not a live data feed. Broker cards link to internal research pages rather than placeholder referral links. Insight cards remain non-navigating “Coming soon” cards. The search/profile icons remain decorative as in the source. No contact delivery, account system, market-data service, or publishing service is connected.

The original calculators assume USD-quoted pairs and a $10 pip value for one standard lot; they do not model financing, commission, conversion, spread, or slippage. The quiz sorts only the supplied, unverified preference flags and labels its output an illustrative match. It does not use numerical ratings and is not a suitability assessment or broker recommendation. Verify all publication claims and configure actual destinations separately before treating this as researched broker coverage.

## Technical adaptations

- TanStack route declarations were replaced with Next.js page metadata and App Router pages.
- The stateful calculator and quiz use client boundaries. The quiz no longer uses unsupported ratings to break ties.
- Header navigation uses Next.js links and active-route detection. Dropdowns also support keyboard focus without changing their default appearance.
- Instrument Serif and Manrope are served locally with the same font weights as the export, avoiding runtime Google Fonts requests.
- The original hero image and favicon are included. The hero uses Next.js Image without image recompression, preserving the supplied JPEG.
- Original CSS tokens and Tailwind classes are retained; reduced-motion support stops the ticker for users requesting reduced motion.
- The export’s build-specific plugins, error-reporting hooks, unused UI library, and project metadata are not required by this Next.js implementation.
- `vercel.json` explicitly selects Next.js, preventing the earlier “Other” framework preset problem.
- Existing security headers are retained.

## Metadata and deployment

No credentials are required. `src/lib/site.ts` centralizes the user-confirmed public origin, with `SITE_URL` as an override. Canonicals remain absolute even before production indexing is enabled. Without `SITE_URL`, base pages remain noindex and the sitemap is empty. Robots allows crawling so page-level noindex directives can be read. With production indexing enabled, the sitemap includes the seven public routes plus only reviews whose publication requirements pass. Vercel previews remain noindex.

The GitHub-connected Vercel project can build `main` with the Next.js preset, repository root as the Root Directory, `npm ci` for installation, and `npm run build` for building. Leave the Output Directory override off. Add a domain under Vercel Settings → Domains and follow the DNS instructions Vercel provides; set `SITE_URL` for Production only after confirming the public origin.

## Validation

```sh
npm run typecheck
npm run lint
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test
```

If system Chromium is unavailable, install a supported browser with `npx playwright install chromium`, then omit the executable-path variable. Browser downloads require access to their download domains.

Seven foundation browser tests cover every exported route, metadata, image loading, navigation/dropdowns, the comparison table, broker research destinations, calculator values, quiz progression/reset, FAQs, reduced motion, 404, robots, sitemap, and layout overflow at 320, 390, 768, 1024, and 1440 pixels. Screenshots are written to ignored `test-results/`. Before the subsequent research-status copy changes, the rebuilt pages were compared against locally rendered original export components at 1440px and 390px; all fourteen comparisons matched page dimensions with only very small pixel-rendering differences. For domain-specific metadata checks, supply the same `SITE_URL` at build and test time. Tests do not validate the source’s financial claims or measure live Core Web Vitals.

## File map

- `src/app/`: seven page routes, shared layout, source stylesheet, metadata endpoints, and custom 404.
- `src/components/site-header.tsx`: original header, footer, and inner-page hero.
- `src/components/broker-card.tsx`: original broker-card presentation.
- `src/components/tools-content.tsx`, `find-my-broker-content.tsx`: stateful exported pages.
- `src/lib/brokers.ts`: broker discovery labels and illustrative quiz preferences.
- `src/lib/site.ts`: public origin, indexability, and route list.
- `src/assets/hero-fx-light.jpg`, `public/favicon.ico`: supplied visual assets.
- `tests/foundation.spec.ts`, `playwright.config.ts`: production browser checks.

## Populated broker research and reusable template

`/reviews/template` opens the populated international Exness overview, with Global as the default scope. `/reviews/template?blank=1` preserves the original empty layout, and `/reviews/template/data` still downloads the blank reusable JSON. The reference supplied by the user informs layout only; its prose, ratings, author identities and testing claims are not copied.

`/reviews` is a searchable, paginated catalogue of **all 325 directory entries**: 298 retail brokers, 14 institutional/professional providers, 12 interbank providers and one introducing provider. Every entry has a page using the shared review layout. Non-retail profiles adapt the questions to service access, commercial pricing and settlement, and do not display retail account-opening actions. CSV classifications remain unverified research leads. A server-rendered A–Z index links every entry, even without JavaScript. Source-only drafts show bounded quotations, retrieval dates, links and unresolved checks. Missing evidence is not converted into fees, scores, country eligibility or recommendations.

`/reviews/[slug]?country=Country` renders a separate entity profile where available. The default is a global overview. Optional entity profiles include the UK, Australia, Cyprus, Seychelles, Singapore, the UAE, Mauritius, Belize, Curaçao, the BVI and the Cayman Islands. This identifies researched entities, not every country in which a group accepts clients. An unsupported country returns 404 rather than silently reusing another country's facts. Country leads from the CSV are labelled unverified.

- `src/lib/reviews/global.ts`: international account facts, entity disclosures and additional sourced Exness pros/cons.
- `src/lib/reviews/curated.ts`: older regional research retained for audit; it no longer sets public review defaults.
- `src/lib/reviews/international.ts`: separately attributed international entity disclosures. Provider-reported permissions are not described as independent register checks.
- `src/data/review-research.json`: bounded saved-source catalogue; raw HTML/PDF snapshots and full extracted text stay ignored.
- `src/lib/reviews/catalog.ts`: country selection and source-backed data binding to the existing reusable review component.
- `/reviews/[slug]/data?country=Country`: downloadable populated review plus separately labelled unverified research material.

All individual research drafts and JSON downloads are **noindex** and excluded from the sitemap. They carry no invented author credentials, fact-checker identities, numerical ratings or claims of hands-on testing. Exness uses the user-supplied author name David Odoi, linked to a truthful process profile; his biography and editorial approval remain outstanding. A source check is not independent editorial approval. Account terms and conflicting source wording still require review before a complete review can be published. Each populated field links to its source record and carries entity, country and check date. The data guards check internal consistency; they do not independently prove a source's truth.

The five account-opening placements now use prominent gold buttons with black labels and hover/focus states. Exness’s global example links to its official registration URL, as found on the public international account page. This is a non-affiliate destination and may be active in a research draft when its source/scope metadata matches. Affiliate destinations still require a published review and matching verified metadata. Other unconfigured destinations remain inactive. Affiliate anchors preserve partner parameters, use `rel="sponsored nofollow noopener noreferrer"` and disclose compensation. No click tracking is sent.

The original blank-template interactions remain available at `?blank=1`. Populated pages use a table-first review flow: a three-sentence verdict directly below the H1, a nine-cell facts grid, pros/cons, account tiers, fees, withdrawals, safety, platforms, FAQs and linked sources. A left contents menu becomes a collapsible drawer on mobile. Main review text uses system fonts at a minimum of 16px, with a white background and black text; warning boxes use a light grey accent. Empty field tables and repeated findings are omitted. Five compact account placements remain, with disclosures and disabled-state explanations.

`src/lib/reviews/digest.ts` selects whole evidence-backed findings within an editorial word budget. Country-specific short summaries retain charge exceptions, provider attribution and unresolved source conflicts. It never cuts a sentence to meet the cap. The full research record and JSON download remain unchanged. Invalid/unsupported facts stay withheld. The browser suite checks every current broker/country variant against the **1,800-word maximum**, counting hidden FAQ/dialog text and the shared navigation/footer too.

`src/lib/reviews/seo.ts` supplies country-specific titles, descriptions, canonical URLs, social metadata and breadcrumb structured data. Country parameters are preserved. Unfinished reviews stay noindex, with internal-link following allowed; the template stays noindex/nofollow. The five-star graphic is explicitly labelled Not rated until supported scoring data exists. No assumed 4.8 rating is assigned. FAQPage schema includes only sourced, visible answers; an unverified execution-model answer is excluded. Automatic Product/Review-star markup is not emitted for broker research. Article schema requires the complete publication contract, a real author/profile, explicit publication/update dates and recorded editorial approval. A status flag alone does not enable indexing or Article markup. Useful links lead to the research method on `/about`, the broker directory, comparisons, calculators and primary external documents. These improvements do not guarantee a ranking.

```sh
npm run typecheck
npm run lint
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test
.venv-research/bin/python -m unittest discover -s tools/research -p 'test_*.py'
```

The browser suite covers the original site, blank format, populated example, citations, five account placements, country isolation, unsupported-country responses, JSON evidence records, all 325 identities, source/status filters, pagination and responsive layouts. These checks do not measure factual accuracy or guarantee a search-engine outcome.

[tools/research/README.md](tools/research/README.md) documents optional future collection and offline catalogue export. The current website can render the saved material without running a scraper.


## Standalone HTML review example

`/templates/exness-review.html` is a single self-contained document with embedded CSS and JSON-LD, inline SVGs, responsive tables, native FAQ/contents controls and no framework runtime or external font/style dependencies. It is the sourced **global Exness overview**; international advertised terms are distinguished from country/entity eligibility and protections. It remains noindex/nofollow and is visibly labelled a demonstration. Minimum deposits preserve regional conditions; ratings are not assigned. A download link appears in the matching Exness review.

To regenerate it after reviewing changes, build and start the local production server, then run:

```sh
node tools/export-review-html.mjs 'http://127.0.0.1:3100/reviews/exness' public/templates/exness-review.html
```

The exporter reads only the local rendered review. It removes the framework runtime, makes internal links absolute, fixes the exported country selection, and converts controls to native HTML. It does not fetch broker websites. The complete structured research JSON remains available separately.


## Global scope and customer feedback

The site header uses a global language marker, and local payment/currency branding has been removed from public discovery pages, the quiz, the template and default review scopes. Global profiles use international sources; they do not relabel old regional fees as worldwide terms. Historical regional records stay in the private research archive rather than public default pages.

Pros and cons include short evidence-linked explanations. Relevant labels and account names link directly to their official documents, while the sources section retains full references. The Exness account figures were read from international Standard/Pro pages; regulation and platform disclosures are separately linked. The minimum-first-deposit guidance was checked in the official Help Center on November 4, 2026: Standard depends on payment method and region; Pro, Zero and Raw Spread start at US$200, with regional requirements and payment-method limits applying. The table, quick fact, caution and JSON record retain these qualifiers and link to the official explanation. Earlier source checks retain their original dates. Group entities and any non-retail restrictions are listed explicitly.

Trustpilot disallows this research bot through robots.txt, so no Trustpilot score, review count or sentiment summary was collected. The customer-feedback section links to a broker-specific Trustpilot search with descriptive text and asks readers to match the company website. `customerReviews.rating`, `reviewCount` and `checkedAt` remain null. Third-party customer opinions are not used as an editorial score or inserted as aggregate-rating schema. No access control or crawl restriction was bypassed.


## On-page review audit implementation

[docs/exness-onpage-audit.md](docs/exness-onpage-audit.md) maps the supplied audit to the source changes and outstanding publication requirements. The [source ledger](docs/research/exness-source-checks-2026-11-04.json) records public-document retrieval dates, hashes and limitations.

The Exness review includes a hypothetical round-trip trading-cost illustration, per-side/round-trip commission, documented MT4/MT5 compatibility, inactivity/reactivation fees, conditional swap-free terms, separate withdrawal stages and links to existing alternative entity profiles. It retains five account actions, white/black styling and the 1,800-word ceiling. The browser word budget includes collapsed content and shared navigation. No live trading, withdrawal performance, original research images or Core Web Vitals results are claimed.

`src/lib/reviews/publication.ts` requires an accountable author biography/profile, core evidence matching the review scope, explicit dates and approval of the latest substantive update. Provider/source checks are distinct from approval. `publication.updatedAt` is manually recorded; builds do not refresh it. David Odoi's name was supplied by the user; no biography, credentials, reviewer, approval or publication date was invented. A confirmed public contact channel and remaining independent licence checks are also needed before launch.

`tests/onpage-seo.spec.ts` covers publication/indexing eligibility, sitemap filtering, canonical metadata, schema without assumed broker review stars, server rendering without JavaScript, heading/anchor consistency, visible FAQ equivalence, demonstrations and navigation targets. Existing suites cover source isolation, all review word counts, calculators, account links and responsive layouts.


## CSV-wide template and linking rollout

The original [325-entry CSV](data/forex-broker-directory-2026-11-02.csv) is retained for reproducible identity checks. [docs/directory-rollout.md](docs/directory-rollout.md) records the scope and limitations. The catalogue exporter now includes all provider queues with explicit classifications; it does not promote candidate URLs or CSV assertions into verified financial fields. Existing retail source snapshots and curated Exness facts are retained.

Every retail entry uses the shared article layout, five account placements, source/status handling, author accountability, a clearly hypothetical cost illustration and related research links. Missing evidence remains unset. Provider profiles adapt retail-specific wording and omit retail signup actions. Every draft stays noindex until its own publication requirements pass.

`relatedReviewLinks` supplies three existing destinations per profile, favouring neighbouring entries within the same directory classification and shared separately sourced entity profiles. Each non-singleton provider group has reciprocal neighbour links; the A–Z index connects all 325 pages directly to the directory. Country parameters are retained only where a matching entity profile exists. These are research-navigation links, not recommendations or resident-eligibility claims.

The directory supports provider-type and research-status filters. New browser checks validate all identities, every related destination, incoming links, the complete no-JavaScript index, provider-specific limitations and mobile navigation. Python tests compare the tracked catalogue against the original CSV and verify that institutional leads are retained without being classified as collected evidence.
