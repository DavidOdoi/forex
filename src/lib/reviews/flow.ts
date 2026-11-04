import type { BrokerReview, ReviewField } from "./types";
import { reviewDigest } from "./digest";
import { fieldValue, isValidSource, verifiedSources } from "./template";

export interface AccountRow {
  name: string;
  category: string;
  spread: string;
  commission: string;
  minimum: string;
  sourceIds: string[];
}
export interface QuickFact {
  label: string;
  value: string;
  state: "text" | "yes" | "no" | "unknown";
  sourceIds: string[];
}
export function checkedField(review: BrokerReview, id: string): ReviewField | undefined {
  return [...review.keyData, ...review.chapters.flatMap(c => c.panels.flatMap(p => p.fields))].find(f =>
    f.id === id && f.status === "verified" && f.jurisdiction === review.jurisdiction && fieldValue(f, review) === f.value);
}
function checkedNovemberSource(review: BrokerReview, id: string) {
  const source = review.sources.find(s => s.id === id);
  return source && isValidSource(source) && source.jurisdiction === review.jurisdiction && source.checkedAt === "2026-11-03";
}
export function reviewAccounts(review: BrokerReview): AccountRow[] {
  if (review.jurisdiction === "Global" && review.broker.slug === "exness" && checkedField(review, "forex-spread-and-commission") && checkedNovemberSource(review, "global-standard") && checkedNovemberSource(review, "global-pro")) return [
    { name: "Standard", category: "Standard", spread: "From 0.2 pips", commission: "No commission", minimum: "Not verified", sourceIds: ["global-standard"] },
    { name: "Pro", category: "Professional range¹", spread: "From 0.1 pips", commission: "No commission", minimum: "Not verified", sourceIds: ["global-pro"] },
    { name: "Zero", category: "Professional range¹", spread: "From 0 pips", commission: "From US$0.05 / lot / side", minimum: "Not verified", sourceIds: ["global-pro"] },
    { name: "Raw Spread", category: "Professional range¹", spread: "From 0 pips", commission: "Up to US$3.50 / lot / side", minimum: "Not verified", sourceIds: ["global-pro"] },
  ];
  if (review.jurisdiction !== "Kenya") return [];
  const pricing = checkedField(review, "forex-spread-and-commission");
  if (review.broker.slug === "exness" && pricing && checkedNovemberSource(review, "standard") && checkedNovemberSource(review, "pro")) return [
    { name: "Standard", category: "Standard", spread: "From 0.2 pips", commission: "No commission", minimum: "Not verified", sourceIds: ["standard"] },
    { name: "Pro", category: "Professional range¹", spread: "From 0.1 pips", commission: "No commission", minimum: "Not verified", sourceIds: ["pro"] },
    { name: "Zero", category: "Professional range¹", spread: "From 0 pips", commission: "From US$0.05 / lot / side", minimum: "Not verified", sourceIds: ["pro"] },
    { name: "Raw Spread", category: "Professional range¹", spread: "From 0 pips", commission: "Up to US$3.50 / lot / side", minimum: "Not verified", sourceIds: ["pro"] },
  ];
  if (review.broker.slug === "fxpesa" && pricing && checkedField(review, "minimum-deposit") && checkedNovemberSource(review, "accounts")) return [
    { name: "Standard", category: "Live account", spread: "1.4 pips published average²", commission: "US$0³", minimum: "No published minimum", sourceIds: ["accounts"] },
    { name: "Premier", category: "Live account", spread: "From 0.0 pips", commission: "US$3.50 / lot / side", minimum: "US$100", sourceIds: ["accounts"] },
  ];
  if (review.broker.slug === "pepperstone" && pricing && checkedNovemberSource(review, "accounts") && checkedNovemberSource(review, "pricing")) return [
    { name: "Standard", category: "CFD account", spread: "Raw FX spread + 1 pip", commission: "No separate FX commission", minimum: "US$10 advertised⁴", sourceIds: ["accounts", "pricing"] },
    { name: "Razor", category: "CFD account", spread: "FX from 0.0 pips", commission: "From US$3.50 / lot / side⁵", minimum: "US$10 advertised⁴", sourceIds: ["accounts", "pricing"] },
  ];
  if (review.broker.slug === "xm" && checkedField(review, "minimum-deposit") && checkedNovemberSource(review, "accounts")) return [
    { name: "Standard", category: "Live account", spread: "Not verified", commission: "Not verified", minimum: "US$5 equivalent", sourceIds: ["accounts"] },
    { name: "Ultra Low", category: "Live account", spread: "Not verified", commission: "Not verified", minimum: "US$5 equivalent", sourceIds: ["accounts"] },
  ];
  return [];
}
export function reviewQuickFacts(review: BrokerReview): QuickFact[] {
  const digest = reviewDigest(review);
  const accounts = reviewAccounts(review);
  const result: QuickFact[] = [];
  const add = (label: string, value: string | undefined, sourceIds: string[] = [], state: QuickFact["state"] = "text") => {
    result.push(value ? { label, value, sourceIds, state } : { label, value: "Not verified", sourceIds: [], state: "unknown" });
  };
  const minimumLabels: Record<string, string> = { fxpesa: "Standard: none published; Premier: US$100", pepperstone: "US$10; bank-wire exception", xm: "US$5 equivalent" };
  add("Minimum deposit", digest.minimum ? (accounts.length ? minimumLabels[review.broker.slug] : undefined) ?? digest.minimum.value ?? undefined : undefined, digest.minimum?.sourceIds);
  const commission = accounts[0];
  add(commission ? `${commission.name} FX commission` : "FX commission", commission?.commission !== "Not verified" ? commission?.commission : undefined, commission?.sourceIds);
  const leverage = checkedField(review, "leverage-by-product-and-region");
  add("Maximum leverage", leverage ? (review.jurisdiction === "Global" ? "Conditional; see account terms" : review.jurisdiction === "Kenya" ? "Up to 1:400; instrument limits apply" : undefined) : undefined, leverage?.sourceIds);
  const swap = review.broker.slug === "exness" && accounts.length > 0;
  add("Swap-free option", swap ? "Available; terms apply" : undefined, swap ? (review.jurisdiction === "Global" ? ["global-standard", "global-pro"] : ["standard", "pro"]) : [], swap ? "yes" : "unknown");
  const segregated = checkedField(review, "client-money-arrangements");
  add("Segregated client funds", segregated ? "Yes · provider-reported" : undefined, segregated?.sourceIds, segregated ? "yes" : "unknown");
  const restrictions = checkedField(review, "country-availability");
  const excludesUS = restrictions && ((review.jurisdiction === "Global" && review.broker.slug === "exness") || (review.jurisdiction === "Kenya" && ["exness", "fxpesa", "xm"].includes(review.broker.slug)));
  add(review.broker.slug === "xm" ? "Accepts US citizens" : "Accepts US residents", excludesUS ? "No" : undefined, excludesUS ? restrictions.sourceIds : [], excludesUS ? "no" : "unknown");
  const demo = checkedField(review, "demo-account");
  add("Demo account", demo ? "Available; virtual funds" : undefined, demo?.sourceIds, demo ? "yes" : "unknown");
  const mobile = checkedField(review, "supported-mobile-platforms");
  add("Mobile trading", mobile ? "Documented; not tested" : undefined, mobile?.sourceIds, mobile ? "yes" : "unknown");
  const licence = checkedField(review, "licence-number");
  const regulation = checkedField(review, "regulation-and-entity");
  add("Regulation", review.jurisdiction === "Global" && regulation ? "Entity-specific; see safety" : licence ? (licence.sourceIds.includes("cma") ? `CMA · ${licence.value}` : "Provider report · see safety") : undefined, review.jurisdiction === "Global" ? regulation?.sourceIds : licence?.sourceIds);
  return result;
}
export function verdictSentences(review: BrokerReview): string[] {
  const pricing = checkedField(review, "forex-spread-and-commission");
  const regulation = checkedField(review, "regulation-and-entity");
  if (review.jurisdiction === "Global" && pricing && regulation && review.broker.slug === "exness" && reviewAccounts(review).length) return [
    "Exness’s international pages list four account types with different spread and commission structures.",
    "Web/mobile trading and round-the-clock payment requests are documented, with receipt dependent on the payment provider.",
    "Eligibility, leverage and protections vary by contracting entity; confirm the terms that apply to your location.",
  ];
  if (review.jurisdiction === "Global") return [
    `This is a global overview of ${review.broker.name}, covering the available group disclosures and research.`,
    "Account costs and availability depend on your location and contracting entity.",
    "Use the source links and entity-specific profiles to confirm the terms that apply to you.",
  ];
  if (review.jurisdiction === "Kenya" && pricing && regulation && reviewAccounts(review).length) {
    if (review.broker.slug === "exness") return [
      "Exness’s Kenyan offering lists four accounts with different spread and commission structures.",
      "Automated withdrawal processing does not guarantee instant bank receipt.",
      "CMA licence 162 covers the local entity; minimum deposits and full protection terms remain unconfirmed.",
    ];
    if (review.broker.slug === "fxpesa") return [
      "FXPesa’s Kenyan offering combines KES/USD accounts, local mobile money and MetaTrader or Equiti Trader access.",
      "Standard has no published minimum, while Premier starts at US$100 with a separate trading commission.",
      "EGM Securities Limited holds the listed CMA licence 107; payment costs and product restrictions deserve a closer look.",
    ];
    if (review.broker.slug === "pepperstone") return [
      "Pepperstone’s Kenyan offering compares Standard spread-markup pricing with Razor’s spread-plus-commission model.",
      "Its regional pages contain conflicting withdrawal-fee wording and some differing leverage limits.",
      "The local entity appears under CMA licence 128; confirm the applicable account and payment terms before relying on a cost figure.",
    ];
  }
  if (review.broker.slug === "xm" && review.jurisdiction === "Kenya" && reviewAccounts(review).length && regulation) return [
    "XM’s Kenyan account page lists Standard and Ultra Low accounts from US$5 or the funding-currency equivalent.",
    "The CMA register lists TPXMGLOBAL Kenya Limited under licence 233.",
    "Detailed trading costs, withdrawal terms and protection exclusions remain to be checked for this entity.",
  ];
  const source = review.sources.find(s => isValidSource(s) && s.jurisdiction === review.jurisdiction);
  return source ? [
    `${review.broker.name} identifies ${source.legalEntity} in ${source.jurisdiction} in the linked source material.`,
    "Account costs, eligibility and protections require separate checks for that entity.",
    "This source-based draft is not a completed suitability assessment or a live-account test.",
  ] : [
    `Research for ${review.broker.name} is in progress.`,
    "Account costs, the legal entity and country eligibility are not yet verified.",
    "Use the collected notes as research leads rather than account recommendations.",
  ];
}
export function flowFaqs(review: BrokerReview) {
  const faqs = reviewDigest(review).faqs.filter(f => f.answer && verifiedSources(f.sourceIds, review));
  if (review.broker.slug === "exness" && review.jurisdiction === "Kenya") faqs.unshift({ question: "Is Exness a market maker?", answer: "This draft has not verified the contractual execution role of Exness (KE) Limited. Check that entity’s customer agreement and execution policy; another group company’s model should not be assumed to apply.", sourceIds: [] });
  if (review.broker.slug === "exness" && review.jurisdiction === "Global") faqs.unshift({ question: "Is Exness a market maker?", answer: "This global overview has not verified the contractual execution role of every Exness entity. Check the customer agreement and execution policy of the company assigned to your account rather than assuming one group-wide model.", sourceIds: [] });
  return faqs;
}
