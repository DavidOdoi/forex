import type { CountryGuide } from "./types";
import { validDate } from "./evidence";

// A packet copied into another country's config must not become its evidence.
// Contributor-reported access never satisfies checkedSource/claimVerified.
export function countrySuppliedResearch(country: CountryGuide, asOf: string) {
  const dossier = country.suppliedResearch;
  return dossier && dossier.countrySlug === country.slug && validDate(dossier.reportedResearchDate) && dossier.reportedResearchDate <= asOf ? dossier : null;
}
