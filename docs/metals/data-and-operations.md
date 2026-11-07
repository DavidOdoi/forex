# Data contract and operational checks

## Quote and FX sources

| Purpose | Source | Contract and limitation |
| --- | --- | --- |
| Current gold | `https://api.gold-api.com/price/XAU` | `price`: USD per troy ounce; `symbol`: XAU; `currency`: USD; `updatedAt`: UTC source-fetch time. No bid/ask or independently verified exchange delay. |
| Current silver | `https://api.gold-api.com/price/XAG` | Same contract for XAG. |
| Currency conversion | `https://api.frankfurter.dev/v2/rates?base=USD&quotes=ZAR,EUR,GBP&date=YYYY-MM-DD` | Query the previous completed UTC date. Each result has `base`, `quote`, `rate`, `date`. The returned observation can be earlier because of non-business days. Daily blended reference, not executable FX. |
| Completed daily spot averages | `https://api.gold-api.com/history` | Server-side `x-api-key`. Query `symbol`, `startTimestamp` (1800-01-01 UTC), `endTimestamp` (last completed UTC second), `groupBy=day`, `aggregation=avg`, `orderBy=asc`. Consume `day`, `avg_price`; validate rather than treating max/close as average. |
| UTC-day opening reference | `https://api.gold-api.com/ohlc/{symbol}?startTimestamp=UTC_MIDNIGHT_SECONDS` | Compare the current quote with this segment’s `open`, only when both belong to the current UTC day. Cache the reference for one hour. This is not a New York prior-close return. |
| Completed 52-week range | `/ohlc/{symbol}?startTimestamp=START&endTimestamp=END` | 364 completed UTC days. Validate OHLC fields and window bounds; require daily coverage reaching the start, at least 200 observations within the window and a latest observation no more than four days old. This is the provider’s observed range, not every venue’s high/low. |

The long-history start requests all observations the provider can return since 1800, not a promise that the provider has continuous data since then. Show actual returned coverage. The first authenticated response must verify that negative Unix timestamps are accepted and whether any pagination or provider truncation applies. If not, adapt to the documented supported start and label the resulting scope; never fabricate older prices. All-time highs remain unasserted because complete market history is not established.

## Checked primary sources

Public sources below returned HTTP 200 on 7 November 2026 (LBMA’s older URL redirects to the canonical endpoint shown). Access checks establish availability, not an independent audit of every underlying quote.

