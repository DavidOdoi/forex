import type { CalculatorDefinition } from "./catalog";
export const hedgeDefinition: CalculatorDefinition = {
  "slug": "forex-hedge-calculator",
  "path": "/calculators/forex-hedge-calculator",
  "kind": "hedge",
  "keyword": "forex hedge calculator",
  "title": "Forex Hedge Calculator – Net Exposure, Costs & Margin",
  "heading": "Forex Hedge Calculator",
  "description": "Forex hedge calculator: compare same-pair buy and sell positions, net and gross exposure, executable-price P&L, extra costs and explicit margin assumptions.",
  "card": "Separate net direction from gross open volume, price P&L and entered hedge-margin assumptions.",
  "intro": "Holding a buy and sell position in the same currency pair can reduce directional exposure, but it doesn’t erase existing profit or loss. Compare the two sides of a proposed hedge to see gross volume, remaining net exposure, and estimated costs or margin under your broker’s rules.",
  "quickAnswer": "For compatible same-symbol positions, Net lots = Buy lots − Sell lots, while Gross lots = Buy lots + Sell lots. Buying 1.00 lot of EUR/USD and selling 0.60 lots leaves 0.40 lots net long and 1.60 lots gross open volume. Opposite positions may still incur commissions, swap charges, and broker-specific margin requirements.",
  "steps": [
    "Confirm that the account holds separate opposing positions in the same forex symbol.",
    "Enter both sizes, their executed opening prices and contemporaneous closing bid/ask.",
    "Add only missing charges and signed financing; provide any account-currency conversion.",
    "Choose a documented margin assumption or platform-reported value, then review exposure and conditional scenarios."
  ],
  "sections": [
    {
      "id": "what-this-forex-hedge-calculator-measures",
      "title": "What this forex hedge calculator measures",
      "paragraphs": [
        [
          {
            "text": "This tool compares separate buy and sell positions in one forex symbol. It shows the remaining directional position, the total volume still open, price P&L at supplied closing quotes and a clearly selected margin assumption. Every figure belongs to the same symbol and configured contract size."
          }
        ],
        [
          {
            "text": "It does not estimate a cross-currency portfolio hedge or assume that two different pairs move together. A long EUR/USD and short GBP/USD contain different currency exposures. Their relationship needs a separate model rather than subtraction of their lot labels. This page deliberately keeps its arithmetic within one compatible instrument."
          }
        ]
      ]
    },
    {
      "id": "net-exposure-and-gross-volume-answer-different-questions",
      "title": "Net exposure and gross volume answer different questions",
      "paragraphs": [
        [
          {
            "text": "Net volume describes the difference between opposing sides. Gross volume adds both sides. With 1.00 buy lot and 0.60 sell lots, net exposure is 0.40 lots long while gross open volume is 1.60 lots. Under a 100,000-unit contract, that means EUR 40,000 net and EUR 160,000 gross for EUR/USD."
          }
        ],
        [
          {
            "text": "The two measures should not be substituted for each other. Net volume helps describe residual direction. Gross volume matters when reviewing open positions, transaction costs and some margin conventions. The calculator displays both instead of assuming a small net amount makes the total book small."
          }
        ]
      ],
      "table": {
        "headers": [
          "Buy lots",
          "Sell lots",
          "Net position",
          "Gross open lots"
        ],
        "rows": [
          [
            "1.00",
            "0.60",
            "0.40 long",
            "1.60"
          ],
          [
            "1.00",
            "1.00",
            "Matched",
            "2.00"
          ],
          [
            "0.40",
            "1.00",
            "0.60 short",
            "1.40"
          ],
          [
            "1.00",
            "0.00",
            "1.00 long",
            "1.00"
          ]
        ]
      },
      "formula": "Net lots = Buy lots − Sell lots; Gross open lots = Buy lots + Sell lots."
    },
    {
      "id": "confirm-the-account-can-hold-opposing-positions",
      "title": "Confirm the account can hold opposing positions",
      "paragraphs": [
        [
          {
            "text": "A trading platform can use netting or hedging accounting. In a netting system, an opposite trade can reduce, close or reverse the existing position. It does not necessarily create an additional independent position. A hedge calculation that assumes two open legs would then describe the wrong transaction history."
          }
        ],
        [
          {
            "text": "MetaTrader’s position-accounting explanation",
            "href": "https://www.metatrader5.com/en/terminal/help/trading/general_concept"
          },
          {
            "text": " distinguishes these systems. Check the actual account configuration and broker restrictions. This calculator assumes separately held positions throughout; it does not reconstruct realised P&L after an opposite deal on a netting account or confirm that your account permits hedging."
          }
        ]
      ]
    },
    {
      "id": "use-compatible-units-on-both-sides",
      "title": "Use compatible units on both sides",
      "paragraphs": [
        [
          {
            "text": "Choose configured lots or base-currency units. Both buy and sell sizes use the same selection. Under a conventional contract, 0.10 lots means 10,000 base units, not a USD 10,000 deposit. Changing the contract multiplier changes the conversion between lots and units."
          }
        ],
        [
          {
            "text": "The optional specification fields let you describe a different forex contract, but they are not verified broker settings. Use the "
          },
          {
            "text": "forex lot size converter",
            "href": "/calculators/forex-lot-size-converter"
          },
          {
            "text": " to review volume conventions separately. The hedge calculation does not replace minimum-order, lot-step or position-limit checks on the actual platform."
          }
        ]
      ]
    },
    {
      "id": "value-buys-at-bid-and-sells-at-ask",
      "title": "Value buys at bid and sells at ask",
      "paragraphs": [
        [
          {
            "text": "A buy position normally closes against bid, while a sell closes against ask. Enter the executed opening side for each position and current closing quotes observed together. The ask cannot be below the bid under this ordinary quote model."
          }
        ],
        [
          {
            "text": "For each buy, price P&L is closing bid minus executed entry ask, multiplied by base units. For each sell, it is executed entry bid minus closing ask, multiplied by units. These executable-price differences already contain spread effects. A second spread deduction would count the same effect again."
          }
        ]
      ]
    },
    {
      "id": "a-partial-hedge-example-including-the-spread",
      "title": "A partial-hedge example including the spread",
      "paragraphs": [
        [
          {
            "text": "Assume one conventional EUR/USD buy lot opened at 1.1002 and 0.60 sell lots opened at 1.1000. Current bid is 1.1000 and ask is 1.1002. In a USD account, the buy has USD −20 price P&L and the sell USD −12. Combined price P&L is USD −32 before additional charges."
          }
        ],
        [
          {
            "text": "If both closing sides then rise by ten conventional pips with the spread unchanged, the buy gains USD 100 relative to that snapshot and the sell loses USD 60. Combined P&L improves by USD 40 to USD 8. The residual 0.40-lot long position explains this simplified movement."
          }
        ]
      ],
      "table": {
        "headers": [
          "Snapshot",
          "Buy price P&L",
          "Sell price P&L",
          "Combined price P&L"
        ],
        "rows": [
          [
            "Bid 1.1000 / ask 1.1002",
            "USD −20",
            "USD −12",
            "USD −32"
          ],
          [
            "Bid 1.1010 / ask 1.1012",
            "USD 80",
            "USD −72",
            "USD 8"
          ]
        ]
      }
    },
    {
      "id": "a-matched-hedge-does-not-erase-an-existing-loss",
      "title": "A matched hedge does not erase an existing loss",
      "paragraphs": [
        [
          {
            "text": "Equal opposite positions can leave zero net base units while preserving a loss between their entry prices. Opening an opposite leg does not restore money already lost. Closing one side later changes the remaining position and exposes that leg to subsequent price movement."
          }
        ],
        [
          {
            "text": "A constant-spread, fixed-conversion scenario can illustrate locked price P&L. Real spreads, financing, settlement conversions and execution can change. The output therefore uses “matched” rather than “risk-free.” It does not suggest that offsetting a losing trade guarantees recovery or that a later profitable unwind is available."
          }
        ]
      ]
    },
    {
      "id": "add-only-costs-missing-from-the-price-calculation",
      "title": "Add only costs missing from the price calculation",
      "paragraphs": [
        [
          {
            "text": "Enter extra total charges for the complete scenario in account currency. These are amounts, not per-lot or per-side quotations. Signed financing is separate: a negative value is a charge and a positive value a credit. Avoid including the same fee in both fields."
          }
        ],
        [
          {
            "text": "The "
          },
          {
            "text": "forex commission calculator",
            "href": "/calculators/forex-commission-calculator"
          },
          {
            "text": " can translate a fee schedule into a total for a chosen order list. The "
          },
          {
            "text": "forex swap calculator",
            "href": "/calculators/forex-swap-calculator"
          },
          {
            "text": " models entered rollover terms. Opposite positions can both incur financing charges; do not assume that one side’s credit cancels the other’s cost."
          }
        ]
      ]
    },
    {
      "id": "keep-margin-rules-explicit",
      "title": "Keep margin rules explicit",
      "paragraphs": [
        [
          {
            "text": "A broker can treat covered and uncovered positions differently. Gross-notional margin, larger-leg margin and a platform-reported amount are distinct inputs here. The first two are deliberately simple custom assumptions; neither is automatically labelled your broker’s current rule."
          }
        ],
        [
          {
            "text": "MetaTrader’s hedged-margin documentation",
            "href": "https://www.metatrader5.com/en/terminal/help/trading_advanced/margin_forex#hedged"
          },
          {
            "text": " describes broker-configured alternatives and more detailed calculations. Account type, open prices, contract rules and pending orders can affect the actual requirement. When the simple models do not fit, enter the platform’s reported used margin instead of forcing the account into a universal formula."
          }
        ]
      ]
    },
    {
      "id": "understand-the-notional-convention",
      "title": "Understand the notional convention",
      "paragraphs": [
        [
          {
            "text": "For the simple margin scenarios, the calculator values base units using the supplied bid/ask midpoint and a frozen liability-side conversion where required. A base-currency account values its base units directly. This is an explicit exposure convention, not an assertion that the broker values every position at that midpoint."
          }
        ],
        [
          {
            "text": "At a 1.1001 EUR/USD midpoint, 1.60 gross standard lots represent USD 176,016. A hypothetical 1:30 gross-notional assumption gives USD 5,867.20 margin. Using only the larger 1.00-lot leg gives USD 3,667. Different platform rules can produce another amount; a matched hedge does not imply zero collateral."
          }
        ]
      ]
    },
    {
      "id": "account-currency-conversion-can-affect-the-combined-result",
      "title": "Account-currency conversion can affect the combined result",
      "paragraphs": [
        [
          {
            "text": "Forex price P&L first belongs to the quote currency. If the account uses another currency, each leg needs conversion. The tool uses proceeds-side conversion for gains and liability-side conversion for losses, then combines the converted results and separately entered charges."
          }
        ],
        [
          {
            "text": "A broker that nets currency settlement before conversion can produce a different amount. The rates here stay fixed across the scenario. They do not predict future settlement prices. Review the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " for a single position and keep conversion and spread conventions consistent when comparing its output."
          }
        ]
      ]
    },
    {
      "id": "read-the-price-movement-table-as-a-conditional-comparison",
      "title": "Read the price-movement table as a conditional comparison",
      "paragraphs": [
        [
          {
            "text": "The scenario table moves bid and ask together by selected pip distances. It keeps spread, position sizes, conversion quotations and extra charges unchanged. Those restrictions make the relationship between residual exposure and P&L easier to inspect; they do not recreate real market behavior."
          }
        ],
        [
          {
            "text": "A spread widening affects the legs differently from a parallel price movement. Changing or closing one leg also changes the book. Update the inputs after such an event. The calculator does not place trades, choose an unwind date or forecast a future opportunity to close both sides profitably."
          }
        ]
      ]
    },
    {
      "id": "review-the-whole-account-before-acting",
      "title": "Review the whole account before acting",
      "paragraphs": [
        [
          {
            "text": "This model covers only the entered pair and two aggregate sides. It leaves out other positions, pending orders, correlated instruments, platform-specific close-by procedures and any realised results from earlier trading. It is not an account-wide stop-out calculation."
          }
        ],
        [
          {
            "text": "Use the "
          },
          {
            "text": "margin call calculator",
            "href": "/calculators/forex-margin-call-calculator"
          },
          {
            "text": " with actual equity and used margin for a separate threshold check. For all inputs, confirm the currency, observation time and account terms. Settings links omit position amounts and entries; recipients must supply their own financial data. Copying a result creates a report, not a trading instruction."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "Does an equal buy and sell eliminate every risk?",
      "answer": "No. Matching compatible sizes removes net base units in this model. Existing P&L, spread changes, financing, conversion, execution and counterparty risks remain. A matched book is not a guarantee against loss."
    },
    {
      "question": "Can I use two different currency pairs?",
      "answer": "No. This tool compares compatible opposing positions in one forex symbol. Different pairs require a separate currency-exposure or portfolio model; equal lot labels do not establish an effective cross-pair hedge."
    },
    {
      "question": "Will the broker charge margin on both sides?",
      "answer": "It depends on the actual account and symbol rules. This tool offers simple gross/larger-leg assumptions or an entered platform figure. It does not infer zero margin from equal opposite positions."
    }
  ]
};
