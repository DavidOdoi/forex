# Devin Forex — Lovable design rebuild

This project uses the user-provided `forex-pathway-compass.zip` design in Next.js App Router for the existing Vercel project. The source’s hero image, fonts, colours, layout and ticker form the original foundation. The footer, editorial pages and calculators have since been improved at the user’s request. Unsupported hands-on testing claims, fabricated broker ratings and recommendation badges have been removed. Previous designs remain recoverable in Git history.

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
- `/tools`: hub for four forex calculator pages, with existing calculator fragment targets preserved
- `/tools/forex-calculator`: profit, pip value, position size and risk tabs
- `/tools/forex-profit-calculator`: buy/sell P&L with commission and swap adjustments
- `/tools/forex-position-size-calculator`: cash/percentage risk and rounded lot sizes
- `/tools/forex-compounding-calculator`: hypothetical growth/loss scenarios, chart, breakdown and CSV
- `/insights`: ten published trading guides, a companion reading list, and source-credited images
- `/about`: publication purpose, planned research, commercial disclosures, and contact copy
- `/find-my-broker`: three-question preference demonstration using explicitly unverified data
- Custom 404, plus technical `/robots.txt` and `/sitemap.xml` routes

## Source fidelity and boundaries

The supplied export is the content and visual reference, not an independent source of verified financial research. Regulation claims, fees, minimum deposits, leverage, payment-method flags, the contact email, and market ticker figures came from the export without independent verification. Discovery cards use entity-dependent placeholders; sourced financial terms belong to the individual research pages. Numerical ratings, recommendation badges, fabricated pros/cons, hands-on testing claims, and the invented company backstory have been removed; research is described as planned work. The ticker contains static sample figures, not a live data feed. Broker cards link to internal research pages rather than placeholder referral links. Insight cards now link to published educational guides. The search/profile icons remain decorative as in the source. No contact delivery, account system or market-data service is connected; article publication uses static App Router content.

The calculators now support 28 forex pairs and eight account currencies, JPY pip conventions, manual bid/ask conversions and configurable contracts. Prices are manual or explicitly illustrative; no live feed is connected. Profit estimates use execution prices and optional entered commission/swaps. Stop-loss sizing excludes slippage, gaps and costs; margin and liquidation are not modelled. The quiz sorts only supplied, unverified preference flags and labels its output an illustrative match. It is not a suitability assessment or broker recommendation. Verify all publication claims and configure actual destinations separately before treating this as researched broker coverage.

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

No credentials are required. `src/lib/site.ts` centralizes the user-confirmed public origin, with `SITE_URL` as an override. Canonicals remain absolute even before production indexing is enabled. Without `SITE_URL`, the original base pages remain noindex. The user-authorised Insights guides use the confirmed production origin and can be indexed without that optional override. The sitemap includes the Insights library and eleven article/resource URLs; with `SITE_URL` set, it also includes the original public routes plus only broker reviews whose separate publication requirements pass. Robots allows crawling so page-level directives can be read. Vercel previews remain noindex.

The GitHub-connected Vercel project can build `main` with the Next.js preset, repository root as the Root Directory, `npm ci` for installation, and `npm run build` for building. Leave the Output Directory override off. Add a domain under Vercel Settings → Domains and follow the DNS instructions Vercel provides; set `SITE_URL` for Production only after confirming the public origin.

## Validation

```sh
npm run typecheck
npm run lint
npm run audit:insights
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test
```

If system Chromium is unavailable, install a supported browser with `npx playwright install chromium`, then omit the executable-path variable. Browser downloads require access to their download domains.

Foundation browser checks cover the original routes, metadata, image loading, navigation/dropdowns, the comparison table, broker research destinations, calculator discovery, quiz progression/reset, FAQs, reduced motion, 404, robots, sitemap, and layout overflow at 320, 390, 768, 1024, and 1440 pixels. Separate calculator checks cover financial formulas and input behaviour. Screenshots are written to ignored `test-results/`. Before the subsequent research-status copy changes, the rebuilt pages were compared against locally rendered original export components at 1440px and 390px; all fourteen comparisons matched page dimensions with only very small pixel-rendering differences. For domain-specific metadata checks, supply the same `SITE_URL` at build and test time. Tests do not measure live Core Web Vitals.

## File map

