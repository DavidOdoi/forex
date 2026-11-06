import type { MetadataRoute } from "next";
import { indexable, siteOrigin } from "@/lib/site";
import { insightsIndexable } from "@/lib/insights/seo";
import { calculatorsIndexable } from "@/lib/calculators/seo";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Crawlers must be able to read each page's indexing directive.
      allow: "/",
    },
    ...((indexable || insightsIndexable || calculatorsIndexable) ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}),
  };
}
