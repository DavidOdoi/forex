# Gold & Silver Prices Today: Live Spot Charts & Ratio — completed handover

## Final metadata

| Field | Final value |
| --- | --- |
| SEO title | Gold & Silver Prices Today: Live Spot Charts & Ratio (52 characters) |
| Meta description | Compare gold and silver spot prices in USD and ZAR. View charts, check the gold-silver ratio, compare performance and calculate the spot value of either metal. (159 characters) |
| Requested URL | `/gold-silver-prices/` |
| Canonical URL | `https://devinforex-five.vercel.app/gold-silver-prices` |
| Canonical slug | `/gold-silver-prices` |
| H1 | Gold and silver spot prices |
| Editorial author | David Odoi; linked existing factual profile |
| Editorial update | 7 November 2026; separate from quote/FX timestamps |

Two-metal destination: aligned gold/silver quotes, ratio, comparable performance, separate calculators and silver-specific industrial/supply context. Canonical slash normalization follows the existing site; a trailing slash redirects to this canonical URL.

## Complete page copy in clean Markdown

The block below exports the complete implemented server-visible copy, including FAQs and source anchors. Double-brace fields are data bindings, never literal publishable prices. Render a validated value with its as-of time or a specific unavailable state. Controls update their labels/results interactively; do not freeze an example quote in the article.

