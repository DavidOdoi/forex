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
  { slug: "xtb", name: "XTB" },
  { slug: "interactive-brokers", name: "Interactive Brokers" },
  { slug: "avatrade", name: "AvaTrade" },
  { slug: "blackbull-markets", name: "BlackBull Markets" },
  { slug: "etoro", name: "eToro" },
  { slug: "aafx-trading", name: "AAFX Trading" },
  { slug: "z-forex", name: "ZForex" },
  { slug: "trading-com", name: "Trading.com" },
] as const;
export const reviewAvailabilityDate = "2026-11-10";
export const reviewAvailabilityDates: Record<string, string> = { "fusion-markets": "2026-11-13", ig: "2026-11-13", "fp-markets": "2026-11-13", "capital-com": "2026-11-13", "hantec-markets": "2026-11-13", plus500: "2026-11-14", oanda: "2026-11-14", tickmill: "2026-11-14", "cmc-markets": "2026-11-14", xtb: "2026-11-14", "interactive-brokers": "2026-11-14", avatrade: "2026-11-14", "blackbull-markets": "2026-11-14", etoro: "2026-11-14", "aafx-trading": "2026-11-14", "z-forex": "2026-11-14", "trading-com": "2026-11-14" };
export function isSelectedReviewSlug(slug: string): boolean {
  return selectedReviewBrokers.some(broker => broker.slug === slug);
}
