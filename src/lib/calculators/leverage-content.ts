import type { CalculatorDefinition } from "./catalog";
export const leverageDefinition: CalculatorDefinition = {
  "keyword": "forex leverage calculator",
  "title": "Forex Leverage Calculator – Margin & Exposure",
  "description": "Forex leverage calculator: compare notional exposure, effective leverage and required margin. Check entered leverage limits, equity and margin assumptions.",
  "heading": "Forex Leverage Calculator",
  "intro": "A forex leverage calculator helps you understand the relationship between your trading account, the full value of a currency position, and the margin required to open it. Enter your account equity, trade size, exchange rate, and permitted leverage to calculate your notional exposure, estimated margin, and effective leverage. For example, a forex position worth $50,000 in a trading account with $5,000 equity represents effective leverage of 10:1. If the broker permits 50:1 leverage, the simplified margin requirement for that position is $1,000. Use the calculator above to compare these measurements before placing a leveraged trade.",
  "quickAnswer": "Effective leverage = account-currency notional ÷ account equity. USD 100,000 exposure with USD 10,000 equity is 10:1. Permitted leverage is a separate account rule: at an entered 1:50 ratio, USD 50,000 exposure needs USD 1,000 margin under a constant-rate model. Changing that permitted ratio changes collateral, not the price P&L of an unchanged position. The calculator compares these figures separately and requires positive equity; it cannot verify a broker’s actual tiers or account eligibility.",
  "steps": [
    "Choose direct account-currency notional or a forex trade-size calculation.",
    "Enter current account equity; include open-position P&L rather than substituting balance.",
    "For a trade, check contract size, reference price and any required currency conversion.",
    "Enter the applicable permitted ratio or constant margin percentage, plus any existing used margin.",
    "Compare exposure, margin, remaining free margin and hypothetical alternatives; verify actual account rules separately."
  ],
  "sections": [
    {
      "id": "what-is-leverage-in-forex",
      "title": "What Is Leverage in Forex?",
      "paragraphs": [
        [
          {
            "text": "Leverage lets a position’s notional value exceed its collateral. A USD 20,000 position might require USD 1,000 margin under a 1:20 arrangement, while retaining USD 20,000 of market exposure. Price changes act on the position, not just the reserved collateral."
          }
        ],
        [
          {
            "text": "More permitted leverage can make larger exposures accessible, but does not establish that they are appropriate. The tool separates what you enter as permitted from what the proposed exposure actually represents relative to equity."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-forex-leverage-calculator",
      "title": "How to Use the Forex Leverage Calculator",
      "paragraphs": [
        [
          {
            "text": "Choose direct notional when you already know the exposure in account currency. Otherwise select a forex pair and enter configured lots or base units, reference price and any required conversion. If the base currency is your account currency, no extra conversion price is needed."
          }
        ],
        [
          {
            "text": "Enter positive equity and the applicable permitted ratio or margin percentage. Advanced settings add existing used margin, other unsigned gross exposure and a separate platform-available-margin comparison. These are snapshots, not a verified account connection or a complete portfolio-margin model."
          }
        ]
      ]
    },
    {
      "id": "forex-leverage-formula-explained",
      "title": "Forex Leverage Formula Explained",
      "formula": "Base units = Lots × Contract size",
      "paragraphs": [
        [
          {
            "text": "For a forex trade, base units equal lots × "
          },
          {
            "text": "configured contract size",
            "href": "/calculators/forex-lot-size-converter"
          },
          {
            "text": ". Convert that exposure into account currency before comparing it with equity. The "
          },
          {
            "text": "shared margin calculation",
            "href": "https://www.metatrader5.com/en/terminal/help/trading_advanced/margin_forex"
          },
          {
            "text": " uses the entered reference price and conversion assumptions. Direct-notional mode already expects account-currency money."
          }
        ],
        [
          {
            "text": "For USD 60,000 exposure at 1:30, required margin is USD 2,000. With USD 10,000 equity, effective leverage is only 6:1. One ratio describes the collateral formula; the other describes actual exposure relative to the account. They need not match."
          }
        ]
      ]
    },
    {
      "id": "example-eur-usd-leverage-and-margin",
      "title": "Example: EUR/USD Leverage and Margin",
      "paragraphs": [
        [
          {
            "text": "One conventional EUR/USD standard lot represents EUR 100,000. At an illustrative 1.1000 USD per EUR, notional is USD 110,000. With entered 1:50 permitted leverage, simplified required margin is USD 2,200."
          }
        ],
        [
          {
            "text": "At USD 11,000 equity, the position’s effective leverage is 10:1. Existing positions and other requirements can reduce available margin. This example does not establish which company, account or product permits that ratio; use the actual specification and current platform figures."
          }
        ]
      ]
    },
    {
      "id": "example-how-changing-leverage-changes-margin",
      "title": "Example: How Changing Leverage Changes Margin",
      "table": {
        "headers": [
          "Permitted leverage",
          "Simplified required margin"
        ],
        "rows": [
          [
            "1:10",
            "$5,000"
          ],
          [
            "1:20",
            "$2,500"
          ],
          [
            "1:30",
            "$1,666.67"
          ],
          [
            "1:50",
            "$1,000"
          ],
          [
            "1:100",
            "$500"
          ]
        ]
      },
      "paragraphs": [
        [
          {
            "text": "The table holds notional exposure at USD 50,000. Increasing the permitted ratio lowers the collateral estimate under this fixed-rate formula, while the exposure stays unchanged. A given price movement therefore still produces the same gross P&L at the same volume."
          }
        ],
        [
          {
            "text": "The interactive comparison includes alternative ratios, marking those above the entered limit. These are hypothetical calculations, not available account offers. Neither the table nor the default ratio overrides actual margin requirements."
          }
        ]
      ]
    },
    {
      "id": "effective-leverage-vs-maximum-leverage",
      "title": "Effective Leverage vs Maximum Leverage",
      "paragraphs": [
        [
          {
            "text": "Two accounts can both permit 1:100 while using very different exposures. With USD 10,000 equity, USD 20,000 notional means 2:1 effective leverage; USD 200,000 means 20:1. The advertised maximum alone cannot describe those traders’ actual market exposure."
          }
        ],
        [
          {
            "text": "Optional other-notional input adds unsigned account-currency exposure to the proposed trade. Combined gross leverage does not net hedges or model correlations. Interpret it as a gross exposure comparison, not a complete portfolio risk score."
          }
        ]
      ]
    },
    {
      "id": "what-is-forex-margin",
      "title": "What Is Forex Margin?",
      "formula": "Leverage = 1 ÷ Margin fraction",
      "paragraphs": [
        [
          {
            "text": "Margin is reserved collateral, not necessarily a transaction fee or the maximum loss. At a constant 2% requirement, USD 100,000 exposure needs USD 2,000 margin, mathematically equivalent to 1:50. Margin percentage = 100 ÷ leverage."
          }
        ],
        [
          {
            "text": "The "
          },
          {
            "text": "forex margin calculator",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": " explains the collateral calculation and currency conventions. Real schedules can be tiered, dynamic or symbol-specific. Entering a single percentage is a simplifying assumption, not proof that every position at the company uses that rate."
          }
        ]
      ]
    },
    {
      "id": "how-leverage-affects-profits-and-losses",
      "title": "How Leverage Affects Profits and Losses",
      "paragraphs": [
        [
          {
            "text": "A 0.50-standard-lot EUR/USD position has conventional USD 5-per-pip value in a USD account. A 20-pip move gives USD 100 gross gain or loss. Those amounts do not change because permitted leverage moves from 1:30 to 1:100."
          }
        ],
        [
          {
            "text": "Collateral may change. Monetary price sensitivity changes if you actually change volume. Use the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " to model entry and exit prices and separately charged fees, rather than multiplying an existing profit by the advertised leverage ratio."
          }
        ]
      ]
    },
    {
      "id": "does-higher-leverage-mean-higher-risk",
      "title": "Does Higher Leverage Mean Higher Risk?",
      "paragraphs": [
        [
          {
            "text": "For an unchanged position, more permitted leverage does not independently increase direct price sensitivity. It can, however, enable much larger positions relative to equity."
          }
        ],
        [
          {
            "text": "USD 100,000 exposure against USD 1,000 equity is 100:1 effective leverage. Under a simple linear account-currency model, a 1% adverse move represents about USD 1,000 before costs. That is the entire starting equity. Conversion changes, gaps, slippage and actual instrument behavior can alter the result. Low collateral does not mean low possible loss."
          }
        ]
      ]
    },
    {
      "id": "leverage-and-forex-stop-loss-risk",
      "title": "Leverage and Forex Stop-Loss Risk",
      "paragraphs": [
        [
          {
            "text": "Effective leverage compares exposure with equity. Planned stop risk instead depends on adverse price distance, volume, pip value and costs. Two trades can have the same effective leverage but different planned losses because their stops differ."
          }
        ],
        [
          {
            "text": "Use the "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " to connect those inputs with a chosen cash-risk budget. Stops can slip and losses can exceed the plan. The leverage calculator does not treat margin as a stop-loss amount or suggest that available buying power is a sensible risk budget."
          }
        ]
      ]
    },
    {
      "id": "how-leverage-affects-margin-level",
      "title": "How Leverage Affects Margin Level",
      "paragraphs": [
        [
          {
            "text": "Margin level is equity ÷ used margin × 100. USD 5,000 equity and USD 1,000 used margin gives 500%; USD 2,000 used margin gives 250% with equity unchanged. Entered existing used margin therefore matters when adding a proposed trade."
          }
        ],
        [
          {
            "text": "The "
          },
          {
            "text": "margin call and stop-out calculator",
            "href": "/calculators/forex-margin-call-calculator"
          },
          {
            "text": " examines conditional account-level thresholds. It needs the actual account rules; no generic ratio here predicts liquidation. A separately supplied available-margin figure is another comparison, not a substitute for equity minus used margin."
          }
        ]
      ]
    },
    {
      "id": "leverage-restrictions-and-broker-rules",
      "title": "Leverage Restrictions and Broker Rules",
      "paragraphs": [
        [
          {
            "text": "Permitted leverage differs by jurisdiction, company, product and client category. "
          },
          {
            "text": "OANDA’s US margin information",
            "href": "https://www.oanda.com/us-en/trading/spreads-margin/"
          },
          {
            "text": " illustrates why instrument and account scope matter. It is not evidence that the same terms apply to an international account."
          }
        ],
        [
          {
            "text": "Larger positions can also enter different margin tiers, and hedging or pending orders can change reserved collateral. The present model uses one constant rate and no netting offsets. Confirm the source for your actual agreement instead of importing the highest advertised ratio from a different entity."
          }
        ]
      ]
    },
    {
      "id": "forex-leverage-for-small-accounts",
      "title": "Forex Leverage for Small Accounts",
      "paragraphs": [
        [
          {
            "text": "A USD 500 account controlling USD 20,000 exposure has 40:1 effective leverage. A 1% adverse move represents about USD 200 under a simplified linear model: 40% of that starting equity before additional costs."
          }
        ],
        [
          {
            "text": "A small required margin does not make the position’s "
          },
          {
            "text": "monetary exposure",
            "href": "https://moneysmart.gov.au/complex-investment-products/forex-trading"
          },
          {
            "text": " small. The proportional comparison displays equity, proposed exposure and collateral on one account-currency scale. It is a size comparison, not a profit projection or encouragement to select maximum permitted leverage."
          }
        ]
      ]
    },
    {
      "id": "common-forex-leverage-calculation-mistakes",
      "title": "Common Forex Leverage Calculation Mistakes",
      "paragraphs": [
        [
          {
            "text": "Avoid substituting balance for current equity, confusing collateral with notional, or assuming a higher permitted ratio multiplies unchanged-position profit. Convert exposure into account currency and account for existing used margin."
          }
        ],
        [
          {
            "text": "The tool flags a negative after-trade free-margin snapshot, a separately entered available-margin shortfall and gross exposure above the entered simplified cap. Those warnings do not implement broker order approval, portfolio tiers or suitability. Positive free margin also does not establish that adverse moves are affordable."
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
            "text": "The forex leverage calculator separates notional exposure, actual exposure/equity and collateral under entered rules. Compare these figures before assuming a low margin requirement means low risk. Verify actual account terms and keep the full position’s price exposure in view."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "How do I calculate leverage in forex?",
      "answer": "Divide the notional value of your position, expressed in the account currency, by current account equity. The result is effective leverage. Broker-maximum leverage is a separate account rule."
    },
    {
      "question": "What does 1:100 leverage mean?",
      "answer": "Under a simple fixed-leverage model, 1:100 permits a position worth up to 100 times the collateral allocated as margin. Actual exposure and permissible position size remain subject to broker, account, and regulatory rules."
    },
    {
      "question": "Does changing leverage increase my forex profit?",
      "answer": "Not on an unchanged position. Profit and loss depend on volume and price movement. Higher permitted leverage can enable a larger position, which increases exposure and potential losses."
    }
  ],
  "slug": "forex-leverage-calculator",
  "path": "/calculators/forex-leverage-calculator",
  "kind": "leverage",
  "card": "Separate proposed exposure/equity from permitted leverage, collateral and available margin."
};
