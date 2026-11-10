// Synthetic test records only. These are never imported by application code or
// served as financial research, legal advice, real approvals or affiliate links.
import { sriLankaGuide } from "../../src/lib/country-guides/catalog";
import type { AffiliateRegistry, Claim, CountryGuide, GuideRegistry, GuideSource, Verification } from "../../src/lib/country-guides/types";

export const testAsOf = "2026-11-10";
export function approvedCountryFixture() {
  const slug = "example-country", entityId = "fixture-entity", checkedAt = "2026-11-01";
  const claim = <T,>(value: T | null, source: string, verification: Verification, entity: string | null = entityId, country: string | null = slug): Claim<T> => ({ value, sourceIds: [source], checkedAt, verification, scope: { countrySlug: country, entityId: entity }, note: "Synthetic test evidence" });
  const source = (id: string, kind: GuideSource["kind"], entity: string | null, country: string | null = slug): GuideSource => ({ id, kind, title: "Synthetic source: " + id, publisher: "Synthetic test publisher", url: `https://evidence.example.test/${id}`, scope: { countrySlug: country, entityId: entity }, publishedAt: "2026-10-01", publicationDateStatus: "verified", checkedAt, verification: "checked", access: "retrieved", note: "Test fixture only" });
  const registry: GuideRegistry = {
    people: [
      { id: "fixture-author", name: "Test author (fixture)", profileUrl: "/about", roles: ["author"] },
      { id: "fixture-editor", name: "Test editor (fixture)", profileUrl: "/about", roles: ["editor"] },
      { id: "fixture-lawyer", name: "Test legal reviewer (fixture)", profileUrl: "/about", roles: ["legal_reviewer"] },
    ],
    sources: [source("law", "regulator", null), source("entity", "regulator", entityId, null), source("eligibility", "broker", entityId), source("permissions", "regulator", entityId), source("editorial", "editorial", null), source("affiliate", "affiliate", entityId)],
    entities: [{ id: entityId, brokerSlug: "pepperstone", legalName: "Synthetic Fixture Entity", jurisdiction: "Fixture Jurisdiction", regulator: "Fixture Regulator", licence: "TEST-ONLY-001", evidence: claim("matched", "entity", "regulator_confirmed", entityId, null) }],
    approvals: [
      { id: "legal-approval", countrySlug: slug, kind: "legal", status: "approved", approvedBy: "fixture-lawyer", approvedAt: checkedAt, reference: "test:legal-review", sourceIds: ["law"], legalStatus: "permitted", approvedEntityIds: [entityId] },
      { id: "editorial-approval", countrySlug: slug, kind: "editorial", status: "approved", approvedBy: "fixture-editor", approvedAt: checkedAt, reference: "test:editorial-review", commercialLinksAllowed: true, sourceIds: ["law", "editorial"] },
      { id: "comparison-approval", countrySlug: slug, kind: "comparison", status: "approved", approvedBy: "fixture-editor", approvedAt: checkedAt, reference: "test:comparison-review", sourceIds: ["law", "editorial"] },
    ],
  };
  const country: CountryGuide = {
    ...structuredClone(sriLankaGuide), name: "Example Country", slug, locale: "en-GB",
    title: "Forex Brokers in Example Country: Rules and Evidence",
    description: "Synthetic informational guide used only in automated tests.", audience: "Test audience", directAnswer: "Synthetic test country, not real financial guidance.",
    legalStatus: "permitted", legalReviewedAt: checkedAt, legalReviewReference: "legal-approval",
    legalSummary: claim("Permitted in this synthetic test scope", "law", "regulator_confirmed", null), legalSources: ["law"],
    humanApprovalReference: "editorial-approval", publicationStatus: "approved", publishedAt: "2026-11-02", updatedAt: "2026-11-02", commercialLinksAllowed: true,
    authorReference: "fixture-author", reviewerReference: "fixture-lawyer", questions: [], sections: [], faqs: [],
    comparison: { mode: "educational", purpose: "An unranked synthetic comparison to test the reusable component", approvalReference: "comparison-approval" },
    sourceIds: registry.sources.filter(item => item.kind !== "affiliate").map(item => item.id),
    brokerEntityMappings: [{
      brokerSlug: "pepperstone", entityId,
      residentEligibility: claim("accepted", "eligibility", "broker_stated"), localAuthorization: claim("authorized", "permissions", "regulator_confirmed"),
      tradingPermission: claim("permitted", "permissions", "regulator_confirmed"), fundingPermission: claim("permitted", "permissions", "regulator_confirmed"),
      platforms: { ...claim<string>(null, "eligibility", "unverified"), checkedAt: null },
      fees: { ...claim<string>(null, "eligibility", "unverified"), checkedAt: null },
      paymentMethods: { ...claim<string>(null, "eligibility", "unverified"), checkedAt: null },
      strengths: [], limitations: [], suitability: { ...claim<string>(null, "eligibility", "unverified"), checkedAt: null }, geoApprovalReference: "geo-approval",
    }],
  };
  const affiliates: AffiliateRegistry = {
    agreements: [{ id: "agreement", brokerSlug: "pepperstone", entityId, status: "active", startsAt: checkedAt, expiresAt: "2027-11-01", trackingUrl: "https://tracking.example.test/pepperstone?campaign=fixture", approvedHosts: ["tracking.example.test"], sourceIds: ["affiliate"], checkedAt }],
    geoApprovals: [{ id: "geo-approval", agreementId: "agreement", brokerSlug: "pepperstone", entityId, countrySlug: slug, status: "approved", approvedAt: checkedAt, approvalReference: "test:signed-geo-approval", sourceIds: ["affiliate"], checkedAt }],
  };
  return { country, registry, affiliates, mapping: country.brokerEntityMappings[0] };
}
