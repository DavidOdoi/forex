import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyAvatradeResearch(review: BrokerReview) {
  if (review.broker.slug !== "avatrade" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.avatrade.com/";
  const { common, set } = prepareResearchedRecord(review, "AvaTrade group; retail CFD examples with entity-specific conditions", "2026-11-14", [
    { id: "ava-fees", title: "Spreads, overnight funding and inactivity charges", url: "https://www.avatrade.com/trading-info/our-fees-charges" },
    { id: "ava-min", title: "Minimum deposit by account currency", url: "https://support.avatrade.com/hc/en-us/articles/360001760672-What-is-the-minimum-amount-I-need-to-deposit-in-order-to-open-an-account" },
    { id: "ava-reg", title: "AvaTrade group regulatory disclosures", url: "https://www.avatrade.com/about-avatrade/why-avatrade/regulation" },
    { id: "ava-platform", title: "Trading platforms, markets and educational services", url: "https://www.avatrade.com/" },
    { id: "ava-protect", title: "AvaProtect premium and protection-period conditions", url: "https://www.avatrade.com/trading-info/avaprotect" },
    { id: "ava-withdraw", title: "Withdrawal request and verification requirements", url: "https://support.avatrade.com/hc/en-us/articles/360001760312-How-do-I-withdraw-funds" },
    { id: "ava-signup", title: "Official AvaTrade live-account application", url: "https://www.avatrade.com/trading-account" },
  ]);
  set("minimum-deposit", "USD US$100 / EUR €100 / GBP £100; AUD A$100 for Australian clients.", ["ava-min"]);
  set("forex-commission-per-lot", "Standard retail CFD pricing uses spreads; check instrument charges.", ["ava-fees"]);
  set("forex-spread-and-commission", "Standard retail CFD dealing is spread-based. Compare the live spread with financing, conversion and any optional service charges; we have not measured an average EUR/USD spread. AvaOptions and other services have separate terms.", ["ava-fees", "ava-platform"]);
  set("overnight-financing", "Positions held past the instrument’s funding time may incur an overnight premium. AvaProtect is an optional paid feature: its premium depends on trade size, protection period and expected volatility. It is not blanket insurance or a promise of risk-free trading.", ["ava-fees", "ava-protect"]);
  set("inactivity-fee", "Where legally applicable, three consecutive months of non-use trigger a US$50/€50/£50 fee, repeated each qualifying period. After 12 months of non-use, a separate US$100/€100/£100 administration fee can apply. Read your currency/entity agreement for exceptions and current terms.", ["ava-fees"]);
  set("regulation-and-entity", "AvaTrade reports separate companies supervised in Ireland, Australia, BVI, Japan, South Africa and other jurisdictions. Selected provider-reported permissions appear below; independent register checks remain outstanding. No licence guarantees trading results.", ["ava-reg"]);
  set("contracting-legal-entity", "Confirm the exact company during registration. Products, leverage, client-money rules and compensation arrangements differ; a licence in another group jurisdiction does not extend that country’s protections to your account.", ["ava-reg", "ava-signup"]);
  set("regulation-summary", "Multiple group companies; protections follow your contracting entity.", ["ava-reg"]);
  set("deposit-methods-and-charges", "The minimum-deposit FAQ lists cards, wire transfers and e-wallets, subject to location and currency. Check broker, bank/provider and conversion charges for the actual funding method before sending funds.", ["ava-min", "ava-signup"]);
  set("withdrawal-methods-and-charges", "Submit withdrawals through your verified account. Check the available return method, current charges and payment-provider requirements; an account-opening minimum is not necessarily a withdrawal minimum.", ["ava-withdraw"]);
  set("published-processing-times", "The withdrawal help article states processing within the next 24 business hours for a fully verified account. This is the broker’s processing estimate, not our test or guaranteed arrival at your bank.", ["ava-withdraw"]);
  set("identity-and-address-requirements", "Select your residence, complete requested verification and review the assigned company’s agreement. The published starting deposit is not a recommended trading budget. Professional, managed and Islamic arrangements require their own eligibility checks.", ["ava-signup", "ava-min", "ava-reg"]);
  set("demo-account", "Free demo practice is offered; simulated fills are not live execution.", ["ava-platform"]);
  set("supported-mobile-platforms", "AvaTrade App, mobile MetaTrader and eligible social-trading services.", ["ava-platform"]);
  set("platform-and-availability", "The reviewed lineup includes MT4, MT5, WebTrader, AvaTrade App and AvaOptions. AvaSocial/DupliTrade add strategy-following routes where eligible; copying another trader does not remove losses. Confirm platform/product compatibility before registering.", ["ava-platform", "ava-signup"]);
  set("platform-summary", "MT4 / MT5 / WebTrader / AvaTrade App / AvaOptions.", ["ava-platform"]);
  set("swap-free-option", "Islamic-account arrangements are listed; eligibility and conditions apply.", ["ava-platform"]);
  set("cfds-and-underlying-markets", "The CFD offering covers forex, indices, shares, ETFs, bonds and commodities, with crypto products only where permitted. Share CFDs are not underlying shares; forex options and selected futures services have separate terms.", ["ava-platform"]);
  review.accountComparisons = [
    { ...common, name: "Retail CFD account", category: "Spread-based trading", spread: "Instrument-specific; check current quote", commission: "Spread-based standard dealing", roundTripCommission: "Other instrument/holding charges can apply", minimum: "US$100 / €100 / £100; AUD eligibility applies", platforms: "MT4 / MT5 / WebTrader / AvaTrade App", sourceIds: ["ava-min", "ava-fees", "ava-signup"] },
    { ...common, name: "AvaOptions", category: "Forex options; separate risk profile", spread: "Option pricing varies by contract", commission: "Check the options schedule", minimum: "Confirm options funding requirements", platforms: "AvaOptions", sourceIds: ["ava-platform"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "Retail pricing", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Swap-free option", fieldId: "swap-free-option", state: "text" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Non-use charges", fieldId: "inactivity-fee", state: "text" },
    { label: "Withdrawal processing", fieldId: "published-processing-times", state: "text" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["AvaTrade is worth comparing for MetaTrader, its own platforms and forex-options access.", "Its published starting deposit is generally 100 account-currency units, but inactivity and separate annual administration charges deserve attention.", "Check your entity and the cost of optional tools; AvaProtect and copy trading do not make trading risk-free."], sourceIds: ["ava-platform", "ava-min", "ava-fees", "ava-protect", "ava-reg"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Several platform choices", explanation: "MetaTrader alongside proprietary web and mobile access.", sourceIds: ["ava-platform"] },
    { title: "Forex-options route", explanation: "AvaOptions serves a different strategy and risk profile.", sourceIds: ["ava-platform"] },
    { title: "Published entry amounts", explanation: "The help centre distinguishes supported account currencies.", sourceIds: ["ava-min"] },
    { title: "Education and demo access", explanation: "Practise platform workflows before risking money.", sourceIds: ["ava-platform"] },
    { title: "Optional protection tool", explanation: "AvaProtect offers limited contractual protection for a premium.", sourceIds: ["ava-protect"] },
  ];
  review.limitations = [
    { title: "Quarterly non-use fee", explanation: "US$50 or listed currency equivalent can recur.", sourceIds: ["ava-fees"] },
    { title: "Separate annual administration fee", explanation: "A further fee can apply after 12 months of non-use.", sourceIds: ["ava-fees"] },
    { title: "Protection costs extra", explanation: "AvaProtect has a premium and limited duration.", sourceIds: ["ava-protect"] },
    { title: "Copying still carries risk", explanation: "Another trader’s decisions can generate losses.", sourceIds: ["ava-platform"] },
    { title: "Entity-dependent safeguards", explanation: "Products and protection differ between group companies.", sourceIds: ["ava-reg"] },
  ];
  review.entities = [
    { name: "Ava Trade EU Ltd", country: "Ireland", regulator: "Central Bank of Ireland", licence: "C53877", sourceId: "ava-reg" },
    { name: "Ava Capital Markets Australia Pty Ltd", country: "Australia", regulator: "ASIC", licence: "406684", sourceId: "ava-reg" },
    { name: "Ava Trade Markets Ltd", country: "British Virgin Islands", regulator: "FSC", licence: "SIBA/L/13/1049", sourceId: "ava-reg" },
  ];
  review.faqs[1] = { question: "Is AvaTrade regulated?", answer: "AvaTrade identifies several regulated companies, including Irish, Australian and BVI entities. Confirm the exact company, permission and client classification in the regulator’s register before funding. Group licences do not transfer protections between accounts, and independent register checks remain outstanding here.", sourceIds: ["ava-reg"] };
  review.faqs[5] = { question: "What is AvaTrade’s minimum deposit?", answer: "The official help centre lists US$100 for USD accounts, €100 for EUR and £100 for GBP. A$100 is listed for AUD accounts, which are available to Australian clients. Confirm the currencies and payment methods supported by your assigned entity.", sourceIds: ["ava-min"] };
  review.faqs[6] = { question: "Does AvaTrade charge inactivity fees?", answer: "Where legally applicable, three consecutive months of non-use can trigger US$50/€50/£50, repeated each qualifying period. A separate US$100/€100/£100 annual administration fee can apply after 12 months of non-use. Check the current agreement and exceptions before leaving funds idle.", sourceIds: ["ava-fees"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/avatrade.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric score/count was verified. Match customer accounts to the entity and product; testimonials do not establish future results." };
  review.accountOpening = { ...common, url: "https://www.avatrade.com/trading-account", status: "verified", sourceIds: ["ava-signup"], isAffiliate: false };
}
