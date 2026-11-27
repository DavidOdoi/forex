import type { CalculatorDefinition } from "./catalog";
export const notionalDefinition: CalculatorDefinition = {
  "slug": "forex-notional-value-calculator",
  "path": "/calculators/forex-notional-value-calculator",
  "kind": "notional",
  "keyword": "forex notional value calculator",
  "title": "Forex Notional Value Calculator – Exposure & Margin",
  "heading": "Forex Notional Value Calculator",
  "description": "Forex notional value calculator: convert lots into base, quote and account-currency exposure, then compare margin and effective leverage under your inputs.",
  "card": "Measure underlying forex exposure in three currency views and distinguish it from margin.",
  "intro": "The amount of margin you deposit is usually much smaller than the full currency position you control. See that underlying exposure clearly by converting your lot size into base-currency units and an account-currency value. This helps distinguish trade size from required collateral and planned stop-loss risk.",
  "quickAnswer": "Base-currency notional = Lots × Contract size. For one conventional standard lot of EUR/USD, that is 100,000 EUR. At EUR/USD 1.1000, the quote-currency notional is $110,000. If permitted leverage is 1:50, a simplified margin estimate is $2,200—not the full exposure or a maximum-loss amount.",
  "steps": [
    "Select the pair, account currency and configured lots or base units.",
    "Enter the contract multiplier and a relevant notional reference price.",
    "Supply a conversion quote if the account currency requires one.",
    "Optionally add a simple margin assumption and equity; inspect exposure separately from collateral and stop risk."
  ],
  "sections": [
    {
      "id": "what-the-forex-notional-value-calculator-shows",
      "title": "What the forex notional value calculator shows",
      "paragraphs": [
        [
          {
            "text": "Notional value describes the underlying amount represented by a position. A margin deposit is a separate collateral requirement. A trader can commit a relatively small amount of margin while controlling a much larger currency exposure, and an adverse move acts on that exposure rather than on the deposit alone."
          }
        ],
        [
          {
            "text": "This calculator starts with configured lots or base-currency units. It then shows the base amount, the equivalent quote amount at your reference price and the value expressed in account currency. Optional margin and equity inputs add separate comparisons without redefining the underlying trade size."
          }
        ]
      ]
    },
    {
      "id": "begin-with-the-contract-multiplier",
      "title": "Begin with the contract multiplier",
      "paragraphs": [
        [
          {
            "text": "A conventional standard forex lot commonly represents 100,000 base-currency units. One EUR/USD standard lot therefore represents EUR 100,000. A 0.10-lot position represents EUR 10,000, and 0.01 lots represents EUR 1,000 under that convention."
          }
        ],
        [
          {
            "text": "Contract definitions can differ, particularly when moving outside ordinary forex products or using platform-specific formats. The multiplier is editable and remains an assumption unless you check the symbol specification. The "
          },
          {
            "text": "forex lot size converter",
            "href": "/calculators/forex-lot-size-converter"
          },
          {
            "text": " explains configured lots versus conventional standard, mini, micro and nano equivalents."
          }
        ]
      ],
      "formula": "Base-currency notional = Configured lots × Base units per configured lot."
    },
    {
      "id": "translate-base-units-into-quote-currency",
      "title": "Translate base units into quote currency",
      "paragraphs": [
        [
          {
            "text": "A forex price is quote-currency units per one base unit. Multiply base notional by the reference price to obtain quote notional. With EUR 100,000 and EUR/USD 1.1000, the equivalent is USD 110,000. The two amounts express one position, not two independent positions to add together."
          }
        ],
        [
          {
            "text": "A USD/JPY position starts from USD base units and produces a JPY equivalent at the entered price. The currency labels matter: a numerical amount without its denomination can conceal a substantial error. The tool keeps the base, quote and account labels visible beside their values."
          }
        ]
      ],
      "table": {
        "headers": [
          "Position",
          "Base notional",
          "Reference quote",
          "Quote notional"
        ],
        "rows": [
          [
            "EUR/USD, 1 standard lot",
            "EUR 100,000",
            "1.1000 USD per EUR",
            "USD 110,000"
          ],
          [
            "EUR/USD, 0.10 standard lots",
            "EUR 10,000",
            "1.1000 USD per EUR",
            "USD 11,000"
          ],
          [
            "USD/JPY, 1 standard lot",
            "USD 100,000",
            "150 JPY per USD",
            "JPY 15,000,000"
          ]
        ]
      }
    },
    {
      "id": "relate-the-formula-to-other-contract-types-carefully",
      "title": "Relate the formula to other contract types carefully",
      "paragraphs": [
        [
          {
            "text": "MetaTrader’s margin calculation reference",
            "href": "https://www.metatrader5.com/en/terminal/help/trading_advanced/margin_forex"
          },
          {
            "text": " shows why symbol-specific contract modes matter. For ordinary forex contracts, base units derive from volume and contract size. That same multiplier and valuation rule should not be assumed for a different instrument."
          }
        ],
        [
          {
            "text": "This page supports its listed forex pairs and entered forex specifications. It does not price options, inverse contracts, stock-index points, metals or crypto instruments. Those products can have different tick values, currency relationships and payoff rules. Choosing a familiar number such as 100,000 does not make another instrument compatible with this model."
          }
        ]
      ]
    },
    {
      "id": "account-currency-can-change-the-presentation",
      "title": "Account currency can change the presentation",
      "paragraphs": [
        [
          {
            "text": "For a USD account holding EUR/USD, quote notional is already expressed in account currency. For a EUR account, the base units directly provide the EUR notional; no extra conversion is required for that particular presentation. The reference price still determines the equivalent USD quote amount."
          }
        ],
        [
          {
            "text": "A third account currency needs another conversion. The calculator explicitly uses the liability-side convention of the entered direct, inverse or supported two-leg quote. This is a stated valuation assumption, not a promise that a broker uses the same price or conversion charge for collateral. Review the displayed conversion before comparing amounts."
          }
        ]
      ]
    },
    {
      "id": "choose-a-meaningful-observation-price",
      "title": "Choose a meaningful observation price",
      "paragraphs": [
        [
          {
            "text": "Use a price relevant to the exposure you are measuring. The initial EUR/USD 1.1000 is a hypothetical example, not a live quotation. If a position is being valued at a current market snapshot, use a consistent observation time for both the instrument price and any account-currency conversion."
          }
        ],
        [
          {
            "text": "A daily FX reference used for conversion is not a live executable bid or ask. Weekend dates, source coverage and stale observations can affect suitability. The tool shows the returned source information rather than inventing a current price. It does not silently turn the manually entered instrument reference into verified market data."
          }
        ]
      ]
    },
    {
      "id": "margin-is-a-fraction-of-exposure-under-the-simple-model",
      "title": "Margin is a fraction of exposure under the simple model",
      "paragraphs": [
        [
          {
            "text": "Under a fixed-leverage assumption, margin equals account-currency notional divided by permitted leverage. USD 110,000 at 1:50 requires USD 2,200. A 2% margin-rate input produces the same result because 1 divided by 50 equals 0.02."
          }
        ],
        [
          {
            "text": "Changing permitted leverage changes this modelled collateral amount, not the size of the unchanged currency position. "
          },
          {
            "text": "IG’s margin explanation",
            "href": "https://www.ig.com/en/glossary-trading-terms/margin-definition"
          },
          {
            "text": " distinguishes exposure from the amount paid to open a leveraged trade. Real requirements still depend on the product, legal entity, account classification, tiers and platform rules."
          }
        ]
      ],
      "table": {
        "headers": [
          "Entered leverage",
          "Equivalent margin rate",
          "Margin on USD 110,000"
        ],
        "rows": [
          [
            "1:20",
            "5%",
            "USD 5,500"
          ],
          [
            "1:30",
            "About 3.333333%",
            "About USD 3,666.67"
          ],
          [
            "1:50",
            "2%",
            "USD 2,200"
          ],
          [
            "1:100",
            "1%",
            "USD 1,100"
          ]
        ]
      }
    },
    {
      "id": "turn-the-margin-estimate-off-when-it-is-not-needed",
      "title": "Turn the margin estimate off when it is not needed",
      "paragraphs": [
        [
          {
            "text": "Exposure can be measured without selecting a margin assumption. Choose exposure-only mode when you want to translate volume or compare base and quote amounts. Hidden leverage fields are then ignored rather than becoming an unnecessary condition for calculating notional."
          }
        ],
        [
          {
            "text": "For a fuller collateral workflow, use the "
          },
          {
            "text": "forex margin calculator",
            "href": "/calculators/forex-margin-calculator"
          },
          {
            "text": ". It can compare an entered account snapshot and used margin. This page does not establish sufficient free margin, predict which order will be accepted or determine a liquidation price. Its optional result is a standalone simple requirement."
          }
        ]
      ]
    },
    {
      "id": "effective-leverage-needs-an-equity-reference",
      "title": "Effective leverage needs an equity reference",
      "paragraphs": [
        [
          {
            "text": "Effective leverage compares exposure with account equity. With USD 110,000 notional and USD 10,000 equity, the ratio is 11:1. This differs from the broker-permitted 1:50 ratio used to estimate collateral. A permitted maximum does not tell you how much leverage the selected position actually uses."
          }
        ],
        [
          {
            "text": "The equity field is optional. At zero or negative equity, a conventional positive-equity ratio is unavailable, while notional remains a meaningful exposure measurement. The "
          },
          {
            "text": "forex leverage calculator",
            "href": "/calculators/forex-leverage-calculator"
          },
          {
            "text": " provides a dedicated comparison of exposure, equity, permitted leverage and margin assumptions."
          }
        ]
      ]
    },
    {
      "id": "notional-is-not-the-planned-stop-loss-amount",
      "title": "Notional is not the planned stop-loss amount",
      "paragraphs": [
        [
          {
            "text": "The same notional can have different losses at different adverse price moves. For one conventional EUR/USD lot in a USD account, a 20-pip move is USD 200 before additional costs; a 100-pip move is USD 1,000. Neither figure is automatically equal to required margin or notional value."
          }
        ],
        [
          {
            "text": "Use the "
          },
          {
            "text": "forex pip calculator",
            "href": "/calculators/forex-pip-calculator"
          },
          {
            "text": " for movement exposure and the "
          },
          {
            "text": "forex lot size calculator",
            "href": "/calculators/forex-lot-size-calculator"
          },
          {
            "text": " to connect volume with an entered stop-risk budget. A stop can slip or gap. No number on this page establishes the largest possible realised loss or a suitable position for your circumstances."
          }
        ]
      ]
    },
    {
      "id": "buying-and-selling-share-an-absolute-exposure-convention",
      "title": "Buying and selling share an absolute exposure convention",
      "paragraphs": [
        [
          {
            "text": "The calculator reports positive notional magnitude without asking whether the position is long or short. Direction determines which price movements create a gain or loss; it does not change the absolute base units represented by an unchanged volume at a given reference price."
          }
        ],
        [
          {
            "text": "For opposing positions, keep net and gross exposure separate. Equal buys and sells can leave considerable gross open volume even when net base units cancel. The "
          },
          {
            "text": "forex hedge calculator",
            "href": "/calculators/forex-hedge-calculator"
          },
          {
            "text": " illustrates that distinction and requires explicit margin assumptions instead of inferring zero collateral from a matched book."
          }
        ]
      ]
    },
    {
      "id": "compare-sizes-with-consistent-specifications",
      "title": "Compare sizes with consistent specifications",
      "paragraphs": [
        [
          {
            "text": "The comparison table uses the same instrument, contract multiplier, reference and conversion for each configured-lot amount. It shows how underlying exposure and any simple margin result scale with volume. These rows are hypothetical alternatives, not recommendations to increase a trade."
          }
        ],
        [
          {
            "text": "Do not compare one row based on standard lots with another based on a smaller platform contract without checking units. The tool calculates exposure for an entered amount but does not certify the broker’s minimum volume, lot step or maximum position. A numerically valid amount can still be unavailable for execution."
          }
        ]
      ]
    },
    {
      "id": "keep-the-estimate-reproducible",
      "title": "Keep the estimate reproducible",
      "paragraphs": [
        [
          {
            "text": "Record the pair, contract multiplier, price, conversion direction and observation date when using a result in a journal. If the broker reports a different amount, first check whether it uses another valuation price, denomination, tier or symbol specification. A small margin deposit alone does not prove the calculated notional is wrong."
          }
        ],
        [
          {
            "text": "The calculation keeps unrounded values internally and rounds amounts only for display. Reset restores the public example. Copied settings omit position size, reference price and equity so recipients supply their own financial values. Copying a result does not connect to an account, submit an order or certify its risk."
          }
        ]
      ]
    }
  ],
  "faqs": [
    {
      "question": "Is notional value the amount I must deposit?",
      "answer": "No. Notional is underlying exposure. A leveraged account may require a smaller collateral amount, determined by its margin rules. Neither the deposit nor the displayed margin automatically limits the trade’s possible loss."
    },
    {
      "question": "Why do base and quote notionals have different numbers?",
      "answer": "A forex price expresses quote units per base unit. EUR 100,000 at EUR/USD 1.1000 equals USD 110,000. They describe the same currency position in different denominations and should not be added as separate trades."
    },
    {
      "question": "Does higher permitted leverage reduce notional?",
      "answer": "No. For unchanged size, contract and reference price, notional stays unchanged. A higher permitted leverage ratio reduces margin only under the simple fixed-leverage assumption; actual account rules can differ."
    }
  ]
};
