import type { BrokerReview, ReviewField, ReviewSectionId } from "./types";
import type { ResearchEntry } from "./research-types";
import { hasDisplayableField, isValidSource, verifiedSources, verifiedVerdictSentences } from "./template";

export interface DigestSection {
  id: ReviewSectionId;
  title: string;
  kicker: string;
  fields: ReviewField[];
}

// Editorial summaries of the already checked November 3 records. Only matching
// country records with valid field evidence may use these shorter statements.
const concise: Record<string, Record<string, string>> = {
  "exness/Global": {
    "forex-spread-and-commission": "Compare the account table’s spread floors and per-side commissions together. Actual costs vary by instrument, volatility and liquidity; minimum spreads are not guaranteed.",
    "regulation-and-entity": "Several entities and permissions are disclosed below. They are provider-reported here; UK and Cyprus entities explicitly do not serve retail clients.",
    "contracting-legal-entity": "Your location and account terms determine the contracting company. Confirm its exact name and permissions in the registration agreement.",
    "client-money-arrangements": "Exness reports segregated funds at tier-one banks. The arrangements were not independently audited for this review.",
    "published-processing-times": "Requests are listed as 24/7. Automatic processing is not guaranteed arrival; non-instant requests are described as processed within 24 hours. Receiving providers may take longer.",
    "supported-mobile-platforms": "Exness Trade and MT5 mobile are documented. Device compatibility, features and execution were not tested.",
    "platform-and-availability": "Exness Terminal supports browser trading with real/demo MT5 accounts. Confirm platform and instrument availability for your account.",
    "leverage-by-product-and-region": "Up to 1:Unlimited is advertised, subject to eligibility and instrument/account/entity conditions. Higher leverage amplifies losses.",
  },
  "fxpesa/Kenya": {
    "minimum-deposit": "Standard: no published minimum. Premier: US$100. Payment-method limits may apply.",
    "forex-spread-and-commission": "Standard advertises a 1.4-pip average spread and US$0 commission. Premier: spreads from 0.0 pips plus US$3.50 per lot, per side. Product-specific terms apply; these are provider figures, not tested EUR/USD costs.",
    "overnight-financing": "Instrument-specific financing can apply at 23:59 server time. Settlement dates and holidays affect multi-day charges; check current rates.",
    "regulation-and-entity": "EGM Securities Limited appears in Kenya’s CMA register under licence 107. This licence covers the named local entity.",
    "contracting-legal-entity": "The site names EGM Securities Limited as operator. Its linked customer agreement was not retrieved; confirm the company in your final contract.",
    "client-money-arrangements": "FXPesa reports separate client trust accounts. Bank statements and account-level audits were not examined.",
    "deposit-methods-and-charges": "M-Pesa, EAZZYPAY, Airtel Money, cards, bank wires, Skrill and Neteller are listed. Advertised broker deposit fees are US$0; external charges can apply.",
    "withdrawal-methods-and-charges": "Kenyan mobile money/domestic wires: US$0. Skrill/Neteller: 1%, capped at US$30. International wires: US$15. Cards: US$0. Provider and conversion charges may apply.",
    "published-processing-times": "Mobile money is advertised as instant; first withdrawals may take longer, and some providers need up to 3 hours. E-wallets: 1–2 working days. Cards may take up to 15 working days. These are estimates.",
    "identity-and-address-requirements": "Personal details, trading experience and valid identity/address evidence are requested. Approval includes appropriateness checks.",
    "demo-account": "A free demo is offered. The dedicated page lists US$10,000 virtual funds and 90-day inactivity expiry; another FAQ mentions up to US$50,000. Confirm the starting balance.",
    "supported-mobile-platforms": "MT4, MT5 and Equiti Trader are advertised. Confirm current operating-system requirements in the app store.",
    "platform-and-availability": "MQ WebTrader provides browser access to MT4/MT5 for Standard and Premier accounts. Usability and execution were not tested.",
    "real-stocks-and-etfs": "Shares and ETFs are CFDs, without ownership or physical delivery of the underlying assets.",
    "leverage-by-product-and-region": "Live accounts advertise leverage up to 1:400; ETF CFDs up to 1:20. Limits vary by instrument and account.",
    "product-restrictions": "The published ETF CFD specifications mark those instruments as MT5 only.",
  },
  "exness/Kenya": {
    "regulation-and-entity": "Kenya’s CMA register lists the local Exness entity under licence 162. The website names it Exness (KE) Limited.",
    "contracting-legal-entity": "The local website serves Kenyan residents and Kenyan-incorporated companies only. Confirm Exness (KE) Limited in your account agreement.",
    "forex-spread-and-commission": "Advertised spread floors: Standard 0.2 pips; Pro 0.1, both without commission. Zero: spreads from 0 plus commission from US$0.05 per lot/side. Raw Spread: spreads from 0 plus commission up to US$3.50 per lot/side. Actual costs vary.",
    "withdrawal-requirements": "Use your own payment accounts. Third-party payments are not accepted; contact support if the original funding method is unavailable.",
    "published-processing-times": "“Instant” means automatic processing, not guaranteed receipt. Non-instant requests are described as processed within 24 hours; bank/provider arrival can take longer.",
    "withdrawal-fee": "Withdrawal-fee coverage is advertised, but footnotes allow third-party charges. Check the exact method in your Personal Area.",
    "client-money-arrangements": "The provider reports segregated funds in tier-one banks. Those arrangements were not independently audited here.",
  },
  "pepperstone/Kenya": {
    "minimum-deposit": "US$10 or local equivalent is advertised; the pricing page gives a no-minimum bank-wire exception. Confirm your method.",
    "regulation-and-entity": "Pepperstone Markets Kenya Limited appears in Kenya’s CMA register under licence 128.",
    "contracting-legal-entity": "The Kenyan legal page names Pepperstone Markets Kenya Limited. Read the agreement presented during your application.",
    "forex-spread-and-commission": "Standard: a 1-pip FX spread markup, without separate FX commission. Razor: advertised spreads from 0.0 plus commission from US$3.50 per lot/side. Platform, currency and instrument affect charges.",
    "overnight-financing": "Eligible positions held past 5pm New York time can incur rollover adjustments. Rates and settlement rules depend on the instrument.",
    "inactivity-fee": "No inactivity/account-keeping fee is advertised. Accounts below ten currency units with no trades for three months may be archived; reactivation is available.",
    "withdrawal-fee": "Wording conflicts: a zero-fee headline is qualified by a US$25/£15 international-wire deduction in the FAQ, plus external bank fees. Confirm the Kenyan method.",
    "negative-balance-protection": "The regional FAQ describes protection for retail clients, excluding Pepperstone Pro. Confirm your classification and full legal terms.",
    "supported-mobile-platforms": "Pepperstone’s app and third-party MetaTrader/cTrader options are advertised. Compatibility depends on the account and platform.",
    "platform-and-availability": "Pepperstone, MT4, MT5, cTrader and TradingView are listed. The account page excludes TradingView from Standard and gives differing MT4 detail; confirm the pairing.",
    "real-stocks-and-etfs": "The local disclosure describes CFD exposure, without ownership of underlying shares or ETF units.",
    "leverage-by-product-and-region": "Major FX leverage is advertised up to 1:400. Other asset limits conflict between regional pages; consult the Kenyan instrument and tiered-margin schedule.",
  },
  "xm/Kenya": {
    "minimum-deposit": "Standard and Ultra Low: US$5, or the funding-currency equivalent. Payment-method limits need confirmation.",
    "regulation-and-entity": "TPXMGLOBAL Kenya Limited appears in Kenya’s CMA register under licence 233.",
    "contracting-legal-entity": "The Kenyan site names TPXMGLOBAL Kenya Limited, registration PVT-BEUX5EZV. Confirm that company in your customer agreement.",
    "negative-balance-protection": "The Kenyan account page advertises negative balance protection. Its scope and exclusions still require the applicable agreement.",
  },
};

