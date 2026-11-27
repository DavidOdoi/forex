# Six missing calculators — completion record

Owner request: complete ATR position sizing, same-symbol forex hedge, forex notional value, trading expectancy, Sharpe ratio and forex Martingale. Reuse the existing template and precision, conversion, privacy and SEO utilities. Preserve the supplied introduction/Quick Answer wording. Verify and push each completed tool before starting the next.

## ATR position sizing

Route: `/calculators/atr-position-size-calculator`. Guide: 1,625 independently counted words, supplied introduction/Quick Answer, three FAQs, five relevant internal links and two checked primary educational sources (Fidelity ATR definition and CME proper position size).

The pure model accepts manually entered ATR in pips or price units, an explicit multiplier and optional upward stop-distance rounding. It delegates budget, costs, liability-side conversion, volume-grid rounding, minimum/maximum limits and unused-risk calculations to the existing lot-size engine. A too-small budget produces zero permitted volume. No live ATR or OHLC series, broker permission, forecast or guaranteed fill is claimed. Multiplier comparisons recompute the same budget/specifications. Financial inputs are omitted from settings links.

Verification: 20 ATR/lot-size numerical groups passed; production webpack build and TypeScript, ESLint and whitespace checks passed. All six browser/inventory groups passed. Browser verification covers units, fees, invalid input, reset, settings privacy, 320/390/1440px fit, SSR default, canonical, exactly three FAQs, sitemap and supplied-copy/inventory checks. No absent tool is linked as implemented. The copy regression fixture now records implemented tools progressively rather than hard-coding the old count of 23.
