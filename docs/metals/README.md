# DEVIN FOREX precious-metals hubs

Built 7 November 2026. These are two working Next.js data pages, with the complete copy and implementation handover in:

- [Gold-price hub](gold-price.md)
- [Gold-and-silver dashboard](gold-silver-prices.md)
- [Data contract, formulas and update plan](data-and-operations.md)

The gold page focuses on XAU/USD, weight, purity and gold value. The comparison page focuses on two metals, relative performance, the ratio and silver’s industrial demand. No additional keyword-variant pages were created.

## Connection status

Current spot quotes work without an account. The source’s contract identifies gold and silver as USD per troy ounce. Currency estimates use Frankfurter’s dated daily blended reference rates, not live FX.

Historical spot data needs a **free Gold API account**. The owner’s Production setting is named `gold_api`; the server accepts this existing name as well as the documented `GOLD_API_KEY` name. When both are set, the non-empty `GOLD_API_KEY` takes precedence. Never paste key values in chat, source code, client variables, screenshots or documentation. Configure the value securely in Vercel Production, then redeploy. No purchase is required for daily history under the provider’s currently documented free limit.

The free plan does **not** include minute/hour history. Therefore the 24H control gives an explicit unavailable explanation. It must not display a made-up intraday line or a daily series relabelled as intraday. Premium intraday support is a separate optional integration, not a claim made by this release.

Without the key, current quotes, conversions, purity adjustments, budget calculations, the current ratio, explanatory copy and sources work. Historical charts, historical returns, today’s change and 52-week extremes remain unavailable. They are never populated from sample data. Test fixtures exist only in `tests/metals.spec.ts`.

Authenticated history response shapes are implemented against the provider’s public documentation and tested with fixtures. An actual authenticated production response still needs verification after the owner configures the key. Do not describe that verification as completed beforehand.

## Publication package

Both pages have unique titles and descriptions, self-referencing canonicals, visible author/editorial dates, server-rendered content and quotes, WebPage/Person/Organization/BreadcrumbList/FAQPage JSON-LD, unique original 1200×630 images, social cards and XML sitemap entries. Preview deployments remain noindex. Broker review publication guards are unchanged.

The site’s established canonical style omits a trailing slash. `/gold-price/` and `/gold-silver-prices/` redirect to `/gold-price` and `/gold-silver-prices`, respectively. No duplicate slash version is indexed.

The header’s Tools submenu and the footer link to both hubs. Internal links use existing relevant resources; unbuilt XAU/USD, silver, gold-vs-Bitcoin and gold-broker-guide slugs are not linked. The dashboards’ existing XAU/USD, product-type and metals-exposure explanations cover those immediate questions without creating thin extra pages.

There are no broker endorsements or affiliate links in either dashboard. Any later affiliate section needs entity/product/residency checks and a nearby disclosure. At most three evidenced recommendations per page; use neutral CTAs and `rel="sponsored"` on actual referral links.

## Local verification

```bash
npm run lint
npm run typecheck
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/metals.spec.ts tests/navigation.spec.ts
```

In this managed cloud executor, Node 24 needs `NODE_USE_ENV_PROXY=1` for build/server/test processes to use the inherited outbound proxy and CA trust. This is a local execution setting, not a Vercel credential or an instruction to change the deployed app’s networking.

The Markdown page-copy exports are generated from built semantic HTML by `tools/markets/export-handover.py`; they replace volatile quote/results with explicit template fields. Do not publish those fields as literal prices.
