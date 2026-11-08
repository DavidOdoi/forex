# Unpublished broker reviews: discovery and indexing

Updated 8 November 2026 at the owner's request to keep unfinished reviews out of Google search.

## Public presentation

Only reviews passing `isReviewPublished` can appear in the public review directory, its A–Z index, shared navigation, broker-card links, related research or comparison links. The current 325 profiles are drafts, so the public directory shows a preparation message. Its metadata and HTTP response remain noindex until at least one approved review exists.

Unpublished research remains available through **Reviews → Preview unpublished research**. The list is requested only after that button is activated; draft entries, template links and their target URLs are not included in the initial public HTML or its serialized props. The response uses no-store caching and noindex. Preview links use nofollow and disable automatic prefetching.

This is an on-demand research preview, not an authenticated or private workspace. Anyone with a direct draft URL can still access it. The preview API also remains public; its indexing directive is not access control.

## Known draft URLs

Draft HTML sends both `noindex, nofollow` metadata and `X-Robots-Tag: noindex, nofollow`. The proxy evaluates the actual review and country scope through the existing publication guard. Template demonstrations and the older template alias receive the same HTTP indexing instruction. Approved reviews retain their normal publication eligibility.

Robots.txt continues allowing crawling so Google can read noindex on URLs it already knows. A robots disallow would prevent that verification and can leave a discovered URL showing without content. No user-agent-specific content, redirects or cloaking is used.

Noindex controls eligibility for search results; it cannot erase a URL from Google's knowledge or prevent discovery through outside links. Previously known URLs need to be recrawled before their updated directives are processed. Absolute content privacy would require access control, which is not introduced here.

## Sitemap and publication

The public sitemap currently has 35 eligible canonical URLs. Draft broker profiles, template demonstrations and the empty review directory are excluded. Published guides, calculators, the homepage, About page and both gold dashboards remain available for search.

When a review has real completion evidence, publication dates and accountable editorial approval, the existing publication check admits it to the public directory, navigation and sitemap on deployment. Country-specific records are checked separately, and a published regional variant links to its own canonical scope rather than to an unfinished global record.

## Verification

Tests cover approved versus unfinished records, missing approval, no draft links in initial HTML, no preview API fetch before a user action, preview browsing and nofollow links, HTTP and HTML indexing signals, regional queries, sitemap exclusions, public-page links and unchanged crawl access for removal directives.

Google's guidance: https://developers.google.com/search/docs/crawling-indexing/block-indexing
