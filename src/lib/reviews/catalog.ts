import raw from "@/data/review-research.json";
import type { ResearchEntry, ReviewDirectoryEntry } from "./research-types";
import { reviewedFields } from "./curated";
import { internationalEntities, internationalReview } from "./international";
import { fieldValue } from "./template";
import { globalReview, GLOBAL_SCOPE } from "./global";

export const researchEntries: ResearchEntry[] = raw.entries;
export const researchInventory = { total: raw.inputEntries, retail: raw.entries.length, separate: raw.separateProviderEntries };
export function reviewCountries(slug: string): string[] {
  return [GLOBAL_SCOPE, ...new Set(internationalEntities.filter(e => e.slug === slug).map(e => e.country))];
}
export function reviewHref(slug: string, country?: string): string {
  return `/reviews/${slug}${country ? `?country=${encodeURIComponent(country)}` : ""}`;
}
export function getReview(slug: string, requestedCountry?: string) {
  const research = researchEntries.find(e => e.slug === slug);
  if (!research) return null;
  const countries = reviewCountries(slug);
  const country = requestedCountry || GLOBAL_SCOPE;
  // A query parameter must never silently serve another jurisdiction's facts.
  if (requestedCountry && !countries.includes(requestedCountry)) return null;
  const profile = internationalEntities.find(e => e.slug === slug && e.country === country);
  const review = profile ? internationalReview(research.name, profile) : globalReview(research.name, research.slug);
  // Regional snapshots remain in the private research archive. The global
  // overview does not reuse local terms or regional collection excerpts.
  const regional = /kenya|kenyan|m-pesa|\bKES\b|licensees\.cma\.or\.ke|exness\.ke|\/ke-en\/|\/en-af\//i;
  const sources = research.sources.filter(source => !regional.test(`${source.url} ${source.title}`));
  const publicResearch = { ...research, countryCandidates: research.countryCandidates.filter(c => !regional.test(c)), sources,
    notes: research.notes.filter(note => sources.some(s => s.id === note.sourceId) && !regional.test(note.excerpt)) };
  if (!review.customerReviews) {
    const customerUrl = new URL("https://www.trustpilot.com/search");
    customerUrl.searchParams.set("query", review.broker.website ? new URL(review.broker.website).hostname.replace(/^www\./, "") : review.broker.name);
    review.customerReviews = { publisher: "Trustpilot", url: customerUrl.href, rating: null, reviewCount: null, checkedAt: null };
  }
  if (!review.verdict) {
    review.verdict = research.sources.length
      ? `We collected ${research.sources.length} source document${research.sources.length === 1 ? "" : "s"} for ${research.name}. The notes below show what the sources say, with links and retrieval dates. Legal-entity allocation, country availability and financial figures still require verification; this is an unfinished research draft.`
      : `Research for ${research.name} is awaiting usable source documents. The collection status below explains the outstanding access or content checks. No account costs, country eligibility or rating have been established.`;
  }
  return { review, research: publicResearch, countries };
}
export function directoryEntries(): ReviewDirectoryEntry[] {
  return researchEntries.map(entry => {
    const result = getReview(entry.slug)!;
    const variants = result.countries.length ? result.countries.map(country => getReview(entry.slug, country)!) : [result];
    const findingCount = variants.reduce((n, { review }) => n + reviewedFields(review).filter(f => f.status === "verified" && fieldValue(f, review) === f.value).length, 0);
    const urls = new Set([...result.research.sources.map(s => s.url), ...variants.flatMap(v => v.review.sources.map(s => s.url))]);
    return { slug: entry.slug, name: entry.name, country: result.countries.join(", ") || null, sourceCount: urls.size, findingCount,
      summary: findingCount ? `${result.countries.length} country/entity profile${result.countries.length === 1 ? "" : "s"} with checked, attributed findings. Editorial review is pending.`
        : urls.size ? "Source documents collected. Entity, country and account facts still need verification." : "Awaiting usable source documents. Financial and country claims remain unconfirmed." };
  });
}