```markdown
Devin Forex / Precious metals

# Gold and silver spot prices

Two metals. A clearer comparison.

Compare gold and silver spot prices in USD per troy ounce. Check both metals, estimate their value and see how many silver ounces equal one gold ounce.

## Gold and silver spot prices today

- Display currency (USD; ZAR; EUR; GBP)

### Gold · XAU/USD

Price per troy ounce · selected currency: **{{gold.converted_price}}**

Today vs UTC open · USD: {{gold.today_amount_and_percent_or_unavailable}}

Status: {{gold.freshness_status}}. Provider updated {{gold.source_timestamp_utc}}.

### Silver · XAG/USD

Price per troy ounce · selected currency: **{{silver.converted_price}}**

Today vs UTC open · USD: {{silver.today_amount_and_percent_or_unavailable}}

Status: {{silver.freshness_status}}. Provider updated {{silver.source_timestamp_utc}}.

Source: [Gold API indicative spot feed](https://gold-api.com/faqs). Updates checked every 30 seconds while this tab is visible. Provider time means last source fetch, not a trade timestamp. Market-open status and underlying delay are not verified.

Choose ZAR, EUR or GBP for an estimated local-currency value. [How our data works](#data-sources)

Relative value, not a trading signal

## The gold-silver ratio

Gold ÷ silver, using USD per troy ounce for both metals.

**{{gold_silver_ratio_or_unavailable}}** 1 oz of gold ≈ {{validated_ratio}} oz of silver. Requires two recent quotes within 60 seconds of each other.

See the movement

## Gold and silver price charts

USD · daily averages · UTC

Historical lines use completed UTC-day average spot prices, not closing prices or futures. Current quotes above are separate. A daily average can hide larger intraday moves.

Historical chart loads when it approaches the screen.

Know the spot value

## Gold and silver value calculators

Estimate each metal independently using the same weight convention. A kilogram of silver and a kilogram of gold have the same mass, but very different spot values.

### Gold value

- Calculate (Weight → value; Budget → weight)

- Weight

- Weight unit (Troy ounces; Grams; Kilograms)

- Display currency (USD; ZAR; EUR; GBP)

- Purity (Pure gold basis (100%); 999.9 fine (99.99%); 22 karat (91.67%); 18 karat (75%); 14 karat (58.33%))

Estimated spot metal value

{{calculated_result}}

Reference quote: {{gold.source_timestamp_utc}}. Status: {{gold.freshness_status}}. FX reference if applicable: {{currency.reference_date}}. Uses unrounded inputs; display values are rounded.

### Silver value

- Calculate (Weight → value; Budget → weight)

- Weight

- Weight unit (Troy ounces; Grams; Kilograms)

- Display currency (USD; ZAR; EUR; GBP)

- Purity (Pure silver basis (100%); 999 fine (99.9%); Sterling (92.5%))

Estimated spot metal value

{{calculated_result}}

Reference quote: {{silver.source_timestamp_utc}}. Status: {{silver.freshness_status}}. FX reference if applicable: {{currency.reference_date}}. Uses unrounded inputs; display values are rounded.

**Spot value is a starting point.** Results exclude dealer premiums or discounts, buy-sell spreads, assay charges, tax/VAT, shipping, insurance and storage. Tax treatment varies by country and product. A resale offer may be below spot.

A consistent basis

## Gold vs silver: performance and conversions

“Recent” means the last 7 or 30 calendar days, compared using completed daily averages in USD. The baseline is the latest available observation on or before the target date, up to four days earlier. YTD starts from the last available average before 1 January. Missing coverage stays unavailable.

Spot quotes, daily-average returns and weight conversions

| Measure | Gold | Silver |
| --- | --- | --- |
| Latest quote · USD/oz | {{validated_provider_measure_or_unavailable}} | {{validated_provider_measure_or_unavailable}} |
| Today vs UTC open · USD | {{validated_provider_measure_or_unavailable}} | {{validated_provider_measure_or_unavailable}} |
| 7-day · daily-average change | {{validated_provider_measure_or_unavailable}} | {{validated_provider_measure_or_unavailable}} |
| 30-day · daily-average change | {{validated_provider_measure_or_unavailable}} | {{validated_provider_measure_or_unavailable}} |
| Year to date · daily-average change | {{validated_provider_measure_or_unavailable}} | {{validated_provider_measure_or_unavailable}} |
| 52-week high / low · USD/oz | {{validated_provider_measure_or_unavailable}} | {{validated_provider_measure_or_unavailable}} |
| 1 troy ounce · USD | {{validated_provider_measure_or_unavailable}} | {{validated_provider_measure_or_unavailable}} |
| 1 gram · USD | {{validated_provider_measure_or_unavailable}} | {{validated_provider_measure_or_unavailable}} |
| 1 kilogram · USD | {{validated_provider_measure_or_unavailable}} | {{validated_provider_measure_or_unavailable}} |

Today’s change compares the latest quote with the provider’s first observation since 00:00 UTC. It is not a previous-New-York-close return. The 52-week range covers 364 completed days and appears only with sufficient provider coverage. Historical requests are cached for up to 12 hours; today’s opening reference for up to one hour.

By [David Odoi](/authors/david-odoi) · Editorial update 7 November 2026 [Sources & methodology](#data-sources)

Read the relationship

## What the gold-silver ratio tells you

A higher ratio means gold costs more ounces of silver; a lower ratio means fewer. Hypothetically, USD 2,400 gold divided by USD 30 silver gives 80:1. Those numbers explain the maths and are not current quotes.

The relationship changes across monetary regimes, industrial cycles and periods of market stress. There is no fixed “correct” ratio, and a move away from a historical average need not reverse. A ratio alone ignores spreads, financing, taxes and the risk of both metals falling together.

## What moves gold and silver differently?

Shared market drivers, different demand patterns

| Driver | Gold | Silver |
| --- | --- | --- |
| Dollar and real yields | Affect investment demand and the cost of holding a non-yielding asset. | Also matter, alongside sensitivity to industrial conditions. |
| Physical demand | Jewellery, investment bars and coins, and central-bank reserve purchases. | Industrial fabrication, solar cells, electronics, jewellery and investment. |
| Supply | Mine production and recycling respond on different timescales. | Often produced alongside other metals, so supply is not driven by silver prices alone. |
| Risk and liquidity | Safe-haven flows can matter, without preventing losses. | A smaller market and industrial exposure can contribute to sharper percentage swings. |

Consult the [Silver Institute’s supply-and-demand research](https://silverinstitute.org/silver-supply-demand/) for industrial uses, and [World Gold Council demand research](https://www.gold.org/goldhub/research/gold-demand-trends) for gold. Central-bank reserve buying is a gold-specific driver; it should not be assumed to support silver in the same way.

## Comparing metal prices in South Africa

The ZAR estimate combines a USD metal quote with a dated currency reference rate. Rand weakness can lift the rand value even when the dollar metal price is unchanged. An actual South African bullion or broker quote can differ because of product premiums, spreads and applicable taxes.

If you choose derivatives, our [South African trading guide explains FSCA and derivatives-provider checks](/insights/how-to-start-forex-trading-in-south-africa). Authorisation must match the legal entity, product and client relationship; a logo or registration number alone is insufficient.

## Choose your exposure before choosing a platform

Physical bullion involves ownership, custody and resale costs. Exchange-traded products depend on their structure and fees. Futures and precious-metals CFDs involve contract specifications and potentially leverage; a metal symbol alone does not identify what you own.

Read our [trading-platform comparison guide](/insights/best-platforms-for-day-trading) for charting and order features. For the gold-only quote, purity adjustment and market explanations, use the [gold price hub and value calculator](/gold-price). Our separate [forex calculator collection](/tools) covers currency contracts, not bullion ownership.

**Risk and commercial disclosure:** Metal prices can fall, and leverage can accelerate losses. These pages provide information, not personal advice. There are no affiliate referrals or paid broker recommendations on these dashboards.

Clear answers

## Gold and silver FAQs

### What are the current gold and silver spot prices?

Use the two price cards above for the latest available indicative quotes. Both are USD per troy ounce, with separate UTC timestamps. Currency conversions use dated daily reference rates, so they are estimates rather than executable local-market offers.

### What is the gold-silver ratio?

Divide the gold price per troy ounce by the silver price per troy ounce in the same currency. A hypothetical ratio of 80 means one ounce of gold has the spot value of 80 ounces of silver. We suppress the current ratio if either quote is stale or their timestamps are too far apart.

### Why do gold and silver prices move together?

Both respond to dollar moves, interest rates and investment demand. Silver also has substantial industrial uses, so manufacturing and technology demand can pull it away from gold. Their correlation changes over time.

### Is silver more volatile than gold?

Silver often has larger percentage swings, partly because its market is smaller and industrial demand matters more. That is a tendency, not a promise for every period. Compare percentage changes over matching dates rather than the metals’ dollar prices.

### What is the difference between spot price and dealer price?

Spot is a metal-market reference. A dealer’s price reflects the particular product, premium or discount, buy-sell spread, taxes and delivery costs. The same budget can buy different quantities from different dealers.

### Can I trade gold and silver without buying physical metal?

Some regulated markets offer metal-backed exchange-traded products, futures or CFDs. Availability depends on your country and provider. These products differ in ownership, margin, financing and counterparty exposure; CFDs do not give you ownership of bullion.

Know what you’re looking at

## Data sources, timing and corrections

- **Metal quotes:** [Gold API documentation](https://gold-api.com/docs) describes USD spot references per troy ounce. Its UTC update time records a source fetch. This is an indicative feed with no independently verified exchange delay or executable bid/ask.
- **Currency conversions:** [Frankfurter’s daily reference-rate documentation](https://frankfurter.dev/) explains its central-bank-sourced blended rates. We request the last completed UTC date and show the actual returned date; this is not live FX.
- **History:** Provider daily averages are separate from live quotes. Intraday history is not connected. Where historical access or coverage is missing, charts and returns say unavailable. We do not join a current quote to a daily series or manufacture an all-time high.

The current ratio uses recent, time-aligned USD quotes. Performance comparisons use matching daily-average conventions, avoiding a misleading comparison between gold’s dollar move and silver’s percentage move. Quotes older than five minutes are marked stale; the ratio is withheld if quote times differ by more than one minute.

Editorial copy and calculation rules are maintained separately from provider timestamps. See [our research methodology](/about#research-methodology) and [how to request a correction](/about#corrections). Public source documentation and calculations were checked on 7 November 2026. Nothing here guarantees availability or a trading result.

![Gold and silver spot prices ratio diagram: gold per troy ounce divided by silver per troy ounce](https://devinforex-five.vercel.app/images/metals/gold-silver-price-comparison-dashboard.png)

Original DEVIN FOREX explanatory diagram. No current prices are embedded.
```

