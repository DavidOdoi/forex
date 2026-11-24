import type { CalculatorDefinition } from "./catalog";
export const breakEvenDefinition: CalculatorDefinition = {
  "slug": "forex-break-even-calculator",
  "path": "/calculators/forex-break-even-calculator",
  "kind": "breakeven",
  "keyword": "forex break even calculator",
  "title": "Forex Break Even Calculator – Price, Pips & Fees",
  "heading": "Forex Break Even Calculator",
  "description": "Forex break even calculator: find the closing bid or ask needed to recover commission and financing, combine weighted entries, and check price-grid rounding.",
  "card": "Find a cost-adjusted closing price for one entry or a weighted basket.",
  "intro": "A forex break even calculator shows the closing price a trade needs to reach to recover its costs without making a net profit or loss. It considers your entry price, position size, direction, and additional expenses such as commissions and overnight swap fees. This is particularly useful when you want to move a stop loss toward break-even, manage several positions, or determine how much favorable price movement is needed to cover trading costs. Enter your trade details into the calculator above to find your estimated break-even price in seconds.",
  "quickAnswer": "For a buy, add additional quote-currency costs divided by base units to the executable entry; for a sell, subtract them. One EUR/USD lot entered at 1.10000 with USD 7 commission needs a closing bid of 1.10007 for a buy, or a closing ask of 1.09993 for a sell. Those are theoretical levels under the entered assumptions. Positive financing credits reduce the recovery needed. Actual entry fills already incorporate the opening bid/ask convention; do not add spread twice. The tool also shows a directionally rounded price and can combine same-direction entries by volume.",
  "steps": [
    "Choose the pair, account currency, direction and contract specification. Enter one volume and actual opening fill, or enable a weighted basket of up to twenty same-direction entries.",
    "Select executable-entry or midpoint mode. Midpoint mode requires an assumed constant symmetric spread; the result distinguishes the executable exit from its midpoint.",
    "Choose one charging currency for all costs. Enter combined commission, additional exit costs not already counted, and signed accrued swap: positive credit or negative charge.",
    "Supply a conversion where needed. Review the theoretical exit, price-grid rounded level and cost recovery in pips before using the result to evaluate an order."
  ],
  "sections": [
    {
      "id": "what-does-break-even-mean-in-forex-trading",
      "title": "Forex break even calculator: gross and net prices",
      "paragraphs": [
        [
          {
            "text": "A trade reaches net break-even when its price movement recovers the applicable costs without generating an additional gain. Gross break-even ignores those separate charges. Closing at the original entry price can therefore leave a net loss once commissions or financing are included."
          }
        ],
        [
          {
            "text": "Several entries at different prices require a volume-weighted entry, not a simple average. This tool combines only the same pair and direction. It does not net opposing hedges, separate instruments or positions using incompatible contract multipliers."
          }
        ]
      ],
      "formula": "Buy closing bid = executable entry + quote costs / units; sell closing ask = executable entry − quote costs / units"
    },
    {
      "id": "understanding-bid-and-ask-prices",
      "title": "Understanding Bid and Ask Prices",
      "paragraphs": [
        [
          {
            "text": "Bid is normally the price at which you sell to the broker; "
          },
          {
            "text": "ask is the price at which you buy",
            "href": "https://www.metatrader5.com/en/terminal/help/trading/general_concept"
          },
          {
            "text": ". Their difference is the spread. At the illustrative quote below, a buy opens at 1.10010 and would immediately close at 1.10000 if the market quote stayed unchanged: a one-pip gross loss."
          }
        ],
        [
          {
            "text": "Executable-entry mode does not add a separate spread. Mid-price mode assumes a constant symmetric spread: half adjusts the opening midpoint into an entry fill, and half separates the closing fill from its midpoint. The result labels both closing prices. Changing spreads require a fresh scenario."
          }
        ]
      ],
      "table": {
        "headers": [
          "Quote component",
          "Illustrative EUR/USD price"
        ],
        "rows": [
          [
            "Bid",
            "1.10000"
          ],
          [
            "Ask",
            "1.10010"
          ],
          [
            "Spread",
            "0.00010 = 1 pip"
          ]
        ]
      }
    },
    {
      "id": "example-break-even-price-for-a-eur-usd-buy",
      "title": "Example: Break-Even Price for a EUR/USD Buy",
      "paragraphs": [
        [
          {
            "text": "Suppose a trader buys one "
          },
          {
            "text": "standard lot",
            "href": "/calculators/forex-lot-size-converter"
          },
          {
            "text": " of EUR/USD at an executable ask price of 1.10000."
          }
        ],
        [
          {
            "text": "The position represents 100,000 EUR."
          }
        ],
        [
          {
            "text": "The broker charges $3.50 commission on entry and $3.50 on exit, making the total round-trip commission $7."
          }
        ],
        [
          {
            "text": "$7 ÷ 100,000 = 0.00007 USD per EUR."
          }
        ],
        [
          {
            "text": "1.10000 + 0.00007 = 1.10007."
          }
        ],
        [
          {
            "text": "The trade therefore needs a closing executable bid price of 1.10007 to generate approximately zero net P&L under these assumptions."
          }
        ],
        [
          {
            "text": "This is a 0.7-pip favorable movement measured from the executed entry price."
          }
        ],
        [
          {
            "text": "Notice that the calculation does not assume the broker's spread is a separate $10 charge. The actual entry and exit prices already account for the bid/ask mechanics."
          }
        ]
      ]
    },
    {
      "id": "example-break-even-price-for-a-sell-trade",
      "title": "Example: Break-Even Price for a Sell Trade",
      "paragraphs": [
        [
          {
            "text": "Now suppose the trader sells one standard lot of EUR/USD at an executable bid price of 1.10000."
          }
        ],
        [
          {
            "text": "The additional round-trip commission is again $7."
          }
        ],
        [
          {
            "text": "A sell position benefits when the currency pair's price falls."
          }
        ],
        [
          {
            "text": "Therefore, the closing executable ask must be sufficiently below the entry price to cover the commission."
          }
        ],
        [
          {
            "text": "1.10000 − 0.00007 = 1.09993."
          }
        ],
        [
          {
            "text": "The estimated break-even closing ask is 1.09993."
          }
        ],
        [
          {
            "text": "If the closing ask is higher than that, the trade has not yet recovered the modeled commission."
          }
        ],
        [
          {
            "text": "If it is lower, the position has positive net P&L under the same assumptions."
          }
        ]
      ]
    },
    {
      "id": "how-commission-affects-break-even",
      "title": "How Commission Affects Break-Even",
      "paragraphs": [
        [
          {
            "text": "Forex brokers may charge commissions on a per-side or round-trip basis."
          }
        ],
        [
          {
            "text": "For example, a commission advertised as $3.50 per standard lot per side means $3.50 when the trade opens and another $3.50 when it closes."
          }
        ],
        [
          {
            "text": "A rate advertised as $7 round turn already refers to both sides and should not be doubled."
          }
        ],
        [
          {
            "text": "For a conventional EUR/USD standard lot in a USD account, one pip is worth $10."
          }
        ],
        [
          {
            "text": "A $7 commission therefore equals 0.7 pips of price movement."
          }
        ],
        [
          {
            "text": "For a 0.10-lot position, the pip value is $1. If the commission also scales proportionally with volume, its pip-equivalent effect remains the same."
          }
        ],
        [
          {
            "text": "Fixed minimum commissions can change that relationship for small positions."
          }
        ]
      ]
    },
    {
      "id": "how-swap-fees-affect-break-even",
      "title": "How Swap Fees Affect Break-Even",
      "paragraphs": [
        [
          {
            "text": "A position held overnight may incur "
          },
          {
            "text": "financing charges",
            "href": "/calculators/forex-swap-calculator"
          },
          {
            "text": " or receive financing credits."
          }
        ],
        [
          {
            "text": "These are commonly called swaps or rollover adjustments."
          }
        ],
        [
          {
            "text": "Suppose a EUR/USD buy position initially requires a $7 commission recovery."
          }
        ],
        [
          {
            "text": "After several nights, it has accumulated another $3 in swap charges."
          }
        ],
        [
          {
            "text": "The total additional cost becomes $10."
          }
        ],
        [
          {
            "text": "For one standard lot:"
          }
        ],
        [
          {
            "text": "$10 ÷ 100,000 = 0.00010."
          }
        ],
        [
          {
            "text": "The break-even exit price becomes 1.10010 if the original executable entry was 1.10000."
          }
        ],
        [
          {
            "text": "The required price movement has increased from 0.7 pips to 1 pip."
          }
        ],
        [
          {
            "text": "If the position instead earns a $2 financing credit, the remaining net cost falls to $5, and the required movement becomes 0.5 pips."
          }
        ],
        [
          {
            "text": "Because swap rates can change, use an accrued amount or an explicitly assumed future amount; do not mix them."
          }
        ]
      ]
    },
    {
      "id": "calculating-break-even-for-multiple-positions",
      "title": "Calculating Break-Even for Multiple Positions",
      "paragraphs": [
        [
          {
            "text": "Suppose you buy 0.50 lots of EUR/USD at 1.1000 and another 0.50 lots at 1.1020."
          }
        ],
        [
          {
            "text": "(1.1000 × 0.50 + 1.1020 × 0.50) ÷ 1.00 = 1.1010."
          }
        ],
        [
          {
            "text": "Before additional costs, 1.1010 is the combined gross break-even executable exit price under the simplified same-direction model."
          }
        ],
        [
          {
            "text": "If the positions have unequal sizes, the larger position contributes more to the average."
          }
        ],
        [
          {
            "text": "For example, 0.20 lots at 1.1000 and 0.80 lots at 1.1020 have a weighted-average entry of 1.1016."
          }
        ],
        [
          {
            "text": "It must also account for all commissions and financing costs when determining the net break-even level."
          }
        ],
        [
          {
            "text": "This feature is useful for understanding exposure, but adding to a losing position can increase risk substantially."
          }
        ]
      ]
    },
    {
      "id": "break-even-stop-loss-vs-break-even-price",
      "title": "Break-Even Stop Loss vs Break-Even Price",
      "paragraphs": [
        [
          {
            "text": "A break-even price is a calculation."
          }
        ],
        [
          {
            "text": "A break-even stop loss is an actual trading order placed at a selected level."
          }
        ],
        [
          {
            "text": "A trader may move their stop loss to their original entry after price has moved favorably. If costs apply, that stop might still result in a small net loss."
          }
        ],
        [
          {
            "text": "Even when the stop is placed at the calculated net break-even price, execution is not guaranteed at that level."
          }
        ],
        [
          {
            "text": "During fast markets, the actual fill can differ from the requested stop price."
          }
        ],
        [
          {
            "text": "Therefore, moving a stop to break-even does not guarantee that the completed trade will have exactly zero loss."
          }
        ],
        [
          {
            "text": "The calculator can help identify a theoretical level, but it cannot eliminate execution uncertainty."
          }
        ]
      ]
    },
    {
      "id": "why-your-broker-s-break-even-price-may-differ",
      "title": "Why Your Broker's Break-Even Price May Differ",
      "paragraphs": [
        [
          {
            "text": "Differences can arise from conversion timing, commissions charged in another currency, changing spreads, additional financing, contract multipliers, "
          },
          {
            "text": "minimum price increments",
            "href": "https://www.mql5.com/en/docs/constants/environment_state/marketinfoconstants"
          },
          {
            "text": " and settlement rounding. The result holds the entered conversion rate fixed and cannot automatically reproduce a broker’s statement."
          }
        ],
        [
          {
            "text": "All entered commission, additional exit costs and signed financing share the selected cost currency. Quote-currency costs are netted in quote currency. Account-currency costs are divided by the conversion side applicable to the gross gain or loss needed to offset them. Do not divide by a reference rate of one unless currencies actually match."
          }
        ]
      ]
    },
    {
      "id": "common-break-even-calculation-mistakes",
      "title": "Common Break-Even Calculation Mistakes",
      "paragraphs": [
        [
          {
            "text": "A common mistake is treating the chart's midpoint as the executable entry price."
          }
        ],
        [
          {
            "text": "Another is forgetting the commission charged when closing the trade."
          }
        ],
        [
          {
            "text": "Some traders double-count the spread, especially when their input already uses executed bid and ask prices."
          }
        ],
        [
          {
            "text": "Others calculate a simple average entry when their positions have different sizes."
          }
        ],
        [
          {
            "text": "A further mistake is ignoring accrued swap costs when holding a position over several nights."
          }
        ],
        [
          {
            "text": "Finally, a trader might calculate a price with six or seven decimal places even though the instrument only permits a specific price increment."
          }
        ],
        [
          {
            "text": "The theoretical price and configured-grid rounded level are shown separately. A buy exit rounds up; a sell exit rounds down, avoiding a modeled loss caused solely by rounding. The decimal grid is configurable; verify a broker’s actual tick increment."
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
            "text": "Use break-even to evaluate fee recovery, inspect a combined entry or consider an order adjustment. It cannot choose the best account on its own: actual spreads, commission schedules, financing and execution quality still need comparison."
          }
        ],
        [
          {
            "text": "Read "
          },
          {
            "text": "IG’s pip definition",
            "href": "https://www.ig.com/en/glossary-trading-terms/pip-definition"
          },
          {
            "text": " for the pip/point distinction, and the "
          },
          {
            "text": "CFTC’s forex risk guidance",
            "href": "https://www.cftc.gov/LearnAndProtect/forexfrauds"
          },
          {
            "text": " for execution and provider risks. Optional currency conversions use "
          },
          {
            "text": "Frankfurter’s dated reference rates",
            "href": "https://frankfurter.dev/"
          },
          {
            "text": ", not live broker quotes."
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
            "text": "A forex break-even calculator helps turn trading costs into an understandable closing price."
          }
        ],
        [
          {
            "text": "Use it to evaluate the effect of commissions, swaps, spread conventions, and multiple entries before changing orders or making trading decisions."
          }
        ],
        [
          {
            "text": "The calculation is an estimate based on your inputs. Actual fills and costs can differ, particularly during volatile market conditions."
          }
        ],
        [
          {
            "text": "Recheck a proposed exit with the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": " and size exposure with the "
          },
          {
            "text": "forex lot-size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": ". Use the "
          },
          {
            "text": "pip-value calculator",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " when converting costs to pips."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "What is the break-even price in forex?",
      "answer": "It is the executable closing price at which a position's modeled net profit or loss equals zero after relevant commissions, financing charges, and other costs or credits."
    },
    {
      "question": "Does spread affect my forex break-even price?",
      "answer": "Yes. The bid/ask spread affects executable entry and exit prices. If those executable prices are already entered, the spread effect must not be added a second time."
    },
    {
      "question": "Can I calculate break-even for multiple forex entries?",
      "answer": "Yes. Use a volume-weighted average entry price for compatible positions, then account for the combined trading costs and position size."
    }
  ]
};
