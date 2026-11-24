# Forex lot size converter — 24 November 2026

Canonical `/calculators/forex-lot-size-converter`, indexable and linked through catalog, related cards and sitemap. Converts conventional standard/mini/micro/nano, configured platform lots and base-unit inputs into the same unchanged exposure. Conventional factors remain 100,000/10,000/1,000/100 even when the platform contract changes. The base currency is always labelled. Configured order limits use a minimum-anchored increment and optional maximum; incompatible amounts remain visible and alternatives never silently replace the input. Zero-size alternatives are omitted. Calculation limit is one trillion base units.

Pip value is optional. Missing currency rates report unavailable pip valuation while preserving the valid unit conversion. Other tools receive the exact converted units, not the raw input amount in a different unit system. Tiny nonzero equivalents use scientific notation rather than displaying zero. Wider four-column result tables now scroll within their own accessible regions to preserve readable words on narrow phones.

## Verification

- 5 pure groups passed: mandatory0.35 standard =35,000units =3.5mini =35micro =350nano and USD3.50pip, all six input modes, custom contracts, grids/minima/non-grid maxima, missing optional valuation and invalid inputs.
- 20 browser/legacy checks passed across converter, swap and existing calculators: interactive units/custom contracts/order limits, missing rates, context transfer, copy/share, no-JS content/default example, metadata/schema/canonical/sitemap, exactly three FAQs, mobile/desktop and prior calculator regressions.
- Production webpack build with TypeScript, ESLint and diff checks passed. Converter390px and widened swap390px screenshots reviewed.
- Supporting article **1,746 words**, 92-word introduction, detailed Quick answer and three FAQs. Source conversion charts, unit/pip/margin examples and contract qualifications preserved. Contextual anchors link actual calculators and verified IG/Frankfurter/CFTC sources.

No broker execution permission or verified profile is implied by compatibility with user-entered limits. Conversion is distinct from margin, risk or a deposit requirement.
