import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyPlus500Research(review: BrokerReview) {
  if (review.broker.slug !== "plus500" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.plus500.com/";
  const faq = "https://cdn-main.plus500.com/en/tradingacademy/faq/";
  const signup = "https://app.plus500.com/trade?product=CFD&IsRealMode=True&ms=True";
  const { common, set } = prepareResearchedRecord(review, "Plus500 CFD group disclosures; account entity must be confirmed", "2026-11-14", [
    { id: "plus-fees", title: "CFD fees and inactivity policy", url: "https://www.plus500.com/en/help/feescharges" },
    { id: "plus-regulation", title: "Group companies and regulatory disclosures", url: `${faq}regulators/throughwhichsubsdoyouoperate` },
    { id: "plus-deposits", title: "Deposit methods and account-specific minimums", url: `${faq}deposits/howdoidepositmoney` },
    { id: "plus-stops", title: "Guaranteed-stop costs and restrictions", url: `${faq}trading/whatisguaranteedstoporder` },
    { id: "plus-withdrawals", title: "Withdrawal processing and receipt estimates", url: `${faq}withdrawals/whatisprocessingtimeforeachmethod` },
    { id: "plus-independent", title: "ForexBrokers.com Plus500 assessment", url: "https://www.forexbrokers.com/reviews/plus500", publisher: "ForexBrokers.com" },
    { id: "plus-signup", title: "Official CFD account registration", url: signup },
    { id: "plus-demo", title: "Official CFD demo", url: "https://app.plus500.com/trade?product=CFD&IsRealMode=False&ms=True" },
  ]);
  set("minimum-deposit", "Entity/method-dependent; publisher examples: US$100 card, US$200 wire.", ["plus-deposits", "plus-independent"]);
  set("forex-commission-per-lot", "Main CFD account: no separate dealing commission; spreads apply.", ["plus-fees"]);
  set("forex-spread-and-commission", "CFDs use variable spreads without separate dealing commission. ForexBrokers.com reports a 1.3-pip EUR/USD average for October 2025: a historical sample, not our measurement or a current quote. Check the platform’s actual contract sizes.", ["plus-fees", "plus-independent"]);
  set("overnight-financing", "Positions held beyond an instrument’s funding cutoff can incur adjustments. Check its Details panel for timing and rates; conversion and guaranteed-stop costs are separate.", ["plus-fees"]);
  set("inactivity-fee", "Up to US$10/month after at least three months without login, capped at available funds. Login is sufficient activity under the published general CFD policy.", ["plus-fees"]);
  set("inactivity-summary", "Up to US$10/month after three months without login.", ["plus-fees"]);
  set("currency-conversion-fee", "Up to 0.7% of realised net profit/loss when instrument and account currencies differ.", ["plus-fees"]);
  set("guaranteed-stop", "Selected instruments; wider spread, non-refundable once activated.", ["plus-stops"]);
  set("regulation-and-entity", "Plus500 discloses UK FCA 509909, Cyprus CySEC 250/14, Australia ASIC 417727 and Bahamas SCB SIA-F250, among other separate entities. These are provider-reported permissions, not an independent register check or worldwide protection guarantee.", ["plus-regulation"]);
  set("contracting-legal-entity", "Confirm the exact company assigned in your agreement. CFD, Invest and US Futures accounts have different products, fees and safeguards; a group licence does not transfer protections between them.", ["plus-regulation", "plus-independent"]);
  set("client-money-arrangements", "The provider reports segregated client bank accounts under applicable rules. This is not an independent audit or a guarantee of recovery.", ["plus-regulation"]);
  set("regulation-summary", "Separate FCA, CySEC, ASIC and other entities; check your agreement.", ["plus-regulation"]);
  set("country-availability", "Confirm residence and account eligibility before applying. This review covers CFDs; the US Futures service is a separate offering, not access to international retail CFDs.", ["plus-regulation", "plus-independent"]);
  set("deposit-methods-and-charges", "Cards, wires and supported electronic wallets are listed; availability varies. Each method has its own minimum, shown in Funds → Deposit. The publisher’s US$100/card and US$200/wire examples are not universal requirements.", ["plus-deposits", "plus-independent"]);
  set("withdrawal-methods-and-charges", "The CFD policy covers most processing fees; banks, issuers and conversion can add costs. Requests below a method’s displayed minimum may incur charges. US Futures fees are separate.", ["plus-fees", "plus-withdrawals"]);
  set("published-processing-times", "Broker processing normally takes 1–3 business days. After authorisation, published estimates are 3–7 days for PayPal/Skrill and 5–7 for bank transfer; cards depend on the bank. These are provider estimates, not our withdrawal test.", ["plus-withdrawals"]);
  set("identity-and-address-requirements", "Choose your residence and CFD account, complete requested verification, read the assigned agreement and check funding limits before depositing. Registration is not guaranteed approval; separate US Futures minimums do not apply to CFDs.", ["plus-signup", "plus-deposits", "plus-regulation"]);
  set("demo-account", "Free virtual-funds CFD demo; simulated results are not live execution.", ["plus-demo", "plus-independent"]);
  set("supported-mobile-platforms", "Proprietary Plus500 mobile apps alongside WebTrader; not tested here.", ["plus-independent"]);
  set("platform-summary", "Plus500 WebTrader/mobile; no MT4/MT5 on the main CFD service.", ["plus-independent"]);
  set("platform-and-availability", "The main CFD platform uses proprietary web/mobile software, without MetaTrader’s EA ecosystem or native social copying in the reviewed offering. Guaranteed stops are limited to eligible new positions and cost a wider spread. A futures API is a separate service.", ["plus-independent", "plus-stops"]);
  set("cfds-and-underlying-markets", "Forex, index, share, commodity, ETF, options-related and eligible crypto CFDs provide price exposure without underlying ownership. Plus500 Invest share dealing and US exchange-traded futures use separate services and terms.", ["plus-independent", "plus-regulation"]);
  review.accountComparisons = [
    { ...common, name: "CFD", category: "Entity-specific retail trading", spread: "Variable; instrument-specific", commission: "No separate dealing commission", roundTripCommission: "US$0 separate CFD commission", minimum: "Publisher examples: US$100 card / US$200 wire; regional limits differ", platforms: "Plus500 WebTrader / mobile", sourceIds: ["plus-fees", "plus-deposits", "plus-independent"] },
    { ...common, name: "Demo", category: "Virtual-funds CFD practice", spread: "Simulated market conditions", commission: "Virtual-money practice", minimum: "No real-money deposit", platforms: "Plus500 demo", sourceIds: ["plus-demo", "plus-independent"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "CFD commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Guaranteed stops", fieldId: "guaranteed-stop", state: "text" },
    { label: "Inactivity fee", fieldId: "inactivity-summary", state: "text" },
    { label: "Currency conversion", fieldId: "currency-conversion-fee", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["Plus500 is worth researching if you prefer a proprietary CFD platform and spread-based pricing without separate dealing commission.", "The main CFD service lacks MetaTrader; inactivity and overnight charges matter alongside the spread.", "Confirm your entity and funding minimum: Plus500 Invest and US Futures have separate terms."], sourceIds: ["plus-fees", "plus-independent", "plus-regulation"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Straightforward CFD pricing", explanation: "No separate dealing commission; the spread remains a cost.", sourceIds: ["plus-fees"] },
    { title: "Web and mobile access", explanation: "A proprietary interface keeps supported trading tools together.", sourceIds: ["plus-independent"] },
    { title: "Virtual practice", explanation: "Explore the CFD platform without depositing real money.", sourceIds: ["plus-demo"] },
    { title: "Guaranteed-stop option", explanation: "Available on selected instruments, with an additional spread cost.", sourceIds: ["plus-stops"] },
    { title: "Published entity disclosures", explanation: "Compare the named company and permissions before applying.", sourceIds: ["plus-regulation"] },
  ];
  review.limitations = [
    { title: "No MetaTrader on main CFDs", explanation: "It does not provide the usual MT4/MT5 EA ecosystem.", sourceIds: ["plus-independent"] },
    { title: "Inactivity charge", explanation: "Up to US$10/month after three months without login.", sourceIds: ["plus-fees"] },
    { title: "Costs beyond the spread", explanation: "Financing, conversion and guaranteed stops can add costs.", sourceIds: ["plus-fees"] },
    { title: "Historical spreads are not quotes", explanation: "A publisher’s October 2025 sample cannot establish today’s price.", sourceIds: ["plus-independent"] },
    { title: "Services are not interchangeable", explanation: "CFDs, Invest and US Futures differ in access, fees and protections.", sourceIds: ["plus-regulation", "plus-independent"] },
  ];
  review.entities = [
    { name: "Plus500UK Ltd", country: "United Kingdom", regulator: "FCA", licence: "509909", sourceId: "plus-regulation" },
    { name: "Plus500CY Ltd", country: "Cyprus", regulator: "CySEC", licence: "250/14", sourceId: "plus-regulation" },
    { name: "Plus500AU Pty Ltd", country: "Australia", regulator: "ASIC", licence: "417727", sourceId: "plus-regulation" },
    { name: "Plus500BHS Ltd", country: "Bahamas", regulator: "SCB", licence: "SIA-F250", sourceId: "plus-regulation" },
  ];
  review.faqs[1] = { question: "Is Plus500 a legitimate and regulated broker?", answer: "Plus500 identifies separate regulated companies, including UK, Cyprus, Australian and Bahamas entities. Match your agreement’s company to the official register. Group licences do not transfer protections between accounts or prevent trading losses; these register entries were not independently confirmed here.", sourceIds: ["plus-regulation"] };
  review.faqs[5] = { question: "What is the minimum deposit for Plus500?", answer: "There is no worldwide minimum. The independent review gives common CFD examples of US$100 by card and US$200 by wire, with lower regional minimums. Confirm the amount in your account’s Deposit screen. US Futures funding requirements are separate.", sourceIds: ["plus-deposits", "plus-independent"] };
  review.faqs[6] = { question: "Is Plus500 better than IG?", answer: "Choose by your platform needs, country eligibility and total costs. Plus500 uses proprietary CFD software; it is unsuitable if you require MetaTrader Expert Advisors. Compare spreads, financing, inactivity and account protections under the actual entities rather than assuming either broker is universally better.", sourceIds: ["plus-independent", "plus-fees", "plus-regulation"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/www.plus500.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric TrustScore or count was confirmed. Match the company and CFD product; customer feedback and publisher scores do not establish safety." };
  review.accountOpening = { ...common, url: signup, status: "verified", sourceIds: ["plus-signup"], isAffiliate: false };
}
