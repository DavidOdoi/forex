# Calculator linking and fact review — 24 November 2026

Scope: the twelve calculator guides completed in Batches 1–3, their incoming site links, and country-guide statements about calculator capabilities. This is not a claim that every historical broker condition or every legal statement across the website has been reverified.

## Completed changes

- Added 40 contextual article links: 23 internal links and 17 external citations. The twelve guides now contain 66 internal and 52 external body links, excluding navigation and related-tool cards. The destinations support the nearby explanation rather than appearing as a detached list of URLs.
- Replaced a competitor-calculator reference with primary MetaQuotes contract and volume documentation. Updated redirected documentation URLs to their actual destinations.
- Updated 49 incoming references to the canonical calculator URLs across navigation, footer, country/review components, articles and related content, including 28 references across fourteen country comparison pages. Legacy routes retain their redirects for existing visitors and bookmarks.
- Corrected Kenya, Nigeria, Uganda and Ghana guide copy that denied support for KES, NGN, UGX and GHS. All four are present in the calculator currency registry. The copy distinguishes a calculation currency from broker account availability and tells readers to supply manual conversion inputs when the daily reference lacks a quote.
- Replaced awkward or misleading calculator-currency wording in Zambia, Zimbabwe and Botswana with the supported-currency limitation. No offshore-funding permissions, broker eligibility or legal authorisations were inferred from calculator capabilities. Updated the country-guide generator to avoid reintroducing the stale claim; did not regenerate curated articles.
- Clarified pivot notation from spaced labels such as “R 1” to “R1”. Shortened the lot-size meta description to 156 characters while retaining the entered-volume-limit qualification.
- Earlier in this review, commit `8f9f81b` fixed percentage-loss numerical underflow, clarified the lot-size formula denominator, and corrected the Kelly negative-infinite log-growth label. See [the fact-correction report](calculator-fact-corrections.md).

## Primary-source findings

The source review read the relevant material; an HTTP success code alone is not evidence for a claim.

| Source | Finding used in the guides | Limitation preserved |
| --- | --- | --- |
| [MetaQuotes symbol properties](https://www.mql5.com/en/docs/constants/environment_state/marketinfoconstants) | Contract size, volume minimum/maximum/step, point/tick size, swap mode and rollover settings are instrument properties. | Conventional forex examples are not universal broker specifications. |
| [MetaTrader trading principles](https://www.metatrader5.com/en/terminal/help/trading/general_concept) | Buying occurs at Ask and selling at Bid; orders and executed deals differ. | Entered prices do not guarantee fills or eliminate slippage. |
| [MetaTrader margin calculation](https://www.metatrader5.com/en/terminal/help/trading_advanced/margin_forex) | The basic forex model uses lots × contract size ÷ leverage, followed by currency conversion. | Fixed initial margin, calculation mode, tiering and hedged positions can change broker requirements. |
| [NIST binomial distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm) | The model uses two trial outcomes and a fixed event probability. | Historical sample frequencies do not establish a stable future trading probability. |
| [NIST confidence intervals](https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm) | The page explicitly describes Wilson intervals for proportions. | Sampling intervals do not cover model misspecification, changing conditions or correlated trades. |
| [Kelly’s original 1956 paper](https://www.princeton.edu/~wbialek/rome/refs/kelly_56.pdf) | Wealth fractions and expected logarithmic growth under stated betting assumptions. | The calculator uses natural logs; its binary model is not a promise of trading outcomes. |
| [TradingView pivot reference](https://www.tradingview.com/support/solutions/43000521824-pivot-points-standard/) | Traditional, Fibonacci, Camarilla, Woodie and DM formulas and required source inputs. | Previous-close and current-open Woodie variants remain explicitly labelled; calculated levels are not predictions. |
| [TradingView Fibonacci reference](https://www.tradingview.com/support/solutions/43000518158-fibonacci-retracement-drawing-tool/) | Drawing anchors and retracement levels. | The tool does not identify an objectively correct swing or verify an entry signal. |
| [Frankfurter reference-rate documentation](https://frankfurter.dev/) | Official/central-bank reference-rate provenance and dated observations. | Daily reference rates are not live executable bid/ask quotes. |
| [CME trade and risk management](https://www.cmegroup.com/education/courses/trade-and-risk-management) | Trading-plan, capital-allocation and position-sizing context. | This course does not verify an assumed win rate or a strategy’s profitability. |

All 15 unique external calculator citation URLs returned HTTP 200 without a redirect during this pass. The machine-readable [link/source ledger](calculator-link-source-review.json) records destinations, anchors, timestamps and statuses. Two blocked MQL5 candidate references and a missing guessed MetaTrader URL were rejected and were not added to the guides.

## Validation

The full numerical suite passed: 76 groups, including the reproduced total-loss precision edge case. Production webpack build, TypeScript, ESLint and whitespace checks passed. The updated insights audit passed for all 25 published guides; its [readability report](insights-link-review.md) preserves the 1,800-word ceiling and three FAQs. Calculator guides also remain below 1,800 words with three FAQs each.

Across the initial run and the follow-up, 78 unique browser/regression checks passed. These covered all twelve calculators, contextual links and direct internal destinations, legacy redirects, server-rendered metadata, three matching FAQs, mobile layouts, country-guide copy, navigation, review section links and regional-review incoming links. The sitemap crawl checked 108 canonical content URLs: all returned HTTP 200 with index/follow and no blocking response headers in the production-mode local build.

Two obsolete test expectations were corrected after checking the actual interface: the India article assertion now separates editorial links from the shared broker-discovery widget, and the finder test now verifies the existing three-item research checklist for all eight answer combinations instead of expecting its retired single-broker match. Neither product flow was changed in order to pass those tests. External source checks are recorded separately from local route/crawl checks; production deployment is not inferred from local success.
