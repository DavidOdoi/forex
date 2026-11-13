import dossierData from "@/data/country-guides/sri-lanka-dossier-2026-11-10.json";
import type { Claim, CountryGuide, GuideRegistry, SuppliedCountryResearch } from "./types";

export const sriLankaDossier = dossierData as SuppliedCountryResearch;
const notice = "cbsl-2019-notice", faq = "dfe-current-transactions", gazette = "gazette-2493-36", order = "gazette-2493-38", fsa = "fsa-cross-border-2021";
const reported = (value: string, sourceIds: string[] = [], quote?: Claim["reportedQuote"]): Claim => ({ value, sourceIds, checkedAt: null, verification: "unverified", scope: { countrySlug: "sri-lanka", entityId: null }, note: "Reported research or editorial reading guidance. No independent recheck or legal approval is recorded; the complete supplied dossier is preserved separately.", ...(quote ? { reportedQuote: quote } : {}) });

export function applySriLankaDossier(country: CountryGuide, registry: GuideRegistry) {
  if (country.slug !== sriLankaDossier.countrySlug) return;
  for (const source of sriLankaDossier.reportedSources) {
    const index = registry.sources.findIndex(record => record.id === source.id);
    if (index < 0) registry.sources.push(structuredClone(source));
    else registry.sources[index] = structuredClone(source);
  }
  country.suppliedResearch = structuredClone(sriLankaDossier);
  country.title = "Forex Brokers in Sri Lanka: Costs, Rules & Key Checks";
  country.seoTitle = reported("Forex Brokers in Sri Lanka: Key Checks");
  country.intro = reported("Comparing forex brokers in Sri Lanka takes more than finding a low spread. Account fees, MT4/MT5 access, swap-free conditions and LKR conversion costs all matter—but so do local trading and payment rules. Below, compare four brokers’ published international terms, see the trade-offs, and identify what needs confirmation before you act.");
  country.description = "Forex brokers in Sri Lanka: compare four research candidates, account costs, platform checks and reported local rules before making a decision.";
  country.directAnswer = "Compare Exness, XM, IC Markets and Pepperstone for pricing, platforms and account terms. They are research candidates, not confirmed Sri Lankan options: resident eligibility, the serving company and lawful funding still need confirmation.";
  country.legalSummary = reported("Reported CBSL forex and bank-card restrictions need to be read alongside the June 2026 investment rules. Their current application to retail forex/CFDs remains unresolved here.", [notice, faq, gazette]);
  country.legalSources = [notice, faq, gazette, order, "dfe-regulations-index", "dfe-residency"];
  country.sourceIds = [notice, faq, gazette, order, "dfe-regulations-index", "dfe-residency", "dfe-contact", fsa, "cbsl-current-notices", "dfe-guidance"];
  country.questions = [
    { question: "Will a broker accept a registration?", answer: reported("Explicit Sri Lankan resident acceptance remains unconfirmed."), status: "unknown" },
    { question: "Which company would serve the resident?", answer: reported("Confirm the company named in the proposed agreement."), status: "unknown" },
    { question: "Is that exact entity locally authorized?", answer: reported("A foreign licence does not establish Sri Lankan authorization.", [fsa]), status: "unknown" },
    { question: "Are trading and funding lawful for this resident?", answer: reported("Obtain current clarification covering your circumstances and the 2026 rules.", [notice, gazette, order]), status: "pending_review" },
    { question: "What protections and complaint route apply?", answer: reported("Read client-money, negative-balance and complaint terms for the exact company."), status: "unknown" },
  ];
  country.sections = [
    { id: "local-rules", eyebrow: "Read the local context", title: "What the CBSL warning is reported to say", paragraphs: [
      reported("The supplied historical warning says the following. Its PDF body is undated; the filename suggests 21 October 2019, not a confirmed publication date.", [notice], { sourceId: notice, locator: "Historical CBSL warning", text: "Accordingly, any other person in, or resident in Sri Lanka is not permitted to undertake forex trading transactions or remit funds outside Sri Lanka for such transactions and receive income or profit earned from forex trading." }),
    ] },
    { id: "investment-rules-2026", eyebrow: "Later rules need interpretation", title: "What changed in the reported 2026 investment rules?", paragraphs: [
      reported("Gazette 2493/36 is reported dated 18 June 2026, effective 20 June 2026. Rupee-conversion investments and existing foreign assets are treated separately; this does not establish CFD permission.", [gazette]),
      reported("Order 2493/38’s operative English text was not accessed. Residency definitions and implementing directions still need qualified review.", [order, "dfe-residency", "dfe-regulations-index"]),
    ] },
    { id: "costs-and-accounts", eyebrow: "Look beyond the headline spread", title: "Forex brokers in Sri Lanka: compare the total cost", paragraphs: [
      reported("Compare the same instrument and trade size. Headline spreads exclude some costs; minimum deposits are not recommended trading budgets."),
    ], table: { caption: "Costs to compare before judging an account", headers: ["Cost", "What to check"], rows: [
      ["Spread", "Typical spread as well as the advertised minimum."],
      ["Commission", "Per-side or round-trip units and contract size."],
      ["Overnight charges", "Swaps, covered instruments and swap-free administration fees."],
      ["Conversion & payments", "LKR/account-currency conversion, intermediary and withdrawal charges."],
      ["Minimum deposit", "An entry requirement, separate from a suitable risk budget."],
    ] } },
    { id: "platforms-and-accounts", eyebrow: "Look at both sides", title: "Broker strengths and trade-offs", paragraphs: [],
      table: { caption: "Features worth comparing—not test-based endorsements", headers: ["Broker", "Useful feature", "Trade-off to check"], rows: [
        ["Exness", "Spread-only Standard pricing", "Swap-free eligibility and variable deposit minimums"],
        ["XM", "$5 Standard / Ultra Low entry minimum", "Shares minimum and account-specific overnight charges"],
        ["IC Markets", "Standard and Raw pricing choices", "Raw commission and swap-free holding fees"],
        ["Pepperstone", "Several platform choices", "Minimum-deposit wording and TradingView account pairing"],
      ] } },
    { id: "funding", eyebrow: "Sri Lanka-specific payment context", title: "Deposits, withdrawals and card restrictions", paragraphs: [
      reported("DFE FAQ 30 reportedly prohibits forex trading through Sri Lankan bank-issued cards. This does not establish that another channel is lawful.", [faq]),
    ], table: { caption: "Payment checks before any proposed transaction", headers: ["Channel", "What needs confirmation"], rows: [
      ["Cards", "The reported restriction and its current application."],
      ["Bank transfers", "Permission for the purpose, documents and bank charges."],
      ["Wallets / crypto", "No presumed workaround; check local rules and provider terms."],
      ["Withdrawals", "Own-name rules, conversion, charges and processing conditions."],
    ] } },
    { id: "checking-claims", eyebrow: "Pause before trusting a promise", title: "Red flags in broker marketing", paragraphs: [], points: [
      "Unverifiable licences or foreign licences presented as local authorization.",
      "Guaranteed profits or pressure to deposit quickly.",
      "Personal payment details or unclear withdrawal conditions.",
    ] },
  ];
  const readingOrder = ["costs-and-accounts", "platforms-and-accounts", "funding", "local-rules", "investment-rules-2026", "checking-claims"];
  country.sections.sort((a, b) => readingOrder.indexOf(a.id) - readingOrder.indexOf(b.id));
  country.faqs = [
    { question: "Is forex trading legal in Sri Lanka?", answer: reported("The reported warnings and later investment rules do not establish a lawful retail CFD route here. Obtain current qualified clarification for your resident category and transaction.", [notice, faq, gazette]) },
    { question: "Which forex brokers accept traders from Sri Lanka?", answer: reported("This guide compares Exness, XM, IC Markets and Pepperstone. Explicit resident acceptance and the serving entity remain unconfirmed; a sign-up page is not proof of either.") },
    { question: "How can I verify whether a forex broker is authorized?", answer: reported("Identify the exact company, check its official regulator register, and confirm permissions to serve your resident category. A foreign licence alone is insufficient.", [fsa, "dfe-contact"]) },
  ];
  // The complete research ledger and owner/legal questions remain in the
  // supplied record. Shorter public copy does not create approval or eligibility.
  country.legalStatus = "pending_review"; country.publicationStatus = "draft";
  country.commercialLinksAllowed = false; country.legalReviewedAt = null;
  country.legalReviewReference = null; country.humanApprovalReference = null;
  country.publishedAt = null; country.updatedAt = null; country.reviewerReference = null;
  country.brokerEntityMappings = []; country.comparison = { mode: "none", purpose: null, approvalReference: null };
}
