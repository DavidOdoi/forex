# Uganda supplied article

- Route: `/forex-brokers/uganda`; linked from the existing country library.
- Original supplied text: `research/uganda-supplied-2026-11-13.md`.
- Populated copy: `src/data/country-guides/uganda-article.json`.
- Preserves all 13 supplied H2s in order, including both comparison/regulator tables and the final recommendation after FAQs. Keeps the first three FAQ topics; removes the other three. Condenses repetition to stay under the country template's 1,700-word limit.
- Reuses country reader CSS, sticky section navigation, author record, metadata, canonical and publication policy. The small server-rendered supplied-article renderer preserves this document's order without changing the Sri Lanka or Malaysia layouts. It interprets only headings, paragraphs, simple lists/tables, emphasis and HTTPS/internal links; never raw HTML or images.
- Adds contextual links to the four existing broker reviews. No new broker review, score, price, affiliate agreement, tracking URL or image was added.
- No outside research or source retrieval was performed, as requested. Sources are recorded as supplied/not attempted with null verification dates. References to retrieved restriction lists, confirmed OANDA acceptance and general local legality were qualified rather than represented as our own verification. Funding steps explicitly depend on confirming applicable requirements first.
- Draft/noindex/follow and sitemap exclusion remain in place. No legal or editorial approval is inferred from deployment.

Validation: TypeScript, scoped ESLint and production build passed. Browser checks passed for heading order, one H1, five comparison rows, two tables, three accessible FAQ disclosures, matching FAQ schema, no image, noindex, four existing review destinations and the country library. No document overflow at 320, 390 or 1440 pixels; article paragraphs are 18px; no browser errors. Main rendered text is 1,291 whitespace-separated words (including navigation and disclosures).
