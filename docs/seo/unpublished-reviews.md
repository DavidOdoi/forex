# Broker review visibility and indexing

Updated 10 November 2026 at the owner's request to keep only Exness, XM, IC Markets and Pepperstone on the public website.

## Public selection

`src/lib/reviews/selection.ts` declares the four selected brokers. The review directory renders their cards and links without a preview action or JavaScript. The homepage, comparison cards, broker finder and desktop/mobile review menus use the same selection. Each selected review links only to the other selected brokers.

Website availability is separate from factual completeness and indexing approval. `visibleReviewEntries`, `visibleReviewHref` and `getVisibleReview` support ordinary website navigation; the existing publication guard still controls indexing, approved-review schema and review sitemap entries. No review status, verified field, licence claim, score or editorial approval is fabricated. Evidence dates remain unchanged. The visible accountability label records availability on the site from 10 November 2026 and identifies outstanding verification.

## Archived research

The 325-entry CSV/source catalogue remains in the repository for future research. It is no longer exposed through the public bulk preview. `/api/review-research` returns 410 with no entry list. Other known broker-review URLs, including their JSON downloads and country queries, return **410 Gone** with `noindex, nofollow`. Unknown broker slugs return 404. Shared review templates remain accessible at their saved URLs, with noindex, but are not listed in the public directory.

## Search behaviour

Only reviews meeting the existing editorial/evidence publication guard enter the review sitemap or receive indexing approval. The selected four remain source-based research with outstanding checks, so their existing noindex instructions remain in place. The review directory is visible to readers and remains noindex while none of its records qualify for editorial indexing approval. This is a search directive, not access control.

Robots.txt allows crawling so Google can read the indexing directives and 410 responses. No user-agent-specific content, hidden keyword text or redirects to unrelated reviews are used. Current sitemap URLs and indexable guides/tools remain unchanged.

## Validation

Checks cover four server-rendered cards, direct review URLs and source downloads, homepage/menu/finder discovery, related links restricted to the selection, search and phone layouts. Archived catalogue unit checks remain; public-route tests now exercise the selected brokers and verify retired pages return 410. Existing financial evidence/publication guards are retained.
