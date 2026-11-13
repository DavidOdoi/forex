import raw from "@/data/review-research.json";
import { providerLabels, type ProviderType, type ResearchEntry, type ReviewDirectoryEntry } from "./research-types";
import { reviewedFields } from "./curated";
import { internationalEntities, internationalReview } from "./international";
import { fieldValue } from "./template";
import { globalReview, GLOBAL_SCOPE } from "./global";
import { davidOdoi } from "../authors";
import { applyIcMarketsResearch } from "./ic-markets";
import { applyFusionMarketsResearch } from "./fusion-markets";
import { applyIgResearch } from "./ig";

export const researchEntries: ResearchEntry[] = raw.entries.map(entry => ({ ...entry, providerType: Object.hasOwn(providerLabels, entry.providerType) ? entry.providerType as ProviderType : "other" }));
export const researchInventory = { total: raw.inputEntries, retail: raw.retailEntries, separate: raw.separateProviderEntries };
const entityCountries = new Map<string, Set<string>>();
for (const profile of internationalEntities) {
  if (!entityCountries.has(profile.slug)) entityCountries.set(profile.slug, new Set());
  entityCountries.get(profile.slug)!.add(profile.country);
}

// Two alphabetical neighbours give every profile incoming links. An additional
// entity-scope match makes links useful without treating them as recommendations.
export function relatedReviewLinks(slug: string, country = GLOBAL_SCOPE) {
  const current = researchEntries.find(entry => entry.slug === slug);
  if (!current) return [];
  const family = researchEntries.filter(entry => entry.providerType === current.providerType);
  const index = family.findIndex(entry => entry.slug === slug);
  const selected: ResearchEntry[] = [];
  const add = (entry: ResearchEntry | undefined) => {
    if (entry && entry.slug !== slug && !selected.some(existing => existing.slug === entry.slug)) selected.push(entry);
  };
  add(family[(index + family.length - 1) % family.length]);
  add(family[(index + 1) % family.length]);
  const scopes = entityCountries.get(slug) ?? new Set<string>();
  const scopeMatch = family.find(entry => entry.slug !== slug && !selected.some(other => other.slug === entry.slug) &&
    [...(entityCountries.get(entry.slug) ?? [])].some(scope => country === GLOBAL_SCOPE ? scopes.has(scope) : scope === country));
  add(scopeMatch);
  for (let offset = 2; selected.length < 3 && offset < family.length; offset++) add(family[(index + offset) % family.length]);
  for (const entry of researchEntries) { if (selected.length >= 3) break; add(entry); }
  return selected.map(entry => ({ name: entry.name, slug: entry.slug,
    href: reviewHref(entry.slug, country !== GLOBAL_SCOPE && entityCountries.get(entry.slug)?.has(country) ? country : undefined) }));
}
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
  applyIcMarketsResearch(review);
  applyFusionMarketsResearch(review);
  applyIgResearch(review);
  review.providerType = research.providerType;
  review.author ??= { ...davidOdoi };
  review.relatedResearch = relatedReviewLinks(slug, country);
  // Regional snapshots remain in the private research archive. The global
  // overview does not reuse local terms or regional collection excerpts.
  const regional = /kenya|kenyan|m-pesa|\bKES\b|licensees\.cma\.or\.ke|exness\.ke|\/ke-en\/|\/en-af\//i;
  const sources = research.sources.filter(source => !regional.test(`${source.url} ${source.title}`));
  const publicResearch = { ...research, countryCandidates: research.countryCandidates.filter(c => !regional.test(c)), sources,
    websiteCandidate: research.websiteCandidate && !regional.test(research.websiteCandidate) ? research.websiteCandidate : null,
    sourceCandidates: research.sourceCandidates.filter(url => !regional.test(url)),
    notes: research.notes.filter(note => sources.some(s => s.id === note.sourceId) && !regional.test(note.excerpt)) };
  if (!review.customerReviews) {
    const customerUrl = new URL("https://www.trustpilot.com/search");
    customerUrl.searchParams.set("query", review.broker.website ? new URL(review.broker.website).hostname.replace(/^www\./, "") : review.broker.name);
    review.customerReviews = { publisher: "Trustpilot", url: customerUrl.href, rating: null, reviewCount: null, checkedAt: null };
  }
  if (research.providerType !== "retail") delete review.customerReviews;
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
    return { slug: entry.slug, name: entry.name, providerType: entry.providerType, country: result.countries.join(", ") || null, sourceCount: urls.size, findingCount,
      summary: findingCount ? `${result.countries.length} research profile${result.countries.length === 1 ? "" : "s"} with checked, attributed findings. Editorial review is pending.`
        : urls.size ? "Source documents collected. Entity, country and account facts still need verification." : "Awaiting usable source documents. Financial and country claims remain unconfirmed." };
  });
}
