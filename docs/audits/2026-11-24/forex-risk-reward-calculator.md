# Forex risk–reward calculator — 24 November 2026

Canonical `/calculators/forex-risk-reward-calculator`, included in catalog, related tools and sitemap. White/black shared layout, accessible fields and result text, optional assumed probability, two additional independent full-position targets, copy/share/reset and currency conversions reuse the preceding calculators.

## Mathematics

Buy risk = entry − stop and reward = target − entry; sell reverses both. Wrong-side or equal levels reject. Gross multiple = reward/risk. Net target and stop results use the profit engine with one extra account-currency round-trip charge. Net R = net win/loss magnitude; break-even percentage = loss/(win + loss). If costs eliminate positive reward, no feasible positive ratio or conventional break-even probability is displayed. Expectancy = assumed probability × net win − (1 − probability) × loss magnitude, explicitly an assumption and not inferred from price levels.

## Verification

- 11 pure checks passed across risk/reward and profit, including 20/40-pip 1:2, one-third break-even, USD 390/210 after USD 10 costs, 35% break-even, USD 30 expectancy at 40%, sells, alternative targets, JPY conversions, missing/invalid inputs and no-positive-target cases.
- 8 browser checks passed across risk/reward and profit: SSR/default result, canonical/sitemap, exactly three FAQs, cost/probability/alternative target controls, invalid levels, scenario restoration and mobile widths 320/390/1440.
- Production webpack build with TypeScript, ESLint and diff checks passed. Risk/reward 390px and profit 1440px screenshots visually reviewed.
- Supporting content **1,796 words**, 83-word introduction, direct Quick answer, three FAQs. The supplied editorial draft was condensed without dropping numerical examples. Added explicit expectancy explanation and contextual links to built calculators, CFTC, MoneySmart and IG’s pip reference.

No win rate, execution result, live quote or broker profile is invented. Fixed outcome/cost assumptions, full-position target comparisons and stop slippage risk are visible beside results.
