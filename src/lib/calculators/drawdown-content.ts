import type { CalculatorDefinition } from "./catalog";
export const drawdownDefinition: CalculatorDefinition = {
  "keyword": "forex drawdown calculator",
  "title": "Forex Drawdown Calculator – Maximum Loss & Recovery",
  "description": "Forex drawdown calculator: analyze account equity or balance, running peaks, maximum losses and recovery. Compare raw values with stated cash-flow adjustments.",
  "heading": "Forex Drawdown Calculator",
  "intro": "A forex drawdown calculator measures how much a trading account has declined from an earlier peak. It can calculate current drawdown, maximum drawdown, monetary losses, and the percentage gain needed to recover. For example, if an account increases to $12,000 and later declines to $9,000, the drawdown from its peak is 25%. That is different from measuring the account against its original balance. A trader who started with $10,000 and now has $9,000 is down 10% from the starting amount, even though the peak-to-trough drawdown is 25%. Use the calculator above to analyze those differences and understand the recovery required.",
  "quickAnswer": "Drawdown = (running peak − current value) ÷ running peak × 100. A fall from USD 10,000 to USD 8,000 is 20%; recovering from USD 8,000 to USD 10,000 needs a 25% gain. Maximum drawdown requires the complete ordered series, not just the start and finish. Keep equity separate from balance and withdrawals separate from trading losses. At zero or negative remaining value, conventional finite percentage recovery is undefined; no future recovery date is inferred.",
  "steps": [
    "Choose ordered history or an earlier-peak/current-value snapshot.",
    "Select equity or balance and keep every value in the same account currency.",
    "Paste observations or read a compatible CSV locally; dates must already be increasing.",
    "Confirm no external flows, choose explicit raw account values, or provide flows for the stated end-of-interval adjustment.",
    "Inspect maximum percentage and money/point declines separately, current recovery and observed episode dates."
  ],
  "sections": [
    {
      "id": "what-is-drawdown-in-forex-trading",
      "title": "What Is Drawdown in Forex Trading?",
      "paragraphs": [
        [
          {
            "text": "Drawdown measures decline from a running high. An account going from USD 10,000 to 15,000, down to 9,000 and ending at 16,000 still experienced a 40% peak-to-trough loss despite finishing ahead. The metric describes the supplied path, not future loss. Missing observations and inconsistent definitions can distort comparisons."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-forex-drawdown-calculator",
      "title": "How to Use the Forex Drawdown Calculator",
      "paragraphs": [
        [
          {
            "text": "Snapshot mode accepts an earlier peak and current value, with optional initial capital. It calculates current decline and recovery, but cannot determine historical maximum drawdown. A current value above the earlier peak becomes the new running reference."
          }
        ],
        [
          {
            "text": "History mode accepts two to 1,000 ordered observations and a local CSV up to 64 KiB. Select equity or balance and an explicit cash-flow method. Dates are optional, but mixed, duplicate or unordered dates reject. The chart and summary use every observation; the calculation table shows the first fifty for large histories."
          }
        ]
      ]
    },
    {
      "id": "current-drawdown-vs-maximum-drawdown",
      "title": "Current Drawdown vs Maximum Drawdown",
      "paragraphs": [
        [
          {
            "text": "Current drawdown compares the latest value with its running peak; maximum drawdown finds the deepest earlier decline. For USD 10,000 → 12,000 → 9,000 → 11,000 → 13,000, maximum drawdown is 25% while final current drawdown is zero. Two endpoints cannot reveal the intervening loss."
          }
        ]
      ]
    },
    {
      "id": "maximum-drawdown-formula-explained",
      "title": "Maximum Drawdown Formula Explained",
      "table": {
        "headers": [
          "Observation",
          "Equity",
          "Running peak",
          "Drawdown"
        ],
        "rows": [
          [
            "1",
            "$10,000",
            "$10,000",
            "0%"
          ],
          [
            "2",
            "$12,000",
            "$12,000",
            "0%"
          ],
          [
            "3",
            "$10,800",
            "$12,000",
            "10%"
          ],
          [
            "4",
            "$9,000",
            "$12,000",
            "25%"
          ],
          [
            "5",
            "$11,500",
            "$12,000",
            "4.17%"
          ],
          [
            "6",
            "$13,000",
            "$13,000",
            "0%"
          ]
        ]
      },
      "formula": "Drawdown at time t = (Running peak − Equity at time t) ÷ Running peak × 100",
      "paragraphs": [
        [
          {
            "text": "Update the running peak at each ordered observation, then calculate (peak − value) ÷ peak × 100. The largest percentage across the sequence is maximum percentage drawdown. The table follows the default illustrative history."
          }
        ],
        [
          {
            "text": "The deepest percentage episode reaches USD 9,000 after a USD 12,000 peak, producing 25%. It recovers within these supplied observations at USD 13,000. No unseen intraday path is reconstructed. Lines connect the entered points, with dated gaps spaced proportionally to calendar time."
          }
        ]
      ]
    },
    {
      "id": "drawdown-from-initial-capital-vs-peak-equity",
      "title": "Drawdown From Initial Capital vs Peak Equity",
      "paragraphs": [
        [
          {
            "text": "Starting capital and a running peak answer different questions. An account starting at USD 10,000, reaching USD 14,000 and falling to USD 11,000 remains 10% above its start. It is also about 21.43% below the USD 14,000 peak."
          }
        ],
        [
          {
            "text": "The history output labels change from the first supplied observation; that observation is not necessarily the account’s original deposit. Snapshot mode can include a separately known initial amount. Be clear about the period and reference before comparing reports."
          }
        ]
      ]
    },
    {
      "id": "example-a-30-forex-drawdown",
      "title": "Example: A 30% Forex Drawdown",
      "paragraphs": [
        [
          {
            "text": "A USD 20,000 peak falling to USD 14,000 loses USD 6,000, or 30%. Regaining USD 6,000 from the smaller USD 14,000 base needs about 42.86%, not 30%."
          }
        ],
        [
          {
            "text": "The recovery formula is (peak ÷ current − 1) × 100 for positive remaining value. Zero or negative account value has no conventional finite percentage-growth recovery calculation. That mathematical limit is not a forecast about transfers, open positions or future trading outcomes."
          }
        ]
      ]
    },
    {
      "id": "drawdown-recovery-percentage-chart",
      "title": "Drawdown Recovery Percentage Chart",
      "table": {
        "headers": [
          "Drawdown",
          "Gain needed to recover"
        ],
        "rows": [
          [
            "5%",
            "5.26%"
          ],
          [
            "10%",
            "11.11%"
          ],
          [
            "20%",
            "25%"
          ],
          [
            "30%",
            "42.86%"
          ],
          [
            "40%",
            "66.67%"
          ],
          [
            "50%",
            "100%"
          ],
          [
            "60%",
            "150%"
          ],
          [
            "75%",
            "300%"
          ]
        ]
      },
      "paragraphs": [
        [
          {
            "text": "Losses and recovery gains are asymmetric because the denominator changes. The table assumes a positive remaining value and no new transfers, costs or other adjustments during recovery."
          }
        ],
        [
          {
            "text": "A 50% loss leaves half the peak, requiring a 100% gain to regain it. Larger mathematical recovery figures are not realistic-return promises or suggestions to increase leverage. The calculator does not assign a date or probability to achieving them."
          }
        ]
      ]
    },
    {
      "id": "balance-drawdown-vs-equity-drawdown",
      "title": "Balance Drawdown vs Equity Drawdown",
      "paragraphs": [
        [
          {
            "text": "Balance generally reflects posted transactions; equity also reflects floating P&L under the account’s conventions. A balance of USD 10,000 with USD 2,000 floating loss can have approximately USD 8,000 equity: a 20% equity decline from a USD 10,000 reference while balance appears unchanged."
          }
        ],
        [
          {
            "text": "Choose the correct series definition. Named CSV equity/balance columns are checked against it; a file import selects its explicitly labelled type. Daily snapshots can still miss deeper intraday losses. The tool does not infer unrecorded floating values."
          }
        ]
      ]
    },
    {
      "id": "absolute-drawdown-relative-drawdown-and-maximum-drawdown",
      "title": "Absolute Drawdown, Relative Drawdown, and Maximum Drawdown",
      "paragraphs": [
        [
          {
            "text": "Platform report definitions can differ. "
          },
          {
            "text": "MetaTrader’s testing-report documentation",
            "href": "https://www.metatrader5.com/en/terminal/help/algotrading/testing_report"
          },
          {
            "text": " distinguishes absolute, maximal and relative drawdown. Maximum money decline and maximum percentage decline may identify different episodes."
          }
        ],
        [
          {
            "text": "For example, USD 100 → 50 is a 50% decline of USD 50. A later USD 1,000 → 900 decline is only 10%, but loses USD 100. This tool tracks both maxima separately. In adjusted mode, the scaled performance index has points rather than spendable money; raw account-value comparisons remain separately labelled."
          }
        ]
      ]
    },
    {
      "id": "how-deposits-and-withdrawals-affect-drawdown",
      "title": "How Deposits and Withdrawals Affect Drawdown",
      "paragraphs": [
        [
          {
            "text": "A USD 4,000 withdrawal from USD 10,000 leaves USD 6,000 but need not represent a trading loss. Raw values show a 40% account-value decline. Flow-adjusted performance can remain unchanged."
          }
        ],
        [
          {
            "text": "The implemented method assumes every external flow occurs at interval end: pre-flow ending value = ending account value − signed flow. Multiply the previous index by that value divided by previous raw account value. Positive flow is a deposit; negative flow a withdrawal. Every observation needs an explicit flow, including zero. Unknown timing or a zero-capital restart needs a separately defined method."
          }
        ]
      ]
    },
    {
      "id": "why-drawdown-matters-more-than-final-profit-alone",
      "title": "Why Drawdown Matters More Than Final Profit Alone",
      "paragraphs": [
        [
          {
            "text": "Accounts can finish with equal returns while experiencing very different losses and time below peak. Past drawdown is not a future ceiling. The "
          },
          {
            "text": "GIPS standards",
            "href": "https://www.gipsstandards.org/standards/gips-standards-for-firms/"
          },
          {
            "text": " emphasize fair presentation and full disclosure; here value definition, sampling and flow methodology stay explicit so raw balance decline is not mislabelled adjusted performance."
          }
        ]
      ]
    },
    {
      "id": "drawdown-and-forex-position-sizing",
      "title": "Drawdown and Forex Position Sizing",
      "paragraphs": [
        [
          {
            "text": "Under an illustrative fixed-percentage loss model without extra costs, ten 1% losses leave about 90.44% of starting equity; ten 5% losses leave about 59.87%. Those correspond to declines of about 9.56% and 40.13%."
          }
        ],
        [
          {
            "text": "Position-sizing decisions",
            "href": "https://www.cmegroup.com/education/courses/trade-and-risk-management"
          },
          {
            "text": " affect price exposure, but these sequences assume every loss equals the selected percentage. The "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " connects volume to a chosen cash-risk budget. A real stop can slip, and historical account paths can differ from this simple model."
          }
        ]
      ]
    },
    {
      "id": "drawdown-vs-risk-of-ruin",
      "title": "Drawdown vs Risk of Ruin",
      "paragraphs": [
        [
          {
            "text": "Drawdown measures the size of a decline. Risk of ruin estimates how often a selected threshold is reached under specified model assumptions. A 25% historical drawdown is not a 25% probability of ruin."
          }
        ],
        [
          {
            "text": "The "
          },
          {
            "text": "risk-of-ruin calculator",
            "href": "/calculators/forex-risk-of-ruin-calculator"
          },
          {
            "text": " examines simulated threshold events; the present page measures an entered account path. Neither tool converts historical performance into a guarantee about future losses or recovery. Use consistent definitions rather than comparing unrelated percentages as though they measured the same thing."
          }
        ]
      ]
    },
    {
      "id": "how-prop-firm-drawdown-rules-differ",
      "title": "How Prop Firm Drawdown Rules Differ",
      "paragraphs": [
        [
          {
            "text": "A prop-firm daily limit, starting-balance loss floor or trailing threshold is not automatically ordinary maximum drawdown. Rules can depend on reset time, account stage and whether floating P&L counts."
          }
        ],
        [
          {
            "text": "This page does not certify compliance with any firm’s evaluation or payout rules. Read the exact programme terms separately. The "
          },
          {
            "text": "margin call and stop-out calculator",
            "href": "/calculators/forex-margin-call-calculator"
          },
          {
            "text": " also answers a different question: account equity relative to used margin under entered account rules, rather than the deepest decline from a running high."
          }
        ]
      ]
    },
    {
      "id": "drawdown-duration-and-recovery-time",
      "title": "Drawdown Duration and Recovery Time",
      "paragraphs": [
        [
          {
            "text": "For the deepest percentage episode, the tool identifies peak, trough and first later supplied value reaching that earlier peak. Without such an observation, the episode is marked unrecovered; no future date is invented."
          }
        ],
        [
          {
            "text": "Durations use observation intervals, plus calendar days when valid dates are present. The longest observed run below a peak is separate from the deepest decline. Missing intraday observations can hide deeper or differently timed episodes; the chart cannot repair incomplete sampling."
          }
        ]
      ]
    },
    {
      "id": "common-forex-drawdown-calculation-mistakes",
      "title": "Common Forex Drawdown Calculation Mistakes",
      "paragraphs": [
        [
          {
            "text": "Avoid measuring every decline from the original deposit, calculating maximum drawdown from two endpoints or treating withdrawals as trading losses. Recovery after a 20% decline is 25%, not 20%."
          }
        ],
        [
          {
            "text": "Also avoid comparing balance-only data with equity-inclusive data, or calling a scaled adjusted index an account cash balance. The end-flow adjustment is an explicit timing assumption, not a reconstruction of unknown transfers. Negative raw equity can exceed 100% drawdown; percentage recovery is then not conventionally defined."
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
            "text": "Use the forex drawdown calculator for a journal, export or backtest with consistent sampling and cash-flow policy. Compare depth, current decline and duration. The "
          },
          {
            "text": "forex compounding calculator",
            "href": "/tools/forex-compounding-calculator"
          },
          {
            "text": " models growth rather than supplying missing history. Histories remain local; settings links omit financial inputs and require fresh data."
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
            "text": "A useful drawdown analysis explains its reference peaks, value definition, observation order and cash-flow policy. Inspect the deepest episode alongside current decline and recovery arithmetic. Historical results provide context, not a future loss limit or promised return path."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "How do I calculate maximum drawdown in forex?",
      "answer": "Analyze an ordered account-equity series, track the running peak, and calculate each decline from that peak. Maximum drawdown is the largest observed percentage decline."
    },
    {
      "question": "How much gain is needed to recover a 50% drawdown?",
      "answer": "A 100% gain is required to recover to the previous peak, assuming no deposits, withdrawals, or additional adjustments. The account must double from its reduced value."
    },
    {
      "question": "Is drawdown calculated from balance or equity?",
      "answer": "Both measures are possible, but they answer different questions. Equity drawdown includes unrealized changes in open positions, while balance drawdown generally reflects posted account transactions."
    }
  ],
  "slug": "forex-drawdown-calculator",
  "path": "/calculators/forex-drawdown-calculator",
  "kind": "drawdown",
  "card": "Measure ordered peak-to-trough losses, recovery and cash-flow-adjusted versus raw account paths."
};
