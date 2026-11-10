import type { BrokerReview } from "./types";
import { checkedField, reviewAccounts } from "./flow";

type IntroPart = { text: string; href?: string };
const text = (value: string): IntroPart => ({ text: value });
const link = (value: string, href: string): IntroPart => ({ text: value, href });

export function reviewFocusKeyword(review: BrokerReview) {
  return `${review.broker.name} ${review.providerType && review.providerType !== "retail" ? "research profile" : "review"}`;
}

export function reviewIntroduction(review: BrokerReview): IntroPart[][] {
  const name = review.broker.name;
  const scope = review.jurisdiction && review.jurisdiction !== "Global" ? ` in ${review.jurisdiction}` : "";
  const retail = !review.providerType || review.providerType === "retail";
  if (review.suppliedResearch && review.broker.slug === "ic-markets") return [
    [text("This IC Markets review compares "), link("Seychelles accounts", "#account-opening"), text(" with Australia, Cyprus, Bahamas and Cayman disclosures.")],
    [text("Compare "), link("costs", "#fees"), text(", "), link("withdrawals", "#deposit-and-withdrawal"), text(" and "), link("entity protections", "#safety"), text(". Unresolved conflicts; no live tests.")],
  ];
  if (name && review.broker.slug === "exness" && review.jurisdiction === "Global" && reviewAccounts(review).length) return [
    [text("This Exness review examines whether the broker’s forex and CFD accounts fit your needs. Your decision depends on "), link("total trading costs", "#fees"), text(", your country’s "), link("contracting entity", "#safety"), text(" and how you deposit or withdraw.")],
    [text("Compare "), link("five account types", "#account-opening"), text(", minimum-deposit rules and platforms, then use the cost calculator to understand spread and commission. Findings come from linked public documents; live execution and withdrawals have not been tested.")],
  ];
  const comparedAccounts = reviewAccounts(review);
  const minimum = checkedField(review, "minimum-deposit");
  if (retail && review.accountComparisons && comparedAccounts.length && minimum) return [
    [text(`This ${name} review compares `), link(comparedAccounts.map(account => account.name).join(", ") + " accounts", "#account-opening"), text(`. Minimum deposit: ${minimum.value} These published terms apply to the named entity, not every regional company.`)],
    [text("Compare "), link("trading costs", "#fees"), text(", "), link("withdrawal conditions", "#deposit-and-withdrawal"), text(" and "), link("the legal entity", "#safety"), text(" before funding. Findings come from dated public documents; live execution, app usability and withdrawals were not tested.")],
  ];
  if (!retail) return [
    [text(`This ${name} research profile examines service access, pricing and counterparty checks${scope}. The directory classification is a research lead; it does not establish professional-client eligibility or access to retail trading accounts.`)],
    [text("Start with "), link("access requirements", "#account-opening"), text(", "), link("commercial pricing", "#fees"), text(" and "), link("the contracting company", "#safety"), text(". Review the linked evidence and settlement questions before approaching a provider; unverified terms remain clearly identified.")],
  ];
  const entity = checkedField(review, "regulation-and-entity");
  return [
    [text(`This ${name} review examines account costs, legal-entity checks and funding${scope}. `), text(entity
      ? "The linked disclosures identify the company or group entities; protections and resident eligibility depend on the company in your agreement."
      : "Financial terms, regulatory permissions and resident eligibility still need verification; this is a research draft rather than a completed broker assessment.")],
    [text("Start with "), link("account requirements", "#account-opening"), text(", "), link("total trading costs", "#fees"), text(" and "), link("safety checks", "#safety"), text(". Compare the documented findings with outstanding questions before funding. Public documents and collected research are identified separately; live-account performance has not been tested.")],
  ];
}

export function reviewOpeningChecks(review: BrokerReview) {
  if (review.providerType && review.providerType !== "retail") return [
    { label: "Access", value: "Client category and eligibility require confirmation." },
    { label: "Settlement", value: "Check the counterparty, funding terms and dispute process." },
  ];
  const entity = checkedField(review, "regulation-and-entity");
  const funding = checkedField(review, "published-processing-times");
  return [
    { label: "Safety", value: entity ? "Protections depend on your account’s legal entity." : "Regulatory permissions and protections are not verified here." },
    { label: "Withdrawals", value: review.broker.slug === "exness" && review.jurisdiction === "Global" && funding
      ? "24/7 requests; bank receipt can take longer."
      : funding ? "Published estimates are not a tested arrival time." : "Method-specific fees and timings still need checking." },
  ];
}
