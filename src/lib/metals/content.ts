export type HubKind = "gold" | "comparison";
export const editorialDate = "2026-11-07";
export const hubPaths = ["/gold-price", "/gold-silver-prices"];
export const hubs = {
  gold: {
    path: "/gold-price", title: "Gold Price Today: Live XAU/USD, Charts & Calculator",
    description: "Check the gold price today per ounce, gram and kilo in USD, ZAR, EUR and GBP. View XAU/USD charts, compare recent changes and estimate your gold’s spot value.",
    heading: "Gold price today", subheading: "One clear price. Every useful conversion.",
    intro: "Check the gold price today in USD per troy ounce. Convert to grams, kilos or another currency, and estimate your gold’s spot value.",
    image: "/images/metals/gold-price-today-conversion-guide.png",
    imageAlt: "Gold price today conversion guide: one troy ounce equals 31.1034768 grams; one kilogram equals 1,000 grams",
    faqs: [
      { question: "What is the current gold price per ounce?", answer: "The price card at the top shows the latest available USD quote for one troy ounce. Check its UTC timestamp and status before using it. If the feed is unavailable or stale, we label it rather than substitute an invented current price." },
      { question: "How is the gold spot price determined?", answer: "Spot gold is traded through a global over-the-counter market. Quotes reflect bids and offers between market participants; there is no single exchange price for every transaction. The LBMA Gold Price is a separate benchmark set at scheduled auctions." },
      { question: "Why does the gold price change?", answer: "Changes in the dollar, real interest rates, investor flows and demand for physical gold can move prices. News and thin liquidity can amplify moves. These influences interact, so one economic release does not guarantee a particular direction." },
      { question: "What is the difference between spot gold and physical gold?", answer: "Spot is a wholesale market reference for metal. A physical coin or bar has an actual purchase or resale price, which can include a premium, dealer spread, taxes, delivery and storage. Jewellery also includes workmanship and may contain less than pure gold." },
      { question: "How do I calculate the value of my gold?", answer: "Multiply the weight in troy ounces by the spot price and purity fraction. For grams, divide the weight by 31.1034768 first. For example, 18-karat gold has a theoretical purity of 18/24, or 75%. An assay and dealer quote determine what you can actually receive." },
      { question: "Is the gold price the same as the XAU/USD price?", answer: "XAU/USD normally means US dollars for one troy ounce of gold. A broker’s instrument can have its own spread, trading hours and contract rules, so its executable quote may differ from this indicative spot feed." },
      { question: "Can I trade gold without buying physical gold?", answer: "Depending on your location and eligibility, exchange-traded products, futures and CFDs can provide gold exposure. They have different ownership rights, fees and risks. Leveraged derivatives can cause rapid losses; check the product and legal entity before opening an account." },
    ],
  },
  comparison: {
    path: "/gold-silver-prices", title: "Gold & Silver Prices Today: Live Spot Charts & Ratio",
    description: "Compare gold and silver spot prices in USD and ZAR. View charts, check the gold-silver ratio, compare performance and calculate the spot value of either metal.",
    heading: "Gold and silver spot prices", subheading: "Two metals. A clearer comparison.",
    intro: "Compare gold and silver spot prices in USD per troy ounce. Check both metals, estimate their value and see how many silver ounces equal one gold ounce.",
    image: "/images/metals/gold-silver-price-comparison-dashboard.png",
    imageAlt: "Gold and silver spot prices ratio diagram: gold per troy ounce divided by silver per troy ounce",
    faqs: [
      { question: "What are the current gold and silver spot prices?", answer: "Use the two price cards above for the latest available indicative quotes. Both are USD per troy ounce, with separate UTC timestamps. Currency conversions use dated daily reference rates, so they are estimates rather than executable local-market offers." },
      { question: "What is the gold-silver ratio?", answer: "Divide the gold price per troy ounce by the silver price per troy ounce in the same currency. A hypothetical ratio of 80 means one ounce of gold has the spot value of 80 ounces of silver. We suppress the current ratio if either quote is stale or their timestamps are too far apart." },
      { question: "Why do gold and silver prices move together?", answer: "Both respond to dollar moves, interest rates and investment demand. Silver also has substantial industrial uses, so manufacturing and technology demand can pull it away from gold. Their correlation changes over time." },
      { question: "Is silver more volatile than gold?", answer: "Silver often has larger percentage swings, partly because its market is smaller and industrial demand matters more. That is a tendency, not a promise for every period. Compare percentage changes over matching dates rather than the metals’ dollar prices." },
      { question: "What is the difference between spot price and dealer price?", answer: "Spot is a metal-market reference. A dealer’s price reflects the particular product, premium or discount, buy-sell spread, taxes and delivery costs. The same budget can buy different quantities from different dealers." },
      { question: "Can I trade gold and silver without buying physical metal?", answer: "Some regulated markets offer metal-backed exchange-traded products, futures or CFDs. Availability depends on your country and provider. These products differ in ownership, margin, financing and counterparty exposure; CFDs do not give you ownership of bullion." },
    ],
  },
} as const;
