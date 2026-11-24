# Contextual country-guide visuals — 24 November 2026

## Scope

Removed the repeated historical MetaTrader chart from all ten country beginner guides. The country cover photos remain. Nine guides now have different HTML/CSS educational infographics; South Africa uses a licensed candle-anatomy diagram from Wikimedia Commons. No AI image generation, invented market quotes or fabricated regulator screenshots were used.

The panels rework existing explanations into scannable steps, a comparison, a currency quote or a cash-risk equation. They are server-rendered, accessible as text, and require no client JavaScript or third-party widget. Each sits in the relevant section and has descriptive source links. Country funding permissions and broker availability were not inferred from these examples.

## Visuals and sources

| Country | Visual | Placement | Further reading / attribution |
| --- | --- | --- | --- |
| south-africa | Candlestick anatomy: open, high, low, close | `practise-on-a-demo-before-trading-live` | [Licensed Commons illustration](https://commons.wikimedia.org/wiki/File:Candlestick_chart_scheme_03-en.svg) |
| kenya | Three details that must match | `country-check` | [CMA licensed online forex brokers](https://licensees.cma.or.ke/licenses/5/) |
| nigeria | Trace the money and the contract | `country-check` | [SEC Nigeria operator register](https://sec.gov.ng/for-investors/find-a-registered-operator/) |
| uganda | Know who is doing each job | `country-check` | [CMA Uganda licensed firms](https://cmauganda.co.ug/cma-licensed-firms/) |
| ghana | Describe the service before asking for guidance | `country-check` | [Bank of Ghana FX-broker notice](https://www.bog.gov.gh/news/authorised-fx-brokers-and-cross-border-payments-and-financial-services/) |
| zambia | Turn a percentage into a cash limit | `risk-budget` | [MoneySmart: forex risks](https://moneysmart.gov.au/complex-investment-products/forex-trading) |
| zimbabwe | Confirm all three currencies | `country-check` | [RBZ foreign-exchange guidelines](https://www.rbz.co.zw/documents/Regulations_Acts/2025/Guidelines_to_Authorised_Dealers_and_their_Clients_on_Foreign_Exchange_Transactions_8_Aug_2025_FXD4.pdf) |
| botswana | Read a currency pair in two parts | `forex-basics` | [MoneySmart forex-trading guide](https://moneysmart.gov.au/complex-investment-products/forex-trading) |
| australia | Understand the client classification | `country-check` | [MoneySmart’s CFD guidance](https://moneysmart.gov.au/complex-investment-products/contracts-for-difference-cfds) |
| india | Check three things before a chart | `country-check` | [RBI Forex Transactions FAQ](https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3347) |

## Research and verification

- Searched Commons for relevant diagrams covering candlesticks, order types, trading risk, currencies and fraud prevention. Rejected irrelevant, advanced or misleading results rather than inserting unrelated artwork. One candidate described as a single candle actually displayed a pressure-data chart; it was rejected after visual inspection.
- Selected the candlestick scheme 03 English illustration by Probe-meteo.com, CC BY-SA 3.0. Source-provided PNG rendering is stored unchanged, with a SHA-256 and actual dimensions in the image registry. Source and licence are visible beside the image and in the credit gallery. A full-size link lets readers inspect its labels on mobile.
- Rechecked the Kenya CMA forex register, Uganda CMA licensed-firms page, Bank of Ghana notice, MoneySmart CFD guidance, Bank of Botswana FX-market page and NSE currency-derivatives overview; all returned HTTP 200. This confirms source availability, not new legal permissions.
- Read MoneySmart’s wholesale-client explanation: it states that wholesale clients may lose negative-balance/margin-closeout protection and generally cannot access AFCA. The Australian panel preserves that qualified wording.
- Zambia uses the existing illustrative ZMW 10,000 × 1% = ZMW 100 example, not a suggested deposit, live conversion or account offer. Sizing should include fees; slippage can exceed the plan.
- Botswana’s EUR/USD 1.1000 is explicitly hypothetical, not a current pula exchange rate.
- Infographic text, links and the diagram’s full-size link are included in the article text/word-count model and readability audit. The maximum remains 1,800 words and FAQs remain exactly three.

## Validation

- Production webpack build, TypeScript and lint checks pass.
- Readability audit passes for all 24 guides; South Africa is at the 1,800-word ceiling, all other country guides are below 1,610 words.
- Existing 10-test insights suite passes: asset integrity/attribution, contextual visuals, source links, article routes without JavaScript, headings/schema/word counts, mobile/desktop overflow, image loading, credit gallery and navigation.
- Visually reviewed Zambia, Kenya, Botswana and Australia panels at mobile and desktop sizes; reviewed the externally sourced candle diagram and added full-size access for its labels.

See `country-learning-visuals.json` and the adjacent Markdown audit for the final content checks.
