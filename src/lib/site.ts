// A public origin is optional until the production domain is confirmed.
const configuredUrl = process.env.SITE_URL;
if (
  configuredUrl &&
  (new URL(configuredUrl).protocol !== "https:" ||
    new URL(configuredUrl).pathname !== "/")
)
  throw new Error("SITE_URL must be an HTTPS origin without a path");
export const siteUrl = configuredUrl ? new URL(configuredUrl).origin : null;
// Confirmed by the user; deployment configuration can override this origin.
export const siteOrigin = siteUrl ?? "https://devinforex-five.vercel.app";
export const publicPaths = [
  "/",
  "/best-brokers",
  "/reviews",
  "/tools",
  "/insights",
  "/about",
  "/find-my-broker",
];
export const indexable =
  Boolean(siteUrl) && process.env.VERCEL_ENV !== "preview";
export function canonical(path: string) {
  return { canonical: new URL(path, siteOrigin).href };
}
