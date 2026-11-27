# Six missing calculators — completion record

Owner request: complete ATR position sizing, same-symbol forex hedge, forex notional value, trading expectancy, Sharpe ratio and forex Martingale. Reuse the existing template and precision, conversion, privacy and SEO utilities. Preserve the supplied introduction/Quick Answer wording. Verify and push each completed tool before starting the next.

## ATR position sizing

Route: `/calculators/atr-position-size-calculator`. Guide: 1,625 independently counted words, supplied introduction/Quick Answer, three FAQs, five relevant internal links and two checked primary educational sources (Fidelity ATR definition and CME proper position size).

The pure model accepts manually entered ATR in pips or price units, an explicit multiplier and optional upward stop-distance rounding. It delegates budget, costs, liability-side conversion, volume-grid rounding, minimum/maximum limits and unused-risk calculations to the existing lot-size engine. A too-small budget produces zero permitted volume. No live ATR or OHLC series, broker permission, forecast or guaranteed fill is claimed. Multiplier comparisons recompute the same budget/specifications. Financial inputs are omitted from settings links.

Verification: 20 ATR/lot-size numerical groups passed; production webpack build and TypeScript, ESLint and whitespace checks passed. All six browser/inventory groups passed. Browser verification covers units, fees, invalid input, reset, settings privacy, 320/390/1440px fit, SSR default, canonical, exactly three FAQs, sitemap and supplied-copy/inventory checks. No absent tool is linked as implemented. The copy regression fixture now records implemented tools progressively rather than hard-coding the old count of 23.

## Same-symbol forex hedge

Route: `/calculators/forex-hedge-calculator`. Guide: 1,680 words, supplied intro/Quick Answer and three FAQs. Two checked MetaTrader primary sources explain separate/netting accounting and broker-configured hedged-margin alternatives. Five contextual internal links lead to implemented tools.

The pure model compares compatible buy/sell sizes, gross and signed net exposure, executable bid/ask P&L, separate charges/financing and frozen per-leg asset/liability conversion. Zero on one side is supported; both zero is rejected. Matching positions retain spread/entry losses. Margin is explicitly gross notional, larger-leg notional or a manually entered platform figure; net-zero exposure never automatically implies zero margin. Scenario bid/ask movements keep spreads/conversions fixed and exclude invalid prices. It is not cross-pair correlation hedging, account-wide liquidation analysis or reconstruction of a netting account.

Changing the pair clears hedge prices and clears entered ATR in the earlier ATR tool, preventing old-symbol inputs being silently reused. Financial positions and entries are omitted from settings links. Twenty-four numerical/regression groups passed, including hedge, ATR, profit and take-profit filters. Production webpack/TypeScript, ESLint and whitespace checks passed. All nine related browser/inventory groups passed. Browser checks cover quote/size updates, margin selection, matched-loss disclosure, invalid quotes, reset, mobile fit, SSR/schema/canonical/sitemap and exact supplied-copy inventory.