- `src/app/`: seven page routes, shared layout, source stylesheet, metadata endpoints, and custom 404.
- `src/components/site-header.tsx`: accessible desktop navigation, mobile dialog drawer and inner-page hero.
- `src/components/brand-logo.tsx`: shared supplied brand artwork for the header, drawer and footer.
- `src/components/site-footer.tsx`: shared server-rendered footer, with scoped styles in `site-footer.module.css`.
- `src/components/broker-card.tsx`: original broker-card presentation.
- `src/components/find-my-broker-content.tsx`: stateful broker-finder flow.
- `src/components/calculators/`: calculator controls, responsive layouts, educational page renderer and local SVG chart.
- `src/lib/calculators/`: financial functions, per-page content, metadata and structured data.
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

`src/lib/reviews/digest.ts` selects whole evidence-backed findings within an editorial word budget. Country-specific short summaries retain charge exceptions, provider attribution and unresolved source conflicts. It never cuts a sentence to meet the cap. The full research record and JSON download remain unchanged. Invalid/unsupported facts stay withheld. The browser suite checks every current broker/country variant against the **1,800-word maximum**, counting the complete review in `main`, including hidden FAQ/dialog text, review navigation and sources. Shared site navigation and the global footer are outside the article budget.

`src/lib/reviews/seo.ts` supplies country-specific titles, descriptions, canonical URLs, social metadata and breadcrumb structured data. Country parameters are preserved. Unfinished reviews stay noindex, with internal-link following allowed; the template stays noindex/nofollow. The five-star graphic is explicitly labelled Not rated until supported scoring data exists. No assumed 4.8 rating is assigned. FAQPage schema includes only sourced, visible answers; an unverified execution-model answer is excluded. Automatic Product/Review-star markup is not emitted for broker research. Article schema requires the complete publication contract, a real author/profile, explicit publication/update dates and recorded editorial approval. A status flag alone does not enable indexing or Article markup. Useful links lead to the research method on `/about`, the broker directory, comparisons, calculators and primary external documents. These improvements do not guarantee a ranking.

