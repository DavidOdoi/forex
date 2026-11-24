# Forex break-even calculator — 24 November 2026

Canonical `/calculators/forex-break-even-calculator`; indexable, linked from the calculator catalog/related cards and XML sitemap. Reuses the existing white/black layout, conversion abstraction, decimal precision, scenario links and responsive forms.

## Model and assumptions

Same-direction entries (1–20) are combined by base-unit weighting. Quote costs = commission + additional exit costs − signed accrued financing, converted from account currency when necessary. Long theoretical executable exit = executable entry + quote costs / units; short subtracts. Positive costs use the proceeds conversion needed to offset them; negative net costs use liability conversion. Quote-currency costs are netted in quote before settlement.

Executable-entry mode does not add spread. Midpoint mode explicitly assumes a constant symmetric spread, adjusts the opening side by half, and distinguishes the closing executable side from the closing midpoint. Price precision defines the configured grid: long exits round up, short exits down; theoretical and rounded prices remain separate. Broker-specific ticks, changing conversion, financing, gaps and actual order eligibility remain outside the model. A basket hands its total units to other tools; it does not silently use the single-entry field.

## Verification

- 11 pure tests passed across break-even and risk/reward: USD 7 / 100,000 gives closing bid 1.10007 or ask 1.09993; equal/unequal weighted entries; charges/credits; conservative grid rounding; no double spread; midpoint conventions; bid/ask cost conversion; basket share restoration and invalid inputs.
- 6 browser checks passed across break-even and risk/reward: interactive direction/fees/baskets, invalid costs, midpoint labels, copy/share, transfer of basket units to pip values, server-rendered default result, canonical, sitemap, three FAQs and layouts 320/390/1440.
- Production webpack build with TypeScript, ESLint and diff checks passed. 390px screenshot visually reviewed.
- Supporting article **1,737 words**, 89-word introduction, useful Quick answer and exactly three FAQs. Supplied buy/sell, commission, financing and weighted-entry examples preserved. Contextual internal links point to built tools; external anchors use verified IG, CFTC and Frankfurter sources. No broker profile/rate is invented.
