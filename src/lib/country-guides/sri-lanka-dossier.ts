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
  country.intro = reported("This guide to forex brokers in Sri Lanka compares the questions to ask about eligibility, costs, funding and platform access.");
  country.description = "Forex brokers in Sri Lanka: compare four research candidates, account costs, platform checks and reported local rules before making a decision.";
  country.directAnswer = "No Sri Lanka-specific broker recommendation is verified here. Compare the four research candidates below; resident eligibility, the serving entity and local trading/funding permission still need confirmation.";
  country.legalSummary = reported("The supplied research identifies a CBSL forex warning and restrictions on Sri Lankan bank-issued cards. Their interaction with the June 2026 investment rules remains unresolved; these are not our independent source checks or a current legal determination.", [notice, faq, gazette]);
  country.legalSources = [notice, faq, gazette, order, "dfe-regulations-index", "dfe-residency"];
  country.sourceIds = [notice, faq, gazette, order, "dfe-regulations-index", "dfe-residency", "dfe-contact", fsa, "cbsl-current-notices", "dfe-guidance"];
  country.questions = [
    { question: "Will a broker accept a registration?", answer: reported("Explicit Sri Lankan resident acceptance is not established for the four research candidates."), status: "unknown" },
    { question: "Which company would serve the resident?", answer: reported("Confirm the exact contracting company; a group name does not establish the serving entity."), status: "unknown" },
    { question: "Is that exact entity locally authorized?", answer: reported("No Sri Lankan authorization is established. A foreign licence does not establish local permission.", [fsa]), status: "unknown" },
    { question: "Are trading and funding lawful for this resident?", answer: reported("The resident, product, transaction and 2026 instruments need qualified legal interpretation.", [notice, gazette, order]), status: "pending_review" },
    { question: "May Devin Forex target this country commercially?", answer: reported("No country-targeting agreement or qualified promotional approval is recorded.", [notice]), status: "unknown" },
  ];
  country.sections = [
    { id: "local-rules", eyebrow: "Read the local context", title: "What the CBSL warning is reported to say", paragraphs: [
      reported("The dossier reproduces this historical warning. Its PDF body is described as undated; the filename suggests 21 October 2019, not a confirmed publication date.", [notice], { sourceId: notice, locator: "Historical warning, reproduced by the dossier", text: "Accordingly, any other person in, or resident in Sri Lanka is not permitted to undertake forex trading transactions or remit funds outside Sri Lanka for such transactions and receive income or profit earned from forex trading." }),
    ] },
    { id: "investment-rules-2026", eyebrow: "Later rules need interpretation", title: "What changed in the reported 2026 investment rules?", paragraphs: [
      reported("The dossier dates Gazette 2493/36 to 18 June 2026, effective 20 June 2026. It distinguishes rupee-conversion investments from use of existing foreign assets; it does not establish retail forex/CFD permission.", [gazette]),
      reported("The operative English text of order 2493/38 was not accessed by the contributor. Residency definitions, implementing directions and other applicable restrictions still need qualified review.", [order, "dfe-residency", "dfe-regulations-index"]),
    ] },
    { id: "costs-and-accounts", eyebrow: "Look beyond the headline spread", title: "Forex brokers in Sri Lanka: compare the total cost", paragraphs: [
      reported("No Sri Lankan account fee schedule is verified here. Use this checklist with the exact entity’s current terms."),
    ], table: { caption: "Costs to compare before judging an account", headers: ["Cost", "What to check"], rows: [
      ["Spread", "Typical spread as well as the advertised minimum."],
      ["Commission", "Per-side or round-trip units and contract size."],
      ["Overnight charges", "Swaps, covered instruments and swap-free administration fees."],
      ["Conversion & payments", "LKR/account-currency conversion, intermediary and withdrawal charges."],
      ["Minimum deposit", "An entry requirement, separate from a suitable risk budget."],
    ] } },
    { id: "platforms-and-accounts", eyebrow: "Choose the questions that fit you", title: "Platforms, account types and swap-free conditions", paragraphs: [],
      table: { caption: "Match your needs to documented account terms", headers: ["Your priority", "Ask the exact serving entity"], rows: [
        ["New to trading", "What demo eligibility, order controls and learning support are documented?"],
        ["MT4, MT5 or EAs", "Which platform, instruments and automated strategies are supported?"],
        ["Swap-free account", "Who qualifies, which instruments are covered, and what other charges apply?"],
      ] } },
    { id: "funding", eyebrow: "Sri Lanka-specific payment context", title: "Deposits, withdrawals and card restrictions", paragraphs: [
      reported("DFE FAQ 30 is reported to prohibit forex trading through electronic fund transfer cards issued by Sri Lankan banks. This does not establish that another channel is lawful.", [faq]),
      reported("Ask for current written clarification covering your resident category, product and transaction. Then check the permitted method’s conversion, bank charges and withdrawal terms.", ["dfe-contact"]),
    ] },
    { id: "checking-claims", eyebrow: "Pause before trusting a promise", title: "Red flags in broker marketing", paragraphs: [], points: [
      "An unverifiable company or licence number.",
      "Guaranteed returns or pressure to deposit immediately.",
      "Personal payment details or unclear withdrawal conditions.",
      "A foreign group licence presented as Sri Lankan authorization.",
    ] },
  ];
  country.faqs = [
    { question: "Is forex trading legal in Sri Lanka?", answer: reported("The reported CBSL warning, card restrictions and later investment rules do not establish a lawful retail forex/CFD route here. Obtain current qualified clarification for your resident category, product and transaction.", [notice, faq, gazette]) },
    { question: "Which forex brokers accept traders from Sri Lanka?", answer: reported("The dossier covers Exness, XM, IC Markets and Pepperstone, but confirms neither resident acceptance nor the serving entity and local authorization. They remain research candidates, not recommendations.") },
    { question: "How can I verify whether a forex broker is authorized?", answer: reported("Identify the legal company in the proposed agreement. Check its regulator’s register and the permissions required to serve your resident category. A foreign licence alone does not establish Sri Lankan authorization.", [fsa, "dfe-contact"]) },
  ];
  // The complete research ledger and owner/legal questions remain in the
  // supplied record. Shorter public copy does not create approval or eligibility.
  country.legalStatus = "pending_review"; country.publicationStatus = "draft";
  country.commercialLinksAllowed = false; country.legalReviewedAt = null;
  country.legalReviewReference = null; country.humanApprovalReference = null;
  country.publishedAt = null; country.updatedAt = null; country.reviewerReference = null;
  country.brokerEntityMappings = []; country.comparison = { mode: "none", purpose: null, approvalReference: null };
}
