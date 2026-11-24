import type { CalculatorDefinition } from "./catalog";
export const stopLossDefinition: CalculatorDefinition = {
  "keyword": "forex stop loss calculator",
  "title": "Forex Stop Loss Calculator – Price, Pips & Risk",
  "description": "Forex stop loss calculator: find protective prices from pips, cash risk, equity percentages or ATR. Compare nominal losses, costs and price-grid rounding.",
  "heading": "Forex Stop Loss Calculator",
  "intro": "A forex stop loss calculator helps you determine where a protective stop should be placed and how much money a trade could lose if the position closes at that price. Enter your currency pair, entry price, trade direction, lot size, and stop-loss distance to calculate the stop price and estimated monetary risk. For example, buying EUR/USD at 1.1000 with a stop 30 pips below entry produces a stop-loss level of 1.0970. For a conventional 0.20-lot position in a USD account, a 30-pip adverse movement represents approximately $60 in gross price loss. Use the calculator above to evaluate the amount at risk before trading.",
  "quickAnswer": "Buy stop = entry − stop pips × pip size; sell stop = entry + that distance. A EUR/USD buy at 1.1000 with a 30-pip stop gives 1.0970. At 0.20 conventional lots in a USD account, the gross nominal price loss is USD 60 before separate costs. Cash or percentage mode works backward from a chosen allowance. Results use the entered grid and frozen conversion quotes. A standard stop can fill beyond its level, so this is not a guaranteed maximum loss.",
  "steps": [
    "Select the pair, account currency, direction, executable entry and volume.",
    "Choose a pip distance, explicit stop, cash allowance, percentage budget or entered ATR.",
    "For cash/percentage budgets, choose whether the allowance covers gross price loss or entered net costs.",
    "Confirm the price grid, contract, pip size and any required closing-conversion assumption.",
    "Compare theoretical and rounded stops, nominal money loss and costs; verify actual order rules and allow for execution risk."
  ],
  "sections": [
    {
      "id": "what-is-a-stop-loss-in-forex-trading",
      "title": "What Is a Stop Loss in Forex Trading?",
      "paragraphs": [
        [
          {
            "text": "A protective stop is an instruction intended to close a position after an adverse price move. It normally sits below a buy entry or above a sell entry. The instruction provides an intended exit, not certainty about execution price or maximum loss."
          }
        ],
        [
          {
            "text": "Gaps, liquidity, rapid movement, separately charged costs and account-currency conversion can change the final result. This calculator makes the planned price and nominal money consequences visible under your assumptions. It does not judge whether the stop fits a successful trading strategy."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-forex-stop-loss-calculator",
      "title": "How to Use the Forex Stop Loss Calculator",
      "paragraphs": [
        [
          {
            "text": "Choose the instrument, direction, executable entry and volume. Pip mode translates distance; price mode checks a candidate stop; cash and percentage modes solve an allowance; ATR mode multiplies your entered observation. A percentage budget needs positive equity."
          }
        ],
        [
          {
            "text": "Advanced settings add separate fees, signed financing and the symbol’s contract, pip and price-grid conventions. Conversion quotes remain fixed through the scenario. The tool has no verified broker minimum-distance feed. Check actual order constraints, rather than treating an entered increment as proof the stop is acceptable."
          }
        ]
      ]
    },
    {
      "id": "stop-loss-formula-for-a-buy-position",
      "title": "Stop-Loss Formula for a Buy Position",
      "paragraphs": [
        [
          {
            "text": "Buying EUR/USD at 1.1050 with a 45-pip stop uses 45 × 0.0001 = 0.0045. Subtracting gives 1.1005. At 0.10 conventional lots in a USD account, the pip value is USD 1 and the gross nominal loss is USD 45."
          }
        ],
        [
          {
            "text": "The calculator reports that arithmetic without deciding whether the distance is appropriate. If you choose a different volume, monetary risk changes while this entry and distance still define the same theoretical stop price."
          }
        ]
      ]
    },
    {
      "id": "stop-loss-formula-for-a-sell-position",
      "title": "Stop-Loss Formula for a Sell Position",
      "paragraphs": [
        [
          {
            "text": "Selling GBP/USD at 1.2700 with a 35-pip protective distance adds 0.0035, giving 1.2735. At 0.50 conventional lots in a USD account, pip value is USD 5 and gross nominal loss is USD 175."
          }
        ],
        [
          {
            "text": "A stop below that sell entry would not be an ordinary adverse-side protective stop. The tool rejects wrong-side and zero-distance inputs instead of silently interpreting them as a different order scenario. The execution-side quotation still needs to match the position."
          }
        ]
      ]
    },
    {
      "id": "calculating-a-stop-loss-from-a-dollar-risk-limit",
      "title": "Calculating a Stop Loss From a Dollar Risk Limit",
      "formula": "Stop pips = Monetary risk budget ÷ Pip value at selected volume",
      "paragraphs": [
        [
          {
            "text": "At 0.50 standard EUR/USD lots in a USD account, one pip is USD 5. A USD 100 gross price-loss allowance gives 20 pips, so a 1.1000 buy entry produces 1.0980. This is gross nominal risk, not a loss guarantee."
          }
        ],
        [
          {
            "text": "If the allowance includes USD 10 of entered costs, only USD 90 remains for price loss: 18 pips and a 1.0982 stop. When costs consume the entire net allowance, no positive adverse distance fits and the tool reports an error. Assumed financing credits are not guaranteed future income."
          }
        ]
      ]
    },
    {
      "id": "how-risk-percentage-affects-stop-loss",
      "title": "How Risk Percentage Affects Stop Loss",
      "paragraphs": [
        [
          {
            "text": "One percent of USD 5,000 is USD 50; 2% is USD 100 and 5% is USD 250. These are arithmetic choices, not recommended risk levels. A percentage alone cannot determine a stop because pip value also depends on volume and conversion."
          }
        ],
        [
          {
            "text": "At a USD 50 gross allowance, USD 1 per pip permits 50 theoretical pips; USD 5 permits ten; USD 10 permits five. Often a trader chooses a technically meaningful stop first, then uses the "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " to examine volume under a selected budget."
          }
        ]
      ]
    },
    {
      "id": "stop-loss-vs-lot-size",
      "title": "Stop Loss vs Lot Size",
      "paragraphs": [
        [
          {
            "text": "A conventional EUR/USD position of 0.50 lots with a 20-pip stop has USD 100 nominal price risk in a USD account. A 0.25-lot position with a 40-pip stop has the same nominal amount before costs."
          }
        ],
        [
          {
            "text": "They remain different setups, with different price distances and possible outcomes. Equal monetary risk does not establish equal chances of success. This page holds entered volume fixed when solving a stop; use the position-sizing tool when volume is the quantity you want to change."
          }
        ]
      ]
    },
    {
      "id": "stop-loss-for-jpy-currency-pairs",
      "title": "Stop Loss for JPY Currency Pairs",
      "paragraphs": [
        [
          {
            "text": "JPY-quoted pairs conventionally use 0.01 pips. A USD/JPY buy at 160.00 with a 40-pip stop gives 159.60. One standard lot has JPY 1,000 per pip, so the price loss is JPY 40,000."
          }
        ],
        [
          {
            "text": "At an explicitly assumed closing conversion of 159.60 JPY per USD, 40,000 ÷ 159.60 is approximately USD 250.63. The "
          },
          {
            "text": "forex pip calculator",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " explains the unit convention. Here the conversion is a frozen scenario input, not a prediction that this future closing rate will be available."
          }
        ]
      ]
    },
    {
      "id": "stop-loss-and-bid-ask-prices",
      "title": "Stop Loss and Bid/Ask Prices",
      "paragraphs": [
        [
          {
            "text": "A buy generally opens at "
          },
          {
            "text": "ask and closes at bid",
            "href": "https://www.metatrader5.com/en/terminal/help/trading/general_concept"
          },
          {
            "text": "; a sell opens at bid and closes at ask. A bid-only chart may therefore differ from the executable side that closes a short position. Actual trigger mechanics depend on the broker and order type."
          }
        ],
        [
          {
            "text": "Enter executable entry and stop-side prices. The shared P&L engine already reflects their difference, so another spread deduction would count the same effect twice. Midpoint prices need a different explicitly specified model, rather than being mixed silently with these fills."
          }
        ]
      ]
    },
    {
      "id": "stop-loss-using-atr",
      "title": "Stop Loss Using ATR",
      "paragraphs": [
        [
          {
            "text": "Average True Range",
            "href": "https://www.metatrader5.com/en/terminal/help/indicators/oscillators/atr"
          },
          {
            "text": " measures recent price variation. An entered 25-pip ATR with a 2× multiplier produces a 50-pip theoretical distance: a 1.1000 buy gives 1.0950; a sell gives 1.1050. Price-unit and pip-unit inputs are separate."
          }
        ],
        [
          {
            "text": "The tool does not calculate ATR from a chart or fetch a live indicator. Match the observation, timeframe and unit to your strategy. A volatility-derived stop is not a statistical guarantee about the next movement or a universal recommendation. Price-grid rounding can shorten the theoretical distance."
          }
        ]
      ]
    },
    {
      "id": "fixed-stop-loss-vs-trailing-stop-loss",
      "title": "Fixed Stop Loss vs Trailing Stop Loss",
      "paragraphs": [
        [
          {
            "text": "A fixed stop stays at its selected level until changed. A conventional one-way trailing stop can follow favorable movement and then remain fixed when price reverses. Its update reference and execution arrangements depend on the platform and agreement."
          }
        ],
        [
          {
            "text": "This calculator models a single fixed protective level. It does not simulate a trailing path, monitor quotes or keep an order running while your terminal is offline. Confirm how the actual platform handles trailing instructions and server-side orders before relying on them."
          }
        ]
      ]
    },
    {
      "id": "stop-loss-and-risk-reward-ratio",
      "title": "Stop Loss and Risk-Reward Ratio",
      "paragraphs": [
        [
          {
            "text": "For a EUR/USD buy at 1.1000, a 1.0950 stop creates 50 pips of adverse distance. A 1.1100 target is 100 favorable pips, giving a gross 1:2 risk:reward ratio. A 1.1050 target gives 1:1."
          }
        ],
        [
          {
            "text": "The "
          },
          {
            "text": "forex take profit calculator",
            "href": "/calculators/forex-take-profit-calculator"
          },
          {
            "text": " translates a chosen reward objective; the "
          },
          {
            "text": "risk–reward calculator",
            "href": "/calculators/forex-risk-reward-calculator"
          },
          {
            "text": " compares gross and cost-adjusted outcomes. These ratios are conditional on their exits. A higher ratio neither estimates a win probability nor proves positive expectancy."
          }
        ]
      ]
    },
    {
      "id": "why-stop-loss-orders-can-slip",
      "title": "Why Stop-Loss Orders Can Slip",
      "paragraphs": [
        [
          {
            "text": "A buy stop planned at 1.0950 could fill at an available bid of 1.0935 during a gap or rapid move. That is 15 extra adverse pips, or USD 150 on one conventional EUR/USD standard lot in a USD account, before further costs."
          }
        ],
        [
          {
            "text": "Ordinary stop-order assumptions apply here. Guaranteed-stop products, if offered, have specific terms and fees that are not imported. The displayed nominal loss can be exceeded; a neatly calculated percentage does not eliminate execution risk."
          }
        ]
      ]
    },
    {
      "id": "common-forex-stop-loss-mistakes",
      "title": "Common Forex Stop-Loss Mistakes",
      "paragraphs": [
        [
          {
            "text": "Avoid wrong-side stops, incorrect pip conventions, omitted costs and treating gross cash allowances as net. Frozen conversion inputs are not future-rate forecasts. Also verify the "
          },
          {
            "text": "actual permitted price increment",
            "href": "https://www.mql5.com/en/docs/constants/environment_state/marketinfoconstants"
          },
          {
            "text": ": buy stops round up and sell stops down toward entry, so the rounded location can be closer than intended."
          }
        ],
        [
          {
            "text": "No positive adverse grid point may fit an extremely tight plan; the tool then rejects it. A tighter stop chosen solely to justify more volume does not establish a sound strategy or a guaranteed risk limit."
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
            "text": "Use the forex stop loss calculator before entering a trade or when checking an existing plan. Compare price distance, nominal loss and entered costs while keeping volume and quote conventions explicit. For a broader plan, review collateral in the "
          },
          {
            "text": "forex margin calculator",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": " and model actual entry/exit outcomes in the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": ". The result explains your inputs; it cannot determine whether the trade will succeed."
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
            "text": "A protective stop plan connects price, pip distance, volume and a chosen nominal loss allowance. Review the theoretical and rounded levels, fee treatment and conversion assumptions together. Confirm actual order rules, and allow for the possibility that realized loss exceeds the displayed estimate."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "How do I calculate stop loss in forex?",
      "answer": "For a buy, subtract the desired pip distance multiplied by pip size from entry. For a sell, add that distance. To calculate monetary risk, multiply stop distance by pip value at the selected trade volume."
    },
    {
      "question": "How much should I risk on a forex trade?",
      "answer": "There is no universally appropriate amount. The decision depends on account size, financial circumstances, strategy, and tolerance for loss. The calculator shows the mathematical implications of a chosen amount."
    },
    {
      "question": "Can a forex stop loss lose more than expected?",
      "answer": "Yes. Standard stop orders can execute beyond the intended price during gaps, rapid price changes, or poor liquidity. Additional charges can also affect the final result."
    }
  ],
  "slug": "forex-stop-loss-calculator",
  "path": "/calculators/forex-stop-loss-calculator",
  "kind": "stoploss",
  "card": "Calculate a protective price from distance, nominal cash risk, equity percentage or entered ATR."
};
