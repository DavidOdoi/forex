# DEVIN FOREX factual, editorial and crawl audit

Checked on 23 November 2026. Production: https://www.devinforex.com.

This audit covers the 97 URLs in the public sitemap, their internal links, metadata and visible claims, plus retrieval checks for 471 external references. High-risk regulatory, funding, fee and automation statements received targeted primary-source checks. A successful HTTP response is **not** verification of every statement on a source page. No live broker accounts, deposits, withdrawals or execution performance were tested.

## Fixes pushed

| Commit | Change |
| --- | --- |
| `29374fa` | Added ordinary HTML links to 14 orphaned regional review records. Country eligibility is still separate from an entity's source record. |
| `2031a76` | Made the market-hours planner jump target available before JavaScript loads. |
| `7843de6` | Removed invented sample market quotes, corrected the worldwide legality answer and affiliate wording, and replaced arbitrary broker matching with a useful research checklist. |
| `24912b5` | Repaired Dutch IG and Sri Lankan Gazette links, removed an unsupported Australian underlying-share service assertion, and simplified country-page wording. |
| `b9399b5` | Rewrote repetitive article openings and generic title adjectives. Kept the existing URLs, citations, summary tables and short FAQs. |
| `8db43d5` | Added 16 licensed country photographs; all 17 broker-country guides now have their own credited image. |
| `0f512a3` | Shortened four complete country pages to satisfy the stricter rendered-text count and corrected subject–verb agreement. |

The original contributor research remains archived. Checking two Sri Lankan documents did not create a legal approval, a broker endorsement or permission for residents to fund CFDs. Existing uncertainty labels were retained where the evidence is incomplete.

## Link and indexing checks

The baseline crawl found 14 orphaned entity-review URLs and one missing server-rendered jump target. There were no failed sitemap-page responses or broken internal destinations. All public sitemap URLs were indexable.

The final production results are recorded in [production-crawl-summary.json](production-crawl-summary.json) and [production-pages.json](production-pages.json). [production-link-graph.json](production-link-graph.json) records incoming and outgoing HTML links. These checks establish technical discoverability, not a promise that Google will index or rank a URL.

Repeat the crawl:

```sh
python tools/content/audit-site.py --origin https://www.devinforex.com --output /tmp/devin-site-audit
```

## Primary-source checks and scope

The following are substantive spot checks of material financial claims. They are not a certification of every fee, entity or country's current law.

