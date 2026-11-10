import { getReview, researchEntries, reviewCountries, reviewHref } from "./catalog";
import { isReviewPublished } from "./publication";
import { reviewedFields } from "./curated";
import type { BrokerReview } from "./types";
import type { ReviewDirectoryEntry } from "./research-types";
import { siteOrigin } from "../site";
import { selectedReviewBrokers, isSelectedReviewSlug } from "./selection";

// The source catalogue changes through deployments, so this snapshot can be
// reused within a server instance without exposing drafts to client bundles.
let approved: BrokerReview[] | undefined;
export function publishedReviews(): BrokerReview[] {
  return approved ??= researchEntries.filter(entry => isSelectedReviewSlug(entry.slug)).flatMap(entry => reviewCountries(entry.slug).map(country => getReview(entry.slug, country)!.review))
    .filter(review => review.status === "published" && isReviewPublished(review));
}
export function selectPublishedReviewEntries(reviews: BrokerReview[]): ReviewDirectoryEntry[] {
  const groups = new Map<string, BrokerReview[]>();
  for (const review of reviews.filter(isReviewPublished)) groups.set(review.broker.slug, [...(groups.get(review.broker.slug) ?? []), review]);
  return [...groups.values()].map(variants => {
    const review = variants.find(record => record.jurisdiction === "Global") ?? variants[0];
    return {
      slug: review.broker.slug, name: review.broker.name, providerType: review.providerType ?? "retail",
      href: reviewHref(review.broker.slug, review.jurisdiction === "Global" ? undefined : review.jurisdiction ?? undefined), published: true,
      country: variants.map(record => record.jurisdiction).filter(Boolean).join(", "),
      sourceCount: new Set(variants.flatMap(record => record.sources.map(source => source.url))).size,
      findingCount: variants.reduce((count, record) => count + reviewedFields(record).filter(field => field.status === "verified").length, 0),
      summary: "Published, source-based research. Account terms and eligibility depend on the named company and your location.",
    };
  });
}
export function publishedReviewEntries() { return selectPublishedReviewEntries(publishedReviews()); }
export function publishedReviewHref(slug: string) { return publishedReviewEntries().find(entry => entry.slug === slug)?.href; }
export function publishedReviewLinks() { return publishedReviewEntries().slice(0, 8).map(entry => ({ label: entry.name, href: entry.href! })); }
export function isPublishedReviewHref(href: string) {
  const url = new URL(href, siteOrigin);
  const slug = url.pathname.match(/^\/reviews\/([^/]+)$/)?.[1];
  return url.origin === siteOrigin && publishedReviews().some(review => review.broker.slug === slug && review.jurisdiction === (url.searchParams.get("country") ?? "Global"));
}

// Website discovery is deliberately separate from editorial/indexing approval.
export function getVisibleReview(slug: string, country?: string) {
  if (!isSelectedReviewSlug(slug)) return null;
  const result = getReview(slug, country);
  if (!result) return null;
  result.review.relatedResearch = selectedReviewBrokers.filter(broker => broker.slug !== slug)
    .map(broker => ({ ...broker, href: reviewHref(broker.slug) }));
  return result;
}
export function visibleReviewHref(slug: string) {
  return isSelectedReviewSlug(slug) ? reviewHref(slug) : undefined;
}
export function visibleReviewLinks() {
  return selectedReviewBrokers.map(broker => ({ label: broker.name, href: reviewHref(broker.slug) }));
}
export function visibleReviewEntries(): ReviewDirectoryEntry[] {
  return selectedReviewBrokers.map(broker => {
    const result = getVisibleReview(broker.slug)!;
    const variants = result.countries.map(country => getVisibleReview(broker.slug, country)!.review);
    return { slug: broker.slug, name: broker.name, href: reviewHref(broker.slug), visible: true,
      published: isReviewPublished(result.review), providerType: result.research.providerType,
      country: result.countries.join(", "),
      sourceCount: new Set([...result.research.sources.map(source => source.url), ...variants.flatMap(review => review.sources.map(source => source.url))]).size,
      findingCount: variants.reduce((count, review) => count + reviewedFields(review).filter(field => field.status === "verified").length, 0),
      summary: "Source-based research with linked evidence. Unverified costs, eligibility and account terms are clearly identified; no hands-on testing or rating is claimed.",
    };
  });
}
export function isVisibleReviewHref(href: string) {
  const url = new URL(href, siteOrigin);
  const slug = url.pathname.match(/^\/reviews\/([^/]+)$/)?.[1];
  return url.origin === siteOrigin && Boolean(slug && getVisibleReview(slug, url.searchParams.get("country") ?? undefined));
}
