import type {CalculatorDefinition}from"./catalog";
export const fibonacciDefinition:CalculatorDefinition={
  "slug": "fibonacci-calculator",
  "path": "/calculators/fibonacci-calculator",
  "kind": "fibonacci",
  "keyword": "fibonacci retracement calculator",
  "title": "Fibonacci Retracement Calculator – Forex & Extensions",
  "heading": "Fibonacci Retracement Calculator for Forex Trading",
  "description": "Fibonacci retracement calculator: find directional pullback and two-point extension prices, customize ratios, and compare distances from a reference price.",
  "card": "Calculate directional swing levels with explicit two-point anchors and ratios.",
  "intro": "Once you’ve identified a meaningful price swing, Fibonacci levels help map possible pullback and extension prices without manual measuring. Enter the swing high and low and select the direction to see the commonly watched ratios. The levels are chart references, not predictions that price will reverse there.",
  "quickAnswer": "For an upward swing, Retracement price = Swing high − (High − Low) × Ratio. If EUR/USD rises from 1.1000 to 1.1500, its 61.8% retracement is 1.1191. For a downward swing, add the retracement distance to the swing low. The familiar 50% level is a midpoint, not a Fibonacci-derived ratio.",
  "steps": [
    "Choose the original swing direction and enter its high and low. For an upward movement, low is the start; for a downward movement, high is the start.",
    "Set display decimals and edit retracement or extension percentages if needed. The lists allow up to 20 ratios each; percentages are entered as 23.6, not 0.236.",
    "Optionally enter a manual reference price. Choose conventional forex pip distances or an explicitly configured generic price-unit size for gold or other price charts.",
    "Review the anchors, proportional retracement bars, tables and signed distances. Copy the assumptions with the levels and check the convention before comparing charting tools."
  ],
  "sections": [
    {
      "id": "what-is-fibonacci-retracement-in-forex",
      "title": "Fibonacci retracement calculator: anchors and direction",
      "paragraphs": [
        [
          {
            "text": "A retracement marks a proportional pullback within a selected earlier movement. After an upward swing, levels lie below its high; after a downward swing, they lie above its low. They organize possible support/resistance references, not a currency’s true value or a physical rule for future prices."
          }
        ],
        [
          {
            "text": "Price can pass through any level without reacting. A line’s popularity does not establish its reliability. Select anchors consistently and evaluate a proposed trade’s risk separately."
          }
        ],
        [
          {
            "text": "For the charting convention, see "
          },
          {
            "text": "TradingView’s Fibonacci retracement documentation",
            "href": "https://www.tradingview.com/support/solutions/43000518158-fibonacci-retracement-drawing-tool/"
          },
          {
            "text": " and "
          },
          {
            "text": "BabyPips’ Fibonacci retracement explanation",
            "href": "https://www.babypips.com/learn/forex/fibonacci-retracement"
          },
          {
            "text": ". Compare their drawing settings with the explicit two-point formulas here."
          }
        ]
      ]
    },
    {
      "id": "main-fibonacci-retracement-levels",
      "title": "Main Fibonacci Retracement Levels",
      "paragraphs": [
        [
          {
            "text": "The most widely watched retracement percentages are 23.6%, 38.2%, 50%, 61.8%, and 78.6%."
          }
        ],
        [
          {
            "text": "Each represents a different depth of pullback relative to the selected swing."
          }
        ],
        [
          {
            "text": "A 23.6% retracement is relatively shallow."
          }
        ],
        [
          {
            "text": "A 38.2% retracement represents a moderate pullback."
          }
        ],
        [
          {
            "text": "The 50% level marks the midpoint of the move."
          }
        ],
        [
          {
            "text": "A 61.8% retracement is deeper, and the 78.6% level is closer to a complete retracement."
          }
        ],
        [
          {
            "text": "The 50% level is commonly included in Fibonacci tools even though it is not a ratio derived directly from the Fibonacci sequence."
          }
        ],
        [
          {
            "text": "Some charting platforms also display 76.4% instead of 78.6%."
          }
        ],
        [
          {
            "text": "Edit the comma-separated ratio lists to include alternatives such as 76.4%; the selected percentages remain visible."
          }
        ],
        [
          {
            "text": "The levels are potential areas of interest, not objectively reliable turning points."
          }
        ]
      ]
    },
    {
      "id": "fibonacci-retracement-example-using-eur-usd",
      "title": "Fibonacci Retracement Example Using EUR/USD",
      "paragraphs": [
        [
          {
            "text": "Suppose EUR/USD rises from 1.1000 to 1.1500."
          }
        ],
        [
          {
            "text": "The upward swing measures 500 pips."
          }
        ],
        [
          {
            "text": "The retracement prices are:"
          }
        ],
        [
          {
            "text": "The 0% retracement marks the end of the original upward swing, while 100% returns to its starting level."
          }
        ],
        [
          {
            "text": "A trader observing a pullback toward 1.1309 might examine whether other technical information supports the significance of that price."
          }
        ],
        [
          {
            "text": "For example, a prior support zone or a moving average could coincide with the same area."
          }
        ],
        [
          {
            "text": "However, the presence of multiple indicators does not guarantee that the level will hold."
          }
        ],
        [
          {
            "text": "Levels retain unrounded internal values; display decimals are configurable. A calculated price is not a confirmed entry signal."
          }
        ]
      ],
      "table": {
        "headers": [
          "Retracement",
          "EUR/USD Price"
        ],
        "rows": [
          [
            "0%",
            "1.1500"
          ],
          [
            "23.6%",
            "1.1382"
          ],
          [
            "38.2%",
            "1.1309"
          ],
          [
            "50%",
            "1.1250"
          ],
          [
            "61.8%",
            "1.1191"
          ],
          [
            "78.6%",
            "1.1107"
          ],
          [
            "100%",
            "1.1000"
          ]
        ]
      }
    },
    {
      "id": "fibonacci-retracement-in-a-downtrend",
      "title": "Fibonacci Retracement in a Downtrend",
      "paragraphs": [
        [
          {
            "text": "The calculation changes direction when analyzing a falling market."
          }
        ],
        [
          {
            "text": "Suppose EUR/USD declines from 1.1500 to 1.1000."
          }
        ],
        [
          {
            "text": "The original move is still 500 pips."
          }
        ],
        [
          {
            "text": "But the retracement now moves upward from the swing low."
          }
        ],
        [
          {
            "text": "The 38.2% level is:"
          }
        ],
        [
          {
            "text": "1.1000 + (0.0500 × 0.382) = 1.1191."
          }
        ],
        [
          {
            "text": "The 61.8% retracement is:"
          }
        ],
        [
          {
            "text": "1.1000 + (0.0500 × 0.618) = 1.1309."
          }
        ],
        [
          {
            "text": "These levels represent potential resistance references during a recovery within the prior downward move."
          }
        ],
        [
          {
            "text": "The mathematical proportions are identical to those used for an uptrend."
          }
        ],
        [
          {
            "text": "Only the direction changes."
          }
        ],
        [
          {
            "text": "Select the original swing direction before interpreting a level."
          }
        ],
        [
          {
            "text": "Without that distinction, a correct percentage can produce a misleading price level."
          }
        ]
      ]
    },
    {
      "id": "what-are-fibonacci-extensions",
      "title": "What Are Fibonacci Extensions?",
      "paragraphs": [
        [
          {
            "text": "Fibonacci extensions project potential price levels beyond the end of the selected swing."
          }
        ],
        [
          {
            "text": "Retracements measure movement back inside the original range."
          }
        ],
        [
          {
            "text": "Extensions measure distances beyond that range in the direction of the original move."
          }
        ],
        [
          {
            "text": "Popular extension ratios include 127.2%, 161.8%, 200%, and 261.8%."
          }
        ],
        [
          {
            "text": "For an upward movement, the following anchor convention can be used:"
          }
        ],
        [
          {
            "text": "Extension price = Swing low + (Swing range × Extension ratio)"
          }
        ],
        [
          {
            "text": "For a downward movement:"
          }
        ],
        [
          {
            "text": "Extension price = Swing high − (Swing range × Extension ratio)"
          }
        ],
        [
          {
            "text": "Using the EUR/USD upward swing from 1.1000 to 1.1500:"
          }
        ],
        [
          {
            "text": "The 127.2% extension is:"
          }
        ],
        [
          {
            "text": "1.1000 + 0.0500 × 1.272 = 1.1636."
          }
        ],
        [
          {
            "text": "The 161.8% extension is:"
          }
        ],
        [
          {
            "text": "1.1000 + 0.0500 × 1.618 = 1.1809."
          }
        ],
        [
          {
            "text": "These levels are beyond the original swing high."
          }
        ],
        [
          {
            "text": "Extension percentages here are measured from the original swing start. Check the convention when comparing another platform."
          }
        ]
      ]
    },
    {
      "id": "fibonacci-extensions-vs-three-point-projections",
      "title": "Fibonacci Extensions vs Three-Point Projections",
      "paragraphs": [
        [
          {
            "text": "This tool uses two anchors. Its extensions measure a percentage of the original low-to-high or high-to-low range from the swing start. A three-point A–B–C projection instead applies a multiple of A–B from a separate pullback point C, so it can produce different prices."
          }
        ],
        [
          {
            "text": "Three-point projections are not implemented here. When comparing chart drawings, check the anchor count and ratio origin before assuming either calculation is wrong."
          }
        ]
      ]
    },
    {
      "id": "how-traders-use-fibonacci-levels",
      "title": "How Traders Use Fibonacci Levels",
      "paragraphs": [
        [
          {
            "text": "Fibonacci levels are commonly used to organize possible trade scenarios."
          }
        ],
        [
          {
            "text": "A trend-following trader might identify an upward swing and then examine whether price pulls back toward an area of previous support."
          }
        ],
        [
          {
            "text": "A short-term trader might compare a calculated retracement with a nearby price level that was important in earlier sessions."
          }
        ],
        [
          {
            "text": "Another trader may use an extension level as one possible profit target."
          }
        ],
        [
          {
            "text": "These applications do not imply that a calculated level automatically represents a good trade."
          }
        ],
        [
          {
            "text": "A trading setup still needs a defined entry, risk limit, potential reward, and a reason for expecting the market to behave in a particular way."
          }
        ],
        [
          {
            "text": "Our "
          },
          {
            "text": "Forex Risk Reward Ratio Calculator",
            "href": "/calculators/forex-risk-reward-calculator"
          },
          {
            "text": " can help evaluate the distance between a proposed entry, stop, and target."
          }
        ],
        [
          {
            "text": "The "
          },
          {
            "text": "Forex Lot Size Calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " can then translate the planned stop distance into monetary exposure."
          }
        ]
      ]
    },
    {
      "id": "how-to-choose-swing-highs-and-lows",
      "title": "How to Choose Swing Highs and Lows",
      "paragraphs": [
        [
          {
            "text": "Different anchors on the same chart produce different levels. A recent small swing and a multiweek movement can both be mathematically valid while describing different structures. Record a clear beginning, end, direction and chart context; use consistent price and timeframe conventions."
          }
        ],
        [
          {
            "text": "Avoid moving the anchors solely to make a level match a preferred entry. The calculator cannot determine whether the supplied prices represent meaningful market swings."
          }
        ]
      ]
    },
    {
      "id": "fibonacci-levels-on-different-timeframes",
      "title": "Fibonacci Levels on Different Timeframes",
      "paragraphs": [
        [
          {
            "text": "The same ratios can be applied to intraday, daily, weekly or longer swings. A 100-pip swing and a 1,000-pip swing produce different distances without making either universally more reliable. Use a movement relevant to the question and record its timeframe in the optional swing label."
          }
        ],
        [
          {
            "text": "An optional reference price is manual. Signed distances equal calculated level minus reference, divided by the selected pip or generic distance unit. They indicate how far a level lies above or below that reference, not future profit or a live quote."
          }
        ]
      ]
    },
    {
      "id": "fibonacci-calculator-for-gold-and-other-instruments",
      "title": "Fibonacci Calculator for Gold and Other Instruments",
      "paragraphs": [
        [
          {
            "text": "The proportional calculation also applies to other price charts. An illustrative upward gold swing from USD 4,000 to USD 4,100 has a USD 100 range: its 50% retracement is USD 4,050 and 61.8% is USD 4,038.20. These are price levels, not trade P&L."
          }
        ],
        [
          {
            "text": "Generic mode uses an explicitly entered price-distance unit. It does not assume a forex pip value, metal contract multiplier or minimum order. Non-positive arithmetic extensions from unusually wide swings are flagged outside this positive-price context. Check instrument-specific execution and "
          },
          {
            "text": "contract terms",
            "href": "https://www.mql5.com/en/docs/constants/environment_state/marketinfoconstants"
          },
          {
            "text": " separately."
          }
        ]
      ]
    },
    {
      "id": "common-fibonacci-trading-mistakes",
      "title": "Common Fibonacci Trading Mistakes",
      "paragraphs": [
        [
          {
            "text": "Check swing direction, meaningful anchors and ratio origin. A 61.8% retracement sits inside the original range, while a 161.8% extension under this convention lies beyond it.50% is a midpoint, not a Fibonacci-sequence ratio. None of these percentages guarantees a turning point."
          }
        ],
        [
          {
            "text": "Avoid moving anchors to fit a preferred entry or treating exact displayed decimals as executable prices. Spreads, price grids and order rules still apply. The 61.8% headline uses that conventional ratio even when your custom list omits it; tables reflect the ratios you entered."
          }
        ]
      ]
    },
    {
      "id": "when-is-the-fibonacci-calculator-most-useful",
      "title": "When Is the Fibonacci Calculator Most Useful?",
      "paragraphs": [
        [
          {
            "text": "Use the calculator to document selected swings, compare alternative ratios and copy consistent reference levels into notes. It shows the range, direction, retracements, extensions and formula steps. The benefit is transparent arithmetic from stated anchors, rather than guaranteed turning points."
          },
          {
            "text": " For completed-session price references, compare the "
          },
          {
            "text": "forex pivot point calculator",
            "href": "/calculators/forex-pivot-point-calculator"
          },
          {
            "text": "."
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
            "text": "The Fibonacci retracement calculator helps you convert meaningful price swings into clearly defined potential support, resistance, and extension levels."
          }
        ],
        [
          {
            "text": "Use the values to organize trading scenarios, compare price targets, and review potential risk."
          }
        ],
        [
          {
            "text": "The calculations are exact under the selected formula, but future market behavior remains uncertain."
          }
        ],
        [
          {
            "text": "Check movement exposure in the "
          },
          {
            "text": "forex pip calculator",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " and modeled exits in the "
          },
          {
            "text": "forex profit calculator",
            "href": "/calculators/forex-profit-calculator"
          },
          {
            "text": ". The "
          },
          {
            "text": "CFTC’s forex risk guidance",
            "href": "https://www.cftc.gov/LearnAndProtect/forexfrauds"
          },
          {
            "text": " explains why calculated levels cannot remove leveraged-trading risk."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "What are the most common Fibonacci retracement levels?",
      "answer": "Common levels include 23.6%, 38.2%, 50%, 61.8%, and 78.6%. The 50% level is widely used as a midpoint even though it is not a direct Fibonacci ratio."
    },
    {
      "question": "How do you calculate the 61.8% Fibonacci level?",
      "answer": "Multiply the swing range by 0.618. For an upward swing, subtract that amount from the swing high. For a downward swing, add it to the swing low."
    },
    {
      "question": "Do Fibonacci retracement levels always work?",
      "answer": "No. They are mathematical reference levels rather than guaranteed support or resistance. Price may cross any level without reversing."
    }
  ]
};
