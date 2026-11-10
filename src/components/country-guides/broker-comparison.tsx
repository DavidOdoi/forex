import Link from "next/link";
import type { AffiliateRegistry, CountryGuide, GuideRegistry } from "@/lib/country-guides/types";
import { comparisonMappings, verifiedEntity } from "@/lib/country-guides/publication";
import { resolveCountryAffiliateLink } from "@/lib/country-guides/affiliate";
import { countryBrokerMaster } from "@/lib/country-guides/broker-master";
import { dateLabel } from "@/lib/country-guides/evidence";
import { EvidenceClaim, EvidenceCitations } from "./evidence";

export function CountryBrokerComparison({ country, registry, affiliates, asOf }: { country: CountryGuide; registry: GuideRegistry; affiliates: AffiliateRegistry; asOf: string }) {
  const mappings = comparisonMappings(country, registry, asOf);
  if (!mappings.length) return null;
  return <section className="cg-section" id="broker-comparison" aria-labelledby="country-comparison-title"><p className="cg-eyebrow">Unranked research</p><h2 id="country-comparison-title">Documented broker entities</h2><p>{country.comparison.purpose}</p>
    <div className="cg-comparison-scroll" role="region" aria-label={`${country.name} unranked broker evidence comparison`} tabIndex={0}><table><caption>Entity-specific findings, not a “best overall” ranking</caption><thead><tr><th scope="col">Broker / entity</th><th scope="col">Entity regulator</th><th scope="col">Local authorization</th><th scope="col">Resident acceptance</th><th scope="col">Platforms</th><th scope="col">Account-specific fees</th><th scope="col">Payment evidence</th><th scope="col">Entity checked</th></tr></thead><tbody>{mappings.map(mapping => {
      const master = countryBrokerMaster(mapping.brokerSlug)!; const entity = verifiedEntity(mapping, registry, asOf)!;
      return <tr key={`${mapping.brokerSlug}-${mapping.entityId}`}><th scope="row">{master.name}<span className="cg-table-detail">{entity.legalName} · {entity.jurisdiction}</span><EvidenceCitations ids={entity.evidence.sourceIds} registry={registry} /></th><td>{entity.regulator} · {entity.licence}</td><td><EvidenceClaim claim={mapping.localAuthorization} registry={registry} asOf={asOf} countrySlug={country.slug} entityId={mapping.entityId} /></td><td><EvidenceClaim claim={mapping.residentEligibility} registry={registry} asOf={asOf} countrySlug={country.slug} entityId={mapping.entityId} /></td><td><EvidenceClaim claim={mapping.platforms} registry={registry} asOf={asOf} countrySlug={country.slug} entityId={mapping.entityId} /></td><td><EvidenceClaim claim={mapping.fees} registry={registry} asOf={asOf} countrySlug={country.slug} entityId={mapping.entityId} /></td><td><EvidenceClaim claim={mapping.paymentMethods} registry={registry} asOf={asOf} countrySlug={country.slug} entityId={mapping.entityId} /></td><td>{dateLabel(entity.evidence.checkedAt)}</td></tr>;
    })}</tbody></table></div>
    <div className="cg-broker-details">{mappings.map(mapping => {
      const master = countryBrokerMaster(mapping.brokerSlug)!; const entity = verifiedEntity(mapping, registry, asOf)!;
      const commercial = resolveCountryAffiliateLink(country, mapping, registry, affiliates, asOf);
      return <article key={`${mapping.brokerSlug}-${mapping.entityId}`} className="cg-broker-card"><p className="cg-eyebrow">Entity-specific desk research</p><h3>{master.name}</h3><p>{entity.legalName} · {entity.jurisdiction}</p><p>No firsthand test is implied by an entity or broker document.</p><h4>Documented strengths</h4>{mapping.strengths.length ? mapping.strengths.map((claim, i) => <EvidenceClaim key={i} claim={claim} registry={registry} asOf={asOf} countrySlug={country.slug} entityId={mapping.entityId} />) : <p>No strengths assessed.</p>}<h4>Limitations</h4>{mapping.limitations.length ? mapping.limitations.map((claim, i) => <EvidenceClaim key={i} claim={claim} registry={registry} asOf={asOf} countrySlug={country.slug} entityId={mapping.entityId} />) : <p>Limitations require further research; none are assumed absent.</p>}<h4>Suitability evidence</h4><EvidenceClaim claim={mapping.suitability} registry={registry} asOf={asOf} countrySlug={country.slug} entityId={mapping.entityId} />{master.reviewPath && <Link href={master.reviewPath}>Read the {master.name} review — country eligibility remains separate</Link>}{commercial && <div className="cg-commercial"><p>Paid affiliate link: Devin Forex may receive a commission. This is not evidence of legal permission or suitability.</p><a {...commercial}>Visit {master.name} — paid link <span aria-hidden="true">↗</span></a></div>}</article>;
    })}</div>
  </section>;
}
