import type { CalculatorDefinition } from "./catalog";
export const martingaleDefinition: CalculatorDefinition = {
  "slug": "forex-martingale-calculator",
  "path": "/calculators/forex-martingale-calculator",
  "kind": "martingale",
  "keyword": "forex martingale calculator",
  "title": "Forex Martingale Calculator – Lot Size & Drawdown",
  "heading": "Forex Martingale Calculator",
  "description": "Forex Martingale calculator: model lot progression, grid losses, break-even prices and margin. Compare closed trades with open grids and capital limits.",
  "card": "Compare separate losing trades with open-grid exposure, costs, margin and break-even.",
  "intro": "Doubling trade size after each loss sounds simple until you calculate the exposure after several losing levels. Explore the progression of lots, cumulative losses, and margin pressure in sequential trades or an open-position grid. The tool shows what the strategy could demand from your account—not a guaranteed recovery path.",
  "quickAnswer": "Lot at level n = Starting lot × Multiplier^(n − 1). Starting at 0.01 lots and doubling gives 0.01, 0.02, 0.04, 0.08, 0.16, 0.32 across six levels, totaling 0.63 lots. That total represents simultaneous exposure only when all six positions remain open; otherwise, it is cumulative traded volume.",
  "steps": [
    "Choose closed-loss or open-grid mode; set quantities, order limits and explicit rounding.",
    "Enter balance and asymmetric payoffs, or grid prices, costs and margin assumptions.",
    "Read the first constraint, each level and the extra adverse scenario before considering recovery."
  ],
  "sections": [
    {
      "id": "choose-the-correct-forex-martingale-calculator-mode",
      "title": "Choose the correct forex Martingale calculator mode",
      "paragraphs": [
        [
          {
            "text": "Sequential mode closes each losing trade before the next opens. Enter a starting quantity, multiplier, number of completed losses and the gross winning and losing amounts per quantity unit. Fees and an optional opening reserve are separate. With monetary stakes, one quantity unit means one unit of account currency; with lots, it means one configured lot."
          }
        ],
        [
          {
            "text": "Grid mode keeps same-direction positions in one forex pair open together. Enter executed entry prices, adverse spacing, account currency and the contract specification. The ladder marks all positions at each successive entry level. Neither mode generates trading signals or chooses an appropriate loss multiplier for you."
          }
        ]
      ]
    },
    {
      "id": "understand-the-lot-progression-before-looking-at-recovery",
      "title": "Understand the lot progression before looking at recovery",
      "paragraphs": [
        [
          {
            "text": "Starting with 0.01 lots and doubling produces the progression below. The cumulative column is simultaneous exposure only in grid mode; sequential trades close between levels."
          }
        ],
        [
          {
            "text": "Eight levels total 2.55 lots; ten total 10.23 lots. At a conventional 100,000 base units per lot, ten simultaneously open EUR/USD positions in this progression represent 1,023,000 EUR. That is exposure, not the cash paid or the maximum loss."
          }
        ]
      ],
      "table": {
        "headers": [
          "Level",
          "New lots",
          "Cumulative lots"
        ],
        "rows": [
          [
            "1",
            "0.01",
            "0.01"
          ],
          [
            "2",
            "0.02",
            "0.03"
          ],
          [
            "3",
            "0.04",
            "0.07"
          ],
          [
            "4",
            "0.08",
            "0.15"
          ],
          [
            "5",
            "0.16",
            "0.31"
          ],
          [
            "6",
            "0.32",
            "0.63"
          ]
        ]
      },
      "formula": "Quantity at level n = Starting quantity × Multiplier^(n − 1)"
    },
    {
      "id": "calculate-cumulative-quantity-and-apply-order-limits",
      "title": "Calculate cumulative quantity and apply order limits",
      "paragraphs": [
        [
          {
            "text": "For a multiplier M other than one, total theoretical quantity after N levels is starting quantity × (M^N − 1) ÷ (M − 1). When M equals one, multiply starting quantity by N instead."
          }
        ],
        [
          {
            "text": "The minimum, maximum and increment are entered assumptions. Strict mode flags incompatible orders. Explicit downward rounding adjusts each theoretical level independently to the minimum-plus-increment grid. It never raises a below-minimum order or caps an excessive one silently."
          }
        ],
        [
          {
            "text": "Rounding changes the actual quantities and can invalidate simple recovery examples. Check the theoretical and modelled columns separately. Use the "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " to compare a fixed-risk alternative before interpreting a growing progression."
          }
        ]
      ]
    },
    {
      "id": "sequential-example-four-losses-and-a-possible-next-win",
      "title": "Sequential example: four losses and a possible next win",
      "paragraphs": [
        [
          {
            "text": "With a starting stake of one, multiplier two and equal one-unit win/loss payoffs per unit staked, four losses are 1, 2, 4 and 8. Their total is 15. The next stake is 16, and a hypothetical net winning payoff of 16 leaves the whole sequence one unit ahead."
          }
        ],
        [
          {
            "text": "That arithmetic depends on the assumptions. If the gross winning payoff is only half the losing payoff, the next win earns eight before fees, leaving the sequence seven units down. Losing-trade fees, winning-trade fees and a fixed charge can reduce it further. The result is conditional on a win, not a forecast that one will occur."
          }
        ]
      ]
    },
    {
      "id": "capital-limits-matter-before-the-next-trade",
      "title": "Capital limits matter before the next trade",
      "paragraphs": [
        [
          {
            "text": "The sequential ladder subtracts every completed net loss from starting balance. It flags orders outside the entered quantity limits, exhausted balance, an opening reserve larger than remaining balance, or insufficient funds to absorb a specified completed loss."
          }
        ],
        [
          {
            "text": "The capital-floor metric extends the scenario through one further assumed loss, comparing each trade's loss with its opening reserve. It is a model boundary, not a recommended balance. A zero reserve omits margin requirements; it does not establish that a real trade needs none."
          }
        ],
        [
          {
            "text": "Rows after a constraint remain hypothetical. More capital does not create a profitable strategy. "
          },
          {
            "text": "FOREX.com's Martingale explanation",
            "href": "https://www.forex.com/en-us/trading-guides/martingale-system-in-investing/"
          },
          {
            "text": " discusses rapidly increasing commitments and the risk that available funds run out."
          }
        ]
      ]
    },
    {
      "id": "six-level-eur-usd-grid-entries-and-floating-loss",
      "title": "Six-level EUR/USD grid: entries and floating loss",
      "paragraphs": [
        [
          {
            "text": "Consider a buy grid starting at 1.1000, spaced 20 pips apart, with 0.01 starting lots and a multiplier of two. Entries are executable prices. Assume zero spread and no separate costs for this illustration."
          }
        ],
        [
          {
            "text": "At a common closing price of 1.0900, the six positions total 0.63 lots, or 63,000 EUR, and have a combined gross floating loss of $114. The latest entry is flat; earlier entries remain underwater. These are constructed examples, not current EUR/USD quotes."
          }
        ]
      ],
      "table": {
        "headers": [
          "Level",
          "Buy entry",
          "New lots"
        ],
        "rows": [
          [
            "1",
            "1.1000",
            "0.01"
          ],
          [
            "2",
            "1.0980",
            "0.02"
          ],
          [
            "3",
            "1.0960",
            "0.04"
          ],
          [
            "4",
            "1.0940",
            "0.08"
          ],
          [
            "5",
            "1.0920",
            "0.16"
          ],
          [
            "6",
            "1.0900",
            "0.32"
          ]
        ]
      }
    },
    {
      "id": "average-entry-improves-while-exposure-grows",
      "title": "Average entry improves while exposure grows",
      "paragraphs": [
        [
          {
            "text": "Weighted-average entry equals the sum of entry price × base units divided by total units. For that grid it is approximately 1.091809524. A rebound of about 18.095238 pips from 1.0900 reaches gross break-even under the common-price assumption."
          }
        ],
        [
          {
            "text": "The original entry was higher, but the position has grown from 0.01 to 0.63 lots. Every further adverse pip now changes gross P&L by $6.30. Another 20-pip decline adds a $126 loss, taking gross floating P&L to −$240 at 1.0880. The "
          },
          {
            "text": "forex pip calculator",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " explains how contract size and account currency determine that sensitivity."
          }
        ]
      ]
    },
    {
      "id": "spread-fees-and-executable-break-even",
      "title": "Spread, fees and executable break-even",
      "paragraphs": [
        [
          {
            "text": "Buy entries use ask prices and close at bid; sell entries use bid and close at ask. At each added level, the calculator offsets the closing side by your entered spread. Spread is already reflected in price P&L and is not deducted again."
          }
        ],
        [
          {
            "text": "Opening commissions and fixed opening fees reduce marked equity. Closing commissions are reserved separately in close-out net P&L. Signed accrued financing is entered per open lot; negative means a charge. This uniform assumption does not calculate different holding periods."
          }
        ],
        [
          {
            "text": "Net break-even covers the separately entered net costs using aggregate size. The rounded closing price moves in the favourable direction to fit the price precision. It is not a guaranteed available fill."
          }
        ]
      ]
    },
    {
      "id": "margin-can-become-the-binding-constraint",
      "title": "Margin can become the binding constraint",
      "paragraphs": [
        [
          {
            "text": "The grid offers a custom current-notional leverage or percentage model. At 0.63 EUR/USD lots and a reference price of 1.1000, USD notional is $69,300. Hypothetical 1:50 margin is $1,386. At 1.0900, current notional becomes $68,670 and modelled margin $1,373.40."
          }
        ],
        [
          {
            "text": "Actual platform calculations can differ. "
          },
          {
            "text": "MetaTrader's margin documentation",
            "href": "https://www.metatrader5.com/en/terminal/help/trading_advanced/margin_forex"
          },
          {
            "text": " describes instrument-specific calculation types, margin currencies and broker settings. This calculator does not certify any particular account's rules. Compare isolated position requirements with the "
          },
          {
            "text": "forex margin calculator",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": ", using the same contract and currency assumptions."
          }
        ]
      ]
    },
    {
      "id": "read-equity-drawdown-and-stop-out-together",
      "title": "Read equity, drawdown and stop-out together",
      "paragraphs": [
        [
          {
            "text": "Margin level is marked equity ÷ used margin × 100. Optional warning and stop-out percentages are your hypothetical thresholds, checked at or below each sampled level. They do not establish an exact liquidation price or simulate which position closes first."
          }
        ],
        [
          {
            "text": "The graph compares marked equity with starting equity. The reported largest modelled close-out loss includes the requested ladder and one further adverse interval, not unlimited adverse movement. An account can encounter a constraint between sampled prices or during a gap."
          }
        ],
        [
          {
            "text": "Use the "
          },
          {
            "text": "margin call and stop-out calculator",
            "href": "/calculators/forex-margin-call-calculator"
          },
          {
            "text": " for account-level threshold scenarios and the "
          },
          {
            "text": "forex drawdown calculator",
            "href": "/calculators/forex-drawdown-calculator"
          },
          {
            "text": " for loss and recovery percentages."
          }
        ]
      ]
    },
    {
      "id": "currency-conversion-and-model-boundaries",
      "title": "Currency conversion and model boundaries",
      "paragraphs": [
        [
          {
            "text": "Quote-currency P&L is aggregated before conversion, using the supplied proceeds or liability rate. Break-even uses the same aggregate-settlement assumption. A broker converting each position separately may produce a different total. All conversion quotes remain fixed across the ladder, including hypothetical future exits."
          }
        ],
        [
          {
            "text": "Margin values base units directly when account currency equals the pair's base; otherwise it uses current notional and the entered conversion. Changing the instrument clears the old entry price. No broker feed, tiered margin, variable spread, slippage, order-book liquidity or forced-liquidation sequence is reconstructed."
          }
        ],
        [
          {
            "text": "The tool supports up to twenty levels, with explicit quantity bounds to prevent runaway calculations. A rejected scenario needs smaller or valid inputs, not an assumption of infinite available capital."
          }
        ]
      ]
    },
    {
      "id": "use-the-ladder-to-expose-risk",
      "title": "Use the ladder to expose risk",
      "paragraphs": [
        [
          {
            "text": "A small break-even rebound is not evidence that adding losing positions is safe. The "
          },
          {
            "text": "CFTC's retail forex advisory",
            "href": "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_MustKnowForex.html"
          },
          {
            "text": " explains how leverage can amplify losses and why dealer checks matter; its registration guidance concerns the US market."
          }
        ],
        [
          {
            "text": "A losing sequence can exceed the modelled horizon. Understanding that limit is the useful outcome of this exercise."
          }
        ]
      ],
      "bullets": [
        [
          {
            "text": "Check the first constraint, not only the final recovery figure."
          }
        ],
        [
          {
            "text": "Stress costs and another adverse interval rather than assuming a reversal."
          }
        ],
        [
          {
            "text": "Treat shared settings as assumptions; private balances, prices and payoffs are omitted."
          }
        ],
        [
          {
            "text": "Compare the "
          },
          {
            "text": "risk of ruin calculator",
            "href": "/calculators/forex-risk-of-ruin-calculator"
          },
          {
            "text": " without treating any model as a prediction of survival."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "How do you calculate Martingale lot size in forex?",
      "answer": "Multiply starting lots by the multiplier raised to the number of previous losses. Starting at 0.01 lots and doubling after three losses gives 0.08 lots next. Check order increments and maximums separately."
    },
    {
      "question": "Does doubling forex lots guarantee recovery?",
      "answer": "No. A winning trade may not cover unequal previous losses and fees. Capital, margin or order limits can block the next trade, and the market need not reverse before those constraints are reached."
    },
    {
      "question": "How is sequential Martingale different from an open grid?",
      "answer": "Sequential trades close before the next begins, so their cumulative volume is traded volume. A grid keeps positions open together, requiring aggregate floating P&L, margin and weighted break-even calculations."
    }
  ]
};