```sh
npm run typecheck
npm run lint
npm run audit:insights
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

The site is presented for an international audience without country/language selector labels in the header or footer. Local payment/currency branding has been removed from public discovery pages, the quiz, the template and default review scopes. Global profiles use international sources; they do not relabel old regional fees as worldwide terms. Historical regional records stay in the private research archive rather than public default pages.

Pros and cons include short evidence-linked explanations. Relevant labels and account names link directly to their official documents, while the sources section retains full references. The Exness account figures were read from international Standard/Pro pages; regulation and platform disclosures are separately linked. The minimum-first-deposit guidance was checked in the official Help Center on November 4, 2026: Standard depends on payment method and region; Pro, Zero and Raw Spread start at US$200, with regional requirements and payment-method limits applying. The table, quick fact, caution and JSON record retain these qualifiers and link to the official explanation. Earlier source checks retain their original dates. Group entities and any non-retail restrictions are listed explicitly.

Trustpilot disallows this research bot through robots.txt, so no Trustpilot score, review count or sentiment summary was collected. The customer-feedback section links to a broker-specific Trustpilot search with descriptive text and asks readers to match the company website. `customerReviews.rating`, `reviewCount` and `checkedAt` remain null. Third-party customer opinions are not used as an editorial score or inserted as aggregate-rating schema. No access control or crawl restriction was bypassed.


## On-page review audit implementation

[docs/exness-onpage-audit.md](docs/exness-onpage-audit.md) maps the supplied audit to the source changes and outstanding publication requirements. The [source ledger](docs/research/exness-source-checks-2026-11-04.json) records public-document retrieval dates, hashes and limitations.

The Exness review includes a hypothetical round-trip trading-cost illustration, per-side/round-trip commission, documented MT4/MT5 compatibility, inactivity/reactivation fees, conditional swap-free terms, separate withdrawal stages and links to existing alternative entity profiles. It retains five account actions, white/black styling and the 1,800-word ceiling. The browser word budget includes collapsed content and review navigation. No live trading, withdrawal performance, original research images or Core Web Vitals results are claimed.

`src/lib/reviews/publication.ts` requires an accountable author biography/profile, core evidence matching the review scope, explicit dates and approval of the latest substantive update. Provider/source checks are distinct from approval. `publication.updatedAt` is manually recorded; builds do not refresh it. David Odoi's name was supplied by the user; no biography, credentials, reviewer, approval or publication date was invented. A confirmed public contact channel and remaining independent licence checks are also needed before launch.

`tests/onpage-seo.spec.ts` covers publication/indexing eligibility, sitemap filtering, canonical metadata, schema without assumed broker review stars, server rendering without JavaScript, heading/anchor consistency, visible FAQ equivalence, demonstrations and navigation targets. Existing suites cover source isolation, all review word counts, calculators, account links and responsive layouts.


## CSV-wide template and linking rollout

The original [325-entry CSV](data/forex-broker-directory-2026-11-02.csv) is retained for reproducible identity checks. [docs/directory-rollout.md](docs/directory-rollout.md) records the scope and limitations. The catalogue exporter now includes all provider queues with explicit classifications; it does not promote candidate URLs or CSV assertions into verified financial fields. Existing retail source snapshots and curated Exness facts are retained.

Every retail entry uses the shared article layout, five account placements, source/status handling, author accountability, a clearly hypothetical cost illustration and related research links. Missing evidence remains unset. Provider profiles adapt retail-specific wording and omit retail signup actions. Every draft stays noindex until its own publication requirements pass.

`relatedReviewLinks` supplies three existing destinations per profile, favouring neighbouring entries within the same directory classification and shared separately sourced entity profiles. Each non-singleton provider group has reciprocal neighbour links; the A–Z index connects all 325 pages directly to the directory. Country parameters are retained only where a matching entity profile exists. These are research-navigation links, not recommendations or resident-eligibility claims.

The directory supports provider-type and research-status filters. New browser checks validate all identities, every related destination, incoming links, the complete no-JavaScript index, provider-specific limitations and mobile navigation. Python tests compare the tracked catalogue against the original CSV and verify that institutional leads are retained without being classified as collected evidence.

## Published Insights library — 6 November 2026

The user explicitly authorised publishing the original ten prepared educational guides. `/insights` lists the growing library by topic, each at `/insights/<slug>`. The indicator guide links to the shorter `/insights/best-swing-trading-books` companion resource. All contextual links resolve to real site routes. `/insights/image-credits` preserves the creators, source pages, licences and format-change records for the bundled WebP assets and their article placements.

`src/data/insights/` contains typed static content; `src/lib/insights/` provides the catalogue and metadata/schema helpers. Server components render semantic headings, prose, tables and image figures. Article text remains available without client JavaScript. Each guide includes three brief matching FAQ answers, publication dates, the named author, research-based selection limitations and the original sources. The imported prose is rendered as React elements; no article HTML is executed.

The article pages use a white background, readable black text, desktop sticky contents and a mobile contents drawer. Next.js serves the locally bundled images, with eager loading for the featured image and lazy loading for inline images. Image attribution links are separate from the three editorial citations. Article/Breadcrumb/FAQ schema uses the actual publication record, without product ratings or invented testing claims. Public source preparation dates remain separate from the publication date.

These guides have a publication path separate from broker-review research. Existing broker draft status and review publication safeguards are retained. The publication record and article/source/image ledgers are in `docs/content/`. A factual author-role biography replaces draft-only editorial instructions; no professional credentials or firsthand test results were added.

`tests/insights.spec.ts` checks the full guide set, source links, licence records and asset hashes; validates the word budgets and FAQs; loads every article without site JavaScript; checks canonical/indexing/schema output; exercises internal links, the reading resource, sitemap isolation and responsive layouts. Use the normal lint/typecheck/build and Playwright commands above.

## SEO checklist and reading experience — 6 November 2026

The latest instruction sets a hard 1,800-word ceiling and asks for enjoyable, direct writing. All ten guides now start with a short introduction followed immediately by a **Quick answer** section: a direct answer and three key points. Mobile contents follow that answer, so navigation does not delay it. Simpler headings, short lists, a latency-budget table and labelled examples help readers scan the supporting explanation. Existing section IDs remain stable when headings are shortened.

Focus phrases stay near the start of the title tag, in the URL, description, introduction, a subheading and an accurate image alt. Titles use descriptive benefit language and remain within 65 characters, with optional branding when space permits. The source and image-credit links remain intact. The Article schema now reflects the visible summary, word count and actual modification date; original publication dates are preserved.

Run `npm run audit:insights` to refresh the [SEO/readability report](docs/content/insights-seo-audit-2026-11-06.md). Its word count includes the answer card, headings, lists, tables, captions, image credits, FAQs, biography and disclaimer. Navigation, bylines and duplicate schema are excluded. The check enforces the maximum, not an arbitrary ranking-related minimum. The earlier 2,500-word suggestion was superseded and no expansion was applied.

Exact-phrase density is reported as an informational metric, not forced to 1–1.5%. Google specifies no preferred word count and warns against unnatural repetition. Rank Math is a WordPress plugin; this Next.js project does not claim a plugin score or guaranteed rankings. The supplied references and Google guidance were retrieved successfully and are recorded in the [reference ledger](docs/content/insights-seo-reference-checks-2026-11-06.json).

## Contextual anchors, tables and uniform type — 6 November 2026

Every guide’s Quick answer includes a compact two-column summary table. The tables, relevant names and concepts use actual internal or external anchors, including official platform help and manufacturer specifications. The link styling is underlined by default and does not rely on hover or colour. Editorial anchor definitions are applied to explicit phrases on the server; the visible wording remains intact. Existing comparison rows and selected FAQ names also retain contextual links.

Each guide now has exactly three FAQ answers, generally 25–30 words each, with matching FAQPage schema. Twenty-nine longer prose paragraphs were split at natural sentence boundaries without splitting an existing link. The full article count, including summary tables and image credits, remains below 1,800 words.

The shared reading size is 18px across prose, bullets, examples, table headers/cells, captions and FAQ answers, on desktop and mobile. Headings retain their hierarchy; navigation and publication details remain secondary. Summary tables use flexible compact columns so the first comparison is readable on narrow screens without requiring the detailed-table layout.

`tests/insights.spec.ts` now exercises the actual anchor destinations, visible default underlines, internal fragment navigation, three FAQ records, summary tables and computed 18px body text. `npm run audit:insights` validates all contextual link targets and records per-guide link counts, table presence and concise FAQs. New cTrader help destinations were confirmed from the official help centre and recorded in `docs/content/insights-anchor-source-checks-2026-11-06.json`.

## Shared footer — 6 November 2026

The footer uses a black background, light text and gold accents with a serif closing statement, broker-research and insights actions, four groups of real navigation links and separate risk/commercial disclosures. Its gold primary action uses dark text for contrast. Review-page styling applies its white palette to the header without overriding the shared black footer. Main footer copy and navigation links use 18px type. The responsive layout uses four navigation columns on desktop and two on smaller screens. A native back-to-top link targets `body#site-top` and requires no client script. The footer is a server component; its styles are scoped to avoid changing article layouts.

