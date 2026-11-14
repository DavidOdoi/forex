import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyXtbResearch(review: BrokerReview) {
  if (review.broker.slug !== "xtb" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.xtb.com/";
  const { common, set } = prepareResearchedRecord(review, "XTB group; UK pricing examples, other entities require their own schedule", "2026-11-14", [
    { id: "xtb-account", title: "UK account, CFD and investing fee schedule", url: "https://www.xtb.com/en/account-and-fees" },
    { id: "xtb-fees", title: "Conversion, commission and inactivity conditions", url: "https://www.xtb.com/en/help-center/fees-and-payments-3/fees-and-commissions-at-xtb" },
    { id: "xtb-reg", title: "Group entities and regulatory disclosures", url: "https://www.xtb.com/en/help-center/trading-account-1-1/how-is-xtb-group-regulated" },
    { id: "xtb-platform", title: "XTB platform, education and investment services", url: "https://www.xtb.com/en" },
    { id: "xtb-signup", title: "Official XTB international account gateway", url: "https://www.xtb.com/int" },
  ]);
  set("minimum-deposit", "UK schedule: no minimum deposit; payment/order limits still apply.", ["xtb-account"]);
  set("forex-commission-per-lot", "Reviewed UK CFDs: no separate dealing commission; spreads remain.", ["xtb-account"]);
  set("forex-spread-and-commission", "The reviewed UK schedule lists 0% CFD dealing commission, with trading costs in spreads and other applicable charges. Eligible stock/ETF investing is separate: 0% commission up to €100,000 monthly turnover, then 0.2% with a published UK minimum of £10. This is not worldwide pricing.", ["xtb-account"]);
  set("overnight-financing", "Check each CFD’s overnight financing and instrument specification. A 0.5% conversion margin can apply when the instrument and account currencies differ. Internal transfers between currency accounts cost 0.5%, or 0.8% on weekends/holidays, under the reviewed help-centre terms.", ["xtb-account", "xtb-fees"]);
  set("inactivity-fee", "€10/month or account-currency equivalent applies when BOTH conditions hold: no position opened/closed for 365 days and no deposit for 90 days. Exceptions include no available funds, specified open stock/ETF positions and ISA accounts; read your entity’s terms.", ["xtb-fees"]);
  set("regulation-and-entity", "XTB identifies separate UK FCA 522157, Cyprus CySEC 169/12 and Belize FSC 6442514 companies. These are provider disclosures, not independent register checks. Your contract determines the relevant company and protections.", ["xtb-reg"]);
  set("contracting-legal-entity", "Confirm your residence, assigned company and product permissions during onboarding. Do not apply the UK fee table or its retail protections automatically to an international account.", ["xtb-reg", "xtb-account"]);
  set("regulation-summary", "Separate UK, Cyprus and Belize companies; confirm your agreement.", ["xtb-reg"]);
  set("negative-balance-protection", "Listed for the reviewed UK retail CFD offering; check classification and exclusions.", ["xtb-account"]);
  set("client-money-arrangements", "The UK account page lists segregated funds; this is not a bank guarantee.", ["xtb-account"]);
  set("deposit-methods-and-charges", "The reviewed UK page lists cards and bank transfers without an XTB deposit charge. Payment providers and currency conversion may add costs; international methods and limits can differ.", ["xtb-account"]);
  set("withdrawal-methods-and-charges", "The current UK schedule lists withdrawals as free. Older regional threshold-based charges should not be treated as universal current fees. Check your entity’s method, receiving-bank charges and withdrawal instructions.", ["xtb-account"]);
  set("identity-and-address-requirements", "Select your real country of residence and complete the identity, tax and product checks requested. Confirm the assigned company before funding. No account deposit minimum does not remove minimum order sizes or margin requirements.", ["xtb-signup", "xtb-account", "xtb-reg"]);
  set("demo-account", "Demo practice is offered; simulated results are not live performance.", ["xtb-platform"]);
  set("supported-mobile-platforms", "XTB’s proprietary mobile app; compatibility and features vary by device.", ["xtb-platform"]);
  set("platform-and-availability", "XTB focuses on its proprietary app and browser platform. The reviewed current offering does not list MT4, MT5 or cTrader; test whether its charts, order controls and workflow meet your needs before funding.", ["xtb-platform"]);
  set("platform-summary", "Proprietary XTB app and browser trading.", ["xtb-platform"]);
  set("real-stocks-and-etfs", "Eligible accounts can invest in underlying stocks/ETFs as well as trade CFDs. Check the order ticket: a share CFD does not give the same ownership rights as a cash share.", ["xtb-account", "xtb-platform"]);
  set("cfds-and-underlying-markets", "Forex, index and commodity CFDs offer leveraged price exposure. Eligible real-stock/ETF investing is a separate service with its own fees and product restrictions.", ["xtb-platform", "xtb-account"]);
  set("leverage-by-product-and-region", "The reviewed UK retail table caps maximum leverage at 1:30; individual instruments can require more margin. Other companies and professional classifications use different terms.", ["xtb-account"]);
  review.accountComparisons = [
    { ...common, name: "UK retail CFDs", category: "Spread-based leveraged trading", spread: "Variable; check live instrument", commission: "0% separate CFD commission", roundTripCommission: "No separate dealing commission", minimum: "No account deposit minimum", platforms: "XTB app / browser", sourceIds: ["xtb-account", "xtb-platform"] },
    { ...common, name: "UK stocks / ETFs", category: "Eligible underlying investments", spread: "Market bid/ask; conversion may apply", commission: "0% to €100k/month; then 0.2%, min £10", minimum: "No account minimum; order limits apply", platforms: "XTB app / browser", sourceIds: ["xtb-account", "xtb-platform"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "CFD commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "UK retail leverage", fieldId: "leverage-by-product-and-region", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Underlying investments", fieldId: "real-stocks-and-etfs", state: "text" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "UK retail protection", fieldId: "negative-balance-protection", state: "text" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["XTB is worth comparing if you prefer one proprietary platform for CFDs and eligible stock/ETF investing.", "The reviewed UK offering has no deposit minimum, while conversion, financing and conditional inactivity charges still matter.", "MetaTrader users should compare alternatives, and international clients must check their own entity’s schedule."], sourceIds: ["xtb-account", "xtb-fees", "xtb-platform", "xtb-reg"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Two distinct investing routes", explanation: "Eligible underlying investments alongside CFD trading.", sourceIds: ["xtb-account"] },
    { title: "No UK deposit minimum", explanation: "Start with the account’s order and margin limits in mind.", sourceIds: ["xtb-account"] },
    { title: "Own app and browser platform", explanation: "A consistent workflow across supported devices.", sourceIds: ["xtb-platform"] },
    { title: "Published fee conditions", explanation: "Conversion and inactivity rules are explained in the help centre.", sourceIds: ["xtb-fees"] },
    { title: "Learning resources", explanation: "Educational material and market analysis are accessible online.", sourceIds: ["xtb-platform"] },
  ];
  review.limitations = [
    { title: "No listed MetaTrader route", explanation: "Existing MT4/MT5 strategies may require another broker.", sourceIds: ["xtb-platform"] },
    { title: "Conversion adds up", explanation: "A 0.5% margin can affect cross-currency transactions.", sourceIds: ["xtb-fees"] },
    { title: "Conditional inactivity charge", explanation: "Both the 365-day trading and 90-day deposit tests matter.", sourceIds: ["xtb-fees"] },
    { title: "Zero commission has limits", explanation: "Stock/ETF turnover and account-specific minimums apply.", sourceIds: ["xtb-account"] },
    { title: "Regional differences", explanation: "UK examples do not establish international costs or protection.", sourceIds: ["xtb-reg"] },
  ];
  review.entities = [
    { name: "XTB Limited", country: "United Kingdom", regulator: "FCA", licence: "522157", sourceId: "xtb-reg" },
    { name: "XTB Limited", country: "Cyprus", regulator: "CySEC", licence: "169/12", sourceId: "xtb-reg" },
    { name: "XTB International Limited", country: "Belize", regulator: "FSC", licence: "6442514", sourceId: "xtb-reg" },
  ];
  review.faqs[1] = { question: "Is XTB regulated?", answer: "XTB reports separate UK, Cyprus and Belize regulated companies. Match the exact company in your agreement to its regulator’s register. A group licence does not apply to every account or insure against market losses; independent register confirmation remains outstanding here.", sourceIds: ["xtb-reg"] };
  review.faqs[5] = { question: "What is XTB’s minimum deposit?", answer: "The reviewed UK account page lists no minimum deposit. Minimum order sizes, margin, payment-provider limits and eligibility still apply. Confirm the terms of your assigned company rather than treating this UK example as universal.", sourceIds: ["xtb-account", "xtb-reg"] };
  review.faqs[6] = { question: "Does XTB charge inactivity or conversion fees?", answer: "The reviewed help centre lists €10/month after both 365 days without opening/closing a position and 90 days without a deposit, with exceptions. It also lists a 0.5% transaction-conversion margin. Internal currency transfers cost 0.5%, or 0.8% on weekends/holidays; confirm your account terms.", sourceIds: ["xtb-fees"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/xtb.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric score/count was verified. Check the reviewer’s country, product and entity before comparing experiences." };
  review.accountOpening = { ...common, url: "https://www.xtb.com/int", status: "verified", sourceIds: ["xtb-signup"], isAffiliate: false };
}
