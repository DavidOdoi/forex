import type { CalculatorDefinition } from "./catalog";
export const spreadDefinition: CalculatorDefinition = {
  "keyword": "forex spread calculator",
  "title": "Forex Spread Calculator – Calculate Trading Costs",
  "description": "Forex spread calculator: measure bid/ask costs in pips and money, add commission, and compare wider-spread scenarios with transparent conversion assumptions.",
  "heading": "Forex Spread Calculator",
  "intro": "A forex spread calculator helps you determine the difference between a currency pair's bid and ask prices and estimate what that difference means for your trading costs. For example, if EUR/USD has a bid price of 1.10000 and an ask price of 1.10012, the spread is 1.2 pips. On a conventional standard lot, that represents a $12 spread cost in a USD account. Use the calculator above to enter the current bid, ask, trading volume, and account currency. You'll see the spread in pips, its monetary equivalent, and how it affects your trading position.",
  "quickAnswer": "Spread in pips = (ask − bid) ÷ pip size. At EUR/USD 1.10000 bid and 1.10012 ask, the difference is 1.2 pips. One conventional 100,000-unit lot costs USD 12 at that quote; 0.10 lots costs USD 1.20. Add separately charged commission for a standalone cost estimate. If your profit calculation already uses executable entry and exit prices, the spread is embedded: do not deduct it again.",
  "steps": [
    "Choose a forex pair and confirm its contract and pip specifications.",
    "Enter contemporaneous bid and ask prices, plus trade size in lots or base units.",
    "Select the account currency and provide any required conversion quote.",
    "Add a total round-turn commission and choose whether spread is already included in executable fills.",
    "Optionally model a different closing spread; compare results and hypothetical wider-spread scenarios."
  ],
  "sections": [
    {
      "id": "what-is-spread-in-forex-trading",
      "title": "What Is Spread in Forex Trading?",
      "paragraphs": [
        [
          {
            "text": "Spread is the difference between the price at which a currency pair can be sold and the price at which it can be bought. The lower displayed price is generally called the bid. The higher price is the ask. A trader opening a "
          },
          {
            "text": "market buy",
            "href": "https://www.metatrader5.com/en/terminal/help/trading/general_concept"
          },
          {
            "text": " position ordinarily pays the ask price. Closing that buy position involves selling at the bid."
          }
        ],
        [
          {
            "text": "A market sell position ordinarily opens at the bid and closes at the ask. This difference means that a newly opened position can show a small loss even if the underlying market quotation has not moved. For example, a EUR/USD quote of 1.10000/1.10010 has a one-pip spread. Someone buying at 1.10010 cannot immediately close at that same price if the currently available bid remains 1.10000."
          }
        ],
        [
          {
            "text": "The spread is one component of transaction costs. Some brokers also charge commissions, financing fees, or other expenses, so the spread alone may not represent the full cost of trading."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-forex-spread-calculator",
      "title": "How to Use the Forex Spread Calculator",
      "paragraphs": [
        [
          {
            "text": "Choose the pair and enter a bid and ask observed together, then select volume and account currency. Neither side of the market quote is supplied automatically. A "
          },
          {
            "text": "daily conversion reference",
            "href": "https://frankfurter.dev/"
          },
          {
            "text": ", if available, only translates the monetary cost between currencies."
          }
        ],
        [
          {
            "text": "Add a total round-turn commission in account currency. This is the fee for the entered volume, not a per-lot quotation. Select the embedded-spread mode when your separate P&L already uses executable fills. Advanced settings expose contract size, pip size, precision, a UTC observation time and an optional hypothetical closing spread."
          }
        ]
      ]
    },
    {
      "id": "understanding-bid-and-ask-prices",
      "title": "Understanding Bid and Ask Prices",
      "paragraphs": [
        [
          {
            "text": "A EUR/USD bid of 1.08240 and ask of 1.08253 differ by 0.00013, or 1.3 conventional pips. A market buy opens at the ask and normally closes at the bid; a sell opens at the bid and closes at the ask. These prices explain why an immediately closed trade can lose money without a change in the quotation."
          }
        ],
        [
          {
            "text": "The two values must describe the same instrument, company, account and observation time. Combining yesterday’s bid with today’s ask does not measure a meaningful spread. An optional manual timestamp records your observation; it is not independent verification."
          }
        ]
      ]
    },
    {
      "id": "how-many-dollars-is-one-pip-of-spread",
      "title": "How Many Dollars Is One Pip of Spread?",
      "table": {
        "headers": [
          "Spread",
          "Cost per Standard Lot"
        ],
        "rows": [
          [
            "0.2 pips",
            "$2"
          ],
          [
            "0.5 pips",
            "$5"
          ],
          [
            "1.0 pip",
            "$10"
          ],
          [
            "1.5 pips",
            "$15"
          ],
          [
            "2.0 pips",
            "$20"
          ],
          [
            "3.0 pips",
            "$30"
          ]
        ]
      },
      "paragraphs": [
        [
          {
            "text": "A spread's monetary value depends on the currency pair, contract size, and account currency. For a conventional EUR/USD standard lot in a USD account, one pip is $10. Therefore: For a 0.10-lot position, divide these values by ten. For a 0.01-lot position, divide them by one hundred. These examples assume conventional EUR/USD specifications."
          }
        ],
        [
          {
            "text": "For USD/JPY or another pair with a different quote currency, the monetary "
          },
          {
            "text": "pip value",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " must be converted into the trading account currency. This is why a useful forex spread calculator should not apply a fixed $10 pip value to every symbol."
          }
        ]
      ]
    },
    {
      "id": "spread-calculation-example-for-usd-jpy",
      "title": "Spread Calculation Example for USD/JPY",
      "paragraphs": [
        [
          {
            "text": "Suppose USD/JPY has a bid of 159.980 and an ask of 160.000. The difference is 0.020 JPY per USD, or two conventional 0.01-sized pips. One 100,000-unit lot has a 1,000 JPY pip value, so the spread represents 2,000 JPY. At an illustrative 160 JPY per USD, 2,000 ÷ 160 = USD 12.50. A JPY account needs no conversion. The displayed conversion quote explains the USD equivalent; a different conversion price changes that amount."
          }
        ]
      ]
    },
    {
      "id": "fixed-vs-variable-forex-spreads",
      "title": "Fixed vs Variable Forex Spreads",
      "paragraphs": [
        [
          {
            "text": "Fixed-spread arrangements aim to keep the quoted difference relatively stable under their terms. Exceptional events and execution conditions can still change the transaction experience. Variable spreads respond to market pricing and liquidity."
          }
        ],
        [
          {
            "text": "“From 0.0 pips” describes an advertised minimum, not an average or guaranteed execution price. Compare representative historical spreads for the instrument, account and trading hours you use. Our sensitivity table displays the entered spread, 1.5× that spread and 2× that spread, holding volume and commission constant. Those scenarios are not historical measurements."
          }
        ]
      ]
    },
    {
      "id": "why-forex-spreads-widen",
      "title": "Why Forex Spreads Widen",
      "paragraphs": [
        [
          {
            "text": "Spreads can widen when liquidity falls or uncertainty increases, including around economic releases, daily rollover, holidays and weekend openings. The extent depends on the instrument, account and pricing arrangements; no universal widening multiplier applies."
          }
        ],
        [
          {
            "text": "OANDA’s historical spread information",
            "href": "https://www.oanda.com/us-en/trading/historical-spreads/"
          },
          {
            "text": " illustrates why one observation cannot establish a day’s typical cost. Inspect the scope and dates of the provider’s data. The calculator’s manually entered quote stays an assumption rather than becoming a historical average."
          }
        ]
      ]
    },
    {
      "id": "spread-vs-commission-which-cost-matters-more",
      "title": "Spread vs Commission: Which Cost Matters More?",
      "paragraphs": [
        [
          {
            "text": "A spread-based account may charge little or no separate trading commission while quoting a wider spread. A commission-based account may offer a tighter spread but impose a per-lot transaction fee. To compare them fairly, combine the relevant spread and commission costs. Suppose Account A has a 1.2-pip spread and no separate commission. For one conventional EUR/USD lot, the estimated spread cost is $12."
          }
        ],
        [
          {
            "text": "Account B offers a 0.3-pip spread but charges $3.50 per side per standard lot. Its spread cost is $3, and its round-turn commission is $7. The combined estimated transaction cost is $10. Under these illustrative conditions, Account B costs $2 less for the completed trade. This comparison assumes identical "
          },
          {
            "text": "contract specifications",
            "href": "https://www.mql5.com/en/docs/constants/environment_state/marketinfoconstants"
          },
          {
            "text": " and that the quoted spreads are representative."
          }
        ],
        [
          {
            "text": "Execution quality, conversion charges, and other fees can alter the result."
          }
        ]
      ]
    },
    {
      "id": "how-spread-affects-scalping",
      "title": "How Spread Affects Scalping",
      "paragraphs": [
        [
          {
            "text": "A two-pip spread is substantial beside a five-pip gross target. Frequent trades can accumulate meaningful costs even when each quoted spread looks small. Commission and slippage further change the net result. Use the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " to model executable entry and exit prices and compare those costs with the planned movement. Low spreads alone do not establish suitable execution, order restrictions or a profitable strategy."
          }
        ]
      ]
    },
    {
      "id": "how-spread-affects-swing-trading",
      "title": "How Spread Affects Swing Trading",
      "paragraphs": [
        [
          {
            "text": "For longer holdings, financing can outweigh the initial spread. A USD 10 transaction cost is also proportionally different beside a USD 20 target and a USD 500 target. Estimate overnight charges with the "
          },
          {
            "text": "forex swap calculator",
            "href": "/calculators/forex-swap-calculator"
          },
          {
            "text": "; rates and rollover schedules remain broker-specific. A narrow entry quote does not establish the lowest total holding cost."
          }
        ]
      ]
    },
    {
      "id": "does-spread-count-once-or-twice",
      "title": "Does Spread Count Once or Twice?",
      "paragraphs": [
        [
          {
            "text": "At unchanged bid and ask, a market buy opens at ask and closes at bid, losing one full quoted spread. A symmetric midpoint model instead assigns half the opening spread and half the closing spread. With a one-pip opening spread and a three-pip closing spread, that model costs two pips, not four."
          }
        ],
        [
          {
            "text": "The optional closing-spread field uses that midpoint allocation. It is a scenario estimate, not a reconstruction of real fills. Leave it blank to use the quoted spread at both ends."
          }
        ],
        [
          {
            "text": "When executable entry and exit prices already determine gross P&L, another spread deduction would double-count the effect. In embedded mode, quoted and modeled spread equivalents remain visible, but the headline includes only the separately entered commission. No trade-profit prediction is made."
          }
        ]
      ]
    },
    {
      "id": "spread-as-a-percentage-of-price",
      "title": "Spread as a Percentage of Price",
      "formula": "Spread percentage = (Ask − Bid) ÷ Ask × 100",
      "paragraphs": [
        [
          {
            "text": "The displayed percentage uses ask as its denominator: (ask − bid) ÷ ask × 100. A 1.1000/1.1002 quote gives approximately 0.01818%. Other conventions use the midpoint, so compare like with like. Percentage alone does not establish the monetary exposure; volume is still required."
          }
        ]
      ]
    },
    {
      "id": "common-forex-spread-calculation-mistakes",
      "title": "Common Forex Spread Calculation Mistakes",
      "paragraphs": [
        [
          {
            "text": "A frequent mistake is subtracting the ask from the bid instead of the reverse. Another is using the wrong pip size for JPY pairs. Traders may also assume the pip value is always $10, regardless of the instrument or account currency. Some compare a broker's minimum advertised spread against another broker's average spread, producing a misleading conclusion."
          }
        ],
        [
          {
            "text": "Others ignore commissions or spread changes during volatile conditions. The most serious technical mistake is double-counting spread when actual executable prices already include it. Check the units and price convention before comparing the result with your platform."
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
            "text": "The forex spread calculator helps convert a bid/ask difference into understandable trading costs. Use it to compare quotes, evaluate lot sizes, and understand the role of spread in a completed trade. For accurate cost comparisons, consider commissions, conversion rates, execution prices, and whether the spread has already been included in the profit/loss calculation."
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
            "text": " to choose volume from a cash-risk budget, then check required collateral with the "
          },
          {
            "text": "forex margin calculator",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": ". Neither spread nor margin defines a maximum loss."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "How do I calculate forex spread in pips?",
      "answer": "Subtract the bid price from the ask price and divide the difference by the currency pair's pip size. For most conventional non-JPY forex pairs, one pip is 0.0001."
    },
    {
      "question": "How much does a 1-pip spread cost?",
      "answer": "For one conventional EUR/USD standard lot in a USD account, one pip is worth $10. Other lot sizes, currency pairs, and account currencies produce different values."
    },
    {
      "question": "Is a zero-spread forex account free to trade?",
      "answer": "Not necessarily. A zero-spread quote may still involve commissions, financing charges, conversion fees, or other expenses. Spreads may also vary outside the conditions under which the minimum is advertised."
    }
  ],
  "slug": "forex-spread-cost-calculator",
  "path": "/calculators/forex-spread-cost-calculator",
  "kind": "spread",
  "card": "Measure bid/ask costs, account-currency fees and hypothetical wider spreads."
};
