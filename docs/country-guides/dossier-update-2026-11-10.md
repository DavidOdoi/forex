# Sri Lanka guide: supplied dossier update

The user supplied a research dossier reporting research/source access on 10 November 2026. It is not a human legal or editorial approval and does not establish resident eligibility, a serving entity, or Sri Lankan authorization for any broker candidate.

## Changes

- Updated the existing `/forex-brokers/sri-lanka` guide; no competing route.
- Added attributed reported wording from the CBSL notice, DFE FAQ 30 card-payment restriction, Gazette 2493/36 and unresolved interaction with section 22 order 2493/38, residency distinctions, foreign-licence limitations, legal-review questions and owner-supplied evidence requirements.
- Expanded the FAQs and preserved the five independent permission/eligibility/affiliate questions.
- Corrected the CBSL date treatment: the report describes an undated PDF body. The filename's 21 October 2019 clue is not a confirmed publication date. `publishedAt` is null. Reported DFE page-update dates are distinct from publication dates, and a register's “as at” date is not relabelled as a publication date.
- Public quotations explicitly say they were supplied by the dossier and their wording is not independently rechecked.
- The source footer separates contributor-reported access from independent checks. Research/access dates are not used as legal-review, publication or modification dates.
- Draft, noindex, sitemap exclusion, null approvals/review dates and disabled commercial links remain in force. No entity mappings, registry-confirmed licences, broker ranking or affiliate record was invented.

## Research provenance

The original dossier is preserved beneath the archive's provenance header in `research/sri-lanka-dossier-2026-11-10.md`. The original uploaded payload SHA-256 is `725778013e45cef752bbb10763ac0f70c8df0664c5bcaf051a41a242d4dcb342`; the archive test checks the exact bytes beneath the header.

A file-specific `.gitattributes` rule preserves this supplied archive's original line endings and Markdown hard breaks across checkouts. The existing CSV-preservation rule is retained.

`src/data/country-guides/sri-lanka-dossier-2026-11-10.json` retains all 28 ledger findings (L1–L12 and B1–B16), 25 reported source records, four broker research records with 42 reported fields, five advertised IC account records, nine legal questions, nine owner-evidence items and the access failures. The stored broker statements are not Sri Lankan account entitlements and are not rendered as a comparison or public pricing table.

The structured record retains Exness's address discrepancy and broker-stated SD025; the separate Belize/Seychelles XM companies and 8557558 versus 000261/309 discrepancy; IC's early-access Pro products, USD-notional cTrader unit and negative-equity warning; and Pepperstone's minimum-deposit/funding, TradingView and mixed-jurisdiction issues. No findings are copied into the existing global broker reviews.

Fresh independent HTTPS probes to the CBSL notice, DFE current-transactions FAQ, Gazette 2493/36 and FSA cross-border communiqué all returned environment-proxy CONNECT 403. None was independently retrieved. Other newly supplied source records use `access: not_attempted`, rather than claiming we attempted or read them. Previous failed preparation attempts remain recorded separately.

`reportedAccess` records the contributor's stated outcome/date; it never sets `checkedAt`, `verification: checked`, `access: retrieved` or `regulator_confirmed`. The section 22 order and failed Pepperstone regulation page are explicitly marked as unaccessed by the contributor. The source ledger includes unestablished documents without inventing direct URLs where none was provided.

## Reusable implementation

- `types.ts`: optional supplied-research, reported-access/date and reported-quotation metadata.
- `sri-lanka-dossier.ts`: scoped application of the research packet to the existing Sri Lanka configuration; safe editorial/commercial defaults explicitly retained.
- `supplied-research.ts`: prevents the packet banner/provenance from being reused as another country's evidence or shown as a future research date.
- `evidence.tsx`: scoped, attributed quotations and reported-research labels; reported quotes cannot appear without their source or in another country/entity.
- `country-guide.tsx` and CSS: readable dossier banner, accurate source/date labels and quote styling, using the existing font and responsive layout.

Broker account/funding pages remain outside the draft's public source list and rendered payload. Public links remain official legal/regulatory references and existing editorial resources. No account-opening or funding route, phone/email endorsement, commercial broker CTA, tracking URL or firsthand test was added.

## Required follow-up

Qualified review must resolve the 2026 regulation's relationship with the warning, section 22 orders/directions, product classification, residency and special permissions, cross-border authorization, remedies under actual client contracts, and the proposed publisher/affiliate scope. Genuine affiliate agreements, written targeting approvals and real legal/editorial approval records still need owner input. The supplied dossier cannot substitute for these records.

Before any eventual approved publication, replace unverified reported claims with actually checked, scoped evidence and record genuine review dates/approvals. The dossier application deliberately retains the safe draft defaults; an authorized editor must explicitly update that integration as part of approval, rather than merely inserting a URL or changing a headline.

## Actual validation

- `npm run typecheck`, `npm run lint`, `npm run build`: passed.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/sri-lanka-dossier.spec.ts tests/country-broker-guides.spec.ts tests/country-guides.spec.ts tests/navigation.spec.ts tests/foundation.spec.ts tests/crawlability.spec.ts tests/xm-review.spec.ts tests/ic-markets-review.spec.ts`: **44 passed** in the final run, including the existing 51 affiliate failure conditions.
- Checks cover the exact uploaded-payload hash; all 28 ledger records; preserved conflicts/units/access failures; no source-access-to-review-date promotion; no country/entity leakage; unavailable quotations without matching provenance; no-JavaScript HTML; accurate publication/update/access dates; live-page broker/funding URLs omitted from the rendered payload; no comparisons, paid links or sitemap entries; responsive widths 320/390/768/1440px; keyboard FAQs; and existing site/broker behavior.
- `git diff --check` and staged checks passed, with the file-specific supplied-archive whitespace/line-ending preservation rule. A separate check confirmed that the staged archive's original payload matches the uploaded-file SHA-256.
- Desktop dossier status and 2026 regulation screenshots, and the mobile funding/quotation screenshot, were visually inspected.
- A separate production-server browser diagnostic returned HTTP 200 and `private, no-cache, no-store, max-age=0, must-revalidate`. It found zero paid links, four reported-quotation blocks, twelve public source cards and zero browser errors. A targeted computed-colour check of 329 visible text nodes gave a minimum contrast of 6.03:1 against their actual backgrounds; this is not a full accessibility audit.

## Release

The user previously authorized deployment of this guide and asked for its live URL. This update continues that existing live-draft work and is pushed to the feature and production branches after the checks. Serving the research draft does not change its unapproved editorial/legal status, noindex or commercial-link prohibition. Independent probes of the live Vercel domain remain blocked by the environment; successful production deployment is not claimed without external confirmation.
