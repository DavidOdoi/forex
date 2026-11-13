import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyCapitalComResearch(review: BrokerReview) {
  if (review.broker.slug !== "capital-com" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://capital.com/en-int";
  const help = "https://help.capital.com/hc/en-us/articles/";
  const { common, set } = prepareResearchedRecord(review, "Capital Com Online Investments Ltd, Bahamas; other entities identified separately", "2026-11-13", [
    { id: "capital-fees", title: "International CFD fees and funding minimums", url: "https://capital.com/en-int/ways-to-trade/fees-and-charges" },
    { id: "capital-regulation", title: "Group legal entities and regulators", url: `${help}360016569340-Who-is-your-regulator` },
    { id: "capital-payments", title: "Broker payment fees", url: `${help}360016602639-Do-you-charge-any-payment-fees` },
    { id: "capital-withdrawals", title: "Withdrawal processing and receipt", url: `${help}360016537600-How-long-do-withdrawals-take` },
    { id: "capital-countries", title: "Restricted countries and US citizenship", url: `${help}27040372144274-Is-Capital-com-available-in-my-country` },
    { id: "capital-protection", title: "Retail negative-balance policy", url: `${help}360016557020-Do-you-offer-negative-balance-protection` },
    { id: "capital-metatrader", title: "MetaTrader access and UK restriction", url: `${help}4404606589586-How-can-I-create-a-MetaTrader-MetaTrader4-MetaTrader5-account` },
    { id: "capital-demo", title: "Demo trading and platform access", url: "https://capital.com/en-int/trading-platforms/demo-account" },
    { id: "capital-independent", title: "ForexBrokers.com Capital.com assessment", url: "https://www.forexbrokers.com/reviews/capital-com", publisher: "ForexBrokers.com" },
    { id: "capital-signup", title: "Capital.com registration", url: "https://capital.com/trading/signup" },
  ]);
  set("minimum-deposit", "International: cards/Apple Pay 10 USD/EUR/GBP; wires €50 equivalent.", ["capital-fees"]);
  set("forex-commission-per-lot", "No separate CFD dealing commission; spreads and other charges apply.", ["capital-fees"]);
  set("forex-spread-and-commission", "CFDs use variable spreads without separate dealing commission. ForexBrokers.com reports a 0.7-pip EUR/USD average in its 2026 testing; this is that publisher’s result, not our measurement or a current quote.", ["capital-fees", "capital-independent"]);
  set("overnight-financing", "Overnight funding can apply; some unleveraged positions also have exceptions. Check the instrument, direction and cutoff. Guaranteed-stop and conversion charges are separate.", ["capital-fees"]);
  set("inactivity-fee", "ForexBrokers.com’s 2026 review reports no inactivity fee; confirm your governing schedule.", ["capital-independent"]);
  set("currency-conversion-fee", "International schedule: retail 0.7%; professional 0.5% FX markup. Entity terms differ.", ["capital-fees"]);
  set("regulation-and-entity", "The international site uses Capital Com Online Investments Ltd, Bahamas (SCB SIA-F245). Separate group companies include UK FCA 793714, Australia ASIC 513393 and Cyprus CySEC 319/17 and 463/25. These are provider disclosures; register entries were not independently confirmed.", ["capital-regulation"]);
  set("contracting-legal-entity", "Confirm the company assigned during onboarding. A Bahamas account does not automatically receive UK/EU protections; professional classification can change safeguards.", ["capital-regulation"]);
  set("negative-balance-protection", "The help policy describes eligible retail balances being reset to zero after adverse movements. This does not prevent losing the full deposit; check your agreement and classification.", ["capital-protection"]);
  set("protection-summary", "Retail negative-balance policy; conditions apply, trading losses remain possible.", ["capital-protection"]);
  set("regulation-summary", "International: SCB, Bahamas, SIA-F245; other entities differ.", ["capital-regulation"]);
  set("country-availability", "Restricted markets include the US, Canada, India, Indonesia, Malaysia, Philippines, Singapore, South Africa and New Zealand, among others. US citizens cannot be served regardless of residence. Check the full current policy before applying.", ["capital-countries"]);
  set("accepts-us-citizens", "No, regardless of residence, according to the current policy.", ["capital-countries"]);
  set("deposit-methods-and-charges", "International cards/Apple Pay start at 10 USD/EUR/GBP; wires at €50 equivalent. The broker charges no deposit fee; banks/providers may charge. Methods and limits vary by entity.", ["capital-fees", "capital-payments"]);
  set("withdrawal-methods-and-charges", "No broker withdrawal fee is advertised; external charges can apply. The international card minimum is 20 USD/EUR/GBP; a smaller remaining balance can be withdrawn in full.", ["capital-fees", "capital-payments"]);
  set("published-processing-times", "Requests are typically handled within 24 hours; card/bank receipt can take up to five business days. Additional checks can extend this. These are provider estimates, not our withdrawal test.", ["capital-withdrawals"]);
  set("identity-and-address-requirements", "First check residence eligibility: the US, India, Malaysia, Singapore and South Africa are among excluded markets. Then complete the application and requested identity/payment checks and read the assigned agreement. Product access is not guaranteed.", ["capital-signup", "capital-countries"]);
  set("demo-account", "Available with virtual funds; simulated results do not establish live execution.", ["capital-demo"]);
  set("supported-mobile-platforms", "Capital.com offers its own mobile app plus supported MetaTrader access.", ["capital-demo", "capital-metatrader"]);
  set("platform-summary", "Capital.com web/app, MT4, regional MT5 and TradingView.", ["capital-demo", "capital-metatrader", "capital-independent"]);
  set("platform-and-availability", "Proprietary web/mobile, MT4 and eligible MT5 accounts are offered. MT5 is unavailable to UK residents. TradingView execution integration is reported in the independent review; confirm your entity’s available connection and markets.", ["capital-metatrader", "capital-independent"]);
  set("cfds-and-underlying-markets", "Forex, index, share, commodity and eligible crypto CFDs give price exposure without underlying ownership. Regional direct-share services are separate; an unleveraged share CFD is not an ordinary shareholding.", ["capital-demo", "capital-independent"]);
  review.accountComparisons = [
    { ...common, name: "Retail CFD", category: "International pricing example", spread: "Variable; instrument-specific", commission: "No separate dealing commission", roundTripCommission: "US$0 separate CFD commission", minimum: "Cards/Apple Pay: 10 USD/EUR/GBP; wires: €50 equivalent", platforms: "Web/app, MT4, regional MT5/TradingView", sourceIds: ["capital-fees", "capital-metatrader", "capital-independent"] },
    { ...common, name: "Demo", category: "Virtual-money practice", spread: "Simulated market conditions", commission: "Virtual-money practice", minimum: "No real-money deposit", platforms: "Capital.com demo", sourceIds: ["capital-demo"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "CFD commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Currency conversion", fieldId: "currency-conversion-fee", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Balance protection", fieldId: "protection-summary", state: "text" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
    { label: "Accepts US citizens", fieldId: "accepts-us-citizens", state: "no" },
  ];
  review.verdictEvidence = { ...common, sentences: ["Capital.com is worth comparing for spread-based CFD trading without a separate dealing commission.", "Its international schedule starts cards/Apple Pay at 10 USD/EUR/GBP and bank wires at €50 equivalent.", "Check country eligibility, financing and the assigned legal entity; these are not worldwide account terms."], sourceIds: ["capital-fees", "capital-countries", "capital-regulation"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Simple CFD pricing", explanation: "No separate dealing commission; spreads remain a cost.", sourceIds: ["capital-fees"] },
    { title: "Low card entry amount", explanation: "International cards/Apple Pay start at 10 USD/EUR/GBP.", sourceIds: ["capital-fees"] },
    { title: "Several platform routes", explanation: "Proprietary apps and regional MetaTrader/TradingView access.", sourceIds: ["capital-metatrader", "capital-independent"] },
    { title: "No broker payment fee", explanation: "Bank/provider charges and conversion can still apply.", sourceIds: ["capital-payments"] },
    { title: "Virtual practice", explanation: "Explore supported tools on a demo before risking money.", sourceIds: ["capital-demo"] },
  ];
  review.limitations = [
    { title: "Country restrictions", explanation: "Several major markets are excluded; check current residence/citizenship rules.", sourceIds: ["capital-countries"] },
    { title: "Holding and FX costs", explanation: "Financing and currency conversion can add to the spread.", sourceIds: ["capital-fees"] },
    { title: "MT5 restriction", explanation: "The help centre excludes UK residents from MT5.", sourceIds: ["capital-metatrader"] },
    { title: "Entity-specific protection", explanation: "Bahamian clients do not automatically receive UK/EU safeguards.", sourceIds: ["capital-regulation"] },
    { title: "CFDs do not confer ownership", explanation: "Separate regional investing services have different terms.", sourceIds: ["capital-independent"] },
  ];
  review.entities = [
    { name: "Capital Com Online Investments Ltd", country: "Bahamas", regulator: "SCB", licence: "SIA-F245", sourceId: "capital-regulation", note: "International-site entity; resident eligibility is separate from licensing." },
    { name: "Capital Com (UK) Limited", country: "United Kingdom", regulator: "FCA", licence: "793714", sourceId: "capital-regulation" },
    { name: "Capital Com Australia Pty Ltd", country: "Australia", regulator: "ASIC", licence: "513393", sourceId: "capital-regulation" },
    { name: "Capital Com SV Investments Limited", country: "Cyprus", regulator: "CySEC", licence: "319/17", sourceId: "capital-regulation" },
  ];
  review.faqs[1] = { question: "Is Capital.com a legitimate and regulated broker?", answer: "Capital.com identifies separate regulated companies, including its Bahamas, UK, Australian and Cyprus businesses. Match your agreement’s company to the official register. A group licence does not transfer protections across accounts or prevent CFD trading losses.", sourceIds: ["capital-regulation"] };
  review.faqs[5] = { question: "What is Capital.com’s minimum deposit?", answer: "The current international schedule lists 10 USD/EUR/GBP for cards and Apple Pay, and €50 equivalent for wires. Other entity/method requirements can differ. This is a funding minimum, not a recommended trading budget.", sourceIds: ["capital-fees"] };
  review.faqs[6] = { question: "Is Capital.com better than IG?", answer: "Choose by your needs: compare each entity’s spread, financing, currency conversion, platform functions and country eligibility. Capital.com offers spread-based CFD pricing; that alone does not establish which broker is cheaper or more suitable for your strategy.", sourceIds: ["capital-fees", "capital-independent", "capital-countries"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/capital.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric TrustScore or review count was confirmed. Customer feedback and publisher ratings are separate; neither establishes safety or future returns." };
  review.accountOpening = { ...common, url: "https://capital.com/trading/signup", status: "verified", sourceIds: ["capital-signup"], isAffiliate: false };
}