## Full heading structure

- H1: Gold and silver spot prices
  - H2: Gold and silver spot prices today
    - H3: Gold XAU /USD
    - H3: Silver XAG /USD
  - H2: The gold-silver ratio
  - H2: Gold and silver price charts
  - H2: Gold and silver value calculators
    - H3: Gold value
    - H3: Silver value
  - H2: Gold vs silver: performance and conversions
  - H2: What the gold-silver ratio tells you
  - H2: What moves gold and silver differently?
  - H2: Comparing metal prices in South Africa
  - H2: Choose your exposure before choosing a platform
  - H2: Gold and silver FAQs
    - H3: What are the current gold and silver spot prices?
    - H3: What is the gold-silver ratio?
    - H3: Why do gold and silver prices move together?
    - H3: Is silver more volatile than gold?
    - H3: What is the difference between spot price and dealer price?
    - H3: Can I trade gold and silver without buying physical metal?
  - H2: Data sources, timing and corrections

Each page has exactly one H1. Quote and calculator H3s belong to their preceding H2. FAQ H3s are visible question summaries, with matching answers in schema.

## UI and module specification

| Order | Module | Behaviour |
| --- | --- | --- |
| 1 | Breadcrumb, H1, short introduction | White background, black text, immediate price intent; no affiliate CTA before useful information. |
| 2 | Dual metal quotes | Large USD/troy-ounce reference, daily change only with verified UTC opening baseline, per-metal status and UTC timestamp. Currency selector supports USD/ZAR/EUR/GBP. |
| 3 | Source line and section navigation | Explain indicative data and daily FX; refresh button, stable anchors, sticky navigation on wide screens. |
| 4 | Current gold-silver ratio | Only show with fresh aligned quotes; same currency and units; no buy/sell signal. |
| Next | Historical chart module | Two individually labelled, side-by-side gold/silver charts; 24H, 7D, 30D, 6M, 1Y and 5Y controls. Stack on mobile; do not imply matching Y-axis scales. |
| Next | Value calculator | Independent gold and silver calculators with troy-ounce/gram/kilogram units, USD/ZAR/EUR/GBP and purity. Gold includes karat/fineness; silver includes fine/sterling options. |
| Next | Performance/conversion table | Distinguish current quote and UTC-open change from completed-daily-average returns. Include actual baseline/end dates and source coverage. |
| Next | Unique explanations, relevant resources, FAQs | Ratio interpretation, industrial demand, gold/silver differences, South African currency context and product exposure. Short paragraphs, tables and contextual links. |
| Last | Sources, corrections, original illustration | Named author, methodology, limitations, no invented expertise or broker endorsements. |

