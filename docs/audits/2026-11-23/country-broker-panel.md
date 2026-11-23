# Country-aware broker discovery panel

Implemented 23 November 2026. The shared panel sits after introductions on article, review, country-guide, calculator, market-hours, metals, prop-firm and main library templates, including the homepage. It does not inject HTML into the document or alter the underlying article copy.

## What readers see

Up to three brokers from the current public review library, a descriptive comparison focus, a review link and, where supported, an official regional account/site button. The current review's broker is excluded on its own review page. AAFX and ZForex remain available as critical reviews but are excluded from promotional suggestions. No ratings, bonuses, referral codes, personal-suitability claims or guaranteed availability are invented.

The heading says **“Brokers to compare”**, rather than claiming that an IP location proves account eligibility. Browsing country and legal residence are distinct. Travellers and VPN users can select their residence manually. All 249 ISO country/territory choices are available; the selector is populated after hydration rather than adding hundreds of country names to the server-rendered article text.

The panel is original typography and CSS matching the site's white, black and gold styling. Broker initials are identifiers, not newly generated logos or third-party tracking images. Desktop and mobile examples: [desktop](country-brokers-desktop.png), [mobile](country-brokers-mobile.png).

## Detection, privacy and caching

`/api/broker-recommendations` reads Vercel's `x-vercel-ip-country` only when running on Vercel. This is a two-character country signal, not GPS, a city or a residence determination. The feature does not request browser geolocation, call a third-party location service, read/store the raw IP address, or set a tracking cookie. General hosting/security processing is distinct from this feature.

Manual choices use session storage for the current tab, with an in-memory fallback if storage is blocked. Choosing automatic detection clears the manual preference. Requests are shared and cached for five minutes within the browser tab only. There is no shared server-side country cache.

API responses explicitly use `private, no-store`, vary by `X-Vercel-IP-Country`, and have `X-Robots-Tag: noindex`. Invalid manual country codes return 400. Missing/invalid deployment signals leave the panel neutral; they do not become a fabricated country. A failed lookup retains research links and drops external account CTAs.

Public pages remain statically rendered and indexable. No request-country header is read by the page's metadata, canonical or article renderer. The shared suggestion block uses `data-nosnippet` so the promotional/navigation copy is not supplied as article snippet text. There is no crawler-specific behaviour.

## Coverage and evidence boundaries

The coverage registry contains 19 researched market profiles, not a worldwide account-eligibility list:

| Treatment | Markets |
| --- | --- |
| Dated regional-offer checks enable official account/site buttons | United Kingdom, Australia, Kenya |
| Country-relevant review subjects, with eligibility unconfirmed and no account buttons | Netherlands, Singapore, South Africa, Uganda, Nigeria, Ghana, UAE, US |
| Local-rule guide first; no automated offshore account recommendations | India, Pakistan, Sri Lanka, Malaysia, Philippines, Vietnam, Tanzania, Ethiopia |
| Other countries or unavailable automatic detection | Neutral, explicitly unconfirmed review-library browsing |

The country research subjects are drawn from existing site guides; inclusion there is not proof of legal permission, resident acceptance, a particular contractual entity or personal suitability. US research is limited to OANDA and Trading.com rather than presenting global CFD brands as US offers. Guide-first handling preserves the unresolved or restrictive funding evidence already recorded on the site.

Regional links expire after 90 days without another source check and revert to research-only links. A checked regional offer is still not an approved application, an independent regulator review or a promise that every product is available. Country-specific affiliate agreements have not been invented.

## Official regional destinations checked

The following eight account/site destinations returned HTTP 200 during implementation. Regional provider pages were read to establish their intended market; account-issuance eligibility must still be confirmed in the provider's application and agreement.

| Market / broker | Destination | Regional source |
| --- | --- | --- |
| UK · IG | https://www.ig.com/uk/application-form | https://www.ig.com/uk |
| UK · Pepperstone | https://secure.pepperstone.com/register?legalEntity=individual&locale=en-gb | https://pepperstone.com/en-gb/ |
| UK · OANDA | https://www.oanda.com/uk-en/ | https://www.oanda.com/uk-en/ |
| Australia · IC Markets | https://www.icmarkets.com.au/en/ | https://www.icmarkets.com.au/en/ |
| Australia · Pepperstone | https://secure.pepperstone.com/register?legalEntity=individual&locale=en-au | https://pepperstone.com/en-au/ |
| Australia · IG | https://www.ig.com/au/create-account | https://www.ig.com/au |
| Kenya · Exness | https://my.exness.ke/accounts/sign-up?lng=en | https://www.exness.ke/ |
| Kenya · Pepperstone | https://secure.pepperstone.com/register?legalEntity=individual&locale=en-af | https://pepperstone.com/en-af/ |

The Exness regional page explicitly limits that company to Kenyan residents and Kenyan-incorporated entities. Its international offer is not substituted. UK and Australian pages retain their own regional destinations. Refer to [Vercel's request-header documentation](https://vercel.com/docs/headers/request-headers#x-vercel-ip-country) for the country signal.

## Commercial handling

All current destinations are ordinary official URLs, without affiliate tracking. The panel visibly says so. External account links use `nofollow noopener noreferrer` and open in a new tab; source and internal review links remain distinct. There are no copied promotion codes, fabricated bonuses or stale broker loss percentages from the reference screenshot. A general leverage-risk warning is shown.

Actual affiliate tracking links require the owner's programme URLs, disclosure updates and country-targeting confirmation. Monetisation must not change mathematical results or turn an unconfirmed country into an available offer.

## Implementation locations

- `src/lib/broker-recommendations/countries.json`: country selector choices.
- `src/lib/broker-recommendations/markets.ts`: country research subjects and individually checked regional destinations.
- `src/lib/broker-recommendations/model.ts`: reviewed-only filtering, exclusions, neutral/guidance modes and regional-link expiry.
- `src/app/api/broker-recommendations/route.ts`: private per-request detection and manual selection.
- `src/components/broker-recommendations/`: shared accessible client panel and responsive styles.
- `/about#country-suggestions`: visible location, selection and commercial policy.

To expand checked account-button coverage, supply current primary-source resident-acceptance evidence, the exact serving company/product, the appropriate official destination and any relevant local trading/funding requirements. A foreign group licence or a comparison-site ranking alone is insufficient.

## Checks executed

Production Webpack build, full repository ESLint and TypeScript passed. The seven dedicated feature checks passed, covering all ISO choices, reviewed-only subjects, unsafe-subject exclusions, expiring links, trusted/missing country signals, privacy headers, invalid input, all major template placements without JavaScript, manual persistence, restricted/unknown markets, network failure, current-broker exclusion, responsive layouts, external link attributes and keyboard disclosure.

The 14-check regression run also passed: calculator metadata/layouts, all 17 country-guide images and editorial word limits, the 24 guide-format article records/readability, and all 36 broker-review scopes. The shared broker panel and its country selector are navigation/commercial UI, excluded from editorial word counts; existing article copy, closed FAQs, disclosures and source records remain counted. Review and country-guide limits have not been relaxed.

Two additional SEO checks passed: every catalogue article's server-rendered content/images/citations/schema, and all 97 public sitemap URLs returning HTTP 200 with canonical URLs and index/follow directives. The final visual check was repeated with the three-broker UK panel to retain both mobile and desktop screenshots.

No full-suite pass, automatic personal suitability assessment, worldwide broker availability or search ranking is claimed.
