# Gold Price Today: Live XAU/USD, Charts & Calculator — completed handover

## Final metadata

| Field | Final value |
| --- | --- |
| SEO title | Gold Price Today: Live XAU/USD, Charts & Calculator (51 characters) |
| Meta description | Check the gold price today per ounce, gram and kilo in USD, ZAR, EUR and GBP. View XAU/USD charts, compare recent changes and estimate your gold’s spot value. (158 characters) |
| Requested URL | `/gold-price/` |
| Canonical URL | `https://devinforex-five.vercel.app/gold-price` |
| Canonical slug | `/gold-price` |
| H1 | Gold price today |
| Editorial author | David Odoi; linked existing factual profile |
| Editorial update | 7 November 2026; separate from quote/FX timestamps |

Gold-only destination: current XAU/USD, unit conversions, purity, spot-value calculation, performance windows and gold price drivers. Canonical slash normalization follows the existing site; a trailing slash redirects to this canonical URL.

## Complete page copy in clean Markdown

The block below exports the complete implemented server-visible copy, including FAQs and source anchors. Double-brace fields are data bindings, never literal publishable prices. Render a validated value with its as-of time or a specific unavailable state. Controls update their labels/results interactively; do not freeze an example quote in the article.

```markdown
Devin Forex / Precious metals

# Gold price today

One clear price. Every useful conversion.

Check the gold price today in USD per troy ounce. Convert to grams, kilos or another currency, and estimate your gold’s spot value.

## Gold price today at a glance

- Display currency (USD; ZAR; EUR; GBP)

### Gold · XAU/USD

Price per troy ounce · selected currency: **{{gold.converted_price}}**

Today vs UTC open · USD: {{gold.today_amount_and_percent_or_unavailable}}

Status: {{gold.freshness_status}}. Provider updated {{gold.source_timestamp_utc}}.

Gold, by weight

1 gram: {{gold.price_per_gram}} · 1 kilogram: {{gold.price_per_kilogram}}

[Calculate your gold’s value](#calculator)

Source: [Gold API indicative spot feed](https://gold-api.com/faqs). Updates checked every 30 seconds while this tab is visible. Provider time means last source fetch, not a trade timestamp. Market-open status and underlying delay are not verified.

Choose ZAR, EUR or GBP for an estimated local-currency value. [How our data works](#data-sources)

See the movement

## Gold price chart

USD · daily averages · UTC

Historical lines use completed UTC-day average spot prices, not closing prices or futures. Current quotes above are separate. A daily average can hide larger intraday moves.

Historical chart loads when it approaches the screen.

Know the spot value

## Gold price calculator

Convert weight into estimated value, or find how much gold a budget represents. Purity adjusts the metal content; it does not estimate a jeweller’s offer.

### Gold value

- Calculate (Weight → value; Budget → weight)

- Weight

- Weight unit (Troy ounces; Grams; Kilograms)

- Display currency (USD; ZAR; EUR; GBP)

- Purity (Pure gold basis (100%); 999.9 fine (99.99%); 22 karat (91.67%); 18 karat (75%); 14 karat (58.33%))

Estimated spot metal value

{{calculated_result}}

Reference quote: {{gold.source_timestamp_utc}}. Status: {{gold.freshness_status}}. FX reference if applicable: {{currency.reference_date}}. Uses unrounded inputs; display values are rounded.

**Spot value is a starting point.** Results exclude dealer premiums or discounts, buy-sell spreads, assay charges, tax/VAT, shipping, insurance and storage. Tax treatment varies by country and product. A resale offer may be below spot.

A consistent basis

## Recent gold-price performance

“Recent” means the last 7 or 30 calendar days, compared using completed daily averages in USD. The baseline is the latest available observation on or before the target date, up to four days earlier. YTD starts from the last available average before 1 January. Missing coverage stays unavailable.

Spot quotes, daily-average returns and weight conversions

| Measure | Gold |
| --- | --- |
| Latest quote · USD/oz | {{validated_provider_measure_or_unavailable}} |
| Today vs UTC open · USD | {{validated_provider_measure_or_unavailable}} |
| 7-day · daily-average change | {{validated_provider_measure_or_unavailable}} |
| 30-day · daily-average change | {{validated_provider_measure_or_unavailable}} |
| Year to date · daily-average change | {{validated_provider_measure_or_unavailable}} |
| 52-week high / low · USD/oz | {{validated_provider_measure_or_unavailable}} |
| All-time high | Not asserted: complete market history is not verified. |
| 1 troy ounce · USD | {{validated_provider_measure_or_unavailable}} |
| 1 gram · USD | {{validated_provider_measure_or_unavailable}} |
| 1 kilogram · USD | {{validated_provider_measure_or_unavailable}} |

Today’s change compares the latest quote with the provider’s first observation since 00:00 UTC. It is not a previous-New-York-close return. The 52-week range covers 364 completed days and appears only with sufficient provider coverage. Historical requests are cached for up to 12 hours; today’s opening reference for up to one hour.

By [David Odoi](/authors/david-odoi) · Editorial update 7 November 2026 [Sources & methodology](#data-sources)

The context behind the number

## What affects the gold price?

Gold has no coupon or dividend. Changes in the appeal of cash, bonds and other assets can therefore affect demand for it, alongside physical supply and buying.

### Dollar, rates and inflation

A stronger US dollar can make gold more expensive in other currencies. Higher real bond yields can raise the opportunity cost of holding gold. Inflation expectations matter, but gold is not a dependable hedge over every period.

### Demand and uncertainty

Central-bank purchases, jewellery demand and investor flows change the balance of buying and selling. Geopolitical stress can increase safe-haven demand, while a scramble for cash can still trigger selling.

### Supply and liquidity

Mine output and recycling affect available supply. Trading spans Asian, European and US sessions; thinner liquidity around holidays or market transitions can widen spreads and magnify price moves.

For primary research, use the [World Gold Council’s Gold Demand Trends](https://www.gold.org/goldhub/research/gold-demand-trends) and the [Federal Reserve Bank of St. Louis real-yield series](https://fred.stlouisfed.org/series/DFII10). Neither provides a guaranteed price forecast.

## Understand the price before trading XAU/USD

Four gold prices that should not be confused

| Price | What it represents |
| --- | --- |
| Spot reference | An indicative wholesale market price for metal for near-term delivery. |
| Futures | An exchange-traded contract for a specified delivery month; financing and timing can make it differ from spot. |
| Retail bullion | The actual coin or bar offer, including product premiums, dealer spread and applicable costs. |
| CFD quote | A provider’s derivative price and spread. Buying a CFD does not give you a gold bar. |

A troy ounce is exactly 31.1034768 grams; an ordinary avoirdupois ounce is different. The [LBMA precious-metal benchmarks](https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices) are scheduled reference prices, not this continuously refreshed provider feed.

## Trading tools and a useful next step

For gold CFD trading, check the contract’s ounces per lot, minimum trade size, spread, financing, trading hours and margin rules. A forex pip calculator may use a different contract convention. Our spot-value calculator estimates metal value; it does not calculate CFD profit or liquidation risk.

[**Compare gold with silver** Both spot references, performance and the ratio.](/gold-silver-prices)[**Explore forex calculators** Separate currency position-sizing and profit tools.](/tools)[**Compare charting and trading platforms** Understand platform features before choosing a provider.](/insights/best-platforms-for-day-trading)

[Browse the broker research directory](/reviews) to investigate legal entities and account terms. These profiles are research in progress, not verified gold-broker recommendations. Check authorisation and product permissions for your own country.

**Commercial disclosure:** These dashboards contain no affiliate referral links or sponsored broker recommendations. Leveraged forex and CFDs can cause rapid losses; this information is not personal investment advice.

Clear answers

## Gold price FAQs

### What is the current gold price per ounce?

The price card at the top shows the latest available USD quote for one troy ounce. Check its UTC timestamp and status before using it. If the feed is unavailable or stale, we label it rather than substitute an invented current price.

### How is the gold spot price determined?

Spot gold is traded through a global over-the-counter market. Quotes reflect bids and offers between market participants; there is no single exchange price for every transaction. The LBMA Gold Price is a separate benchmark set at scheduled auctions.

### Why does the gold price change?

Changes in the dollar, real interest rates, investor flows and demand for physical gold can move prices. News and thin liquidity can amplify moves. These influences interact, so one economic release does not guarantee a particular direction.

### What is the difference between spot gold and physical gold?

Spot is a wholesale market reference for metal. A physical coin or bar has an actual purchase or resale price, which can include a premium, dealer spread, taxes, delivery and storage. Jewellery also includes workmanship and may contain less than pure gold.

### How do I calculate the value of my gold?

Multiply the weight in troy ounces by the spot price and purity fraction. For grams, divide the weight by 31.1034768 first. For example, 18-karat gold has a theoretical purity of 18/24, or 75%. An assay and dealer quote determine what you can actually receive.

### Is the gold price the same as the XAU/USD price?

XAU/USD normally means US dollars for one troy ounce of gold. A broker’s instrument can have its own spread, trading hours and contract rules, so its executable quote may differ from this indicative spot feed.

### Can I trade gold without buying physical gold?

Depending on your location and eligibility, exchange-traded products, futures and CFDs can provide gold exposure. They have different ownership rights, fees and risks. Leveraged derivatives can cause rapid losses; check the product and legal entity before opening an account.

Know what you’re looking at

## Data sources, timing and corrections

- **Metal quotes:** [Gold API documentation](https://gold-api.com/docs) describes USD spot references per troy ounce. Its UTC update time records a source fetch. This is an indicative feed with no independently verified exchange delay or executable bid/ask.
- **Currency conversions:** [Frankfurter’s daily reference-rate documentation](https://frankfurter.dev/) explains its central-bank-sourced blended rates. We request the last completed UTC date and show the actual returned date; this is not live FX.
- **History:** Provider daily averages are separate from live quotes. Intraday history is not connected. Where historical access or coverage is missing, charts and returns say unavailable. We do not join a current quote to a daily series or manufacture an all-time high.

Gold conversions use the fine-metal fraction and 31.1034768 grams per troy ounce. They exclude the cost of acquiring or selling the finished product. Quotes older than five minutes are marked stale; the ratio is withheld if quote times differ by more than one minute.

Editorial copy and calculation rules are maintained separately from provider timestamps. See [our research methodology](/about#research-methodology) and [how to request a correction](/about#corrections). Public source documentation and calculations were checked on 7 November 2026. Nothing here guarantees availability or a trading result.

![Gold price today conversion guide: one troy ounce equals 31.1034768 grams; one kilogram equals 1,000 grams](https://devinforex-five.vercel.app/images/metals/gold-price-today-conversion-guide.png)

Original DEVIN FOREX explanatory diagram. No current prices are embedded.
```

