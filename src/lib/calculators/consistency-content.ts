import type { CalculatorDefinition } from "./catalog";
export const consistencyDefinition: CalculatorDefinition = {
  "keyword": "prop firm consistency calculator",
  "title": "Prop Firm Consistency Calculator – Best Day Rule",
  "description": "Prop firm consistency calculator: check best-day shares, payout windows, fixed or adjusted targets and extra net profit under clearly labelled custom rules.",
  "heading": "Prop Firm Consistency Calculator",
  "intro": "A prop firm consistency calculator checks how much one profitable day contributes to the profit measure specified by your programme. Enter your eligible net profit and largest winning day, or use a dated daily-results history with a defined payout window. A USD 800 best day divided by USD 4,000 net profit is 20%; that meets an inclusive 20% ratio rule, but does not approve a payout. The tool below separates current-profit ratios from fixed and adjusted target formulas. It also distinguishes a period-reset best day from a retained historical record, without assuming that every provider uses the same policy.",
  "quickAnswer": "For a common net-profit ratio, consistency = largest positive eligible day ÷ total eligible net profit × 100. A USD 1,000 best day gives 20% at USD 5,000 net profit, but 25% at USD 4,000. Required total under an unchanged-best-day assumption = best day ÷ allowed fraction. At 30%, a USD 900 best day requires USD 3,000 total; USD 2,500 current profit leaves USD 500. A new record day, loss or payout reset changes that estimate. Fixed-target and adjusted-target programmes need their separate modes.",
  "steps": [
    "Choose the formula in your exact programme: current net-profit ratio, fixed-target share or a target raised for an oversized day.",
    "Enter the allowed percentage and its inclusive or strict boundary. Default figures illustrate a custom rule, not a provider preset.",
    "Supply net period profit and its largest positive day, or select a dated daily-P&L history with explicit window dates.",
    "Choose period reset or retained best-day persistence. Include any earlier eligible record only when the actual programme requires it.",
    "Read the share condition, required total and separate target check. Neither the percentage nor the additional-profit figure approves a payout."
  ],
  "sections": [
    {
      "id": "what-is-a-prop-firm-consistency-rule",
      "title": "What Is a Prop Firm Consistency Rule?",
      "paragraphs": [
        [
          {
            "text": "A consistency rule limits profit concentration under a specified account policy. It can measure one day against evaluation profit, a payout cycle or a target. Some programmes instead assess individual trades; this calculator does not treat those as daily rules."
          }
        ],
        [
          {
            "text": "A positive return can still exceed a concentration limit. Conversely, meeting the selected percentage says nothing about drawdown, strategy permissions, identity checks or payout timing. The result reports one numerical condition, never an approved payout."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-consistency-calculator",
      "title": "How to Use the Consistency Calculator",
      "paragraphs": [
        [
          {
            "text": "Start with the exact product, stage and current rule. Select its formula and boundary, then enter compatible net totals or dated daily results. The defaults are custom examples; no firm profile is selected automatically."
          }
        ],
        [
          {
            "text": "History mode sums the selected window, including negative days, and finds its largest positive session. Dates must already follow the firm’s timezone and cutoff. A prior best day changes the numerator only when retained-best mode is selected; prior-cycle profit is not silently included in the current denominator."
          }
        ]
      ]
    },
    {
      "id": "how-to-calculate-the-largest-winning-day-percentage",
      "title": "How to Calculate the Largest Winning Day Percentage",
      "table": {
        "headers": [
          "Day",
          "Net P&L"
        ],
        "rows": [
          [
            "Monday",
            "+$400"
          ],
          [
            "Tuesday",
            "+$800"
          ],
          [
            "Wednesday",
            "−$200"
          ],
          [
            "Thursday",
            "+$600"
          ],
          [
            "Friday",
            "+$400"
          ]
        ]
      },
      "paragraphs": [
        [
          {
            "text": "The daily results below total USD 2,000, including Wednesday’s USD 200 loss. The largest positive day is USD 800, so its share is 40%. An inclusive 40% rule meets equality; a strict-below 40% rule does not."
          }
        ],
        [
          {
            "text": "Ignoring the losing day would overstate eligible profit and understate concentration. Use net amounts after the programme’s required commissions and adjustments. The "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " answers a separate trade-fill question; it cannot supply missing daily account records."
          }
        ]
      ]
    },
    {
      "id": "what-does-the-20-consistency-rule-mean",
      "title": "What Does the 20% Consistency Rule Mean?",
      "formula": "Required total profit = Best day ÷ 0.20",
      "paragraphs": [
        [
          {
            "text": "A 20% ratio limit makes the largest positive day at most one-fifth of eligible net profit. With an unchanged USD 500 best day, required total is USD 500 ÷ 0.20 = USD 2,500. At USD 2,000 current profit, the mathematical difference is USD 500."
          }
        ],
        [
          {
            "text": "That estimate assumes further profit qualifies for the same window without increasing the best day. It is not a reason to take more risk. The actual account can incur losses or cross another rule before reaching that amount."
          }
        ]
      ]
    },
    {
      "id": "example-a-30-consistency-rule",
      "title": "Example: A 30% Consistency Rule",
      "paragraphs": [
        [
          {
            "text": "A USD 900 best day divided by USD 2,500 eligible net profit equals 36%. At a 30% inclusive limit, required total is USD 900 ÷ 0.30 = USD 3,000, leaving USD 500."
          }
        ],
        [
          {
            "text": "If further profit creates a new best day, the requirement changes. Results update immediately when you change the totals or add daily observations. Required money rounds upward to the account currency’s minor unit; the condition itself uses unrounded arithmetic rather than a displayed rounded percentage."
          }
        ]
      ]
    },
    {
      "id": "topstep-consistency-rules-an-important-distinction",
      "title": "Topstep Consistency Rules: An Important Distinction",
      "paragraphs": [
        [
          {
            "text": "Topstep’s official consistency rules",
            "href": "https://help.topstep.com/en/articles/8284208-consistency-at-topstep"
          },
          {
            "text": " distinguish the Trading Combine’s 55% target from the Express Funded Account Consistency path’s 40% objective. The former can increase the evaluation target after an oversized day; the latter compares largest single-day net profit with total net profit for payout purposes."
          }
        ],
        [
          {
            "text": "These are product-specific conditions, not universal forex standards. Other requirements remain separate. Choose a custom method only after matching its denominator and stage to the current documentation; this tool does not auto-enforce Topstep’s trading-day requirements or certify its account status."
          }
        ]
      ]
    },
    {
      "id": "how-losing-days-affect-consistency",
      "title": "How Losing Days Affect Consistency",
      "paragraphs": [
        [
          {
            "text": "With a USD 1,000 best day and USD 5,000 net profit, the ratio is 20%. A later USD 1,000 loss reduces net profit to USD 4,000 while leaving the best day unchanged. The share rises to 25%."
          }
        ],
        [
          {
            "text": "Thus concentration can worsen without a new winning record. Include all required charges and losses in the correct window. A maximum daily-loss rule measures a different thing: use the "
          },
          {
            "text": "prop firm drawdown calculator",
            "href": "/calculators/prop-firm-drawdown-calculator"
          },
          {
            "text": " to inspect entered equity floors rather than interpreting this percentage as a loss allowance."
          }
        ]
      ]
    },
    {
      "id": "what-if-total-profit-is-zero-or-negative",
      "title": "What If Total Profit Is Zero or Negative?",
      "paragraphs": [
        [
          {
            "text": "The current-net-profit ratio needs a positive denominator and an eligible positive day. With zero or negative net profit, the tool reports the ratio unavailable rather than displaying Infinity, a negative consistency score or a false pass."
          }
        ],
        [
          {
            "text": "A fixed target is a different denominator and can still describe the day-to-target share. Its separate target-attainment check can remain unmet. These quantities are labelled separately so a positive-looking percentage cannot conceal a losing period or an unreached profit objective."
          }
        ]
      ]
    },
    {
      "id": "how-much-additional-profit-is-needed",
      "title": "How Much Additional Profit Is Needed?",
      "formula": "Required total profit = Largest day ÷ Allowed consistency fraction",
      "paragraphs": [
        [
          {
            "text": "For an unchanged-best-day ratio, required total = best day ÷ allowed fraction. Additional net profit = max(0, required total − current total). At USD 1,200 best day, USD 4,000 net profit and 25%, required total is USD 4,800; the difference is USD 800."
          }
        ],
        [
          {
            "text": "The inclusive monetary requirement rounds up. A strict-below rule needs a further currency minor unit when exactly at the boundary. Future losses, a record day or a different window invalidate a frozen requirement. The tool never calls the shortfall guaranteed or achievable."
          }
        ]
      ]
    },
    {
      "id": "consistency-rules-based-on-profit-targets",
      "title": "Consistency Rules Based on Profit Targets",
      "paragraphs": [
        [
          {
            "text": "A fixed USD 3,000 target with a 55% share permits a best day of USD 1,650 under an inclusive boundary. This compares the day with a target, not today’s accumulated profit."
          }
        ],
        [
          {
            "text": "Fixed-target mode leaves that denominator unchanged: more current profit alone cannot repair an oversized day. Adjusted-target mode instead sets required qualifying profit to the larger of the base target and the best-day requirement. It reports target attainment separately from the share condition. Neither model should be applied unless the programme actually uses it."
          }
        ]
      ]
    },
    {
      "id": "consistency-after-a-payout",
      "title": "Consistency After a Payout",
      "paragraphs": [
        [
          {
            "text": "Under a reset model, the new window’s best day excludes earlier periods. Under a retained-best model, an earlier record can remain the numerator even though only current-cycle net profit forms the denominator. A new record updates that benchmark."
          }
        ],
        [
          {
            "text": "FundedNext’s perpetual consistency rule",
            "href": "https://help.fundednext.com/en/articles/16847903-what-is-the-perpetual-consistency-rule-and-how-does-it-work"
          },
          {
            "text": " describes this arrangement for its specified Futures FNL:003 50K Instant Account. It is not a statement about every FundedNext account. The tool’s custom persistence option models this distinction; payout deductions, eligibility dates and different cumulative denominators still require the current product terms."
          }
        ]
      ]
    },
    {
      "id": "daily-profit-vs-individual-trade-profit",
      "title": "Daily Profit vs Individual Trade Profit",
      "paragraphs": [
        [
          {
            "text": "Three eligible trades earning USD 300, USD 200 and USD 100 produce a USD 600 day before any missing charges. A daily rule evaluates the session total, not the USD 300 largest trade."
          }
        ],
        [
          {
            "text": "This tool accepts already aggregated daily net results; it does not group individual trade timestamps or convert local dates into firm sessions. Keep one unique, increasing date per session. Account identifiers and other CSV columns are discarded during local file import, and financial inputs are excluded from settings links."
          }
        ]
      ]
    },
    {
      "id": "why-consistency-rules-matter-for-payout-planning",
      "title": "Why Consistency Rules Matter for Payout Planning",
      "paragraphs": [
        [
          {
            "text": "Reaching an account profit target need not satisfy its concentration condition. Passing concentration also need not satisfy minimum days, drawdown, prohibited-strategy rules or identity checks. The tool deliberately marks these checks as unverified rather than presenting a completed eligibility checklist."
          }
        ],
        [
          {
            "text": "Read the account agreement and official dashboard before making a decision. For automation-specific restrictions, compare "
          },
          {
            "text": "forex prop firms that allow EAs",
            "href": "/best-prop-firm-forex-eas"
          },
          {
            "text": ". A calculator can explain the selected arithmetic; it cannot approve the provider’s payout process."
          }
        ]
      ]
    },
    {
      "id": "common-consistency-calculator-mistakes",
      "title": "Common Consistency Calculator Mistakes",
      "paragraphs": [
        [
          {
            "text": "Avoid dividing by gross winning trades, ignoring losing days or mixing payout cycles. A 20% best-day rule is not a 20% daily account-loss limit. A Trading Combine target formula is not automatically a funded payout formula."
          }
        ],
        [
          {
            "text": "Do not assume same-day profit can always dilute an oversized day: it may increase the numerator too. The "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " and "
          },
          {
            "text": "ordinary drawdown calculator",
            "href": "/calculators/forex-drawdown-calculator"
          },
          {
            "text": " address separate risk questions. They help keep concentration, exposure and historical losses distinct rather than treating one ratio as a complete plan."
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
            "text": "Match the formula, boundary, session definition and eligible window before interpreting the result. Review the required total alongside its unchanged-best-day assumption. Use official rules and account records for decisions, and keep private histories local instead of putting them into shareable URLs."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "How do you calculate a 20% prop firm consistency rule?",
      "answer": "Under a largest-day-to-total-profit model, divide the largest positive eligible trading day by total eligible net profit and multiply by 100. The result must not exceed 20%."
    },
    {
      "question": "Does a losing day affect the consistency percentage?",
      "answer": "Usually yes when the denominator is net profit. A losing day reduces total profit while the largest winning day remains unchanged, potentially increasing the percentage."
    },
    {
      "question": "Does every prop firm use the same consistency rule?",
      "answer": "No. Rules vary by firm, program, account stage, and payout window. Some use different percentages or target-based methods, and some do not impose this type of rule at all."
    }
  ],
  "slug": "prop-firm-consistency-calculator",
  "path": "/calculators/prop-firm-consistency-calculator",
  "kind": "consistency",
  "card": "Check best-day concentration, payout windows and distinct ratio or target-based rules."
};
