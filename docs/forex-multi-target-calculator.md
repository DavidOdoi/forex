# Forex multi target calculator

Route: `/tools/forex-multi-target-calculator`. The existing Next.js App Router's specific-route pattern is used, alongside the other `/tools/*` calculators. No synonym or query-state routes are created. The current site's configured origin and indexing guards apply.

## Implemented workflow

- One forex position, buy or sell, using one of the 28 existing forex pairs and 23 supported account currencies.
- Three starting targets, with one through ten supported. Each target accepts a price or a positive R multiple; percentages always refer to original lots.
- Existing lots, fixed gross cash risk, or balance/equity × chosen risk percentage. Risk sizes round down to the lot grid and are rechecked against the budget.
- Editable base units per trade lot (default 100,000), minimum partial-close/remainder volume (default 0.01), zero-anchored lot step (default 0.01), and pip-size override. No custom/non-forex symbols are accepted.
- Explicit equal allocation, 50/30/20, clear allocation and allocate-remaining actions. Equal allocation keeps eight percentage decimals and assigns the final decimal remainder to the last target. The three-part preset sets the target count to three.
- Full-exit mode requires exactly 100%, using decimal arithmetic rather than binary floating-point tolerance. Underallocation needs explicit runner mode. An unpriced runner has no final whole-position R or final whole-trade profit. An optional runner exit is assumed after all targets; an exit beyond the selected stop is rejected because that stop would trigger first.
- Ideal/proposed/applied volumes, actual percentages, directional pips, target R, partial and cumulative cash P/L, and lots remaining. Invalid ideal calculations remain clearly labelled, with no invented executable proposal when too small.
- Original-stop paths, or a stop moved to entry after the selected target. Each prefix of filled targets is modeled. A runner has both its all-targets/open scenario and a separate final-stop reversal path.
- Allocation/price ladder with text equivalents; local readable clipboard copy, CSV containing assumptions and outputs, print styles, reset and a labelled worked example.
- Explicit calculate action; edited inputs hide previous results until recalculation. There are no per-keystroke result announcements, analytics submissions, live requests, plan persistence or plan parameters in URLs. Clipboard denial has a manual text-copy fallback.
- Server-rendered worked example and methodology; canonical/social metadata, breadcrumbs, WebApplication/BreadcrumbList schema and sitemap membership. Discovery links are in the tools hub, header and footer. All main body text uses 18px Manrope, with heading/display hierarchy.

## Calculation contract

`src/lib/calculators/multi-target.ts` is independent of the UI. Decimal-string inputs are bounded and validated (ordinary decimal notation, up to 18 places; no NaN/infinity/scientific notation). `decimal.js` 10.6.0 is pinned; its isolated constructor uses 48 significant digits and half-up display rounding. Input snapshots are copied so later input mutations cannot change an already-calculated export.

For direction `d` (+1 buy, −1 sell), entry `E`, initial stop `S`, exit `T`, base units per trade lot `C`, and closed lots `Li`:

```text
Ideal Li = total lots × requested original-position percentage / 100
Quote P/L = d × (T − E) × C × Li
Initial quote risk = abs(E − S) × C × total lots
Directional pips = d × (T − E) / pip size
Individual price R = d × (T − E) / abs(E − S)
Full-position price R = sum(actual lots / total lots × exit price R)
Weighted exit = sum(actual lots × exit price) / sum(actual lots)
Account P/L = quote P/L × constant account-per-quote factor
Gross cash R = whole-position gross account P/L / initial gross account stop risk
```

JPY quote pairs default to a 0.01 pip; others to 0.0001. Pip override affects pip display, not price-based P/L. A common conversion factor makes price and gross cash R mathematically equal, subject to the library's finite precision. Closed-only weighted averages are separately labelled. None of these values is expectancy or a probability.

For volume adjustment, all sizes are exact whole lot-step units. Reserve `ceil(minimum / step)` units for each target and any runner. Distribute spare units in proportion to requested quotas above that minimum, floor those shares, then assign remaining units to the largest fractional remainders. Ties go to earlier target rows, runner last. Total position never increases. Every intermediate nonzero remainder must still satisfy minimum/step rules. The applied-volume P/L is recomputed rather than reusing the original requested percentages. Different broker grids/partial-close permissions require broker confirmation.

## Conversion and costs

The quote currency is explicit. Matching account/quote currencies use exactly one; otherwise a positive manual rate is required. Direct means account per quote; inverse means quote per account, and its reciprocal is used. Changing pair, account or direction clears incompatible inputs. The same constant factor is used for gains, losses, targets, runners and stops, even in base-currency accounts. Actual conversion can change between fills. No live feed or bid/ask spread is claimed.

