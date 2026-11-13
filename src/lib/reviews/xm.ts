import type { BrokerReview, ReviewField } from "./types";

const checkedAt = "2026-11-10";
const entityScope = "XM Global Limited (Belize); other entities identified separately";
// Primary-source rechecks, including public account-card expansions and help
// disclosures, are recorded in docs/research/xm-source-checks-2026-11-10.md.
export function applyXmResearch(review: BrokerReview) {
  if (review.broker.slug !== "xm" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.xm.com/";
  review.sources = review.sources.filter(source => !source.id.startsWith("global-disclosure-"));
  const source = (id: string, title: string, path: string) => review.sources.push({ id, title, url: `https://www.xm.com/${path}`, publisher: "XM", checkedAt, legalEntity: entityScope, jurisdiction: "Global" });
  source("xm-accounts", "XM Global account specifications", "account-types");
  source("xm-account-help", "XM Global account conditions", "help-center/trading-accounts");
  source("xm-payments", "XM Global funding and withdrawals", "help-center/deposits-withdrawals");
  source("xm-creation", "XM Global opening and security", "help-center/creation-management");
  source("xm-platforms", "XM Global platforms and markets", "help-center/trading-platforms");
  source("xm-conditions", "XM Global trading conditions", "help-center/trading-conditions");
  source("xm-regulation", "XM Global legal entity", "regulation");
  source("xm-licences", "XM group entity disclosures", "landing/regulation");
  source("xm-agreement", "XM Global public client agreement", "assets/pdf/new/terms/XMGlobal-Client-Agreement-Terms-and-Conditions-of-Business.pdf");
  const refreshedAt = "2026-11-13";
  review.sources.push(
    { id: "xm-independent-2026", title: "ForexBrokers.com XM account and platform assessment", url: "https://www.forexbrokers.com/reviews/xm", publisher: "ForexBrokers.com", checkedAt: refreshedAt, legalEntity: entityScope, jurisdiction: "Global" },
    { id: "xm-learning", title: "XM learning resources", url: "https://www.xm.com/", publisher: "XM", checkedAt: refreshedAt, legalEntity: entityScope, jurisdiction: "Global" },
  );
  const allFields = (): ReviewField[] => [...review.keyData, ...review.benchmarks, ...review.chapters.flatMap(chapter => chapter.panels.flatMap(panel => panel.fields))];
  const set = (id: string, value: string, sourceIds: string[], fieldCheckedAt = checkedAt) => {
    let fields = allFields().filter(field => field.id === id);
    if (!fields.length) { const field: ReviewField = { id, label: id.replaceAll("-", " "), value: null, sourceIds: [], status: "not-researched", legalEntity: null, jurisdiction: null, checkedAt: null }; review.keyData.push(field); fields = [field]; }
    fields.forEach(field => Object.assign(field, { value, sourceIds, status: "verified", legalEntity: entityScope, jurisdiction: "Global", checkedAt: fieldCheckedAt }));
  };
  set("minimum-deposit", "XM Global: Standard/Ultra Low $5; Shares $10,000 equivalent.", ["xm-accounts"]);
  set("minimum-deposit-by-account", "$5 equivalent for Standard and Ultra Low; $10,000 for Shares. Payment-method minimums can differ; these are not recommended trading budgets.", ["xm-accounts", "xm-payments"]);
  set("account-currencies", "Choose an available base currency at registration; it cannot be changed afterwards. A different currency requires another account. Confirm the currency list for your account.", ["xm-creation"]);
  set("account-base-currencies", "Available currencies depend on the account. The base currency cannot be changed after opening; additional accounts can use another available currency.", ["xm-creation"]);
  set("forex-trading-costs", "XM Global advertises EUR/USD from 1.6 pips on Standard and 0.8 pips on Ultra Low, with no separate commission shown for these accounts. Actual spreads vary; these are floors, not measured averages.", ["xm-accounts", "xm-conditions"]);
  set("forex-spread-and-commission", "EUR/USD floors: Standard 1.6 pips; Ultra Low 0.8. Neither shows separate commission. These are advertised minimums, not typical costs. Shares commission and swaps are separate.", ["xm-accounts", "xm-conditions"]);
  set("eur-usd-spread", "Advertised minimums: Standard 1.6 pips; Ultra Low 0.8. A current measured average was not established.", ["xm-accounts"]);
  set("forex-commission-per-lot", "No separate commission shown for Standard/Ultra Low.", ["xm-accounts", "xm-conditions"]);
  set("overnight-financing", "XM Global applies variable swaps to some accounts/instruments. Ultra Low is swap-free only on selected instruments. Check the current symbol rate; a swap-free option is not a universal exemption.", ["xm-account-help", "xm-conditions"]);
  set("swap-free-option", "Islamic option; Ultra Low covers selected instruments only.", ["xm-accounts", "xm-account-help"]);
  set("inactivity-fee", "Help lists up to $10/month after 90 inactive days, capped at remaining balance; none at zero. The public agreement contains different charges; confirm your governing terms.", ["xm-account-help", "xm-agreement"]);
  set("withdrawal-fee", "XM Global advertises no broker deposit/withdrawal fee. Its bank-fee coverage applies to international wires from $200 equivalent; external/provider and conversion charges can remain.", ["xm-payments"]);
  set("withdrawal-methods-and-charges", "No broker funding fee advertised. XM covers its bank's qualifying international-wire fees from $200 equivalent; provider, intermediary and conversion charges can remain.", ["xm-payments"]);
  set("deposit-methods-and-charges", "Cards, bank/local transfers and e-wallets are documented. Your Funding area lists eligible methods and limits, which can exceed the general $5 minimum. Availability varies by country.", ["xm-payments"]);
  set("published-processing-times", "Automated processing is not unconditional approval. Receipt can be same-day; cards/wires usually take 2–5 business days after execution. These are published estimates, not our withdrawal test.", ["xm-payments"]);
  set("withdrawal-requirements", "Verify your account and use your own payment methods. Deposits return to their original source first; remaining funds use an available method. Open-position/margin restrictions and compliance checks can affect requests.", ["xm-payments"]);
  set("minimum-withdrawal", "General minimum $5 equivalent; actual minimum depends on the payment method.", ["xm-payments"]);
  set("currency-conversion-fee", "Funding into another base currency requires conversion; check the displayed rate before confirming. No universal percentage markup is established here. Payment providers may apply their own rates.", ["xm-payments"]);
  set("currency-conversion-conditions", "Check the displayed conversion rate before funding; internal transfers between different base currencies use XM's rate. Provider conversion costs may also apply.", ["xm-payments"]);
  set("conversion-fee", "Check the displayed exchange rate; no universal fixed conversion fee is established here.", ["xm-payments"]);
  set("regulation-and-entity", "XM Global Limited reports Belize FSC licence 8557558; other companies have separate permissions. Group licences do not transfer account protections. Check your exact company against the regulator register.", ["xm-regulation", "xm-licences"]);
  set("contracting-legal-entity", "The account/funding pages identify XM Global Limited, Belize. Confirm your registration agreement's company; these are not universal XM terms.", ["xm-regulation", "xm-accounts"]);
  set("regulator-and-register-entry", "Belize FSC licence 8557558 is XM-disclosed here; independent register confirmation is outstanding. Keep other entities' permissions and protections separate.", ["xm-regulation"]);
  set("licence-number", "XM Global Limited: 8557558, as reported by XM.", ["xm-regulation"]);
  set("country-availability", "XM Global excludes citizens of the USA, Canada, Israel, Iran and other sanctioned countries. An omitted country is not proof of acceptance or lawful offshore funding. Check onboarding eligibility and local requirements.", ["xm-accounts", "xm-creation"]);
  set("eligible-countries-and-client-category", "Confirm the available country and assigned company in registration. XM Global's published restrictions are not a worldwide acceptance list; local rules and client-category conditions still apply.", ["xm-creation", "xm-accounts"]);
  set("accepts-us-citizens", "No — excluded by XM Global's published restrictions.", ["xm-accounts"]);
  set("client-money-arrangements", "Segregated accounts — provider-reported.", ["xm-payments"]);
  set("negative-balance-protection", "Advertised by XM Global; agreement exclusions apply. It does not protect your deposit from trading losses.", ["xm-accounts"]);
  set("retail-and-professional-accounts", "XM Global lists Standard, Ultra Low and Shares; help also lists Micro/Ultra Low variants. Professional classifications and regional product lists differ. Standard/Micro lots represent 100,000/1,000 units, respectively; Micro is not a cent account.", ["xm-accounts", "xm-account-help", "xm-creation"]);
  set("demo-account", "Standard/Ultra Low demos; closes after 60 inactive days.", ["xm-creation", "xm-account-help"]);
  set("identity-and-address-requirements", "Register, verify your phone and complete profile/document checks. Official photo ID is requested; address proof/additional checks can apply. Approval time is not guaranteed.", ["xm-creation", "xm-platforms"]);
  set("published-onboarding-steps", "Register; verify phone; complete personal/investor profile; submit requested documents; monitor verification; choose the available account and funding method. No live account was opened for this review.", ["xm-creation"]);
  set("account-opening-time", "Registration and KYC approval are separate; no guaranteed verification time is established.", ["xm-creation"]);
  set("published-verification-time", "Complete the requested profile and document checks; monitor verification status in the account. A universally guaranteed KYC approval time was not established.", ["xm-creation"]);
  set("supported-mobile-platforms", "XM App and MT4/MT5 mobile access documented.", ["xm-platforms"]);
  set("platform-and-availability", "XM documents MT4, MT5, WebTrader and its app. EAs are supported; trailing stops/EAs stop when the terminal goes offline. Platform availability is account-dependent; execution and app usability were not tested.", ["xm-platforms"]);
  set("login-and-security", "Profile MFA supports email or an authenticator app; one selected method at a time. This does not establish identical MFA behaviour for every MetaTrader login.", ["xm-creation"]);
  set("orders-and-risk-controls", "MT4/MT5 support EAs. Trailing stops/EAs become inactive when the terminal is offline; existing positions and pending orders remain. Follow the broker's strategy and risk rules.", ["xm-platforms"]);
  set("order-types-and-controls", "The platform help documents pending orders, trailing stops and EAs. Trailing stops/EAs need the terminal online; an offline terminal does not itself close existing positions.", ["xm-platforms"]);
  set("real-stocks-and-etfs", "Separate stock CFDs from the Shares account: its page advertises share purchases, $10,000 minimum and 1:1 leverage. Obtain the custody, ownership and commission schedule before treating it as equivalent to an ordinary securities account.", ["xm-accounts", "xm-platforms"]);
  set("leverage-by-product-and-region", "XM Global advertises up to 1:1000 at $5–$40,000 equity, 1:500 at $40,001–$80,000, 1:200 at $80,001–$200,000 and 1:100 above $200,000. Instrument/entity restrictions apply; these are not Cyprus retail limits. Higher leverage magnifies losses.", ["xm-conditions"]);
  set("leverage-summary", "XM Global: up to 1:1000; equity and instrument limits.", ["xm-conditions", "xm-accounts"]);
  set("cfds-and-underlying-markets", "XM Global lists forex and CFDs on metals, indices, energies, commodities, stocks and crypto. Separate Shares access is documented on MT5. Product availability differs by account and jurisdiction; CFDs do not confer underlying ownership.", ["xm-platforms", "xm-accounts"]);
  set("product-restrictions", "Turbo Stocks are a Standard/MT5 product with daily closing and specific leverage. Account and entity restrictions must be checked separately; do not transfer these terms to Cyprus or other regional offerings.", ["xm-platforms"]);
  set("forex-spread-and-commission", "ForexBrokers.com reports EUR/USD averages of 2.0 pips (Standard) and 1.1 (Ultra Low), plus a US$3.50/lot/side Zero example. These are publisher findings, not our measurements or current quotes. Zero availability is entity-dependent; the table shows XM Global’s advertised floors.", ["xm-independent-2026"], refreshedAt);
  set("platform-and-availability", "XM offers MT4/MT5 and proprietary web/mobile trading. ForexBrokers.com reports TradingView-powered charts, not standalone TradingView account integration. Available products and features depend on the entity; no platform was tested here.", ["xm-independent-2026"], refreshedAt);
  set("education-and-research", "XM advertises free learning resources. ForexBrokers.com describes live education, Reuters news and Trading Central. Education does not guarantee profits.", ["xm-learning", "xm-independent-2026"], refreshedAt);
  review.entities = [
    { name: "XM Global Limited", country: "Belize", regulator: "FSC", licence: "8557558", sourceId: "xm-regulation", note: "Provider-reported; account and funding terms on this page use this entity." },
    { name: "Trading Point of Financial Instruments Limited", country: "Cyprus", regulator: "CySEC", licence: "120/10", sourceId: "xm-licences", note: "Separate entity; do not apply XM Global leverage or funding terms to its retail accounts." },
  ];
  const common = { legalEntity: entityScope, jurisdiction: "Global", checkedAt, sourceIds: ["xm-accounts", "xm-platforms"] };
  review.accountComparisons = [
    { ...common, name: "Standard", category: "XM Global · Belize", spread: "EUR/USD from 1.6 pips", commission: "No separate commission shown", roundTripCommission: "US$0 separate FX commission", minimum: "US$5 equivalent; method limits apply", platforms: "MT4 / MT5" },
    { ...common, name: "Ultra Low", category: "XM Global · Belize", spread: "EUR/USD from 0.8 pips", commission: "No separate commission shown", roundTripCommission: "US$0 separate FX commission", minimum: "US$5 equivalent; method limits apply", platforms: "MT4 / MT5" },
    { ...common, name: "Shares", category: "XM Global · shares · 1:1 leverage", spread: "Not an FX account", commission: "Commission applies; obtain share schedule", minimum: "US$10,000 equivalent", platforms: "Shares route on MT5" },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "Standard / Ultra Low FX commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Maximum leverage", fieldId: "leverage-summary", state: "text" },
    { label: "Swap-free option", fieldId: "swap-free-option", state: "yes" },
    { label: "Segregated client funds", fieldId: "client-money-arrangements", state: "yes" },
    { label: "Accepts US citizens", fieldId: "accepts-us-citizens", state: "no" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Regulation", fieldId: "licence-number", state: "text" },
  ];
  review.verdictEvidence = { legalEntity: entityScope, jurisdiction: "Global", checkedAt, sentences: [
    "XM Global is worth comparing for $5-equivalent accounts and spread-only forex pricing.",
    "Standard/Ultra Low advertise EUR/USD floors of 1.6/0.8 pips; selected Ultra Low instruments are swap-free.",
    "Confirm your entity and payment terms: these Belize-route conditions are not a worldwide offer.",
  ], sourceIds: ["xm-accounts", "xm-account-help", "xm-regulation"] };
  review.strengths = [
    { title: "Low entry minimum", explanation: "Standard/Ultra Low advertise $5 equivalent; method limits apply.", sourceIds: ["xm-accounts"] },
    { title: "Education and research", explanation: "Free learning resources; independent review describes live education and integrated research.", sourceIds: ["xm-learning", "xm-independent-2026"] },
    { title: "Demo and smaller lots", explanation: "Virtual-money demos and Micro variants are documented; Micro is not cents.", sourceIds: ["xm-account-help", "xm-creation"] },
    { title: "Mobile and automated access", explanation: "XM App, MT4/MT5 and EAs are documented, not tested here.", sourceIds: ["xm-platforms"] },
    { title: "No broker funding fee advertised", explanation: "Bank/provider and conversion exceptions still matter.", sourceIds: ["xm-payments"] },
  ];
  review.limitations = [
    { title: "Entity restrictions matter", explanation: "US citizens are excluded; other regions use different agreements.", sourceIds: ["xm-accounts", "xm-regulation"] },
    { title: "Standard costs more", explanation: "Its advertised floor and publisher-reported average exceed Ultra Low’s; actual spreads vary.", sourceIds: ["xm-accounts", "xm-independent-2026"] },
    { title: "Swap-free is conditional", explanation: "Ultra Low excludes some instruments; check current symbol information.", sourceIds: ["xm-account-help"] },
    { title: "Dormancy wording conflicts", explanation: "Current help and the public agreement differ; confirm the applicable terms.", sourceIds: ["xm-account-help", "xm-agreement"] },
    { title: "Receipt can take days", explanation: "Cards/bank wires usually take 2–5 business days after execution.", sourceIds: ["xm-payments"] },
  ];
  review.faqs[1] = { question: "Is XM a legitimate and regulated forex broker?", answer: "XM identifies separate Belize and Cyprus companies. Verify your agreement’s company and permissions in the official register. Group licences do not transfer protections or prevent trading losses; these entries were not independently confirmed here.", sourceIds: ["xm-regulation", "xm-licences"] };
  review.faqs[5] = { question: "What is the minimum deposit for XM?", answer: "XM Global lists US$5 equivalent for Standard/Ultra Low and US$10,000 for Shares. Payment-method limits differ; these entry minimums are not recommended budgets or universal terms for other entities.", sourceIds: ["xm-accounts", "xm-payments"] };
  review.faqs[6] = { question: "Is XM better than Fusion Markets?", answer: "Neither is universally better. XM offers spread-only accounts and education; compare total spread, both commission sides, financing and protections. Your country, entity and strategy determine suitability.", sourceIds: ["xm-learning", "xm-independent-2026"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/xm.com", rating: null, reviewCount: null, checkedAt: null,
    researchNote: "Trustpilot feedback is separate from publisher ratings. No current numeric TrustScore or count is confirmed here; use the live profile." };
  review.accountOpening = { url: "https://www.xm.com/goto/profile/en", status: "verified", sourceIds: ["xm-accounts"], legalEntity: entityScope, jurisdiction: "Global", checkedAt, isAffiliate: false };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.publication = { publishedAt: null, updatedAt: refreshedAt, approvedAt: null, approvedBy: null };
}
