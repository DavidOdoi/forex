import type { BrokerReview, ReviewField } from "./types";
import { reviewDigest } from "./digest";
import { fieldValue, isValidSource, verifiedSources } from "./template";
import { providerLabels } from "./research-types";

export interface AccountRow {
  name: string;
  category: string;
  spread: string;
  commission: string;
  minimum: string;
  minimumSourceIds?: string[];
  platforms?: string;
  platformSourceIds?: string[];
  roundTripCommission?: string;
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
function checkedSourceAt(review: BrokerReview, id: string, checkedAt = "2026-11-03") {
  const source = review.sources.find(s => s.id === id);
  return source && isValidSource(source) && source.jurisdiction === review.jurisdiction && source.checkedAt === checkedAt;
}
export function reviewAccounts(review: BrokerReview): AccountRow[] {
  const deposit = checkedField(review, "minimum-deposit");
  const checkedDeposit = deposit?.checkedAt === "2026-11-06" && deposit.sourceIds.includes("global-minimum-deposit");
  const minimumSourceIds = checkedDeposit ? deposit.sourceIds : [];
  const platform = checkedField(review, "platform-and-availability");
  const platforms = platform?.checkedAt === "2026-11-06" && platform.sourceIds.includes("global-account-types") ? "MT4 / MT5" : undefined;
  const platformSourceIds = platforms ? platform!.sourceIds : [];
  if (review.jurisdiction === "Global" && review.broker.slug === "exness" && checkedField(review, "forex-spread-and-commission") && checkedSourceAt(review, "global-standard", "2026-11-06") && checkedSourceAt(review, "global-pro", "2026-11-06")) return [
    ...(checkedSourceAt(review, "global-cent", "2026-11-06") && checkedSourceAt(review, "global-account-types", "2026-11-06") ? [{ name: "Standard Cent", category: "Cent lots²", spread: "From 0.3 pips", commission: "No commission", minimum: checkedDeposit ? "Varies by payment method and region" : "Not verified", minimumSourceIds: checkedDeposit ? ["global-cent"] : [], platforms, platformSourceIds: platforms ? ["global-cent"] : [], roundTripCommission: "US$0", sourceIds: ["global-cent"] }] : []),
    { name: "Standard", category: "Standard", spread: "From 0.2 pips", commission: "No commission", minimum: checkedDeposit ? "Varies by payment method and region" : "Not verified", minimumSourceIds, platforms, platformSourceIds, roundTripCommission: "US$0", sourceIds: ["global-standard"] },
    { name: "Pro", category: "Professional range¹", spread: "From 0.1 pips", commission: "No commission", minimum: checkedDeposit ? "From US$200; region-dependent" : "Not verified", minimumSourceIds, platforms, platformSourceIds, roundTripCommission: "US$0", sourceIds: ["global-pro"] },
    { name: "Zero", category: "Professional range¹", spread: "From 0 pips", commission: "From US$0.05 / lot / side", minimum: checkedDeposit ? "From US$200; region-dependent" : "Not verified", minimumSourceIds, platforms, platformSourceIds, roundTripCommission: "From US$0.10 / lot", sourceIds: ["global-pro"] },
    { name: "Raw Spread", category: "Professional range¹", spread: "From 0 pips", commission: "Up to US$3.50 / lot / side", minimum: checkedDeposit ? "From US$200; region-dependent" : "Not verified", minimumSourceIds, platforms, platformSourceIds, roundTripCommission: "Up to US$7 / lot", sourceIds: ["global-pro"] },
  ];
  if (review.jurisdiction !== "Kenya") return [];
  const pricing = checkedField(review, "forex-spread-and-commission");
  if (review.broker.slug === "exness" && pricing && checkedSourceAt(review, "standard") && checkedSourceAt(review, "pro")) return [
    { name: "Standard", category: "Standard", spread: "From 0.2 pips", commission: "No commission", minimum: "Not verified", sourceIds: ["standard"] },
    { name: "Pro", category: "Professional range¹", spread: "From 0.1 pips", commission: "No commission", minimum: "Not verified", sourceIds: ["pro"] },
    { name: "Zero", category: "Professional range¹", spread: "From 0 pips", commission: "From US$0.05 / lot / side", minimum: "Not verified", sourceIds: ["pro"] },
    { name: "Raw Spread", category: "Professional range¹", spread: "From 0 pips", commission: "Up to US$3.50 / lot / side", minimum: "Not verified", sourceIds: ["pro"] },
  ];
  if (review.broker.slug === "fxpesa" && pricing && checkedField(review, "minimum-deposit") && checkedSourceAt(review, "accounts")) return [
    { name: "Standard", category: "Live account", spread: "1.4 pips published average²", commission: "US$0³", minimum: "No published minimum", sourceIds: ["accounts"] },
    { name: "Premier", category: "Live account", spread: "From 0.0 pips", commission: "US$3.50 / lot / side", minimum: "US$100", sourceIds: ["accounts"] },
  ];
  if (review.broker.slug === "pepperstone" && pricing && checkedSourceAt(review, "accounts") && checkedSourceAt(review, "pricing")) return [
    { name: "Standard", category: "CFD account", spread: "Raw FX spread + 1 pip", commission: "No separate FX commission", minimum: "US$10 advertised⁴", sourceIds: ["accounts", "pricing"] },
    { name: "Razor", category: "CFD account", spread: "FX from 0.0 pips", commission: "From US$3.50 / lot / side⁵", minimum: "US$10 advertised⁴", sourceIds: ["accounts", "pricing"] },
  ];
  if (review.broker.slug === "xm" && checkedField(review, "minimum-deposit") && checkedSourceAt(review, "accounts")) return [
    { name: "Standard", category: "Live account", spread: "Not verified", commission: "Not verified", minimum: "US$5 equivalent", sourceIds: ["accounts"] },
    { name: "Ultra Low", category: "Live account", spread: "Not verified", commission: "Not verified", minimum: "US$5 equivalent", sourceIds: ["accounts"] },
  ];
  return [];
}
export function reviewQuickFacts(review: BrokerReview): QuickFact[] {
  if (review.providerType && review.providerType !== "retail") return ["Client category", "Minimum commitment", "Service pricing", "Contracting entity", "Regulatory permissions", "Platform access", "Country eligibility", "Funding arrangements", "Settlement terms"].map(label => ({ label, value: "Not verified", state: "unknown" as const, sourceIds: [] }));
  const digest = reviewDigest(review);
  const accounts = reviewAccounts(review);
  const result: QuickFact[] = [];
  const add = (label: string, value: string | undefined, sourceIds: string[] = [], state: QuickFact["state"] = "text") => {
    result.push(value ? { label, value, sourceIds, state } : { label, value: "Not verified", sourceIds: [], state: "unknown" });
  };
  const minimumLabels: Record<string, string> = { fxpesa: "Standard: none published; Premier: US$100", pepperstone: "US$10; bank-wire exception", xm: "US$5 equivalent" };
  const globalMinimum = review.jurisdiction === "Global" && review.broker.slug === "exness" && accounts[0]?.minimumSourceIds?.length ? "Standard: method/region; professional: from US$200" : undefined;
  add("Minimum deposit", digest.minimum ? globalMinimum ?? (accounts.length ? minimumLabels[review.broker.slug] : undefined) ?? digest.minimum.value ?? undefined : undefined, digest.minimum?.sourceIds);
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
  if (review.providerType && review.providerType !== "retail") return [
    `The supplied directory classifies ${review.broker.name} as ${providerLabels[review.providerType]}; this remains an unverified research lead.`,
    "Service access, counterparty eligibility and commercial terms have not been established.",
    "This profile uses the shared research format without assuming retail trading accounts or resident acceptance.",
  ];
  const pricing = checkedField(review, "forex-spread-and-commission");
  const regulation = checkedField(review, "regulation-and-entity");
  if (review.jurisdiction === "Global" && pricing && regulation && review.broker.slug === "exness" && reviewAccounts(review).length) return [
    "Exness is worth shortlisting for forex/CFD traders who want a choice of account pricing.",
    "Standard advertises spreads from 0.2 pips with no separate commission; Zero/Raw Spread add per-side fees.",
    "It does not suit US residents or investors seeking direct share ownership.",
  ];
  if (review.jurisdiction === "Global") return regulation ? [
    `${review.broker.name}’s group disclosures identify the legal entities listed below; permissions apply to each named company.`,
    "Account costs and resident eligibility still require entity-specific checks.",
    "Confirm the company in your agreement and its current terms before applying.",
  ] : [
    `Research for ${review.broker.name} is incomplete; no source-backed account terms are approved in this profile.`,
    "Collected material and directory leads still require entity-level checking.",
    "Confirm eligibility, fees and funding conditions with the relevant legal entity before applying.",
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
  // Use the same three evidenced answers in the document and FAQ schema.
  return reviewDigest(review).faqs.filter(f => f.answer && verifiedSources(f.sourceIds, review)).slice(0, 3);
}
