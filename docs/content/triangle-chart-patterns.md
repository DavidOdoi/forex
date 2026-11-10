# Triangle chart patterns learning page

Route: `/insights/triangle-chart-patterns` on the configured DEVIN FOREX production origin. This follows the existing Insights education structure. A repository search found no existing triangle-pattern article or competing canonical route.

## Implementation

- A dedicated, statically rendered Next.js page, linked from the Insights library. Existing JSON articles and their author/publication records are unchanged.
- Three original annotated SVGs in the opening, with an additional compact three-shape overview on phones, followed by text geometry comparisons, identification guidance, two annotated breakout outcomes and triangle/wedge/rectangle/pennant comparisons.
- An explorer covering all three triangle types and all five scenarios (15 combinations). Manual five-step reveal, hidden next segments before step four, reset on selection changes, and no autoplay or live data.
- A measured-move form using scaled BigInt arithmetic, preserving up to eight decimal places without binary floating-point price arithmetic. Positive prices, measurement order, direction and positive downside references are validated. Results are in quoted price units; no cash P/L, position sizing or asset-wide pip assumptions.
- Five fixed recognition examples: ascending, descending, symmetrical, rising wedge, and insufficient evidence. Answer explanations, previous/next navigation and local reset; no trading score or registration.
- Nine visible FAQs; self-referencing canonical; generated original PNG social image; WebPage, breadcrumb and FAQ structured data. No invented author/reviewer or publication/review dates.
- The same Manrope family throughout; labelled native controls, keyboard focus, SVG titles/descriptions, mobile table labels, dashed/solid line distinctions, reduced-motion handling, and no chart dependencies.

## Evidence and editorial status

The supplied educational brief is the source of the definitions, cautions, formulas and requested distinctions used in this build. **No external reference was successfully consulted.** Fresh HTTPS requests to the following returned environment-proxy CONNECT 403 responses:

- `https://www.investopedia.com/terms/t/triangle.asp`
- `https://www.investopedia.com/terms/s/symmetricaltriangle.asp`
- `https://www.bis.org/statistics/rpfx22_fx.htm`

The page explicitly identifies these as unconsulted editorial leads, not verified supporting citations. Substantive geometry/convention statements link to that status; forex-specific statements link to a separate verification note. No quotation, statistics, historical outcome, backtest or independently checked source date is claimed.

An editor must check the pattern/lookalike definitions, interpretation and measured-move convention against the proposed references, then independently check the feed-specific tick-volume definition, exchange-versus-spot volume distinction, EUR/USD pip convention and execution/stop cautions. Replace status links with actual checked citations and record only real editorial/publication information. Indexing is deliberately disabled and the page is absent from the sitemap until those checks are complete. The Insights library identifies it as an educational draft.

## Data and conventions

Every chart is synthetic and visibly says “Illustrative example—not historical market data.” There is no historical feed, real pair/timeframe/date range, exchange volume or copied chart image. SVG x coordinates increase with synthetic time; higher prices map upward. Turning points consistently define the illustrated boundaries; no candle-close inference is made. The three triangle boundaries remain apart throughout the plotted forming interval and guide extensions. Pennant guide extensions stop before their apex.

The solid dark path is the completed illustration. Upper resistance is solid green, lower support dashed blue; hypothetical additions are dashed gold with square markers. The return-inside scenario ends before the apex with a visible gap to each boundary. A held retest is one constructed outcome; text states retests can fail or never occur. Patterns do not imply breakout direction, probability, an edge or maximum loss.

Measured move: vertical height at the same selected measurement point, projected from a separate chosen breakout reference. Default `1.1000 − 1.0950 = 0.0050`; upward from `1.1020` gives `1.1070`. Mathematically subtracting the height from that same input gives `1.0970`; the separate downward worked example uses a lower reference of `1.0940`, producing `1.0890`. The form explicitly checks arithmetic, not whether a reference is a real boundary break. EUR/USD's conventional `0.0001` pip is explained only in the worked example; no general pip converter or risk/reward calculator is added.

## Optional features omitted

No animation, historical-market example, live feed, trading terminal, probability model, position sizing, cash P/L or risk/reward scoring. All requested pattern/scenario combinations and the recognition exercise are implemented. No external deployment is authorized by this brief.

## Files

- `src/app/insights/triangle-chart-patterns/page.tsx`: statically rendered guide and sources/status notes.
- `src/app/insights/triangle-chart-patterns/triangles.css`: scoped responsive styles, focus and reduced-motion rules.
- `src/app/insights/triangle-chart-patterns/opengraph-image.tsx`: original 1200×630 PNG social card.
- `src/components/education/pattern-diagram.tsx`: shared SVG diagrams and compact mobile comparison.
- `src/components/education/triangle-interactives.tsx`: explorer, measured-move form and recognition exercise.
- `src/lib/education/triangles.ts`: fixed datasets, geometry, scenarios and exact-decimal calculation.
- `src/lib/education/triangle-page.ts`: metadata, nine FAQs and truthful structured data.
- `src/app/insights/page.tsx`: one draft-labelled library entry.
- `tests/triangle-patterns.spec.ts`: eight new geometry, calculation, browser, accessibility and SEO checks.
- This document: evidence limitations, conventions and validation record.

## Actual validation results

- `npm run typecheck`: passed (Next route generation and TypeScript).
- `npm run lint`: passed.
- `npm run build`: passed, including static prerendering and the generated social image.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/triangle-patterns.spec.ts tests/insights.spec.ts tests/crawlability.spec.ts`: **19 passed** in the final run.
- `git diff --check`: passed.

The browser checks cover all 15 explorer combinations and reset/reveal behavior, geometry before the apex, up/down/retest/return-inside paths, coordinate mapping, fixed recognition answers and feedback, exact-decimal calculations and invalid inputs, no-JavaScript HTML, real internal URLs and anchors, canonical/social/schema records, nine FAQs, honest source status, indexing exclusions, keyboard operation, reduced motion and widths 320/390/768/1440px. No document overflow or browser page errors were observed in the final run. Existing Insights and sitemap/crawlability tests passed without weakening their assertions.

Desktop opening, mobile explorer, compact mobile comparison, first-screen mobile and social-card images were visually inspected. A separate browser diagnostic verified unchanged SVG chart dimensions between reveal steps (desktop 437.14px high; phone 252.56px high), an HTTP 200 / 1200×630 PNG social response, and no browser errors. A computed-colour check of 135 chart labels, captions, citations, body and muted-text nodes gave a minimum contrast ratio of 6.25:1 against the page's slightly off-white chart background. This is a targeted check, not a claim of a full third-party accessibility audit.

No deployment or external-service modification was performed for this task. The production URL will not show this page until a separately authorized release.
