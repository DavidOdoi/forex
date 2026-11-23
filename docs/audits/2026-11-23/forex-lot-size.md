# Batch 1, calculator 1: Forex Lot Size Calculator

Implemented on 23 November 2026. Only the first calculator in the supplied four-calculator brief was implemented. The pip, margin and profit calculator upgrades have not been started.

## Route and integration

- Canonical: `https://www.devinforex.com/calculators/forex-lot-size-calculator`
- `/tools/forex-position-size-calculator` permanently redirects to this page, preserving query parameters. This avoids publishing a second substantially identical position-sizing page.
- The existing tool catalogue, tools hub, navigation, footer, related calculators and sitemap use the new canonical destination.
- Exactly three visible FAQs match the FAQ schema. The page also has WebApplication and BreadcrumbList structured data, unique metadata and indexable server-rendered explanations.
- Title: **Forex Lot Size Calculator – Position Size & Risk**.
- Description: **Calculate forex lot sizes using your account balance, risk percentage, and stop-loss distance. See pip values, trading costs and risk after broker lot-step rounding.**

## Features

The calculator supports the existing 28 FX pairs and 19 account currencies. Inputs cover balance/equity, percentage or fixed cash risk, stop distance or entry/stop prices, buy/sell direction, contract size, pip size, minimum/maximum volume and lot increment. Example defaults are explicitly labelled; no broker-specific defaults are presented as verified.

Results separate the mathematical size, executable volume under the **entered** limits, base-currency units, pip value, price-movement risk, estimated costs and unused risk budget. A size below the minimum is refused; a maximum-volume cap is disclosed. Two risk choices and nearby valid volumes can be compared.

Round-trip commission per lot and fixed costs can be included inside the budget or shown outside it. Spread is either already included in the stop/execution-price distance or added once separately. Financing, gaps and slippage are not predicted. The optional simple leverage check compares estimated margin with the user's free margin without changing the risk-sized volume; it is not the next calculator from the brief.

Reset, copy results, copy scenario link, clipboard fallback, full URL restoration and a clean canonical on shared URLs are implemented. Shared URLs include the entered account amounts; the interface explains this before copying. No personal inputs are sent to the exchange-rate endpoint.

## Maths and precision

Calculations use an independently configured `decimal.js` instance with 40 significant digits and half-even arithmetic. Intermediate monetary amounts are not rounded to cents. Currency output uses the currency's display precision, with additional precision for small pip values.

```text
risk budget = equity × risk percent / 100
quote-currency pip value per lot = contract units × pip size
account-currency pip value = quote pip value × conversion factor
theoretical lots = budget / (stop pips × pip value per lot)

With costs inside the budget:
theoretical lots = max(0, budget − fixed costs)
                   / (price risk per lot + variable costs per lot)

valid volume grid = minimum lots + n × lot increment, n ≥ 0
rounded size = greatest valid grid volume no larger than the theoretical size
               or the entered maximum
```

Rounding is explicitly downward, followed by a budget check. If the minimum itself exceeds the budget, no executable recommendation is displayed. The minimum-anchored grid is disclosed; users must check that it matches their broker, particularly for unusual minimum/step combinations. Minimums and maximums are assumptions, not broker endorsements.

## Exchange rates

