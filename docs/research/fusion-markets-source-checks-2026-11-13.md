# Fusion Markets review: source checks, 13 November 2026

Original user-supplied article: [supplied review](fusion-markets-supplied-review-2026-11-13.md). It is research input, not automatically verified copy. The live page reuses the existing review template at `/reviews/fusion-markets`.

All URLs below returned HTTP 200 on 13 November 2026. Visible page text was examined; the negative-balance PDF was downloaded and its text extracted. These checks establish what the broker publishes, not independent register confirmation, an account allocation or firsthand execution/withdrawal tests.

| Source | Substantive check / editorial treatment |
| --- | --- |
| [Homepage](https://fusionmarkets.com/) | “$2.25 per side commission, no fees to deposit and no minimum account size.” Lists MetaTrader, cTrader, TradingView and CFD markets. No unsupported broker ranking retained. |
| [Zero](https://fusionmarkets.com/Trading/Zero-Trading-Account) | Advertises raw spreads from 0.0, $2.25/standard lot/side and $4.50 round turn. USD MetaTrader scope stated explicitly; not an observed average spread. Its static-host mirror was also retrieved. |
| [Classic](https://fusionmarkets.com/Trading/Classic-Trading-Account) | Commission included in spread; calculation says add 0.9 pips to Zero spread (example 0.2 + 0.9 = 1.1). Prefer this formula to the supplied simplified “from 0.9” headline. No minimum account size. |
| [cTrader](https://fusionmarkets.com/Platforms/cTrader) | Zero only; no Classic. FAQ describes commission per 100,000 units of traded notional: one EUR/USD lot costs EUR2.25/side, converted to account currency. Do not reuse the MetaTrader USD commission as a universal platform quote. |
| [TradingView](https://fusionmarkets.com/Platforms/TradingView) | Describes connection through cTrader. Official desktop/mobile product illustration downloaded from `/static_images/Trading_View_Image_34f7baa3a4.png`, optimized to WebP, 658 × 388, with attribution. It is not our account screenshot. |
| [Entities](https://fusionmarkets.com/About-us/Regulations) | Footer: Australia, FMGP Trading Group Pty Ltd / AFSL 385620; Seychelles, Fusion Markets International Ltd / SD096; Vanuatu, Gleneagle Securities Pty Limited / company 40256. Client monies described as segregated trust accounts. Licence numbers remain provider-reported, not register-confirmed. Older Australian entity/AFSL from the supplied text is not used as a current allocation. |
| [Negative-balance policy](https://fusionmarkets.com/static_images/FM_NBP_Policy_SEY_VFSC_23_7_26_677577c94c.pdf) | Version 1.0, effective 23 July 2026. Seychelles/Vanuatu scope; eligibility determined by company and notified if applicable. Schedule 1 excludes Mongolia, Türkiye, Indonesia, Hong Kong SAR, Taiwan, Vietnam and the People’s Republic of China. Further policy exclusions apply. No universal protection claim. |
| [Deposits](https://fusionmarkets.com/Trading/Deposit-options) | $0 broker deposit charges; country-specific methods. Do not equate method availability with local permission to fund offshore CFDs. |
| [Withdrawals](https://fusionmarkets.com/Trading/Withdrawal-options) | Own-name accounts. Displayed local-bank option: $10 minimum, $0 broker fee, 1–2 business days. Wire: $35 minimum, $0 broker fee, 3–5 business days. Faster headline concerns internal processing, with method/jurisdiction/provider qualifiers; no arrival guarantee. |
| [Swap-free](https://fusionmarkets.com/Trading/Swap-Free-Accounts) | Application required; limited instruments; administration fees for positions open longer than seven days. No assumption that swap-free means free financing forever. |
| [Demo](https://fusionmarkets.com/Trading/Demo-Trading-Account) | Virtual-funds demo advertised; no implied equivalence with live fills. |
| [Registration](https://hub.fusionmarkets.com/auth/sign-up) | HTTP 200; destination linked from official homepage and account pages. Used for five unpaid, non-affiliate account buttons. No signup submitted. |

## Claims omitted / manual follow-up

- No independently retrieved Trustpilot score or count was supplied; link to the exact live profile, leave numeric ratings null, and add no rating schema.
- No universal current inactivity fee or leverage schedule established by these checked pages. Omit “no inactivity fee” and any universal maximum leverage rather than repeat an unsupported number.
- Do not reuse publisher spread averages or execution-speed rankings as DEVIN FOREX measurements. No live trading, support or withdrawal testing took place.
- Verify register entries and the actual registration agreement before describing regulatory permissions as independently confirmed. Company 40256 is labelled a company number.
- Resident acceptance, applicable payment methods and local funding permissions still depend on onboarding and local requirements; no worldwide acceptance claim.
- No paid affiliate agreement or tracking link has been provided.

## Availability and indexing

Added as the fifth owner-selected review. Existing hidden reviews remain hidden. Public website availability is separate from editorial approval: retain `draft` status, noindex and sitemap exclusion until the normal review publication gate is met. Do not invent an approving reviewer, firsthand score or approval date.

## Validation

- Production build, TypeScript and scoped ESLint passed.
- Broker-review browser regression checks passed after correcting the full-word-count limit and refreshing the standalone Exness export’s outdated domain/related links.
- All 14 visible review/scope URLs are at or below 1,800 words, including collapsed content and disclosures. The longest remains IC Markets at 1,795 words.
- Fusion: nine populated quick facts, two account rows, exactly three FAQs, five official unpaid signup links, no invented rating schema, no sitemap entry and noindex retained.
- Desktop and 320/390px phone layouts checked, image loads, no horizontal page overflow, and the cost calculator includes commission on opening and closing.
