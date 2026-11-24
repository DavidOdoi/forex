# Stop loss — Batch 6, tool 23

Route: `/calculators/forex-stop-loss-calculator`. Article: 1,754 independently counted words, a 103-word introduction and exactly three FAQs. The shared page, instrument registry, scenario UI, price visualization, conversion and profit engines are reused.

Modes cover pip distance, explicit protective price, chosen cash allowance, percentage of positive entered equity and manually entered ATR in price or pip units. Cash/percentage plans distinguish gross price risk from loss including separately entered net costs. Costs that exhaust a net allowance reject rather than creating a negative or zero adverse distance. Wrong-side stops, zero distance/volume and incompatible price grids reject. Buy stops round upward and sell stops downward toward entry, keeping the modeled distance/risk ceiling; the shortened distance and theoretical stop remain visible.

The net-loss figure is signed so assumed financing credits cannot be disguised as guaranteed risk reduction. Spread is already embedded in executable entry/stop-side prices. Currency quotations are frozen scenario assumptions. The mandatory USD/JPY example uses the explicitly entered 159.60 JPY/USD closing-conversion assumption and produces approximately USD 250.6265664 on JPY 40,000 nominal price loss.

Limits: no live ATR calculation, trailing-stop simulation, verified minimum-distance feed, broker acceptance guarantee or guaranteed-stop product is provided. A standard stop can fill beyond the planned price. Position sizing remains a separate linked tool rather than a silently changed volume.

Sources: official MetaTrader ATR documentation was fetched and read; it describes volatility, true range and ATR's average of true-range values. Contextual citations also use the verified MetaTrader bid/ask execution and MetaQuotes symbol-specification documentation. Six internal anchors connect relevant existing tools; no unimplemented ATR-position-size route was invented from the source brief.

Verification: seventeen numerical regression groups passed across stop loss, take profit and profit, including all mandatory stop examples, ATR unit agreement, gross/net budgets, closing conversion and conservative grid rounding. Thirteen browser/regression groups passed across stop loss, take profit, leverage and contextual links. Verified mode changes, invalid sides, ATR/JPY inputs, price levels, share restoration, 320/390/1440px widths, SSR defaults, canonical/sitemap and three FAQs. Production webpack build with TypeScript, ESLint and whitespace checks passed.
