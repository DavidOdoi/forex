import type { CalculatorDefinition } from "./catalog";
export const marginCallDefinition: CalculatorDefinition = {
  "keyword": "forex margin call calculator",
  "title": "Forex Margin Call Calculator – Stop-Out & Margin Level",
  "description": "Forex margin call calculator: check equity, free margin and entered stop-out levels. Model losses and changing used margin with clearly stated assumptions.",
  "heading": "Forex Margin Call & Stop-Out Calculator",
  "intro": "How close is your trading account to a margin warning or stop-out? Enter current equity, used margin, and the thresholds for your specific broker account to see your margin level and the remaining equity distance to each boundary. Broker rules vary, so the displayed thresholds are conditional estimates.",
  "quickAnswer": "Margin level (%) = Equity ÷ Used margin × 100. If equity is $2,000 and used margin is $1,000, margin level is 200%. With an illustrative 100% margin-call and 50% stop-out setting, the corresponding fixed-margin equity thresholds are $1,000 and $500. They are not exact liquidation prices.",
  "steps": [
    "Select the account currency and enter equity, or balance plus current floating P&L.",
    "Enter account-level used margin and the applicable warning and stop-out percentages.",
    "Choose the threshold comparison; keep hypothetical assumptions separate from referenced account rules.",
    "For a referenced policy, enter the public company, legal entity, account type, source and checked date, then confirm the settings.",
    "Optionally change credited funds, additional P&L, costs or used margin; compare current and scenario conditions."
  ],
  "sections": [
    {
      "id": "what-is-a-margin-call-in-forex",
      "title": "What Is a Margin Call in Forex?",
      "paragraphs": [
        [
          {
            "text": "A margin call is a broker-defined warning or account condition associated with insufficient equity relative to margin requirements. Losing positions can reduce equity while reserved collateral remains unchanged. A warning may restrict new positions, prompt a notice or have other consequences under the agreement."
          }
        ],
        [
          {
            "text": "It does not necessarily close every position immediately. Check the actual trigger, notification policy and account terms rather than assuming another platform’s definition applies. The calculator tests entered arithmetic conditions, not whether a broker has sent a notice."
          }
        ]
      ]
    },
    {
      "id": "what-is-stop-out-in-forex-trading",
      "title": "What Is Stop-Out in Forex Trading?",
      "paragraphs": [
        [
          {
            "text": "Stop-out refers to a broker’s automatic position-closure process under specified account conditions. It may close positions individually or follow another documented sequence. Execution prices depend on available liquidity and order handling."
          }
        ],
        [
          {
            "text": "A calculated threshold is not a guaranteed closing price or maximum loss. Spreads, gaps, slippage and changed margin requirements can alter what happens before or during liquidation. This tool does not simulate the broker’s closure sequence."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-forex-margin-call-calculator",
      "title": "How to Use the Forex Margin Call Calculator",
      "paragraphs": [
        [
          {
            "text": "Use the account-level equity and used margin shown on your platform. Enter the warning and stop-out percentages and choose whether the condition applies at-or-below or strictly below the threshold. Defaults are hypothetical; no verified broker preset is selected."
          }
        ],
        [
          {
            "text": "Referenced-rule mode requires public broker, legal-entity and account-type names, a public HTTPS source, checked date and your confirmation. That records your assumption; it is not independent verification. Scenarios change credited funds, additional P&L, costs and used margin."
          }
        ]
      ]
    },
    {
      "id": "equity-balance-and-used-margin",
      "title": "Equity, Balance, and Used Margin",
      "paragraphs": [
        [
          {
            "text": "Balance generally reflects funds and completed transactions; equity also reflects floating P&L under the account’s accounting conventions. Used margin is collateral reserved for the relevant positions."
          }
        ],
        [
          {
            "text": "A USD 5,000 balance with USD 1,000 floating loss gives USD 4,000 equity. At USD 2,000 used margin, the level is 200%, not the 250% obtained by substituting balance. Select direct equity or balance-plus-floating-P&L input. Do not add existing floating losses again in the scenario’s additional-P&L field."
          }
        ]
      ]
    },
    {
      "id": "how-to-calculate-free-margin",
      "title": "How to Calculate Free Margin",
      "formula": "Free margin = Equity − Used margin",
      "paragraphs": [
        [
          {
            "text": "Free margin = equity − used margin. With USD 5,000 equity and USD 1,500 used margin, the result is USD 3,500. It is not necessarily immediately withdrawable cash. Unsettled charges, account restrictions and ongoing price changes can affect availability."
          }
        ],
        [
          {
            "text": "Used margin can rise without a trading loss, reducing free margin. Negative free margin is shown as an arithmetic deficit; it is not silently changed to zero."
          }
        ]
      ]
    },
    {
      "id": "how-to-calculate-a-margin-call-equity-threshold",
      "title": "How to Calculate a Margin-Call Equity Threshold",
      "formula": "Margin-call equity = Used margin × Margin-call percentage ÷ 100",
      "paragraphs": [
        [
          {
            "text": "Hold used margin fixed and multiply it by the entered warning percentage divided by 100. USD 2,000 used margin at 100% gives USD 2,000 threshold equity. At 80%, the threshold is USD 1,600."
          }
        ],
        [
          {
            "text": "From USD 4,000 equity, the signed distances are USD 2,000 and USD 2,400 respectively. A negative distance means current equity is already below the calculated level. It is not an additional loss allowance. Actual margin requirements and broker procedures may change."
          }
        ]
      ]
    },
    {
      "id": "how-to-calculate-a-stop-out-equity-threshold",
      "title": "How to Calculate a Stop-Out Equity Threshold",
      "formula": "Stop-out equity = Used margin × Stop-out percentage ÷ 100",
      "paragraphs": [
        [
          {
            "text": "USD 2,000 used margin at a hypothetical 50% stop-out level gives USD 1,000 threshold equity. From USD 3,000 equity, the signed distance is USD 2,000 under that fixed-margin assumption."
          }
        ],
        [
          {
            "text": "The threshold is relative to used margin, not half the original deposit. Zero-percent thresholds are supported without division by zero: the equity threshold is zero while used margin remains positive. Neither example establishes the settings or protection applicable to your account."
          }
        ]
      ]
    },
    {
      "id": "example-a-trading-account-approaching-stop-out",
      "title": "Example: A Trading Account Approaching Stop-Out",
      "table": {
        "headers": [
          "Metric",
          "Amount"
        ],
        "rows": [
          [
            "Account equity",
            "$1,500"
          ],
          [
            "Used margin",
            "$1,000"
          ],
          [
            "Margin level",
            "150%"
          ],
          [
            "Margin-call threshold",
            "100%"
          ],
          [
            "Stop-out threshold",
            "50%"
          ]
        ]
      },
      "paragraphs": [
        [
          {
            "text": "The illustrative table starts with USD 1,500 equity and USD 1,000 used margin. At 100% warning and 50% stop-out, thresholds are USD 1,000 and USD 500. A USD 300 additional loss leaves USD 1,200 equity and 120% margin level."
          }
        ],
        [
          {
            "text": "A further USD 300 loss leaves USD 900 equity and a 90% level: below the warning example but above stop-out. Separately entered costs can reduce equity further. These calculations describe the scenario, not what a particular broker will do."
          }
        ]
      ]
    },
    {
      "id": "margin-call-vs-stop-out-what-s-the-difference",
      "title": "Margin Call vs Stop-Out: What's the Difference?",
      "paragraphs": [
        [
          {
            "text": "Margin call generally describes warning or restricted-account conditions; stop-out concerns automatic closure. They are related but distinct. A warning does not establish how much time remains before liquidation. This two-threshold model requires the warning percentage to be at least the stop-out percentage. If a policy uses cash limits, instrument-specific triggers or another structure, do not force it into these fields. Use the actual contractual model."
          }
        ]
      ]
    },
    {
      "id": "why-stop-out-levels-differ-between-brokers",
      "title": "Why Stop-Out Levels Differ Between Brokers",
      "paragraphs": [
        [
          {
            "text": "Companies can use different rules across legal entities, account types and products. "
          },
          {
            "text": "Exness’s account-type documentation",
            "href": "https://get.exness.help/hc/en-us/articles/360014693340-Margin-call-and-stop-out-levels-by-account-type"
          },
          {
            "text": " illustrates why one company name is not enough to select a policy. Check the source’s scope and current applicability."
          }
        ],
        [
          {
            "text": "The referenced-rule fields keep those details beside your result. The tool does not fetch a live broker profile or certify that the documentation covers your residence or account. Verify changes directly before using the percentages for a real position."
          }
        ]
      ]
    },
    {
      "id": "how-leverage-affects-margin-calls",
      "title": "How Leverage Affects Margin Calls",
      "formula": "Required margin = Notional exposure ÷ Leverage",
      "paragraphs": [
        [
          {
            "text": "Under a simple fixed-leverage model, required margin equals notional exposure divided by leverage. USD 50,000 exposure requires USD 1,000 at 1:50 or USD 500 at 1:100. The "
          },
          {
            "text": "forex margin calculator",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": " explains that collateral estimate."
          }
        ],
        [
          {
            "text": "For unchanged equity and exposure, lower used margin raises the margin-level percentage. Higher available leverage still does not make the position safer: larger positions can increase "
          },
          {
            "text": "monetary losses",
            "href": "https://moneysmart.gov.au/complex-investment-products/forex-trading"
          },
          {
            "text": ". Match exposure to a cash-risk budget with the "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": "."
          }
        ]
      ]
    },
    {
      "id": "can-you-calculate-an-exact-stop-out-price",
      "title": "Can You Calculate an Exact Stop-Out Price?",
      "paragraphs": [
        [
          {
            "text": "An account-level equity threshold is not an exact market price. A price model would need each position’s direction, size, entry, contract, currency conversions and costs, plus how required margin changes. Multiple positions and the broker’s closure order add further complexity."
          }
        ],
        [
          {
            "text": "This tool deliberately calculates equity conditions rather than a liquidation price. Use the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " for an individual trade scenario, while checking that any portfolio and margin assumptions remain valid."
          }
        ]
      ]
    },
    {
      "id": "what-happens-when-used-margin-changes",
      "title": "What Happens When Used Margin Changes?",
      "paragraphs": [
        [
          {
            "text": "At USD 2,000 equity, increasing used margin from USD 1,000 to USD 1,500 lowers margin level from 200% to about 133.33%, without an additional loss. The scenario-used-margin field lets you enter another account-level requirement. The sensitivity table also compares 0.75×, 1×, 1.25× and 1.5× current used margin while holding equity fixed. These are illustrative alternatives, not forecasts of broker requirement changes."
          }
        ]
      ]
    },
    {
      "id": "can-depositing-funds-prevent-a-margin-call",
      "title": "Can Depositing Funds Prevent a Margin Call?",
      "paragraphs": [
        [
          {
            "text": "A credited USD 500 deposit raises USD 1,000 equity to USD 1,500 if nothing else changes. At USD 1,000 used margin, the level rises from 100% to 150%. The scenario assumes funds are already credited."
          }
        ],
        [
          {
            "text": "An initiated transfer might arrive after prices change or the broker acts. Additional funding exposes more capital and is not automatically the right response. This calculation illustrates arithmetic, not advice to maintain a losing position."
          }
        ]
      ]
    },
    {
      "id": "how-hedged-positions-affect-margin-level",
      "title": "How Hedged Positions Affect Margin Level",
      "paragraphs": [
        [
          {
            "text": "Opposite positions do not universally eliminate margin. Some accounts use reduced hedged requirements or a larger-leg approach; a netting account may offset an existing position instead of retaining two independent trades."
          }
        ],
        [
          {
            "text": "Enter the platform’s actual total used margin rather than assuming a matching hedge releases every reserved amount. "
          },
          {
            "text": "Official margin calculation documentation",
            "href": "https://www.metatrader5.com/en/terminal/help/trading_advanced/margin_forex"
          },
          {
            "text": " describes why symbol calculation modes and hedging rules matter. This calculator does not reconstruct those portfolio requirements from individual positions."
          }
        ]
      ]
    },
    {
      "id": "why-stop-out-is-not-a-guaranteed-loss-limit",
      "title": "Why Stop-Out Is Not a Guaranteed Loss Limit",
      "paragraphs": [
        [
          {
            "text": "A gap or rapid price move can leave execution beyond a theoretical threshold. Broker negative-balance protections, where applicable, depend on the agreement and eligibility; they do not prevent losing deposited capital."
          }
        ],
        [
          {
            "text": "The tool permits negative-equity scenarios to illustrate arithmetic rather than assuming every account has protection. Include possible holding costs with the "
          },
          {
            "text": "forex swap calculator",
            "href": "/calculators/forex-swap-calculator"
          },
          {
            "text": " and compare planned exits with the "
          },
          {
            "text": "forex risk–reward calculator",
            "href": "/calculators/forex-risk-reward-calculator"
          },
          {
            "text": ". A stop order also remains subject to execution risk."
          }
        ]
      ]
    },
    {
      "id": "common-margin-call-calculation-mistakes",
      "title": "Common Margin Call Calculation Mistakes",
      "paragraphs": [
        [
          {
            "text": "Avoid substituting balance for equity, confusing free margin with withdrawable cash or assuming 50% stop-out means losing half the original deposit. Percentages normally reference used margin. Check the exact entity, threshold definition and changing requirements. Signed distances are not guaranteed risk capacity; the equality selector describes an arithmetic boundary, not execution timing."
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
            "text": "Use the forex margin call calculator to compare equity, used margin and entered thresholds. Model losses and requirement changes without treating the result as an execution promise. Check actual company/account rules and current platform figures before making real decisions."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "What is a margin call in forex?",
      "answer": "A margin call is generally a broker-defined warning or account condition indicating that equity has become low relative to required margin. The exact threshold and consequences vary by broker."
    },
    {
      "question": "How do I calculate forex margin level?",
      "answer": "Divide current account equity by used margin and multiply by 100. When used margin is zero, margin level is undefined rather than infinite under the standard formula."
    },
    {
      "question": "What is the difference between margin call and stop-out?",
      "answer": "A margin call generally warns of insufficient margin or restricts account activity, while stop-out involves automatic position closure under the broker's specified conditions."
    }
  ],
  "slug": "forex-margin-call-calculator",
  "path": "/calculators/forex-margin-call-calculator",
  "kind": "margincall",
  "card": "Check margin level and conditional warning/stop-out equity, with explicit account-rule sources."
};
