# Sri Lanka country-guide implementation record

Scope: first reusable country broker guide and library; existing broker master identities, author, corrections process and typography retained. Changes do not alter the earlier triangle-pattern or broker-review work.

## Files

- `src/app/forex-brokers/page.tsx`: country research library, with exactly one researched draft.
- `src/app/forex-brokers/[country]/page.tsx`: known-country routes, server-rendered guide, metadata and structured data.
- `src/app/forex-brokers/country-guides.css`: responsive slate/teal/amber design, visible focus, reduced-motion support and contained comparison scrolling.
- `src/components/country-guides/country-guide.tsx`: legal-first hero, status, source-backed explanation, navigation, methodology, disclosure, FAQs and corrections.
- `src/components/country-guides/evidence.tsx`: verification labels, unknown values and source links.
- `src/components/country-guides/broker-comparison.tsx`: purpose-approved, unranked comparisons and entity-specific detail cards; centrally resolved paid links only.
- `src/lib/country-guides/{types,catalog,broker-master,evidence,publication,affiliate,affiliate-agreements,seo}.ts`: separated research, identity, legal/editorial, commercial and search concerns.
- `src/app/sitemap.ts`: approved-only country entries; drafts excluded.
- `src/components/site-header.tsx`: one library link in the existing Compare brokers menu; finder prompts suppressed on country-research routes.
- `tests/country-broker-guides.spec.ts` and `tests/fixtures/country-guide.ts`: publication, evidence, affiliate failure cases, reusable future states, table accessibility, SSR, links, responsive and keyboard checks. Fixture records are synthetic and are not served.
- `docs/country-guides/MAINTAINER.md`: responsible country addition, research limits and approval workflow.

## Research status

All five attempted source requests were blocked by the environment proxy. None was read successfully. The CBSL notice is a supplied historical reference requiring current legal review, not current-law verification. Source publication/check dates remain explicitly supplied/unknown, and no reviewer or credentials were invented.

Sri Lanka: pending legal review; draft; noindex/follow; outside the sitemap; commercial links disabled; no broker mappings, recommendations, test claims or affiliate approvals. The library is also noindex until it has an approved guide. An approved informational guide can be indexable independently of affiliate availability.

## Actual validation results

- `npm run typecheck`: passed (Next route generation and TypeScript).
- `npm run lint`: passed.
- `npm run build`: passed; the known-country guide is rendered on the server for each request, with no client-side evidence fetch.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/country-broker-guides.spec.ts tests/country-guides.spec.ts tests/navigation.spec.ts tests/foundation.spec.ts tests/crawlability.spec.ts`: **27 passed** in the final run.
- `git diff --check`: passed.

The new checks include 51 independent affiliate failure conditions; legal/editorial/comparison approval; explicit commercial editorial scope; correct broker/entity/country targeting; licence evidence; missing/future/expired/revoked records; non-HTTPS, credential-bearing and unapproved tracking hosts; no affiliate URLs in restricted HTML; truthful unknown values; suppression of verified prices from the wrong country/entity; firsthand-record requirements; approved informational indexing without affiliate links; metadata and source anchors; native FAQ and mobile contents keyboard operation; a named keyboard-scrollable comparison region; internal-link checks; unknown-country 404s; and widths 320/390/768/1440px without page overflow. Existing country-education, navigation, foundation and sitemap/crawlability tests passed.

Desktop hero, mobile legal-summary and mobile question-list screenshots were visually inspected. The shared header's broker-finder prompt is omitted on these country-research routes, including initial no-JavaScript HTML. A separate browser diagnostic returned HTTP 200 and `private, no-cache, no-store, max-age=0, must-revalidate`, confirming request-time evaluation for date-sensitive agreements. It found zero commercial links and zero browser page errors. A targeted computed-colour check of 182 visible country-guide text elements gave a minimum text contrast ratio of 6.28:1 against their actual backgrounds. This is not a full third-party accessibility audit.

## Release state

The standing user instruction authorizes a GitHub push to the feature branch `feat/sri-lanka-country-guide`. This brief does not authorize production publication/deployment. Source verification and human legal/editorial review remain outstanding. The production URL will not show the new guide until a separately authorized release.
