import type { MetadataRoute } from "next";
import { publicPaths, siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl;
  return url
    ? publicPaths.map((path) => ({ url: new URL(path, url).href }))
    : [];
}
