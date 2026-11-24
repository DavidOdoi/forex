import type {CalculatorDefinition}from"./catalog";
export const kellyDefinition:CalculatorDefinition={
  "slug": "kelly-criterion-calculator",
  "path": "/calculators/kelly-criterion-calculator",
  "kind": "kelly",
  "keyword": "kelly criterion calculator",
  "title": "Kelly Criterion Calculator for Forex Trading",
  "heading": "Kelly Criterion Calculator for Forex Trading",
  "description": "Kelly criterion calculator: compare raw, half and quarter Kelly fractions, inspect expected log growth, and test how uncertain win rates change the model.",
  "card": "Compare theoretical Kelly fractions, log growth and input sensitivity.",
  "intro": "How does a trading strategy’s win rate interact with the size of its winners and losers? The Kelly criterion provides a theoretical capital-allocation fraction under a simplified mathematical model. Compare full, half, and quarter Kelly results, and examine how quickly the result changes when the inputs are less favorable.",
  "quickAnswer": "For fixed binary payoffs, Kelly fraction = Win probability − (Loss probability ÷ Win-to-loss payoff ratio). With a 45% win rate and an average winner twice the average loser, full Kelly is 17.5%, half Kelly 8.75%, and quarter Kelly 4.375%. These are model outputs, not recommended forex risk levels.",
  "steps": [
    "Enter an assumed win percentage or completed winning/total trade counts. Historical counts describe the supplied sample; they do not establish a known future probability.",
    "Supply a net average winner-to-loss payoff ratio, or average net amounts in the same selected currency. Include transaction and financing costs once.",
    "Choose a fractional multiplier between 0 and 1. Optional reference capital shows theoretical stake amounts, never executable forex lots.",
    "Compare raw and nonnegative Kelly, fixed fractional alternatives, expected log growth, ten specified consecutive losses and win-probability sensitivity. Use personal/account risk limits independently."
  ],
  "sections": [
    {
      "id": "what-is-the-kelly-criterion",
      "title": "Kelly criterion calculator: the growth objective",
      "paragraphs": [
        [
          {
            "text": "Kelly maximizes expected logarithmic wealth growth across repeated modeled opportunities, not the profit of a single trade. Occasional large wins do not justify committing unlimited capital: losses reduce the base available for future compounding. The simplified formula balances those effects for fixed binary outcomes."
          }
        ],
        [
          {
            "text": "The approach originated in information theory. Its assumptions are demanding for trading: probabilities may change, wins and losses vary, and positions can be correlated. This calculator exposes that model rather than choosing a suitable personal risk level."
          }
        ],
        [
          {
            "text": "The primary reference is "
          },
          {
            "text": "Kelly’s 1956 paper, “A New Interpretation of Information Rate”",
            "href": "https://www.princeton.edu/~wbialek/rome/refs/kelly_56.pdf"
          },
          {
            "text": ". It explains the mathematical objective; it does not validate the probability estimates entered on this page."
          }
        ]
      ]
    },
    {
      "id": "step-by-step-kelly-calculation-example",
      "title": "Step-by-Step Kelly Calculation Example",
      "paragraphs": [
        [
          {
            "text": "Convert 45% to probability 0.45; the losing probability is 1 −0.45 =0.55. Divide 0.55 by payoff 2 to obtain 0.275, then subtract from 0.45: raw Kelly is 0.175, or 17.5%. Half and quarter are 8.75% and 4.375%."
          }
        ],
        [
          {
            "text": "A minority win rate can produce positive theoretical expectancy when average winners exceed average losses. The key uncertainty is whether the historical win/loss structure represents future opportunities, not whether the arithmetic subtraction is correct."
          }
        ]
      ],
      "table": {
        "headers": [
          "Input",
          "Value"
        ],
        "rows": [
          [
            "Win rate",
            "45%"
          ],
          [
            "Loss rate",
            "55%"
          ],
          [
            "Average win",
            "$200"
          ],
          [
            "Average loss",
            "$100"
          ],
          [
            "Payoff ratio",
            "2"
          ]
        ]
      }
    },
    {
      "id": "kelly-criterion-and-trading-expectancy",
      "title": "Kelly Criterion and Trading Expectancy",
      "paragraphs": [
        [
          {
            "text": "Expectancy is the modeled average outcome, while Kelly adds an expected-log-growth allocation objective. At 45% wins, USD 200 average winners and USD 100 average loss magnitude, expectancy is 0.45 ×200 −0.55 ×100 =USD 35 per trade. In loss units it is+0.35R."
          }
        ],
        [
          {
            "text": "A positive average outcome does not establish a suitable stake. Larger risk can increase arithmetic profit expectations while worsening drawdowns or expected compounding growth. Use net outcomes that include trading costs, or the estimated edge may be overstated."
          }
        ]
      ]
    },
    {
      "id": "full-kelly-vs-half-kelly-vs-quarter-kelly",
      "title": "Full Kelly vs Half Kelly vs Quarter Kelly",
      "paragraphs": [
        [
          {
            "text": "Full Kelly uses the nonnegative theoretical fraction; half and quarter multiply it by 0.5 and 0.25. At 45% wins and payoff 2, those fractions are 17.5%,8.75% and 4.375%. The selected multiplier can range from 0 to 1 and is shown alongside the fixed comparisons."
          }
        ],
        [
          {
            "text": "Reducing exposure reduces the magnitude of each modeled full-stake loss, all else equal. It also changes expected logarithmic growth. Even 4.375% repeatedly lost can cause substantial damage. Neither a fractional setting nor a positive growth value means a strategy is safe or compatible with account rules."
          }
        ]
      ]
    },
    {
      "id": "what-happens-when-kelly-is-negative",
      "title": "What Happens When Kelly Is Negative?",
      "paragraphs": [
        [
          {
            "text": "At 40% wins and payoff 1, raw Kelly is 0.40 −0.60/1 =−0.20, or−20%. The nonnegative betting fraction is zero for that modeled opportunity. This is not a signal to sell a currency pair or reverse the strategy."
          }
        ],
        [
          {
            "text": "At 50% wins and payoff 1, raw Kelly is zero. There is no positive growth advantage under those assumptions. A negative or zero result can also expose overly costly or weak payoff inputs; investigate the actual distribution rather than forcing a positive allocation."
          }
        ]
      ]
    },
    {
      "id": "why-estimating-win-rate-is-difficult",
      "title": "Why Estimating Win Rate Is Difficult",
      "paragraphs": [
        [
          {
            "text": "Winning 60 of 100 completed trades gives a 60% historical sample rate, not proof of a stable 60% probability ahead. Favorable regimes, selection effects and random variation can distort a short sample. Spreads, liquidity and trader behavior can also change."
          }
        ],
        [
          {
            "text": "Small input changes can materially alter Kelly. At payoff 2, reducing assumed wins from 45% to 35% changes full Kelly from 17.5% to 2.5%. The sensitivity table makes this dependence visible; it does not estimate which probability is true."
          }
        ]
      ],
      "table": {
        "headers": [
          "Assumed win rate",
          "Payoff ratio",
          "Raw full Kelly"
        ],
        "rows": [
          [
            "45%",
            "2",
            "17.5%"
          ],
          [
            "40%",
            "2",
            "10%"
          ],
          [
            "35%",
            "2",
            "2.5%"
          ]
        ]
      }
    },
    {
      "id": "kelly-and-the-risk-of-losing-streaks",
      "title": "Kelly and the Risk of Losing Streaks",
      "paragraphs": [
        [
          {
            "text": "A positive theoretical edge does not prevent losing streaks."
          }
        ],
        [
          {
            "text": "A strategy with a 45% win rate has a modeled 55% probability of losing an individual trade."
          }
        ],
        [
          {
            "text": "Under an independent-trades assumption, five consecutive losing trades have probability:"
          }
        ],
        [
          {
            "text": "0.55⁵ = approximately 5.03% for one specified five-trade sequence."
          }
        ],
        [
          {
            "text": "That probability does not describe the chance of encountering at least one five-trade losing streak over a longer trading record."
          }
        ],
        [
          {
            "text": "The latter depends on the number of trades and the simulation model."
          }
        ],
        [
          {
            "text": "Large Kelly fractions can make repeated losses especially damaging because each loss reduces the amount of capital available for future growth."
          }
        ],
        [
          {
            "text": "This is one reason to examine risk of ruin and maximum drawdown alongside Kelly."
          }
        ],
        [
          {
            "text": "Explore explicit losing-sequence and threshold assumptions with the risk-of-ruin calculator."
          }
        ]
      ]
    },
    {
      "id": "expected-logarithmic-growth",
      "title": "Expected Logarithmic Growth",
      "paragraphs": [
        [
          {
            "text": "For binary outcomes, expected log growth is p × ln(1 + b × f) + (1 − p) × ln(1 − f). Here f is the fraction of modeled capital staked, not a leveraged notional fraction. Natural-log units per trade are not a forecast of actual money returns."
          }
        ],
        [
          {
            "text": "This captures asymmetric recovery: a 50% loss needs a 100% gain to regain starting wealth. Excessive stakes can worsen log growth even with positive arithmetic expectancy. The curve illustrates that tradeoff under the entered assumptions."
          }
        ],
        [
          {
            "text": "At a 100% stake, any modeled loss makes log growth unbounded below; that endpoint is omitted unless the input probability is exactly 100%. The exceptional no-loss assumption receives a major caution and cannot verify a loss-free strategy."
          }
        ]
      ]
    },
    {
      "id": "can-kelly-be-used-for-forex-lot-size",
      "title": "Can Kelly Be Used for Forex Lot Size?",
      "paragraphs": [
        [
          {
            "text": "Kelly gives a modeled capital fraction, not forex lots. A separate chosen loss budget requires a defined "
          },
          {
            "text": "loss per unit",
            "href": "/calculators/forex-risk-reward-calculator"
          },
          {
            "text": ", stop distance, pip value, costs and order limits before translating it into volume."
          }
        ],
        [
          {
            "text": "For example, an independently chosen 1% allowance on USD 10,000 is USD 100. A 50-pip EUR/USD stop with USD 500 nominal risk per conventional lot implies 0.20 lots before costs and volume-grid adjustments. This is position sizing, not an automatic Kelly allocation. Use the lot-size calculator after choosing and checking that budget."
          }
        ]
      ]
    },
    {
      "id": "limitations-of-the-kelly-formula",
      "title": "Limitations of the Kelly Formula",
      "paragraphs": [
        [
          {
            "text": "The simplified formula assumes stable win probability, fixed winning and losing payoffs and repeatable fractional stakes. Actual trades may have variable outcomes, partial exits, correlations and changing conditions. A short or selectively chosen backtest can make the inputs look more reliable than they are."
          }
        ],
        [
          {
            "text": "Leverage, gaps, costs and "
          },
          {
            "text": "margin",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": " liquidation can create losses outside a binary model. Maximizing expected log growth is different from minimizing drawdown or maximizing the probability of a particular goal. A lower-risk choice can be rational even when the mathematical curve peaks elsewhere."
          }
        ]
      ]
    },
    {
      "id": "common-kelly-criterion-mistakes",
      "title": "Common Kelly Criterion Mistakes",
      "paragraphs": [
        [
          {
            "text": "Enter percentages in the percentage field:45 means 45%, while the internal formula uses 0.45. A payoff of 2 means average net winner divided by average net loss magnitude, not an untested maximum target. Average amounts must share a currency and already include relevant costs."
          }
        ],
        [
          {
            "text": "Do not treat full Kelly as an instruction, a negative number as a short signal, or a result for one strategy as a property of EUR/USD itself. The same instrument can support many different payoff distributions. "
          },
          {
            "text": "Historical counts",
            "href": "https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm"
          },
          {
            "text": " provide sample context, not a verified future win probability."
          }
        ]
      ]
    },
    {
      "id": "when-should-traders-use-kelly",
      "title": "When Should Traders Use Kelly?",
      "paragraphs": [
        [
          {
            "text": "Use Kelly as an educational sensitivity analysis when reviewing a representative record of completed outcomes. Compare modest changes in win probability and payoff before looking at the headline fraction. It does not replace checks on trade quality, execution, account limits or your financial capacity for loss."
          }
        ],
        [
          {
            "text": "Read "
          },
          {
            "text": "NIST’s explanation of binomial sampling uncertainty",
            "href": "https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm"
          },
          {
            "text": " when interpreting historical win counts, and the "
          },
          {
            "text": "CFTC’s forex risk guidance",
            "href": "https://www.cftc.gov/LearnAndProtect/forexfrauds"
          },
          {
            "text": " for product and provider risks."
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
            "text": "The Kelly criterion calculator helps explain how win probability, payoff ratio, and capital allocation interact."
          }
        ],
        [
          {
            "text": "Its most important value is not simply producing a percentage. It is showing how sensitive that percentage is to assumptions that may be uncertain."
          }
        ],
        [
          {
            "text": "Use the results as a mathematical reference alongside position sizing, risk-of-ruin analysis, and your own financial limits."
          }
        ],
        [
          {
            "text": "Use the "
          },
          {
            "text": "risk-of-ruin calculator",
            "href": "/calculators/forex-risk-of-ruin-calculator"
          },
          {
            "text": " for threshold simulations and the "
          },
          {
            "text": "forex lot-size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " for a separately chosen risk budget. Check trade-level net outcomes with the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": "."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "What is the Kelly criterion formula for forex?",
      "answer": "For a simplified binary trading model, Kelly fraction equals win probability minus losing probability divided by the average win-to-loss payoff ratio."
    },
    {
      "question": "Is half Kelly safer than full Kelly?",
      "answer": "Half Kelly uses less exposure than full Kelly and therefore reduces modeled loss magnitude, all else equal. It does not guarantee a safe strategy or prevent severe drawdowns."
    },
    {
      "question": "What if my Kelly percentage is negative?",
      "answer": "A negative result indicates no positive advantage for taking the modeled opportunity under the entered assumptions. A long-only implementation should display zero as the nonnegative betting fraction, not interpret the negative number as a forex sell signal."
    }
  ]
};
