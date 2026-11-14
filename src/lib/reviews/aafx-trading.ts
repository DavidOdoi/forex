import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyAafxTradingResearch(review: BrokerReview) {
  if (review.broker.slug !== "aafx-trading" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://www.aafxtrading.com/";
  const { common, set, setSupplied } = prepareResearchedRecord(review, "AAFX Trading Company Limited; warning-led global research", "2026-11-14", [
    { id: "aafx-red", title: "CFTC RED List: AAFX Trading, dated 25 April 2017", url: "https://www.cftc.gov/REDlist/node/220641", publisher: "US Commodity Futures Trading Commission" },
    { id: "aafx-sfc", title: "SFC unlicensed-entity alert: AAFX Trading", url: "https://www.sfc.hk/en/alert-list/1853", publisher: "Hong Kong Securities and Futures Commission" },
    { id: "aafx-advertised", title: "Supplied account specifications; direct broker-page recheck blocked", url: "https://www.aafxtrading.com/open-an-account/account-types/", evidenceOrigin: "user-supplied-dossier" },
  ]);
  review.suppliedResearch = { title: "AAFX Trading supplied review", reportedResearchDate: "2026-11-14", independentRecheck: "blocked", note: "CFTC/SFC records were read directly. Advertised terms come from the November dossier, recorded here on 14 November; the broker page blocked rechecking. No live account or withdrawal was tested.", archivePath: "docs/research/aafx-trading-supplied-review-2026-11-14.md", reportedFindings: [] };
  setSupplied("minimum-deposit", "Dossier: Fixed/ECN US$100; VIP US$20,000. Broker-page recheck blocked.", ["aafx-advertised"]);
  setSupplied("forex-commission-per-lot", "Advertised spread floors are reproduced below; full current charges need confirmation.", ["aafx-advertised"]);
  setSupplied("forex-spread-and-commission", "Supplied research reports Fixed spreads from 2.0 pips, ECN from 0.6 and VIP from 0.4. These are unconfirmed promotional floors, not measured execution or complete transaction costs. The broker page could not be rechecked; no zero-commission or swap-cost guarantee is made.", ["aafx-advertised"]);
  set("regulation-and-entity", "The CFTC RED List identifies AAFX Trading Company Limited and aafxtrading.com. It says the firm appears to require US registration but is not CFTC-registered. The notice explicitly does not establish a concluded legal violation or court finding.", ["aafx-red"]);
  set("contracting-legal-entity", "Hong Kong’s SFC lists AAFX Trading Capital / AAFX Trading Company Ltd as an unlicensed entity, added 29 March 2017 and updated 19 September 2022. Match the website and company carefully; corporate identity alone is not permission to offer regulated investments.", ["aafx-sfc"]);
  set("regulation-summary", "CFTC RED List and Hong Kong SFC unlicensed-entity alert.", ["aafx-red", "aafx-sfc"]);
  set("client-money-arrangements", "The reviewed notices do not establish investor compensation, segregated-fund safeguards or an enforceable withdrawal guarantee. The CFTC warns that customers of unregistered offshore firms may have little or no protection.", ["aafx-red"]);
  set("deposit-methods-and-charges", "DEVIN FOREX does not recommend depositing. The CFTC advises checking registration before paying money; a small first payment or successful previous transfer does not resolve the warning.", ["aafx-red"]);
  set("withdrawal-methods-and-charges", "No independent withdrawal test or current method/fee schedule has been confirmed here. If funds are already held, preserve requests, receipts and communications; use the appropriate regulator’s complaint channels rather than relying on anonymous recovery offers.", ["aafx-red", "aafx-sfc"]);
  set("identity-and-address-requirements", "Do not interpret the advertised account tiers as a recommendation to apply. Verify the exact firm and its permissions with the regulator relevant to your residence before sharing documents or paying funds.", ["aafx-red", "aafx-sfc"]);
  setSupplied("platform-and-availability", "The dossier reports a proprietary platform and third-party references to MetaTrader. Current account/platform compatibility could not be directly rechecked. A platform brand, working login or demo does not establish regulatory authorization.", ["aafx-advertised"]);
  setSupplied("platform-summary", "Platform availability reported in supplied research; direct recheck blocked.", ["aafx-advertised"]);
  setSupplied("cfds-and-underlying-markets", "The supplied review describes forex and CFDs across indices, commodities, metals, energy and shares. Product access and execution were not independently tested; an advertised instrument list is not proof of ownership or authorization.", ["aafx-advertised"]);
  setSupplied("leverage-by-product-and-region", "Dossier advertises up to 1:2000, balance/eligibility dependent. Such leverage sharply magnifies losses; it is not a reason to disregard regulator warnings.", ["aafx-advertised"]);
  const base = { ...common, evidenceStatus: "supplied-research" as const, category: "Supplied promotional terms; not independently rechecked", commission: "Full current schedule not confirmed", sourceIds: ["aafx-advertised"] };
  review.accountComparisons = [
    { ...base, name: "Fixed", spread: "Advertised from 2.0 pips", minimum: "Advertised US$100" },
    { ...base, name: "ECN", spread: "Advertised from 0.6 pips", minimum: "Advertised US$100" },
    { ...base, name: "VIP", spread: "Advertised from 0.4 pips", minimum: "Advertised US$20,000" },
  ];
  review.quickFactFields = [
    { label: "Advertised entry amount", fieldId: "minimum-deposit", state: "text" },
    { label: "Published cost evidence", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Advertised leverage", fieldId: "leverage-by-product-and-region", state: "text" },
    { label: "Platform evidence", fieldId: "platform-summary", state: "text" },
    { label: "Regulator records", fieldId: "regulation-summary", state: "text" },
    { label: "Client protection", fieldId: "client-money-arrangements", state: "text" },
  ];
  review.regulatoryNotices = [
    { title: "CFTC registration warning", summary: "AAFX has appeared on the RED List since 25 April 2017. The CFTC describes apparent registration deficiency; it does not claim a court has found fraud.", sourceIds: ["aafx-red"] },
    { title: "Hong Kong unlicensed-entity alert", summary: "The SFC identifies the AAFX name and website in its unlicensed-entity record. Read the authority’s scope and dates before considering any payment.", sourceIds: ["aafx-sfc"] },
  ];
  review.verdictEvidence = { ...common, sentences: ["We do not recommend AAFX Trading on the evidence reviewed.", "The CFTC RED List and Hong Kong SFC unlicensed-entity alert raise material authorization and customer-protection concerns.", "Advertised leverage and spread floors do not resolve those concerns; these notices are not a court finding of fraud."], sourceIds: ["aafx-red", "aafx-sfc"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Multiple advertised account tiers", explanation: "The supplied dossier describes Fixed, ECN and VIP; terms were not rechecked.", sourceIds: ["aafx-advertised"] },
    { title: "Published entry-price claims", explanation: "Treat the supplied figures as promotion, not verified total costs.", sourceIds: ["aafx-advertised"] },
  ];
  review.limitations = [
    { title: "CFTC RED List entry", explanation: "The US authority identifies apparent registration deficiency.", sourceIds: ["aafx-red"] },
    { title: "SFC unlicensed-entity alert", explanation: "The Hong Kong notice matches the broker’s website.", sourceIds: ["aafx-sfc"] },
    { title: "Limited offshore recourse", explanation: "The CFTC warns protection may be limited for unregistered offshore firms.", sourceIds: ["aafx-red"] },
    { title: "Advertised terms not rechecked", explanation: "The broker’s account page blocked direct access.", sourceIds: ["aafx-advertised"] },
    { title: "Extreme leverage claim", explanation: "The supplied 1:2000 headline magnifies financial risk.", sourceIds: ["aafx-advertised"] },
  ];
  review.entities = [{ name: "AAFX Trading Company Limited", country: "Saint Vincent and the Grenadines (CFTC-listed origin)", regulator: "CFTC RED List entry; not a CFTC licence", licence: null, sourceId: "aafx-red" }];
  review.faqs[1] = { question: "Is AAFX Trading regulated?", answer: "The reviewed CFTC entry says AAFX appears to require US registration but is not CFTC-registered. Hong Kong’s SFC also identifies it as an unlicensed entity. These jurisdiction-specific notices do not establish a brokerage licence elsewhere; verify permissions independently before paying money.", sourceIds: ["aafx-red", "aafx-sfc"] };
  review.faqs[5] = { question: "Do the warnings prove AAFX Trading is a scam?", answer: "They establish serious authorization concerns, not a court verdict. The CFTC expressly says RED List inclusion does not mean it or a court has concluded a legal violation occurred. We do not recommend the broker on the reviewed evidence, without asserting a fraud conviction.", sourceIds: ["aafx-red"] };
  review.faqs[6] = { question: "Should I deposit with AAFX Trading?", answer: "We do not recommend depositing on the evidence reviewed. Check the exact company’s permissions with your local regulator. If you already have a disputed payment, preserve your records and use official complaint channels; do not assume a private recovery offer can guarantee your money back.", sourceIds: ["aafx-red", "aafx-sfc"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/aafxtrading.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No numeric score/count or individual customer allegation was independently verified. Feedback does not override regulator records or prove fraud." };
  review.accountOpening = { ...common, url: null, status: "not-configured", sourceIds: [], isAffiliate: false };
  review.accountOpeningBlockReason = "Regulatory warnings: no account-opening link is offered.";
}
