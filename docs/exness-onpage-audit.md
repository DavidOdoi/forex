# Exness review: on-page implementation audit

Checked 6 November 2026. The article is `/reviews/exness`; `/reviews/template` and `/templates/exness-review.html` are labelled demonstrations. This records implementation checks, not a Google score or ranking prediction.

## Opening and reader intent

- The introduction contains two short paragraphs of 32 and 33 words. It introduces the reader’s decision, costs, legal entity and funding, then explains the review’s scope and document-based evidence.
- “Exness review” appears in the first sentence. Contextual intro links jump to trading costs, safety and account types.
- Quick answer immediately follows the intro. Its first sentence gives a suitability verdict; the next two explain advertised Standard pricing, separate commissions and unsuitable use cases. Two brief notes answer the safety and withdrawal questions.
- The credited Exness Terminal image appears beside the answer on desktop. On phones it follows the answer before the account controls, quick-fact grid and main review sections. It appears once.
- The original 21,302-byte WebP has meaningful alt text, explicit 992×660 dimensions, responsive width and a full-size view. It loads eagerly with high fetch priority because it now appears in the opening. Its caption identifies provider imagery rather than a live-account test.
- Repeated compact CTA descriptions were removed to make room for useful introductory content. All five account actions and their risk/commercial notices remain.

## On-page implementation

| Check | Implemented behaviour |
| --- | --- |
| Title and primary topic | One server-rendered H1. The 62-character SEO title starts with “Exness Review”. |
| Description | Starts with the focus phrase and describes account, fee, regulation and withdrawal coverage. |
| Headings | The pros/cons H2 includes “Exness review”; headings follow the H1/H2/H3 order. |
| URLs | The existing short `/reviews/exness` canonical is retained, preserving existing links. Country variants retain their scoped canonical. |
| Readability | Uniform 18px body text, short paragraphs, a quick answer, tables, lists and sticky contents. |
| Mobile | Account tables become readable cards. The opening follows answer → image → account controls; no horizontal page overflow. |
| Links | Descriptive contextual anchors lead to relevant internal content and attributed broker/regulator sources. |
| Image metadata | The same relevant image is used in Open Graph/Twitter metadata and Article schema when publication requirements are met. |
| FAQs | Three brief, evidenced answers. Visible questions and answers match FAQPage data. |
| Structured data | Breadcrumb and FAQ records reflect visible content. Article fields require a complete publication record. No copied review-star or Product rating markup. |
| Word budget | The longest of 345 review/scope routes is the template at 1,792 words, counting collapsed content, citations and in-review navigation. |
| HTML download | Updated opening, embedded CSS/schema, native navigation and absolute image/source URLs work without the Next.js runtime. |

Natural language and useful coverage take priority over forced keyword density, emotional claims or a cosmetic plugin score. The review retains five sourced pros and five cautions, five documented accounts, entity distinctions, payment-stage explanations and a hypothetical interactive trading-cost calculator. It does not claim measured spreads, support response times or tested withdrawals.

## Publication and evidence limits

The article remains an editorial draft with `noindex, follow`; the demonstrations remain `noindex`. Google ranking eligibility still requires publication work. Core evidence, an accountable author biography, actual editorial approval and consistent publication dates are checked by `publication.ts`. No approval, credentials or publication date has been invented for this layout change.

Provider disclosures remain attributed. The Seychelles FSA check independently identifies the company and dealer type, not the SD025 licence number. UK/Cyprus/Mauritius retail restrictions are retained. Customer ratings and live-account performance are unassigned.

Evidence: [November 6 source checks](research/exness-source-checks-2026-11-06.json), [platform image source record](research/exness-platform-image-2026-11-06.json), and the original source documents linked on the page.

## Validation

Production build, ESLint and TypeScript passed. All 68 Playwright checks passed, including no-JavaScript content and image loading, intro/answer/image order, all 345 review word limits, responsive layouts, matching FAQ data, source guards, five account actions, calculator interactions and the standalone download. Desktop and mobile screenshots were inspected. These checks do not establish factual accuracy of every provider statement, field Core Web Vitals or a search ranking.
