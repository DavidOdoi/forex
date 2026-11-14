// The owner now publishes on this custom domain. Keep canonical, social,
// structured-data and sitemap URLs aligned; SITE_URL remains an explicit override.
const configuredUrl = process.env.SITE_URL?.trim() || "https://www.devinforex.com";
if (
  configuredUrl &&
  (new URL(configuredUrl).protocol !== "https:" ||
    new URL(configuredUrl).pathname !== "/")
)
  throw new Error("SITE_URL must be an HTTPS origin without a path");
export const siteUrl = new URL(configuredUrl).origin;
export const siteOrigin = siteUrl;
// All public canonical content is eligible for production indexing at the
// owner's request. Redirects, duplicate templates and data endpoints are omitted.
export const publicPaths = [
  "/",
  "/reviews",
  "/tools",
  "/tools/forex-market-hours",
  "/insights",
  "/about",
  "/best-brokers",
  "/find-my-broker",
  "/authors/david-odoi",
  "/forex-brokers",
  "/insights/triangle-chart-patterns",
  "/insights/image-credits",
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
