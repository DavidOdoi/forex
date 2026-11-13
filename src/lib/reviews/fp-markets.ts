import type { BrokerReview, ReviewField } from "./types";

const checkedAt = "2026-11-13";
const legalEntity = "FP Markets global disclosures; separate group entities and platform terms identified";

export function applyFpMarketsResearch(review: BrokerReview) {
  if (review.broker.slug !== "fp-markets" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.fpmarkets.com/";
  review.status = "draft";
  review.overallScore = null;
  review.regulatoryNotices = [];
  review.sources = [];
  const source = (id: string, title: string, path: string) => review.sources.push({ id, title, url: `https://www.fpmarkets.com${path}`, publisher: "FP Markets", checkedAt, legalEntity, jurisdiction: "Global" });
  source("fp-pricing", "Global spreads and MetaTrader commission table", "/forex-spreads/");
  source("fp-types", "Standard and Raw account comparison", "/account-types/forex-account-types/");
  source("fp-regulation", "Regulation and global minimum-deposit disclosure", "/regulation/");
  source("fp-group", "Group jurisdictions and registration disclosures", "/fp-markets-group/");
  source("fp-platforms", "Trading platforms and demo access", "/platforms/");
  source("fp-funding", "Global funding methods", "/funding/");
  source("fp-withdrawals", "Withdrawal methods and published estimates", "/funding/withdraw-funds/");
  review.sources.push({ id: "fp-signup", title: "Linked Saint Lucia registration portal", url: "https://portal.fpmarkets.com/stl-EN/register", publisher: "FP Markets", checkedAt, legalEntity, jurisdiction: "Global" });
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
  set("minimum-deposit", "Global site advertises none; confirm entity and payment-method limits.", ["fp-regulation"]);
  set("forex-commission-per-lot", "Raw MetaTrader USD: US$3/lot/side; US$6 round trip.", ["fp-pricing"]);
  set("standard-spread", "Standard: from 1.0 pip; no separate FX commission.", ["fp-pricing"]);
  set("raw-spread", "Raw: from 0.0 pips, plus commission.", ["fp-pricing"]);
  set("forex-spread-and-commission", "Standard advertises spreads from 1.0 pip with no separate FX commission. Raw starts from 0.0 plus US$3/standard lot/side on USD MetaTrader accounts. These are advertised terms, not measured averages or guaranteed fills.", ["fp-pricing"]);
  set("platform-commission", "The published MetaTrader schedule is currency-specific: USD US$6, EUR €5.50 and GBP £4.50 per standard lot round trip. Confirm cTrader/TradingView charges separately; do not apply one platform’s schedule universally.", ["fp-pricing"]);
  set("regulation-and-entity", "The group page lists Australia ASIC 286354, South Africa FSCA 50926, Seychelles FSA SD130 and Kenya CMA 193. It separately lists Saint Lucia company registration 2025-00853. Registration alone is not a financial-services licence; these are provider disclosures, not independent register checks.", ["fp-group"]);
  set("contracting-legal-entity", "The global site currently links an stl-EN registration portal. Confirm the company in the agreement; Australian, Seychelles or other group protections do not automatically cover that account.", ["fp-group", "fp-signup"]);
  set("client-money-arrangements", "Segregated bank accounts are provider-reported; not independently audited or guaranteed.", ["fp-group"]);
  set("regulation-summary", "Entity-specific; Saint Lucia registration is not a financial-services licence.", ["fp-group"]);
  set("country-availability", "Residence, contracting company and local rules determine eligibility. Check registration and permitted funding routes; a broker accepting a payment does not establish local permission to trade.", ["fp-group", "fp-signup"]);
  set("deposit-methods-and-charges", "Cards, bank transfers, crypto and e-wallets are listed; country availability differs. Skrill/Neteller deposits advertise no deposit fee. Check other methods, conversion and bank charges in your portal.", ["fp-funding"]);
  set("withdrawal-methods-and-charges", "The withdrawal page lists bank, card, crypto and e-wallet options. Confirm your entity’s current fees and limits before requesting funds; do not assume every method is free.", ["fp-withdrawals"]);
  set("published-processing-times", "Skrill/Neteller withdrawals are advertised within one business day. This is a provider estimate, not our withdrawal test or a universal receipt guarantee; bank/provider settlement and checks can add time.", ["fp-withdrawals"]);
  set("identity-and-address-requirements", "Check your residence and assigned company, complete the application and requested verification, then review margin and payment requirements before funding. No live account was opened for this review.", ["fp-signup", "fp-group"]);
  set("retail-and-professional-accounts", "Standard uses spread-only FX pricing; Raw separates commission from the spread. Iress and other specialist services have separate regional terms. Retail/professional classification is not the same as choosing Raw.", ["fp-types", "fp-platforms"]);
  set("demo-account", "Available with virtual funds; simulated execution is not live trading.", ["fp-platforms", "fp-regulation"]);
  set("supported-mobile-platforms", "FP Markets lists mobile-app and MetaTrader mobile access; not tested here.", ["fp-platforms"]);
  set("platform-summary", "MT4, MT5, cTrader, TradingView; regional Iress access.", ["fp-pricing", "fp-platforms"]);
  set("platform-and-availability", "MT4/MT5, cTrader, TradingView, WebTrader, a mobile app and selected Iress services are listed. Product coverage, automation and fees differ; check the platform available to your actual entity.", ["fp-platforms", "fp-pricing"]);
  set("leverage-by-product-and-region", "The global account table advertises up to 1:500. Entity, instrument and client-classification limits apply; this is not an Australian or EU retail entitlement. Higher leverage magnifies losses.", ["fp-pricing"]);
  set("leverage-summary", "Global table: up to 1:500; entity/instrument limits apply.", ["fp-pricing"]);
  set("cfds-and-underlying-markets", "Forex and CFDs across commodities, indices and other financial markets are advertised. Available instruments depend on entity and platform; share CFDs do not give underlying share ownership.", ["fp-regulation", "fp-platforms"]);
  const common = { legalEntity, jurisdiction: "Global", checkedAt, minimum: "Global page advertises none; confirm entity/method" };
  review.accountComparisons = [
    { ...common, name: "Standard", category: "Global spread-only FX pricing", spread: "From 1.0 pip", commission: "No separate FX commission", roundTripCommission: "US$0 separate FX commission", platforms: "MT4 / MT5 / cTrader where offered", sourceIds: ["fp-pricing", "fp-regulation"] },
    { ...common, name: "Raw", category: "Global raw spread + commission", spread: "From 0.0 pips", commission: "MetaTrader USD: US$3/lot/side", roundTripCommission: "US$6/standard lot (MetaTrader USD)", platforms: "MT4 / MT5 / cTrader / TradingView where offered", sourceIds: ["fp-pricing", "fp-regulation"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "Raw FX commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Standard spread", fieldId: "standard-spread", state: "text" },
    { label: "Raw spread", fieldId: "raw-spread", state: "text" },
    { label: "Maximum leverage", fieldId: "leverage-summary", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Client funds", fieldId: "client-money-arrangements", state: "text" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: [
    "FP Markets is worth comparing for Standard spread-only pricing or Raw MetaTrader commissions of US$3 per standard lot per side on USD accounts.",
    "Its global page advertises no minimum deposit; confirm your entity’s requirements.",
    "The linked global signup routes to Saint Lucia, whose company registration is not a financial-services licence; verify the contract before funding.",
  ], sourceIds: ["fp-pricing", "fp-regulation", "fp-group", "fp-signup"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Two FX pricing models", explanation: "Standard bundles commission into spread; Raw separates it.", sourceIds: ["fp-types"] },
    { title: "Clear MetaTrader commission", explanation: "USD Raw: US$6/standard lot round trip, plus spread.", sourceIds: ["fp-pricing"] },
    { title: "Platform flexibility", explanation: "MetaTrader, cTrader and TradingView are listed; regional limits apply.", sourceIds: ["fp-platforms", "fp-pricing"] },
    { title: "Virtual practice", explanation: "Demo access lets you explore supported tools before risking funds.", sourceIds: ["fp-platforms"] },
    { title: "Several funding options", explanation: "Bank, card and e-wallet choices; confirm country availability.", sourceIds: ["fp-funding"] },
  ];
  review.limitations = [
    { title: "Entity choice matters", explanation: "The global signup route does not automatically provide Australian protections.", sourceIds: ["fp-signup", "fp-group"] },
    { title: "Advertised floors vary", explanation: "A 0.0-pip minimum is not a typical spread or guaranteed execution price.", sourceIds: ["fp-pricing"] },
    { title: "Platform charges differ", explanation: "MetaTrader currency schedules are not universal cTrader/TradingView quotes.", sourceIds: ["fp-pricing"] },
    { title: "Specialist access varies", explanation: "Check Iress eligibility and service/data charges for your entity.", sourceIds: ["fp-platforms"] },
    { title: "High leverage increases risk", explanation: "A 1:500 headline magnifies losses; lower local limits can apply.", sourceIds: ["fp-pricing"] },
  ];
  review.entities = [
    { name: "Australian group operation", country: "Australia", regulator: "ASIC", licence: "AFSL 286354", sourceId: "fp-group" },
    { name: "Global Saint Lucia company", country: "Saint Lucia", regulator: null, licence: null, sourceId: "fp-group", note: "Company registration 2025-00853; not by itself a financial-services licence. Confirm the full company name in the agreement." },
    { name: "South African group operation", country: "South Africa", regulator: "FSCA", licence: "50926", sourceId: "fp-group" },
    { name: "Seychelles group operation", country: "Seychelles", regulator: "FSA", licence: "SD130", sourceId: "fp-group" },
  ];
  review.faqs[1] = { question: "Is FP Markets a legitimate and regulated broker?", answer: "The brand lists regulated group operations, including Australia and Seychelles, and a separate registered Saint Lucia company. Your agreement determines which company holds the account. Verify that company’s permissions; a group licence does not cover every client or make leveraged trading safe.", sourceIds: ["fp-group", "fp-signup"] };
  review.faqs[5] = { question: "What is the minimum deposit for FP Markets?", answer: "The current global regulation page advertises no minimum deposit. Requirements can differ by entity, account and payment method; obtain the applicable terms before funding. A minimum is not a recommended trading budget.", sourceIds: ["fp-regulation"] };
  review.faqs[6] = { question: "Is FP Markets better than Fusion Markets?", answer: "Neither suits everyone. Compare the same instrument, platform, account currency and entity. FP Markets publishes US$3 per side for USD MetaTrader Raw accounts; include spreads, both commission sides, financing and funding charges when comparing another broker.", sourceIds: ["fp-pricing", "fp-group"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/fpmarkets.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric TrustScore or review count was independently confirmed. Read the live profile; customer feedback does not establish regulatory safety." };
  review.accountOpening = { url: "https://portal.fpmarkets.com/stl-EN/register", status: "verified", sourceIds: ["fp-signup"], legalEntity, jurisdiction: "Global", checkedAt, isAffiliate: false };
  review.publication = { publishedAt: null, updatedAt: checkedAt, approvedAt: null, approvedBy: null };
}