Use 16px body copy and comparison-table cells, short paragraphs, 44px controls, strong focus states, a responsive white layout and restrained gold/silver accents. Small utility labels and source timestamps are secondary UI. Reserve card/chart space; the interface must never turn a missing quote into `0.00`.

## Chart and calculator specification

Two individually labelled, side-by-side gold/silver charts; 24H, 7D, 30D, 6M, 1Y and 5Y controls. Stack on mobile; do not imply matching Y-axis scales. Historical points are provider **completed daily averages**, not closes. The current quote is never attached to this line. 24H displays an explicit unsupported explanation on the connected free daily-data plan. No dummy chart is published while historical access is absent.

Independent gold and silver calculators with troy-ounce/gram/kilogram units, USD/ZAR/EUR/GBP and purity. Gold includes karat/fineness; silver includes fine/sterling options. Use exact troy conversion, dated FX, fine-metal fraction and unrounded arithmetic; display errors for invalid input, missing data and overflow. Explain that results exclude retail costs and tax. Full formulas, period definitions, coverage guards, accessible table pagination and cache limits are in [data-and-operations.md](data-and-operations.md).

## Contextual internal-link plan — exact implemented anchors

| Anchor text | Existing destination |
| --- | --- |
| David Odoi | `/authors/david-odoi` |
| South African trading guide explains FSCA and derivatives-provider checks | `/insights/how-to-start-forex-trading-in-south-africa` |
| trading-platform comparison guide | `/insights/best-platforms-for-day-trading` |
| gold price hub and value calculator | `/gold-price` |
| forex calculator collection | `/tools` |
| our research methodology | `/about#research-methodology` |
| how to request a correction | `/about#corrections` |

