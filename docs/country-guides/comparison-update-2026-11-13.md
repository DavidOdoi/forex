# Sri Lanka comparison and official registration links

## Owner's requested changes

The owner asked for the missing comparison and supporting tables, a stronger introduction, named brokers in the Quick answer, pure-white page surfaces, pure-black text, and a more useful design. The previous limits still apply: **at most 1,700 words and exactly three FAQs**.

When asked about affiliate destinations, the owner answered: **“for now I dont have affliate links but just add the url for signup for those platforms.”** The four new registration buttons are therefore explicitly unpaid official links. They do not create an affiliate agreement, serving-entity allocation, local authorization, trading/funding permission, or publication approval. Paid links still use the unchanged `resolveCountryAffiliateLink` checks; no tracking URL has been entered.

## Changes

- A fuller introduction explains costs, platform fit and Sri Lankan payment context.
- The Quick answer names Exness, XM, IC Markets and Pepperstone and includes direct jump links to their comparison rows.
- A full-width, eight-column comparison shows research entities/regulator references, platforms, advertised FX pricing, account minimums, swap-free terms, unresolved local funding fit and the focus of each global review.
- Four supporting tables cover trader priorities, total costs, broker strengths/trade-offs and proposed payment checks. Five tables total.
- Normal source links use descriptive anchors. Each broker has a real global review link and a clearly named official sign-up button.
- Comparison rows become cards below 900px. Three-column supporting tables become cards on phones; two-column cost/payment tables remain tabular. No third-party script or dependency was added.
- Page surfaces are `#fff`, text is `#000`; restrained borders, spacing and gold button outlines provide hierarchy. Shared site header/footer styling is preserved.
- The full original research archive, source provenance and legal/evidence records remain intact. The source list is condensed; substantive source-date caveats remain visible.

## Source and link provenance

Broker account and regulator summaries come from `sri-lanka-dossier-2026-11-10.json`. Supplementary Standard deposit and swap-free conditions for Exness, XM account pricing/Islamic conditions, and IC Markets holding-fee conditions use the existing global reviews' primary-source snapshots from 4–10 November 2026. This is not a new current-law review or live spread measurement. Advertised spread floors are explicitly distinguished from typical EUR/USD costs; per-side and round-trip commission units remain visible. Pepperstone's $0/$10 wording and account/platform questions remain qualified.

On **13 November 2026**, fresh HTTPS requests retrieved each broker's official website and its linked registration destination. XM's rendered homepage was also checked in Chromium. All four registration destinations returned HTTP 200:

| Broker | Official registration link | Observed destination |
| --- | --- | --- |
| Exness | `https://my.exness.com/accounts/sign-up?lng=en` | Same URL |
| XM | `https://www.xm.com/goto/profile/en` | `https://www.xm.com/register/profile-account` |
| IC Markets | `https://secure.ic.com/en/Account/Register` | `https://secure.ic.com/Account/Register` |
| Pepperstone | `https://secure.pepperstone.com/register?locale=en` | Same URL |

These GET requests establish reachable official destinations, not account acceptance or lawful funding. No account was opened and no deposit/withdrawal/execution test was performed. Buttons use `nofollow noopener noreferrer`, open in a new tab, and sit with an adjacent eligibility/permission/risk note. Affiliate disclosures correctly say these links are unpaid.

## Remaining research

The guide stays `pending_review`, draft, `noindex, follow`, outside the sitemap. Paid affiliate settings remain off. The comparison is of attributed international examples; no broker is ranked or labelled “best for Sri Lankan residents.”

See [the Perplexity handoff](perplexity-comparison-research.md) for three-broker research batches covering the exact serving entity, explicit acceptance, current local rules, published average costs, payment scope, swap-free conditions and conflicting terms. Unpaid registration links must not be reinterpreted as country-specific eligibility evidence.

## Verification

The automated browser checks include the 1,700-word ceiling, three FAQs, all five tables, eight comparison columns, four official registration links, disclosure/rel attributes, linked global reviews, rendered black-on-white colours, source anchors, mobile overflow, navigation, keyboard controls and unchanged paid-affiliate failure cases. The complete main content is **1,640 words**, including collapsed FAQs and source records. All 23 country-guide/dossier/design tests passed; the five design tests passed again after the final text/spacing refinement. ESLint, TypeScript checking and the production build passed. Browser previews found no errors or mobile page overflow. The four official registration destinations also returned HTTP 200 during the source checks above.
