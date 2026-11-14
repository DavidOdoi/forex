import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyTickmillResearch(review: BrokerReview) {
  if (review.broker.slug !== "tickmill" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.tickmill.com/";
  const { common, set } = prepareResearchedRecord(review, "Tickmill group; international account examples, entity conditions separate", "2026-11-14", [
    { id: "tick-accounts", title: "Classic, Raw and TradingView Raw specifications", url: "https://www.tickmill.com/trading/accounts-overview" },
    { id: "tick-minimum", title: "Starting deposit and account currency", url: "https://www.tickmill.com/about/faq/what-is-the-minimum-deposit" },
    { id: "tick-regulation", title: "Group regulatory disclosures", url: "https://www.tickmill.com/eu/about/licences-and-regulation" },
    { id: "tick-funding", title: "Funding schedule and inactivity qualification", url: "https://www.tickmill.com/conditions/deposit-and-withdrawal" },
    { id: "tick-withdrawals", title: "Withdrawal processing, arrival and minimums", url: "https://www.tickmill.com/about/faq/topics/withdrawals" },
    { id: "tick-platform", title: "Tickmill mobile platform", url: "https://www.tickmill.com/trading-platforms/mobile-app" },
    { id: "tick-signup", title: "Official Tickmill registration", url: "https://my.tickmill.com/sign-up" },
  ]);
  set("minimum-deposit", "Starting deposit US$100; currency/entity conditions differ.", ["tick-minimum", "tick-accounts"]);
  set("forex-commission-per-lot", "USD Raw example: US$3/lot/side; US$6 round trip.", ["tick-accounts"]);
  set("tradingview-commission", "TradingView Raw: US$3.50/lot/side; US$7 round trip.", ["tick-accounts"]);
  set("classic-spread", "Classic: from 1.6 pips, no separate forex commission.", ["tick-accounts"]);
  set("forex-spread-and-commission", "Classic starts from 1.6 pips without separate FX commission. Raw starts from 0.0 plus US$3/lot/side; TradingView Raw uses US$3.50/side. These are published USD-account examples, not measured averages or universal entity terms.", ["tick-accounts"]);
  set("overnight-financing", "Check the symbol’s swap/holding terms before keeping positions overnight. Swap-free accounts require eligibility and have separate conditions; they do not imply every possible charge is removed.", ["tick-accounts"]);
  set("inactivity-fee", "The current funding page reserves the right to charge inactivity fees under its Terms & Conditions. Do not assume an unconditional zero fee from older reviews; confirm your governing terms.", ["tick-funding"]);
  set("swap-free-option", "Available to eligible clients, subject to account conditions.", ["tick-accounts"]);
  set("regulation-and-entity", "Tickmill discloses UK FCA 717270, Cyprus CySEC 278/15 and Seychelles FSA SD008 through separate companies. These are provider-reported permissions; independent register checks remain outstanding. A representative office is not permission for every trading service.", ["tick-regulation"]);
  set("contracting-legal-entity", "Confirm the company assigned during registration. Global leverage and pricing are not EU/UK retail entitlements; licences held elsewhere in the group do not transfer protections to your account.", ["tick-regulation", "tick-accounts"]);
  set("regulation-summary", "Separate UK, Cyprus and Seychelles entities; confirm your contract.", ["tick-regulation"]);
  set("country-availability", "Residence determines the available company, products and agreement. Confirm eligibility and local funding requirements before depositing; website availability alone does not establish lawful access.", ["tick-regulation", "tick-signup"]);
  set("deposit-methods-and-charges", "Supported methods and processing schedules appear in the funding page and client area. Bank/provider charges and conversion can remain even when the broker’s listed transfer charge is zero.", ["tick-funding"]);
  set("withdrawal-methods-and-charges", "The FAQ lists a minimum of 25 USD/EUR/GBP. Check method-specific fees, verification and available margin before requesting funds; third-party charges can apply.", ["tick-withdrawals", "tick-funding"]);
  set("published-processing-times", "Tickmill states broker processing within one working day. After processing, wires can take 2–7 working days, cards up to eight and other eligible methods usually one. These are provider estimates, not our withdrawal test.", ["tick-withdrawals"]);
  set("identity-and-address-requirements", "Choose your country and assigned company, complete requested verification and read the current agreement. The US$100 entry amount is not a recommended trading budget; specialist futures services have separate requirements.", ["tick-signup", "tick-minimum", "tick-accounts"]);
  set("demo-account", "Virtual-funds practice is offered; simulated fills are not live execution.", ["tick-accounts"]);
  set("supported-mobile-platforms", "Tickmill’s mobile app and regional MetaTrader access; not tested here.", ["tick-platform", "tick-accounts"]);
  set("platform-summary", "MT4/MT5; TradingView Raw uses TradingView and Tickmill Trader.", ["tick-accounts"]);
  set("platform-and-availability", "Classic/Raw list MT4 and MT5; TradingView Raw lists TradingView and Tickmill Trader with a different commission. Check the available platform, symbol list and account terms for your company.", ["tick-accounts", "tick-platform"]);
  set("cfds-and-underlying-markets", "Forex and eligible index, commodity, share and crypto CFDs provide price exposure without underlying ownership. Separate futures services have different accounts, minimums and permissions.", ["tick-accounts", "tick-regulation"]);
  const base = { ...common, minimum: "US$100 starting point; confirm currency/entity" };
  review.accountComparisons = [
    { ...base, name: "Classic", category: "International spread-only example", spread: "From 1.6 pips", commission: "No separate FX commission", roundTripCommission: "US$0 separate FX commission", platforms: "MT4 / MT5", sourceIds: ["tick-accounts", "tick-minimum"] },
    { ...base, name: "Raw", category: "USD commission example", spread: "From 0.0 pips", commission: "US$3/lot/side", roundTripCommission: "US$6/standard lot", platforms: "MT4 / MT5", sourceIds: ["tick-accounts", "tick-minimum"] },
    { ...base, name: "TradingView Raw", category: "USD commission example", spread: "From 0.0 pips", commission: "US$3.50/lot/side", roundTripCommission: "US$7/standard lot", platforms: "TradingView / Tickmill Trader", sourceIds: ["tick-accounts", "tick-minimum"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "Classic pricing", fieldId: "classic-spread", state: "text" },
    { label: "Raw commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "TradingView commission", fieldId: "tradingview-commission", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Swap-free option", fieldId: "swap-free-option", state: "text" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["Tickmill is worth comparing for Classic spread-only pricing or Raw commission-based trading.", "Its published USD examples charge US$3/lot/side on Raw and US$3.50 on TradingView Raw, with a US$100 starting deposit.", "Confirm your entity, currency and inactivity terms before funding; these are not worldwide guarantees."], sourceIds: ["tick-accounts", "tick-minimum", "tick-regulation", "tick-funding"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Three pricing/platform routes", explanation: "Compare Classic, Raw and TradingView Raw in one schedule.", sourceIds: ["tick-accounts"] },
    { title: "Explicit commission", explanation: "USD Raw publishes US$6 round trip; TradingView Raw US$7.", sourceIds: ["tick-accounts"] },
    { title: "MetaTrader automation", explanation: "The account page permits automated strategies, subject to terms.", sourceIds: ["tick-accounts"] },
    { title: "Virtual practice", explanation: "Explore supported workflows on a demo before funding.", sourceIds: ["tick-accounts"] },
    { title: "Swap-free option", explanation: "Eligible clients can request account-specific arrangements.", sourceIds: ["tick-accounts"] },
  ];
  review.limitations = [
    { title: "Higher TradingView commission", explanation: "Its published per-side USD commission exceeds standard Raw.", sourceIds: ["tick-accounts"] },
    { title: "Classic spread trade-off", explanation: "Its 1.6-pip advertised floor is not a measured average.", sourceIds: ["tick-accounts"] },
    { title: "Inactivity qualification", explanation: "The current funding page reserves a right to charge under the agreement.", sourceIds: ["tick-funding"] },
    { title: "Arrival can take days", explanation: "Broker processing and bank/card settlement are separate.", sourceIds: ["tick-withdrawals"] },
    { title: "Entity restrictions", explanation: "Global pricing/leverage do not establish EU or UK retail terms.", sourceIds: ["tick-regulation"] },
  ];
  review.entities = [
    { name: "Tickmill UK Ltd", country: "United Kingdom", regulator: "FCA", licence: "717270", sourceId: "tick-regulation" },
    { name: "Tickmill Europe Ltd", country: "Cyprus", regulator: "CySEC", licence: "278/15", sourceId: "tick-regulation" },
    { name: "Tickmill Ltd", country: "Seychelles", regulator: "FSA", licence: "SD008", sourceId: "tick-regulation" },
  ];
  review.faqs[1] = { question: "Is Tickmill a legitimate and regulated forex broker?", answer: "Tickmill identifies separate UK, Cyprus and Seychelles companies. Verify the company in your agreement against its regulator’s register. Group licences do not transfer protections between accounts or prevent trading losses; these register entries were not independently confirmed here.", sourceIds: ["tick-regulation"] };
  review.faqs[5] = { question: "What is the minimum deposit for Tickmill?", answer: "The current FAQ gives a US$100 starting deposit, subject to account-currency differences. Confirm the assigned entity and method; specialist futures services have separate minimums. A starting deposit is not a recommended trading budget.", sourceIds: ["tick-minimum", "tick-accounts"] };
  review.faqs[6] = { question: "How long do Tickmill withdrawals take?", answer: "The broker states processing within one working day. Arrival estimates after processing are 2–7 working days for international wires, up to eight for cards and usually one for other eligible methods. Checks and providers can add delays; we did not test withdrawals.", sourceIds: ["tick-withdrawals"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/www.tickmill.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric TrustScore or count was confirmed. Check which entity and account a customer experience concerns; feedback does not establish safety or future results." };
  review.accountOpening = { ...common, url: "https://my.tickmill.com/sign-up", status: "verified", sourceIds: ["tick-signup"], isAffiliate: false };
}