Every destination above was checked against the local production app. Header and footer supply incoming links to both hubs. Unbuilt `/xau-usd/`, `/silver-trading/`, `/gold-vs-bitcoin/`, `/gold-price-history/`, `/best-gold-brokers/`, `/gold-cfd-trading/` and `/precious-metals-cfds/` are deferred destinations, not live links. No extra thin pages were made to satisfy a keyword list.

## External-link plan — exact source anchors

| Anchor text | Authoritative destination |
| --- | --- |
| Gold API indicative spot feed | `https://gold-api.com/faqs` |
| Silver Institute’s supply-and-demand research | `https://silverinstitute.org/silver-supply-demand/` |
| World Gold Council demand research | `https://www.gold.org/goldhub/research/gold-demand-trends` |
| Gold API documentation | `https://gold-api.com/docs` |
| Frankfurter’s daily reference-rate documentation | `https://frankfurter.dev/` |

These sources support actual methodology or market explanations. They are not affiliate links. Public provider terms, editorial references and authenticated production history were checked on 7 November 2026. See [the connection verification record](README.md) for actual coverage and remaining optional-field limitations.

## Image and social-card plan

- Original asset: `https://devinforex-five.vercel.app/images/metals/gold-silver-price-comparison-dashboard.png`.
- Alt text: “Gold and silver spot prices ratio diagram: gold per troy ounce divided by silver per troy ounce”.
- Dimensions: **1200×630**, explicit intrinsic size; original PNG about 27 KB, with editable SVG source beside it.
- Responsive Next image, lazy-loaded below the fold; no stock photo, personal account screenshot, stale hard-coded market price or invented performance line.
- Open Graph: `og:type=website`, unique title/description above, canonical `og:url`, Devin Forex site name, this image and dimensions/alt.
- Twitter: `summary_large_image`, the same page-specific title/description and unique image.

## Canonical, indexing and schema

```html
<link rel="canonical" href="https://devinforex-five.vercel.app/gold-silver-prices" />
```

Production page is index/follow, included in XML sitemap and discoverable through header/footer/cross-hub links. Preview deployments remain noindex. Public supporting API endpoints are noindex; neither creates a third keyword landing page.