## Full heading structure

- H1: Gold price today
  - H2: Gold price today at a glance
    - H3: Gold XAU /USD
  - H2: Gold price chart
  - H2: Gold price calculator
    - H3: Gold value
  - H2: Recent gold-price performance
  - H2: What affects the gold price?
    - H3: Dollar, rates and inflation
    - H3: Demand and uncertainty
    - H3: Supply and liquidity
  - H2: Understand the price before trading XAU/USD
  - H2: Trading tools and a useful next step
  - H2: Gold price FAQs
    - H3: What is the current gold price per ounce?
    - H3: How is the gold spot price determined?
    - H3: Why does the gold price change?
    - H3: What is the difference between spot gold and physical gold?
    - H3: How do I calculate the value of my gold?
    - H3: Is the gold price the same as the XAU/USD price?
    - H3: Can I trade gold without buying physical gold?
  - H2: Data sources, timing and corrections

Each page has exactly one H1. Quote and calculator H3s belong to their preceding H2. FAQ H3s are visible question summaries, with matching answers in schema.

## UI and module specification

| Order | Module | Behaviour |
| --- | --- | --- |
| 1 | Breadcrumb, H1, short introduction | White background, black text, immediate price intent; no affiliate CTA before useful information. |
| 2 | Gold quote with gram/kilo summary | Large USD/troy-ounce reference, daily change only with verified UTC opening baseline, per-metal status and UTC timestamp. Currency selector supports USD/ZAR/EUR/GBP. |
| 3 | Source line and section navigation | Explain indicative data and daily FX; refresh button, stable anchors, sticky navigation on wide screens. |
| — | Ratio reserved for the comparison page | Link to the distinct comparison hub rather than duplicating its main feature. |
| Next | Historical chart module | One gold-only chart; 24H, 7D, 30D, 6M, 1Y, 5Y and All controls. |
| Next | Value calculator | One gold calculator with theoretical karat/fineness adjustment, USD/ZAR/EUR/GBP, troy ounces/grams/kilograms and weight-to-value or budget-to-weight modes. |
| Next | Performance/conversion table | Distinguish current quote and UTC-open change from completed-daily-average returns. Include actual baseline/end dates and source coverage. |
| Next | Unique explanations, relevant resources, FAQs | Gold drivers, spot/futures/bullion/CFD distinction and gold trading considerations. Short paragraphs, tables and contextual links. |
| Last | Sources, corrections, original illustration | Named author, methodology, limitations, no invented expertise or broker endorsements. |

