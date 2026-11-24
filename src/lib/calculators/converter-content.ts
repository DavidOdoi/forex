import type { CalculatorDefinition } from "./catalog";
export const converterDefinition: CalculatorDefinition = {
  "slug": "forex-lot-size-converter",
  "path": "/calculators/forex-lot-size-converter",
  "kind": "converter",
  "keyword": "forex lot size converter",
  "title": "Forex Lot Size Converter – Standard, Mini & Micro",
  "heading": "Forex Lot Size Converter",
  "description": "Forex lot size converter: convert standard, mini, micro, nano and platform lots to currency units, estimate pip value and check your entered order-size limits.",
  "card": "Translate exact currency exposure and check optional configured-lot limits.",
  "intro": "A forex lot size converter helps you convert trading volumes between standard lots, mini lots, micro lots, nano lots, and currency units. Whether your trading platform displays 0.10 lots or 10,000 units, the converter makes it easier to understand how much currency the position represents. For conventional forex contracts, one standard lot equals 100,000 units of the base currency. A mini lot equals 10,000 units, while a micro lot equals 1,000 units. Enter your trading volume into the calculator above to see the equivalent lot sizes, currency units, and estimated pip values.",
  "quickAnswer": "Multiply conventional standard lots by 100,000 for base units, or divide units by 100,000 to reverse it. A 0.35-lot position equals 35,000 base units:3.5 mini lots,35 micro lots or 350 nano lots. If a platform lot has a custom contract, use that multiplier instead; conventional equivalents retain their fixed definitions. EUR/USD 35,000 units is worth USD 3.50 per pip in a USD account under the normal pip convention. That is movement exposure, not required margin or a guaranteed loss limit. An exact conversion can still fail the order minimum or increment you enter.",
  "steps": [
    "Choose the forex pair, account currency and input convention: conventional standard, mini, micro, nano, configured platform lots or base units.",
    "Enter the exact quantity. If using platform lots, check the base units per configured lot against the actual symbol specification.",
    "Optionally enable order limits and enter minimum, step and maximum in configured lots. Read compatibility separately from the unchanged mathematical conversion.",
    "Enable pip valuation if needed and supply a suitable currency conversion. Copy results or reuse the exact converted units in the pip, profit or position-planning tools."
  ],
  "sections": [
    {
      "id": "what-is-a-lot-in-forex",
      "title": "What Is a Lot in Forex?",
      "paragraphs": [
        [
          {
            "text": "A lot expresses trading volume. With a conventional 100,000-unit contract, one EUR/USD standard lot represents EUR 100,000 and 0.10 lots represents EUR 10,000. Lots describe exposure, not the deposit required or the maximum possible loss. Margin, leverage, price changes, costs and account-currency conversion answer separate questions."
          }
        ]
      ]
    },
    {
      "id": "standard-mini-micro-and-nano-lots-explained",
      "title": "Standard, Mini, Micro, and Nano Lots Explained",
      "paragraphs": [
        [
          {
            "text": "Conventional standard, mini, micro and nano lots represent 100,000, 10,000, 1,000 and 100 base units respectively. Each category differs by a factor of ten. They are mathematical reference amounts, not confirmation that a broker accepts orders of every size."
          }
        ],
        [
          {
            "text": "A broker may permit a minimum of 0.01 configured lots and reject 0.001. Another account may allow smaller increments. Enter the actual minimum, step and optional maximum to check compatibility without altering the exact conversion. No broker profile is automatically verified."
          }
        ]
      ]
    },
    {
      "id": "forex-lot-size-conversion-chart",
      "title": "Forex lot size converter: the reference chart",
      "paragraphs": [
        [
          {
            "text": "The following table shows conventional forex lot sizes and their base-currency equivalents."
          }
        ],
        [
          {
            "text": "The table uses a standard contract size of 100,000 base-currency units."
          }
        ],
        [
          {
            "text": "A broker may label a smaller contract differently, especially on cent accounts or non-forex instruments."
          }
        ],
        [
          {
            "text": "Always identify the actual number of units represented by one platform lot."
          }
        ]
      ],
      "table": {
        "headers": [
          "Standard Lots",
          "Currency Units",
          "Mini Lots",
          "Micro Lots",
          "Nano Lots"
        ],
        "rows": [
          [
            "1.00",
            "100,000",
            "10",
            "100",
            "1,000"
          ],
          [
            "0.50",
            "50,000",
            "5",
            "50",
            "500"
          ],
          [
            "0.20",
            "20,000",
            "2",
            "20",
            "200"
          ],
          [
            "0.10",
            "10,000",
            "1",
            "10",
            "100"
          ],
          [
            "0.05",
            "5,000",
            "0.5",
            "5",
            "50"
          ],
          [
            "0.01",
            "1,000",
            "0.1",
            "1",
            "10"
          ],
          [
            "0.001",
            "100",
            "0.01",
            "0.1",
            "1"
          ]
        ]
      }
    },
    {
      "id": "how-to-convert-standard-lots-into-units",
      "title": "How to Convert Standard Lots Into Units",
      "paragraphs": [
        [
          {
            "text": "Base units equal conventional standard lots multiplied by 100,000. At 0.35 lots, EUR/USD represents 35,000 EUR:3.5 mini,35 micro or 350 nano equivalents. The same 0.35 conventional USD/JPY lots represents 35,000 USD, because USD is the base currency. Equal unit counts in different base currencies are not equal account-currency notional values."
          }
        ]
      ]
    },
    {
      "id": "how-to-convert-currency-units-into-lots",
      "title": "How to Convert Currency Units Into Lots",
      "paragraphs": [
        [
          {
            "text": "Reverse the conversion by dividing base units by 100,000. A 25,000-EUR position is 0.25 conventional standard lots,2.5 mini lots or 25 micro lots. A 150,000-EUR position is 1.50 standard lots."
          }
        ],
        [
          {
            "text": "These relationships compare platforms only when their underlying units match. If a platform defines a different contract size, divide units by that configured multiplier instead. Never infer exposure from the label “one lot” alone."
          }
        ]
      ]
    },
    {
      "id": "how-much-is-0-01-lot-in-forex",
      "title": "How Much Is 0.01 Lot in Forex?",
      "paragraphs": [
        [
          {
            "text": "A conventional 0.01 standard lot is one micro lot: 1,000 base units. That means EUR 1,000 for EUR/USD, GBP 1,000 for GBP/USD or USD 1,000 for USD/JPY. Required margin may be smaller than full notional, but price movements affect the entire exposure. A small order does not guarantee a small loss."
          }
        ]
      ]
    },
    {
      "id": "how-much-is-0-10-lot-in-forex",
      "title": "How Much Is 0.10 Lot in Forex?",
      "paragraphs": [
        [
          {
            "text": "A volume of 0.10 conventional standard lots is equal to one mini lot."
          }
        ],
        [
          {
            "text": "It represents 10,000 base-currency units."
          }
        ],
        [
          {
            "text": "For EUR/USD, this is 10,000 euros."
          }
        ],
        [
          {
            "text": "For GBP/USD, it is 10,000 pounds."
          }
        ],
        [
          {
            "text": "For a conventional EUR/USD contract in a USD account, one pip is worth approximately $1 at this volume."
          }
        ],
        [
          {
            "text": "A favorable 20-pip movement would therefore produce about $20 in gross price profit."
          }
        ],
        [
          {
            "text": "An unfavorable movement of the same distance would produce a corresponding gross loss."
          }
        ],
        [
          {
            "text": "The actual account result may differ because of costs and execution conditions."
          }
        ],
        [
          {
            "text": "Use the "
          },
          {
            "text": "Forex Profit Calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " if you want to calculate a particular trade's monetary outcome."
          }
        ]
      ]
    },
    {
      "id": "how-lot-size-affects-pip-value",
      "title": "How Lot Size Affects Pip Value",
      "paragraphs": [
        [
          {
            "text": "A pip is a commonly used unit of currency-pair price movement."
          }
        ],
        [
          {
            "text": "For EUR/USD, one conventional pip is 0.0001."
          }
        ],
        [
          {
            "text": "The monetary value of that movement depends on the number of currency units traded."
          }
        ],
        [
          {
            "text": "For a conventional EUR/USD contract in a USD account:"
          }
        ],
        [
          {
            "text": "These values assume standard EUR/USD contract specifications and do not represent universal pip values for every instrument."
          }
        ],
        [
          {
            "text": "For USD/JPY or a pair whose quote currency differs from your account currency, conversion rates affect the monetary value of a pip."
          }
        ],
        [
          {
            "text": "Our "
          },
          {
            "text": "Forex Pip Calculator",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " handles those conversions in greater detail."
          }
        ],
        [
          {
            "text": "A quoted pip convention is separate from a platform point. Read "
          },
          {
            "text": "IG’s pip definition",
            "href": "https://www.ig.com/en/glossary-trading-terms/pip-definition"
          },
          {
            "text": ". Optional "
          },
          {
            "text": "Frankfurter daily conversion rates",
            "href": "https://frankfurter.dev/"
          },
          {
            "text": " display their date and any stale/cache status; they are not executable market prices."
          }
        ]
      ],
      "table": {
        "headers": [
          "Position Size",
          "Approximate Pip Value"
        ],
        "rows": [
          [
            "1.00 lot",
            "$10"
          ],
          [
            "0.50 lots",
            "$5"
          ],
          [
            "0.10 lots",
            "$1"
          ],
          [
            "0.01 lots",
            "$0.10"
          ],
          [
            "0.001 lots",
            "$0.01"
          ]
        ]
      }
    },
    {
      "id": "lot-size-vs-position-size-what-s-the-difference",
      "title": "Lot Size vs Position Size: What's the Difference?",
      "paragraphs": [
        [
          {
            "text": "Lot size describes traded quantity. Risk-based position sizing selects quantity from a loss allowance and stop distance. Two traders can each hold 0.10 EUR/USD lots, but a 20-pip stop represents USD 20 gross price risk while a 100-pip stop represents USD 100, under the conventional USD-account pip value."
          }
        ],
        [
          {
            "text": "The converter tells you how much currency a quantity represents. A position-size calculation combines the monetary pip value, chosen stop and risk budget. Neither a valid conversion nor an attractive lot amount establishes that the trade is suitable for an account."
          }
        ]
      ]
    },
    {
      "id": "lot-size-vs-margin-why-they-aren-t-the-same",
      "title": "Lot Size vs Margin: Why They Aren't the Same",
      "paragraphs": [
        [
          {
            "text": "Margin is collateral required to support a leveraged position."
          }
        ],
        [
          {
            "text": "Lot size determines the underlying quantity, while leverage and the broker's margin requirement determine how much collateral is needed."
          }
        ],
        [
          {
            "text": "Suppose one standard lot of EUR/USD represents 100,000 EUR."
          }
        ],
        [
          {
            "text": "At an illustrative EUR/USD rate of 1.1000, the USD notional value is $110,000."
          }
        ],
        [
          {
            "text": "Under a simple 1:50 leverage model, required margin would be:"
          }
        ],
        [
          {
            "text": "$110,000 ÷ 50 = $2,200."
          }
        ],
        [
          {
            "text": "At 1:100, the simplified requirement would fall to $1,100, assuming those leverage levels are permitted."
          }
        ],
        [
          {
            "text": "The position still controls the same underlying currency amount."
          }
        ],
        [
          {
            "text": "The higher leverage changes the required collateral, not the number of currency units."
          }
        ],
        [
          {
            "text": "Use the "
          },
          {
            "text": "Forex Margin Calculator",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": " when evaluating the collateral implications of a proposed volume."
          }
        ]
      ]
    },
    {
      "id": "can-you-trade-nano-lots",
      "title": "Can You Trade Nano Lots?",
      "paragraphs": [
        [
          {
            "text": "A conventional nano lot is 100 base units, or 0.001 standard lots. It may fall below an account’s order minimum. The converter preserves the exact amount and reports incompatibility separately. Any displayed lower or upper grid alternative changes exposure; the tool never silently replaces your requested quantity."
          }
        ]
      ]
    },
    {
      "id": "how-broker-contract-sizes-can-differ",
      "title": "How Broker Contract Sizes Can Differ",
      "paragraphs": [
        [
          {
            "text": "Configured platform lots use the entered contract multiplier. For a 10,000-unit platform contract, two platform lots equal 20,000 base units or 0.20 conventional standard lots. They do not equal two conventional standard lots."
          }
        ],
        [
          {
            "text": "Cent accounts and other instruments can use different conventions. Check the actual contract and volume increment before translating a journal or placing an order."
          }
        ]
      ]
    },
    {
      "id": "common-forex-lot-conversion-mistakes",
      "title": "Common Forex Lot Conversion Mistakes",
      "paragraphs": [
        [
          {
            "text": "Do not confuse 0.10 with 0.01 lots: those amounts differ tenfold. Avoid treating lots as the required deposit, applying forex multipliers to metals or indices, assuming every mathematical quantity is permitted, or mistaking base for quote currency. EUR/USD base units are euros, not dollars."
          }
        ],
        [
          {
            "text": "The converter supports ordinary forex conventions and at most 1,000,000,000,000 base units per scenario. Optional pip conversion can be unavailable while the unit conversion remains valid; missing rates are reported rather than replaced with a factor of one. Non-forex contracts need their own specifications."
          }
        ]
      ]
    },
    {
      "id": "why-this-calculator-is-useful-for-beginners-and-experienced-traders",
      "title": "Why This Calculator Is Useful for Beginners and Experienced Traders",
      "paragraphs": [
        [
          {
            "text": "Use the converter to translate journals, compare platform quantity formats or inspect symbol specifications. A proposed 0.015 configured lots can be mathematically valid but incompatible with a 0.01 minimum and 0.01 step."
          }
        ],
        [
          {
            "text": "The grid is anchored at the entered minimum. Lower and upper alternatives show their own base units and respect the optional maximum. Compatibility describes your entered rules; it is not broker permission or a recommendation to increase volume."
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
            "text": "Combine the exact converted quantity with pip value, stop distance, costs and margin to assess exposure before considering an order. Verify the broker’s actual contract and order terms; a volume conversion alone cannot establish suitability."
          }
        ],
        [
          {
            "text": "Read the "
          },
          {
            "text": "CFTC’s forex guidance",
            "href": "https://www.cftc.gov/LearnAndProtect/forexfrauds"
          },
          {
            "text": " for leveraged-trading and provider risks."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "How many currency units are in 0.10 forex lots?",
      "answer": "Under a conventional 100,000-unit standard forex contract, 0.10 lots represents 10,000 units of the base currency."
    },
    {
      "question": "Is 0.01 lot a micro lot?",
      "answer": "Yes. A conventional micro lot is 0.01 standard lots, equivalent to 1,000 base-currency units."
    },
    {
      "question": "Can I convert forex lots into money?",
      "answer": "You can convert lots into base-currency units, then use the exchange rate to calculate notional value in another currency. The amount of margin required or potential profit depends on additional factors."
    }
  ]
};
