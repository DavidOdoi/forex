# Google Search Console and crawlability

Production property: `https://devinforex-five.vercel.app/`.
Prepared 8 November 2026.

## Public crawler files

- Robots: https://devinforex-five.vercel.app/robots.txt
- Sitemap: https://devinforex-five.vercel.app/sitemap.xml

Next.js generates both from `src/app/robots.ts` and `src/app/sitemap.ts`. Do not add competing copies in `public/`. The correct crawler filename is `robots.txt`.

The robots file allows crawling and advertises the canonical sitemap. Crawling must remain allowed on draft pages so Google can read their noindex directive.

## Indexing policy

The confirmed production origin is the default even when Vercel's optional `SITE_URL` variable is unset. Previously that omission caused the homepage, About page and Reviews directory to send `noindex, nofollow` and kept them out of the sitemap. `SITE_URL` still supports a future custom domain.

The sitemap includes ready canonical pages: Home, About, the Reviews directory, the Insights library and its published articles, the tools hub and four calculators, and both gold dashboards. Article and dashboard modification dates use their recorded editorial dates rather than a new timestamp on every deployment.

Unfinished broker profiles, review/template demonstrations, the unfinished comparison and finder demonstrations, the author placeholder and image-credit utility page remain noindex and outside the sitemap. JSON data endpoints receive an `X-Robots-Tag: noindex` header. These pages and endpoints remain accessible through the website.

Preview and Vercel development deployments remain noindex and do not advertise a sitemap. A future completed broker review must pass the existing publication checks before its canonical URL can enter the sitemap.

## Final step inside the owner's Search Console account

The owner says the property has been added. This task has no authenticated Search Console connector or shared-browser controls; no sitemap submission or URL-indexing request is claimed.

1. Open https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fdevinforex-five.vercel.app%2F
2. Select the property matching the production origin above.
3. Under **Add a new sitemap**, enter `sitemap.xml` when Google already shows the site's prefix, or paste the full sitemap URL above.
4. Select **Submit** and check the report for processing or fetch errors. Sitemap submission can be processed asynchronously.
5. Optionally inspect the homepage and one published article using **URL inspection → Test live URL**. Request indexing if Google offers it and the live test permits indexing.

Google decides which eligible pages to index. A successful sitemap fetch or request does not certify that every URL is indexed. Use Search Console's Page indexing report to diagnose individual URLs, including redirects, canonical selection and noindex exclusions.

## Verification

The automated crawlability checks validate the sitemap XML, unique canonical URLs, HTTP 200 responses, index/follow directives for every listed page, and noindex exclusions for drafts and demonstrations. The deployment is checked again on the public origin after release.

Production verification on 8 November 2026 passed for all 36 sitemap URLs using a Googlebot user agent: each returned HTTP 200 with matching canonicals and index/follow directives. The robots file advertised the correct sitemap, and the draft/utility exclusions and JSON noindex headers also passed. This verifies public responses; it is not a claim of Search Console submission or confirmed inclusion in Google's index.

Primary references:

- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/robots/intro
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://support.google.com/webmasters/answer/7451001
