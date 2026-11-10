import type { AffiliateRegistry, CountryBrokerMapping, CountryGuide, GuideRegistry } from "./types";
import { approvalRecord, checkedSource, claimVerified, httpsUrl, validDate } from "./evidence";
import { guideApproved, verifiedEntity } from "./publication";
import { countryBrokerMaster } from "./broker-master";

export function resolveCountryAffiliateLink(country: CountryGuide, mapping: CountryBrokerMapping, registry: GuideRegistry, affiliates: AffiliateRegistry, asOf: string): { href: string; rel: string; target: "_blank" } | null {
  if (!validDate(asOf) || country.legalStatus !== "permitted" || country.commercialLinksAllowed !== true || !guideApproved(country, registry, asOf) || !countryBrokerMaster(mapping.brokerSlug) || !country.brokerEntityMappings.some(row => row.brokerSlug === mapping.brokerSlug && row.entityId === mapping.entityId) || !verifiedEntity(mapping, registry, asOf)) return null;
  const legal = approvalRecord(country.legalReviewReference, "legal", country.slug, registry, asOf)!;
  const editorial = approvalRecord(country.humanApprovalReference, "editorial", country.slug, registry, asOf)!;
  if (editorial.commercialLinksAllowed !== true || !legal.approvedEntityIds?.includes(mapping.entityId)) return null;
  for (const claim of [mapping.residentEligibility, mapping.localAuthorization, mapping.tradingPermission, mapping.fundingPermission]) {
    const allowed = claim === mapping.residentEligibility ? ["broker_stated", "regulator_confirmed"] as const : ["regulator_confirmed"] as const;
    if (!claimVerified(claim, country.slug, mapping.entityId, registry, asOf, [...allowed])) return null;
  }
  if (mapping.residentEligibility.value !== "accepted" || mapping.tradingPermission.value !== "permitted" || mapping.fundingPermission.value !== "permitted") return null;
  const geo = affiliates.geoApprovals.find(record => record.id === mapping.geoApprovalReference);
  if (!geo || geo.status !== "approved" || !geo.approvalReference.trim() || !validDate(geo.approvedAt) || geo.approvedAt > asOf || geo.countrySlug !== country.slug || geo.brokerSlug !== mapping.brokerSlug || geo.entityId !== mapping.entityId) return null;
  const agreement = affiliates.agreements.find(record => record.id === geo.agreementId);
  if (!agreement || agreement.status !== "active" || agreement.brokerSlug !== mapping.brokerSlug || agreement.entityId !== mapping.entityId || !validDate(agreement.startsAt) || !validDate(agreement.expiresAt) || agreement.startsAt > asOf || agreement.expiresAt < asOf || !agreement.sourceIds.length || !geo.sourceIds.length || !validDate(agreement.checkedAt) || !validDate(geo.checkedAt) || geo.checkedAt > geo.approvedAt) return null;
  for (const record of [agreement, geo]) if (!record.sourceIds.every(id => {
    const source = registry.sources.find(source => source.id === id);
    return checkedSource(source, asOf) && source.kind === "affiliate" && source.scope.countrySlug === country.slug && source.scope.entityId === mapping.entityId && source.checkedAt === record.checkedAt;
  })) return null;
  const url = httpsUrl(agreement.trackingUrl);
  if (!url || !agreement.approvedHosts.includes(url.hostname)) return null;
  return { href: url.href, rel: "sponsored nofollow noopener noreferrer", target: "_blank" };
}
