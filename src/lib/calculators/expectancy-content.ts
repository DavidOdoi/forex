import type { CalculatorDefinition } from "./catalog";
export const expectancyDefinition: CalculatorDefinition = {
  "slug": "trading-expectancy-calculator",
  "path": "/calculators/trading-expectancy-calculator",
  "kind": "expectancy",
  "keyword": "trading expectancy calculator",
  "title": "Trading Expectancy Calculator – Win Rate, Costs & R",
  "heading": "Trading Expectancy Calculator",
  "description": "Trading expectancy calculator: compare wins, losses, zero results, costs, profit factor and mean R. Analyse local trade CSVs without sharing private histories.",
  "card": "Compare assumed or observed net trade means, profit factor and genuine individual R multiples.",
  "intro": "A high win rate doesn't necessarily mean a trading strategy is profitable. Look at how often trades win and how much the average winner earns compared with the average loser. Use summary statistics or your trading history to calculate the average net result per trade.",
  "quickAnswer": "For a two-outcome strategy, Expectancy = Win rate × Average win − Loss rate × Average loss. With a 40% win rate, $300 average win, and $100 average loss, expectancy is +$60 per trade before any additional costs. Breakeven trades require their own probability rather than being counted as losses.",
  "steps": [
    "Choose summary assumptions or ordered completed-trade history and declare gross versus net outcomes.",
    "Enter probabilities and averages, or map your CSV columns before a local file import.",
    "Include zero results and any costs not already counted. Supply common or individual initial risk only when known.",
    "Select a history window if needed; review sample size, net mean, profit factor and the separate R calculation."
  ],
  "sections": [
    {
      "id": "what-is-trading-expectancy",
      "title": "What is trading expectancy?",
      "paragraphs": [
        [
          {
            "text": "Expectancy is the average outcome represented by a trading process or dataset. It combines outcome frequency with payoff size. A positive value describes a favourable modelled or historical mean; a negative value describes an unfavourable one. Neither predicts the next trade."
          }
        ],
        [
          {
            "text": "BabyPips’ explanation of trading expectancy",
            "href": "https://www.babypips.com/forexpedia/expectancy"
          },
          {
            "text": " sets out this relationship. A high win percentage can conceal occasional large losses, while a lower win percentage can coexist with sufficiently large average winners. Costs and the reliability of the observations remain essential."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-trading-expectancy-calculator",
      "title": "How to use the trading expectancy calculator",
      "paragraphs": [
        [
          {
            "text": "Choose summary assumptions or completed-trade history, then declare whether outcomes are gross or already net. Summary mode accepts winning and zero-result percentages, positive average win/loss magnitudes and any missing uniform cost. The remaining probability is the losing share."
          }
        ],
        [
          {
            "text": "History mode averages the selected net results directly. It supports local CSV files, optional individual initial risks and all/recent/date windows. Keep all monetary amounts in one declared currency. Mixing currencies without conversion makes the averages meaningless."
          }
        ]
      ]
    },
    {
      "id": "the-binary-expectancy-formula",
      "title": "The binary expectancy formula",
      "paragraphs": [
        [
          {
            "text": "For two outcomes, let p be win probability, A the average winning amount and L the positive average loss magnitude. Then E = pA − (1 − p)L. At 45% wins, A = USD 200 and L = USD 100, expectancy is USD 90 − USD 55 = USD 35 before additional costs."
          }
        ],
        [
          {
            "text": "Multiplying that mean by 100 gives USD 3,500 under constant assumptions. It is an expected aggregate, not a promised result or confidence interval."
          }
        ]
      ],
      "formula": "E = pWin × Average win − pLoss × Average loss; include zero-result probability separately."
    },
    {
      "id": "a-lower-win-rate-can-still-give-a-positive-mean",
      "title": "A lower win rate can still give a positive mean",
      "paragraphs": [
        [
          {
            "text": "At 35% wins, USD 300 average winners and USD 100 average losers, winning contribution is USD 105 and losing contribution USD 65. The difference is USD 40 per trade before extra charges. Losing more often than winning does not by itself establish a negative expectancy."
          }
        ],
        [
          {
            "text": "The averages must still represent the strategy. One unusual winner or omitted expense can materially change this conclusion, especially in a small sample."
          }
        ]
      ],
      "table": {
        "headers": [
          "Win share",
          "Average win",
          "Average loss",
          "Mean before extra costs"
        ],
        "rows": [
          [
            "35%",
            "USD 300",
            "USD 100",
            "USD 40"
          ],
          [
            "40%",
            "USD 300",
            "USD 100",
            "USD 60"
          ],
          [
            "70%",
            "USD 100",
            "USD 250",
            "USD −5"
          ]
        ]
      }
    },
    {
      "id": "a-high-win-rate-can-still-lose-money",
      "title": "A high win rate can still lose money",
      "paragraphs": [
        [
          {
            "text": "Winning 70% of trades at USD 100 and losing 30% at USD 250 gives USD 70 − USD 75 = USD −5 per trade. The large average loser outweighs the frequent smaller wins. Additional costs reduce that result further."
          }
        ],
        [
          {
            "text": "Review actual realised losses rather than substituting the intended stop size. A strategy can have a high observed win rate while gaps, slippage or infrequent outliers materially alter its average loss."
          }
        ]
      ]
    },
    {
      "id": "expectancy-in-genuine-r-multiples",
      "title": "Expectancy in genuine R multiples",
      "paragraphs": [
        [
          {
            "text": "An R multiple divides a trade’s outcome by its own defined initial risk. A USD 100 result on USD 50 initial risk is +2R; a USD −50 result on USD 100 initial risk is −0.5R. Their average is +0.75R, while their USD 25 monetary mean divided by the USD 50 average loss is only 0.5."
          }
        ],
        [
          {
            "text": "These are different normalizations. History calculates each trade’s net R before averaging. Summary mode uses an optional common initial risk only when it actually applies to every trade. The average-loss normalization is labelled separately."
          }
        ]
      ]
    },
    {
      "id": "profit-factor-and-payoff-ratio-are-different",
      "title": "Profit factor and payoff ratio are different",
      "paragraphs": [
        [
          {
            "text": "Profit factor divides total positive results by total absolute negative results. Forty USD 200 winners total USD 8,000; sixty USD 100 losers total USD 6,000. Profit factor is approximately 1.333333, monetary expectancy is USD 20 and the average-win/average-loss payoff ratio is 2."
          }
        ],
        [
          {
            "text": "When there is no losing amount, the ordinary finite profit-factor ratio is unavailable. The tool does not present zero or an invented large number as a substitute. A strong ratio from a handful of trades is still a small-sample observation."
          }
        ]
      ]
    },
    {
      "id": "deduct-costs-once",
      "title": "Deduct costs once",
      "paragraphs": [
        [
          {
            "text": "If input outcomes are gross, deduct missing costs consistently. USD 35 gross expectancy less USD 10 additional average cost gives USD 25 net. The uniform summary cost applies to every completed trade, including an input-zero trade, which can become a net loss."
          }
        ],
        [
          {
            "text": "Already-net mode applies no additional deduction. History can instead use an actual cost column for differing trade expenses. Use the "
          },
          {
            "text": "forex commission calculator",
            "href": "/calculators/forex-commission-calculator"
          },
          {
            "text": " and "
          },
          {
            "text": "swap calculator",
            "href": "/calculators/forex-swap-calculator"
          },
          {
            "text": " to interpret costs, then avoid counting them twice in the journal."
          }
        ]
      ]
    },
    {
      "id": "calculate-break-even-win-rate-with-the-right-assumptions",
      "title": "Calculate break-even win rate with the right assumptions",
      "paragraphs": [
        [
          {
            "text": "For binary outcomes without extra costs, break-even win fraction is L ÷ (A + L). With A = USD 200 and L = USD 100, it is one-third, approximately 33.33%. This threshold holds the average payoffs fixed; it is not a forecast of future wins."
          }
        ],
        [
          {
            "text": "With a fixed input-zero fraction q and uniform extra cost C, the share of all trades needed to break even is ((1 − q)L + C) ÷ (A + L). If it exceeds 1 − q, the requirement is unattainable under those assumptions. History uses frozen observed net averages and its observed zero share."
          }
        ]
      ]
    },
    {
      "id": "include-breakeven-trades-in-the-denominator",
      "title": "Include breakeven trades in the denominator",
      "paragraphs": [
        [
          {
            "text": "For 40 wins, 50 losses and 10 zero-result trades, the probabilities are 40%, 50% and 10%. With USD 200 winners and USD 100 losers, expectancy is USD 80 − USD 50 = USD 30 across all 100 trades."
          }
        ],
        [
          {
            "text": "Treating every non-winning trade as a loss would incorrectly use 60% losing probability. In a net journal, genuine zero outcomes remain separate. In a gross journal, missing charges can change the final classification after deduction."
          }
        ]
      ]
    },
    {
      "id": "calculate-an-observed-mean-from-a-journal",
      "title": "Calculate an observed mean from a journal",
      "paragraphs": [
        [
          {
            "text": "For net results USD +100, −50, +150, −100 and +50, the total is USD 150 and the mean USD 30 across five observations. "
          },
          {
            "text": "NIST’s explanation of the sample mean",
            "href": "https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm"
          },
          {
            "text": " describes the arithmetic average; it does not turn a sample into a known future trading distribution."
          }
        ],
        [
          {
            "text": "The result shows sample size, net winners/losers/zeros and the selected total. Its chart accumulates realised net results from zero. It is not account equity and does not adjust deposits or withdrawals."
          }
        ]
      ]
    },
    {
      "id": "map-csv-columns-and-keep-histories-private",
      "title": "Map CSV columns and keep histories private",
      "paragraphs": [
        [
          {
            "text": "Set exact header names in advanced assumptions before importing. Optional columns include additional costs, individual initial risk, date and currency. Unknown columns, such as account identifiers, are discarded. A file can contain up to 1,000 trades within 64 KiB."
          }
        ],
        [
          {
            "text": "Date rows must already be ordered. Calendar dates can repeat for multiple same-day trades; timestamps need an explicit UTC offset or Z. Future observations and mixed date conventions are rejected. Currency-labelled rows must match the selected currency. The tool reads files locally and omits financial histories and summary inputs from copied settings links."
          }
        ]
      ]
    },
    {
      "id": "choose-the-analysis-window-deliberately",
      "title": "Choose the analysis window deliberately",
      "paragraphs": [
        [
          {
            "text": "Use all supplied trades, the most recent N, or an inclusive UTC calendar-date window. Timestamped rows are assigned their UTC date for filtering. The tool does not silently sort data or invent dates for an undated history."
          }
        ],
        [
          {
            "text": "Compare subsets using consistent rules and cost treatment. A recent sample and a longer lifetime sample can answer different questions. The date range and sample size stay visible so a change in selection is not mistaken for an improvement in the underlying strategy."
          }
        ]
      ]
    },
    {
      "id": "there-is-no-universal-sufficient-sample-size",
      "title": "There is no universal sufficient sample size",
      "paragraphs": [
        [
          {
            "text": "A few trades can be dominated by one unusually large outcome. More observations provide information, but a larger dataset confined to one market environment can still be unrepresentative. Repeatedly selecting whichever window looks strongest also weakens the interpretation."
          }
        ],
        [
          {
            "text": "The tool reports a mean rather than certifying a statistical edge. Outcome dependence, changing volatility, execution and position size can affect future results. Keep source records and review the reasons for material differences between periods."
          }
        ]
      ]
    },
    {
      "id": "positive-expectancy-does-not-guarantee-smooth-growth",
      "title": "Positive expectancy does not guarantee smooth growth",
      "paragraphs": [
        [
          {
            "text": "A favourable mean can coexist with long losing sequences and deep drawdown. Trade order matters when size changes with equity; correlated positions add another account-level consideration. A fixed per-trade monetary average does not capture every path risk."
          }
        ],
        [
          {
            "text": "Review the "
          },
          {
            "text": "drawdown calculator",
            "href": "/calculators/forex-drawdown-calculator"
          },
          {
            "text": " for an observed capital path, the "
          },
          {
            "text": "risk-of-ruin calculator",
            "href": "/calculators/forex-risk-of-ruin-calculator"
          },
          {
            "text": " for conditional simulations and the "
          },
          {
            "text": "lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " for a separate stop-risk budget. These tools measure different things."
          }
        ]
      ]
    },
    {
      "id": "avoid-common-interpretation-mistakes",
      "title": "Avoid common interpretation mistakes",
      "paragraphs": [
        [
          {
            "text": "Use positive loss magnitudes in summary mode and signed P&L in history mode. Do not mix gross winners with net losers, ignore zero outcomes or confuse the payoff ratio with profit factor. Missing costs can turn an apparently positive result negative."
          }
        ],
        [
          {
            "text": "Also keep true mean R separate from monetary expectancy divided by average loss. If individual risks are provided, every selected trade needs one. A passing numerical calculation verifies arithmetic under the selected inputs; it does not validate a trading strategy or recommend increasing risk."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "What is a good trading expectancy?",
      "answer": "A positive net mean is favourable under the inputs, but no universal threshold proves a strategy is good. Sample quality, variability, drawdown, costs and changing conditions matter alongside the average."
    },
    {
      "question": "Can a strategy with a 40% win rate be profitable?",
      "answer": "Yes. If average winners are sufficiently larger than average losers, net expectancy can be positive. At 40% wins, USD 300 winners and USD 100 losers give USD 60 before additional costs."
    },
    {
      "question": "Is expectancy the same as profit factor?",
      "answer": "No. Expectancy is average P&L per trade. Profit factor compares total positive net outcomes with total absolute negative outcomes. Averages and ratios describe different aspects of the same selected results."
    }
  ]
};
