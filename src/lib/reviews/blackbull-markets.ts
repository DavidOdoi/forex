import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyBlackbullMarketsResearch(review: BrokerReview) {
  if (review.broker.slug !== "blackbull-markets" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://blackbull.com/";
  const { common, set } = prepareResearchedRecord(review, "BlackBull group; advertised ECN lineup, account/entity scope must be confirmed", "2026-11-14", [
    { id: "bb-accounts", title: "Advertised Standard, Prime and Prime+ comparison", url: "https://blackbull.com/en/our-company/account-comparison/" },
    { id: "bb-types", title: "Account-type explanation and regional table differences", url: "https://blackbull.com/en/support/account-types-explained/" },
    { id: "bb-fees", title: "Broker deposit and withdrawal charges", url: "https://blackbull.com/en/support/deposit-and-withdrawal-fees/" },
    { id: "bb-reg", title: "Company registration and Seychelles permission disclosures", url: "https://blackbull.com/en/our-company/compliance/" },
    { id: "bb-platform", title: "MetaTrader, cTrader, TradingView and investing platforms", url: "https://blackbull.com/en/platforms/" },
    { id: "bb-home", title: "Group services and country restrictions", url: "https://blackbull.com/" },
    { id: "bb-signup", title: "Official BlackBull live-account registration", url: "https://secure.blackbull.com/auth/register-live" },
  ]);
  set("minimum-deposit", "Main ECN table: US$0; regional/different account schedules may differ.", ["bb-accounts", "bb-types"]);
  set("forex-commission-per-lot", "ECN Prime / Prime+: US$3 per lot per side, before eligible rebates.", ["bb-accounts"]);
  set("standard-spread", "ECN Standard: spreads from 0.8 pips; no separate FX commission.", ["bb-accounts"]);
  set("forex-spread-and-commission", "The main ECN table lists Standard from 0.8 pips without separate commission; Prime/Prime+ from 0.0 plus US$3 per standard lot per side (US$6 round trip before rebates). These are advertised floors, not measured averages. The site also displays another account table; confirm your actual schedule.", ["bb-accounts", "bb-types"]);
  set("overnight-financing", "Holding positions overnight can incur instrument-specific swaps. Swap-free status is eligibility-dependent and can be withdrawn under the broker’s conditions; it is not proof that all administration or holding charges disappear.", ["bb-accounts"]);
  set("regulation-and-entity", "BlackBull reports BBG Limited’s Seychelles FSA licence SD045 and Black Bull Group Limited’s New Zealand FSPR registration FSP403326. Registration and a brokerage licence are different. Independent register checks and any claimed New Zealand derivatives permission remain outstanding here.", ["bb-reg"]);
  set("contracting-legal-entity", "Read the assigned company and country restrictions during registration. The reviewed footer restricts several markets; neither the New Zealand address nor a Seychelles permission establishes eligibility or identical protection worldwide.", ["bb-reg", "bb-home", "bb-signup"]);
  set("regulation-summary", "Seychelles licence disclosed; New Zealand FSPR registration is a separate status.", ["bb-reg"]);
  set("deposit-methods-and-charges", "BlackBull lists no broker-side deposit fee. Banks and payment providers can charge processing or conversion fees; its help page gives an Australian card-provider example of 2.5%. Check the actual method and currency.", ["bb-fees"]);
  set("withdrawal-methods-and-charges", "A flat US$5 internal fee applies per withdrawal request, with possible extra provider/conversion fees. That is 5% of a US$100 withdrawal. Card withdrawals follow refund-hierarchy rules; profits may need another supported method.", ["bb-fees"]);
  set("identity-and-address-requirements", "Choose your true residence, confirm the assigned entity and complete the requested verification. The advertised zero account minimum does not remove order-size, margin or payment-method requirements. Resolve any account-table mismatch before depositing.", ["bb-signup", "bb-accounts", "bb-types"]);
  set("demo-account", "Demo practice is offered; simulated results do not establish live fills.", ["bb-home"]);
  set("swap-free-option", "Available to eligible clients under account-specific conditions.", ["bb-accounts"]);
  set("supported-mobile-platforms", "Supported MetaTrader, cTrader and TradingView mobile workflows.", ["bb-platform"]);
  set("platform-and-availability", "The reviewed lineup lists MT4, MT5, cTrader, TradingView and BlackBull CopyTrader. BlackBull Invest is a separate investing service. Match the account, symbols and automation tools to the selected platform; no latency or execution test was performed here.", ["bb-platform"]);
  set("platform-summary", "MT4 / MT5 / cTrader / TradingView; account compatibility varies.", ["bb-platform"]);
  set("cfds-and-underlying-markets", "Forex, metals, commodities, indices and share-CFD exposure differ from underlying investments through BlackBull Invest. The group-wide instrument count is not the number available in every CFD account or platform.", ["bb-home", "bb-platform"]);
  set("leverage-by-product-and-region", "The ECN comparison advertises up to 1:500, subject to product, account and residence. This is not a universal retail entitlement or a recommended risk level.", ["bb-accounts", "bb-home"]);
  const base = { ...common, minimum: "US$0 in main ECN table; confirm region" };
  review.accountComparisons = [
    { ...base, name: "ECN Standard", category: "Advertised spread-only account", spread: "From 0.8 pips", commission: "No separate FX commission", roundTripCommission: "US$0 separate FX commission", platforms: "Confirm supported platform", sourceIds: ["bb-accounts", "bb-types"] },
    { ...base, name: "ECN Prime", category: "Advertised commission account", spread: "From 0.0 pips", commission: "US$3/lot/side", roundTripCommission: "US$6/standard lot", platforms: "Confirm supported platform", sourceIds: ["bb-accounts", "bb-types"] },
    { ...base, name: "Prime+", category: "Eligible volume rebates", spread: "From 0.0 pips", commission: "US$3/lot/side before rebates", roundTripCommission: "US$6 before eligible rebates", platforms: "Confirm supported platform", sourceIds: ["bb-accounts", "bb-types"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "Standard pricing", fieldId: "standard-spread", state: "text" },
    { label: "Prime commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Advertised leverage", fieldId: "leverage-by-product-and-region", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Swap-free option", fieldId: "swap-free-option", state: "text" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Regulatory scope", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["BlackBull Markets is worth comparing for its MetaTrader, cTrader and TradingView lineup.", "Its main ECN comparison advertises zero minimum deposits and Prime commission of US$3 per lot per side, but withdrawals carry a US$5 broker fee.", "Confirm the regional account table, legal entity and protections before funding."], sourceIds: ["bb-platform", "bb-accounts", "bb-types", "bb-fees", "bb-reg"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Four established platforms", explanation: "MetaTrader, cTrader and TradingView provide different workflows.", sourceIds: ["bb-platform"] },
    { title: "Published commission", explanation: "Prime advertises US$6 round trip per standard lot.", sourceIds: ["bb-accounts"] },
    { title: "Zero advertised ECN minimum", explanation: "The main table lists US$0 on all three ECN accounts.", sourceIds: ["bb-accounts"] },
    { title: "Eligible volume rebates", explanation: "Prime+ lists a rebate option; confirm qualification.", sourceIds: ["bb-accounts"] },
    { title: "Separate investing service", explanation: "BlackBull Invest differs from the CFD offering.", sourceIds: ["bb-platform"] },
  ];
  review.limitations = [
    { title: "US$5 withdrawal charge", explanation: "A flat fee weighs more heavily on small withdrawals.", sourceIds: ["bb-fees"] },
    { title: "Account-table differences", explanation: "The site also carries a differently named lineup and minimums.", sourceIds: ["bb-types"] },
    { title: "Provider charges remain", explanation: "Zero broker deposit fees do not remove bank/card costs.", sourceIds: ["bb-fees"] },
    { title: "Registration versus licensing", explanation: "An FSPR number alone is not a derivatives licence.", sourceIds: ["bb-reg"] },
    { title: "Country restrictions", explanation: "Global platform access does not prove resident eligibility.", sourceIds: ["bb-home"] },
  ];
  review.entities = [
    { name: "BBG Limited", country: "Seychelles", regulator: "FSA", licence: "SD045", sourceId: "bb-reg" },
    { name: "Black Bull Group Limited", country: "New Zealand", regulator: "FSPR registration; not itself a derivatives licence", licence: "FSP403326", sourceId: "bb-reg" },
  ];
  review.faqs[1] = { question: "Is BlackBull Markets regulated?", answer: "The broker discloses Seychelles FSA licence SD045 for BBG Limited and New Zealand FSPR registration FSP403326 for Black Bull Group Limited. Registration alone is not a derivatives licence. Verify your contracting company’s current permissions and protections independently before funding.", sourceIds: ["bb-reg"] };
  review.faqs[5] = { question: "What is BlackBull Markets’ minimum deposit?", answer: "The main ECN Standard, Prime and Prime+ table lists US$0. The website also displays another account lineup with different minimums. Confirm your country, selected company and actual account schedule; order sizes, margin and payment limits still apply.", sourceIds: ["bb-accounts", "bb-types"] };
  review.faqs[6] = { question: "Does BlackBull charge withdrawal fees?", answer: "Its help centre lists a US$5 internal fee per withdrawal request, plus possible payment-provider or conversion charges. A US$100 withdrawal therefore incurs a 5% broker charge before other costs. Confirm the supported return method and card refund rules.", sourceIds: ["bb-fees"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/blackbull.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric score/count was verified. Customer reports are not independent execution tests or proof of future withdrawal performance." };
  review.accountOpening = { ...common, url: "https://secure.blackbull.com/auth/register-live", status: "verified", sourceIds: ["bb-signup"], isAffiliate: false };
}