| Topic | Finding and scope | Primary source |
| --- | --- | --- |
| India: overseas margin | RBI says margin/margin-call remittances to overseas exchanges or counterparties are not allowed under LRS. An offshore broker accepting a resident is not permission. | [RBI forex FAQ](https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3347) |
| Pakistan: offshore platforms | The SBP circular addresses direct and indirect payment/remittance to offshore forex, margin and CFD platforms. General currency-exchange services are a different activity. | [SBP EPD Circular Letter 08/2022](https://www.sbp.org.pk/circulars/epd-circular-letter-no-08-of-2022) |
| Tanzania: authorised dealers | The circular retains the prohibition on trading with international foreign-currency brokers not licensed in Tanzania. Its addressees and scope must not be silently expanded into a personalised legal opinion. | [Bank of Tanzania circular](https://www.bot.go.tz/Publications/Acts%2C%20Regulations%2C%20Circulars%2C%20Guidelines/Circulars/en/2026012919162497.pdf) |
| Ethiopia: outbound investment | The relaxation notice describes case-by-case NBE approval. It does not establish unrestricted offshore CFD funding. | [NBE relaxation notice](https://nbe.gov.et/nbe_news/public-notice-notice-on-relaxation-of-foreign-exchange-directives-fxd-01-2024/) |
| Ethiopia: crypto warning | The notice addresses birr-paired P2P transactions; do not rewrite it as a universal ban on every crypto activity. | [NBE P2P notice](https://nbe.gov.et/nbe_news/public-notice-notice-on-illegal-birr-paired-peer-to-peer-p2p-transactions-via-trading-platforms/) |
| Sri Lanka: regulation 2493/36 | Read the official 18 June 2026 Gazette. Rupee-converted investment rules and existing foreign assets have different treatment. Neither is a blanket retail CFD permission. | [DFE regulation 2493/36](https://www.dfe.lk/web/images/rdevelopment/1e053526afc012cd3d06e03a8270234c-2493-36-E.pdf) |
| Sri Lanka: order 2493/38 | Section 1.II suspends specified outward-investment-account payments with exceptions; section 4 gives six-month validity from 20 June 2026. Current interpretation remains a separate question. | [DFE order 2493/38](https://www.dfe.lk/web/images/rdevelopment/f7da0aaf5dc576c2c00b6d9d21909da0-2493-38-E.pdf) |
| UK compensation | FSCS investment protection states up to £85,000 per eligible person/firm for relevant failures after 1 April 2019. The separate bank-deposit limit must not replace this investment limit. Trading losses are not compensated merely because a firm is regulated. | [FSCS investments](https://www.fscs.org.uk/what-we-cover/investments/) |
| FundedNext EAs | The current FAQ limits automation to MT4/MT5 accounts below $50,000 with the applicable paid add-on. $50,000 and above must be manual; other platform rules differ. | [FundedNext EA rules](https://help.fundednext.com/en/articles/8020763-is-ea-allowed-in-fundednext) |
| The5ers EAs | Ownership of the source code and visible stops matter; no stealth stops. Program-specific prohibited practices still apply. | [The5ers EA FAQ](https://the5ers.com/faqs/can-i-use-an-ea-expert-advisor-can-i-set-a-stealth-mode-stop-loss/) |
| IBKR manual spot FX | The first tier is 0.20 basis point of trade value, equivalent to 0.002%, with a USD 2 minimum per order. This is not USD 2 per lot or a round-trip charge. | [IBKR FX commission schedule](https://www.interactivebrokers.com/en/accounts/fees/fxcoms.php) |
| XTB inactivity | Both inactivity conditions matter: no opened/closed position for 365 days and no deposit for 90 days. The fee and exceptions are entity-specific. | [XTB fees and commissions](https://www.xtb.com/en/help-center/fees-and-payments-3/fees-and-commissions-at-xtb) |
| eToro inactivity | The current public fee page states inactivity is free. Older $10/month claims must not be imported. Crypto, conversion and withdrawal costs remain separate and may vary. | [eToro fees](https://www.etoro.com/trading/fees/) |
| AvaTrade inactivity | Qualifying quarterly inactivity and the separate annual administration charge have distinct conditions; do not collapse them into one fee. | [AvaTrade fees](https://www.avatrade.com/trading-info/our-fees-charges) |
| BlackBull account costs | The published ECN comparison and withdrawal fee were checked. Conflicting account tables are disclosed rather than treated as an established universal minimum. | [BlackBull accounts](https://blackbull.com/en/our-company/account-comparison/) and [withdrawal fees](https://blackbull.com/en/support/deposit-and-withdrawal-fees/) |
| AAFX warning | The CFTC RED List is a registration warning, not a court judgment proving fraud. The distinction is preserved. | [CFTC AAFX entry](https://www.cftc.gov/REDlist/node/220641) |

Broker-stated segregation, negative-balance protection, execution speed, eligibility and withdrawal timing were not converted into independently audited safety claims. Trustpilot snapshots are dated customer-opinion measures, not our safety scores.

## Source retrieval and manual follow-up

[external-source-retrieval.json](external-source-retrieval.json) records the 471 pre-fix reference checks, final URLs, response status, extraction quality and hashes of retrieved text. Counts: 453 HTTP 200, three 404, eight 403, three 406, two 402 and two 503. Of the responses, 393 yielded HTML text and 24 yielded readable PDF text. Twenty-nine were JavaScript shells, five PDFs were unreadable, and two responses were non-HTML.

The three 404 references were addressed:

- IG's `/en-nl` link now uses the working `/nl` page.
- The obsolete documents.gov.lk Order 2493/38 URL now points to the official DFE PDF above.
- IC Markets' broken Australian shares-pricing reference was removed; the review no longer asserts a currently verified underlying-share service.

Manual retrieval or written confirmation is still needed for blocked CBSL notices, some Philippine SEC pages, NBFIRA and Zambian SEC pages, the PMEX broker page, one ASIC entity lookup and the AAFX account page. Investopedia's triangle definitions returned a paywall; Bank Indonesia and an Orbex Ghana page returned server errors. Registration portals and JavaScript-only regulator records may require interactive inspection. A blocked page is not proof that a financial claim is false.

The central unanswered legal questions remain current resident eligibility, the exact contracting company and permission to fund offshore leveraged products in several country guides. These cannot be inferred from a foreign licence, a payment icon or an application form. No universal country permissions, invented minimum deposits, fake stars or fabricated withdrawal tests were added to fill those gaps.

The production metals quote endpoint returned both XAU and XAG with provider timestamps. Currency conversions returned dated daily reference rates. The history endpoint returned `not-configured` for both metals: historical data is still unavailable in this production deployment. The code accepts `GOLD_API_KEY` and the legacy `gold_api` name; the credential must be present on the actual `devinforex` project's production deployment and followed by redeployment. No key was read or exposed during this audit. Current quotes must not be described as verified executable prices, and missing history must not be replaced with invented charts or performance figures.

## Editorial and visual checks

- [insights-readability.md](insights-readability.md) records the 24 guide-format article checks; the separate reading-list article is excluded from that report.
- All 25 article URLs were checked server-side, including citations and image files; article copy remains within the 1,800-word cap.
- The 36 global/regional broker review scopes remain within 1,800 words, with three FAQs and the existing five CTA placements. XM is the longest at 1,799 words.
- All 17 country broker guides retain three FAQs and stay below 1,700 words, including closed content and the new photo credits. Sri Lanka is 1,681 words.
- Each new photograph was visually inspected. Files are locally served, have intrinsic dimensions and responsive image sizes, and have visible creator/source/licence credits. The Dubai image is displayed in full to preserve the source's skyline-use limitation. Source URLs, download dates, dimensions and file hashes are recorded in `src/data/country-guides/featured-images.json`.
- No generated photos, affiliate tracking, fake testing credentials or new broker scores were introduced.

## Validation

Production Webpack build and scoped ESLint checks passed. Targeted Playwright checks covered review scope navigation, source evidence boundaries, 97-page indexing metadata, article and review word limits, country imagery, mobile overflow, the homepage, broker checklist and representative calculator/time-zone cases. The image run passed all four checks. The final stricter all-country check also passed: text nodes are separated before counting, so adjacent HTML elements cannot hide words. Some older tests encode superseded site states and were not used to claim a clean full-suite result.

Core Web Vitals field performance, Google indexing status and individual broker execution quality are outside what this code-and-public-source audit can establish. No search-ranking result is promised.
