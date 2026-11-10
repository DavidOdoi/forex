// The user confirmed this production origin and added it to Search Console.
// SITE_URL can override it for a future custom-domain migration.
const configuredUrl = process.env.SITE_URL?.trim() || "https://devinforex-five.vercel.app";
if (
  configuredUrl &&
  (new URL(configuredUrl).protocol !== "https:" ||
    new URL(configuredUrl).pathname !== "/")
)
  throw new Error("SITE_URL must be an HTTPS origin without a path");
export const siteUrl = new URL(configuredUrl).origin;
export const siteOrigin = siteUrl;
// Only ready canonical pages belong in the sitemap. The comparison preview,
// illustrative finder, author placeholder and review drafts keep noindex.
export const publicPaths = [
  "/",
  "/reviews",
  "/tools",
  "/tools/forex-market-hours",
  "/tools/forex-multi-target-calculator",
  "/insights",
  "/about",
  "/best-prop-firm-forex-eas",
  "/prop-firm-consistency-calculator",
];
export function deploymentAllowsIndexing(environment: string | undefined): boolean {
  return environment !== "preview" && environment !== "development";
}
export const indexable = deploymentAllowsIndexing(process.env.VERCEL_ENV);
export function canonical(path: string) {
  return { canonical: new URL(path, siteOrigin).href };
}
