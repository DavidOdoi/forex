import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyOandaResearch(review: BrokerReview) {
  if (review.broker.slug !== "oanda" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.oanda.com/";
  const us = "https://help.oanda.com/us/en/faqs/";
  const bvi = "https://help.oanda.com/bvi/en/faqs/";
  const { common, set } = prepareResearchedRecord(review, "OANDA group; US pricing examples and BVI differences identified separately", "2026-11-14", [
    { id: "oanda-us-minimum", title: "US Standard minimum deposit", url: `${us}minimum-deposit-requirement.htm` },
    { id: "oanda-core", title: "US Core commission and eligibility", url: `${us}spreads-commission.htm` },
    { id: "oanda-withdrawals", title: "US withdrawal fees and processing", url: `${us}withdrawal-methods-us.htm` },
    { id: "oanda-inactivity", title: "US inactivity policy", url: `${us}inactivity-fees.htm` },
    { id: "oanda-units", title: "US proprietary-platform trade sizing", url: `${us}micro-lots.htm` },
    { id: "oanda-platforms", title: "US third-party platforms", url: `${us}third-party-platforms.htm` },
    { id: "oanda-bvi-platforms", title: "BVI MT4 discontinuation and MT5", url: `${bvi}mt4-support-bvi.htm` },
    { id: "oanda-bvi-minimum", title: "BVI Standard minimum deposit", url: `${bvi}minimum-deposit-requirement.htm` },
    { id: "oanda-group", title: "Group companies and regional services", url: "https://www.oanda.com/group/where-we-are/" },
    { id: "oanda-us-regulation", title: "US regulatory and risk disclosures", url: "https://www.oanda.com/us-en/legal/regulatory-public-disclosures/" },
    { id: "oanda-signup", title: "Official account application", url: "https://hub.oanda.com/apply" },
  ]);
  set("minimum-deposit", "US/BVI Standard: no minimum; premium/Core eligibility differs.", ["oanda-us-minimum", "oanda-bvi-minimum"]);
  set("forex-commission-per-lot", "US Core: US$7 per 100,000 units/side; US$14 round trip.", ["oanda-core"]);
  set("core-eligibility", "US Core requires US$10,000 initial deposit or maintained balance.", ["oanda-core"]);
  set("forex-spread-and-commission", "Standard uses spread-only pricing. US Core adds US$0.70 per 10,000 units per side: US$7 per 100,000 each way, US$14 round trip, plus spread. These are US terms, not worldwide OANDA rates.", ["oanda-core"]);
  set("overnight-financing", "Financing can apply to positions held overnight. Check the pair, direction, cutoff and entity’s current rates; spread and commission do not represent the full holding cost.", ["oanda-core", "oanda-us-regulation"]);
  set("inactivity-fee", "US forex accounts: up to US$20/client/month after 12 months without qualifying trading, subject to balance and open-position rules. Crypto activity is separate; other entities’ policies differ.", ["oanda-inactivity"]);
  set("inactivity-summary", "US: up to US$20/month after 12 months without forex trading.", ["oanda-inactivity"]);
  set("minimum-trade-size", "From one base-currency unit on supported OANDA platforms; MetaTrader differs.", ["oanda-units"]);
  set("regulation-and-entity", "OANDA Corporation identifies US CFTC/NFA supervision, NFA ID 0325821. The group separately lists UK, Australian, Canadian, Singapore, Japanese, Polish and BVI companies. Verify your assigned company; no independent register check was completed here.", ["oanda-us-regulation", "oanda-group"]);
  set("contracting-legal-entity", "Residence determines the available company and service. The US examples here concern retail forex; BVI and other international CFD accounts have separate fees, platforms and safeguards.", ["oanda-group", "oanda-us-regulation"]);
  set("client-money-arrangements", "US forex accounts are not SIPC-protected; do not assume the same money-protection arrangements as UK, Canadian or BVI accounts. Trading losses are not insured.", ["oanda-us-regulation"]);
  set("regulation-summary", "US: CFTC/NFA; separate international companies and permissions.", ["oanda-us-regulation", "oanda-group"]);
  set("country-availability", "Confirm residence and the company assigned during registration. Products differ substantially: a regulated US forex account is not permission to access international CFDs or unrelated group services.", ["oanda-group", "oanda-signup"]);
  set("deposit-methods-and-charges", "Methods, currencies and charges depend on entity. US/BVI Standard minimums are not premium-account qualifications or guaranteed funding-method minimums; check your account’s actual options.", ["oanda-us-minimum", "oanda-bvi-minimum", "oanda-withdrawals"]);
  set("withdrawal-methods-and-charges", "US guidance lists no OANDA bank-transfer withdrawal fee; receiving banks/providers can charge. Return-to-source and payment hierarchy rules apply. Do not transfer these US terms to other companies.", ["oanda-withdrawals"]);
  set("published-processing-times", "US card processing is typically 1–3 business days, with additional provider time possible. Bank and other methods differ; funds/verification checks can delay receipt. No withdrawal was tested here.", ["oanda-withdrawals"]);
  set("identity-and-address-requirements", "Choose your country and available service, complete requested verification and read the assigned agreement before funding. US Core eligibility does not establish another region’s premium-account requirements.", ["oanda-signup", "oanda-group", "oanda-core"]);
  set("demo-account", "Regional demo options are offered; simulated trading is not live execution.", ["oanda-platforms"]);
  set("retail-and-professional-accounts", "US Standard/Core pricing and international Standard/Premium arrangements are distinct. A pricing tier does not itself grant regulatory professional-client classification.", ["oanda-core", "oanda-group"]);
  set("supported-mobile-platforms", "OANDA’s proprietary app and regional third-party mobile access; not tested here.", ["oanda-platforms", "oanda-bvi-platforms"]);
  set("platform-summary", "OANDA Trade, regional TradingView/MT4/MT5; availability differs by company.", ["oanda-platforms", "oanda-bvi-platforms"]);
  set("platform-and-availability", "US guidance lists MT4 and TradingView. BVI discontinued MT4 on 7 October 2024 and directs clients to MT5. Confirm execution access and automation tools for your entity; one region’s platform list is not universal.", ["oanda-platforms", "oanda-bvi-platforms"]);
  set("cfds-and-underlying-markets", "The group offers retail forex and, through eligible non-US companies, CFDs on markets such as indices, commodities, shares and crypto. Separate securities/crypto services have different providers and protections; CFDs do not give underlying ownership.", ["oanda-group", "oanda-us-regulation"]);
  review.accountComparisons = [
    { ...common, name: "US Standard", category: "US retail forex example", spread: "Variable; spread-only pricing", commission: "No separate forex dealing commission", roundTripCommission: "US$0 separate forex commission", minimum: "No account minimum; method limits apply", platforms: "OANDA Trade / supported US platforms", sourceIds: ["oanda-us-minimum", "oanda-core", "oanda-platforms"] },
    { ...common, name: "US Core", category: "US commission-pricing example", spread: "Reduced spread plus commission", commission: "US$0.70 per 10,000 units/side", roundTripCommission: "US$14 per 100,000 units", minimum: "US$10,000 qualifying deposit/balance", platforms: "Confirm Core-compatible platform", sourceIds: ["oanda-core"] },
  ];
  review.quickFactFields = [
    { label: "Standard minimum", fieldId: "minimum-deposit", state: "text" },
    { label: "US Core commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "US Core eligibility", fieldId: "core-eligibility", state: "text" },
    { label: "Trade sizing", fieldId: "minimum-trade-size", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "US inactivity fee", fieldId: "inactivity-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["OANDA is worth comparing for eligible Standard accounts without an account minimum and flexible proprietary-platform position sizing.", "Its US Core example charges US$14 round trip per 100,000 units, plus spread, and requires US$10,000 eligibility.", "Confirm your company and platform: US forex and international CFD accounts have different terms."], sourceIds: ["oanda-us-minimum", "oanda-bvi-minimum", "oanda-units", "oanda-core", "oanda-group"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Accessible Standard account", explanation: "US/BVI guidance lists no account minimum; method limits still matter.", sourceIds: ["oanda-us-minimum", "oanda-bvi-minimum"] },
    { title: "Precise position sizing", explanation: "Supported proprietary platforms allow one-unit trades, unlike fixed lot increments.", sourceIds: ["oanda-units"] },
    { title: "Several platform routes", explanation: "OANDA Trade and regional MetaTrader/TradingView access.", sourceIds: ["oanda-platforms", "oanda-bvi-platforms"] },
    { title: "Published US pricing model", explanation: "Core commission and qualification requirements are explicit.", sourceIds: ["oanda-core"] },
    { title: "Identifiable regional companies", explanation: "Compare the legal entity and product rather than the brand alone.", sourceIds: ["oanda-group"] },
  ];
  review.limitations = [
    { title: "Core funding threshold", explanation: "US eligibility requires US$10,000; other tiers have different rules.", sourceIds: ["oanda-core"] },
    { title: "Inactivity can cost", explanation: "The US forex policy can charge after 12 inactive months.", sourceIds: ["oanda-inactivity"] },
    { title: "Platform restrictions", explanation: "BVI MT4 support ended; MT4/MT5 availability is not uniform worldwide.", sourceIds: ["oanda-bvi-platforms", "oanda-platforms"] },
    { title: "Fees beyond the headline spread", explanation: "Include commission, financing and payment-provider costs.", sourceIds: ["oanda-core", "oanda-withdrawals"] },
    { title: "US protection limits", explanation: "US forex accounts are not SIPC-protected; do not assume losses are insured.", sourceIds: ["oanda-us-regulation"] },
  ];
  review.entities = [
    { name: "OANDA Corporation", country: "United States", regulator: "CFTC / NFA", licence: "NFA 0325821", sourceId: "oanda-us-regulation" },
    { name: "OANDA Global Markets Limited", country: "British Virgin Islands", regulator: "BVI FSC", licence: null, sourceId: "oanda-group", note: "Separate international company; US Core terms do not apply automatically." },
  ];
  review.faqs[1] = { question: "Is OANDA a legitimate and regulated forex broker?", answer: "OANDA identifies separate regulated companies, including its US CFTC/NFA business and international entities. Verify the company in your agreement against its regulator’s register. Brand-wide regulation does not transfer protections or prevent trading losses; these register entries were not independently confirmed here.", sourceIds: ["oanda-group", "oanda-us-regulation"] };
  review.faqs[5] = { question: "What is the minimum deposit for OANDA?", answer: "US and BVI Standard guidance lists no account minimum. US Core requires a US$10,000 qualifying deposit or balance. Method limits and other regional premium requirements differ; these figures are not recommended trading budgets.", sourceIds: ["oanda-us-minimum", "oanda-bvi-minimum", "oanda-core"] };
  review.faqs[6] = { question: "Is OANDA better than IG?", answer: "Compare your eligible entity, position-sizing needs, platforms and total costs. OANDA offers unit-based sizing on supported platforms, but Core eligibility and regional restrictions matter. Neither broker is universally better; compare actual terms for your country and strategy.", sourceIds: ["oanda-units", "oanda-core", "oanda-group"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/www.oanda.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current numeric TrustScore or count was confirmed. Read the live profile and match feedback to the actual company and product." };
  review.accountOpening = { ...common, url: "https://hub.oanda.com/apply", status: "verified", sourceIds: ["oanda-signup"], isAffiliate: false };
}