Use 16px body copy and comparison-table cells, short paragraphs, 44px controls, strong focus states, a responsive white layout and restrained gold/silver accents. Small utility labels and source timestamps are secondary UI. Reserve card/chart space; the interface must never turn a missing quote into `0.00`.

## Chart and calculator specification

One gold-only chart; 24H, 7D, 30D, 6M, 1Y, 5Y and All controls. Historical points are provider **completed daily averages**, not closes. The current quote is never attached to this line. 24H displays an explicit unsupported explanation on the connected free daily-data plan. No dummy chart is published while historical access is absent.

One gold calculator with theoretical karat/fineness adjustment, USD/ZAR/EUR/GBP, troy ounces/grams/kilograms and weight-to-value or budget-to-weight modes. Use exact troy conversion, dated FX, fine-metal fraction and unrounded arithmetic; display errors for invalid input, missing data and overflow. Explain that results exclude retail costs and tax. Full formulas, period definitions, coverage guards, accessible table pagination and cache limits are in [data-and-operations.md](data-and-operations.md).

## Contextual internal-link plan — exact implemented anchors

| Anchor text | Existing destination |
| --- | --- |
| David Odoi | `/authors/david-odoi` |
| Compare gold with silver Both spot references, performance and the ratio. | `/gold-silver-prices` |
| Explore forex calculators Separate currency position-sizing and profit tools. | `/tools` |
| Compare charting and trading platforms Understand platform features before choosing a provider. | `/insights/best-platforms-for-day-trading` |
| Browse the broker research directory | `/reviews` |
| our research methodology | `/about#research-methodology` |
| how to request a correction | `/about#corrections` |

