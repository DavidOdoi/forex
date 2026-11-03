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

The supplied export is the content and visual reference, not an independent source of verified financial research. Regulation claims, fees, minimum deposits, leverage, payment-method flags, the contact email, and market ticker figures came from the export without independent verification. Current broker details are explicitly labelled unverified. Numerical ratings, recommendation badges, fabricated pros/cons, hands-on testing claims, and the invented company backstory have been removed; research is described as planned work. The ticker contains static sample figures, not a live data feed. Broker destinations remain `#` exactly as supplied; they are not configured referral links. Insight cards remain non-navigating “Coming soon” cards. The search/profile icons remain decorative as in the source. No contact delivery, account system, market-data service, or publishing service is connected.

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

No credentials are required. Set optional `SITE_URL` to the confirmed public HTTPS origin without a path, then rebuild. Without it, canonical URLs are omitted, robots blocks indexing, and sitemap entries remain empty instead of using a fabricated domain. A configured domain populates exactly the seven real public pages. Vercel previews remain noindex.

The GitHub-connected Vercel project can build `main` with the Next.js preset, repository root as the Root Directory, `npm ci` for installation, and `npm run build` for building. Leave the Output Directory override off. Add a domain under Vercel Settings → Domains and follow the DNS instructions Vercel provides; set `SITE_URL` for Production only after confirming the public origin.

## Validation

```sh
npm run typecheck
npm run lint
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test
```

If system Chromium is unavailable, install a supported browser with `npx playwright install chromium`, then omit the executable-path variable. Browser downloads require access to their download domains.

Seven browser tests cover every exported route, metadata, image loading, navigation/dropdowns, the comparison table, original placeholder destinations, calculator values, quiz progression/reset, FAQs, reduced motion, 404, robots, sitemap, and layout overflow at 320, 390, 768, 1024, and 1440 pixels. Screenshots are written to ignored `test-results/`. Before the subsequent research-status copy changes, the rebuilt pages were compared against locally rendered original export components at 1440px and 390px; all fourteen comparisons matched page dimensions with only very small pixel-rendering differences. For domain-specific metadata checks, supply the same `SITE_URL` at build and test time. Tests do not validate the source’s financial claims or measure live Core Web Vitals.

## File map

- `src/app/`: seven page routes, shared layout, source stylesheet, metadata endpoints, and custom 404.
- `src/components/site-header.tsx`: original header, footer, and inner-page hero.
- `src/components/broker-card.tsx`: original broker-card presentation.
- `src/components/tools-content.tsx`, `find-my-broker-content.tsx`: stateful exported pages.
- `src/lib/brokers.ts`: original supplied broker data and placeholder URLs.
- `src/lib/site.ts`: public origin, indexability, and route list.
- `src/assets/hero-fx-light.jpg`, `public/favicon.ico`: supplied visual assets.
- `tests/foundation.spec.ts`, `playwright.config.ts`: production browser checks.

## Reusable broker review template

Open `/reviews/template` from the **Preview review template** link on `/reviews`. This is a clearly labelled layout preview inspired by the supplied BrokerChooser HTML: a reviewer header, market selector, sticky chapter navigation, summary/pros-and-cons area, key-data and benchmark-fee tabs, a broker sidebar, comparison controls, seven detailed review chapters, FAQ, methodology, and source records. It uses locally hosted IBM Plex Sans within the review page; the existing website design stays in place.

The uploaded reference is used for section structure and layout. Its article text, author identities, photographs, ratings, testing assertions, awards, testimonials, statistics, and broker-specific financial claims are not reused.

- `src/lib/reviews/types.ts` defines `BrokerReview`, chapters, factual fields, score metadata, and source records.
- `src/lib/reviews/template.ts` exports `createReviewTemplate(name, slug)` and a blank example record. Each invocation produces an independent record for one broker.
- `src/components/review-template/review-page.tsx` renders that record with `BrokerReviewPage`. Interactive navigation, disclosure, tabs, country selection and comparison controls live in `interactions.tsx`.
- `/reviews/template/data` downloads `broker-review-template.json`, including all seven chapters and their empty factual fields. The download includes no scores, authors, sources or verified findings.
- The preview is excluded from the sitemap and sends `noindex, nofollow` metadata. The JSON response also sends `X-Robots-Tag: noindex, nofollow`. When production crawling is enabled, robots allows crawlers to read the preview’s noindex directive.

A factual field has a value, evidence status, source IDs, legal entity, jurisdiction, and check date. A value displays as a finding only when marked verified with matching, dated source metadata. Otherwise it displays **Not researched** or **Needs verification**. Scores require a bounded numerical value, HTTPS methodology URL, and supporting source records. Source URLs must use HTTPS and include publisher, title, entity, jurisdiction and a valid check date.

These guards check the structure and internal consistency of supplied research records. They do **not** fetch, authenticate, independently verify, or judge the truth of a source. They are not a complete publication-approval system. No scraper, CSV importer, scoring algorithm, author credential verification, or live broker-review publishing workflow is connected yet. The market selector demonstrates regional scope; it does not establish availability or populate the blank JSON download.

All preview values remain empty. The five account-opening CTA placements are disabled until each broker’s link has been configured and verified. Research notes, author/fact-checker slots, dates, ratings, screenshots, strengths, limitations, FAQ answers, and sources must be completed through a separate verified research process. The template adds no Review or AggregateRating structured data. Once the research workflow is defined, real records can be rendered using the same component without duplicating page code.

`tests/review-template.spec.ts` covers discovery, noindex/sitemap exclusion, all sections, keyboard tabs, market-scope wording, disclosure dialog/focus, chapter collapsing, anchor navigation, comparison selection, FAQs, desktop/mobile layout, JSON download, record isolation, and evidence guards. Screenshots are saved as `test-results/review-template-1440-top.png` and `test-results/review-template-390-top.png`, with full-page versions alongside them.

### Account-opening calls to action

Every review renders exactly **five** account-opening placements: the review header, after key data, after Safety, after Account Opening, and after the final verdict. They are shared components, not desktop/mobile duplicates. Each placement has a prominent “Open an account” control, broker name, risk text, and an applicable affiliate disclosure. No extra account-opening button is rendered in the sidebar.

`BrokerReview.accountOpening` holds the single broker-specific destination and its evidence metadata: `url`, `status`, `sourceIds`, `legalEntity`, `jurisdiction`, `checkedAt`, and `isAffiliate`. The blank JSON download includes these fields. A live link requires a published review, a verified HTTPS URL without embedded credentials, matching source metadata, and a jurisdiction matching the review’s own scope. Unconfigured or unverified links render as disabled preview buttons without fabricated destinations. Source records remain human-supplied metadata, not automated verification of the remote page.

Partner URLs, including referral parameters, are preserved as supplied. Active affiliate anchors open in a new tab with `rel="sponsored nofollow noopener noreferrer"` and disclose potential compensation. The advertiser-disclosure dialog reflects whether an affiliate destination is active. The `data-account-cta` placement attribute provides integration points for future analytics; no analytics or click tracking is currently sent.

Recent visual refinements add restrained gold account cards, a dark green variation after Safety, clearer section headers, summary tiles, striped data tables, and softer sidebar depth. The review’s information structure and existing evidence fields remain in place.
