import type { CalculatorDefinition } from "./catalog";
export const ruinDefinition: CalculatorDefinition = {
  "slug": "forex-risk-of-ruin-calculator",
  "path": "/calculators/forex-risk-of-ruin-calculator",
  "kind": "ruin",
  "keyword": "forex risk of ruin calculator",
  "title": "Forex Risk of Ruin Calculator – Drawdown Probability",
  "heading": "Forex Risk of Ruin Calculator",
  "description": "Forex risk of ruin calculator: simulate loss and drawdown thresholds with a seed, trade horizon, sizing assumptions and transparent model uncertainty.",
  "card": "Explore seeded threshold-hit simulations, drawdowns and sizing sensitivity.",
  "intro": "A forex risk of ruin calculator estimates how likely a trading strategy is to reach a specified loss or drawdown threshold under a set of assumptions. It combines the strategy's estimated win rate, average winning and losing outcomes, position risk, and number of trades to illustrate possible account outcomes. For example, a strategy with a 45% win rate and average winning trades twice as large as losing trades has positive theoretical expectancy. Yet it may still experience losing streaks and meaningful drawdowns. Use the calculator to examine those risks before increasing your trading exposure.",
  "quickAnswer": "Define the threshold first, then divide simulated paths hitting it by total paths. If 200 of 10,000 paths hit the limit, the observed frequency is 2% under those inputs. It is not a known 2% chance of actual bankruptcy. Starting at USD 10,000, a 30% initial-equity loss means USD 7,000; a 30% running-peak drawdown uses a moving barrier instead. Results depend on the trade horizon, risk rule, assumed win probability, payoff and costs. This tool shows the seed, sample count and model sampling interval so the estimate can be inspected and reproduced.",
  "steps": [
    "Enter starting equity, assumed win probability and average winning payoff relative to a loss. Use representative net outcomes, or add a separate per-trade cost once.",
    "Choose fixed-currency or percentage-of-current-equity risk. Define the threshold as loss from starting equity or drawdown from each path’s running peak.",
    "Set the horizon, path count and seed within the calculation limits. Identical settings reproduce the run; input changes cancel the previous background worker.",
    "Read observed frequency alongside the sampling interval, stopped-path balance distribution, example paths and sensitivity rows. Recheck assumptions before using the model for any risk decision."
  ],
  "sections": [
    {
      "id": "what-does-risk-of-ruin-mean-in-forex",
      "title": "What Does Risk of Ruin Mean in Forex?",
      "paragraphs": [
        [
          {
            "text": "“Ruin” is a selected account threshold, not necessarily bankruptcy. It might mean losing 30% of starting equity or breaching a funded-account loss limit. The probability changes with that definition, sizing rules and trade horizon. A threshold hit in this model is not confirmation of an actual broker or prop-firm breach."
          }
        ],
        [
          {
            "text": "At 25% initial-equity loss, a USD 10,000 account hits the barrier at USD 7,500 or less. With 30% loss, it is USD 7,000. Initial-equity and peak-based barriers answer different questions; check which you selected before interpreting the headline frequency."
          }
        ]
      ]
    },
    {
      "id": "why-risk-of-ruin-matters",
      "title": "Why Risk of Ruin Matters",
      "paragraphs": [
        [
          {
            "text": "At 45% wins and a 2:1 payoff, "
          },
          {
            "text": "theoretical expectancy",
            "href": "/calculators/kelly-criterion-calculator"
          },
          {
            "text": " is 0.45 ×2 −0.55 ×1 =+0.35 loss units per trade before extra costs. That positive average does not produce a smooth account path. Losing sequences can cross a threshold before a long-run average has an opportunity to emerge."
          }
        ],
        [
          {
            "text": "Position sizing",
            "href": "https://www.cmegroup.com/education/courses/trade-and-risk-management"
          },
          {
            "text": " changes how damaging a sequence becomes. An apparently profitable payoff structure can still conflict with a loss limit, especially when risk per trade is high. The simulation illustrates this distinction without forecasting a particular sequence."
          }
        ]
      ]
    },
    {
      "id": "how-monte-carlo-simulation-works",
      "title": "Forex risk of ruin calculator: the simulation model",
      "paragraphs": [
        [
          {
            "text": "Each trade is a "
          },
          {
            "text": "binary win or loss",
            "href": "https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm"
          },
          {
            "text": " with a constant entered probability and payoff. Repeating independently sampled sequences produces an empirical threshold-hit frequency. A seeded 32-bit pseudo-random generator makes identical inputs reproducible; it is a modeling tool, not a source of market outcomes."
          }
        ],
        [
          {
            "text": "The result shows hits, paths, horizon, seed and a 95% Wilson sampling interval. More paths reduce sampling variation under the model; they do not correct inaccurate strategy assumptions. At zero observed hits the interval still has a positive upper bound. This interval is not a 95% guarantee about a real account."
          }
        ],
        [
          {
            "text": "Each scenario allows 100–50,000 paths and 1–2,000 trades, with at most five million path-trade steps. A background Web Worker keeps calculations off the interface thread. The base model and two sensitivity runs use the same seed and sample size. Numerical overflow and underflow are rejected."
          }
        ]
      ]
    },
    {
      "id": "understanding-the-risk-of-ruin-formula",
      "title": "Understanding the Risk-of-Ruin Formula",
      "paragraphs": [
        [
          {
            "text": "Observed frequency =100 × threshold-hit paths ÷ all simulated paths. For initial-equity loss, the barrier is starting equity ×(1 − loss percentage/100). At USD 10,000 and 30%, it is USD 7,000. A path at or below that barrier counts as a hit and stops."
          }
        ],
        [
          {
            "text": "Peak-based drawdown uses the highest equity reached on that path. Growing from USD 10,000 to USD 12,000, then falling to USD 9,000, is 25% drawdown from peak but only 10% loss from the start. Those definitions can produce different observed frequencies for the same sequence."
          }
        ]
      ]
    },
    {
      "id": "fixed-dollar-risk-vs-percentage-risk",
      "title": "Fixed-Dollar Risk vs Percentage Risk",
      "paragraphs": [
        [
          {
            "text": "Fixed-currency sizing risks the same monetary stake until remaining equity is smaller; the model then caps it at that equity. A USD 100 stake becomes a larger share of the account after losses. Percentage sizing recalculates stake after each trade:1% of USD 10,000 is USD 100, while 1% of USD 8,000 is USD 80."
          }
        ],
        [
          {
            "text": "Both are simplified sizing rules, not broker execution models. Equity is floored at zero, and intratrade drawdowns or liquidation are not simulated. Real leveraged losses and account rules may behave differently. The engine uses floating-point arithmetic and rejects equity above 10^100 rather than reporting Infinity."
          }
        ]
      ]
    },
    {
      "id": "example-how-a-losing-streak-affects-an-account",
      "title": "Example: How a Losing Streak Affects an Account",
      "paragraphs": [
        [
          {
            "text": "Consider a $10,000 trading account risking 2% of current equity per trade."
          }
        ],
        [
          {
            "text": "Suppose the account experiences ten consecutive losing trades, each losing exactly the planned 2%."
          }
        ],
        [
          {
            "text": "Under fixed-percentage sizing:"
          }
        ],
        [
          {
            "text": "Remaining equity = $10,000 × 0.98¹⁰"
          }
        ],
        [
          {
            "text": "The result is approximately $8,170.73."
          }
        ],
        [
          {
            "text": "The cumulative loss is about 18.29%, not exactly 20%, because the amount risked decreases as equity falls."
          }
        ],
        [
          {
            "text": "Now imagine risking 5% of current equity on each trade."
          }
        ],
        [
          {
            "text": "After ten consecutive losses:"
          }
        ],
        [
          {
            "text": "Remaining equity = $10,000 × 0.95¹⁰"
          }
        ],
        [
          {
            "text": "The account would have approximately $5,987.37 remaining."
          }
        ],
        [
          {
            "text": "That is a loss of about 40.13%."
          }
        ],
        [
          {
            "text": "This example demonstrates how risk per trade influences losing-streak damage."
          }
        ],
        [
          {
            "text": "It does not tell us the probability of ten consecutive losses. That probability depends on assumptions about the strategy, trade independence, and other factors."
          }
        ]
      ],
      "table": {
        "headers": [
          "Ten consecutive losses",
          "Remaining equity",
          "Cumulative loss"
        ],
        "rows": [
          [
            "2% of current equity",
            "USD8,170.73",
            "18.29%"
          ],
          [
            "5% of current equity",
            "USD5,987.37",
            "40.13%"
          ]
        ]
      }
    },
    {
      "id": "what-is-a-good-risk-of-ruin-percentage",
      "title": "What Is a Good Risk of Ruin Percentage?",
      "paragraphs": [
        [
          {
            "text": "There is no universally acceptable percentage. A major drawdown can be personally unacceptable or end an evaluation even while the account remains positive. Select a threshold and horizon relevant to the question, then compare plausible assumptions. A low observed frequency under optimistic inputs does not establish safety."
          }
        ]
      ]
    },
    {
      "id": "why-win-rate-alone-is-not-enough",
      "title": "Why Win Rate Alone Is Not Enough",
      "paragraphs": [
        [
          {
            "text": "A high win rate can hide an unprofitable payoff structure."
          }
        ],
        [
          {
            "text": "Suppose a strategy wins 70% of its trades but earns an average of $50 on winners while losing $150 on losers."
          }
        ],
        [
          {
            "text": "The expected result per trade is:"
          }
        ],
        [
          {
            "text": "0.70 × $50 − 0.30 × $150 = −$10."
          }
        ],
        [
          {
            "text": "Despite winning seven out of ten trades on average, the strategy has negative theoretical expectancy."
          }
        ],
        [
          {
            "text": "Now consider a strategy winning 40% of its trades, earning $250 on average winners, and losing $100 on average losers."
          }
        ],
        [
          {
            "text": "Its expectancy is:"
          }
        ],
        [
          {
            "text": "0.40 × $250 − 0.60 × $100 = +$40."
          }
        ],
        [
          {
            "text": "The second strategy has a lower win rate but a stronger modeled payoff."
          }
        ],
        [
          {
            "text": "This is why risk-of-ruin calculations should consider both the frequency and magnitude of wins and losses."
          }
        ],
        [
          {
            "text": "For a single proposed setup, compare the net outcomes in the risk–reward calculator."
          }
        ]
      ]
    },
    {
      "id": "how-trading-costs-affect-risk-of-ruin",
      "title": "How Trading Costs Affect Risk of Ruin",
      "paragraphs": [
        [
          {
            "text": "Costs can turn a small positive edge into zero or negative expectancy. Enter net average payoffs where possible and leave extra cost at zero if those payoffs already include charges. Otherwise, the additional currency cost is deducted once per simulated trade, after its win or loss."
          }
        ],
        [
          {
            "text": "This model does not separately simulate changing spreads, "
          },
          {
            "text": "financing schedules",
            "href": "/calculators/forex-swap-calculator"
          },
          {
            "text": ", partial fills or gaps. Unentered adverse execution is absent from the outcomes. Use the trade-level profit and swap tools to inspect those assumptions rather than interpreting the binary model as a complete account forecast."
          }
        ]
      ]
    },
    {
      "id": "the-problem-with-assuming-independent-trades",
      "title": "The Problem With Assuming Independent Trades",
      "paragraphs": [
        [
          {
            "text": "Independent identical trades are a strong assumption. Results may cluster around the same market movement or announcement, and a strategy’s edge can change across trending and ranging conditions. Fixed probabilities and payoffs can understate clustered losses or changing regimes."
          }
        ],
        [
          {
            "text": "Trade-history resampling and block bootstrap models would answer different questions, but neither is implemented here. Do not treat these simulated paths as sampled historical trades. The inputs are assumptions you provide, not a verified performance record."
          }
        ]
      ]
    },
    {
      "id": "common-risk-of-ruin-calculation-mistakes",
      "title": "Common Risk of Ruin Calculation Mistakes",
      "paragraphs": [
        [
          {
            "text": "Do not call the result a known chance of actual bankruptcy. Avoid small or unrepresentative win-rate samples, ignored costs, optimistic payoffs and confusion between initial loss and peak drawdown. A low frequency does not justify increasing exposure automatically."
          }
        ],
        [
          {
            "text": "Review adverse outcomes as well as the median. Paths stop at their first threshold hit; the displayed balance distribution therefore describes threshold-stop or horizon balances, not unrestricted final balances. The 12 plotted paths are examples from the simulation, not the whole sample."
          }
        ]
      ]
    },
    {
      "id": "when-should-you-use-this-calculator",
      "title": "When Should You Use This Calculator?",
      "paragraphs": [
        [
          {
            "text": "Use the model when reviewing sizing rules, comparing possible losing-streak damage or testing sensitivity to weaker performance. It does not replace a representative trading record, account-specific rule checks or a risk-management process. The two sensitivity rows reduce win probability by five percentage points or halve risk while retaining the displayed path count, horizon and seed."
          }
        ],
        [
          {
            "text": "For the sampling-interval method, see "
          },
          {
            "text": "NIST’s confidence limits for a binomial proportion",
            "href": "https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm"
          },
          {
            "text": ". For trading and provider limitations, read the "
          },
          {
            "text": "CFTC’s forex risk guidance",
            "href": "https://www.cftc.gov/LearnAndProtect/forexfrauds"
          },
          {
            "text": ". Neither source validates the strategy inputs entered here."
          }
        ]
      ]
    },
    {
      "id": "final-thoughts",
      "title": "Final Thoughts",
      "paragraphs": [
        [
          {
            "text": "The forex risk of ruin calculator helps you explore how trading performance and position sizing can affect the possibility of severe account losses."
          }
        ],
        [
          {
            "text": "Use it to compare realistic scenarios, identify assumptions that matter, and understand the possible consequences of losing streaks."
          }
        ],
        [
          {
            "text": "Remember that simulation is a model of uncertainty, not a guarantee about the future."
          }
        ],
        [
          {
            "text": "Inspect individual outcome assumptions with the "
          },
          {
            "text": "forex risk–reward calculator",
            "href": "/calculators/forex-risk-reward-calculator"
          },
          {
            "text": " and "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": ". Translate a chosen loss budget into a position using the "
          },
          {
            "text": "forex lot-size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": "; the simulation does not generate an order."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "Can a profitable forex strategy still have a risk of ruin?",
      "answer": "Yes. Positive expectancy does not prevent losing streaks or severe drawdowns. Position sizing and the chosen ruin threshold affect the modeled probability."
    },
    {
      "question": "Does reducing risk per trade lower risk of ruin?",
      "answer": "Under many fixed-assumption models, reducing the fraction of equity risked per trade reduces the chance of reaching a specified drawdown threshold over a fixed horizon. Actual outcomes can still differ."
    },
    {
      "question": "Is a 0% simulated risk of ruin completely safe?",
      "answer": "No. It means no simulated path reached the threshold in that run. It does not prove that the true probability is zero, particularly when the model or sample size is limited."
    }
  ]
};
