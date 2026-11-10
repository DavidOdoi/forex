# Country broker research guides

First implementation: `/forex-brokers/sri-lanka`. Library: `/forex-brokers`.

This is separate from the existing “how to start trading” Insights articles. It uses the existing Next.js App Router, Manrope typography/design tokens, broker identities, author profile, canonical origin and Playwright tooling. No new dependency, historical dataset, tracking integration or duplicate Sri Lanka article was added.

## Present Sri Lanka state

- `legalStatus: pending_review`, `publicationStatus: draft`.
- Commercial links disabled; no broker mappings, entity claims, scores, rankings, payment information or affiliate agreements populated.
- No legal/editorial approval or independent reviewer recorded. No publication, modification, legal-review or successful source-check date invented.
- Existing author record: David Odoi, linked to the existing profile; no legal or other qualifications assumed.
- Country page and library are noindex, follow. Neither enters the sitemap while the only guide is a draft.
- The shared header omits its broker-finder prompt on country-research routes and uses a research link in the mobile drawer. General site navigation remains available.
- No account-opening, funding or circumvention instructions. Links in the guide lead to the identified official references, supplied editorial guidance, the author and the existing methodology/corrections pages.
- Unknown values remain unknown. The currency claim is null and is not displayed or used in a calculation.

## Research attempt and actual evidence

No external page was successfully consulted. Fresh HTTPS requests to all five references below returned the environment proxy's CONNECT 403 denial:

