# Forex pip calculator — 24 November 2026

Route: `/calculators/forex-pip-calculator`. The `/tools/forex-pip-calculator` alias redirects permanently to that canonical URL. It is linked from the Tools catalog, related calculator cards and the lot-size guide, and included in the XML sitemap.

## Calculation

A configured lot amount is converted to base units using the editable contract size. Pip value in quote currency = base units × pip size. Account-currency value = quote pip value × the explicit quote-to-account factor. Signed price movement = (end − start) ÷ pip size.

The common decimal configuration retains 40 significant digits without intermediate currency rounding. Conventional comparison rows explicitly use 100,000/10,000/1,000 units. Those rows remain conventional even when the user overrides the configured broker lot size. The tool supports the existing forex instrument registry; it does not apply FX conventions to metals, indices, crypto or futures.

Direct, inverse and two-leg cross rates use the shared conversion abstraction. This neutral exposure estimate uses midpoint conversions when bid and ask are separately supplied. The existing risk-size tool retains its conservative liability conversion; an actual credit/debit can differ from a neutral pip value. No rate of one is silently substituted between different currencies.

Manual input is labelled without a verified timestamp. The optional Frankfurter daily reference displays actual dates and retrieval time, identifies data older than four days and cached snapshots, and reports missing/unsupported rates. A provider failure cannot silently produce an estimate from invented prices. Copy/share includes assumptions; reset clears invalid shared versions.

## Content

Supporting text: **1,786 words**, counting intro, Quick answer, instructions, headings, formulas, table captions/cells, bullets and exactly three FAQs. Navigation, calculator controls and unrelated boilerplate are excluded. Intro: 90 words. Quick answer: 80 words. The previously published lot-size introduction and Quick answer were expanded in response to the owner's latest request, with a contextual link to the pip tool.

Primary external links were retrieved successfully (HTTP 200): IG pip glossary, Frankfurter data-source documentation and CFTC forex-risk guidance. Numerical examples are hypothetical, not live quotations. No verified broker profile, trading-return forecast or account eligibility claim is invented.

## Verification

- 20 pure numerical/scenario tests passed across the new pip engine and existing lot-size/conversion model, including all eight mandatory pip examples in the brief.
- 18 browser/legacy calculator checks passed: no-JavaScript content and default example, current calculator regressions, signed movements, lot/unit modes, invalid rates, dated and stale references, provider failure, copy/share restoration, reset, sitemap, canonical redirect and mobile/desktop layouts.
- TypeScript, ESLint, production webpack build and diff checks passed.
- Screenshots at 390px and 1440px were visually reviewed. Widths 320/390/768/1440 were covered by the browser suites.

Remaining limitations are disclosed on the page: conventional/manual contract assumptions, reference rather than executable prices, no verified broker-specific profile, and separate execution/commission/financing considerations.
