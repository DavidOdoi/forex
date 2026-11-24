import type { CalculatorDefinition } from "./catalog";
export const swapDefinition: CalculatorDefinition = {
  "slug": "forex-swap-calculator",
  "path": "/calculators/forex-swap-calculator",
  "kind": "swap",
  "keyword": "forex swap calculator",
  "title": "Forex Swap Calculator – Overnight & Rollover Fees",
  "heading": "Forex Swap Calculator",
  "description": "Forex swap calculator: estimate overnight charges or credits from signed broker rates, rollover dates, triple-day schedules, rate units and account conversion.",
  "card": "Estimate financing with signed rates, rollover schedules and dated overrides.",
  "intro": "A forex swap calculator helps estimate how much you may pay or receive when holding a currency trade overnight. Also called rollover financing, swap can affect the profitability of positions held for several days or weeks. Enter your currency pair, position direction, lot size, broker swap rate, and holding period to estimate the total financing adjustment. For example, if your position incurs a $6 charge per normal rollover and crosses one normal rollover plus one triple-swap rollover, its estimated financing cost would be $24. The calculator above helps you understand those costs before planning an overnight position.",
  "quickAnswer": "Match the broker’s rate unit first. For a point-denominated quote, multiply signed points by point size, base units and the financing-day multiplier. At −6 points, point size 0.00001 and 100,000 EUR/USD units, an ordinary event costs USD 6; one ordinary plus one triple event costs USD 24. Pips, money-per-lot and annual-percent quotes use different conventions. Calendar nights do not automatically equal financing days. Enter the actual long or short rate, cutoff timezone and instrument schedule; the starting values are illustrations, and rates are held constant.",
  "steps": [
    "Select the pair, direction and volume. Enter the current signed rate from the correct symbol/account specification; direction changes clear the rate for rechecking.",
    "Choose points, pips, money per configured lot or the documented simple annual convention. Check point size, charging currency and any notional/day-count assumptions.",
    "Use manual normal/triple counts, or select local opening and closing times, rollover timezone, cutoff and triple day. Add dated overrides for verified exceptions.",
    "Supply a currency conversion if required. Read the ordinary adjustment, event timeline, total debit or credit and data limitations before adding financing to a trade plan."
  ],
  "sections": [
    {
      "id": "what-is-swap-in-forex-trading",
      "title": "What Is Swap in Forex Trading?",
      "paragraphs": [
        [
          {
            "text": "Forex swap is a financing adjustment when a position crosses the broker’s specified rollover. It can be a debit or credit. Broker markups and account rules mean the difference between two central-bank interest rates does not establish the charge. Both trade directions can carry negative rates."
          }
        ],
        [
          {
            "text": "Exposure matters too: "
          },
          {
            "text": "two lots",
            "href": "/calculators/forex-lot-size-converter"
          },
          {
            "text": " generally incur twice the adjustment of one lot under an unchanged per-lot schedule. Financing is separate from spread and transaction commission. The calculator uses your signed manual rate, not a live broker feed."
          }
        ]
      ]
    },
    {
      "id": "how-to-calculate-forex-swap-using-points",
      "title": "Forex swap calculator: points, pips and rate units",
      "paragraphs": [
        [
          {
            "text": "Some trading platforms express swaps in points."
          }
        ],
        [
          {
            "text": "Suppose a broker publishes a swap-long value of −6 points for EUR/USD."
          }
        ],
        [
          {
            "text": "Assume the point size is 0.00001 and the position is one conventional standard lot of 100,000 EUR."
          }
        ],
        [
          {
            "text": "The value of one point is:"
          }
        ],
        [
          {
            "text": "100,000 × 0.00001 = $1."
          }
        ],
        [
          {
            "text": "Therefore, six negative points represent a $6 charge for one ordinary rollover."
          }
        ],
        [
          {
            "text": "The calculation is:"
          }
        ],
        [
          {
            "text": "−6 × $1 = −$6."
          }
        ],
        [
          {
            "text": "If the position size were 0.50 lots, the equivalent charge would be −$3 under the same conditions."
          }
        ],
        [
          {
            "text": "The point size is important. Many forex platforms quote fractional pips, so the broker's point may be "
          },
          {
            "text": "one-tenth of a conventional pip",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": "."
          }
        ],
        [
          {
            "text": "Applying a pip-sized multiplier to a point-denominated swap rate could overstate the charge by a factor of ten."
          }
        ],
        [
          {
            "text": "Check the configured point size rather than inferring it from the swap number."
          }
        ]
      ],
      "table": {
        "headers": [
          "Illustrative input",
          "Ordinary adjustment, one 100,000-unit EUR/USD lot"
        ],
        "rows": [
          [
            "−6 points, point size 0.00001",
            "USD −6"
          ],
          [
            "−0.6 pips, pip size 0.0001",
            "USD −6"
          ],
          [
            "USD −6 per configured lot",
            "USD −6"
          ]
        ]
      }
    },
    {
      "id": "example-a-forex-position-held-for-multiple-nights",
      "title": "Example: A Forex Position Held for Multiple Nights",
      "paragraphs": [
        [
          {
            "text": "Suppose you buy one standard lot of EUR/USD, and your broker's ordinary overnight financing adjustment is −$6."
          }
        ],
        [
          {
            "text": "You hold the position across three ordinary rollovers."
          }
        ],
        [
          {
            "text": "The estimated total charge is:"
          }
        ],
        [
          {
            "text": "3 × −$6 = −$18."
          }
        ],
        [
          {
            "text": "Now consider a different holding period involving one ordinary rollover and one triple-swap rollover."
          }
        ],
        [
          {
            "text": "The total financing-day multiplier is four."
          }
        ],
        [
          {
            "text": "One ordinary rollover contributes −$6, while the triple rollover contributes −$18."
          }
        ],
        [
          {
            "text": "The combined adjustment is −$24."
          }
        ],
        [
          {
            "text": "This does not mean every two-night holding period incurs four financing days."
          }
        ],
        [
          {
            "text": "The relevant rollover events depend on the specific dates, instrument, broker schedule, and holidays."
          }
        ],
        [
          {
            "text": "A date-based calculator is more useful than simply multiplying calendar nights by a fixed amount because it can identify the rollovers actually crossed."
          }
        ]
      ]
    },
    {
      "id": "what-is-triple-swap-in-forex",
      "title": "What Is Triple Swap in Forex?",
      "paragraphs": [
        [
          {
            "text": "Many forex brokers apply a larger financing adjustment on one weekday to account for settlement over the weekend."
          }
        ],
        [
          {
            "text": "For many conventional spot forex instruments, Wednesday is the standard triple-swap day."
          }
        ],
        [
          {
            "text": "However, the schedule is not universal."
          }
        ],
        [
          {
            "text": "Instrument-specific exceptions exist, and schedules for non-forex products can differ. Check the actual symbol and account documents rather than extending a general weekday rule to every position."
          }
        ],
        [
          {
            "text": "This matters when calculating the cost of holding a position for several days."
          }
        ],
        [
          {
            "text": "A generic calculator that always multiplies Wednesday by three can produce incorrect results for instruments using another schedule."
          }
        ],
        [
          {
            "text": "Select the triple day manually; no verified broker profile or holiday feed is connected."
          }
        ],
        [
          {
            "text": "Use a dated multiplier override for a confirmed holiday adjustment; zero skips that date."
          }
        ],
        [
          {
            "text": "Triple swap is not necessarily an additional broker penalty. It is part of the instrument's financing schedule."
          }
        ]
      ]
    },
    {
      "id": "swap-long-vs-swap-short",
      "title": "Swap Long vs Swap Short",
      "paragraphs": [
        [
          {
            "text": "Brokers normally publish separate values for long and short positions."
          }
        ],
        [
          {
            "text": "A long position means buying the currency pair, while a short position means selling it."
          }
        ],
        [
          {
            "text": "The financing adjustment can differ substantially between the two directions."
          }
        ],
        [
          {
            "text": "Suppose a hypothetical broker charges −0.6 pips on a buy position and −0.2 pips on a sell position."
          }
        ],
        [
          {
            "text": "For one standard EUR/USD lot, those rates correspond to −$6 and −$2 per ordinary rollover."
          }
        ],
        [
          {
            "text": "Both directions incur charges in this example."
          }
        ],
        [
          {
            "text": "That is possible because the broker's pricing and financing adjustments can affect both sides."
          }
        ],
        [
          {
            "text": "A positive long rate does not imply an equally negative short rate."
          }
        ],
        [
          {
            "text": "Changing direction clears the rate input so that a long rate is not silently reused for a short."
          }
        ]
      ]
    },
    {
      "id": "what-is-positive-swap-in-forex",
      "title": "What Is Positive Swap in Forex?",
      "paragraphs": [
        [
          {
            "text": "Positive swap is a financing credit, not guaranteed income. At a hypothetical USD 5 per ordinary event, two events produce USD 10 if the rate stays constant. An adverse price movement can exceed that credit. "
          },
          {
            "text": "Leverage",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": ", execution costs and changing financing conditions still affect the position."
          }
        ]
      ]
    },
    {
      "id": "how-swap-affects-forex-trading-profit",
      "title": "How Swap Affects Forex Trading Profit",
      "paragraphs": [
        [
          {
            "text": "Swap influences the final result of a trade that crosses the relevant rollover events."
          }
        ],
        [
          {
            "text": "Suppose a trader closes a position with $100 of gross price profit."
          }
        ],
        [
          {
            "text": "If the position incurred $18 in financing charges and $7 in commissions, the net result becomes $75, assuming those costs have not already been incorporated elsewhere."
          }
        ],
        [
          {
            "text": "If the trade instead received $10 in financing credits, the net result would be $103 after the $7 commission."
          }
        ],
        [
          {
            "text": "That difference illustrates why traders holding positions for multiple nights should consider financing before evaluating a strategy's historical profitability."
          }
        ],
        [
          {
            "text": "Short-term strategies that close before rollover may avoid overnight financing adjustments, although they still face spreads and other trading costs."
          }
        ],
        [
          {
            "text": "Use the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " to combine price P&L with the entered signed financing adjustment."
          }
        ],
        [
          {
            "text": "The "
          },
          {
            "text": "forex break-even calculator",
            "href": "/calculators/forex-break-even-calculator"
          },
          {
            "text": " shows how accrued swap changes the cost-recovery exit."
          }
        ]
      ]
    },
    {
      "id": "where-to-find-your-broker-s-swap-rates",
      "title": "Where to Find Your Broker's Swap Rates",
      "paragraphs": [
        [
          {
            "text": "Start with the broker’s current "
          },
          {
            "text": "symbol specification",
            "href": "https://www.mql5.com/en/docs/constants/environment_state/marketinfoconstants"
          },
          {
            "text": ". On MetaTrader, inspect symbol details for long and short rates, calculation type and contract settings. Confirm the unit, charging currency, ordinary cutoff, triple day, account entity and any holiday schedule. Record when you obtained the rate."
          }
        ],
        [
          {
            "text": "For annual mode, this tool uses simple quote-currency notional × signed annual percentage ÷ 360 or 365. Choose the documented denominator and enter a reference price; both are held constant. This convention does not reproduce every broker’s markup, revaluation or alternative notional basis."
          }
        ]
      ]
    },
    {
      "id": "forex-swap-vs-spread-and-commission",
      "title": "Forex Swap vs Spread and Commission",
      "paragraphs": [
        [
          {
            "text": "Spread is the bid/ask difference, commission is a separate transaction charge, and swap relates to holding across rollover. A trade can incur all three. A low-spread account suited to intraday trading may not be the cheapest for holding the same position for weeks."
          }
        ]
      ]
    },
    {
      "id": "what-are-swap-free-forex-accounts",
      "title": "What Are Swap-Free Forex Accounts?",
      "paragraphs": [
        [
          {
            "text": "Swap-free arrangements may depend on the customer, legal entity, instrument and holding period. Some impose administrative charges or other restrictions. Enter zero only for a confirmed eligible period; this does not remove commissions, spreads or other costs. Check the account terms rather than assuming indefinite free financing."
          }
        ]
      ]
    },
    {
      "id": "common-forex-swap-calculation-mistakes",
      "title": "Common Forex Swap Calculation Mistakes",
      "paragraphs": [
        [
          {
            "text": "Avoid confusing points with pips, applying a long rate to a short position, multiplying calendar nights without checking cutoffs, hardcoding one triple day, or forgetting account-currency conversion. Rates and schedules can change during the holding period; a constant-input estimate cannot account for unentered changes."
          }
        ],
        [
          {
            "text": "Date mode uses local opening/closing times in the selected timezone, including daylight saving. It counts cutoffs strictly after opening and at or before closing. This boundary is a disclosed convention, not confirmation of the broker’s processing rule. Ambiguous or nonexistent local times require correction rather than a guessed offset."
          }
        ],
        [
          {
            "text": "Calendar calculations cover up to 366 local days. The displayed schedule starts with ordinary weekdays, zero weekends and your chosen triple day; a dated override replaces that day’s multiplier. Confirm every exception, because no holiday calendar is automatically applied."
          }
        ]
      ]
    },
    {
      "id": "when-is-this-calculator-most-useful",
      "title": "When Is This Calculator Most Useful?",
      "paragraphs": [
        [
          {
            "text": "Use the estimate to compare long/short financing assumptions, plan a swing-trade holding period or investigate a difference between price P&L and a broker statement. Financing can be significant relative to a small profit target. It remains only one component of the trade’s overall outcome."
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
            "text": "The forex swap calculator helps you estimate the financing costs or credits associated with holding a trading position beyond rollover."
          }
        ],
        [
          {
            "text": "For the most useful result, enter your broker's actual long or short swap rate, confirm the unit, and select the correct holding period and rollover schedule."
          }
        ],
        [
          {
            "text": "When comparing longer-term positions, consider swap alongside the spread, commissions, position size, and possible market losses."
          }
        ],
        [
          {
            "text": "Check "
          },
          {
            "text": "IG’s pip definition",
            "href": "https://www.ig.com/en/glossary-trading-terms/pip-definition"
          },
          {
            "text": " when distinguishing points and pips. Optional conversion uses "
          },
          {
            "text": "Frankfurter daily references",
            "href": "https://frankfurter.dev/"
          },
          {
            "text": ", clearly dated rather than live. Read the "
          },
          {
            "text": "CFTC’s forex risk guidance",
            "href": "https://www.cftc.gov/LearnAndProtect/forexfrauds"
          },
          {
            "text": " before treating financing as a reason to hold a leveraged position."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "Is forex swap charged every night?",
      "answer": "Swap is generally applied when an eligible position crosses the broker's rollover time, but the schedule depends on the instrument and account. Some days carry larger adjustments, and swap-free arrangements may have different rules."
    },
    {
      "question": "Why is triple swap commonly charged on Wednesday?",
      "answer": "Many spot forex settlement schedules require a larger midweek financing adjustment to account for weekend settlement days. The exact day varies by instrument and broker."
    },
    {
      "question": "Can forex swap be positive?",
      "answer": "Yes. A broker may credit financing on certain positions. However, the rate can change, and price losses may exceed any swap credit."
    }
  ]
};
