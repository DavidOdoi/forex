# Shared review template across the broker directory

The user-supplied `forex-broker-directory-2026-11-02.csv` is retained at `data/forex-broker-directory-2026-11-02.csv`. Its SHA-256 is `cc1c71290a186b9abcfe3dd7bddbe94999d2e31f6daec9e7623f02cb6a4ebc02`.

All 325 identities are represented at `/reviews/[slug]`: 298 retail forex/CFD entries, 14 institutional/professional entries, 12 interbank entries and one introducing entry. These are directory classifications, not independently verified service or licensing conclusions.

## Shared implementation

All routes use `BrokerReviewPage` / `EditorialReviewPage`, preserving white backgrounds, black text, readable typography, verdict, quick facts, source handling and sticky contents navigation. Retail profiles have the five account-action placements and a broker-labelled hypothetical cost illustration. Institutional, interbank and introducing profiles adapt the sections to access, service pricing, funding/settlement and counterparty research, and omit retail signup actions and broker-rating graphics.

Author attribution uses the supplied name David Odoi. Biography and editorial approval remain incomplete. Existing Exness facts and entity profiles retain their own source records; they are not copied to other brokers. Missing fees, deposits, licences and eligibility remain unverified. CSV URLs are research leads and do not activate account links or count as collected evidence. Existing source notes are preserved; no new mass collection or factual approval is claimed.

## Linking

- The complete A–Z index at `/reviews#all-providers` renders all 325 profile links in initial HTML and uses native disclosure controls.
- Search, pagination, research-status filters and directory-type filters support browsing.
- Each profile links to three other existing research pages, the full directory and relevant calculators for retail pages.
- Alphabetical neighbours within each provider group give every entry in a non-singleton group reciprocal incoming links. A further link prefers shared documented entity scopes. The one-entry introducing group uses other existing directory pages as fallback.
- A country parameter is used only where that destination has a matching entity profile. These links do not imply client eligibility, relative quality or price rankings.

The dataset export retains all rows and source candidates. The original CSV and catalogue identities are compared in Python tests; browser tests check the shared templates, complete HTML index, valid link targets, provider distinctions, country isolation and word limit.

## Verification

All 40 browser checks and 18 Python research checks passed, along with type checking, lint and the production build. The browser suite requested all 345 broker/scope/demo variants; every page loaded and stayed within the 1,800-word ceiling. The longest was the template at 1,799 words. The no-JavaScript directory test found all 325 distinct profile links. Link tests resolved every related destination and checked reciprocal links within non-singleton groups. CSV names and checksum match the preserved upload.
