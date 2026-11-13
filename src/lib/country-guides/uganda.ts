import article from "@/data/country-guides/uganda-article.json";
import type { Claim, CountryGuide, GuideRegistry } from "./types";

const scope = { countrySlug: "uganda", entityId: null };
const claim = (value: string): Claim => ({ value, sourceIds: [], checkedAt: null, verification: "unverified", scope, note: "Owner-supplied copy; no outside research requested or performed." });
const faqBlock = article.markdown.split("## FAQs\n")[1].split("## Final recommendation")[0];
const faqs = faqBlock.split(/^### /m).filter(part => part.trim()).map(part => {
  const split = part.indexOf("\n");
  return { question: part.slice(0, split), answer: claim(part.slice(split + 1).trim()) };
});

export const ugandaGuide: CountryGuide = {
  articleMarkdown: article.markdown,
  name: "Uganda", slug: "uganda", locale: "en-UG",
  currency: { ...claim(""), value: null },
  title: "Best Forex Brokers in Uganda (2026): How to Choose a Safe, Low-Cost Broker",
  seoTitle: claim("Best Forex Brokers in Uganda (2026): Compare 5 Brokers"),
  description: "Compare five forex brokers in Uganda by platforms, pricing models and account checks. Understand entity, regulation and funding questions before you deposit.",
  audience: "Ugandan residents researching international forex and CFD brokers.",
  directAnswer: "Compare Exness, XM, IC Markets, Pepperstone and OANDA by costs, platform and company. Confirm resident eligibility and local trading/funding requirements before acting.",
  legalStatus: "pending_review", publicationStatus: "draft", commercialLinksAllowed: false,
  legalReviewedAt: null, legalReviewReference: null, humanApprovalReference: null,
  publishedAt: null, updatedAt: null, authorReference: "david-odoi", reviewerReference: null,
  legalSummary: claim("No local authorisation or permission to fund offshore leveraged forex/CFD accounts is established by this supplied article."),
  legalSources: [], sourceIds: [], brokerEntityMappings: [],
  comparison: { mode: "none", purpose: null, approvalReference: null },
  questions: [], sections: [], faqs,
};

export function registerUgandaSources(registry: GuideRegistry) {
  const sources = [
    ["ug-cma-firms", "CMA Uganda licensed firms", "Capital Markets Authority Uganda", "https://cmauganda.co.ug/licensed-firms-2/"],
    ["ug-bou-regulations", "Bank of Uganda acts and regulations", "Bank of Uganda", "https://www.bou.or.ug/bouwebsite/Supervision/actsandregulations.html"],
    ["ug-absa-markets", "Absa Uganda market solutions", "Absa Uganda", "https://www.absa.co.ug/corporate-and-investment/market-solutions/"],
  ];
  for (const [id, title, publisher, url] of sources) {
    if (!registry.sources.some(source => source.id === id)) registry.sources.push({ id, title, publisher, url, kind: id === "ug-absa-markets" ? "editorial" : "regulator", scope, publishedAt: null, publicationDateStatus: "unknown", checkedAt: null, verification: "unverified", access: "not_attempted", note: "Reference supplied in the owner's article; not independently accessed or checked." });
    ugandaGuide.sourceIds.push(id);
  }
}
