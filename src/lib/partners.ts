// Public tracking link supplied by the site owner on 27 November 2026.
// This placement does not establish country eligibility or editorial approval.
export const exnessPartnerUrl = "https://one.toexness.com/a/5fvl1ylh6f";

export function reviewPartnerDestination(brokerSlug: string, jurisdiction: string | null, officialUrl: string | null): string | null {
  if (brokerSlug !== "exness" || jurisdiction !== "Global" || !officialUrl) return null;
  try {
    const source = new URL(officialUrl);
    return source.protocol === "https:" && !source.username && !source.password && !source.port && source.hostname === "my.exness.com" && source.pathname === "/accounts/sign-up"
      ? exnessPartnerUrl : null;
  } catch { return null; }
}