All footer destinations point to existing routes or sections. No social accounts, subscription forms, contact addresses or policy pages are invented. The review word-limit check measures review content, including collapsed text and source citations, rather than the shared site footer.


## USDC, Ethereum and transfer guides — 6 November 2026

The learning library now includes 14 guides plus the short books resource. The new `/insights/usdc-vs-ethereum-sending-money` comparison uses the supplied content brief selectively, following the user’s later instruction. It is 1,474 words including tables, captions, FAQs, biography and disclaimer. Three supporting guides cover `/insights/how-to-send-usdc`, `/insights/ethereum-gas-fees-explained` and `/insights/crypto-wallet-security-guide`. Each has three short FAQs, matching schema and contextual links to the other guides. `/usdc-vs-ethereum-sending-money` permanently redirects to the canonical Insights page.

The comparison distinguishes USDC, ETH and the Ethereum network. It qualifies the ordinary ETH-gas rule using Circle’s current Paymaster documentation, separates inclusion/finality from provider cash-out timing, explains native versus bridged token checks and labels all numerical payment examples as hypothetical. The retrieved Circle reserve descriptions are attributed rather than presented as our own audit. No live transfer test, professional biography or credentials are invented.

The [source ledger](docs/content/usdc-ethereum-source-checks-2026-11-06.json) records successful primary documentation plus blocked/unavailable candidates. Blocked material was not collected or used as verified evidence. The library now contains 20 credited local images in 34 placements. The four new guides use one relevant image each; the initial ten retain three. All body copy retains the existing white/black 18px layout. Optional per-article SEO titles allow a concise search title alongside a reader-oriented H1.


## Brand, navigation and broker finder — 6 November 2026

The supplied bull/bear DEVINFOREX artwork is prepared as a transparent 23KB local WebP. The shared logo appears in the opaque white header and mobile drawer; the black footer uses a light version through CSS inversion. Header navigation uses darker, larger text, current-section styling, explicit disclosure buttons and working category links. Placeholder search/account icons and country/language labels are removed.

Desktop dropdowns support pointer, touch and keyboard interaction, including Arrow Down and Escape. Mobile navigation uses a native modal dialog with focus containment, Escape/close/backdrop handling, restored scrolling and automatic closure when navigating or switching to a desktop viewport. Both header and drawer have direct Find my broker links.

The existing three-question finder retains its clearly labelled illustrative matching. Progress, previous-question navigation, focus/scroll handling, restart and full-directory access improve the flow; no broker suitability, verified preference claims or country eligibility is invented. Browser checks cover desktop and mobile entry points, navigation controls and all eight answer combinations.
