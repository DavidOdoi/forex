# Exness review: on-page implementation audit

The production article route is `/reviews/exness`. `/reviews/template` and `/templates/exness-review.html` are explicitly labelled demonstrations. The source-based article remains a draft. This report maps the user-supplied audit to the implementation; it is not a Google score or a ranking prediction.

## Implemented

- One descriptive, server-rendered H1; accurate metadata; centralized absolute canonical origin.
- A three-sentence source-based verdict, five sourced pros and five cautions, and five gold account actions retained as requested.
- Account table with per-side and round-trip commission, first-deposit conditions, and documented MT4/MT5 compatibility.
- A hypothetical EUR/USD cost example: one standard lot, USD account, US$10/pip, constant 0.3-pip spread and US$3.50 commission per side. US$3 spread + US$7 commission = US$10/1.0 pip. Inputs are illustrative, not measured Exness quotes. Slippage, financing, conversion and price movements are excluded.
- Official inactivity/reactivation fee information, conditional swap-free treatment and separate payment-provider charges.
- Separate withdrawal request, broker-processing and receiving-provider stages; region/method limits remain explicit.
- Exact entity distinctions. Seychelles regulator identity/type confirmation is separately labelled; SD025 remains provider-reported because the regulator page did not show that number. UK/Cyprus non-retail restrictions remain visible.
- Platform/market coverage follows sourced findings. Two existing competitor entity profiles are linked as legal-entity research, without price rankings or inferred eligibility.
- David Odoi's user-supplied name, a truthful author/process profile, stable substantive-update date, and separate source-check dates. No qualifications, reviewer, approval or publication date were invented.
- Relevant section destinations for calculators, research methodology, corrections and navigation. No empty guide/comparison pages were created.
- Publication checks require core sourced evidence, author biography/profile, responsible editorial approval and consistent publication/update dates. A status flag alone cannot enable indexing.
- Draft/demo noindex preserved. Robots allows crawling so noindex can be read. The review sitemap helper includes only approved canonical articles; site configuration still controls production indexing. Templates, data downloads and author profile stay outside the sitemap.
- Breadcrumb and sourced visible FAQ schema retained. Article schema requires a complete publication record and uses the same headline, author and dates as the visible record. Automatic broker Product/Review-star markup was removed.
- White background, black text, 16px minimum review text, responsive tables, keyboard focus and contents navigation retained. No new client dependencies or stock research images.

## Remaining publication blockers and limits

- David Odoi has not supplied a professional biography or relevant experience. The profile identifies his designated role and the actual research workflow.
- No actual reviewer or recorded editorial approval has been supplied. Publication date remains unset; the November 4 substantive update is stored explicitly rather than generated on builds.
- A public contact channel needs confirmation. The old unconfirmed email address was removed.
- Complete independent licence-number checks and entity-specific protection/eligibility checks remain outstanding. The FCA page returned a client-rendered shell; the CySEC page could not be collected. No access restrictions were bypassed.
- No live-account, platform-execution, spread or withdrawal tests were performed. Trustpilot collection remains blocked; no score/count/sentiment was assigned.
- Core Web Vitals and ranking outcomes have not been measured. Software tests check implementation, not the truth of every provider claim.

The linked [source ledger](research/exness-source-checks-2026-11-04.json) records retrieval dates, hashes and acquisition limitations. Read the original documents and complete the editorial checks before approving publication.

## Verification

Type checking, ESLint and the webpack production build passed. All 35 browser checks passed with the confirmed production origin configured. The word-budget check covered 318 broker/scope pages, including collapsed content and shared navigation; the longest was the template at 1,797 words. Desktop and mobile screenshots were inspected. These are implementation checks, not measured factual accuracy or field Core Web Vitals.
