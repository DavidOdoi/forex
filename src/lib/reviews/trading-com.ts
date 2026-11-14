import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyTradingComResearch(review: BrokerReview) {
  if (review.broker.slug !== "trading-com" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.trading.com/";
  const { common, set } = prepareResearchedRecord(review, "Trading.com group; US forex and regional retail CFD accounts kept separate", "2026-11-14", [
    { id: "tc-us", title: "US T1 forex account and US$50 minimum", url: "https://www.trading.com/us/t1-account" },
    { id: "tc-uk", title: "UK CFD account, pricing and £50 minimum", url: "https://www.trading.com/uk/cfd-trading-account" },
    { id: "tc-eu", title: "EU CFD and eligible investment accounts", url: "https://www.trading.com/eu/cfd-trading-account" },
    { id: "tc-au", title: "Australian CFD account specifications", url: "https://www.trading.com/au/cfd-trading-account" },
    { id: "tc-reg", title: "US RFED and NFA membership disclosure", url: "https://www.trading.com/us/regulation" },
    { id: "tc-uk-reg", title: "UK FCA entity and permissions disclosure", url: "https://www.trading.com/uk/regulation" },
    { id: "tc-eu-reg", title: "EU company and CySEC disclosure", url: "https://www.trading.com/eu/regulation" },
    { id: "tc-au-reg", title: "Australian company and ASIC disclosure", url: "https://www.trading.com/au/regulation" },
    { id: "tc-platform", title: "Trading.com MetaTrader 5, web and mobile access", url: "https://www.trading.com/us/mt5" },
  ]);
  set("minimum-deposit", "US T1 US$50; UK £50; EU €50; Australia A$50.", ["tc-us", "tc-uk", "tc-eu", "tc-au"]);
  set("forex-commission-per-lot", "Reviewed standard accounts: no separate dealing commission; spreads remain.", ["tc-us", "tc-uk", "tc-eu"]);
  set("forex-spread-and-commission", "The reviewed T1/CFD accounts use spread-based dealing without a separate standard commission. UK/EU pages advertise a 0.6-pip average figure without establishing a guaranteed EUR/USD average. Compare the actual pair, session, size and financing; no measured spread or execution result is claimed here.", ["tc-us", "tc-uk", "tc-eu"]);
  set("overnight-financing", "US forex positions can incur overnight rollover; the international CFD pages list applicable swaps. Zero dealing commission does not remove financing, conversion or payment-provider charges. Read your assigned entity’s current fee agreement, including any dormancy provisions.", ["tc-us", "tc-uk", "tc-eu"]);
  set("regulation-and-entity", "Trading.com identifies US CFTC/NFA member 0516820, UK FCA 705428, Cyprus CySEC 256/14 and Australian AFSL 443670 companies. These are separate provider-reported permissions; independent register confirmation remains outstanding.", ["tc-reg", "tc-uk-reg", "tc-eu-reg", "tc-au-reg"]);
  set("contracting-legal-entity", "US T1 is a retail forex service, not access to the international CFD menu. Confirm the legal company, product permission and client classification during registration; group regulation does not make all regional products available worldwide.", ["tc-reg", "tc-us", "tc-uk", "tc-eu"]);
  set("regulation-summary", "Separate CFTC/NFA, FCA, CySEC and ASIC companies; confirm your contract.", ["tc-reg", "tc-uk-reg", "tc-eu-reg", "tc-au-reg"]);
  set("deposit-methods-and-charges", "Regional minimums: US$50/£50/€50/A$50. Check funding methods, conversion and external charges for your entity; an entry amount is not a risk budget.", ["tc-us", "tc-uk", "tc-eu", "tc-au"]);
  set("withdrawal-methods-and-charges", "No live withdrawal or universal fee schedule was independently checked. Read your company’s current payment rules and receiving-provider charges; US and international terms differ.", ["tc-reg", "tc-uk-reg", "tc-eu-reg", "tc-au-reg"]);
  set("identity-and-address-requirements", "Register and verify email, mobile number and identity as requested. Confirm residence, assigned company, final agreement and product permissions before funding.", ["tc-eu", "tc-uk"]);
  set("demo-account", "Demo access is offered; paper trading is not a live execution test.", ["tc-platform"]);
  set("supported-mobile-platforms", "Trading.com app and MT5 mobile; regional features differ.", ["tc-platform", "tc-us"]);
  set("platform-and-availability", "The reviewed platform lineup lists WebTrader, the Trading.com app and MetaTrader 5. MT5 supports Expert Advisor workflows, subject to account compatibility. A familiar charting interface is not proof of direct third-party TradingView account integration.", ["tc-platform", "tc-us"]);
  set("platform-summary", "WebTrader / Trading.com app / MT5; check regional compatibility.", ["tc-platform"]);
  set("real-stocks-and-etfs", "The EU page distinguishes a separate long-only shares/ETF investment account from leveraged CFDs, subject to country availability. That does not give the US forex account access to underlying securities or international CFDs.", ["tc-eu", "tc-us"]);
  set("cfds-and-underlying-markets", "US T1 focuses on forex. International CFD pages cover forex, shares, indices and commodities; eligible EU crypto CFDs and investment services follow local restrictions. A share CFD does not confer underlying ownership.", ["tc-us", "tc-uk", "tc-eu"]);
  set("leverage-by-product-and-region", "UK/EU retail CFD pages list leverage up to 30:1, with instrument-specific limits. Do not transfer that figure to US forex, professional or other regional accounts.", ["tc-uk", "tc-eu"]);
  set("market-summary", "US: forex. Eligible international accounts: CFDs.", ["tc-us", "tc-eu"]);
  set("investment-summary", "Separate eligible EU shares/ETF investment account.", ["tc-eu"]);
  set("retail-leverage-summary", "UK/EU: up to 1:30; instrument limits apply.", ["tc-uk", "tc-eu"]);
  const base = { ...common, commission: "No separate standard dealing commission", spread: "Variable; confirm live instrument", platforms: "Regional web / app / MT5", roundTripCommission: "Spread, rollover and other fees remain" };
  review.accountComparisons = [
    { ...base, name: "US T1", category: "US retail forex", minimum: "US$50", sourceIds: ["tc-us", "tc-platform"] },
    { ...base, name: "UK CFD", category: "Eligible UK retail clients", minimum: "£50", sourceIds: ["tc-uk"] },
    { ...base, name: "EU CFD", category: "Eligible EU retail clients", minimum: "€50", sourceIds: ["tc-eu"] },
    { ...base, name: "Australia CFD", category: "Eligible Australian clients", minimum: "A$50", sourceIds: ["tc-au"] },
  ];
  review.quickFactFields = [
    { label: "Starting deposits", fieldId: "minimum-deposit", state: "text" },
    { label: "Standard pricing", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "UK/EU retail leverage", fieldId: "retail-leverage-summary", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Demo access", fieldId: "demo-account", state: "yes" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "US versus international", fieldId: "market-summary", state: "text" },
    { label: "Eligible investments", fieldId: "investment-summary", state: "text" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["Trading.com is worth comparing for spread-based forex pricing and MT5 alongside its own web/mobile tools.", "The regional starting deposits are US$50, £50, €50 and A$50; US forex and international CFDs are different offerings.", "Confirm your company, available products, financing and non-trading fees before applying."], sourceIds: ["tc-us", "tc-uk", "tc-eu", "tc-au", "tc-platform"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Identifiable US forex service", explanation: "The US company discloses CFTC registration and NFA membership.", sourceIds: ["tc-reg"] },
    { title: "Published starting deposits", explanation: "Regional pages distinguish account currencies and entry amounts.", sourceIds: ["tc-us", "tc-uk", "tc-eu", "tc-au"] },
    { title: "Spread-based standard accounts", explanation: "No separate standard dealing commission is listed.", sourceIds: ["tc-us", "tc-uk"] },
    { title: "MT5 plus proprietary access", explanation: "Choose compatible web, mobile and desktop workflows.", sourceIds: ["tc-platform"] },
    { title: "Separate investing route", explanation: "Eligible EU clients can compare underlying shares/ETFs with CFDs.", sourceIds: ["tc-eu"] },
  ];
  review.limitations = [
    { title: "No raw account in reviewed lineup", explanation: "Standard spread-based pricing may not suit every strategy.", sourceIds: ["tc-us", "tc-uk"] },
    { title: "US product restrictions", explanation: "International CFDs are not the US T1 offering.", sourceIds: ["tc-us", "tc-eu"] },
    { title: "Overnight charges", explanation: "Rollover/swaps remain despite zero dealing commission.", sourceIds: ["tc-us", "tc-uk"] },
    { title: "Average spread caveat", explanation: "The 0.6 headline is not a guaranteed EUR/USD quote.", sourceIds: ["tc-uk", "tc-eu"] },
    { title: "Payment checks remain", explanation: "Withdrawal arrival and a global fee schedule were not tested.", sourceIds: ["tc-reg", "tc-uk-reg"] },
  ];
  review.entities = [
    { name: "Trading.com Markets Inc.", country: "United States", regulator: "CFTC / NFA", licence: "0516820", sourceId: "tc-reg" },
    { name: "Trading.com Markets UK Limited", country: "United Kingdom", regulator: "FCA", licence: "705428", sourceId: "tc-uk-reg" },
    { name: "Trading.com Markets EU Ltd", country: "Cyprus", regulator: "CySEC", licence: "256/14", sourceId: "tc-eu-reg" },
    { name: "Trading.com Markets Pty Ltd", country: "Australia", regulator: "ASIC", licence: "443670", sourceId: "tc-au-reg" },
  ];
  review.faqs[1] = { question: "Is Trading.com regulated?", answer: "Trading.com identifies separate US, UK, Cyprus and Australian companies. Verify your contract’s company and product permissions in the relevant register. Group licences do not extend every product or protection to your account.", sourceIds: ["tc-reg", "tc-uk-reg", "tc-eu-reg", "tc-au-reg"] };
  review.faqs[5] = { question: "What is Trading.com’s minimum deposit?", answer: "Published starting amounts: US T1 US$50, UK £50, EU €50, Australia A$50. These are not recommended risk budgets; payment, margin and eligibility requirements apply.", sourceIds: ["tc-us", "tc-uk", "tc-eu", "tc-au"] };
  review.faqs[6] = { question: "Can US Trading.com customers trade CFDs?", answer: "US T1 is forex-focused and does not establish access to the international CFD lineup. Regional companies use different agreements, products and protections; confirm the US entity’s permissions before funding.", sourceIds: ["tc-us", "tc-reg", "tc-eu"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/trading.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current score/count was verified. Match customer accounts to the regional entity." };
  review.accountOpening = { ...common, url: "https://www.trading.com/us/t1-account", status: "verified", sourceIds: ["tc-us"], isAffiliate: false };
}
