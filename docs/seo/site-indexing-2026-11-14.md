# Site-wide indexing — 14 November 2026

The owner explicitly requested that all public website content become eligible for Google indexing. This supersedes the earlier search-exclusion policy for publicly available research drafts. Indexing eligibility is independent of factual verification, legal/entity checks and editorial approval; no approval, credential, score or publication date was fabricated.

## Implementation

- Production public content uses `index, follow`: broker reviews and their directory, country guides and their library, articles, calculators, metals dashboards, comparisons, broker finder, author profile, image credits and other public pages.
- Removed the broker proxy’s production `X-Robots-Tag: noindex` headers for selected public reviews and their directory.
- The XML sitemap includes all 97 canonical content URLs, including publicly available country/entity variants. Canonicals remain on `https://www.devinforex.com`; sitemap entries are unique and existing update dates are used only where present.
- Public review-directory links are followable. Source disclosures, unresolved checks and regulatory warnings remain visible.
- `robots.txt` already allows crawling and advertises the canonical sitemap. It was verified rather than unnecessarily replaced.
- Preview/development deployments retain their environment-level indexing exclusion. Retired broker archives are not restored. Duplicate example templates, JSON/API responses and error pages remain outside the content sitemap; redirect aliases consolidate into their existing article destinations.

## Verification

- Production compilation and TypeScript: passed using Next.js’s supported Webpack compiler (the local environment restricts Turbopack’s internal worker port).
- Scoped ESLint and whitespace checks: passed.
- 22 targeted Playwright/data checks: passed.
- All 97 sitemap URLs: HTTP 200, index/follow metadata, matching self-canonical and no blocking response header.
- All 36 public review routes/scopes, including the demonstration: remain within the existing 1,800-word limit.
- Tests confirm indexing does not manufacture independent editorial approvals, ratings or verification status.

No Google Search Console connector is available in this session, so a Search Console sitemap submission or URL-inspection request has not been made. The sitemap can be submitted or resubmitted at `https://www.devinforex.com/sitemap.xml`. Google controls crawling, canonical selection, indexing and ranking; technical eligibility is not a promise of inclusion or traffic.
