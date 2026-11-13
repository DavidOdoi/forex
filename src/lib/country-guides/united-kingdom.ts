import article from "@/data/country-guides/uk-article.json";
import type { Claim, CountryGuide, GuideRegistry } from "./types";

const scope = { countrySlug: "united-kingdom", entityId: null };
const claim = (value: string): Claim => ({ value, sourceIds: [], checkedAt: null, verification: "unverified", scope, note: "Owner-supplied article. URL availability checks are separate from substantive verification, entity matching or legal review." });
const faqs = article.markdown.split("## FAQs\n")[1].split("## Final recommendation")[0].split(/^### /m).filter(part => part.trim()).map(part => {
  const split = part.indexOf("\n");
  return { question: part.slice(0, split), answer: claim(part.slice(split + 1).trim()) };
});

export const unitedKingdomGuide: CountryGuide = {
  articleMarkdown: article.markdown,
  name: "United Kingdom", slug: "united-kingdom", locale: "en-GB",
  currency: { ...claim(""), value: null },
  title: "Best Forex Brokers in the UK (2026): FCA & Account Checks",
  seoTitle: claim("Best Forex Brokers in the UK (2026)"),
  description: "Compare the best forex brokers in the UK: platforms, FCA checks, retail leverage and FSCS limits. Review five providers and understand costs before you deposit.",
  audience: "UK residents comparing retail leveraged forex/CFD providers and customer protections.",
  directAnswer: "Compare IG, Pepperstone, OANDA, CMC Markets and XTB. Match the exact UK company and product to the FCA Register, then compare platforms and total costs.",
  legalStatus: "pending_review", publicationStatus: "draft", commercialLinksAllowed: false,
  legalReviewedAt: null, legalReviewReference: null, humanApprovalReference: null,
  publishedAt: null, updatedAt: null, authorReference: "david-odoi", reviewerReference: null,
  legalSummary: claim("The article describes the UK retail CFD framework. No current company-by-company register match, individual account eligibility or legal approval is recorded."),
  legalSources: ["uk-fca-register", "uk-fca-cfd", "uk-fca-cobs"], sourceIds: [], brokerEntityMappings: [],
  comparison: { mode: "none", purpose: null, approvalReference: null },
  questions: [], sections: [], faqs,
};

export function registerUnitedKingdomSources(registry: GuideRegistry) {
  const sources = [
    ["uk-fca-register", "FCA Financial Services Register", "Financial Conduct Authority", "https://register.fca.org.uk/s/?locale=en"],
    ["uk-fca-cfd", "FCA contracts for difference", "Financial Conduct Authority", "https://www.fca.org.uk/firms/contract-for-differences"],
    ["uk-fca-cobs", "FCA Handbook — retail CFD provisions", "Financial Conduct Authority", "https://handbook.fca.org.uk/handbook/cobs22/cobs22s5"],
    ["uk-fscs", "FSCS protection", "Financial Services Compensation Scheme", "https://www.fscs.org.uk/"],
    ["uk-fscs-investments", "FSCS investment protection", "Financial Services Compensation Scheme", "https://www.fscs.org.uk/what-we-cover/investments/"],
  ];
  for (const [id, title, publisher, url] of sources) {
    if (!registry.sources.some(source => source.id === id)) registry.sources.push({ id, title, publisher, url, kind: "regulator", scope, publishedAt: null, publicationDateStatus: "unknown", checkedAt: null, verification: "unverified", access: "retrieved", note: "URL availability checked, not a substantive source verification or legal/entity review." });
    if (!unitedKingdomGuide.sourceIds.includes(id)) unitedKingdomGuide.sourceIds.push(id);
  }
}