The following JSON-LD is the implemented recommendation, not an invented Product/Review/Dataset claim. Its FAQ answers match the full visible copy above. The editorial modification date does not impersonate a fresh market observation. FAQ markup does not imply Google will grant a rich result to a financial site.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://devinforex-five.vercel.app/#organization",
      "name": "Devin Forex",
      "url": "https://devinforex-five.vercel.app"
    },
    {
      "@type": "Person",
      "@id": "https://devinforex-five.vercel.app/authors/david-odoi#person",
      "name": "David Odoi",
      "url": "https://devinforex-five.vercel.app/authors/david-odoi"
    },
    {
      "@type": "WebPage",
      "@id": "https://devinforex-five.vercel.app/gold-silver-prices#webpage",
      "url": "https://devinforex-five.vercel.app/gold-silver-prices",
      "name": "Gold & Silver Prices Today: Live Spot Charts & Ratio",
      "description": "Compare gold and silver spot prices in USD and ZAR. View charts, check the gold-silver ratio, compare performance and calculate the spot value of either metal.",
      "inLanguage": "en",
      "dateModified": "2026-11-07",
      "author": {
        "@id": "https://devinforex-five.vercel.app/authors/david-odoi#person"
      },
      "publisher": {
        "@id": "https://devinforex-five.vercel.app/#organization"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://devinforex-five.vercel.app/images/metals/gold-silver-price-comparison-dashboard.png",
        "width": 1200,
        "height": 630
      },
      "breadcrumb": {
        "@id": "https://devinforex-five.vercel.app/gold-silver-prices#breadcrumb"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://devinforex-five.vercel.app/gold-silver-prices#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://devinforex-five.vercel.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Gold and silver spot prices",
          "item": "https://devinforex-five.vercel.app/gold-silver-prices"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://devinforex-five.vercel.app/gold-silver-prices#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the current gold and silver spot prices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the two price cards above for the latest available indicative quotes. Both are USD per troy ounce, with separate UTC timestamps. Currency conversions use dated daily reference rates, so they are estimates rather than executable local-market offers."
          }
        },
        {
          "@type": "Question",
          "name": "What is the gold-silver ratio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Divide the gold price per troy ounce by the silver price per troy ounce in the same currency. A hypothetical ratio of 80 means one ounce of gold has the spot value of 80 ounces of silver. We suppress the current ratio if either quote is stale or their timestamps are too far apart."
          }
        },
        {
          "@type": "Question",
          "name": "Why do gold and silver prices move together?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Both respond to dollar moves, interest rates and investment demand. Silver also has substantial industrial uses, so manufacturing and technology demand can pull it away from gold. Their correlation changes over time."
          }
        },
        {
          "@type": "Question",
          "name": "Is silver more volatile than gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Silver often has larger percentage swings, partly because its market is smaller and industrial demand matters more. That is a tendency, not a promise for every period. Compare percentage changes over matching dates rather than the metals’ dollar prices."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between spot price and dealer price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spot is a metal-market reference. A dealer’s price reflects the particular product, premium or discount, buy-sell spread, taxes and delivery costs. The same budget can buy different quantities from different dealers."
          }
        },
        {
          "@type": "Question",
          "name": "Can I trade gold and silver without buying physical metal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Some regulated markets offer metal-backed exchange-traded products, futures or CFDs. Availability depends on your country and provider. These products differ in ownership, margin, financing and counterparty exposure; CFDs do not give you ownership of bullion."
          }
        }
      ]
    }
  ]
}
```

## Performance, mobile and content maintenance

Server-render the useful quote/copy, cache quotes for 30 seconds, pause hidden-tab polling, lazy-load chart code near the viewport, paginate the optional chart data table, reuse local fonts and avoid third-party widgets. Keep the current price within the first mobile screen and stack quotes, charts and calculators at small widths. Ensure no horizontal page overflow at 320px.

Target real-user p75 LCP ≤2.5s, INP ≤200ms and CLS ≤0.1; do not claim measured field performance before collecting it. See [the operational plan](data-and-operations.md) for exact checks, refresh cadence, alerting follow-up, error states and source-review schedule.

## Verification before publication and claims to withhold

- Revalidate every current quote, FX observation, timestamp, return, ratio and range at runtime. No financial test values are production data.
- Authenticated production series and chart/return calculations were verified on 7 November 2026. See [the connection record](README.md). Recheck date/decimal formats, coverage, OHLC windows, truncation and quota after future provider changes; missing optional values remain unavailable.
- Verify any future country-specific broker authorisation or tax statement from current primary evidence. There is no affiliate recommendation in this release.
- Withhold “real-time executable price”, zero delay, complete all-time coverage, guaranteed returns/safety/withdrawals, a predictive ratio, universal VAT rates and Google-ranking promises without the necessary evidence or legal review. A daily FX reference must not be called live FX.

See [data-and-operations.md](data-and-operations.md) for the full claim-verification list and legal/data limits.
