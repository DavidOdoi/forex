import type { CalculatorDefinition } from "./catalog";
export const propDrawdownDefinition: CalculatorDefinition = {
  "keyword": "prop firm drawdown calculator",
  "title": "Prop Firm Drawdown Calculator – Daily & Max Loss",
  "description": "Prop firm drawdown calculator: compare daily, static and trailing loss floors, floating P&L, reset timezones and remaining distance under your entered rules.",
  "heading": "Prop Firm Drawdown Calculator",
  "intro": "A prop firm drawdown calculator shows how far your evaluation or funded account sits above its daily and overall loss floors. Enter current balance, floating profit or loss and the exact rules for your programme; the tool separates the two limits and identifies which leaves less room. For example, a hypothetical USD 100,000 account with a USD 5,000 daily allowance and 10% static overall allowance can have different daily and overall boundaries. References, reset times and comparison conditions matter. Start with Custom Rules below: no default numbers are presented as a verified firm profile, and a snapshot cannot prove historical compliance.",
  "quickAnswer": "Static floor = starting value − overall loss allowance. On USD 100,000 with a 10% allowance, the floor is USD 90,000; equity of USD 96,000 leaves USD 6,000 to that boundary. A daily rule subtracts its allowance from its own defined reference. A trailing rule follows eligible highs and may have a floor cap. Compare each monitored metric with its floor: the smallest signed distance is binding. Zero headroom is not a safe trading budget, and a firm can count touching the floor as a breach.",
  "steps": [
    "Choose Custom Rules and copy the exact programme, stage, rule version and source into the optional reference fields.",
    "Enter starting value, current balance, signed floating P&L and only charges not already included.",
    "Select static, EOD balance, intraday balance or intraday equity trailing; choose allowance units, percentage basis, monitored metric and any floor cap.",
    "For a daily rule, enter the actual session reference, date and allowance convention. Confirm the firm timezone, reset time and snapshot time.",
    "Review both floors, their signed distances and the comparison condition. Optional timestamped observations illustrate the overall floor; they cannot certify continuous compliance."
  ],
  "sections": [
    {
      "id": "what-is-drawdown-in-prop-firm-trading",
      "title": "What Is Drawdown in Prop Firm Trading?",
      "paragraphs": [
        [
          {
            "text": "Prop firms can use “drawdown” for a daily loss allowance, a fixed overall floor or a moving threshold. These are rule boundaries, not interchangeable percentages. An account can remain profitable against its starting value while crossing a trailing floor that has followed earlier gains upward."
          }
        ],
        [
          {
            "text": "The separate "
          },
          {
            "text": "Forex Drawdown Calculator",
            "href": "/calculators/forex-drawdown-calculator"
          },
          {
            "text": " measures ordinary peak-to-trough decline from an ordered account history. This page instead compares a snapshot with entered programme rules; it does not infer an account’s complete compliance record."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-prop-firm-drawdown-calculator",
      "title": "How to Use the Prop Firm Drawdown Calculator",
      "paragraphs": [
        [
          {
            "text": "Copy the rule that actually applies to your account, including programme, stage and version. Defaults illustrate Custom Rules, not a verified provider profile. Optional source fields record your reference without endorsing it."
          }
        ],
        [
          {
            "text": "Choose the allowance basis explicitly: 5% of starting capital differs from 5% of a changing daily reference. Balance and equity can also be different monitored metrics. The tool compares each against its own floor before selecting the smaller signed distance."
          }
        ]
      ]
    },
    {
      "id": "static-drawdown-explained",
      "title": "Static Drawdown Explained",
      "paragraphs": [
        [
          {
            "text": "A static rule fixes its floor relative to starting value. Starting at USD 100,000 with a USD 10,000 maximum allowance gives USD 90,000. Growing to USD 106,000 does not move that boundary. At equity of USD 95,000, the distance is USD 5,000."
          }
        ],
        [
          {
            "text": "A separate daily rule may be tighter. Extra distance above a static floor is not a recommended trade size: slippage, gaps and charges can produce losses beyond an intended stop. Use the "
          },
          {
            "text": "forex stop loss calculator",
            "href": "/calculators/forex-stop-loss-calculator"
          },
          {
            "text": " to inspect a separate price-risk scenario."
          }
        ]
      ]
    },
    {
      "id": "what-is-trailing-drawdown",
      "title": "What Is Trailing Drawdown?",
      "paragraphs": [
        [
          {
            "text": "A trailing floor follows eligible new highs. With a USD 5,000 fixed allowance, a USD 100,000 reference gives USD 95,000; an eligible high of USD 103,000 raises it to USD 98,000. It does not move down when value later falls."
          }
        ],
        [
          {
            "text": "A configured cap stops the floor rising beyond a specified amount, such as USD 100,000. Leave it blank for uncapped trailing. The percentage basis is separate: the allowance can be a percentage of starting value or of the eligible high, according to the actual rule."
          }
        ]
      ]
    },
    {
      "id": "end-of-day-vs-intraday-trailing-drawdown",
      "title": "End-of-Day vs Intraday Trailing Drawdown",
      "paragraphs": [
        [
          {
            "text": "An EOD closed-balance rule uses qualifying balance observations at the firm cutoff. An intraday equity rule can respond to an unrealized high; an intraday closed-balance rule responds only to eligible posted balance."
          }
        ],
        [
          {
            "text": "For a USD 100,000 account and USD 5,000 allowance, an intraday equity high of USD 104,000 can lift the floor to USD 99,000. That temporary open profit need not lift an EOD balance floor. Current eligible values update intraday models; EOD mode requires the separately confirmed cutoff high."
          }
        ]
      ]
    },
    {
      "id": "how-daily-drawdown-works",
      "title": "How Daily Drawdown Works",
      "formula": "Daily equity floor = Beginning-of-day balance − Fixed daily loss allowance",
      "paragraphs": [
        [
          {
            "text": "One possible daily formula is beginning-of-session balance minus a fixed allowance. A USD 102,000 balance less USD 5,000 sets a USD 97,000 floor. If touching is a breach, equity exactly there reaches the condition."
          }
        ],
        [
          {
            "text": "Other programmes use beginning equity, starting capital or different percentage bases. Select the documented baseline and enter the actual reference for the current firm session. Stale session dates are rejected. The tool does not substitute your current balance for a missing reset observation."
          }
        ]
      ]
    },
    {
      "id": "example-daily-and-maximum-drawdown-together",
      "title": "Example: Daily and Maximum Drawdown Together",
      "table": {
        "headers": [
          "Metric",
          "Value"
        ],
        "rows": [
          [
            "Starting balance",
            "$100,000"
          ],
          [
            "Daily loss allowance",
            "$5,000"
          ],
          [
            "Static maximum loss allowance",
            "$10,000"
          ],
          [
            "Beginning-of-day balance",
            "$101,000"
          ],
          [
            "Current equity",
            "$98,000"
          ]
        ]
      },
      "paragraphs": [
        [
          {
            "text": "The hypothetical account below uses a beginning-of-day balance baseline, a fixed daily cash allowance and a static overall floor. These are examples rather than provider conditions."
          }
        ],
        [
          {
            "text": "Daily floor is USD 101,000 − USD 5,000 = USD 96,000; overall floor is USD 90,000. Equity of USD 98,000 leaves USD 2,000 daily and USD 8,000 overall. Daily is binding. Where the rules monitor different metrics, compare their separate distances rather than merely selecting the higher floor."
          }
        ]
      ]
    },
    {
      "id": "how-floating-losses-affect-drawdown",
      "title": "How Floating Losses Affect Drawdown",
      "paragraphs": [
        [
          {
            "text": "Balance alone can conceal floating losses. A USD 101,000 balance plus USD −4,000 unrealized P&L gives USD 97,000 equity before other adjustments. That crosses an equity floor of USD 97,500 despite balance exceeding starting capital."
          }
        ],
        [
          {
            "text": "Subtract only charges not already reflected in balance or floating P&L. Check how your platform defines balance, equity and profit, and verify what its export contains. Daily balance snapshots cannot show every intraday equity drop."
          }
        ]
      ]
    },
    {
      "id": "ftmo-drawdown-rules-why-program-selection-matters",
      "title": "FTMO Drawdown Rules: Why Program Selection Matters",
      "paragraphs": [
        [
          {
            "text": "FTMO’s official trading objectives",
            "href": "https://ftmo.com/en/trading-objectives/"
          },
          {
            "text": " separate products and evaluation stages. Their daily allowances, overall mechanisms and reset conventions are not one universal “FTMO drawdown” rule. Read the exact applicable section rather than carrying a percentage across products."
          }
        ],
        [
          {
            "text": "Topstep’s Maximum Loss Limit rules",
            "href": "https://help.topstep.com/en/articles/8284197-trading-combine-parameters"
          },
          {
            "text": " illustrate another programme-specific framework. Its Trading Combine is not a generic forex account. Check the named product, account size, eligible observation and touching/below wording. This calculator deliberately supplies no blanket provider preset; entered references remain user-supplied."
          }
        ]
      ]
    },
    {
      "id": "how-to-calculate-remaining-loss-allowance",
      "title": "How to Calculate Remaining Loss Allowance",
      "formula": "Remaining allowance = Current equity − Applicable equity floor",
      "paragraphs": [
        [
          {
            "text": "For each rule, subtract its floor from the monitored metric. At equity of USD 52,000, a daily floor of USD 50,500 leaves USD 1,500, while an overall floor of USD 48,000 leaves USD 4,000. Daily is binding at USD 1,500."
          }
        ],
        [
          {
            "text": "Negative distance means the selected condition has been crossed. Strict-below comparison leaves equality uncrossed but with no buffer. The result never announces account termination or payout eligibility; those require the firm’s authoritative records and terms."
          }
        ]
      ]
    },
    {
      "id": "how-profits-can-change-a-trailing-limit",
      "title": "How Profits Can Change a Trailing Limit",
      "paragraphs": [
        [
          {
            "text": "With a fixed USD 4,000 uncapped allowance, moving from a USD 100,000 eligible high to USD 105,000 raises the floor from USD 96,000 to USD 101,000. A subsequent USD 100,500 equity can cross it while remaining above initial capital."
          }
        ],
        [
          {
            "text": "Optional timestamped history replays the overall floor from supplied eligible observations. Solid and dashed lines distinguish the monitored value and replayed floor. A separately entered high may cover records absent from that chart; neither view reconstructs unseen trading."
          }
        ]
      ]
    },
    {
      "id": "what-happens-at-the-daily-reset",
      "title": "What Happens at the Daily Reset?",
      "paragraphs": [
        [
          {
            "text": "Use the firm’s IANA timezone and local cutoff, not your device’s midnight. Europe/Prague and America/Chicago can change their UTC offset with daylight saving. The result shows snapshot, latest reset and next reset in UTC."
          }
        ],
        [
          {
            "text": "Ambiguous or nonexistent local timestamps are rejected. Open P&L at reset can matter when balance forms the baseline but equity is monitored afterward. Confirm the actual session reference. The calculator does not reconstruct it from a later snapshot or assume every programme resets identically."
          }
        ]
      ]
    },
    {
      "id": "does-breaching-drawdown-always-close-the-account",
      "title": "Does Breaching Drawdown Always Close the Account?",
      "paragraphs": [
        [
          {
            "text": "Consequences vary by programme and stage. A mathematical threshold condition does not itself establish account closure, challenge failure or payout refusal. The interface reports only the condition under entered assumptions."
          }
        ],
        [
          {
            "text": "Choose at-or-below or strictly-below to match the written rule. At equality, the distinction changes the condition while leaving zero buffer in either case. Use the official account dashboard for status and contact the provider when its recorded values differ."
          }
        ]
      ]
    },
    {
      "id": "common-prop-firm-drawdown-mistakes",
      "title": "Common Prop Firm Drawdown Mistakes",
      "paragraphs": [
        [
          {
            "text": "Avoid using a familiar 5%/10% combination without checking its programme, ignoring floating losses or treating a historical peak as an eligible reference. A daily limit, static floor and trailing rule answer different questions."
          }
        ],
        [
          {
            "text": "Other errors include using local midnight, double-counting fees, overlooking a cap and reusing an old reset value. Payouts, deposits and adjustments need their documented treatment; the calculator does not infer it. Sparse observations cannot establish compliance with continuously monitored rules."
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
            "text": "Use the signed distances to understand entered boundaries, not as a suggested loss budget. Confirm the reference values, metric, rule version and reset schedule. For other planning questions, the "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " connects volume to cash risk, while the "
          },
          {
            "text": "margin call calculator",
            "href": "/calculators/forex-margin-call-calculator"
          },
          {
            "text": " checks equity against entered used-margin thresholds. Neither substitutes for a prop firm’s dashboard."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "What is the difference between static and trailing drawdown?",
      "answer": "Static drawdown uses a fixed loss floor, while trailing drawdown moves the floor upward when the account reaches eligible new highs. The exact trailing method depends on the firm's rules."
    },
    {
      "question": "Do floating losses count toward prop firm drawdown?",
      "answer": "They can. Many programs monitor account equity, which includes unrealized P&L. Check whether your specific firm uses equity, balance, or another metric."
    },
    {
      "question": "Can I breach a prop firm drawdown limit while still in profit?",
      "answer": "Yes. A trailing loss floor can move above the initial account value. A subsequent decline may breach that floor even when equity remains above starting capital."
    }
  ],
  "slug": "prop-firm-drawdown-calculator",
  "path": "/calculators/prop-firm-drawdown-calculator",
  "kind": "propdrawdown",
  "card": "Check daily and overall floors under explicit custom static or trailing loss rules."
};
