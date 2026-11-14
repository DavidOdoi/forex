// Owner-requested public selection. Public availability does not establish
// factual completeness, an independent review or eligibility for indexing.
export const selectedReviewBrokers = [
  { slug: "exness", name: "Exness" },
  { slug: "xm", name: "XM" },
  { slug: "ic-markets", name: "IC Markets" },
  { slug: "pepperstone", name: "Pepperstone" },
  { slug: "fusion-markets", name: "Fusion Markets" },
  { slug: "ig", name: "IG" },
  { slug: "fp-markets", name: "FP Markets" },
  { slug: "capital-com", name: "Capital.com" },
  { slug: "hantec-markets", name: "Hantec Markets" },
  { slug: "plus500", name: "Plus500" },
  { slug: "oanda", name: "OANDA" },
  { slug: "tickmill", name: "Tickmill" },
  { slug: "cmc-markets", name: "CMC Markets" },
] as const;
export const reviewAvailabilityDate = "2026-11-10";
export const reviewAvailabilityDates: Record<string, string> = { "fusion-markets": "2026-11-13", ig: "2026-11-13", "fp-markets": "2026-11-13", "capital-com": "2026-11-13", "hantec-markets": "2026-11-13", plus500: "2026-11-14", oanda: "2026-11-14", tickmill: "2026-11-14", "cmc-markets": "2026-11-14" };
export function isSelectedReviewSlug(slug: string): boolean {
  return selectedReviewBrokers.some(broker => broker.slug === slug);
}