Optional commission is account currency per standard lot **of 100,000 base units**, per side. Thus a custom 10,000-unit trade lot incurs one-tenth of that rate per trade lot. Full entry commission is charged once, before target exits. Cumulative net cash P/L subtracts it plus exit commissions on actual assumed-filled lots. An open runner has no booked price P/L but its entry fee has already been charged. Every fully closed scenario charges exactly entry plus exits for the full original base-unit exposure. Net R uses **net account P/L / initial gross account stop risk**, never replacing price R. Disabled commission shows gross-only results, not an asserted net result.

Gross risk budgets exclude fees. Hypothetical fills must already reflect spread and slippage; neither is subtracted separately. Financing/swaps, taxes, gaps, partial fills, broker settlement rounding, margin and liquidation are not modeled. Stops do not guarantee a maximum loss.

## Worked-example verification

The supplied EUR/USD buy example (entry 1.1000, stop 1.0950, 1 lot at 100,000 units, 50/30/20% at 1.1050/1.1100/1.1150) is implemented as both initial/sample inputs and tests:

- 50-pip stop; USD 500 initial gross stop risk.
- Partial lots 0.50/0.30/0.20; partial gross USD 250/300/300.
- Combined gross USD 850; 1.70R; weighted exit 1.1085.
- Stop first −USD 500; TP1/original stop USD 0; TP1/entry stop USD 250.
- TP1+TP2/original stop USD 450; TP1+TP2/entry stop USD 550.
- USD 3.50 per standard lot per side gives USD 7 full commission, USD 843 all-target net and 1.686 net/gross-risk R. Price R stays 1.70R.

Sell and JPY equivalents, inverse conversion, small-volume proposals, runner handling and financial invariants are covered separately.

## Sources and decisions

The provided brief's formulas and worked example, existing `forex.ts` conventions and the installed decimal.js README were actually read. The decimal.js README recommends string inputs and documents isolated precision and immutability. The installed Next.js client-component documentation was consulted for rendering boundaries.

HTTPS requests attempted on 10 November 2026:

- `https://www.ig.com/en/glossary-trading-terms/pip-definition`
- `https://www.cftc.gov/LearnAndProtect/forexfrauds`

Both were blocked by the environment proxy with `CONNECT tunnel failed, response 403`; no page content was retrieved. They are labelled unverified further-reading candidates, not confirmed citations. No independent trading audit, author credential or editorial approval is claimed. No unresolved schedule/source assumption is hidden in the arithmetic; broker-specific specifications remain user-entered assumptions requiring actual broker confirmation.

Per-exit FX rates, custom scenario stops, unsupported/custom symbols, standalone spread/slippage estimates, financing, margin/leverage, live broker/order execution and shareable or saved plans are deliberately not implemented. These require separate specifications. Existing quote/account conversion behavior in other calculators is unchanged.

## Files and validation

- `src/app/tools/forex-multi-target-calculator/page.tsx`: page, worked example, guide, metadata and schema.
- `src/lib/calculators/multi-target.ts`: pure decimal engine, validation, exact unit allocation, commission and scenarios.
- `src/lib/calculators/multi-target-export.ts`: readable plan and CSV with assumptions.
- `src/components/calculators/multi-target-calculator.tsx`, `multi-target-results.tsx`, `multi-target.module.css`: form/state, result views and scoped styles.
- `src/app/tools/page.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/lib/site.ts`: tool discovery and sitemap inclusion.
- `package.json`, `package-lock.json`: pinned decimal dependency and integrity metadata.
- `tests/multi-target-math.spec.ts`, `tests/multi-target.spec.ts`: pure financial and browser tests.
- `docs/forex-multi-target-calculator.md`: this implementation record.

Validation commands:

```sh
npm run typecheck
npm run lint
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/multi-target-math.spec.ts tests/multi-target.spec.ts tests/calculators.spec.ts tests/foundation.spec.ts tests/navigation.spec.ts --reporter=line
```

The implementation passed type checks, lint, production build and **44 tests**: 13 pure calculation tests, eight new browser tests and 23 existing calculator/foundation/navigation tests. Browser coverage includes initial HTML with JavaScript disabled, hydration, metadata/schema/sitemap, exact sample amounts, errors, runner/stop feasibility, risk sizing, volume adjustment, one/ten targets, conversion, sell/JPY, CSV/clipboard, print styles and reset. Responsive checks at 320, 390, 768 and 1440 pixels verify 18px Manrope body type and no page overflow or browser errors. Result and mobile-input screenshots were visually inspected. Print invocation and print CSS were tested; physical paper output is not claimed.

After completing assumption columns in CSV and copying input snapshots, type checks, lint and production build passed again, and all **21 feature-specific calculation/browser tests** were rerun successfully. Existing unrelated suites were not repeated after those localized changes.

The feature is local on `feat/forex-multi-target-calculator`. It has not been pushed or deployed; the current brief requires approval before deployment or external-service changes.
