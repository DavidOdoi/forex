import type { CountryGuide, CountryBrokerMapping, GuideRegistry } from "./types";
import { approvalRecord, claimVerified, validDate } from "./evidence";
import { countryBrokerMaster } from "./broker-master";

export function guideApproved(country: CountryGuide, registry: GuideRegistry, asOf: string): boolean {
  const legal = approvalRecord(country.legalReviewReference, "legal", country.slug, registry, asOf);
  const editorial = approvalRecord(country.humanApprovalReference, "editorial", country.slug, registry, asOf);
  const updated = country.updatedAt ?? country.publishedAt;
  return country.publicationStatus === "approved" && country.legalStatus !== "pending_review" && Boolean(legal && editorial && legal.legalStatus === country.legalStatus && country.legalReviewedAt === legal.approvedAt && validDate(country.publishedAt) && validDate(updated) && country.publishedAt <= updated && updated >= legal.approvedAt && updated >= editorial.approvedAt && updated <= asOf && country.legalSources.length && country.legalSources.every(id => legal.sourceIds.includes(id)) && claimVerified(country.legalSummary, country.slug, null, registry, asOf, ["regulator_confirmed"]));
}
export function verifiedEntity(mapping: CountryBrokerMapping, registry: GuideRegistry, asOf: string) {
  const entity = registry.entities.find(entity => entity.id === mapping.entityId && entity.brokerSlug === mapping.brokerSlug);
  return entity && [entity.legalName, entity.jurisdiction, entity.regulator, entity.licence].every(value => value.trim()) && entity.evidence.value === "matched" && claimVerified(entity.evidence, null, entity.id, registry, asOf, ["regulator_confirmed"]) ? entity : null;
}
export function comparisonMappings(country: CountryGuide, registry: GuideRegistry, asOf: string): CountryBrokerMapping[] {
  if (country.comparison.mode !== "educational" || !country.comparison.purpose?.trim() || !guideApproved(country, registry, asOf) || !approvalRecord(country.comparison.approvalReference, "comparison", country.slug, registry, asOf)) return [];
  return country.brokerEntityMappings.filter(mapping => countryBrokerMaster(mapping.brokerSlug) && verifiedEntity(mapping, registry, asOf) && claimVerified(mapping.residentEligibility, country.slug, mapping.entityId, registry, asOf, ["broker_stated", "regulator_confirmed"]) && claimVerified(mapping.localAuthorization, country.slug, mapping.entityId, registry, asOf, ["regulator_confirmed"]));
}
