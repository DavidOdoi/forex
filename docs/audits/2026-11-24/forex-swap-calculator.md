# Forex swap calculator — 24 November 2026

Route `/calculators/forex-swap-calculator`, indexable with canonical, sitemap, catalog and related-tool links. Shared accessible white/black workspace; no broker-rate feed, holiday calendar or verified profile is implied.

## Financing and dates

Supports signed points × point size × base units, pips × pip size × base units, money per configured lot, and simple quote-currency notional × signed annual percentage / documented 360 or 365 denominator. Manual normal/triple event counts or configured local opening/closing dates produce financing-day multipliers. Calendar mode uses Temporal timezone rules, rejects ambiguous/nonexistent local times, counts cutoffs strictly after opening and at/before closing, and supports a selectable triple weekday and up to 30 dated multiplier overrides. Zero overrides skip a confirmed event. The default weekday/weekend schedule and all initial values are labelled illustrative, not universal broker terms. Date ranges are bounded to 366 local days. Signed conversion uses credit/debit bid/ask sides.

A point/pip equivalent is shown for quote-denominated rates; account-money amounts without a quote valuation explicitly omit this equivalent rather than inventing one. Direction and instrument changes clear the manual rate to prevent reusing a different direction/symbol rate. Rates, notional and conversion stay constant across the scenario and these limitations are disclosed.

## Verification

- 6 pure test groups passed: mandatory USD −6 ordinary and USD −24 normal-plus-triple, pips/money/annual conventions, volume scaling, configured dates and overrides, exact cutoff boundaries, daylight-saving UTC shifts and ambiguous/nonexistent times, credits/liabilities, invalid data and bounded schedules.
- 6 browser checks passed across swap and break-even: rate units, direction clearing, calendar overrides, scenario restoration, SSR/default result, canonical/sitemap, exactly three FAQs and 320/390/1440 layouts.
- Production webpack build with TypeScript, ESLint and diff checks passed. Swap 390px screenshot reviewed.
- Supporting article **1,753 words**, 97-word introduction, detailed direct Quick answer and three FAQs. Supplied point/pip, normal/triple, positive-credit and net-P&L examples preserved. Unverified named broker schedule claims were replaced with a general instruction to check symbol terms. Contextual internal/external links point to actual tools and verified IG/Frankfurter/CFTC sources.