const leads: Record<string, string> = {
  "fxpesa/Kenya": "KES and USD accounts, local mobile-money payments, and MetaTrader or Equiti Trader access. Standard and Premier use different pricing. Here are the documented terms, costs and checks that matter.",
  "exness/Kenya": "A Kenya-specific offering with four advertised pricing accounts. Compare the published charges and payment rules, and confirm the local entity before applying.",
  "pepperstone/Kenya": "Standard and Razor CFD accounts with several platform options. The Kenyan sources explain the pricing, but some withdrawal fees and leverage limits need clarification.",
  "xm/Kenya": "The Kenyan offering lists Standard and Ultra Low accounts from US$5. Local licence details are checked; full costs and protection terms still need confirmation.",
};

const sectionDefinitions: { id: ReviewSectionId; title: string; kicker: string; fields: string[] }[] = [
  { id: "fees", title: "What does trading cost?", kicker: "01 / FEES", fields: ["forex-spread-and-commission", "platform-commission", "overnight-financing", "inactivity-fee"] },
  { id: "safety", title: "Who holds your account?", kicker: "02 / REGULATION & ENTITY", fields: ["regulation-and-entity", "contracting-legal-entity", "negative-balance-protection", "client-money-arrangements"] },
  { id: "deposit-and-withdrawal", title: "Moving your money", kicker: "03 / DEPOSITS & WITHDRAWALS", fields: ["deposit-methods-and-charges", "withdrawal-methods-and-charges", "withdrawal-fee", "published-processing-times", "withdrawal-requirements"] },
  { id: "account-opening", title: "Before you open an account", kicker: "04 / GETTING STARTED", fields: ["identity-and-address-requirements", "demo-account", "retail-and-professional-accounts"] },
  { id: "mobile-app", title: "Trading on your phone", kicker: "05 / MOBILE", fields: ["supported-mobile-platforms"] },
  { id: "web-platform", title: "Trading in your browser", kicker: "06 / WEB PLATFORM", fields: ["platform-and-availability"] },
  { id: "product-selection", title: "Know what you’re trading", kicker: "07 / MARKETS", fields: ["real-stocks-and-etfs", "leverage-by-product-and-region", "product-restrictions", "cfds-and-underlying-markets"] },
];