1. CBSL notice supplied by the user: `https://www.cbsl.gov.lk/sites/default/files/cbslweb_documents/press/notices/notice_20191021_unauthorized_foreign_exchange_trading_e.pdf`
2. Current CBSL notices: `https://www.cbsl.gov.lk/en/press/notices`
3. Department of Foreign Exchange guidance lead: `https://www.dfe.lk/`
4. Google people-first guidance: `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
5. Google review guidance: `https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews`

The initial 21 October 2019 filename-based label was corrected after the subsequent supplied dossier described an undated PDF body. For that notice, `publishedAt` is now null and `publicationDateStatus` is `unknown`; `checkedAt` remains null. The filename clue remains explicitly distinguished from a confirmed publication date. The page explicitly states that the notice's exact text, current application, definitions, exceptions and later official changes are unresolved. It makes no current-law determination and no Google endorsement or certification claim.

Before publication, a suitably qualified human must read the original notice, identify current CBSL/DFE guidance and subsequent official changes, establish the relevant resident/product/transaction scope, and record a substantive legal review. Desk research and document access are different from legal approval. A broker accepting a registration must never be treated as proof of permission or local authorization.

## Data separation

- `src/lib/country-guides/broker-master.ts`: existing broker identity adapter. A name or existing review establishes no country eligibility. Website candidates are not commercial destinations.
- `types.ts`: separate country claims, sources/scopes, entities, human approvals, agreements and geo-approvals. Claims carry value, verification, date and attributable source IDs; source records carry publisher, publication-date provenance, access outcome and checked date.
- `catalog.ts`: individually researched country copy and evidence ledger. Currently exactly one guide. No entity mappings, private agreements or approvals are inferred from group-level reviews.
- `affiliate-agreements.ts`: private agreement and country-targeting configuration; empty until real records are supplied. Do not put private contract details or personal data in public source copy.
- `evidence.ts`: HTTPS/date, verification, scope and real approval-role validation. A checked broker source is not regulator confirmation. A firsthand assertion requires a separately checked `firsthand` record.
- `publication.ts`: human legal/editorial publication gate and independent unranked-comparison gate.
- `affiliate.ts`: the only commercial destination resolver for country guides. It does not inspect commission amounts or create rankings.
- `seo.ts`: truthful metadata/WebPage-or-Article/breadcrumb output and approved-only sitemap entries, using the configured site origin.

UI components under `src/components/country-guides` consume this data without hardcoding Sri Lanka. Essential research and source status are server-rendered HTML. Country pages evaluate date-sensitive agreements on each server request; no client fetch or registration is needed.

## Adding another country responsibly

1. Research that country's actual legal and funding position first. Preserve exact URLs, publisher, scope, publication-date provenance, access results and actual check dates. Record unknowns explicitly.
2. Add one `CountryGuide` with its own direct answer, legal summary, five independent questions, useful sections and FAQs. Do not duplicate Sri Lanka prose by swapping the country name. Add only researched routes; unknown slugs return 404.
3. Link a genuine existing author record. Add a real editor/legal reviewer only when a real accountable person is documented; roles and professional qualifications are not inferred from an author name.
4. Keep the guide draft/pending and commercial links false while review is incomplete. Entering an affiliate URL, a review date or `publicationStatus: approved` alone cannot unlock the page.
5. Where justified, add the exact entity and licence evidence separately from its broker's master identity. Document resident acceptance, local authorization, trading permission and funding permission as independent, scoped claims.
6. Record actual human legal and editorial approvals, dates and audit references. Attach source IDs that were really checked. The legal outcome must match the country configuration; the legal summary needs regulator-confirmed source evidence. Use `publishedAt`/`updatedAt` only for actual editorial events, never today's date by default.
7. An approved informational guide can be indexable even if the country is restricted and has no affiliate links. Do not fabricate a “best” list. Its publication approval is independent of affiliate settings.
8. An unranked comparison needs an explicit educational purpose, separate human comparison approval, verified entity identity, known regulator-confirmed local status and checked resident-eligibility evidence. Unverified optional fees, platforms, suitability and payment fields display as unknown. Detail cards link only to existing selected broker-review paths; no missing review routes are invented.
9. Enable any commercial link only after the country is legally permitted within a human-reviewed scope, trading/funding permission is evidenced for that entity, the legal approval explicitly includes it, and a real active agreement and approved country-targeting record are documented. The human editorial record must explicitly approve commercial links as well as the country policy flag. Keep restrictions visible. Where a foreign entity is not locally authorized but the reviewed jurisdiction permits that scope, that distinction must remain explicit; do not convert it to “locally regulated.”
10. Review the surrounding site commercial policy/disclosure before activating real agreements; do not claim “no additional cost” or commission-independent rankings without support. Release only with user authorization.

## Resolver requirements

`resolveCountryAffiliateLink` returns null unless every condition passes: permitted country policy, approved country guide, real role-appropriate human legal/editorial records with explicit commercial scope, legal scope covering the exact entity, regulator-confirmed entity identity, checked resident acceptance, known regulator-confirmed local status, regulator-confirmed trading/funding permission, active in-date agreement, approved matching country/broker/entity targeting, checked private agreement evidence and an HTTPS URL on the agreement's exact approved host list. Missing, revoked, future, expired, unverified and wrong-scope records fail closed. Credentials in URLs and non-HTTPS URLs are rejected.

The UI renders no comparison or CTA for Sri Lanka's present state. It does not render hidden paid URLs, disabled anchors or private affiliate sources in the public source footer. Valid future paid links use `rel="sponsored nofollow noopener noreferrer"`, open in a new tab and have an adjacent paid-link disclosure. There is no click-event collector or added analytics; no personal identifiers are transmitted by this implementation.

## Review checklist

- Current legal scope and amendments; trading and funding considered separately.
- Exact serving entity and local permissions; no group-licence transfer assumptions.
- Evidence/source status and genuine review dates; no firsthand testing without records.
- Informational headings/disclosure match reality; no unsupported scores or rankings.
- Comparison and affiliate gates; no commercial URLs in restricted/pending HTML.
- Native table semantics, named keyboard-scrollable region, source anchors, mobile navigation and native FAQ accordions.
- Typecheck, lint, build, relevant browser/data tests, screenshots, indexing exclusion and broken-link checks.

Synthetic records in `tests/fixtures/country-guide.ts` exist only to test future states. They are not research, real approvals, licences or agreements, and must never be copied into production data.

See `validation.md` for the actual implementation check results and release state.

## Supplied research updates

The subsequent user-supplied dossier is archived and structured in the [dossier update record](dossier-update-2026-11-10.md). Its 28 ledger findings and four broker research packets are reported research, not independent checks or country eligibility. `reportedAccess` and `reportedUpdatedAt` are contributor metadata; they never populate `checkedAt` or legal/editorial review dates. Public quotations identify their dossier provenance and require a matching country/entity, cited source and reported access record.

The live draft remains informational and unapproved. The owner separately authorized the earlier push of commit `d872f47` to the production branch; that deployment authorization does not establish legal, editorial or commercial approval. The research update keeps the same draft/noindex/commercial-off posture.
