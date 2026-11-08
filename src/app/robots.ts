import type { MetadataRoute } from "next";
import { indexable, siteOrigin } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Crawlers must be able to read each page's indexing directive.
      allow: "/",
    },
    ...(indexable ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}),
  };
}
