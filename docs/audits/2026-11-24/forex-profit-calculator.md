# Forex profit calculator — 24 November 2026

Canonical: `/calculators/forex-profit-calculator`. The previously published `/tools/forex-profit-calculator` redirects permanently, preserving one content destination. Catalog, contextual tool links, related cards and sitemap use the canonical URL.

## Model

Signed gross quote P&L = directional exit difference × base units. Credit conversions use direct bid/inverse ask; liability conversions use direct ask/inverse bid, including two-leg crosses. The default conversion behavior for the existing risk and margin engines remains liability. Reference-rate dates and stale/cache labels are retained.

Net account P&L deducts separate commission, optional mid-price spread and extra slippage, then adds signed financing. Executable-fill mode never deducts the extra spread allowance. Commissions support total position, per configured lot round trip, or per lot each side. Commission and financing can be entered in account or quote currency. Optional reference equity produces a percentage of equity, not margin. Exit-price comparisons and optional stop/target scenarios hold rates/costs constant and do not validate orders or promise execution.

## Editorial and checks

Supporting copy: **1,617 words**, including a 96-word intro, detailed Quick answer, numerical long/short and JPY examples, tables, cost/conversion limitations, and exactly three FAQs. Primary sources are the previously verified Frankfurter, IG pip glossary and CFTC guidance. No market rate, broker fee, permission or reviewer credential is invented.

- 32 pure numerical checks passed across profit, pip, margin and lot sizing, including every mandatory profit example, signed bid/ask conversion, commissions, no duplicate spread, optional exits and rejected invalid inputs.
- 27 browser/regression checks initially passed; the legacy mobile check required its button-label selector to include the new net-profit label. The corrected mobile check then passed. New profit workflows cover no-JS content and default result, canonical/308 migration/sitemap, buy/sell, fees, equity, spread modes, JPY conversion, invalid inputs, copy/share and margin transfer, plus 320/390/1440 layouts.
- Production webpack build (including TypeScript), ESLint and diff checks passed.

Limitations are visible beside results: actual fills and conversions may differ; scenarios do not model partial fills, variable financing, broker-specific settlement or unentered charges. Shared links contain inputs and dated references may change when reopened.
