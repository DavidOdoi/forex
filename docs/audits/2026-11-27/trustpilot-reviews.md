# Trustpilot profile snapshots — 27 November 2026

Owner request: use the supplied Trustpilot research to update all 21 selected broker reviews, retaining accurate profile identity, ratings, counts and source links. Later messages supplied XM 4.6 and zForex 4.27 without matching profile URLs. Those numbers were not substituted for publicly withheld TrustScores.

## Source checks and scope

All 21 primary Trustpilot pages and the separately supplied CMC Australian profile returned HTTP 200. Public profile data was retrieved directly on 27 November 2026. The ledger retains URLs, UTC retrieval timestamps, response hashes, profile identity, public aggregate ratings/counts and notice types; it contains no copied individual reviews. See `docs/research-handoffs/trustpilot-profile-checks-2026-11-27.json`.

The public aggregate score is used only when displayed in the profile's public aggregate data. Hidden internal `trustScore` values from unavailable-rating profiles are deliberately not published. Visible XM/xm.com and zForex/zforex.com notices state that their scores are unavailable because of review-guideline breaches. Review counts remain visible: 3,112 and 111, respectively. No conclusion about broker solvency, licensing, fraud or trading performance is drawn from these notices.

Nineteen profiles provide numerical TrustScores. Current direct checks differed from some submitted search snippets, including IG 3.7, FP Markets 4.7, Capital.com 4.6, Tickmill 2.9, XTB 4.1 and BlackBull Markets 4.6. The previously missing Fusion Markets and eToro scores were available directly: 4.8 and 4.0. Exact retrieved counts replace rounded estimates.

The main CMC profile, `www.cmcmarkets.com`, shows 4.3/5 from 3,623 reviews. The Australian website profile, `cmcmarkets.com.au`, shows 1.7/5 from 51 reviews and is displayed separately with an explicit geographic label. It is never substituted for the group profile. OANDA and AvaTrade regional profiles were not mixed into the primary profile. The Hantec Mauritius onboarding claim was outside this ratings update and was not introduced.

## Implementation

A central dated snapshot registry applies after each broker's research adapter, covering all selected reviews and their supported country variants. Customer-review sections show an attributed Trustpilot score, proportionally filled decorative stars, exact profile count, profile domain, checked date and direct source link. Withheld scores display “Rating unavailable” without numerical or visual substitute stars. Source notices remain linked and attributed. The design retains white backgrounds, black text and accessible mobile layouts.

These are checked snapshots, not a live feed, independent account tests or DEVIN FOREX editorial scores. `overallScore`, editorial publication status, broker facts, country eligibility and the existing structured-data policy are unchanged. No third-party aggregate rating is added to our review schema. IC Markets' earlier 10 November snapshot remains in the research history and as `previousSnapshot` in the downloaded data rather than being silently erased. The new primary snapshot has its own checked date.

## Broader regression findings

An initial broader 40-test run passed 37 and exposed three older failures outside this ratings change:

- IC Markets' stored dossier references `ic-au-shares`, absent from its source array. Loading the pre-change catalog reproduces the missing ID.
- An older IC Markets browser assertion expects the $7.83 cTrader/TradingView paragraph, while the pre-change template renders that paragraph only for XM.
- A global-branding assertion rejects “Kenya” anywhere in the review, including the existing worldwide residence selector's legitimate Kenya option. The selector was not changed here.

These were recorded rather than changing broker facts or unrelated article structure to satisfy old assertions. The existing IC/XM/Exness tests' Trustpilot-specific expectations were updated to the new snapshot contract. Final focused verification is recorded below.

## Final focused verification

All 33 focused tests passed on the final build: the 21 public review pages and JSON records, profile identities and counts across supported country variants, withheld-score handling, CMC geographic separation, fractional-star rendering, 320/390/1440px layout, browser-error checks, unchanged XM financial facts and the complete 123-URL canonical/indexing crawl. Production webpack build and TypeScript, ESLint and whitespace checks passed. Desktop/mobile screenshots were inspected, including the fractional fifth star. The wider suite's three unrelated failures remain documented above; a fully green wider suite is not claimed.
