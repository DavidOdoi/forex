import type { BrokerReview, ReviewField } from "./types";

const checkedAt = "2026-11-13";
const legalEntity = "IG International Limited, Bermuda; UK examples identified separately";

// Browser source checks and the supplied article are recorded in
// docs/research/ig-source-checks-2026-11-13.md. No live-account testing.
export function applyIgResearch(review: BrokerReview) {
  if (review.broker.slug !== "ig" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.ig.com/";
  review.status = "draft";
  review.overallScore = null;
  review.regulatoryNotices = [];
  review.sources = [];
  const source = (id: string, title: string, path: string) => review.sources.push({ id, title, url: `https://www.ig.com${path}`, publisher: "IG", checkedAt, legalEntity, jurisdiction: "Global" });
  source("ig-home", "IG International markets and group background", "/en");
  source("ig-costs", "IG International CFD charges", "/en/charges");
  source("ig-funding", "IG International funding requirements", "/en/fund-your-account");
  source("ig-legal", "IG International legal documents", "/en/terms-and-agreements");
  source("ig-funds", "IG International client-money arrangements", "/en/client-money-protection");
  source("ig-platforms", "IG UK platform comparison", "/uk/trading-platforms");
  source("ig-uk", "IG UK forex and entity disclosures", "/uk/forex");
  source("ig-demo", "IG UK demo account", "/uk/demo-account");
  source("ig-signup", "IG International application", "/en/application-form");
  const fields = (): ReviewField[] => [...review.keyData, ...review.benchmarks, ...review.chapters.flatMap(chapter => chapter.panels.flatMap(panel => panel.fields))];
  fields().forEach(field => Object.assign(field, { value: null, status: "not-researched", sourceIds: [], legalEntity: null, jurisdiction: null, checkedAt: null }));
  const set = (id: string, value: string, sourceIds: string[]) => {
    let matches = fields().filter(field => field.id === id);
    if (!matches.length) {
      const field: ReviewField = { id, label: id.replaceAll("-", " "), value: null, status: "not-researched", sourceIds: [], legalEntity: null, jurisdiction: null, checkedAt: null };
      review.keyData.push(field); matches = [field];
    }
    matches.forEach(field => Object.assign(field, { value, status: "verified", sourceIds, legalEntity, jurisdiction: "Global", checkedAt }));
  };
  set("minimum-deposit", "IG International: bank transfer, none; cards, US$50.", ["ig-funding"]);
  set("forex-commission-per-lot", "Standard FX dealing charges are incorporated into spreads; specialist products differ.", ["ig-costs"]);
  set("forex-spread-and-commission", "Standard forex CFD costs are spread-based. Spreads vary with liquidity and market conditions; share CFDs and specialist execution can have separate commissions. Compare your instrument’s current specification, not an advertised floor alone.", ["ig-costs"]);
  set("overnight-financing", "Daily financing can apply to overnight positions. Guaranteed stops, exchange data and advanced charting may add charges; read the product-specific conditions.", ["ig-costs"]);
  set("currency-conversion-fee", "IG International lists a 1.0% CFD currency-conversion charge. This is not a universal IG group rate.", ["ig-costs"]);
  set("other-costs-summary", "Overnight funding, conversion, data and guaranteed-stop charges can apply.", ["ig-costs"]);
  set("regulation-and-entity", "IG International Limited discloses Bermuda Monetary Authority licensing. UK CFDs use IG Markets Ltd (FCA 195355); UK spread betting uses IG Index Ltd (FCA 114059). These are provider disclosures, not our independent register checks.", ["ig-legal", "ig-uk"]);
  set("contracting-legal-entity", "Check the company in your agreement. Bermuda accounts do not automatically receive UK/EU protections or compensation arrangements; professional classifications can also change protections.", ["ig-legal", "ig-uk"]);
  set("client-money-arrangements", "IG International reports segregated client trust accounts. Segregation is not deposit insurance or a recovery guarantee.", ["ig-funds"]);
  set("regulation-summary", "Bermuda: BMA; UK: FCA. Match your agreement’s company.", ["ig-legal", "ig-uk"]);
  set("country-availability", "Available entities, products and funding routes depend on residence and eligibility. Confirm the country accepted in registration and local funding rules; website access is not permission to trade.", ["ig-legal", "ig-signup"]);
  set("deposit-methods-and-charges", "IG International: cards from US$50; bank transfers have no minimum. Named-account-holder payments only. Its charges page lists a 2.3% card-processor charge; bank and conversion costs can also apply.", ["ig-funding", "ig-costs"]);
  set("withdrawal-methods-and-charges", "IG normally returns money through the original method and destination, subject to checks and permitted alternatives. Third-party payments are not accepted; international bank wires can incur bank charges.", ["ig-funding"]);
  set("published-processing-times", "Security checks and the receiving provider affect receipt. No universal arrival time is established by the current funding page; we have not tested withdrawals.", ["ig-funding"]);
  set("withdrawal-requirements", "Use your own account. IG may request identity evidence or a bank-statement screenshot before returning funds.", ["ig-funding"]);
  set("identity-and-address-requirements", "Choose your residence and available product, read the assigned agreement, complete the application and requested verification. Do not fund until you understand the entity, margin requirements and payment conditions.", ["ig-signup", "ig-legal", "ig-funding"]);
  set("retail-and-professional-accounts", "CFD, spread-betting, investment and professional services differ by jurisdiction. A UK platform listing is not confirmation of access through IG International.", ["ig-home", "ig-uk", "ig-platforms"]);
  set("demo-account", "UK demo: £10,000 virtual funds; simulated trading, not live fills.", ["ig-demo"]);
  set("supported-mobile-platforms", "IG mobile trading app; functionality differs from specialist desktop tools.", ["ig-platforms", "ig-home"]);
  set("platform-summary", "IG web/app; MT4, MT5, TradingView, ProRealTime and L2 Dealer are listed in the UK.", ["ig-platforms"]);
  set("platform-and-availability", "IG offers its own web/app plus regional third-party platforms. UK listings include MT4, MT5, TradingView, ProRealTime and L2 Dealer. Products, automation and additional charges differ; test your chosen workflow on demo.", ["ig-platforms", "ig-home"]);
  set("cfds-and-underlying-markets", "IG International advertises forex and CFDs across indices, shares, commodities, crypto and other markets. CFDs give price exposure, not ownership. Direct investments available elsewhere in the group are separate services.", ["ig-home", "ig-legal"]);
  set("product-summary", "Forex and multi-market CFDs; direct investments are separate products.", ["ig-home"]);
  const common = { legalEntity, jurisdiction: "Global", checkedAt };
  review.accountComparisons = [
    { ...common, name: "Retail CFD", category: "IG International · Bermuda", spread: "Variable; instrument-specific", commission: "Standard FX: included in spread", minimum: "Bank: none; cards: US$50", platforms: "IG platform; confirm regional third-party access", sourceIds: ["ig-costs", "ig-funding", "ig-home"] },
    { ...common, name: "Demo", category: "UK practice-account example", spread: "Simulated market conditions", commission: "Virtual-money practice", minimum: "No deposit; £10,000 virtual balance", platforms: "IG online demo", sourceIds: ["ig-demo"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "Standard FX commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Client funds", fieldId: "client-money-arrangements", state: "text" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Markets", fieldId: "product-summary", state: "text" },
    { label: "Additional costs", fieldId: "other-costs-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: [
    "IG is worth considering if you want multi-market CFD access and a choice of trading tools.",
    "IG International accepts bank transfers without a minimum, while card funding starts at US$50.",
    "Compare total costs and your actual entity’s protections; UK platforms and account conditions do not apply worldwide.",
  ], sourceIds: ["ig-home", "ig-funding", "ig-costs", "ig-legal", "ig-platforms"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Established group", explanation: "IG reports a 1974 start and a listed parent; history does not remove risk.", sourceIds: ["ig-home"] },
    { title: "Multi-market access", explanation: "Forex, indices, shares and commodities through distinct products.", sourceIds: ["ig-home"] },
    { title: "Platform choice", explanation: "Proprietary web/app plus regional specialist platforms.", sourceIds: ["ig-platforms"] },
    { title: "Flexible bank funding", explanation: "IG International sets no bank-transfer minimum.", sourceIds: ["ig-funding"] },
    { title: "Practice before funding", explanation: "The UK demo provides virtual money for exploring the platform.", sourceIds: ["ig-demo"] },
  ];
  review.limitations = [
    { title: "Charges beyond the spread", explanation: "Overnight funding, conversion and premium tools can add costs.", sourceIds: ["ig-costs"] },
    { title: "Different regional protections", explanation: "Bermuda licensing does not transfer UK protections to every account.", sourceIds: ["ig-legal", "ig-uk"] },
    { title: "Platform restrictions", explanation: "Check regional access and product coverage before choosing MetaTrader or DMA.", sourceIds: ["ig-platforms"] },
    { title: "Card funding costs", explanation: "The International schedule lists a 2.3% processor charge.", sourceIds: ["ig-costs"] },
    { title: "CFDs are not direct investments", explanation: "Share CFDs do not confer underlying share ownership.", sourceIds: ["ig-home", "ig-legal"] },
  ];
  review.entities = [
    { name: "IG International Limited", country: "Bermuda", regulator: "BMA", licence: null, sourceId: "ig-legal", note: "International funding examples on this page; provider-reported licensing." },
    { name: "IG Markets Ltd", country: "United Kingdom", regulator: "FCA", licence: "195355", sourceId: "ig-uk", note: "UK CFD entity; separate from IG International." },
    { name: "IG Index Ltd", country: "United Kingdom", regulator: "FCA", licence: "114059", sourceId: "ig-uk", note: "UK spread-betting entity; eligibility and terms differ." },
  ];
  review.faqs[1] = { question: "Is IG regulated?", answer: "IG operates through different companies. IG International discloses Bermuda Monetary Authority licensing; UK CFD and spread-betting entities disclose FCA authorisation. Match your contract’s company to its official register. Regulation does not protect against trading losses.", sourceIds: ["ig-legal", "ig-uk"] };
  review.faqs[5] = { question: "What is IG’s minimum deposit?", answer: "IG International publishes no minimum for bank transfers and US$50 for cards. Other entities and products can differ. Payment minimums are not recommended trading budgets or a promise that a small deposit can support a particular position.", sourceIds: ["ig-funding"] };
  review.faqs[6] = { question: "Does IG charge forex commission?", answer: "Standard forex CFD dealing charges are generally incorporated into the spread. Specialist execution and other products can have separate commissions. Add overnight funding, conversion and any platform/data charges when comparing the total cost.", sourceIds: ["ig-costs"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/ig.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "The supplied article’s approximate score is not independently confirmed. Check the live profile; no numerical rating or review count is asserted here." };
  review.accountOpening = { url: "https://www.ig.com/en/application-form", status: "verified", sourceIds: ["ig-signup"], ...common, isAffiliate: false };
  review.publication = { publishedAt: null, updatedAt: checkedAt, approvedAt: null, approvedBy: null };
}
