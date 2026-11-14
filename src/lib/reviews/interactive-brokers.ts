import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyInteractiveBrokersResearch(review: BrokerReview) {
  if (review.broker.slug !== "interactive-brokers" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.interactivebrokers.com/";
  const { common, set } = prepareResearchedRecord(review, "Interactive Brokers group; individual brokerage and eligible spot-currency accounts", "2026-11-14", [
    { id: "ibkr-fx", title: "Spot-currency commission tiers and per-order minimums", url: "https://www.interactivebrokers.com/en/accounts/fees/fxcoms.php" },
    { id: "ibkr-min", title: "Individual account minimums and inactivity fees", url: "https://www.interactivebrokers.com/en/accounts/required-minimums.php" },
    { id: "ibkr-platform", title: "Desktop, browser, mobile and API platforms", url: "https://www.interactivebrokers.com/en/trading/trading-platforms.php" },
    { id: "ibkr-security", title: "Entity-specific client protection and limitations", url: "https://www.interactivebrokers.com/en/general/security-investor-protection.php" },
    { id: "ibkr-withdraw", title: "Two free withdrawal requests and third-party fees", url: "https://www.interactivebrokers.com/support/faq/content/am-being-charged-fee-first-1415070298" },
    { id: "ibkr-home", title: "Products, funding routes and group entities", url: "https://www.interactivebrokers.com/" },
    { id: "ibkr-forex", title: "Spot-currency service and eligibility disclosures", url: "https://www.interactivebrokers.com/en/trading/products-spot-currencies.php" },
    { id: "ibkr-signup", title: "Official Interactive Brokers application", url: "https://ndcdyn.interactivebrokers.com/Universal/Application" },
  ]);
  set("minimum-deposit", "Individual accounts: US$0; margin requirements separate.", ["ibkr-min"]);
  set("forex-commission-per-lot", "Manual spot FX: 0.20 bps of value; minimum US$2/order at first tier.", ["ibkr-fx"]);
  set("forex-spread-and-commission", "Manual spot-currency orders start at 0.20 basis points (0.002%) of trade value, minimum US$2 per order, plus the market spread. Opening and closing are separate orders. Higher volume tiers differ; the minimum makes small orders proportionately expensive. Automatic currency conversion has separate terms.", ["ibkr-fx"]);
  set("overnight-financing", "Borrowing, short positions and product-specific margin can add financing costs. Market-data subscriptions and other services may also cost extra; zero account minimum does not mean every service is free.", ["ibkr-home", "ibkr-platform"]);
  set("inactivity-fee", "The reviewed schedule lists US$0 inactivity fees for individual, joint, trust and organisational accounts. Broker, institutional and specialist connection arrangements have separate conditions.", ["ibkr-min"]);
  set("regulation-and-entity", "IBKR discloses multiple regulated companies, including Interactive Brokers LLC in the US, Interactive Brokers (U.K.) Limited and Interactive Brokers Ireland Limited. Entity, product and client classification determine the applicable protections; independent register checks remain outstanding.", ["ibkr-home", "ibkr-security"]);
  set("contracting-legal-entity", "Confirm the entity, account type and currency-trading permissions before depositing. A multi-currency securities account is not automatic permission for speculative leveraged forex, and cash conversion is a different use case.", ["ibkr-forex", "ibkr-home"]);
  set("client-money-arrangements", "SIPC protection described for eligible IBKR LLC securities accounts is not insurance against market losses or blanket coverage for forex, futures, other entities or all cash balances.", ["ibkr-security"]);
  set("regulation-summary", "Separate US, UK, Irish and other companies.", ["ibkr-home", "ibkr-security"]);
  set("deposit-methods-and-charges", "Use the funding instructions generated in Client Portal for your entity and currency. Bank/electronic-transfer routes differ by residence; do not assume the instant card-funding workflow of a CFD broker is available.", ["ibkr-home"]);
  set("withdrawal-methods-and-charges", "IBKR’s current FAQ allows two free withdrawal requests per calendar month. Subsequent requests have method/currency-specific fees. Banks and intermediaries can charge even within the allowance; unused requests do not carry over.", ["ibkr-withdraw"]);
  set("published-processing-times", "Check the selected method’s settlement and deposit-hold rules in Client Portal. A free withdrawal allowance does not guarantee immediate arrival or remove verification checks.", ["ibkr-withdraw", "ibkr-home"]);
  set("identity-and-address-requirements", "Provide the requested identity, tax, financial and experience information, then apply for relevant trading permissions. Check margin requirements separately from the US$0 ordinary account minimum. Lite/Pro availability depends on residence and client category.", ["ibkr-signup", "ibkr-min", "ibkr-home"]);
  set("demo-account", "Paper-trading tools are offered; simulated fills differ from live trading.", ["ibkr-platform"]);
  set("supported-mobile-platforms", "IBKR Mobile / GlobalTrader; eligibility applies.", ["ibkr-platform"]);
  set("platform-and-availability", "Trader Workstation, IBKR Desktop, Client Portal, mobile apps and APIs serve different workflows. Check each platform’s supported orders and products; this review includes no execution or usability test.", ["ibkr-platform"]);
  set("platform-summary", "TWS, IBKR Desktop, Client Portal, mobile and APIs.", ["ibkr-platform"]);
  set("real-stocks-and-etfs", "Eligible accounts offer underlying stocks/ETFs, options, futures and bonds alongside currencies. A securities purchase, cash conversion and leveraged derivative carry different ownership, margin and protection rules.", ["ibkr-home", "ibkr-forex"]);
  set("cfds-and-underlying-markets", "IBKR is a multi-asset securities broker, not simply a forex-CFD account. Spot currencies and eligible derivatives require their own permissions; products differ substantially by jurisdiction.", ["ibkr-home", "ibkr-forex"]);
  set("country-availability", "Check local forex permissions; ordinary US brokerage access does not establish eligibility for leveraged spot-currency trading.", ["ibkr-forex"]);
  set("investment-summary", "Eligible stocks, ETFs, options, futures and bonds.", ["ibkr-home"]);
  review.accountComparisons = [
    { ...common, name: "Individual cash account", category: "Securities / currency conversion", spread: "Market and product dependent", commission: "Product schedule; manual FX has per-order minimum", minimum: "US$0 account minimum; order limits apply", platforms: "IBKR platform suite", sourceIds: ["ibkr-min", "ibkr-fx", "ibkr-platform"] },
    { ...common, name: "Eligible margin / FX", category: "Approval and residency required", spread: "Market bid/ask; variable", commission: "First FX tier: 0.20 bps, min US$2/order", roundTripCommission: "Minimum US$4 for two orders; not a fixed per-lot tariff", minimum: "Separate equity / margin requirements", platforms: "Product-compatible IBKR platforms", sourceIds: ["ibkr-fx", "ibkr-forex", "ibkr-platform"] },
  ];
  review.quickFactFields = [
    { label: "Account minimum", fieldId: "minimum-deposit", state: "text" },
    { label: "Manual FX commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Inactivity", fieldId: "inactivity-fee", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Paper trading", fieldId: "demo-account", state: "yes" },
    { label: "Underlying investments", fieldId: "investment-summary", state: "text" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Forex eligibility", fieldId: "country-availability", state: "text" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["Interactive Brokers suits investors comparing multi-asset access and eligible spot-currency trading.", "Ordinary individual accounts have no account minimum or inactivity fee, but manual FX orders carry a US$2 minimum commission at the first tier.", "Check forex permissions and margin rules first; opening a securities account does not establish leveraged-FX eligibility."], sourceIds: ["ibkr-home", "ibkr-min", "ibkr-fx", "ibkr-forex"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Broad investment access", explanation: "Eligible securities, futures, bonds and currencies in one group.", sourceIds: ["ibkr-home"] },
    { title: "Published notional FX pricing", explanation: "Tiered commissions with explicit per-order minimums.", sourceIds: ["ibkr-fx"] },
    { title: "No ordinary account inactivity fee", explanation: "The individual schedule lists US$0.", sourceIds: ["ibkr-min"] },
    { title: "Several platform workflows", explanation: "Desktop, mobile, browser and API access.", sourceIds: ["ibkr-platform"] },
    { title: "Two free withdrawal requests", explanation: "Monthly allowance excludes third-party charges.", sourceIds: ["ibkr-withdraw"] },
  ];
  review.limitations = [
    { title: "Forex permissions matter", explanation: "Brokerage eligibility is not leveraged-FX approval.", sourceIds: ["ibkr-forex"] },
    { title: "Minimum commission on small orders", explanation: "US$2 per order can dominate a small conversion’s cost.", sourceIds: ["ibkr-fx"] },
    { title: "Separate service charges", explanation: "Borrowing and selected market data can add costs.", sourceIds: ["ibkr-home"] },
    { title: "Product/platform complexity", explanation: "Choose permissions and interfaces for your actual use case.", sourceIds: ["ibkr-platform"] },
    { title: "Protection has boundaries", explanation: "SIPC is not blanket forex or trading-loss insurance.", sourceIds: ["ibkr-security"] },
  ];
  review.entities = [
    { name: "Interactive Brokers LLC", country: "United States", regulator: "SEC / CFTC; FINRA / NFA memberships disclosed", licence: null, sourceId: "ibkr-home" },
    { name: "Interactive Brokers (U.K.) Limited", country: "United Kingdom", regulator: "FCA", licence: "208159", sourceId: "ibkr-home" },
    { name: "Interactive Brokers Ireland Limited", country: "Ireland", regulator: "Central Bank of Ireland", licence: "C423427", sourceId: "ibkr-home" },
  ];
  review.faqs[1] = { question: "Is Interactive Brokers regulated?", answer: "IBKR identifies separate US, UK, Irish and other companies. Verify your company and product permissions. US SIPC arrangements do not cover market losses or automatically apply to forex and international accounts.", sourceIds: ["ibkr-home", "ibkr-security"] };
  review.faqs[5] = { question: "What is Interactive Brokers’ minimum deposit?", answer: "Individual accounts list US$0 minimum and inactivity fees. Margin, trading permissions, order sizes and specialist accounts have separate requirements. A zero account minimum is not permission to trade every product.", sourceIds: ["ibkr-min", "ibkr-forex"] };
  review.faqs[6] = { question: "Is Interactive Brokers suitable for forex trading?", answer: "Eligible users should understand notional commissions and order minimums: first-tier manual spot FX is 0.20 basis points, minimum US$2/order. Cash conversion and leveraged forex are different services; confirm permission before depositing.", sourceIds: ["ibkr-fx", "ibkr-forex"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/interactivebrokers.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric score/count was verified. Separate securities, funding and forex experiences, and match the account entity." };
  review.accountOpening = { ...common, url: "https://ndcdyn.interactivebrokers.com/Universal/Application", status: "verified", sourceIds: ["ibkr-signup"], isAffiliate: false };
}