Every destination above was checked against the local production app. Header and footer supply incoming links to both hubs. Unbuilt `/xau-usd/`, `/silver-trading/`, `/gold-vs-bitcoin/`, `/gold-price-history/`, `/best-gold-brokers/`, `/gold-cfd-trading/` and `/precious-metals-cfds/` are deferred destinations, not live links. No extra thin pages were made to satisfy a keyword list.

## External-link plan — exact source anchors

| Anchor text | Authoritative destination |
| --- | --- |
| Gold API indicative spot feed | `https://gold-api.com/faqs` |
| World Gold Council’s Gold Demand Trends | `https://www.gold.org/goldhub/research/gold-demand-trends` |
| Federal Reserve Bank of St. Louis real-yield series | `https://fred.stlouisfed.org/series/DFII10` |
| LBMA precious-metal benchmarks | `https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices` |
| Gold API documentation | `https://gold-api.com/docs` |
| Frankfurter’s daily reference-rate documentation | `https://frankfurter.dev/` |

These sources support actual methodology or market explanations. They are not affiliate links. Public provider terms, editorial references and authenticated production history were checked on 7 November 2026. See [the connection verification record](README.md) for actual coverage and remaining optional-field limitations.

## Image and social-card plan

- Original asset: `https://devinforex-five.vercel.app/images/metals/gold-price-today-conversion-guide.png`.
- Alt text: “Gold price today conversion guide: one troy ounce equals 31.1034768 grams; one kilogram equals 1,000 grams”.
- Dimensions: **1200×630**, explicit intrinsic size; original PNG about 23 KB, with editable SVG source beside it.
- Responsive Next image, lazy-loaded below the fold; no stock photo, personal account screenshot, stale hard-coded market price or invented performance line.
- Open Graph: `og:type=website`, unique title/description above, canonical `og:url`, Devin Forex site name, this image and dimensions/alt.
- Twitter: `summary_large_image`, the same page-specific title/description and unique image.

## Canonical, indexing and schema