- [Gold API documentation](https://gold-api.com/docs), [API field contract](https://gold-api.com/llms.txt), [timing/units FAQ](https://gold-api.com/faqs), [free-plan limits](https://gold-api.com/pricing), [commercial-use terms, section 9](https://gold-api.com/terms).
- [Frankfurter documentation](https://frankfurter.dev/): daily blended rates, commercial use, caching and reference-rate limitations.
- [World Gold Council’s Gold Demand Trends](https://www.gold.org/goldhub/research/gold-demand-trends): gold demand and central-bank purchases.
- [LBMA precious-metal benchmarks](https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices): scheduled benchmarks distinct from spot feeds.
- [Federal Reserve Bank of St. Louis real-yield series](https://fred.stlouisfed.org/series/DFII10): real-yield context, not a gold-price forecast.
- [Silver Institute supply-and-demand research](https://silverinstitute.org/silver-supply-demand/): industrial demand and supply context. It is an industry body; no forecast from it is presented as certainty.

## Validation and state handling

- Reject wrong symbols, non-USD metal quotes, missing/non-UTC timestamps, invalid prices and quotes more than one minute in the future.
- Show source time separately from retrieval time. Provider time is its source-fetch time, not exchange execution time or proof a market is open. No market-open indicator is inferred from a refreshing timestamp.
- A quote older than five minutes is stale. Show the age/time and label it; never refresh the old timestamp just because an HTTP request succeeded. Stale prices may still support an explicitly labelled estimate.
- Current ratio requires both quotes to be recent and within 60 seconds of each other. Otherwise withhold it.
- Reject future-dated FX. Reject FX more than seven days older than the requested reference date; the client also ages out old cached rates. USD remains usable without FX.
- Never fill a missing day with a synthetic observation. Exclude incomplete current-day averages. Sort and deduplicate history. Source gaps remain visible in the accessible table and coverage note.
- If a refresh fails, retained quotes preserve original timestamps and an error message appears. If no prior quote exists, say unavailable. Independent metal and FX failures must not become a zero price.
- A missing/invalid historical key must not stop current quotes, calculators or editorial content. Do not expose upstream error payloads or authentication details.

## Calculation definitions

Let `P` be USD per fine troy ounce, `R` be quote-currency units per USD, `f` be purity as a fraction, and `w` be gross weight in troy ounces.

```text
1 troy ounce = 31.1034768 grams
1 kilogram = 1,000 grams
w = grams / 31.1034768
spot value in selected currency = w × P × R × f
weight represented by a budget = budget / (value of one chosen weight unit)
gold-silver ratio = gold USD/oz ÷ silver USD/oz
today's amount change = current USD quote − first observation since 00:00 UTC
today's percentage change = (current / UTC open − 1) × 100
period percentage change = (latest completed daily average / baseline daily average − 1) × 100
```

Weekly and monthly comparisons look back 7 and 30 calendar days from the latest completed observation. Pick the latest observation on or before that target, within four calendar days, otherwise unavailable. YTD uses the last observation before 1 January of the current UTC year, with the same four-day tolerance. Reject a latest daily observation more than four days old. Show each actual baseline/end date. These are **daily-average changes**, not closing returns or total investment returns.

Purities are explicitly stated: theoretical 22/24, 18/24 and 14/24 gold fractions; 999.9 gold; 999 and 925 silver; pure-metal basis. Jewellery markings and assay results can differ. A theoretical result does not establish recoverable fine content or resale proceeds.

No retail premium, spread, assay, tax/VAT, delivery, custody or financing assumptions are silently included. Results use unrounded data and round only the display. Inputs must be finite and non-negative; enforce limits and reject overflow. No broker lot size, pip value or CFD liquidation price is inferred from a troy ounce.

## Chart contract

- Use genuine `avg_price` observations, with USD/troy oz on the axis and UTC dates.
- Ranges: 24H, 7D, 30D, 6M (183 days), 1Y (365), 5Y (1,826); gold also has All. 24H is explicitly unavailable on the connected free daily plan. Do not fake support by stretching one or two daily points.
- Supported history ends at the last completed returned observation. Display actual coverage; sparse coverage does not imply a full five-year record.
- Comparison charts remain side by side on desktop and stack on mobile. They have separate labelled scales; similar line shapes or heights do not imply equal returns. A normalized combined chart is not part of this release.
- Downsample long ranges into time buckets, retaining endpoints and within-bucket extremes. Never downsample the data used for return calculations. A full selected-range data table is accessible in 50-row pages without requiring hover.
- Keep source fetch time and data observation date distinct. Do not append the current quote to a completed-daily-average line.

## Caching and security

Quotes share Next’s 30-second data cache. The browser checks the same-origin `/api/metals` every 30 seconds while visible, pauses hidden-tab polling and refreshes on return. Values update without changing the page structure.

Authenticated history is fetched only by the server. Daily series and 52-week windows cache for 12 hours; today’s opening reference caches for one hour. Whole history results, including failures, cache for one hour. Configuration is checked at request time: the supporting history endpoint uses `no-store`, so a missing-key response cannot be prerendered or retained by a CDN. Data-cache identity includes a server-only credential hash so changing a key does not reuse a failure from an old key. Stable UTC boundaries avoid a new upstream URL per visitor. Public routes accept no user-selected upstream URL or time window.

With one shared Next data cache and no outside consumers of the same key, the initial load needs six history/OHLC calls for both metals; routine refreshes usually need two per hour, plus at most four 12-hour refreshes. This fits the currently documented shared ten-call hourly free allowance. Deployments, simultaneous cold regions, manual cache purges or another application using the key can exhaust it. Verify the actual account counter after setup; use one production region/cache and increase TTLs or add a shared rate gate if needed. Do not promise the free limit cannot be exceeded under every deployment topology.

The API routes send `X-Robots-Tag: noindex`; quotes have public cache headers, while history configuration is checked through a `no-store` endpoint backed by the shared server data cache. Public history failures expose only a fixed issue category and HTTP status, never raw error payloads, credential values or credential hashes. There is no `NEXT_PUBLIC_` API key. Do not log header values or raw provider error bodies.

## Core Web Vitals and mobile checks

The page shell, editorial text and latest quote are server-rendered; chart code is dynamically imported near the viewport. No third-party chart widget, advertising SDK or new charting dependency is added. The original 1200×630 PNG illustrations are about 23–27 KB, have intrinsic dimensions and are lazy-loaded below the fold. Next responsive images provide suitable variants.

Reuse existing local font files with swap behaviour. Do not preload non-critical media. Quote containers and chart placeholders reserve space. SVG axes remeasure to the actual container width; labels are not shrunk by squeezing a desktop-only chart into mobile. Below-the-fold data tables are paged and only mounted when opened.

Controls have 44px minimum targets, visible focus, mobile decimal inputs and explicit unit/currency labels. Check 320px, 390px and desktop widths, keyboard operation, loss/gain labels, reduced motion, slow connections, disabled JavaScript and provider failure. Check both quotes and calculators at 200% zoom.

Targets after real deployment: p75 LCP ≤2.5s, INP ≤200ms and CLS ≤0.1. These are monitoring targets, not measured field results or a guarantee of passing. Use Lighthouse for laboratory diagnosis; verify real-user performance through Search Console/CrUX when sufficient traffic exists. Network cache performance and source latency need production measurement.

## Content and data-update plan

| Cadence | Action |
| --- | --- |
| Every visible 30 seconds | Refresh indicative metal quotes through the shared cache; age retained quotes even after errors. |
| Daily | Request the last completed FX date; display actual returned observation date. Roll historical day boundaries in UTC. |
| Hourly / 12-hour | Refresh opening references / completed history as above; check source coverage and quota errors. |
| Weekly after launch | Check provider success rate, timestamp skew, cache hit rate and mobile stability; alert on persistent unavailable/stale states. Monitoring/alerts are operational follow-up, not claimed as already deployed. |
| Monthly | Review primary-source links, API terms/free limits, source-unit contracts, author links, UI accessibility and related internal destinations. |
| When product or source changes | Recheck formulas and schema; update visible editorial date only for substantive editorial changes. Add a correction note for a material error. |

Before marking the history connection complete, verify a real authenticated response for each symbol, daily grouping semantics, earliest/latest coverage, negative start acceptance, OHLC window timestamps, no silent truncation and free-plan usage. Then check the actual production chart/return values against source observations and a hand calculation.

## Claims requiring verification before publication or use

- The specific current price, daily change, timestamp, FX rate/date, ratio, returns and range must always come from validated source responses; no hard-coded numbers from a brief or test fixture.
- Public spot and FX contracts, commercial-use terms and external references were checked. Authenticated historical source values remain pending owner configuration and real-response verification.
- An assertion that a source is undelayed, executable, exchange-grade, complete or equivalent to every venue requires evidence not provided here.
- Country/product-specific broker authorisation, tax treatment, premiums, custody terms and any future affiliate agreement need current primary evidence.

## Claims prohibited without additional evidence or legal review

Do not claim guaranteed returns, risk-free trading, certain inflation protection, guaranteed withdrawals, a universally fair ratio, automatic mean reversion or broker safety. Do not assert an all-time high from incomplete history, a live intraday FX rate from daily references, a current executable spread from a midpoint, or a market-open status from a fetch timestamp.

Do not make jurisdiction-specific legal/tax conclusions or recommend a leveraged product to every visitor without the required review. Do not claim a Google ranking, a financial-site FAQ rich result, Google approval, or measured Core Web Vitals merely because metadata/schema are valid. Structured data describes visible content; it is not a ranking promise.
