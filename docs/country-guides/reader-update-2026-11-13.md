# Sri Lanka reader template update — 13 November 2026

Route: `/forex-brokers/sri-lanka`.

The owner supplied a Perplexity content/design brief and explicitly required **three FAQs** and **no more than 1,700 words**. That direct limit overrides the attachment’s suggested 2,000–3,000 words. The implementation uses its useful comparison, account-cost and platform framework without inventing resident eligibility, verified local prices, rankings, trading tests or funding permissions.

## Reader-facing changes

- A shorter keyword-led title and introduction, followed immediately by a labelled Quick answer.
- White background, dark body copy in 18px Manrope, restrained gold/green accents and clear keyboard focus.
- Short sticky section links, a desktop research sidebar and broker rows that become readable cards on phones.
- Four research candidates, each with a descriptive link to its existing global review. Those links are explicitly separated from Sri Lankan resident eligibility and local authorization; they are not account-opening or commercial links.
- A total-cost table covering spread, commission units, overnight/swap-free conditions, conversion/payment fees and minimum deposits. It does not invent numerical Sri Lankan account terms.
- A platform/account-fit table, brief payment context and concise marketing red flags.
- Five existing eligibility/permission questions in a native disclosure, with working fragment navigation.
- Exactly three concise, country-specific FAQs.
- A compact financial-source ledger with working citations, contributor-access provenance, independent-check status and publication-date caveats. The two public SEO-guidance references were removed from the reader’s source list; their underlying records remain intact.

The original supplied dossier, all 28 findings, four broker packets, nine legal-review questions and nine owner-evidence questions remain unchanged in the research archive/data. Their long internal workflow is not repeated in the public article. One useful attributed historical quotation remains visible, with its source/provenance guard retained.

## Reusable template and evidence handling

Changes are in `src/components/country-guides/`, the route-scoped `src/app/forex-brokers/country-reader.css`, and `src/lib/country-guides/`.

Optional introductions and SEO titles use country-scoped claims. A cloned guide cannot accidentally display Sri Lanka’s introduction or SEO title for another country. Optional section tables support future individually researched guides. Compact citation labels change presentation, not verification. Existing comparison, firsthand-evidence and affiliate approval checks remain active.

The guide remains an informational research draft: `pending_review`, `noindex, follow`, outside the sitemap, with no fabricated publication/approval dates or commercial links. A layout/content deployment does not manufacture legal, editorial or commercial approval.

## Validation

The complete rendered main content is **1,602 words**, including closed FAQs, checklists, source records, navigation and sidebar copy. The three FAQ answers and article paragraphs remain short. Tests cover keyword/canonical metadata, source provenance, cross-country isolation, exactly three FAQs, the 1,700-word ceiling, real internal review destinations, native disclosures, sticky navigation, 18px body typography and responsive layout at 320, 390, 768 and 1440 pixels.

The full regression run also exposed a pre-existing sitemap test still expecting 37 entries after the market-hours release. Its expected count is corrected to 38 with an explicit market-hours URL assertion; public indexing policy is unchanged.

ESLint, TypeScript checking and the production build passed. The final full regression run passed 166 of 167 tests, including every country-guide/content/approval test. The remaining market-hours test started its running clock one second before the weekly close and crossed that boundary during navigation under load; the unchanged test passed when rerun alone. Manual desktop/mobile previews reported no browser errors, 1,602 words, three FAQs, four research rows and no horizontal overflow.
