// Owner-requested public selection. Public availability does not establish
// factual completeness, an independent review or eligibility for indexing.
export const selectedReviewBrokers = [
  { slug: "exness", name: "Exness" },
  { slug: "xm", name: "XM" },
  { slug: "ic-markets", name: "IC Markets" },
  { slug: "pepperstone", name: "Pepperstone" },
] as const;
export const reviewAvailabilityDate = "2026-11-10";
export function isSelectedReviewSlug(slug: string): boolean {
  return selectedReviewBrokers.some(broker => broker.slug === slug);
}
