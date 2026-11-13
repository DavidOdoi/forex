import type { Claim, CountryGuide, GuideRegistry } from "./types";

type ArticleInput = {
  name: string; slug: string; locale: string; title: string; seoTitle: string;
  description: string; directAnswer: string; legalSummary: string; markdown: string;
  sources: { id: string; title: string; publisher: string; url: string }[];
};

// A country-specific supplied article, never a country-name substitution or an
// approval record. Existing metadata, publication gates and reader layout apply.
export function suppliedArticle(input: ArticleInput) {
  const scope = { countrySlug: input.slug, entityId: null };
  const claim = (value: string): Claim => ({ value, sourceIds: [], checkedAt: null, verification: "unverified", scope, note: "Owner-supplied research. URL availability does not establish current law, permissions or resident eligibility." });
  const faqText = input.markdown.split("## FAQs\n")[1]?.split("## Final recommendation")[0];
  const faqs = (faqText ?? "").split(/^### /m).filter(part => part.trim()).map(part => {
    const split = part.indexOf("\n");
    return { question: part.slice(0, split), answer: claim(part.slice(split + 1).trim()) };
  });
  if (faqs.length !== 3) throw new Error(`${input.slug} must contain exactly three FAQs`);
  const guide: CountryGuide = {
    name: input.name, slug: input.slug, locale: input.locale,
    title: input.title, seoTitle: claim(input.seoTitle), description: input.description,
    articleMarkdown: input.markdown, directAnswer: input.directAnswer,
    audience: `${input.name} residents researching forex/CFD companies, products and account terms.`,
    currency: { ...claim(""), value: null },
    legalStatus: "pending_review", publicationStatus: "draft", commercialLinksAllowed: false,
    legalReviewedAt: null, legalReviewReference: null, humanApprovalReference: null,
    publishedAt: null, updatedAt: null, authorReference: "david-odoi", reviewerReference: null,
    legalSummary: claim(input.legalSummary), legalSources: input.sources.map(source => source.id),
    sourceIds: input.sources.map(source => source.id), brokerEntityMappings: [],
    comparison: { mode: "none", purpose: null, approvalReference: null },
    questions: [], sections: [], faqs,
  };
  function registerSources(registry: GuideRegistry) {
    for (const source of input.sources) {
      if (!registry.sources.some(existing => existing.id === source.id)) registry.sources.push({
        ...source, kind: "regulator", scope, publishedAt: null,
        publicationDateStatus: "unknown", checkedAt: null, verification: "unverified",
        access: "retrieved", note: "Supplied source URL retrieved for availability only; no substantive verification, company-register match or legal approval recorded.",
      });
    }
  }
  return { guide, registerSources };
}
