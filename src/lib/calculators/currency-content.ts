import type { CalculatorDefinition } from "./catalog";
export const currencyDefinition: CalculatorDefinition = {
  "keyword": "currency converter",
  "title": "Currency Converter – Exchange Rates & Fees",
  "description": "Currency converter with manual, daily and historical reference rates. Compare provider quotes, bid/ask directions and fees to estimate the amount you receive.",
  "heading": "Currency Converter",
  "intro": "Converting a deposit, trading profit, or everyday payment requires more than choosing two currencies. Enter an amount and a verified or manually supplied rate to see the reference conversion, then compare any provider markup or transaction fees with the amount you would actually receive.",
  "quickAnswer": "Converted amount = Source amount × Target-currency units per source unit. At a hypothetical rate of 1 USD = 3,700 UGX, $100 = UGX 370,000 before fees. A bank, broker, or mobile-money provider may use a different executable rate; always check the rate direction, timestamp, and charges.",
  "steps": [
    "Enter the source amount and choose source and target currencies.",
    "Select manual, dated daily or historical reference mode; inspect the actual observation dates.",
    "For manual quotes, choose direct, inverse or two-leg cross quotation and enter the required prices.",
    "Optionally enter a provider quote or rate reduction and clearly denominated fees.",
    "Compare the reference, provider and net amounts; use an actual credited amount to inspect its effective rate."
  ],
  "sections": [
    {
      "id": "what-is-a-currency-converter",
      "title": "What Is a Currency Converter?",
      "paragraphs": [
        [
          {
            "text": "A currency converter translates an amount into another currency using a specified quotation. Travelers, businesses and traders can use the arithmetic, but the correct rate depends on the task. A transaction’s documented rate, a dated reference and a provider’s current offer answer different questions."
          }
        ],
        [
          {
            "text": "The selected currencies must have a supported conversion path. If a rate is missing, the tool requests a manual input instead of treating the currencies as equal. Same-currency amounts use a factor of one; separately entered fees can still reduce the result."
          }
        ]
      ]
    },
    {
      "id": "how-to-use-the-currency-converter",
      "title": "How to Use the Currency Converter",
      "paragraphs": [
        [
          {
            "text": "Choose source and target currencies, then enter an amount. Daily mode requests the previous completed UTC day from the reference service; observation dates can differ by currency. Historical mode requests your selected date. Neither mode is a live broker quote."
          }
        ],
        [
          {
            "text": "Manual mode accepts a single quotation or separate bid and ask prices. Advanced settings compare a provider rate, a percentage reduction in target units received, or an actual credited amount. Reversing currencies preserves a simple quote’s mathematical orientation while clearing provider adjustments and fees. Cross quotes must be re-entered after reversing; actual retail buying and selling rates can differ."
          }
        ]
      ]
    },
    {
      "id": "understanding-exchange-rates",
      "title": "Understanding Exchange Rates",
      "paragraphs": [
        [
          {
            "text": "A quotation of EUR/USD 1.1000 means one euro is worth 1.10 dollars under that price convention. EUR 100 × 1.10 = USD 110. At the exact mathematical inverse, USD 110 ÷ 1.10 = EUR 100."
          }
        ],
        [
          {
            "text": "These are idealized calculations before transaction costs. Do not multiply by 1.10 in both directions. The interface labels each leg as units of the quote currency per one base unit, and shows the conversion path so you can inspect the operation."
          }
        ]
      ]
    },
    {
      "id": "what-is-the-mid-market-exchange-rate",
      "title": "What Is the Mid-Market Exchange Rate?",
      "paragraphs": [
        [
          {
            "text": "The midpoint is halfway between bid and ask. At 1.0998 bid and 1.1002 ask, it is (1.0998 + 1.1002) ÷ 2 = 1.1000. That benchmark is not automatically available for a retail transaction."
          }
        ],
        [
          {
            "text": "A published daily reference is also not necessarily an intraday midpoint at your transaction time. "
          },
          {
            "text": "Official reference-rate documentation",
            "href": "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"
          },
          {
            "text": " states its purpose and publication convention. Compare a provider’s directional quote with a suitable benchmark and label both dates; a difference alone does not prove misconduct or an independently listed commission."
          }
        ]
      ]
    },
    {
      "id": "bid-and-ask-rates-in-currency-conversion",
      "title": "Bid and Ask Rates in Currency Conversion",
      "paragraphs": [
        [
          {
            "text": "Suppose a provider buys USD at UGX 3,680 and sells USD at UGX 3,720. Selling USD 100 receives UGX 368,000 before fees. Buying USD 100 costs UGX 372,000."
          }
        ],
        [
          {
            "text": "Our sell-source calculation uses "
          },
          {
            "text": "direct bid or inverse ask",
            "href": "https://www.metatrader5.com/en/terminal/help/trading/general_concept"
          },
          {
            "text": ". The mathematical inverse of the bid is not a substitute for the provider’s ask. With a cross conversion, both legs need consistent price direction and observation times; an apparently favorable cross rate may not be available from one provider."
          }
        ]
      ]
    },
    {
      "id": "example-converting-usd-to-ugx",
      "title": "Example: Converting USD to UGX",
      "paragraphs": [
        [
          {
            "text": "To estimate the UGX needed to buy USD 200, an illustrative reference of 3,700 UGX per dollar gives UGX 740,000. A provider asking 3,750 requires UGX 750,000 before other fees: UGX 10,000 more."
          }
        ],
        [
          {
            "text": "This buying example differs from selling dollars for shillings. Enter the direction that matches your transaction and use the provider’s applicable side. All rates here are hypothetical. These calculations do not establish broker deposit availability, payment-route eligibility or permission to transfer funds offshore."
          }
        ]
      ]
    },
    {
      "id": "example-converting-eur-to-usd",
      "title": "Example: Converting EUR to USD",
      "paragraphs": [
        [
          {
            "text": "At 1.1200 USD per EUR, EUR 500 has a reference value of USD 560. A provider offering 1.1150 instead yields USD 557.50 before separate charges: USD 2.50 less."
          }
        ],
        [
          {
            "text": "Enter that actual provider quote to compare both amounts. Alternatively, the reduction mode applies an explicit percentage haircut to target units received. It does not infer an unknown provider markup. Do not add a haircut when the entered provider quote already includes the same adjustment."
          }
        ]
      ]
    },
    {
      "id": "how-currency-conversion-fees-work",
      "title": "How Currency Conversion Fees Work",
      "paragraphs": [
        [
          {
            "text": "Fees can be embedded in a quote or charged separately. This tool allows a percentage fee and a fixed fee in either source or target currency. It applies the percentage first, adds the fixed fee, and rejects charges exceeding the amount available in that currency."
          }
        ],
        [
          {
            "text": "For target fees, UGX 500,000 less 1% and UGX 2,000 becomes UGX 493,000. For source fees, USD 100 less 1% and USD 2 leaves USD 97 to convert. At 3,700 UGX/USD, that becomes UGX 358,900. Different billing sequences need separate checking."
          }
        ]
      ]
    },
    {
      "id": "converting-forex-profits-into-account-currency",
      "title": "Converting Forex Profits Into Account Currency",
      "paragraphs": [
        [
          {
            "text": "Trading P&L is commonly expressed first in the pair’s quote currency. A USD/JPY gain of JPY 16,000 equals USD 100 at an illustrative 160 JPY per USD. The actual account credit depends on the broker’s applicable rate and charges."
          }
        ],
        [
          {
            "text": "Use a relevant closing-time rate when reconstructing an old transaction, rather than applying today’s quotation. The "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " also models direction, contract size, entry/exit prices and separately charged trading costs. A cash converter alone cannot reconstruct the entire trade."
          }
        ]
      ]
    },
    {
      "id": "currency-converter-vs-forex-pip-calculator",
      "title": "Currency Converter vs Forex Pip Calculator",
      "paragraphs": [
        [
          {
            "text": "The currency converter translates cash amounts. The "
          },
          {
            "text": "forex pip calculator",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " values a specified price increment at a trading volume. A conventional USD/JPY standard lot has a JPY 1,000 pip value; converting that amount into USD is only one part of the position calculation."
          }
        ],
        [
          {
            "text": "For a planned trade, use the "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " to connect stop distance, converted pip value and a chosen cash-risk budget. Conversion alone neither establishes a suitable deposit nor limits leveraged losses."
          }
        ]
      ]
    },
    {
      "id": "cross-currency-conversion",
      "title": "Cross-Currency Conversion",
      "paragraphs": [
        [
          {
            "text": "When a direct quote is unavailable, a two-leg path can connect the currencies. At EUR/USD 1.10 and USD/UGX 3,700, one EUR equals 1.10 × 3,700 = 4,070 UGX; EUR 100 therefore equals UGX 407,000 before fees."
          }
        ],
        [
          {
            "text": "The path is EUR → USD → UGX. Check both observation dates and whether each price is a bid, ask or single reference. Missing legs cause an input error. Different provider routing, charges or execution times can change the actual credited amount."
          }
        ]
      ],
      "table": {
        "headers": [
          "Illustrative source amount",
          "Quoted path",
          "Before fees"
        ],
        "rows": [
          [
            "USD 100",
            "USD/UGX 3,700",
            "UGX 370,000"
          ],
          [
            "USD 250",
            "USD/UGX 3,700",
            "UGX 925,000"
          ],
          [
            "EUR 100",
            "EUR/USD 1.10",
            "USD 110"
          ],
          [
            "EUR 100",
            "EUR/USD 1.10; USD/UGX 3,700",
            "UGX 407,000"
          ]
        ]
      }
    },
    {
      "id": "live-rates-vs-historical-rates",
      "title": "Live Rates vs Historical Rates",
      "paragraphs": [
        [
          {
            "text": "The connected service provides "
          },
          {
            "text": "dated daily references",
            "href": "https://frankfurter.dev/"
          },
          {
            "text": ", not streaming quotes. Its provider and original dates appear with every used leg. A daily observation over four days old is flagged; retrieval time is separate from observation time."
          }
        ],
        [
          {
            "text": "Historical requests use observations on or before the chosen day. Weekends and holidays can return earlier dates, and coverage varies. A failed historical request does not substitute today’s rate. The server’s warm fallback is keyed by requested date; it is not a durable historical database. If a suitable reference is missing, enter a documented quote in manual mode."
          }
        ]
      ]
    },
    {
      "id": "currency-conversion-for-mobile-money-deposits",
      "title": "Currency Conversion for Mobile Money Deposits",
      "paragraphs": [
        [
          {
            "text": "A provider may exchange local-currency funds into a differently denominated account. Compare the amount actually deducted with the amount actually credited, including any charges. The optional credited-amount field calculates observed target units per source unit; it does not connect to a wallet or bank account."
          }
        ],
        [
          {
            "text": "“Free deposit” does not establish a zero conversion cost. Confirm the final quotation, payee and fees through official channels. A calculation does not establish that a mobile-money method or offshore leveraged-account transfer is permitted for your residence."
          }
        ]
      ]
    },
    {
      "id": "common-currency-conversion-mistakes",
      "title": "Common Currency Conversion Mistakes",
      "paragraphs": [
        [
          {
            "text": "Avoid multiplying when division is needed, reversing the wrong side of a retail quote, or treating a midpoint as a guaranteed execution price. Check fee denomination and whether the rate already includes a markup."
          }
        ],
        [
          {
            "text": "Also check observation dates, especially when using two different sources or reconstructing historical trading P&L. A zero source amount has no meaningful effective exchange rate; the calculator reports that limitation instead of dividing by zero. Display rounding is separate from a provider’s billing-rounding policy."
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
            "text": "A useful currency converter explains the quotation, direction, date and fees behind the answer. Compare the selected reference with the provider’s net amount, then confirm real transaction terms independently. For forex charges, combine this conversion with the "
          },
          {
            "text": "forex commission calculator",
            "href": "/calculators/forex-commission-calculator"
          },
          {
            "text": "; for collateral estimates, use the "
          },
          {
            "text": "forex margin calculator",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": ". Neither calculation establishes broker eligibility or a guaranteed execution outcome."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "How do I convert USD to UGX?",
      "answer": "Multiply the USD amount by the applicable UGX-per-USD exchange rate. The actual amount received may differ because of the provider's rate and fees."
    },
    {
      "question": "Why does my bank give a different exchange rate?",
      "answer": "Banks and payment providers may incorporate a markup into the exchange rate or charge separate transaction fees. The mid-market rate is a reference rather than a guaranteed retail execution rate."
    },
    {
      "question": "Can I use the currency converter for forex trading profits?",
      "answer": "Yes, provided you use the appropriate rate and currency direction. For a complete trading result, account for the instrument, closing P&L currency, and applicable broker conversion charges."
    }
  ],
  "slug": "currency-converter",
  "path": "/calculators/currency-converter",
  "kind": "currency",
  "card": "Convert dated or manual quotes, compare provider rates and model clearly denominated fees."
};
