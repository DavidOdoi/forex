import type { Claim, GuideRegistry, GuideSource, HumanApproval, Verification } from "./types";

export const verificationLabels: Record<Verification, string> = {
  unverified: "Not independently verified", desk_verified: "Desk research",
  broker_stated: "Broker-stated · source checked", regulator_confirmed: "Regulator-confirmed",
  firsthand_tested: "Firsthand record available",
};
export function validDate(value: string | null | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value);
}
export function httpsUrl(value: string): URL | null {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url : null; } catch { return null; }
}
export function checkedSource(source: GuideSource | undefined, asOf: string): source is GuideSource & { verification: "checked"; access: "retrieved"; checkedAt: string } {
  return Boolean(source && validDate(asOf) && source.verification === "checked" && source.access === "retrieved" && validDate(source.checkedAt) && source.checkedAt <= asOf && source.title.trim() && source.publisher.trim() && httpsUrl(source.url) && (!source.publishedAt || validDate(source.publishedAt) && source.publishedAt <= source.checkedAt));
}
export function claimVerified(claim: Claim<unknown>, countrySlug: string | null, entityId: string | null, registry: GuideRegistry, asOf: string, allowed: Verification[] = ["desk_verified", "broker_stated", "regulator_confirmed", "firsthand_tested"]): boolean {
  if (claim.value === null || !allowed.includes(claim.verification) || !validDate(claim.checkedAt) || claim.scope.countrySlug !== countrySlug || claim.scope.entityId !== entityId || !claim.sourceIds.length) return false;
  const requiredKind = claim.verification === "regulator_confirmed" ? "regulator" : claim.verification === "broker_stated" ? "broker" : claim.verification === "firsthand_tested" ? "firsthand" : null;
  return claim.sourceIds.every(id => {
    const source = registry.sources.find(source => source.id === id);
    return checkedSource(source, asOf) && source.checkedAt === claim.checkedAt && source.scope.countrySlug === countrySlug && source.scope.entityId === entityId && (!requiredKind || source.kind === requiredKind);
  });
}
export function approvalRecord(reference: string | null, kind: HumanApproval["kind"], countrySlug: string, registry: GuideRegistry, asOf: string): HumanApproval | null {
  const approval = registry.approvals.find(record => record.id === reference);
  const person = registry.people.find(person => person.id === approval?.approvedBy);
  if (!approval || approval.kind !== kind || approval.countrySlug !== countrySlug || approval.status !== "approved" || !approval.reference.trim() || !validDate(approval.approvedAt) || approval.approvedAt > asOf || !person?.name.trim() || !person.roles.includes(kind === "legal" ? "legal_reviewer" : "editor") || !approval.sourceIds.length) return null;
  return approval.sourceIds.every(id => {
    const source = registry.sources.find(source => source.id === id);
    return checkedSource(source, asOf) && source.scope.countrySlug === countrySlug && source.checkedAt! <= approval.approvedAt && (kind !== "legal" || source.kind === "regulator");
  }) ? approval : null;
}
export function dateLabel(value: string | null): string {
  return validDate(value) ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)) : "Not recorded";
}
