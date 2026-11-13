import { researchEntries } from "../reviews/catalog";
import { isSelectedReviewSlug } from "../reviews/selection";

// Reuse the site's broker identities. Website candidates are never affiliate
// destinations and a master identity establishes no country/entity eligibility.
export function countryBrokerMaster(slug: string) {
  const record = researchEntries.find(record => record.slug === slug && record.providerType === "retail");
  const readingFocus: Record<string, string> = {
    exness: "Account types, spreads and commission",
    xm: "Account minimums and share-account terms",
    "ic-markets": "Raw-spread pricing and per-side charges",
    pepperstone: "Account/platform pairings and fee exceptions",
  };
  return record ? { slug: record.slug, name: record.name, reviewPath: isSelectedReviewSlug(slug) ? `/reviews/${slug}` : null, readingFocus: readingFocus[slug] ?? "Account terms and entity documents" } : null;
}