- Manual direct, inverse and two-leg cross rates work without an API key. Optional bid/ask entry uses ask on direct liability conversion and `1 / bid` on inverse conversion.
- If quote and account currencies are identical, the factor is exactly one and no rate is requested. A missing cross-currency path never silently becomes one.
- The optional free provider is [Frankfurter](https://frankfurter.dev/). The server requests the last completed UTC date, validates returned currency/date/rate records and exposes no credentials. These are dated daily reference rates, **not live executable broker quotes**.
- The actual rate date and retrieval time are shown. Rates older than four days are visibly stale. A best-effort warm-instance fallback retains the original dates and is marked cached; it is not a durable rate-history store.
- Unsupported currencies or an unavailable provider require manual entry. Provider failures do not manufacture substitute prices.
- Shared links restore inputs, not a locked historical reference-rate snapshot. Daily-rate results can change between visits; this is disclosed.

## Numerical checks executed

| Case | Verified result |
| --- | --- |
| USD 10,000, 1%, EUR/USD, 50-pip stop, conventional contract | USD 100 budget; USD 10/pip per lot; 0.20 lots; 20,000 EUR; USD 100 planned loss |
| USD/JPY manual 160.00, USD account | 1,000 JPY/pip per lot = USD 6.25; 0.32 lots for the same budget/stop |
| EUR/USD, 30-pip stop | 0.333333… theoretical; 0.33 executable; USD 99 risk |
| USD 1 budget, 100-pip EUR/USD stop, 0.01 minimum | No valid size; minimum would risk USD 10 |
| USD 7/lot round-trip commission plus USD 2 fixed costs | 0.19 lots; USD 95 price risk; USD 3.33 costs; USD 98.33 total |
| Same costs plus separately modelled 2-pip spread | 0.18 lots; USD 96.86 total |
| Same commission/fixed costs outside the budget | 0.20 lots; USD 103.40 total, with an explicit over-budget warning |
| Minimum 0.03, step 0.02, theoretical 0.32 | 0.31 lots on the disclosed grid |
| Same grid with a 0.12 maximum | Maximum valid volume 0.11 lots |

Additional numerical tests cover wrong-side stops, fractional pips, custom contracts, unavailable conversions, bid/ask ordering, future/stale reference dates, nonfinite and extreme inputs, non-grid maximums, currency precision, optional margin currency units and sizing invariants across pairs/budgets/stops.

## Validation results

- Production build: `npm run build -- --webpack` — passed.
- TypeScript: `npx tsc --noEmit` — passed.
- Repository lint: `npm run lint` — passed.
- `tests/lot-size-math.spec.ts`, `tests/lot-size.spec.ts` and `tests/calculators.spec.ts` — **38 tests passed**.
- Browser checks cover no-JavaScript educational content, metadata/schema/FAQ agreement, all contextual internal destinations, the legacy redirect, sitemap inclusion, instant results, fee accounting, manual/daily/stale/error rate states, clipboard success/fallback, saved URL restoration, reset, comparison, margin warnings and keyboard controls.
- Layouts checked at 320, 390, 768 and 1440 pixels without horizontal page overflow or browser exceptions. Mobile has an immediate updating result summary above the inputs and a jump to the full result. Existing calculator pages also passed their regression tests.
- Supporting links to BabyPips, Myfxbook and Frankfurter returned HTTP 200 during the source check. The CFTC forex-risk reference remains a primary-source risk link; none of these sources is an affiliate destination.

Visual records: [desktop](forex-lot-size-desktop.png) and [mobile](forex-lot-size-mobile.png).

## Files

New pure support modules: `precision.ts`, `instruments.ts`, `exchange-rates.ts`, `lot-size.ts` and `lot-scenario.ts` under `src/lib/calculators/`. Supporting copy is in `lot-size-content.ts`. The widget and styles are `lot-size-calculator.tsx` and `lot-size.module.css`. A server rate route was added at `src/app/api/forex-rates/route.ts`, with the public page at `src/app/calculators/forex-lot-size-calculator/page.tsx`.

Existing calculator catalogue/page integration, tool-hub wording, navigation/footer destinations and the legacy redirect were updated. The numerical implementations of the other existing calculators were not changed. `decimal.js` is the only new dependency.

## Limits and next batch boundary

There are no independently verified broker-specific instrument profiles. Users must enter their real minimum, maximum, step, contract, pip convention, fees and eligibility assumptions. Reference rates omit executable conversion spreads. Optional margin is a simplified model, and a stop does not guarantee a maximum loss.

The shared scenario and rate modules are reusable foundations. The existing pip/profit tools still use their own inputs; they have not been upgraded to consume this new scenario format. No new pip, margin or profit page was published in this step. Work stops after pushing this first calculator, as requested.
