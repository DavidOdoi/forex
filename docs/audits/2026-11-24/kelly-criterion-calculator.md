# Kelly criterion calculator —24November2026

Canonical `/calculators/kelly-criterion-calculator`, indexable with catalog/related navigation, canonical, sitemap and existing WebApplication/Breadcrumb/visible FAQ schema. Shared analysis workspace supports direct percentages or historical win/total counts, a net payoff ratio or average net amounts, selected fractional Kelly and optional reference capital. It never calculates forex lots automatically.

Raw Kelly f=p−(1−p)/b is distinct from max(0,f). Full, half, quarter and selected fractions show theoretical stake percentages, expected log growth and optionally monetary equivalents. A ten-specified-loss table and probability±5percentage-point sensitivity expose model dependence. Expected log growth uses p×ln(1+b×f)+(1−p)×ln(1−f); the total-loss endpoint is omitted when losses are possible. A100%-win input receives a major caution. Negative Kelly is explicitly not a sell signal. Variable outcomes, correlated trades, gaps and estimation uncertainty are disclosed.

## Verification

-6pure groups passed, covering all mandatory Kelly examples, negative/zero edge, fractional separation,100%-win boundary, invalid ratios/probabilities, count/average modes, monetary expectancy, and expected log growth against an independently computed60-digit decimal reference (0.029242525646551299… at p=.45,b=2,f=.175).
-3browser checks passed: raw/fractional results, no-bet and100% warnings, validation, historical counts/average amounts, share restoration, no-JS content/default result, metadata/canonical/sitemap/three FAQs and320/390/1440 layouts.
-Production webpack build, full TypeScript check, ESLint and diff checks passed.390px screenshot reviewed.
-Supporting copy **1,735words**,112-word intro, detailed Quick answer and exactly three FAQs. Source numerical examples retained and redundant explanations condensed. Kelly’s original1956 paper link at Princeton verified HTTP200; NIST binomial sampling and CFTC forex guidance contextual. Internal links connect built risk-of-ruin, profit and lot-size tools.

No claim that an estimated probability is known, that a particular fraction is safe, or that the graph predicts actual account returns is made.
