import type { CalculatorDefinition } from "./catalog";
export const sharpeDefinition: CalculatorDefinition = {
  "slug": "sharpe-ratio-calculator",
  "path": "/calculators/sharpe-ratio-calculator",
  "kind": "sharpe",
  "keyword": "sharpe ratio calculator",
  "title": "Sharpe Ratio Calculator – Periodic & Annualized Returns",
  "heading": "Sharpe Ratio Calculator",
  "description": "Sharpe ratio calculator: analyse return series or summary statistics with matched benchmarks, sample/population volatility and clear annualization assumptions.",
  "card": "Compare periodic excess returns with volatility, aligned benchmarks and explicit scaling assumptions.",
  "intro": "Two trading strategies can earn similar returns while experiencing very different levels of volatility. Compare risk-adjusted performance by supplying a consistent series of returns and an appropriate risk-free benchmark. The Sharpe ratio is useful context, but it cannot capture every form of downside risk.",
  "quickAnswer": "Sharpe ratio = (Average return − Matching risk-free return) ÷ Return standard deviation. An illustrative strategy with 14% annual average return, 2% annual risk-free return, and 10% annual volatility has a Sharpe ratio of 1.20. Annualizing daily or monthly Sharpe values requires additional assumptions about return behavior.",
  "steps": [
    "Choose simple-return history or matching-period mean and standard deviation.",
    "Declare percent/decimal units, currency, return frequency and spacing assumptions.",
    "Enter a matched benchmark, convert an annual effective rate or map an aligned periodic benchmark column.",
    "Review periodic Sharpe, the eligible annualized approximation, sample size and denominator conventions."
  ],
  "sections": [
    {
      "id": "what-the-sharpe-ratio-measures",
      "title": "What the Sharpe ratio measures",
      "paragraphs": [
        [
          {
            "text": "Sharpe compares average excess return with the variability of returns. Excess return means return above a matching benchmark, not the total money earned. The denominator measures dispersion around an average and includes favourable as well as unfavourable deviations."
          }
        ],
        [
          {
            "text": "CFA Institute’s explanation of the Sharpe ratio",
            "href": "https://rpc.cfainstitute.org/-/media/documents/code/gips/sharpe-ratio-and-the-information-ratio.pdf"
          },
          {
            "text": " discusses this risk-adjusted measure. A higher number under consistent assumptions describes more excess return per unit of measured volatility. It does not capture every drawdown, liquidity constraint, extreme loss or execution risk, and it does not identify a universally superior strategy."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-sharpe-ratio-calculator",
      "title": "How to use the Sharpe ratio calculator",
      "paragraphs": [
        [
          {
            "text": "Choose matching-period summary statistics or an ordered simple-return series. Select percent or decimal units explicitly: 1 in percent mode means 1%, while 0.01 in decimal mode means 1%. A balance of USD 10,000 is not a 10,000% return."
          }
        ],
        [
          {
            "text": "Next choose the observation frequency, benchmark convention and annualization model. History defaults to sample standard deviation. The result shows the periodic ratio first, with any eligible annualized approximation, sample count, volatility convention and date coverage beside it. No live benchmark rate is supplied."
          }
        ]
      ]
    },
    {
      "id": "keep-the-numerator-and-denominator-aligned",
      "title": "Keep the numerator and denominator aligned",
      "paragraphs": [
        [
          {
            "text": "With a constant periodic benchmark, periodic Sharpe equals mean return minus that benchmark, divided by return standard deviation. All quantities must describe the same period. An annual risk-free percentage cannot simply be subtracted from each monthly observation."
          }
        ],
        [
          {
            "text": "With a varying benchmark, subtract the corresponding rate from every return first. Then calculate the mean and volatility of those aligned excess returns. The calculator labels this denominator separately because changing benchmarks can change the dispersion of excess returns even when portfolio returns have unchanged volatility."
          }
        ]
      ],
      "formula": "Periodic Sharpe = Mean aligned excess return ÷ Standard deviation of aligned excess returns."
    },
    {
      "id": "an-annual-summary-example",
      "title": "An annual summary example",
      "paragraphs": [
        [
          {
            "text": "At 14% arithmetic mean annual return, 2% annual benchmark and 10% annual standard deviation, excess return is 12 percentage points. The ratio is 12 ÷ 10 = 1.20. Under the same annual convention, 10% mean return, 2% benchmark and 5% standard deviation produce 1.60."
          }
        ],
        [
          {
            "text": "The second ratio is higher despite a lower average return. That observation alone says nothing conclusive about which investment suits a person. Different samples, currency benchmarks, liquidity or tail risks can make a comparison misleading."
          }
        ]
      ],
      "table": {
        "headers": [
          "Summary assumption",
          "Mean return",
          "Benchmark",
          "Standard deviation",
          "Sharpe"
        ],
        "rows": [
          [
            "Annual example A",
            "14%",
            "2%",
            "10%",
            "1.20"
          ],
          [
            "Annual example B",
            "10%",
            "2%",
            "5%",
            "1.60"
          ],
          [
            "Below benchmark",
            "2%",
            "4%",
            "10%",
            "−0.20"
          ]
        ]
      }
    },
    {
      "id": "work-through-five-monthly-returns",
      "title": "Work through five monthly returns",
      "paragraphs": [
        [
          {
            "text": "For 1%, 2%, 0%, −1% and 3%, the arithmetic mean is 1%. Squared deviations from that mean sum to 10 in squared percentage-point units. Sample variance divides by four, giving 2.5; sample standard deviation is approximately 1.58113883 percentage points."
          }
        ],
        [
          {
            "text": "With a zero monthly benchmark, periodic Sharpe is approximately 0.63245553. Multiplication by the square root of 12 gives approximately 2.19089023 under the selected annualization model. Five observations remain a very short sample; the larger annualized number does not create additional evidence."
          }
        ]
      ]
    },
    {
      "id": "sample-and-population-volatility-differ",
      "title": "Sample and population volatility differ",
      "paragraphs": [
        [
          {
            "text": "Sample standard deviation divides the sum of squared deviations by n − 1. Population standard deviation divides by n. The calculator offers both and labels the selection. For the five-return example, population variance is 2 and its standard deviation approximately 1.41421356 percentage points."
          }
        ],
        [
          {
            "text": "Changing that denominator changes the ratio even though the return observations remain identical. Match the method when comparing reports. Summary mode instead uses the volatility you supply; it cannot verify how that number was estimated or whether the underlying sample is representative."
          }
        ]
      ]
    },
    {
      "id": "enter-a-suitable-risk-free-reference",
      "title": "Enter a suitable risk-free reference",
      "paragraphs": [
        [
          {
            "text": "Choose a benchmark appropriate to the portfolio’s currency and measurement period. A reference denominated in another currency can introduce a different comparison. The tool’s currency label records your declaration; it does not fetch a government yield or independently verify benchmark suitability."
          }
        ],
        [
          {
            "text": "A matched periodic rate can be entered directly. For an annual effective percentage, the tool uses (1 + annual rate)^(1 / periods per year) − 1. This is a stated compounding convention. A quoted yield with another basis must be converted appropriately before use."
          }
        ]
      ]
    },
    {
      "id": "use-aligned-benchmarks-when-rates-vary",
      "title": "Use aligned benchmarks when rates vary",
      "paragraphs": [
        [
          {
            "text": "History mode can map a risk-free column alongside each return. Its values must already be periodic simple rates in the same percent/decimal convention as the return column. Missing values are rejected rather than silently filled with zero or copied from a different date."
          }
        ],
        [
          {
            "text": "The paired method uses the average and standard deviation of excess returns. It also displays raw return volatility for comparison. That distinction helps explain why two calculations with different benchmark treatment can produce different ratios. The imported column is your supplied reference, not a verified live rate feed."
          }
        ]
      ]
    },
    {
      "id": "treat-square-root-annualization-as-a-model",
      "title": "Treat square-root annualization as a model",
      "paragraphs": [
        [
          {
            "text": "The conventional approximation multiplies periodic Sharpe by the square root of assumed periods per year. Common inputs are 12 for monthly observations, 52 for weekly data and 252 for a trading-day convention. The daily count is an assumption, not a universal market calendar."
          }
        ],
        [
          {
            "text": "Andrew Lo’s research on Sharpe ratio annualization",
            "href": "https://rpc.cfainstitute.org/research/financial-analysts-journal/2002/the-statistics-of-sharpe-ratios"
          },
          {
            "text": " explains why return dependence matters. Serial correlation, overlapping observations and changing distributions can invalidate simple scaling. This tool does not implement an autocorrelation adjustment or claim that the selected approximation is exact."
          }
        ]
      ]
    },
    {
      "id": "unknown-or-irregular-periods-need-special-care",
      "title": "Unknown or irregular periods need special care",
      "paragraphs": [
        [
          {
            "text": "Unknown frequency or a declaration of inconsistent spacing prevents automatic annualization. Clear gaps in weekly, monthly or annual period-end dates also suppress standard scaling. For an annual effective benchmark, those detected gaps must be resolved or replaced with genuinely aligned benchmark returns."
          }
        ],
        [
          {
            "text": "Daily trading-calendar continuity is not automatically checked. A custom periods-per-year value remains an explicit modelling assumption rather than a repair of irregular data. Dates alone cannot prove independent observations, and changing a frequency label cannot transform an irregular account record into a sound time-series comparison."
          }
        ]
      ]
    },
    {
      "id": "zero-volatility-and-one-observation-are-not-performance-scores",
      "title": "Zero volatility and one observation are not performance scores",
      "paragraphs": [
        [
          {
            "text": "With zero measured standard deviation, the ordinary formula requires division by zero. The result is unavailable rather than Infinity. A constant observed series can arise from a short record, rounding or stale valuation; it does not establish a zero-risk investment."
          }
        ],
        [
          {
            "text": "One observation is insufficient for sample standard deviation. Population volatility for one point is zero, which also leaves the ratio undefined. The calculator keeps those cases explicit while showing the available inputs and sample count. It does not manufacture a finite ratio to fill the space."
          }
        ]
      ]
    },
    {
      "id": "understand-a-negative-sharpe-ratio",
      "title": "Understand a negative Sharpe ratio",
      "paragraphs": [
        [
          {
            "text": "With 2% mean return, a 4% matching benchmark and 10% volatility, Sharpe is −0.20. Average return was below the selected benchmark. That does not mean every observation lost money, and it is not a forecast that the next observation will be negative."
          }
        ],
        [
          {
            "text": "Avoid grading strategies by colour or a universal threshold. A short backtest can have a very high number without including difficult conditions. Use the same return definition, benchmark, frequency, cost treatment and volatility convention when comparing another report."
          }
        ]
      ]
    },
    {
      "id": "supply-returns-rather-than-balances-or-trade-cash-amounts",
      "title": "Supply returns rather than balances or trade cash amounts",
      "paragraphs": [
        [
          {
            "text": "A USD 100 gain on USD 1,000 capital differs from USD 100 on USD 100,000. Raw cash P&L and account balances are therefore not substitutes for periodic return rates. The importer rejects common balance/price/P&L column names as return selections; it performs no implicit money-to-return conversion."
          }
        ],
        [
          {
            "text": "Deposits and withdrawals need appropriate cash-flow treatment before exporting a return series. The "
          },
          {
            "text": "drawdown calculator",
            "href": "/calculators/forex-drawdown-calculator"
          },
          {
            "text": " has a separately disclosed cash-flow index method. Per-trade R statistics from the "
          },
          {
            "text": "expectancy calculator",
            "href": "/calculators/trading-expectancy-calculator"
          },
          {
            "text": " also remain different from periodic account returns."
          }
        ]
      ]
    },
    {
      "id": "keep-csv-interpretation-and-privacy-explicit",
      "title": "Keep CSV interpretation and privacy explicit",
      "paragraphs": [
        [
          {
            "text": "Files are read locally with a 64 KiB and 1,000-observation limit. Set exact return, benchmark and period-end header names before importing. Unknown columns are discarded. Date rows must be unique, increasing YYYY-MM-DD values, with no future observations; rows are not silently sorted."
          }
        ],
        [
          {
            "text": "Currency-labelled observations must match the declared portfolio currency. The chart shows supplied returns and benchmarks, not account equity. Settings links omit the history and private summary values. Recipients enter their own data, and copying a result does not connect the calculator to a trading account."
          }
        ]
      ]
    },
    {
      "id": "combine-sharpe-with-other-performance-questions",
      "title": "Combine Sharpe with other performance questions",
      "paragraphs": [
        [
          {
            "text": "Sharpe uses total volatility, including large positive variations. Sortino uses a different downside-focused denominator relative to a chosen target; neither is a complete account-risk measure. This page does not calculate Sortino or infer a downside distribution from the Sharpe number."
          }
        ],
        [
          {
            "text": "Review "
          },
          {
            "text": "risk-of-ruin scenarios",
            "href": "/calculators/forex-risk-of-ruin-calculator"
          },
          {
            "text": ", "
          },
          {
            "text": "effective leverage",
            "href": "/calculators/forex-leverage-calculator"
          },
          {
            "text": " and "
          },
          {
            "text": "position sizing",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " separately. Averages and ratios can conceal path risk, correlated exposure, changing execution or severe tail events. Use the output as a transparent comparison under stated inputs, not proof of future performance."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "What is the Sharpe ratio formula?",
      "answer": "For a constant matching benchmark, subtract its periodic return from arithmetic mean return and divide by return standard deviation. With varying benchmarks, calculate aligned excess returns first and use their mean and standard deviation."
    },
    {
      "question": "Is a Sharpe ratio above 2 always good?",
      "answer": "No. Sample length, frequency, return dependence, costs, stale valuations and extreme losses all affect interpretation. A high value from a short record is not evidence of persistent future performance or a complete risk assessment."
    },
    {
      "question": "How is a monthly Sharpe ratio annualized?",
      "answer": "A common approximation multiplies periodic Sharpe by the square root of 12. The tool labels this assumption and omits automatic scaling for unknown or detected inconsistent periods. No autocorrelation-adjusted estimate is implied."
    }
  ]
};
