import type { CalculatorDefinition } from "./catalog";
export const commissionDefinition: CalculatorDefinition = {
  "keyword": "forex commission calculator",
  "title": "Forex Commission Calculator – Cost Per Lot & Trade",
  "description": "Forex commission calculator: compare per-side and round-turn fees, partial closes, minimum charges and currency conversions, with pip-equivalent trading costs.",
  "heading": "Forex Commission Calculator",
  "intro": "Forex commission schedules can be confusing when one broker quotes a fee “per side” and another uses a “round-turn” figure. Enter the rate and trade volume to compare the actual commission for opening and closing a position, including minimum charges or currency conversion when relevant.",
  "quickAnswer": "For a proportional per-side rate, Round-turn commission = Lots × Fee per lot per side × 2. A 0.20-lot trade at $3.50 per standard lot per side costs $1.40 for both sides. If the broker already quotes a round-turn rate, multiply it by lots without doubling it.",
  "steps": [
    "Select the pair, account currency and commission denomination.",
    "Choose per-side, round-turn, per-million-base-units or percentage-notional pricing.",
    "Enter volume and the applicable fee rates; separate the configured platform lot from the billed-lot unit.",
    "Add minimum charges or custom executed orders when the schedule requires them.",
    "Check conversion inputs, the order breakdown and equivalent pip cost before comparing accounts."
  ],
  "sections": [
    {
      "id": "what-is-forex-trading-commission",
      "title": "What Is Forex Trading Commission?",
      "paragraphs": [
        [
          {
            "text": "Commission is a separately charged execution fee. It differs from the bid/ask spread, although both can affect trading costs. Rates vary by company, account, platform and instrument. A “commission-free” account can still incur spreads, financing and other charges."
          }
        ],
        [
          {
            "text": "A quoted USD 3 per lot per side differs from USD 3 per lot round turn. Likewise, “per million” needs a denomination: this tool’s volume-based mode means one million base-currency units, not a million dollars of changing transaction notional."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-forex-commission-calculator",
      "title": "How to Use the Forex Commission Calculator",
      "paragraphs": [
        [
          {
            "text": "Select the charging convention, fee denomination and "
          },
          {
            "text": "trade size unit",
            "href": "/calculators/forex-lot-size-converter"
          },
          {
            "text": ". Enter an opening order only or a simple equal-volume round trip. In advanced settings, custom executed-order rows replace that simple list; they can contain multiple entries and partial exits. Each exit must not exceed the volume opened earlier."
          }
        ],
        [
          {
            "text": "Results separate entry fees, exit fees, the original-denomination total and account-currency cost. Already-charged commission reduces the remaining debit, not the estimated total. Every fee schedule is manually entered: no broker’s latest pricing or eligibility is imported automatically."
          }
        ]
      ]
    },
    {
      "id": "per-side-vs-round-turn-commission",
      "title": "Per-Side vs Round-Turn Commission",
      "paragraphs": [
        [
          {
            "text": "A per-side charge applies to opening and closing separately. At USD 3.50 per standard lot per side, an equal-volume one-lot round trip costs USD 7. A USD 7 round-turn quotation produces the same proportional total."
          }
        ],
        [
          {
            "text": "Select whether round-turn fees are allocated half to entry and half to exit, or prepaid in full at entry. Under prepaid timing, closing rows have no additional commission or closing minimum. For split billing, each charged side can trigger the entered per-order minimum. Check the actual schedule rather than inferring billing timing from the advertised total."
          }
        ]
      ]
    },
    {
      "id": "example-commission-on-a-0-20-lot-eur-usd-trade",
      "title": "Example: Commission on a 0.20-Lot EUR/USD Trade",
      "paragraphs": [
        [
          {
            "text": "At USD 3.50 per standard lot per side, a 0.20-lot EUR/USD entry costs USD 0.70 and an equal-volume exit costs USD 0.70. Total commission is USD 1.40. Conventional "
          },
          {
            "text": "pip value",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " for this position in a USD account is USD 2, so the equivalent cost is 1.40 ÷ 2 = 0.7 pips. Fees and pip value must use the same currency."
          }
        ]
      ]
    },
    {
      "id": "how-commission-changes-with-lot-size",
      "title": "How Commission Changes With Lot Size",
      "table": {
        "headers": [
          "Volume",
          "Round-Turn Commission"
        ],
        "rows": [
          [
            "0.01 lots",
            "$0.07"
          ],
          [
            "0.10 lots",
            "$0.70"
          ],
          [
            "0.20 lots",
            "$1.40"
          ],
          [
            "0.50 lots",
            "$3.50"
          ],
          [
            "1.00 lot",
            "$7.00"
          ],
          [
            "2.00 lots",
            "$14.00"
          ]
        ]
      },
      "paragraphs": [
        [
          {
            "text": "With proportional USD 3.50-per-side pricing and no minimums, the table shows complete round trips. A broker’s minimum charge can make small orders more expensive than proportional arithmetic suggests. Enter that minimum separately and check any documented rounding; the displayed table assumes neither adjustment."
          }
        ]
      ]
    },
    {
      "id": "commission-based-on-notional-value",
      "title": "Commission Based on Notional Value",
      "formula": "Commission = Transaction notional value × Commission percentage",
      "paragraphs": [
        [
          {
            "text": "Percentage-notional pricing uses transaction notional × percentage ÷ 100. At 0.002%, a USD 100,000 order costs USD 2. At the same rate for two USD 100,000 orders, commission totals USD 4."
          }
        ],
        [
          {
            "text": "Quote-currency notional equals base units × that order’s executable price. Thus, 100,000 EUR at EUR/USD 1.10 has USD 110,000 notional and costs USD 2.20 at 0.002%; an exit at 1.20 costs USD 2.40. Base-currency notional uses the base units directly. Fee denomination must match the chosen notional currency before conversion into the account currency."
          }
        ]
      ]
    },
    {
      "id": "forex-commission-vs-spread",
      "title": "Forex Commission vs Spread",
      "paragraphs": [
        [
          {
            "text": "Suppose a conventional one-lot EUR/USD trade has a 1.2-pip spread and no commission: USD 12 in spread cost. A 0.3-pip spread plus USD 7 round-turn commission costs USD 10. The second account is USD 2 cheaper under those assumptions, not universally. Minimum advertised spreads, execution differences and conversion charges can change the comparison."
          }
        ]
      ]
    },
    {
      "id": "calculating-total-forex-trading-costs",
      "title": "Calculating Total Forex Trading Costs",
      "bullets": [
        [
          {
            "text": "Spread cost: $3"
          }
        ],
        [
          {
            "text": "Round-turn commission: $7"
          }
        ],
        [
          {
            "text": "Overnight swap charge: $4"
          }
        ]
      ],
      "paragraphs": [
        [
          {
            "text": "A complete trading-cost estimate may include more than commission. Relevant components can include the bid/ask spread, commission, "
          },
          {
            "text": "overnight financing",
            "href": "/calculators/forex-swap-calculator"
          },
          {
            "text": ", and currency-conversion charges. Suppose a trade has: The estimated combined cost is $14, assuming no component has already been included in the supplied executable prices."
          }
        ],
        [
          {
            "text": "However, if "
          },
          {
            "text": "actual entry and exit bid/ask prices",
            "href": "https://www.metatrader5.com/en/terminal/help/trading/general_concept"
          },
          {
            "text": " are used to calculate gross P&L, the spread effect is already reflected in that result. Subtracting the same spread again would double-count it. This calculator keeps commission separate. Use the "
          },
          {
            "text": "spread cost calculator",
            "href": "/calculators/forex-spread-cost-calculator"
          },
          {
            "text": " for a standalone spread-plus-fee estimate; executable-price P&L already embeds the spread."
          }
        ]
      ]
    },
    {
      "id": "commission-and-forex-scalping",
      "title": "Commission and Forex Scalping",
      "paragraphs": [
        [
          {
            "text": "Repeated small charges accumulate. One hundred identical one-lot round trips at USD 7 cost USD 700; at USD 5 they cost USD 500, a USD 200 difference before spreads and execution. The repetition control illustrates that multiplication rather than encouraging additional trading."
          }
        ],
        [
          {
            "text": "Lower commission alone does not establish lower all-in costs. Compare representative spreads and executable fills as well as fees. Increasing activity to qualify for a pricing tier can increase total costs and risk."
          }
        ]
      ]
    },
    {
      "id": "commission-for-partial-closes",
      "title": "Commission for Partial Closes",
      "paragraphs": [
        [
          {
            "text": "Opening one lot and closing 0.40 followed by 0.60 lots produces one lot of total closing volume. With proportional USD 3.50-per-side pricing, entry costs USD 3.50 and the two exits cost USD 1.40 and USD 2.10: USD 7 overall."
          }
        ],
        [
          {
            "text": "A minimum changes small-order economics. For a 0.10-lot entry with 0.04- and 0.06-lot exits, a USD 1 minimum on each of the three charged orders produces USD 3 instead of the proportional USD 0.70. Rows represent executed orders, not individual fills within one order. Match the schedule’s actual minimum-charge unit."
          }
        ]
      ]
    },
    {
      "id": "commission-in-different-account-currencies",
      "title": "Commission in Different Account Currencies",
      "paragraphs": [
        [
          {
            "text": "A broker may quote commissions in USD even when the trading account is denominated in EUR, GBP, UGX, or another currency. In that case, the fee needs conversion. For example, suppose the completed trade has a $7 commission and the illustrative "
          },
          {
            "text": "conversion rate",
            "href": "https://frankfurter.dev/"
          },
          {
            "text": " is 1 USD = 0.90 EUR. The account-currency cost is: $7 × 0.90 = €6.30."
          }
        ],
        [
          {
            "text": "If the broker charges a conversion markup, the actual debit may differ. The result identifies the original fee currency, conversion quotation and resulting debit. Enter the applicable all-in conversion quote; no extra markup is assumed. If a necessary conversion is unavailable, the tool asks for a manual rate."
          }
        ]
      ]
    },
    {
      "id": "are-commission-free-forex-accounts-cheaper",
      "title": "Are Commission-Free Forex Accounts Cheaper?",
      "paragraphs": [
        [
          {
            "text": "Not necessarily. Commission-free normally means no separately listed transaction fee for that account and instrument, not cost-free trading. Wider spreads, financing and other charges can still apply. Compare the complete cost under representative quotes and the actual company’s current disclosures."
          }
        ]
      ]
    },
    {
      "id": "how-to-compare-broker-commission-structures",
      "title": "How to Compare Broker Commission Structures",
      "paragraphs": [
        [
          {
            "text": "Verify the company, account, platform and instrument covered by the schedule. Confirm denomination, whether fees are per side or round turn, minimums, billing timing and any volume tier. Do not apply a high-volume discount automatically to a new account."
          }
        ],
        [
          {
            "text": "The base units per billed lot may differ from the "
          },
          {
            "text": "platform’s configured lot",
            "href": "https://www.mql5.com/en/docs/constants/environment_state/marketinfoconstants"
          },
          {
            "text": ". For example, a platform lot containing 10,000 units is only one tenth of a 100,000-unit billed standard lot. Enter both conventions correctly. Save a scenario link for each schedule to compare the same volume and currency assumptions."
          }
        ],
        [
          {
            "text": "An official schedule, such as "
          },
          {
            "text": "Interactive Brokers’ spot-currency commissions",
            "href": "https://www.interactivebrokers.com/en/pricing/commissions-spot-currencies.php"
          },
          {
            "text": ", shows why minimums and volume tiers need checking."
          }
        ]
      ]
    },
    {
      "id": "common-forex-commission-calculation-mistakes",
      "title": "Common Forex Commission Calculation Mistakes",
      "paragraphs": [
        [
          {
            "text": "Common errors include doubling a round-turn fee, omitting the closing side, treating currency units as lots, applying a USD fee directly to a EUR account and ignoring per-order minimums on partial closes. Another is comparing commission alone while disregarding spread and execution."
          }
        ],
        [
          {
            "text": "Optional fee rounding is half-up in the original fee denomination, per charged order. Leave it blank to retain precision. It does not reproduce undocumented broker rounding, minimums per fill, tiered rates or caps. Confirm those rules on the fee schedule and actual statement."
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
            "text": "The forex commission calculator helps you translate broker fee schedules into clear monetary and pip-equivalent costs. Use it to compare per-side and round-turn charges, account types, trade volumes, and fee currencies. For meaningful broker comparisons, always consider commission alongside the spread and other applicable costs."
          }
        ],
        [
          {
            "text": "For net trade outcomes, use the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " with executable prices and separately charged fees. Use the "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " to check whether those costs fit a defined cash-risk budget."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "How much commission do forex brokers charge?",
      "answer": "It varies by broker, account type, trading instrument, and volume. Some accounts charge no separate commission, while others apply a per-side or round-turn fee. Check the applicable broker schedule."
    },
    {
      "question": "Is $3.50 commission per lot per side or round turn?",
      "answer": "The phrase \"per side\" means the charge applies separately to opening and closing. At $3.50 per side, a complete one-lot trade costs $7 under symmetrical terms."
    },
    {
      "question": "How do I convert forex commission into pips?",
      "answer": "Divide the monetary commission by the pip value of the position, with both amounts expressed in the same currency. The result is the commission's equivalent pip cost."
    }
  ],
  "slug": "forex-commission-calculator",
  "path": "/calculators/forex-commission-calculator",
  "kind": "commission",
  "card": "Compare charging bases, partial closes, per-order minimums and pip-equivalent fees."
};
