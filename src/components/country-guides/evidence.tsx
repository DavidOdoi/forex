import type { Claim, GuideRegistry } from "@/lib/country-guides/types";
import { claimVerified, httpsUrl, validDate, verificationLabels } from "@/lib/country-guides/evidence";

export function EvidenceCitations({ ids, registry, compact = false }: { ids: string[]; registry: GuideRegistry; compact?: boolean }) {
  return <span className="cg-citations">{ids.map(id => {
    const source = registry.sources.find(source => source.id === id);
    return source && source.kind !== "affiliate" && httpsUrl(source.url) ? <a key={id} href={`#source-${id}`} aria-label={`Source: ${source.title}`}>{compact ? `[${registry.sources.indexOf(source) + 1}]` : `Reference ${registry.sources.indexOf(source) + 1}`}</a> : null;
  })}</span>;
}
export function EvidenceClaim({ claim, registry, asOf, countrySlug, entityId, narrative = false, compact = false }: { claim: Claim<unknown>; registry: GuideRegistry; asOf: string; countrySlug: string; entityId: string | null; narrative?: boolean; compact?: boolean }) {
  const scopeMatches = claim.scope.countrySlug === countrySlug && claim.scope.entityId === entityId;
  const verified = claimVerified(claim, countrySlug, entityId, registry, asOf);
  const display = scopeMatches && (verified || narrative);
  const reported = claim.sourceIds.some(id => {
    const source = registry.sources.find(source => source.id === id);
    return source?.scope.countrySlug === countrySlug && source.scope.entityId === entityId && source.reportedAccess?.outcome === "accessed" && validDate(source.reportedAccess.date) && source.reportedAccess.date <= asOf;
  });
  const quotationSource = registry.sources.find(source => source.id === claim.reportedQuote?.sourceId);
  const quotation = narrative && display && claim.reportedQuote && claim.sourceIds.includes(claim.reportedQuote.sourceId) && quotationSource?.scope.countrySlug === countrySlug && quotationSource.scope.entityId === entityId && quotationSource.reportedAccess?.outcome === "accessed" && validDate(quotationSource.reportedAccess.date) && quotationSource.reportedAccess.date <= asOf ? claim.reportedQuote : null;
  return <div className="cg-evidence" data-verification={verified ? claim.verification : "unverified"}>
    <p>{display && claim.value !== null ? String(claim.value).replace(/_/g, " ") : "Unknown — not verified"}</p>
    <div className="cg-evidence-meta"><span>{verified ? verificationLabels[claim.verification] : compact ? !display ? "Unverified" : reported && narrative ? "Reported research" : narrative && claim.sourceIds.length ? "Source check pending" : "Research note" : reported && narrative ? "Dossier-reported · independent check pending" : narrative && claim.sourceIds.length ? "Supplied reference · not independently verified" : "Research status · not independently verified"}</span><EvidenceCitations ids={scopeMatches ? claim.sourceIds : []} registry={registry} compact={compact} /></div>
    {quotation && <figure className="cg-reported-quote"><blockquote>{quotation.text}</blockquote><figcaption>{quotation.locator}. Quotation supplied by the dossier; wording not independently checked. <EvidenceCitations ids={[quotation.sourceId]} registry={registry} /></figcaption></figure>}
  </div>;
}
