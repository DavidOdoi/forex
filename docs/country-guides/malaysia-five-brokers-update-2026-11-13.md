# Malaysia — five-broker template population

The owner corrected the country lists and requested **IC Markets, OANDA, XM, FBS and Tickmill** for Malaysia. They explicitly requested the existing template, **no images**, three FAQs and no more than 1,700 words. The earlier four-broker Malaysia draft was committed locally but never pushed/published before the owner paused it. This version replaces that draft before its first deployment.

## Implementation

The same `CountryGuideContent`, CSS, comparison cards, five tables, Quick answer, section navigation and source/FAQ disclosures are reused. No replacement page layout was created. The main table now has five user-selected brokers and eight comparison columns, populated with scoped international terms rather than a list of gaps. The supporting tables cover reader priorities, total costs, broker strengths/trade-offs and funding checks.

IC Markets and XM use their existing selected global review links. OANDA, FBS and Tickmill do not link to nonexistent new reviews; all five receive an **Official site** button to a real provider destination. These are unpaid website links and not assertions of Malaysian onboarding or locally authorised retail CFD service. No affiliate programme/tracking URL or approval record was invented.

Malaysia's featured-image mapping and unused image asset were removed. Its share metadata and WebPage no longer attach that photo. Sri Lanka's image, published content and sign-up links remain unchanged. The owner will add images manually to Malaysia, the UK and Netherlands.

## Research handling

The new file is preserved verbatim in `research/malaysia-five-brokers-dossier-2026-11-13.md`, SHA-256 `49fd14f62cb0c16c974e15868e15afcee1ca4f99824eb9d67f7c9e9c8bc24890`. The 41-entry source ledger supplied separately in chat is preserved as reported references in `src/data/country-guides/malaysia-five-brokers-dossier-2026-11-13.json`. Many of its URLs are homepages, so contributor labels are not promoted to independent verification.

Existing IC Markets and XM source checks from 10 November are reused. Fresh OANDA BVI account/charge/legal pages, FBS home/conditions/legal/about pages and Tickmill's account overview were retrieved on 13 November. Checked observations and file hashes are in `docs/research/malaysia-five-brokers-source-checks-2026-11-13.json`.

Material qualifications retained:

- The SC domestic CFD framework and offshore broker specifications are different scopes. No universal Malaysian acceptance or funding permission is inferred from a translated website, country omission or global account page.
- OANDA's current account comparison differs from the dossier's Premium Plus commission description; only the supported Standard model is used. Its universal $0 deposit claim is not presented as verified.
- IC Markets ordinary Raw and Tickmill Raw/TradingView Raw commission units remain distinct. Early-access IC Raw Pro accounts and unperiodised average spreads are not promoted as ordinary measured offers.
- FBS deposit/spread/platform/commission advertisements are sourced, while the exact Malaysian contractual company remains separately attributed.
- No unconditional negative-balance, local compensation, clone-alert, Labuan surrender-date, high-leverage or execution-speed claims are added from incomplete references.

The current SC guideline/FAQ checks from the initial draft remain valid and are reused; no legal/editorial approval, entity mapping or paid-country approval is manufactured. Malaysia stays draft, `pending_review`, `noindex, follow`, outside the sitemap. UK/Netherlands pages still await their research dossiers.

The concise actionable gap list is [malaysia-manual-follow-up.md](malaysia-manual-follow-up.md). It records the exact document or question needed rather than interrupting population for each missing field.

## Validation

The rendered main content is **1,669 words**, including collapsed FAQ/source text. There are five broker rows, eight comparison columns, five tables, exactly three FAQs, five unpaid official-site buttons and no featured image. Existing global review links are present only for IC Markets and XM; no missing reviews were invented.

The production build, ESLint and explicit TypeScript check passed. The combined country-guide run passed the existing Sri Lanka/shared checks; the final four Malaysia checks passed after fixing a source-fragment reference and shortening copy to the required limit. Those checks cover the original dossier hash, reported versus checked source records, country/date isolation, complete internal anchors, no image, real website links, source/country scope, no paid tracking links, three FAQs and mobile/desktop layout at 320, 390, 768 and 1440 pixels. Sri Lanka remains at 1,661 words with its existing four brokers, image and sign-up links.
