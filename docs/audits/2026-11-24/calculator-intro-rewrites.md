# Calculator introduction and Quick answer rewrite audit — 24 November 2026

Scope: only the two requested copy fields on existing matching calculator pages. All 29 supplied entries were checked. Twenty-three exist; six are absent and were not created. The compounding intro removes “and withdrawals” with the owner’s explicit confirmation, because recurring withdrawals are unsupported. All other replacement wording is exact.

The compounding page keeps its existing `/tools/forex-compounding-calculator` URL. No metadata, formulas, calculator logic, supporting sections, headings, FAQs, sources, links, schema or risk disclosures were changed. A full before/after comparison of all 24 catalog definitions (including the unmatched generic forex calculator) confirmed every field outside intro/quickAnswer is identical. The runtime diff contains exactly two replaced string values per matching source file. Existing typography and Quick answer placement are preserved; shorter copy brings the calculator higher on mobile.

| # | Requested page | Actual route / result |
| --- | --- | --- |
| 1 | Forex Lot Size Calculator | /calculators/forex-lot-size-calculator |
| 2 | Forex Pip Calculator | /calculators/forex-pip-calculator |
| 3 | Forex Margin Calculator | /calculators/forex-margin-calculator |
| 4 | Forex Profit Calculator | /calculators/forex-profit-calculator |
| 5 | Forex Risk-Reward Ratio Calculator | /calculators/forex-risk-reward-calculator |
| 6 | Forex Break-Even Calculator | /calculators/forex-break-even-calculator |
| 7 | Forex Swap Calculator | /calculators/forex-swap-calculator |
| 8 | Forex Lot Size Converter | /calculators/forex-lot-size-converter |
| 9 | Forex Risk of Ruin Calculator | /calculators/forex-risk-of-ruin-calculator |
| 10 | Kelly Criterion Calculator | /calculators/kelly-criterion-calculator |
| 11 | Fibonacci Retracement Calculator | /calculators/fibonacci-calculator |
| 12 | Forex Pivot Point Calculator | /calculators/forex-pivot-point-calculator |
| 13 | Forex Compounding Calculator | /tools/forex-compounding-calculator |
| 14 | ATR Position Size Calculator | Absent: /calculators/atr-position-size-calculator |
| 15 | Forex Hedge Calculator | Absent: /calculators/forex-hedge-calculator |
| 16 | Forex Notional Value Calculator | Absent: /calculators/forex-notional-value-calculator |
| 17 | Forex Spread Cost Calculator | /calculators/forex-spread-cost-calculator |
| 18 | Forex Commission Calculator | /calculators/forex-commission-calculator |
| 19 | Currency Converter | /calculators/currency-converter |
| 20 | Forex Margin Call & Stop-Out Calculator | /calculators/forex-margin-call-calculator |
| 21 | Forex Take Profit Calculator | /calculators/forex-take-profit-calculator |
| 22 | Forex Leverage Calculator | /calculators/forex-leverage-calculator |
| 23 | Forex Stop Loss Calculator | /calculators/forex-stop-loss-calculator |
| 24 | Forex Drawdown Calculator | /calculators/forex-drawdown-calculator |
| 25 | Prop Firm Drawdown Calculator | /calculators/prop-firm-drawdown-calculator |
| 26 | Prop Firm Consistency Rule Calculator | /calculators/prop-firm-consistency-calculator |
| 27 | Trading Expectancy Calculator | Absent: /calculators/trading-expectancy-calculator |
| 28 | Sharpe Ratio Calculator | Absent: /calculators/sharpe-ratio-calculator |
| 29 | Forex Martingale Calculator | Absent: /calculators/forex-martingale-calculator |

The exact-copy fixture retains all 29 supplied entries, with the approved compounding correction. Regression assertions for the earlier 80-word intro target and two former Quick answer examples were updated to the new supplied copy. Profit/leverage total-word minimum checks now allow 1,500 words because shortening only these requested blocks reduces their totals below 1,600; their supporting articles are unchanged rather than padded.

Verification actually completed: production webpack build including TypeScript; ESLint; whitespace check; 25 targeted browser/inventory/route groups. Targeted tests check exact strings, one intro immediately after the H1, one Quick answer block, server-rendered copy, 320/390px overflow and font sizes, calculator-before-article order, and 404 results for the six absent routes.

Numerical replacement examples were checked with the existing engines: lot sizing, standard/mini pip values, margin, profit, reward-to-risk and break-even rate, fee-adjusted break-even price, ordinary/triple swap, lot conversion, Kelly fractions, Fibonacci and pivot levels, compounding, spread, commission, currency conversion, margin-level thresholds, take-profit and stop-loss prices, effective leverage/margin, drawdown/recovery, prop-firm loss-floor distance and consistency. The risk-of-ruin frequency example is conditional arithmetic, not an assertion that a specific seeded simulation produces 120 hits. No examples can be validated against engines for the six absent tools.

The expectancy engine drafts from the paused implementation task are preserved outside the repository in `/workspace/task-drafts/expectancy-paused/`. They are excluded from this copy-only update.

Final regression evidence: the existing calculator/link/crawl suite covered 110 groups. Its two outdated Quick answer string assertions were corrected to the supplied replacement examples, and all ten pip/margin groups passed on recheck; the other 108 groups had passed. Together with the 25 targeted copy checks, every requested existing page and all six absent routes were accounted for. Final TypeScript, ESLint and whitespace checks passed. The sitemap audit checked 117 canonical content URLs.
