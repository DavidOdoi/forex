import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyCmcMarketsResearch(review: BrokerReview) {
  if (review.broker.slug !== "cmc-markets" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.cmcmarkets.com/";
  const { common, set } = prepareResearchedRecord(review, "CMC Markets group; UK cost examples identified separately", "2026-11-14", [
    { id: "cmc-active", title: "FX Active spreads and notional-based commission", url: "https://www.cmcmarkets.com/en/forex/forex-active-trader" },
    { id: "cmc-costs", title: "Trading costs and guaranteed stops", url: "https://www.cmcmarkets.com/en/trading-costs" },
    { id: "cmc-regulation", title: "UK entity and regulatory information", url: "https://www.cmcmarkets.com/en-gb/important-information" },
    { id: "cmc-charges", title: "UK charges and dormant-account rules", url: "https://www.cmcmarkets.com/en-gb/support/faqs/charges" },
    { id: "cmc-withdrawals", title: "UK withdrawal methods and estimates", url: "https://www.cmcmarkets.com/en-gb/support/faqs/withdrawals" },
    { id: "cmc-platforms", title: "Proprietary and third-party platforms", url: "https://www.cmcmarkets.com/en/trading-platforms" },
    { id: "cmc-independent", title: "ForexBrokers.com CMC Markets assessment", url: "https://www.forexbrokers.com/reviews/cmc-markets", publisher: "ForexBrokers.com" },
    { id: "cmc-signup", title: "Official account and country selection", url: "https://signup.cmcmarkets.com/" },
  ]);
  set("minimum-deposit", "Main Standard/FX Active accounts: no opening minimum reported; margin still required.", ["cmc-independent"]);
  set("forex-commission-per-lot", "FX Active: 0.0025% of notional per side, not a universal per-lot fee.", ["cmc-active"]);
  set("active-spread", "From 0.0 pips on six major pairs; actual spreads vary.", ["cmc-active"]);
  set("forex-spread-and-commission", "Standard uses spread-only forex pricing. FX Active charges 0.0025% of notional per side: US$2.50 per US$100,000 traded value. The amount varies with notional and currency; it is not automatically US$2.50 per 100,000 base-currency units.", ["cmc-active", "cmc-independent"]);
  set("overnight-financing", "Holding costs can apply to leveraged positions. Share/ETF commissions, market-data subscriptions, currency conversion and guaranteed-stop premiums are separate; read the relevant product schedule.", ["cmc-costs", "cmc-charges"]);
  set("inactivity-fee", "UK: £10/month equivalent when there are no open positions and no trading activity for one year, while funds remain. The fee does not create a negative balance; other companies’ terms differ.", ["cmc-charges"]);
  set("inactivity-summary", "UK: £10/month equivalent after one year’s qualifying inactivity.", ["cmc-charges"]);
  set("guaranteed-stop", "Premium applies; refunded if the eligible GSLO is not triggered.", ["cmc-costs"]);
  set("regulation-and-entity", "The UK page identifies CMC Markets UK plc under FCA reference 173730. The group has separate international companies; UK permissions and safeguards do not transfer automatically. No independent regulator-register match was completed here.", ["cmc-regulation"]);
  set("contracting-legal-entity", "Check the company and product in your agreement. UK CFD cost examples below are not universal group terms; investment accounts and professional classifications have separate requirements.", ["cmc-regulation", "cmc-independent"]);
  set("regulation-summary", "UK example: CMC Markets UK plc, FCA 173730; confirm your company.", ["cmc-regulation"]);
  set("country-availability", "Residence determines the eligible company, products and account. Confirm country and funding eligibility before applying; access to the website does not establish permission to trade.", ["cmc-signup", "cmc-regulation"]);
  set("deposit-methods-and-charges", "Payment methods and funding requirements vary by entity. The independent review reports no opening minimum on Standard/FX Active; enough funds for margin and risk management are still required.", ["cmc-independent", "cmc-withdrawals"]);
  set("withdrawal-methods-and-charges", "Use the supported withdrawal method shown for your account and confirm charges before submitting. Standard methods and international/express services can differ; receiving-bank and conversion costs may remain.", ["cmc-withdrawals", "cmc-charges"]);
  set("published-processing-times", "UK guidance estimates 1–2 working days for domestic banks, 3–5 for international banks and under an hour to five working days for cards, depending on issuer. Cutoffs/checks affect timing; we did not test withdrawals.", ["cmc-withdrawals"]);
  set("identity-and-address-requirements", "Choose your country and available product, complete requested identity/payment checks and read the assigned agreement. Standard/FX Active pricing is not the same as qualifying for premium or professional services.", ["cmc-signup", "cmc-regulation", "cmc-independent"]);
  set("demo-account", "Virtual-funds practice is available; simulated fills are not live execution.", ["cmc-platforms", "cmc-independent"]);
  set("supported-mobile-platforms", "CMC’s mobile app plus supported third-party mobile platforms; not tested here.", ["cmc-platforms"]);
  set("platform-summary", "Next Generation, MT4, MT5 and TradingView where offered.", ["cmc-platforms"]);
  set("platform-and-availability", "The platform page lists proprietary software, MT4, MT5 and TradingView. Available instruments and features differ by platform and company. Guaranteed stops cost a premium; a refund concerns an unused premium, not trading losses.", ["cmc-platforms", "cmc-costs"]);
  set("cfds-and-underlying-markets", "The broker advertises extensive forex and multi-market CFD access. Share/ETF CFDs do not confer ownership; regional direct-investing services have separate terms. Instrument availability differs by entity and platform.", ["cmc-active", "cmc-platforms", "cmc-independent"]);
  const base = { ...common, minimum: "No opening minimum reported; confirm entity/method", platforms: "Next Generation / regional MT4, MT5, TradingView" };
  review.accountComparisons = [
    { ...base, name: "Standard", category: "Spread-only forex pricing", spread: "Variable; instrument-specific", commission: "No separate standard forex commission", roundTripCommission: "US$0 separate forex commission", sourceIds: ["cmc-independent", "cmc-platforms"] },
    { ...base, name: "FX Active", category: "Notional-based forex commission", spread: "From 0.0 pips on six majors", commission: "0.0025% of notional per side", roundTripCommission: "US$5 on unchanged US$100,000 notional", sourceIds: ["cmc-active", "cmc-independent", "cmc-platforms"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "FX Active commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "FX Active spread", fieldId: "active-spread", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Guaranteed stops", fieldId: "guaranteed-stop", state: "text" },
    { label: "Inactivity fee", fieldId: "inactivity-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["CMC Markets is worth comparing for proprietary charting and a choice between Standard and FX Active forex pricing.", "FX Active charges 0.0025% of traded notional per side, with advertised zero-spread floors on six major pairs.", "Confirm your entity, platform and holding costs; the UK inactivity and funding examples are not worldwide terms."], sourceIds: ["cmc-platforms", "cmc-active", "cmc-charges"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Two forex pricing models", explanation: "Compare spread-only Standard with notional-based FX Active.", sourceIds: ["cmc-active", "cmc-independent"] },
    { title: "Platform choice", explanation: "Proprietary software plus regional MetaTrader and TradingView access.", sourceIds: ["cmc-platforms"] },
    { title: "Broad currency coverage", explanation: "The FX Active page advertises access across hundreds of forex pairs.", sourceIds: ["cmc-active"] },
    { title: "Guaranteed-stop option", explanation: "Eligible unused GSLO premiums are refunded under published terms.", sourceIds: ["cmc-costs"] },
    { title: "Virtual practice", explanation: "Explore supported platform features using demo funds.", sourceIds: ["cmc-platforms"] },
  ];
  review.limitations = [
    { title: "Inactivity can cost", explanation: "UK dormant accounts can incur £10/month equivalent.", sourceIds: ["cmc-charges"] },
    { title: "Notional commission varies", explanation: "Do not equate US$100,000 notional with every standard forex lot.", sourceIds: ["cmc-active"] },
    { title: "Additional product charges", explanation: "Share/ETF commission, holding, data and conversion costs can apply.", sourceIds: ["cmc-costs", "cmc-charges"] },
    { title: "Platform differences", explanation: "Product lists and features are not identical across platforms.", sourceIds: ["cmc-platforms"] },
    { title: "Regional conditions", explanation: "UK safeguards, costs and bank timings are not universal group terms.", sourceIds: ["cmc-regulation", "cmc-withdrawals"] },
  ];
  review.entities = [{ name: "CMC Markets UK plc", country: "United Kingdom", regulator: "FCA", licence: "173730", sourceId: "cmc-regulation", note: "Entity for the UK examples; confirm the company assigned for your own residence." }];
  review.faqs[1] = { question: "Is CMC Markets a legitimate and regulated forex broker?", answer: "Its UK disclosure identifies CMC Markets UK plc, FCA reference 173730. Other countries use separate companies. Match your agreement to the official register; a group licence does not transfer protections or prevent trading losses. Register entries were not independently confirmed here.", sourceIds: ["cmc-regulation"] };
  review.faqs[5] = { question: "What is the minimum deposit for CMC Markets?", answer: "The independent review reports no opening minimum on Standard and FX Active CFD accounts. Confirm your entity and method; premium services can have separate requirements. No minimum does not mean you can trade without sufficient margin or risk capital.", sourceIds: ["cmc-independent"] };
  review.faqs[6] = { question: "Is CMC Markets better than IG?", answer: "Compare the platforms, markets, total costs and company available to your residence. CMC offers proprietary charting and FX Active pricing, but notional commissions and holding charges matter. Neither broker is universally better for every trading strategy.", sourceIds: ["cmc-platforms", "cmc-active", "cmc-costs"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/www.cmcmarkets.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric TrustScore or count was confirmed. Match feedback to the relevant company and product; publisher ratings and customer reviews are separate assessments." };
  review.accountOpening = { ...common, url: "https://signup.cmcmarkets.com/", status: "verified", sourceIds: ["cmc-signup"], isAffiliate: false };
}
