import type { CalculatorDefinition } from "./catalog";
export const atrPositionDefinition: CalculatorDefinition = {
  "slug": "atr-position-size-calculator",
  "path": "/calculators/atr-position-size-calculator",
  "kind": "atrposition",
  "keyword": "atr position size calculator",
  "title": "ATR Position Size Calculator – Volatility & Forex Risk",
  "heading": "ATR Position Size Calculator",
  "description": "ATR position size calculator: turn an entered ATR into stop distance and forex lots, including costs, currency conversion and conservative volume rounding.",
  "card": "Connect an entered ATR stop with a monetary risk budget and permitted forex volume.",
  "intro": "A fixed stop distance can mean different things in quiet and volatile markets. Use Average True Range (ATR) to explore a volatility-based stop, then calculate the trading volume that fits a specified monetary risk budget. The result is a planning estimate, not a guarantee against gaps or slippage.",
  "quickAnswer": "First calculate Stop distance = ATR in pips × Multiplier. Then Lots = Risk budget ÷ (Stop pips × Pip value per standard lot). With a 25-pip ATR, 2× multiplier, $100 risk budget, and $10 per pip per standard lot, the stop is 50 pips and theoretical size 0.20 lots.",
  "steps": [
    "Choose the pair, account currency and a percentage or fixed cash-risk budget.",
    "Enter chart ATR, its unit and the stop multiplier; confirm any distance increment.",
    "Add costs and verify contract size, pip size and the broker’s actual volume grid.",
    "Supply any needed currency conversion, then inspect stop distance, rounded volume and modelled total loss."
  ],
  "sections": [
    {
      "id": "how-the-atr-position-size-calculator-connects-volatility-and-risk",
      "title": "How the ATR position size calculator connects volatility and risk",
      "paragraphs": [
        [
          {
            "text": "ATR measures the size of recent price ranges. Position sizing answers a separate question: how much volume fits a chosen loss budget at a specified stop distance? Combining them lets the stop expand or contract with the entered volatility measure while the cash budget stays explicit."
          }
        ],
        [
          {
            "text": "The tool does not decide that a trade is attractive. Nor does it recommend a particular risk percentage. You choose the budget and multiplier, then inspect the resulting distance, monetary exposure and rounded volume. A sensible numerical result can still be unsuitable for a strategy or account."
          }
        ]
      ]
    },
    {
      "id": "enter-atr-in-the-correct-unit",
      "title": "Enter ATR in the correct unit",
      "paragraphs": [
        [
          {
            "text": "A chart indicator may display ATR as a price difference rather than a number of conventional pips. On EUR/USD, 0.0025 price units equals 25 pips when one pip is 0.0001. On USD/JPY, a 0.25 price difference equals 25 conventional 0.01 pips."
          }
        ],
        [
          {
            "text": "Choose the unit before entering the value. Confusing 0.0025 with 25 changes the calculation by orders of magnitude. The calculator shows the converted ATR in pips so that you can compare it with the source chart. Custom contract and pip specifications remain entered assumptions."
          }
        ]
      ],
      "table": {
        "headers": [
          "Pair",
          "Entered ATR in price units",
          "Conventional pip size",
          "ATR in pips"
        ],
        "rows": [
          [
            "EUR/USD",
            "0.0025",
            "0.0001",
            "25"
          ],
          [
            "GBP/USD",
            "0.0030",
            "0.0001",
            "30"
          ],
          [
            "USD/JPY",
            "0.25",
            "0.01",
            "25"
          ]
        ]
      }
    },
    {
      "id": "what-average-true-range-actually-measures",
      "title": "What Average True Range actually measures",
      "paragraphs": [
        [
          {
            "text": "True range considers the current high-to-low range and movements relative to the previous close. ATR smooths those true ranges across a selected period. The calculation can therefore account for gaps that a simple high-minus-low measurement misses."
          }
        ],
        [
          {
            "text": "Fidelity’s ATR explanation",
            "href": "https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/atr"
          },
          {
            "text": " describes the indicator and its volatility interpretation. A higher ATR indicates larger measured ranges, not an upward price forecast. A falling ATR does not identify a direction either. The period, timeframe and smoothing convention should match the values you are comparing."
          }
        ]
      ]
    },
    {
      "id": "choose-a-consistent-chart-observation",
      "title": "Choose a consistent chart observation",
      "paragraphs": [
        [
          {
            "text": "Enter a value from the intended instrument and timeframe, and record whether it comes from a completed bar. An hourly ATR and a daily ATR describe different observation intervals. Moving between them without adjusting the trading plan can produce an inappropriate stop distance."
          }
        ],
        [
          {
            "text": "This calculator has no candle feed and does not calculate ATR from uploaded prices. It uses the number you supply. If a platform shows a still-changing indicator on the current bar, the eventual completed value can differ. Avoid presenting that temporary reading as a fixed historical measurement."
          }
        ]
      ]
    },
    {
      "id": "turn-atr-into-a-stop-distance",
      "title": "Turn ATR into a stop distance",
      "paragraphs": [
        [
          {
            "text": "Multiply ATR in pips by the chosen factor. A 25-pip ATR with a 1.5 multiplier gives 37.5 pips; a 2 multiplier gives 50 pips. The multiplier is a scenario input, not an established probability of avoiding a stop."
          }
        ],
        [
          {
            "text": "The optional distance increment rounds upward. For example, a theoretical 37.53-pip distance becomes 37.6 pips on an entered 0.1-pip grid. Sizing then uses that rounded distance, keeping the displayed stop and money calculation consistent. A blank increment leaves the distance theoretical."
          }
        ]
      ],
      "formula": "Stop pips = ATR pips × Multiplier; round distance upward only when an increment is entered."
    },
    {
      "id": "calculate-the-available-monetary-budget",
      "title": "Calculate the available monetary budget",
      "paragraphs": [
        [
          {
            "text": "You can enter a fixed account-currency amount or a percentage of balance or equity. With USD 10,000 and a selected 1% assumption, the budget is USD 100. That example explains the arithmetic rather than recommending 1% risk for every trader."
          }
        ],
        [
          {
            "text": "Balance and equity can differ when positions have floating profit or loss. Choose the reference that fits your plan and account obligations. "
          },
          {
            "text": "CME’s position-sizing guidance",
            "href": "https://www.cmegroup.com/education/courses/trade-and-risk-management/proper-position-size.html"
          },
          {
            "text": " connects account risk, stop placement and trade size; collateral and exposure still need their own checks."
          }
        ]
      ]
    },
    {
      "id": "worked-sizing-example-before-additional-costs",
      "title": "Worked sizing example before additional costs",
      "paragraphs": [
        [
          {
            "text": "Suppose ATR is 25 pips, the multiplier is 2 and the budget is USD 100. With a conventional EUR/USD standard lot worth USD 10 per pip in a USD account, a 50-pip adverse move represents USD 500 per lot. USD 100 divided by USD 500 gives 0.20 lots."
          }
        ],
        [
          {
            "text": "The result corresponds to EUR 20,000 under a 100,000-unit contract. At a 1.5 multiplier, the same assumptions give 37.5 pips and approximately 0.266667 theoretical lots. On a 0.01-lot grid beginning at 0.01, the permitted volume rounds down to 0.26 lots."
          }
        ]
      ],
      "table": {
        "headers": [
          "ATR multiplier",
          "Stop distance",
          "Theoretical lots",
          "Lots on the example grid"
        ],
        "rows": [
          [
            "1",
            "25 pips",
            "0.40",
            "0.40"
          ],
          [
            "1.5",
            "37.5 pips",
            "0.266667",
            "0.26"
          ],
          [
            "2",
            "50 pips",
            "0.20",
            "0.20"
          ],
          [
            "3",
            "75 pips",
            "0.133333",
            "0.13"
          ]
        ]
      }
    },
    {
      "id": "allow-for-commission-and-fixed-charges",
      "title": "Allow for commission and fixed charges",
      "paragraphs": [
        [
          {
            "text": "When costs are included, the model subtracts a fixed charge from the available budget and adds proportional round-turn commission to loss per lot. Enter a total opening-plus-closing rate per configured lot, rather than mistaking a per-side rate for a round-turn amount."
          }
        ],
        [
          {
            "text": "For USD 100 risk, a 50-pip stop and USD 7 commission per standard lot, theoretical volume becomes 100 ÷ 507, approximately 0.197239 lots. A 0.01-lot grid permits 0.19 lots, not 0.20. Use the "
          },
          {
            "text": "forex commission calculator",
            "href": "/calculators/forex-commission-calculator"
          },
          {
            "text": " to interpret more detailed fee schedules before transferring an estimate."
          }
        ]
      ]
    },
    {
      "id": "avoid-counting-the-spread-twice",
      "title": "Avoid counting the spread twice",
      "paragraphs": [
        [
          {
            "text": "Executable buy and sell prices already reflect their respective bid or ask sides. Do not add another spread deduction to a loss estimate that includes that effect. This sizing model accepts separate commission and fixed charges; it does not secretly add a second quoted spread."
          }
        ],
        [
          {
            "text": "If your plan uses a different price convention, reconcile it with the intended order and broker trigger side first. The "
          },
          {
            "text": "forex spread cost calculator",
            "href": "/calculators/forex-spread-cost-calculator"
          },
          {
            "text": " explains standalone spread estimates. A chart reaching a price does not establish that the executable closing side or resulting loss matches a simplified distance."
          }
        ]
      ]
    },
    {
      "id": "why-volume-rounds-down",
      "title": "Why volume rounds down",
      "paragraphs": [
        [
          {
            "text": "Permitted order sizes may follow a minimum plus whole increments, and a maximum can also apply. The engine rounds to that entered grid without increasing risk above the selected budget. A theoretical size below the minimum produces zero permitted lots rather than an oversized minimum order."
          }
        ],
        [
          {
            "text": "These specifications are editable, not verified broker rules. A nonstandard minimum can change the grid: 0.03 plus multiples of 0.02 permits 0.03, 0.05 and 0.07, not every hundredth. If the maximum caps the result, unused budget remains unused. It is not automatically added elsewhere."
          }
        ]
      ]
    },
    {
      "id": "convert-pip-exposure-into-account-currency",
      "title": "Convert pip exposure into account currency",
      "paragraphs": [
        [
          {
            "text": "Trade price movement first produces a quote-currency amount. A USD account trading a USD-quoted pair needs no further conversion. Other combinations require an appropriate direct, inverse or supported two-leg quote. The tool displays the conversion used rather than applying a universal USD 10 pip value."
          }
        ],
        [
          {
            "text": "Manual quotations and dated daily references are different inputs. A daily reference is not a live executable bid or ask. Frozen conversion rates can differ from the rates at a future stop. The "
          },
          {
            "text": "forex pip calculator",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " provides a focused check of these units and conversions."
          }
        ]
      ]
    },
    {
      "id": "review-stops-margin-and-account-wide-exposure-separately",
      "title": "Review stops, margin and account-wide exposure separately",
      "paragraphs": [
        [
          {
            "text": "The result is a stop distance and volume, not an order price or confirmation that a broker will accept it. For a candidate price exit, use the "
          },
          {
            "text": "forex stop loss calculator",
            "href": "/calculators/forex-stop-loss-calculator"
          },
          {
            "text": ". Check minimum order distances, trigger rules and actual symbol specifications before submitting an instruction."
          }
        ],
        [
          {
            "text": "Required margin is separate from stop risk. Several positions can also share market exposure or lose together. Use the "
          },
          {
            "text": "forex margin calculator",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": " for collateral and inspect the combined account. A correctly sized individual trade can still leave an unsuitable aggregate position."
          }
        ]
      ]
    },
    {
      "id": "use-the-comparison-table-without-treating-it-as-a-forecast",
      "title": "Use the comparison table without treating it as a forecast",
      "paragraphs": [
        [
          {
            "text": "The multiplier table keeps the entered ATR, budget, costs and specifications fixed. It changes only the stop factor and recomputes the permitted volume. A wider hypothetical stop usually gives smaller size; that is an arithmetic relationship, not evidence that one multiplier performs better."
          }
        ],
        [
          {
            "text": "Compare scenarios with a consistent journal and strategy rather than selecting whichever result produces the largest lot size. Reset returns the public example. Copied settings omit private financial inputs, and recipients must enter their own values. The calculator neither uploads your account figures nor creates a trading instruction."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "Does the calculator fetch live ATR?",
      "answer": "No. Enter ATR from your own chart with a consistent timeframe and completed-bar convention. This tool converts and sizes from that value; it does not reconstruct ATR or predict price direction."
    },
    {
      "question": "Does a wider ATR stop always mean more risk?",
      "answer": "At unchanged volume it increases modelled price risk. With a fixed monetary budget, the sizing engine normally reduces volume as the stop widens. Costs, minimum sizes and maximum volume can affect the result."
    },
    {
      "question": "Can the actual loss exceed the displayed amount?",
      "answer": "Yes. Gaps, slippage, changing conversion rates and extra charges can increase loss. The entered stop and broker specifications are assumptions, not a guaranteed execution price or maximum-loss promise."
    }
  ]
};
