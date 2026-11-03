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
