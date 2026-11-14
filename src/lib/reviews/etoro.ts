import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyEtoroResearch(review: BrokerReview) {
  if (review.broker.slug !== "etoro" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.etoro.com/";
  const { common, set } = prepareResearchedRecord(review, "eToro group; investment, crypto and CFD services have separate eligibility", "2026-11-14", [
    { id: "et-fees", title: "Current investing, crypto, CFD and account charges", url: "https://www.etoro.com/trading/fees/" },
    { id: "et-reg", title: "Entity, product and licence disclosures", url: "https://www.etoro.com/customer-service/regulation-license/" },
    { id: "et-deposit", title: "Deposit minimums, currencies and payment methods", url: "https://www.etoro.com/customer-service/deposit-faq/" },
    { id: "et-copy", title: "CopyTrader features and investment risks", url: "https://www.etoro.com/copytrader/" },
    { id: "et-platform", title: "Web/mobile investing and virtual portfolio", url: "https://www.etoro.com/" },
    { id: "et-signup", title: "Official eToro account registration", url: "https://www.etoro.com/accounts/sign-up/" },
  ]);
  set("minimum-deposit", "First-deposit requirement varies by residence, entity and payment method.", ["et-deposit"]);
  set("forex-commission-per-lot", "Eligible forex CFDs: spread-based; check live charges and financing.", ["et-fees"]);
  set("crypto-fees", "Standard Bronze/Silver/Gold crypto fee: 1% per trade; eligible discounts vary.", ["et-fees"]);
  set("forex-spread-and-commission", "Forex CFDs use spreads and applicable financing. Standard Bronze/Silver/Gold crypto pricing lists 1% when buying and 1% when selling; buying US$1,000 then selling at the same value costs US$20 before market spread. Eligible higher tiers have volume discounts; USDC has a separate exception.", ["et-fees"]);
  set("overnight-financing", "Stock orders can attract US$1 or US$2 opening/closing commission depending on country/exchange. ETF dealing commission is listed as zero, while CFDs have separate spread/overnight terms. Crypto transfers to eToro Money carry a listed 2% fee with caps and eligibility conditions.", ["et-fees"]);
  set("inactivity-fee", "The current investment-account fee page lists inactivity as free. Do not substitute older US$10/month summaries. Conversion costs and product/service fees can still apply; check your applicable schedule.", ["et-fees"]);
  set("regulation-and-entity", "eToro reports UK FCA 583263, Cyprus CySEC 109/10 and Australian AFSL 491139 entities, plus other regional arrangements. Investment, payment and crypto permissions are distinct; an investment licence is not blanket protection for every token or product.", ["et-reg"]);
  set("contracting-legal-entity", "Check the named provider for both your investment account and any local-currency/wallet service. Country, product and entity determine protections; company identity and permissions still require independent register confirmation.", ["et-reg", "et-signup"]);
  set("regulation-summary", "Separate UK, Cyprus, Australian and other companies; product-specific permissions.", ["et-reg"]);
  set("deposit-methods-and-charges", "Use the deposit FAQ’s current country/method table. Account currency, conversion and payment-provider charges can matter more than the advertised entry amount; do not assume every funding route is available in your country.", ["et-deposit", "et-fees"]);
  set("withdrawal-methods-and-charges", "USD investment-account withdrawals cost US$5 with a US$30 minimum. Eligible local-currency accounts list free external withdrawals and no minimum. Availability depends on residence; bank/provider and conversion costs may remain.", ["et-fees"]);
  set("identity-and-address-requirements", "Register with your actual residence, complete required verification and read the product/entity terms. CopyTrader invests in another person’s decisions; review their portfolio and risk rather than treating historical returns as a promise.", ["et-signup", "et-reg", "et-copy"]);
  set("demo-account", "A virtual portfolio is offered; simulated gains do not establish live returns.", ["et-platform"]);
  set("supported-mobile-platforms", "Proprietary eToro mobile app; products follow regional eligibility.", ["et-platform"]);
  set("platform-and-availability", "eToro’s own web/mobile platform integrates investing, CopyTrader and portfolio discovery. It is a different workflow from MetaTrader; copying is not automatic diversification, capital protection or a substitute for understanding each position.", ["et-platform", "et-copy"]);
  set("platform-summary", "eToro web / mobile and eligible CopyTrader access.", ["et-platform", "et-copy"]);
  set("real-stocks-and-etfs", "Eligible underlying stocks, ETFs and cryptoassets differ from CFDs. Short or leveraged positions can be derivatives; read the order ticket. Only eligible underlying crypto positions can be transferred under wallet rules.", ["et-fees", "et-reg"]);
  set("cfds-and-underlying-markets", "Underlying investing, social portfolios and eligible forex/other CFDs share the platform but have different rights, costs and risks. US account access does not imply access to international CFD products.", ["et-platform", "et-reg"]);
  review.accountComparisons = [
    { ...common, name: "Underlying stocks / ETFs", category: "Eligible investing account", spread: "Market bid/ask; conversion may apply", commission: "Stocks: country-dependent; ETFs: 0% dealing", minimum: "Country/method dependent", platforms: "eToro web / mobile", sourceIds: ["et-fees", "et-deposit", "et-platform"] },
    { ...common, name: "Underlying crypto", category: "Asset/country eligibility applies", spread: "Market spread remains", commission: "Standard tier: 1% buy + 1% sell", minimum: "Country/method dependent", platforms: "eToro web / mobile", sourceIds: ["et-fees", "et-deposit", "et-platform"] },
    { ...common, name: "Forex / other CFDs", category: "Eligible jurisdictions only", spread: "Instrument-specific", commission: "Spread / applicable holding terms", minimum: "Country/method dependent", platforms: "eToro web / mobile", sourceIds: ["et-fees", "et-deposit", "et-platform"] },
  ];
  review.quickFactFields = [
    { label: "First deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "Crypto pricing", fieldId: "crypto-fees", state: "text" },
    { label: "Forex CFDs", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Virtual portfolio", fieldId: "demo-account", state: "yes" },
    { label: "Mobile access", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Inactivity", fieldId: "inactivity-fee", state: "text" },
    { label: "Withdrawal charges", fieldId: "withdrawal-methods-and-charges", state: "text" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["eToro is worth comparing for social investing, CopyTrader and eligible stocks, ETFs and cryptoassets.", "Standard crypto pricing charges 1% on each side, while USD-account withdrawals cost US$5 and conversion can add costs.", "Check the actual product and entity; copying investors does not guarantee profit or protect your capital."], sourceIds: ["et-platform", "et-copy", "et-fees", "et-reg"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Integrated social investing", explanation: "Research portfolios and follow eligible investors through CopyTrader.", sourceIds: ["et-copy"] },
    { title: "Underlying investments", explanation: "Eligible stocks, ETFs and cryptoassets alongside derivatives.", sourceIds: ["et-reg", "et-platform"] },
    { title: "ETF dealing commission", explanation: "The current schedule lists zero ETF commission, with other costs possible.", sourceIds: ["et-fees"] },
    { title: "Virtual practice", explanation: "Explore the proprietary workflow without a live deposit.", sourceIds: ["et-platform"] },
    { title: "Current inactivity policy", explanation: "The reviewed investment-account schedule lists no inactivity fee.", sourceIds: ["et-fees"] },
  ];
  review.limitations = [
    { title: "Crypto fees on both sides", explanation: "Standard tiers pay 1% buying and 1% selling, plus market spread.", sourceIds: ["et-fees"] },
    { title: "USD withdrawal charge", explanation: "US$5 applies with a US$30 minimum withdrawal.", sourceIds: ["et-fees"] },
    { title: "Stock commission varies", explanation: "Country and exchange can trigger opening/closing charges.", sourceIds: ["et-fees"] },
    { title: "Copying can amplify losses", explanation: "You remain exposed to another investor’s decisions.", sourceIds: ["et-copy"] },
    { title: "Product restrictions", explanation: "Crypto, CFD and custody rights are not uniform worldwide.", sourceIds: ["et-reg"] },
  ];
  review.entities = [
    { name: "eToro (UK) Ltd", country: "United Kingdom", regulator: "FCA", licence: "583263", sourceId: "et-reg" },
    { name: "eToro (Europe) Ltd", country: "Cyprus", regulator: "CySEC", licence: "109/10", sourceId: "et-reg" },
    { name: "eToro AUS Capital Limited", country: "Australia", regulator: "ASIC", licence: "491139", sourceId: "et-reg" },
  ];
  review.faqs[1] = { question: "Is eToro regulated?", answer: "eToro identifies separate regulated investment companies and distinct payment/crypto arrangements. Check the provider and permissions for your actual product. An investment licence does not automatically give cryptoassets securities compensation protection, and no regulation prevents trading losses.", sourceIds: ["et-reg"] };
  review.faqs[5] = { question: "How much does eToro charge to trade crypto?", answer: "The reviewed schedule lists 1% per trade for Bronze, Silver and Gold tiers, with eligible higher-tier/volume discounts and a USDC exception. A US$1,000 buy and same-value sale therefore cost US$20 before market spread at that standard rate. Wallet-transfer fees are separate.", sourceIds: ["et-fees"] };
  review.faqs[6] = { question: "Can CopyTrader guarantee a profit?", answer: "No. Copying replicates another investor’s decisions and can produce losses. Review their holdings, leverage, concentration and historical drawdowns. Past returns, popularity and a virtual-portfolio result do not establish what you will earn in a live account.", sourceIds: ["et-copy"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/etoro.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric score/count was verified. Distinguish crypto custody, investing, CFD and payment-service experiences." };
  review.accountOpening = { ...common, url: "https://www.etoro.com/accounts/sign-up/", status: "verified", sourceIds: ["et-signup"], isAffiliate: false };
}
