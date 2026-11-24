# Calculator work queue — 24 November 2026

Owner instructions: complete and verify one calculator, push it, then proceed to the next. Use useful, detailed intros and Quick answers. Each completed content page must be pushed. Batch 2 and 3 supporting articles target 1,600–1,800 independently counted words, with 80–120-word intros and exactly three FAQs. Preserve source maths and qualifications; no invented live prices or broker conditions.

The Uganda mobile-money comparison was completed, tested (12 browser checks plus lint, build and readability), pushed as `f55020f`, and verified live before calculator work resumed.

| # | Calculator | Status |
| --- | --- | --- |
| 1 | Forex lot size | Published and verified earlier (`53cf466`) |
| 2 | Forex pip | Published and verified (`6a1b9c6`); supporting article: 1,786 words. |
| 3 | Forex margin | Published and verified (`16b7cb7`); supporting article: 1,770 words. |
| 4 | Forex profit | Published and verified (`4e417af`); supporting article: 1,617 words. Old tool URL redirects permanently. |
| 5 | Forex risk-reward ratio | Published and verified (`2751476`); supporting article: 1,796 words. |
| 6 | Forex break-even price | Published and verified (`871a13f`); supporting article: 1,737 words. |
| 7 | Forex swap | Published and verified (`bbe915b`); supporting article: 1,753 words. |
| 8 | Forex lot size converter | Published and verified (`35ee48b`); supporting article: 1,746 words. |
| 9 | Forex risk of ruin | Published and verified (`704be86`); supporting article: 1,773 words. |
| 10 | Kelly criterion | Published and verified (`2a0dc57`); supporting article: 1,735 words. |
| 11 | Fibonacci | Published and verified (`0dc6fd9`); supporting article: 1,743 words. |
| 12 | Forex pivot points | Pushed as `33c47b3`; later notation/link edits leave 1,757 supporting words. |

Original owner-supplied specifications and editorial drafts are retained in the execution workspace at `/workspace/calculator-briefs/batch-1.md`, `/workspace/calculator-briefs/batch-2.md` and `/workspace/calculator-briefs/batch-3.md`. Public implementation and verification notes are recorded in the calculator audit documents.

Reuse the instrument registry, decimal precision, exchange-rate abstraction, white/black calculator layout and SEO catalog. Do not publish links to unimplemented routes. Publish and verify each calculator on https://www.devinforex.com as its checks pass. Update this file with actual verification, words and commit evidence as work proceeds.

All twelve tools in Batches 1–3 are implemented and checked. The subsequent fact/link review increased the numerical suite to 76 passing groups and corrected an extreme total-loss precision case. See `docs/audits/2026-11-24/calculator-batches-1-to-3.md` and `calculator-link-source-review.md` for the original and follow-up verification.

## Batch 5

Owner-supplied brief: `/workspace/calculator-briefs/batch-5.md`. Complete, verify and push each tool before beginning the next. No Batch 4 implementation is inferred from this brief.

| # | Calculator | Status |
| --- | --- | --- |
| 17 | Forex spread cost | Pushed as `b3e0d89`; 1,759 words, three FAQs, six numerical groups and eighteen browser/regression groups passed. |
| 18 | Forex commission | Pushed as `90a76bd`; 1,683 words, three FAQs, eight commission numerical groups plus six spread regression groups, and nine browser/regression groups passed. |
| 19 | Currency converter | Pushed as `f71a821`; 1,715 words, three FAQs, 36 numerical/service regression groups and eighteen browser/regression groups passed. |
| 20 | Margin call and stop-out | Pushed as `493d7fc`; 1,794 words, three FAQs, full suite of 104 numerical/service groups and 86 browser/crawl regressions passed. All four Batch 5 pages verified live. |

## Batches 6–8 received

Continue in numerical order, pushing each verified calculator independently. Original uploads are retained as `/workspace/calculator-briefs/batch-6.md`, `batch-7.md`, `batch-7-addendum.md` and `batch-8.md`. Read the relevant brief and numerical acceptance tests before each implementation; this table is a resume checklist, not a replacement specification.

| # | Calculator | Intended canonical path | Status |
| --- | --- | --- | --- |
| 21 | Forex take profit | `/calculators/forex-take-profit-calculator` | Pushed as `2bd5be8`; 1,792 words, three FAQs, 17 numerical and 21 browser/regression groups passed. |
| 22 | Forex leverage | `/calculators/forex-leverage-calculator` | Pushed as `0de6449`; 1,617 words, three FAQs, 18 numerical and 14 browser/regression groups passed. |
| 23 | Forex stop loss | `/calculators/forex-stop-loss-calculator` | Pushed as `fe02754`; 1,754 words, three FAQs, 17 numerical and 13 browser/regression groups passed. |
| 24 | Forex drawdown | `/calculators/forex-drawdown-calculator` | Pushed as `dfcd3ad`; 1,799 words, three FAQs, complete 128 numerical/service/privacy and 103 browser/crawl groups passed. |
| 25 | Prop firm drawdown | `/calculators/prop-firm-drawdown-calculator` | Pushed as `36febd6`; 1,711 words, three FAQs; 17 numerical/privacy and eight browser/regression groups passed. |
| 26 | Prop firm consistency | `/calculators/prop-firm-consistency-calculator` | Pushed as `c21e62c`; 1,704 words at implementation, three FAQs; shared prior core upgraded, old URL redirects and leaves sitemap. Verification recorded in the consistency audit. |
| 27 | Trading expectancy | `/calculators/trading-expectancy-calculator` | Queued |
| 28 | Sharpe ratio | `/calculators/sharpe-ratio-calculator` | Queued |
| 29 | Forex Martingale | `/calculators/forex-martingale-calculator` | Queued; distinct sequential and open-grid modes, no recovery guarantees. |

Every guide: 1,600–1,800 independently counted words, 80–120-word introduction, useful Quick answer, exactly three FAQs, contextual internal and external links, real numerical/UI checks, canonical/indexing/sitemap integration, and disclosed model/data limits. Batch 7's addendum requires citations inside the relevant prose (FTMO/Topstep drawdown rules; Topstep/FundedNext consistency rules; BabyPips expectancy; CFA/Lo Sharpe research), verified before using any programme-specific number.

Batch 7 specifically forbids financial histories in share URLs. The shared cost/scenario form now supports `privateFields` and `serializePrivateSettings`; include `privateDataOmitted: "no"` in new tool defaults, omit all private financial fields from copied settings, and require recipient inputs. CSV file handling currently normalizes equity/balance CSV only; implement a format-specific reader before using the file control for trade logs or return series.

## Owner copy-only update

The later 29-entry introduction/Quick answer rewrite supersedes the earlier 80–120-word intro target. Exact replacements were applied to 23 existing matching pages, with the owner-approved removal of unsupported withdrawals from the compounding intro. Six requested dedicated routes are absent: ATR position size, hedge, notional value, expectancy, Sharpe and Martingale. No pages or engines were created by this copy edit. Supporting articles, metadata and links remain unchanged; implementation-time total-word counts above are historical. See `docs/audits/2026-11-24/calculator-intro-rewrites.md` and `tests/fixtures/calculator-intro-rewrites.json`.

The original tools 27–29 task is paused for this copy update. Early tool 27 drafts are preserved outside git in `/workspace/task-drafts/expectancy-paused/`; do not inadvertently publish them as finished. Use the new supplied intro/Quick answer copy when those tools are completed later.
