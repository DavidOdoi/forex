import type { MetadataRoute } from "next";
import { publicPaths, site } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  // Do not emit fake domain URLs while the public domain is unconfirmed.
  return site.domain
    ? publicPaths.map((path) => ({ url: new URL(path, site.domain!).href }))
    : [];
}
