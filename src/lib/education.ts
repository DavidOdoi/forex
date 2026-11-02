export const terms = [
  {
    slug: "ask",
    term: "Ask",
    category: "Pricing",
    definition:
      "The price at which a service offers to sell the base currency to you. It is normally higher than the bid price.",
  },
  {
    slug: "base-currency",
    term: "Base currency",
    category: "Fundamentals",
    definition:
      "The first currency in a currency pair. In EUR/USD, the euro is the base currency; the quote expresses its value in US dollars.",
  },
  {
    slug: "bid",
    term: "Bid",
    category: "Pricing",
    definition:
      "The price at which a service offers to buy the base currency from you. The difference between bid and ask is called the spread.",
  },
  {
    slug: "cfd",
    term: "CFD",
    category: "Products",
    definition:
      "A contract for difference: a derivative that settles the difference in a referenced asset’s price between opening and closing a position. It does not give ownership of the underlying asset.",
  },
  {
    slug: "currency-pair",
    term: "Currency pair",
    category: "Fundamentals",
    definition:
      "Two currencies quoted against each other, expressing the value of one in terms of the other. Buying one side of a pair means selling the other.",
  },
  {
    slug: "drawdown",
    term: "Drawdown",
    category: "Risk",
    definition:
      "A decline from a previous peak in an account’s or investment’s value. It can be expressed as an amount or as a percentage and does not measure every aspect of risk.",
  },
  {
    slug: "leverage",
    term: "Leverage",
    category: "Risk",
    definition:
      "Exposure to a position larger than the capital committed to it. Leverage magnifies the effect of price changes and can amplify losses as well as gains.",
  },
  {
    slug: "liquidity",
    term: "Liquidity",
    category: "Fundamentals",
    definition:
      "The ability to buy or sell without substantially affecting the price. Available liquidity can change with market conditions, the currency pair, and the time of day.",
  },
  {
    slug: "margin",
    term: "Margin",
    category: "Risk",
    definition:
      "Funds required to open or maintain a leveraged position. Margin is not a cap on your potential loss; account protections and obligations depend on the product, provider, and applicable rules.",
  },
  {
    slug: "market-order",
    term: "Market order",
    category: "Orders",
    definition:
      "An instruction to trade at the next available price. Execution price may differ from the price you saw, especially in fast-moving or less liquid markets.",
  },
  {
    slug: "pip",
    term: "Pip",
    category: "Pricing",
    definition:
      "A conventional unit used to describe a change in a currency quote. Many pairs use the fourth decimal place; pairs quoted in Japanese yen commonly use the second. Quote conventions vary.",
  },
  {
    slug: "quote-currency",
    term: "Quote currency",
    category: "Fundamentals",
    definition:
      "The second currency in a pair, used to express the price of the base currency. In EUR/USD, the US dollar is the quote currency.",
  },
  {
    slug: "slippage",
    term: "Slippage",
    category: "Orders",
    definition:
      "The difference between an expected execution price and the actual execution price. It may be favourable or unfavourable and can be significant in volatile conditions.",
  },
  {
    slug: "spread",
    term: "Spread",
    category: "Pricing",
    definition:
      "The difference between a currency pair’s bid and ask prices. It is one component of trading cost and may widen when liquidity falls or markets become volatile.",
  },
  {
    slug: "stop-loss",
    term: "Stop-loss",
    category: "Orders",
    definition:
      "An instruction intended to close a position if a specified price is reached. A standard stop does not guarantee the execution price; gaps and slippage can lead to larger losses.",
  },
  {
    slug: "swap",
    term: "Swap / overnight financing",
    category: "Pricing",
    definition:
      "A charge or credit that may apply when a position is held overnight. Its calculation, timing, and exceptions depend on the product and provider’s terms.",
  },
  {
    slug: "volatility",
    term: "Volatility",
    category: "Risk",
    definition:
      "The extent and speed of price variation over time. Higher volatility can make outcomes harder to predict and can increase execution and loss risks.",
  },
] as const;
export const faqs = [
  {
    category: "About Devin Forex",
    question: "What is Devin Forex?",
    answer:
      "Devin Forex is an educational publication focused on explaining forex concepts, risks, and the questions to ask about trading services. Our aim is to make complex topics easier to understand, without trading signals or promises of returns.",
  },
  {
    category: "About Devin Forex",
    question: "Are you a broker or a financial adviser?",
    answer:
      "No. We do not execute trades, open brokerage accounts, hold customer funds, or provide personalised financial advice. Our information does not take account of your individual financial circumstances.",
  },
  {
    category: "Learning & risk",
    question: "Where should I start if I’m new to forex?",
    answer:
      "Start with our learning hub: understand currency pairs, how costs and orders work, and how leverage affects risk. Use the glossary whenever you encounter an unfamiliar term. Reading educational content does not establish that trading is suitable for you.",
  },
  {
    category: "Learning & risk",
    question: "Does a demo account show what live trading will be like?",
    answer:
      "Not completely. A demo environment can help explain interface controls and order types, but simulated execution, pricing, liquidity, and emotional responses may differ from live conditions. Demo results do not establish likely live results.",
  },
  {
    category: "Learning & risk",
    question: "Can I lose more than I deposit?",
    answer:
      "That depends on the product, account terms, jurisdiction, and applicable protections. Do not assume negative-balance protection applies. Review contractual obligations and local rules before opening or funding an account.",
  },
  {
    category: "Learning & risk",
    question: "Do stop-loss orders eliminate risk?",
    answer:
      "No. Standard stop orders may execute at a different price from the stop level during market gaps or rapid changes. Their behaviour and any separately offered guarantees depend on the service’s terms.",
  },
  {
    category: "Our coverage",
    question: "Where are the broker reviews and comparisons?",
    answer:
      "Those sections are planned but not yet published. We will not fill them with invented ratings or recommendations. Our methodology page explains the framework intended to guide future coverage.",
  },
  {
    category: "Our coverage",
    question: "Do you currently use affiliate links?",
    answer:
      "No active affiliate links are included. We may introduce commercial relationships in the future. Those relationships will need clear disclosures alongside the affected content; see our Affiliate Disclosure for the current status.",
  },
  {
    category: "Our coverage",
    question: "How do I report an error or suggest a topic?",
    answer:
      "Our contact page explains the current contact status. The demonstration form only validates entries locally and does not send messages. A verified contact channel will be provided before message delivery launches.",
  },
] as const;
