# Forex market hours

Route: `/tools/forex-market-hours` (the site's standard URL style omits a trailing slash).

The server-rendered page provides the methodology, session-local reference table, breadcrumbs and metadata. A client component enhances it with a shared live clock, a timezone selector, session cards, a future-date planner and an elapsed-time timeline. The route is linked from the tools hub, header and footer, and follows the site's preview-indexing guard and configured production origin. Query parameters are deliberately ignored and canonicalize to the main route; share links are not implemented.

## Schedule contract

`src/lib/market-hours/config.ts` is the single schedule configuration. These are **provisional editorial conventions requiring approval**, not verified broker or exchange hours:

| Session | IANA timezone | Local opening days | Local window |
| --- | --- | --- | --- |
| Sydney | Australia/Sydney | Monday–Friday | 08:00–17:00 |
| Tokyo | Asia/Tokyo | Monday–Friday | 09:00–18:00 |
| London | Europe/London | Monday–Friday | 08:00–17:00 |
| New York | America/New_York | Monday–Friday | 08:00–17:00 |

The independent weekly convention runs Sunday 17:00 through Friday 17:00 America/New_York. Both sessions and the weekly market use `[start, end)` intervals. Session weekdays refer to the session-local opening date. A closing wall time earlier than or equal to the opening wall time falls on the next local day. Every occurrence is intersected with a weekly-market interval; for example, the early part of Sydney's January Monday window is clipped until Sunday 17:00 New York.

The planner's date means **all intervals intersecting that calendar day in the selected timezone**. It returns full occurrences; the timeline clips their visual segments to the day. Availability starts on the selected date. An end before the start crosses to the next local date and matching searches both dates. Equal times are rejected, not silently interpreted as 24 hours. Invalid dates and timezone preferences are rejected or fall back safely.

`src/lib/market-hours/time.ts` supplies all interval calculations. `@js-temporal/polyfill` 0.5.1 was added because no suitable date library existed, and local calendar arithmetic, timezone transitions, ambiguous wall times and skipped dates need explicit handling. The library uses the runtime's IANA timezone data. There is no charting library or remote runtime dependency. Availability uses Temporal's `compatible` rule: earlier instant in a repeated hour; move forward by the gap for a nonexistent wall time. The UI discloses this and displays resolved endpoints. Non-positive resolved availability is rejected.

The timeline spans the actual day, including 23/25-hour days, with date-specific UTC offsets. Clock changes at midnight and fully skipped dates use start-of-day boundaries. The supported planner input range is 1900–2099. Historical schedules are illustrative applications of the configured conventions, not claims of historical broker availability. Future calculations depend on the timezone rules installed in the visitor's runtime.

One external clock store drives subscribers. Only live cards, the timezone-offset label and current-time marker rerender each second. The page's date selector subscribes to a date-only snapshot, keeping its reference date current at midnight without rerendering the planner each second. The clock pauses its timer when hidden, recalculates on visibility/pageshow, and removes timers/listeners when its last subscriber unmounts. Server snapshots are null so pre-rendered output never claims a cached live status. Countdown regions do not announce every tick.

## Source-check record

On 10 November 2026, HTTPS retrieval was attempted for:

- https://www.babypips.com/learn/forex/forex-trading-sessions
- https://www.oanda.com/us-en/trading/hours-of-operation/

Both attempts failed at the environment proxy with `CONNECT tunnel failed, response 403`; no source content was retrieved or consulted. They are listed on the page only as **suggested, unverified references**, not citations proving the configured hours. Editorial approval remains outstanding for all four local schedules and the weekly boundary. A broker-specific source cannot establish a universal market cutoff. No review date or verified-author status is invented.

## Validation

From `/workspace/forex`:

```sh
npm ci
npm run typecheck
npm run lint
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/market-hours-time.spec.ts tests/market-hours.spec.ts tests/foundation.spec.ts tests/navigation.spec.ts tests/calculators.spec.ts --reporter=line
```

The pure calculation tests use injected instants. Browser tests use Playwright's controlled clock and cover server HTML, hydration, timezone persistence, invalid input/storage, ignored query parameters, overnight availability, DST warnings, short/long timeline days, weekly boundaries, background resume, timer cleanup, keyboard controls, responsive overflow and site integration. They capture screenshots under ignored `test-results/market-hours-*.png`. Playwright starts the production server on port 3100; build first and do not run a dev server against the same `.next` directory concurrently.

No live prices, trading-volume data, measured liquidity, holiday calendar or broker-status feed is part of this feature. Calendar export and shareable/saved planner scenarios were not added; only the timezone preference is saved. Reporting follows the existing corrections page, whose contact channel remains unconfirmed. No deployment or external-service modification is performed.

Validation on 10 November 2026: type checks, ESLint, production build and `git diff --check` passed. The command above executed **53 passing tests, zero failures**, including 23 pure calculation tests, seven feature browser tests and 23 existing foundation/navigation/calculator checks. Screenshots were captured at 320, 390, 768 and 1440 pixels; the 390-pixel capture was visually inspected. There were no page-overflow or browser-console failures in the responsive check. Editorial verification remains unresolved as described above; these software checks do not approve the session conventions.

## Changed files

- `src/app/tools/forex-market-hours/page.tsx`: server page, content, metadata and structured data.
- `src/lib/market-hours/config.ts`, `src/lib/market-hours/time.ts`: shared conventions and pure calculations.
- `src/components/market-hours/market-hours.tsx`, `clock.ts`, `market-hours.module.css`: interactive UI, shared clock and scoped styles.
- `src/app/tools/page.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/lib/site.ts`: discovery links and sitemap membership.
- `package.json`, `package-lock.json`: pinned Temporal dependency and integrity-checked lock entries.
- `tests/market-hours-time.spec.ts`, `tests/market-hours.spec.ts`: deterministic calculation and browser checks.
- `docs/forex-market-hours.md`: implementation contract, source-check status and validation record.

## Reference UI update

The supplied visual reference is implemented with a pale-green market-week summary beside the timezone panel, four separate countdown tiles, panoramic city banners, green borders and badges for active sessions, compact session-window rows, a current-local-time display and a linked three-step usage strip. On small screens the panels stack and the session cards form two columns. Searchable IANA selection, reset/persistence, future-date planning, accessibility, shared clock cleanup and all existing calculation conventions are retained. The summary labels its countdown as the **market-week** boundary, rather than incorrectly describing it as an individual session closing. Open-session counts come from the shared calculations, with no live-liquidity claim.

`public/images/market-hours/city-sessions.png` is an original AI-generated decorative four-band city atlas, ordered Sydney, Tokyo, London and New York. It is not a verified documentary photograph. `next/image` delivers an optimized, locally served variant reused by all four cards; fixed aspect ratios reserve banner space. The images are decorative and do not repeat the visible session names to screen readers.

The UI update passed type checks, lint and production build, plus **41 calculation, feature-browser, foundation and navigation tests**. The feature browser checks include panel placement, image loading, active-card states, countdown tiles, local-time display and guide-link navigation. Responsive screenshots at 320, 390, 768 and 1440 pixels showed no page overflow or console errors; desktop and mobile captures were visually inspected.
