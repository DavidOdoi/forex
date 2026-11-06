# Forex calculator conventions

These four tools implement the user’s 6 November 2026 calculator brief in the existing Next.js application. Calculations run locally in the browser and can also render illustrative initial results on the server. No data provider, live quote subscription, account connection or new dependency is used.

## Scope and units

- 28 conventional forex pairs cover the eight supported currencies: USD, EUR, GBP, JPY, CHF, AUD, CAD and NZD.
- Quote amounts belong to the second currency in `BASE/QUOTE`.
- One pip is 0.01 for JPY quotes and 0.0001 for other supported quotes. One pipette is one tenth of a pip.
- Trade lots use a configurable contract size, defaulting to 100,000 base-currency units per lot. Standard, mini and micro **equivalents** always mean 100,000, 10,000 and 1,000 base units respectively.
- These are ordinary forex formulas, not a universal calculator for metals, futures, options, indices or inverse contracts.

## Profit and costs

Units = lots × units per lot.

Buy quote P&L = (exit − entry) × units. Sell quote P&L = (entry − exit) × units. Directional pips divide the corresponding price difference by the pair’s pip size.

Use execution prices: a buy opens at ask and closes at bid; a sell opens at bid and closes at ask. Spread is included in those fills and is not deducted again. Convert gross P&L into the account currency, subtract **total round-trip commission for the whole position**, and add a signed swap amount. Those adjustments are entered in account currency; a negative swap is a charge and a positive swap is a credit. A blank optional cost means zero.

## Conversion bid/ask

When quote and account currencies differ, an explicit manual conversion quote is required. There is no hidden stale-rate fallback or automatic assumption that USD 10 is every pip’s value. Changing the pair, account currency or conversion orientation clears previous conversion inputs.

| Entered conversion pair | Positive proceeds | Cost of covering a negative amount |
| --- | --- | --- |
| SOURCE/ACCOUNT | source amount × bid | source liability × ask |
| ACCOUNT/SOURCE | source amount ÷ ask | source liability ÷ bid |

If source equals account currency, the conversion factor is one. Otherwise bid and ask must be finite and positive, ask must be at least bid, and both currencies must match the conversion being performed. The current implementation bounds executable-price inputs between 1e−12 and 1e9 for numerical/display stability. It does not claim that a broker will settle at these rates or without additional conversion charges.

## Risk and size

Percentage cash risk = balance × risk percentage ÷ 100. Alternatively, use a positive fixed cash amount no larger than balance.

Unrounded trade lots = cash-risk budget ÷ (stop distance in pips × adverse account-currency pip value per trade lot).

The adverse pip value uses the cost side of conversion, rather than a proceeds or midpoint rate. Lots are rounded **down** to the selected increment. A small floating-point boundary correction prevents an exact value such as 0.30 from becoming 0.29 solely through binary representation; tests enforce that planned stop loss remains within the budget to numerical tolerance. If the budget cannot fund one increment, the output is zero with an explanation.

Commission, swaps, gaps, slippage, minimum broker size, available margin, liquidation and portfolio exposure are outside the size model. A stop order is not a guaranteed price. Unsupported/extreme numeric values, zero stop distances and non-finite results are rejected.

## Compounding

The return is an **effective rate for one selected period**, not an annual rate. Daily/weekly/monthly/yearly determines the period’s unit. Keeping the same rate and number of periods while changing the unit changes the duration label, not the number of times the rate is applied. The interface and article explain this explicitly.

- Without deposits: ending balance = starting capital × (1 + period rate)^periods.
- End-of-period deposit: next balance = opening balance × (1 + period rate) + deposit.
- Start-of-period deposit: next balance = (opening balance + deposit) × (1 + period rate).
- Contributions = starting capital + deposit × periods.
- Hypothetical gain/loss = ending balance − contributions.

The model permits −100% to +100% per period and 1–600 whole periods. These are software limits, not plausible-return claims. Scenarios exceeding a 1e15 balance display limit are rejected. Tax, inflation, withdrawals and unentered trading costs are excluded. The chart starts its vertical scale at zero and distinguishes balance from contributions. Every period is available through table pagination and numerical CSV export.

## Precision and validation

JavaScript floating-point calculations retain unrounded intermediate values. Only presentation is rounded; these are estimates rather than an accounting/settlement ledger. Currency outputs carry explicit ISO codes. Small pip values display up to six decimals; price and pip conventions are shown separately.

`tests/calculators.spec.ts` checks independent buy/sell examples, adverse moves, cost credits/charges, direct/inverse bid/ask conversions, JPY pips/pipettes, cash budgets across all 28 × 8 pair/account combinations, contract changes, round-down boundaries, invalid/extreme inputs and closed-form compounding with contributions. Browser checks cover forms, keyboard tabs, missing quotes, stale quote clearing, CSV/table history, schema/FAQ equivalence, no-JavaScript educational content, canonical redirects, sitemap inclusion, mobile result navigation and overflow.

## Search and source notes

The four pages have distinct requested titles/descriptions, one H1 each, canonical URLs, server-rendered supporting explanations, Quick answers and three matching FAQ entries. SoftwareApplication-family markup uses `WebApplication`, a zero-price offer and accurate requirements; no ratings are invented. Production tool routes enter the sitemap independently of unpublished broker reviews. Preview routes remain noindex.

The educational references link to IG’s pip definition, the CFTC’s retail forex guidance and Investor.gov’s interest calculator. Investor.gov uses different annual-interest inputs; it is an educational comparison, not the rate convention implemented here. Source retrieval outcomes, including denied and unavailable candidates, are retained in `source-checks-2026-11-06.json`. No denied content was collected or treated as verified evidence. Formula validation rests on the disclosed algebra and the independent numerical tests, not copied calculator outputs or a claimed external audit.