export function wordCount(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

export function reviewDigest(review: BrokerReview, research?: ResearchEntry) {
  const key = `${review.broker.slug}/${review.jurisdiction}`;
  const fields = [...review.keyData, ...review.chapters.flatMap(c => c.panels.flatMap(p => p.fields))];
  const get = (id: string): ReviewField | undefined => {
    const field = fields.find(f => f.id === id && hasDisplayableField(f, review));
    if (!field) return undefined;
    const text = field.checkedAt === "2026-11-03" ? concise[key]?.[id] : undefined;
    return { ...field, value: text ?? field.value };
  };
  // Select whole findings, never cut a fee exception or a legal qualifier.
  let remaining = 620;
  const sections: DigestSection[] = sectionDefinitions.map(def => {
    const selected: ReviewField[] = [];
    for (const id of def.fields) {
      if (id === "withdrawal-fee" && selected.some(f => f.id === "withdrawal-methods-and-charges")) continue;
      const field = get(id);
      const count = wordCount(field?.value ?? "");
      const limit = ["safety", "deposit-and-withdrawal", "fees"].includes(def.id) ? 3 : def.id === "product-selection" ? 2 : def.id === "account-opening" ? 2 : 1;
      if (field && count <= remaining && selected.length < limit) { selected.push(field); remaining -= count; }
    }
    return { ...def, fields: selected };
  });
  const sourceMap = review.sources.filter(isValidSource);
  const faqIndexes = [1, 5, 6];
  const faqs = faqIndexes.map(i => review.faqs[i]).filter(f => f.answer && wordCount(f.answer) <= 65 && verifiedSources(f.sourceIds, review));
  const leadRequirements: Record<string, string[]> = {
    "fxpesa/Kenya": ["minimum-deposit", "supported-mobile-platforms", "account-currencies"],
    "exness/Kenya": ["forex-spread-and-commission", "eligible-countries-and-client-category"],
    "pepperstone/Kenya": ["forex-spread-and-commission", "platform-and-availability"],
    "xm/Kenya": ["minimum-deposit", "regulation-and-entity"],
  };
  const checkedLead = verifiedVerdictSentences(review) ? verifiedVerdictSentences(review)!.join(" ") : leadRequirements[key]?.every(id => get(id)) ? leads[key] : undefined;
  const lead = checkedLead ?? (review.jurisdiction === "Global"
    ? `A global overview of ${review.broker.name} account conditions, group disclosures and research. Terms and eligibility depend on the actual contracting entity and your location.`
    : sourceMap.length
    ? `A source-based look at ${review.broker.name}${review.jurisdiction ? `’s ${review.jurisdiction} entity` : ""}. Start with the company and permissions below; regional account terms still need further checks.`
    : `Research for ${review.broker.name} is in progress. Available source notes are shown below; account terms and country eligibility remain unconfirmed.`);
  const conclusion = checkedLead
    ? "Compare the documented features with your needs, then confirm current costs, eligibility and the exact entity with the broker. Outstanding checks are shown above. This draft is not a personal recommendation."
    : "The available evidence supports an entity profile, not a complete assessment of account costs or suitability. Check the applicable agreement and outstanding regional terms before making a decision.";
  return {
    lead, conclusion, sections, faqs, sources: sourceMap,
    minimum: get("minimum-deposit"),
    currencies: get("account-currencies"),
    positives: review.strengths.filter(p => verifiedSources(p.sourceIds, review)).slice(0, 5),
    cautions: review.limitations.filter(p => verifiedSources(p.sourceIds, review)).slice(0, 5),
    notes: sourceMap.length ? [] : (research?.notes ?? []).slice(0, 2),
  };
}
