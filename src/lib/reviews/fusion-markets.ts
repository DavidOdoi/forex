import type { BrokerReview, ReviewField } from "./types";

// Primary-source checks and the original supplied article are archived in
// docs/research/fusion-markets-source-checks-2026-11-13.md.
const checkedAt = "2026-11-13";
const legalEntity = "Fusion Markets group disclosures; entity and platform conditions stated separately";

export function applyFusionMarketsResearch(review: BrokerReview) {
  if (review.broker.slug !== "fusion-markets" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://fusionmarkets.com/";
  review.status = "draft";
  review.overallScore = null;
  review.regulatoryNotices = [];
  review.sources = [];
  const source = (id: string, title: string, path: string) => review.sources.push({
    id, title, url: `https://fusionmarkets.com${path}`, publisher: "Fusion Markets", checkedAt, legalEntity, jurisdiction: "Global",
  });
  source("fusion-home", "Fusion Markets minimum account size and markets", "/");
  source("fusion-zero", "Zero account pricing and application steps", "/Trading/Zero-Trading-Account");
  source("fusion-classic", "Classic account spread calculation", "/Trading/Classic-Trading-Account");
  source("fusion-entities", "Legal entities and client-money disclosure", "/About-us/Regulations");
  source("fusion-nbp", "Seychelles/Vanuatu negative-balance policy, 23 July 2026", "/static_images/FM_NBP_Policy_SEY_VFSC_23_7_26_677577c94c.pdf");
  source("fusion-deposits", "Deposit methods and broker charges", "/Trading/Deposit-options");
  source("fusion-withdrawals", "Withdrawal fees, estimates and own-name rules", "/Trading/Withdrawal-options");
  source("fusion-ctrader", "cTrader account and notional-based commission", "/Platforms/cTrader");
  source("fusion-tradingview", "TradingView connection and platform preview", "/Platforms/TradingView");
  source("fusion-swap", "Swap-free eligibility and administration charges", "/Trading/Swap-Free-Accounts");
  source("fusion-demo", "Demo trading account", "/Trading/Demo-Trading-Account");
  const fields = (): ReviewField[] => [...review.keyData, ...review.benchmarks, ...review.chapters.flatMap(chapter => chapter.panels.flatMap(panel => panel.fields))];
  // Never retain an unrelated old collection as a current account finding.
  fields().forEach(field => Object.assign(field, { value: null, status: "not-researched", sourceIds: [], legalEntity: null, jurisdiction: null, checkedAt: null }));
  const set = (id: string, value: string, sourceIds: string[]) => {
    let matches = fields().filter(field => field.id === id);
    if (!matches.length) {
      const field: ReviewField = { id, label: id.replaceAll("-", " "), value: null, status: "not-researched", sourceIds: [], legalEntity: null, jurisdiction: null, checkedAt: null };
      review.keyData.push(field); matches = [field];
    }
    matches.forEach(field => Object.assign(field, { value, status: "verified", sourceIds, legalEntity, jurisdiction: "Global", checkedAt }));
  };
  set("minimum-deposit", "No broker minimum; payment-method limits apply.", ["fusion-home", "fusion-classic"]);
  set("forex-commission-per-lot", "Zero MetaTrader: US$2.25/lot/side; US$4.50 round trip.", ["fusion-zero"]);
  set("forex-spread-and-commission", "Zero: raw spreads from 0.0 pips plus US$2.25/standard lot/side on USD MetaTrader accounts. Classic adds 0.9 pips to the raw spread, with no separate FX commission. These are published terms, not measured averages.", ["fusion-zero", "fusion-classic"]);
  set("platform-commission", "cTrader calculates commission per 100,000 units of traded notional: EUR100,000 EUR/USD costs EUR2.25/side before account-currency conversion. TradingView connects through cTrader; confirm its current pricing rather than applying the MetaTrader dollar figure.", ["fusion-ctrader", "fusion-tradingview"]);
  set("overnight-financing", "Ordinary accounts can incur instrument-specific overnight swaps. Swap-free accounts instead charge administration fees for positions open longer than seven days; products and eligibility are restricted.", ["fusion-swap"]);
  set("swap-free-option", "By application; limited products, administration fees after seven days.", ["fusion-swap"]);
  set("regulation-and-entity", "Broker disclosure: FMGP Trading Group Pty Ltd, Australia (AFSL 385620); Fusion Markets International Ltd, Seychelles (SD096); Gleneagle Securities Pty Limited, Vanuatu (company 40256, VFSC-regulated). These are separate companies, not worldwide permissions.", ["fusion-entities"]);
  set("contracting-legal-entity", "Read the company in your application agreement. Australia’s AFSL does not cover every Fusion customer; this review has not independently confirmed the regulator registers.", ["fusion-entities"]);
  set("licence-number", "Australia: 385620; Seychelles: SD096; provider-reported.", ["fusion-entities"]);
  set("negative-balance-protection", "The July 2026 Seychelles/Vanuatu policy is conditional. Its excluded jurisdictions are Mongolia, Türkiye, Indonesia, Hong Kong SAR, Taiwan, Vietnam and mainland China. Eligibility and further exclusions apply; it is not deposit insurance.", ["fusion-nbp"]);
  set("client-money-arrangements", "Broker-reported segregated trust accounts; not independently audited or guaranteed.", ["fusion-entities"]);
  set("country-availability", "US residents are excluded. Other country/province restrictions apply; an omitted country is not confirmation of acceptance or lawful offshore funding. Confirm eligibility, the contracting entity and local payment rules before applying.", ["fusion-entities"]);
  set("accepts-us-residents", "No — excluded in the broker’s disclosure.", ["fusion-entities"]);
  set("deposit-methods-and-charges", "Bank transfer, cards and regional/e-wallet methods are listed. Broker deposit charges are advertised as US$0; availability, method limits, currency conversion and third-party fees vary.", ["fusion-deposits"]);
  set("withdrawal-methods-and-charges", "Displayed local-bank/wire options: US$0 broker fee; US$10/US$35 minimums respectively. Withdraw to your own-name account. Check country availability, intermediary-bank fees and conversion costs.", ["fusion-withdrawals"]);
  set("published-processing-times", "The current page advertises most requests processed within an hour, but this means internal processing. Listed arrival estimates: local bank 1–2 business days; wire 3–5. Verification and payment providers can delay receipt; no withdrawal was tested.", ["fusion-withdrawals"]);
  set("withdrawal-requirements", "Withdraw only to accounts matching your registered name. Check your method’s minimum, verification requirements and currency before submitting a request.", ["fusion-withdrawals"]);
  set("retail-and-professional-accounts", "Zero separates commission from raw spreads; Classic bundles FX commission into its spread. Professional classifications and regional protections require a separate agreement check.", ["fusion-zero", "fusion-classic"]);
  set("identity-and-address-requirements", "Register, accept terms, complete identity verification and the risk quiz, then choose an available platform, account and base currency. Additional documents may be requested; approval is not guaranteed.", ["fusion-zero", "fusion-classic"]);
  set("demo-account", "Available with virtual funds; results do not establish live execution.", ["fusion-demo"]);
  set("supported-mobile-platforms", "MT4/MT5, cTrader and TradingView mobile; not tested.", ["fusion-home", "fusion-ctrader", "fusion-tradingview"]);
  set("platform-summary", "MT4, MT5, cTrader, TradingView.", ["fusion-home", "fusion-ctrader", "fusion-tradingview"]);
  set("platform-and-availability", "MT4/MT5 plus cTrader desktop, web and mobile. cTrader uses Zero accounts, not Classic; TradingView connects through cTrader. Test your strategy on demo before committing funds.", ["fusion-home", "fusion-ctrader", "fusion-tradingview"]);
  set("cfds-and-underlying-markets", "Forex and CFDs on metals, indices, energy, commodities, cryptocurrencies and US shares are advertised. Availability depends on your entity/platform. A CFD does not give ownership of the underlying asset.", ["fusion-home"]);
  const common = { legalEntity, jurisdiction: "Global", checkedAt, minimum: "No broker minimum; method limits apply" };
  review.accountComparisons = [
    { ...common, name: "Zero", category: "Raw spread + commission", spread: "From 0.0 pips", commission: "MetaTrader USD: US$2.25/lot/side", roundTripCommission: "US$4.50 per standard lot (MetaTrader USD)", platforms: "MT4 / MT5; cTrader & TradingView use notional pricing", sourceIds: ["fusion-zero", "fusion-home", "fusion-ctrader", "fusion-tradingview"] },
    { ...common, name: "Classic", category: "Spread-only FX pricing", spread: "Raw spread + 0.9 pips", commission: "No separate FX commission", roundTripCommission: "US$0 separate FX commission", platforms: "MT4 / MT5; cTrader Classic unavailable", sourceIds: ["fusion-classic", "fusion-home", "fusion-ctrader"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "Zero FX commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Swap-free option", fieldId: "swap-free-option", state: "yes" },
    { label: "Segregated client funds", fieldId: "client-money-arrangements", state: "yes" },
    { label: "Accepts US residents", fieldId: "accepts-us-residents", state: "no" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Regulation", fieldId: "licence-number", state: "text" },
  ];
  review.verdictEvidence = { legalEntity, jurisdiction: "Global", checkedAt, sentences: [
    "Fusion Markets merits a cost comparison: Zero advertises US$2.25 per standard lot per side on USD MetaTrader accounts.",
    "Classic adds 0.9 pips to raw spreads instead of separate FX commission; no minimum account size is required.",
    "Check platform charges, your contracting entity and negative-balance eligibility before funding.",
  ], sourceIds: ["fusion-zero", "fusion-classic", "fusion-home", "fusion-entities", "fusion-nbp"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Clear Zero commission", explanation: "USD MetaTrader: US$4.50/standard lot round trip, plus spread.", sourceIds: ["fusion-zero"] },
    { title: "Flexible starting amount", explanation: "No broker minimum; payment-method limits apply.", sourceIds: ["fusion-home"] },
    { title: "Four platform choices", explanation: "MT4, MT5, cTrader and TradingView; pricing differs.", sourceIds: ["fusion-home", "fusion-ctrader", "fusion-tradingview"] },
    { title: "Spread-only alternative", explanation: "Classic: raw spread plus a 0.9-pip FX markup.", sourceIds: ["fusion-classic"] },
    { title: "Free virtual practice", explanation: "Explore the platform using demo funds.", sourceIds: ["fusion-demo"] },
  ];
  review.limitations = [
    { title: "Protection is conditional", explanation: "Seychelles/Vanuatu negative-balance policy has eligibility and country exclusions.", sourceIds: ["fusion-nbp"] },
    { title: "Platform costs differ", explanation: "cTrader uses notional-based commission; Classic is unavailable on cTrader.", sourceIds: ["fusion-ctrader"] },
    { title: "Swap-free can still cost", explanation: "Limited instruments; administration fees apply after seven days.", sourceIds: ["fusion-swap"] },
    { title: "Processing is not arrival", explanation: "Bank-wire estimates are 3–5 business days, despite faster internal processing.", sourceIds: ["fusion-withdrawals"] },
    { title: "Not a share-ownership account", explanation: "Advertised US shares are CFDs; you do not own the underlying shares.", sourceIds: ["fusion-home"] },
  ];
  review.entities = [
    { name: "FMGP Trading Group Pty Ltd", country: "Australia", regulator: "ASIC", licence: "AFSL 385620", sourceId: "fusion-entities", note: "Australian-client disclosure; register confirmation remains outstanding." },
    { name: "Fusion Markets International Ltd", country: "Seychelles", regulator: "FSA", licence: "SD096", sourceId: "fusion-entities", note: "Separate Seychelles entity; read its client agreement." },
    { name: "Gleneagle Securities Pty Limited", country: "Vanuatu", regulator: "VFSC", licence: null, sourceId: "fusion-entities", note: "Company number 40256; do not present a company number as an independently checked licence." },
  ];
  review.faqs[1] = { question: "Is Fusion Markets a legitimate forex broker?", answer: "Fusion discloses Australian, Seychelles and Vanuatu companies. Verify your agreement’s company and permissions in its regulator’s register; we have not independently confirmed those entries. Regulation does not prevent trading losses.", sourceIds: ["fusion-entities", "fusion-nbp"] };
  review.faqs[5] = { question: "What is the minimum deposit for Fusion Markets?", answer: "No minimum account size is advertised. Payment-method minimums still apply. This is an entry condition, not a recommended budget; size positions around the loss you can afford.", sourceIds: ["fusion-home", "fusion-classic", "fusion-deposits"] };
  review.faqs[6] = { question: "Is Fusion Markets better than Pepperstone?", answer: "Neither is universally better. Compare the same platform, instrument, account currency and entity, including spreads, both commission sides, swaps and funding costs. Check resident eligibility and protections before choosing.", sourceIds: ["fusion-zero", "fusion-ctrader", "fusion-entities"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/fusionmarkets.com", rating: null, reviewCount: null, checkedAt: null,
    researchNote: "No numeric TrustScore or count was verified. Check the live profile; customer comments do not establish safety." };
  review.accountOpening = { url: "https://hub.fusionmarkets.com/auth/sign-up", status: "verified", sourceIds: ["fusion-home", "fusion-zero"], legalEntity, jurisdiction: "Global", checkedAt, isAffiliate: false };
  review.publication = { publishedAt: null, updatedAt: checkedAt, approvedAt: null, approvedBy: null };
}
