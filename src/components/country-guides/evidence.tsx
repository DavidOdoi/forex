import type { Claim, GuideRegistry } from "@/lib/country-guides/types";
import { claimVerified, httpsUrl, verificationLabels } from "@/lib/country-guides/evidence";

export function EvidenceCitations({ ids, registry }: { ids: string[]; registry: GuideRegistry }) {
  return <span className="cg-citations">{ids.map(id => {
    const source = registry.sources.find(source => source.id === id);
    return source && source.kind !== "affiliate" && httpsUrl(source.url) ? <a key={id} href={`#source-${id}`} aria-label={`Source: ${source.title}`}>Reference {registry.sources.indexOf(source) + 1}</a> : null;
  })}</span>;
}
export function EvidenceClaim({ claim, registry, asOf, countrySlug, entityId, narrative = false }: { claim: Claim<unknown>; registry: GuideRegistry; asOf: string; countrySlug: string; entityId: string | null; narrative?: boolean }) {
  const scopeMatches = claim.scope.countrySlug === countrySlug && claim.scope.entityId === entityId;
  const verified = claimVerified(claim, countrySlug, entityId, registry, asOf);
  const display = scopeMatches && (verified || narrative);
  return <div className="cg-evidence" data-verification={verified ? claim.verification : "unverified"}>
    <p>{display && claim.value !== null ? String(claim.value).replace(/_/g, " ") : "Unknown — not verified"}</p>
    <div className="cg-evidence-meta"><span>{verified ? verificationLabels[claim.verification] : narrative && claim.sourceIds.length ? "Supplied reference · not independently verified" : "Research status · not independently verified"}</span><EvidenceCitations ids={scopeMatches ? claim.sourceIds : []} registry={registry} /></div>
  </div>;
}
