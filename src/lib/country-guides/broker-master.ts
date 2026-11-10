import { researchEntries } from "../reviews/catalog";
import { isSelectedReviewSlug } from "../reviews/selection";

// Reuse the site's broker identities. Website candidates are never affiliate
// destinations and a master identity establishes no country/entity eligibility.
export function countryBrokerMaster(slug: string) {
  const record = researchEntries.find(record => record.slug === slug && record.providerType === "retail");
  return record ? { slug: record.slug, name: record.name, reviewPath: isSelectedReviewSlug(slug) ? `/reviews/${slug}` : null } : null;
}
