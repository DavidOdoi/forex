# Forex risk of ruin calculator — 24 November 2026

Canonical `/calculators/forex-risk-of-ruin-calculator`, indexable, in catalog/related navigation and sitemap. Independent seeded binary outcomes support fixed-currency or percentage-of-current-equity risk, extra currency costs, initial-equity or running-peak drawdown thresholds, path count and trade horizon. Paths stop at their first threshold hit. Equity floors at zero, stakes cap at remaining equity and numerical growth above10^100 rejects. These are disclosed model assumptions, not broker liquidation rules.

A background Web Worker runs the base and two sensitivity scenarios (5 percentage points lower win probability, half risk), using the displayed seed, sample size and horizon. Inputs cancel superseded workers. At most5million path-trade steps per scenario,100–50,000 paths and1–2,000 trades bound work. Deterministic32-bit pseudo-random sampling and standard floating-point arithmetic are stated. Output includes observed hit frequency,95% Wilson sampling interval, stopped-or-horizon balance quantiles, worst observed drawdown and12 example SVG paths. Zero observed hits explicitly does not imply zero true risk. No actual bankruptcy probability is claimed.

## Verification

- 5 pure groups passed: ten2%/5% losses produce USD8,170.73/USD5,987.37; initial30% barrier is USD7,000;12000-to9000 drawdown25%; no-cost100%-win run has no loss hits; identical seeds/settings reproduce all outputs; costs, fixed sizing, intervals, invalid inputs and workload/growth limits.
- 4 browser checks passed: real worker result,100%-win zero-hit caution, input responsiveness/error states, shared seed restoration and invalid-version reset, SSR article/canonical/sitemap/three FAQs, responsive paths and controls at320/390/1440.
- Production webpack build, full TypeScript check, ESLint and diff checks passed.390px screenshot reviewed.
- Supporting copy **1,773 words**,94-word intro, direct Quick answer and three FAQs. Numerical examples preserved and stopping/uncertainty explanations added. NIST binomial confidence reference verified HTTP200; CFTC and internal calculator anchors contextual and relevant.

Limitations remain visible: independent constant outcomes, no loss clustering, changing regimes, intratrade risk, broker rule implementation or unentered execution/financing effects. Wilson intervals describe sampling uncertainty under the simulation model only.