```html
<link rel="canonical" href="https://devinforex-five.vercel.app/gold-price" />
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
      "@id": "https://devinforex-five.vercel.app/gold-price#webpage",
      "url": "https://devinforex-five.vercel.app/gold-price",
      "name": "Gold Price Today: Live XAU/USD, Charts & Calculator",
      "description": "Check the gold price today per ounce, gram and kilo in USD, ZAR, EUR and GBP. View XAU/USD charts, compare recent changes and estimate your gold’s spot value.",
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
        "url": "https://devinforex-five.vercel.app/images/metals/gold-price-today-conversion-guide.png",
        "width": 1200,
        "height": 630
      },
      "breadcrumb": {
        "@id": "https://devinforex-five.vercel.app/gold-price#breadcrumb"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://devinforex-five.vercel.app/gold-price#breadcrumb",
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
          "name": "Gold price today",
          "item": "https://devinforex-five.vercel.app/gold-price"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://devinforex-five.vercel.app/gold-price#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the current gold price per ounce?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The price card at the top shows the latest available USD quote for one troy ounce. Check its UTC timestamp and status before using it. If the feed is unavailable or stale, we label it rather than substitute an invented current price."
          }
        },
        {
          "@type": "Question",
          "name": "How is the gold spot price determined?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spot gold is traded through a global over-the-counter market. Quotes reflect bids and offers between market participants; there is no single exchange price for every transaction. The LBMA Gold Price is a separate benchmark set at scheduled auctions."
          }
        },
        {
          "@type": "Question",
          "name": "Why does the gold price change?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Changes in the dollar, real interest rates, investor flows and demand for physical gold can move prices. News and thin liquidity can amplify moves. These influences interact, so one economic release does not guarantee a particular direction."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between spot gold and physical gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spot is a wholesale market reference for metal. A physical coin or bar has an actual purchase or resale price, which can include a premium, dealer spread, taxes, delivery and storage. Jewellery also includes workmanship and may contain less than pure gold."
          }
        },
        {
          "@type": "Question",
          "name": "How do I calculate the value of my gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Multiply the weight in troy ounces by the spot price and purity fraction. For grams, divide the weight by 31.1034768 first. For example, 18-karat gold has a theoretical purity of 18/24, or 75%. An assay and dealer quote determine what you can actually receive."
          }
        },
        {
          "@type": "Question",
          "name": "Is the gold price the same as the XAU/USD price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "XAU/USD normally means US dollars for one troy ounce of gold. A broker’s instrument can have its own spread, trading hours and contract rules, so its executable quote may differ from this indicative spot feed."
          }
        },
        {
          "@type": "Question",
          "name": "Can I trade gold without buying physical gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Depending on your location and eligibility, exchange-traded products, futures and CFDs can provide gold exposure. They have different ownership rights, fees and risks. Leveraged derivatives can cause rapid losses; check the product and legal entity before opening an account."
          }
        }
      ]
    }
  ]
}
```

## Performance, mobile and content maintenance

Server-render the useful quote/copy, cache quotes for 30 seconds, pause hidden-tab polling, lazy-load chart code near the viewport, paginate the optional chart data table, reuse local fonts and avoid third-party widgets. Keep the current price within the first mobile screen and stack unit summaries at small widths. Ensure no horizontal page overflow at 320px.

Target real-user p75 LCP ≤2.5s, INP ≤200ms and CLS ≤0.1; do not claim measured field performance before collecting it. See [the operational plan](data-and-operations.md) for exact checks, refresh cadence, alerting follow-up, error states and source-review schedule.

## Verification before publication and claims to withhold

- Revalidate every current quote, FX observation, timestamp, return, ratio and range at runtime. No financial test values are production data.
- Authenticated production series and chart/return calculations were verified on 7 November 2026. See [the connection record](README.md). Recheck date/decimal formats, coverage, OHLC windows, truncation and quota after future provider changes; missing optional values remain unavailable.
- Verify any future country-specific broker authorisation or tax statement from current primary evidence. There is no affiliate recommendation in this release.
- Withhold “real-time executable price”, zero delay, complete all-time coverage, guaranteed returns/safety/withdrawals, a predictive ratio, universal VAT rates and Google-ranking promises without the necessary evidence or legal review. A daily FX reference must not be called live FX.

See [data-and-operations.md](data-and-operations.md) for the full claim-verification list and legal/data limits.
