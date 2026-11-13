import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyHantecMarketsResearch(review: BrokerReview) {
  if (review.broker.slug !== "hantec-markets" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://hmarkets.com/";
  const { common, set } = prepareResearchedRecord(review, "Hantec Markets Ltd, Mauritius international website", "2026-11-13", [
    { id: "hantec-global", title: "Global account specifications", url: "https://hmarkets.com/trade-with-us/hantec-global/" },
    { id: "hantec-pro", title: "Pro account specifications", url: "https://hmarkets.com/trade-with-us/hantec-pro/" },
    { id: "hantec-cent", title: "Cent account specifications", url: "https://hmarkets.com/trade-with-us/hantec-cents/" },
    { id: "hantec-home", title: "International platforms and legal disclosure", url: "https://hmarkets.com/" },
    { id: "hantec-funding", title: "Funding fees and processing claims", url: "https://hmarkets.com/trade-with-us/funding-account/" },
    { id: "hantec-agreement", title: "Mauritius client agreement", url: "https://hmarkets.com/HMM-Terms-and-Conditions.pdf" },
    { id: "hantec-social", title: "Hantec Social and provider performance fees", url: "https://hmarkets.com/trading-platforms/hantec-social/" },
    { id: "hantec-signup", title: "Live-account pre-registration", url: "https://hmarkets.com/live-account-pre-registration/" },
  ]);
  set("minimum-deposit", "Global, Pro and Cent: from US$10; method/entity limits apply.", ["hantec-global", "hantec-pro", "hantec-cent"]);
  set("forex-commission-per-lot", "Pro/Cent: from US$2/lot; confirm per-side terms.", ["hantec-pro", "hantec-cent"]);
  set("global-commission", "Global: from zero on selected assets; not every instrument.", ["hantec-global"]);
  set("spread-summary", "Floating spreads advertised from 0.1 pips; not a typical spread.", ["hantec-global", "hantec-pro", "hantec-cent"]);
  set("forex-spread-and-commission", "All three accounts advertise floating spreads from 0.1 pips. Global lists commissions from zero on selected assets; Pro/Cent list from US$2 per lot. Confirm instrument, platform and whether the quoted commission is per side before comparing totals.", ["hantec-global", "hantec-pro", "hantec-cent"]);
  set("overnight-financing", "Financing can apply to positions held overnight. Check the relevant instrument and direction in the current contract specification; a tight spread does not remove holding costs.", ["hantec-agreement"]);
  set("inactivity-fee", "Agreement §2.34.5: monthly US$5/£5/€5 equivalent after more than six months without qualifying activity across your accounts. The charge is capped at the remaining balance; account closure/archive conditions apply.", ["hantec-agreement"]);
  set("regulation-and-entity", "The current international site identifies Hantec Markets Ltd, authorised as an investment dealer by the Mauritius FSC, licence C114013940. This is provider-reported here; no independent regulator-register match was completed.", ["hantec-home", "hantec-agreement"]);
  set("contracting-legal-entity", "The Mauritius agreement governs the international offering described here. Do not assume that licences held by other Hantec group companies give this account UK retail protections.", ["hantec-agreement"]);
  set("negative-balance-protection", "The site advertises negative-balance protection, subject to the applicable account agreement. It does not protect the deposited balance from trading losses.", ["hantec-funding", "hantec-agreement"]);
  set("regulation-summary", "International site: Mauritius FSC C114013940; provider-reported.", ["hantec-home"]);
  set("country-availability", "The international footer excludes the US, UAE, Japan, Iran, Myanmar, North Korea and Russia, with further local restrictions. Confirm residence, company and lawful funding routes before applying.", ["hantec-home"]);
  set("deposit-methods-and-charges", "The funding page advertises zero broker processing fees for deposits and withdrawals. Confirm country-specific methods and any bank, intermediary or conversion charges.", ["hantec-funding"]);
  set("withdrawal-methods-and-charges", "Zero broker processing fees are advertised. Your method, receiving provider and account checks determine actual costs and availability; obtain current limits before requesting funds.", ["hantec-funding", "hantec-agreement"]);
  set("published-processing-times", "“As little as five minutes” is the broker’s best-case processing claim, not a receipt guarantee. Method, verification and bank/provider settlement affect timing. No withdrawal was tested for this review.", ["hantec-funding", "hantec-agreement"]);
  set("identity-and-address-requirements", "The international offer excludes the US, UAE and Japan, among other jurisdictions. Complete pre-registration and requested identity/address checks, read the agreement and confirm payment eligibility before funding. Approval time is not guaranteed.", ["hantec-signup", "hantec-agreement"]);
  set("demo-account", "Virtual-funds demo; not a live-execution test.", ["hantec-home"]);
  set("retail-and-professional-accounts", "Global, Pro and Cent describe product/pricing choices. Choosing Pro does not by itself establish a regulatory professional-client classification. Cent balance units differ from standard-account units.", ["hantec-global", "hantec-pro", "hantec-cent"]);
  set("supported-mobile-platforms", "MT4/MT5 and Hantec mobile/WebTrader; not tested here.", ["hantec-home"]);
  set("platform-summary", "MT4, MT5, Hantec WebTrader/mobile and eligible Hantec Social.", ["hantec-home", "hantec-social"]);
  set("platform-and-availability", "MetaTrader and proprietary web/mobile tools are offered. Hantec Social supports copying eligible strategies; providers can charge performance fees shown on their profiles. Historical results do not guarantee returns.", ["hantec-home", "hantec-social"]);
  set("leverage-by-product-and-region", "The international account tables advertise up to 1:500. Instrument, entity and classification limits apply; this is not a UK retail entitlement. Greater leverage magnifies losses.", ["hantec-global", "hantec-pro", "hantec-cent"]);
  set("leverage-summary", "Up to 1:500; entity/instrument limits apply.", ["hantec-global", "hantec-pro", "hantec-cent"]);
  set("cfds-and-underlying-markets", "International forex and CFDs include indices, metals, commodities, shares and eligible crypto. A share or crypto CFD does not give ownership of the underlying asset; available markets differ by account and country.", ["hantec-home"]);
  const base = { ...common, spread: "From 0.1 pips", minimum: "From US$10; method/entity limits apply", platforms: "MT4 / MT5; confirm proprietary-platform access" };
  review.accountComparisons = [
    { ...base, name: "Global", category: "International · selected commission-free assets", commission: "From US$0 on selected instruments", sourceIds: ["hantec-global"] },
    { ...base, name: "Pro", category: "International · commission pricing", commission: "From US$2/lot; confirm per-side basis", sourceIds: ["hantec-pro"] },
    { ...base, name: "Cent", category: "International · cent-denominated balance", commission: "From US$2/lot; confirm contract units", sourceIds: ["hantec-cent"] },
  ];
  review.quickFactFields = [
    { label: "Minimum deposit", fieldId: "minimum-deposit", state: "text" },
    { label: "Global commission", fieldId: "global-commission", state: "text" },
    { label: "Pro / Cent commission", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Spreads", fieldId: "spread-summary", state: "text" },
    { label: "Maximum leverage", fieldId: "leverage-summary", state: "text" },
    { label: "Platforms", fieldId: "platform-summary", state: "text" },
    { label: "Demo account", fieldId: "demo-account", state: "yes" },
    { label: "Mobile trading", fieldId: "supported-mobile-platforms", state: "yes" },
    { label: "Regulation", fieldId: "regulation-summary", state: "text" },
  ];
  review.verdictEvidence = { ...common, sentences: ["Hantec Markets’ international Global, Pro and Cent accounts advertise a US$10 starting deposit and floating spreads from 0.1 pips.", "Global has zero-commission pricing on selected assets; Pro/Cent commissions require an instrument-specific check.", "Read the Mauritius agreement, inactivity fee and withdrawal conditions; other group licences do not transfer UK protections to this account."], sourceIds: ["hantec-global", "hantec-pro", "hantec-cent", "hantec-agreement"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Low entry amount", explanation: "The three international account pages advertise US$10.", sourceIds: ["hantec-global", "hantec-pro", "hantec-cent"] },
    { title: "Several account choices", explanation: "Compare Global, Pro and Cent terms for your strategy.", sourceIds: ["hantec-global", "hantec-pro", "hantec-cent"] },
    { title: "Platform flexibility", explanation: "MetaTrader plus proprietary web/mobile access is listed.", sourceIds: ["hantec-home"] },
    { title: "Copying option", explanation: "Hantec Social offers strategy following; risk and provider fees remain.", sourceIds: ["hantec-social"] },
    { title: "No broker processing fee advertised", explanation: "External bank/provider charges can still apply.", sourceIds: ["hantec-funding"] },
  ];
  review.limitations = [
    { title: "Monthly inactivity charge", explanation: "The Mauritius agreement charges after six inactive months, subject to conditions.", sourceIds: ["hantec-agreement"] },
    { title: "Commission basis matters", explanation: "Confirm per-side/round-trip terms before using a “from US$2” headline.", sourceIds: ["hantec-pro", "hantec-cent"] },
    { title: "Five minutes is not guaranteed", explanation: "Processing and receiving-bank arrival are separate stages.", sourceIds: ["hantec-funding"] },
    { title: "Entity-specific safeguards", explanation: "Mauritius accounts do not automatically receive UK protections.", sourceIds: ["hantec-agreement"] },
    { title: "Copy-trading costs and losses", explanation: "Provider performance fees can apply; past returns do not establish future results.", sourceIds: ["hantec-social"] },
  ];
  review.entities = [{ name: "Hantec Markets Ltd", country: "Mauritius", regulator: "FSC", licence: "C114013940", sourceId: "hantec-agreement", note: "International-site agreement; independently check the current regulator entry and your assigned company." }];
  review.faqs[1] = { question: "Is Hantec Markets a legitimate and regulated broker?", answer: "The international company is Hantec Markets Ltd, Mauritius FSC licence C114013940. Verify your agreement’s company in the official register. Group licences do not transfer protections or prevent trading losses.", sourceIds: ["hantec-home", "hantec-agreement"] };
  review.faqs[5] = { question: "What is the minimum deposit for Hantec Markets?", answer: "Global, Pro and Cent currently advertise US$10. Entity and payment-method conditions can differ. This is an entry minimum, not a recommended trading budget; margin and potential losses still matter.", sourceIds: ["hantec-global", "hantec-pro", "hantec-cent"] };
  review.faqs[6] = { question: "How long do Hantec Markets withdrawals take?", answer: "Five-minute processing is an advertised best case, not a guaranteed arrival time. Checks, payment methods and receiving providers can add delays. DEVIN FOREX has not tested a withdrawal.", sourceIds: ["hantec-funding", "hantec-agreement"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/hmarkets.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "Match the Hantec Markets brokerage profile; Hantec Trader challenges are a separate product. No current numeric rating or count was independently confirmed." };
  review.accountOpening = { ...common, url: "https://hmarkets.com/live-account-pre-registration/", status: "verified", sourceIds: ["hantec-signup"], isAffiliate: false };
}
