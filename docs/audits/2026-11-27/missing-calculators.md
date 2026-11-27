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

## Forex notional value

Route: `/calculators/forex-notional-value-calculator`. Guide: 1,679 words with the supplied intro/Quick Answer, three FAQs, six contextual internal anchors and checked MetaTrader/IG contract and margin references. Two obsolete candidate source URLs returned 404 and were replaced before publication; their unsupported citations were not retained.

The pure engine reuses instrument/volume/price validation and liability-side currency conversion. Base and quote amounts describe the same exposure; a base-currency account values units directly. Optional fixed-leverage or percentage margin remains separate. Equity enables effective leverage only when positive; exposure can still be measured at nonpositive equity. Margin-off mode ignores unused leverage. Configured-lot comparisons keep price/conversion/specifications fixed. No broker tier, order acceptance, free-margin sufficiency or loss ceiling is certified.

Seventeen numerical/regression groups passed. Production webpack/TypeScript, ESLint and whitespace checks passed. Browser checks cover currency views, margin-off mode, invalid input/reset, mobile fit, SSR default, three FAQs, canonical/sitemap and exact supplied-copy inventory. Position size, reference price and equity are omitted from settings links. Changing the symbol clears its reference price.

The notional browser check caught a generic-widget fallback before publication. The shared renderer now selects all registered cost/risk/performance tools through a typed registry guard, avoiding fragile chains of per-kind template conditions. The corrected build was rechecked against notional, hedge, ATR and existing leverage pages.

All 17 final related browser/inventory groups passed after the renderer fix.

## Trading expectancy

Route: `/calculators/trading-expectancy-calculator`. Guide: 1,694 words, supplied intro/Quick Answer, three FAQs, five internal links and contextual BabyPips/NIST methodology references. The original pages block direct automated retrieval; their public text renderings were read, while the guide links to the original sources. A positive historical mean is never called a statistically proven edge.

Summary mode includes winning, losing and zero-result probabilities, positive average magnitudes, gross/net declarations, uniform missing costs, conditional break-even shares and optional constant-input expected total/common-risk R. Net outcome classification and profit factor are recalculated after costs; a gross zero can become a net loss. Already-net data is not deducted again. An unattainable break-even rate or no losing amount is explicit rather than a false finite ratio.

History mode supports ordered local CSVs with exact column mapping, optional individual risk/date/currency columns, net totals, true mean individual R, payoff/profit factor, zero outcomes, cumulative realised P&L and all/recent/UTC-date windows. It rejects future/invalid/unordered dates, ambiguous timestamps, mixed labelled currencies and incomplete selected-trade risk denominators. Same-calendar-date trades preserve row order. Date-less normalised files remain supported. Unknown columns are discarded; normalised data is bounded to 64 KiB/1,000 trades. No finance history is uploaded or placed in settings URLs.

Thirty-two numerical/regression groups passed after the final CSV normalization changes, including consistency/drawdown filters. Production webpack/TypeScript, ESLint and whitespace checks passed. The client-component directive remains first when importing the new format-specific CSV reader. Browser verification covers probability/cost changes, mapped files, individual R, recent windows, private restoration, layout, SSR/canonical/FAQ/sitemap and supplied-copy inventory, plus earlier CSV-tool regressions.

All nine expectancy/CSV/inventory browser groups passed on the final build.

## Sharpe ratio

Route: `/calculators/sharpe-ratio-calculator`. Guide: 1,674 independently counted words, exact supplied introduction/Quick Answer, three FAQs, five contextual internal links and two CFA Institute methodology sources. Direct retrieval was blocked; public text renderings of the Sharpe explainer and Lo paper's abstract were read. The premium full paper was not accessed or claimed as read.

Summary and local-history modes accept explicit simple-return units, frequency, spacing, risk-free convention and annualization. Sample/population volatility, varying aligned benchmark columns, effective annual-to-period conversion, zero volatility, one observation, missing frequency and visibly gapped calendar periods are handled explicitly. Square-root scaling is an assumption, not generally valid under serial correlation. No live benchmark, statistical significance or performance grade is invented.

CSV input selects exact return/benchmark/date/currency columns, strips unrelated identifiers, rejects incomplete benchmark alignment, invalid/future/non-increasing dates, mixed declared currencies and common balance/P&L column mappings. Private histories, mean, volatility and benchmark inputs never enter settings URLs. Receiving a settings-only link requires the recipient's own data.

Fifteen Sharpe/expectancy numerical and CSV regression groups passed. Production webpack build/TypeScript, ESLint and whitespace checks passed. Seven browser/inventory groups passed, including sample/population changes, summary mode, undefined cases, mapped local CSV, private settings restoration, irregular-period suppression, mobile fit, server rendering, canonical, exactly three FAQs, sitemap and exact supplied-copy inventory.
