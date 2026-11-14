import type { MetadataRoute } from "next";
import { publicPaths, siteOrigin, indexable } from "@/lib/site";
import { visibleReviews } from "@/lib/reviews/visibility";
import { reviewSitemapEntries } from "@/lib/reviews/seo";
import { insightArticles } from "@/lib/insights/catalog";
import { insightUrl, insightsIndexable } from "@/lib/insights/seo";
import { calculators, toolPath } from "@/lib/calculators/catalog";
import { calculatorsIndexable } from "@/lib/calculators/seo";
import { hubPaths, editorialDate } from "@/lib/metals/content";
import { metalsIndexable } from "@/lib/metals/seo";
import { countryGuideSitemapEntries } from "@/lib/country-guides/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  if (indexable) {
    entries.push(...publicPaths.map(path => ({ url: new URL(path, siteOrigin).href })), ...reviewSitemapEntries(visibleReviews()));
  }
  if (insightsIndexable) {
    entries.push({ url: new URL("/insights", siteOrigin).href }, ...insightArticles.map(article => ({ url: insightUrl(article.slug), lastModified: article.updatedAt })));
  }
  if (calculatorsIndexable) {
    entries.push(...["/tools", ...calculators.map(toolPath)].map(path => ({ url: new URL(path, siteOrigin).href })));
  }
  if (metalsIndexable) entries.push(...hubPaths.map(path => ({ url: siteOrigin + path, lastModified: editorialDate })));
  entries.push(...countryGuideSitemapEntries());
  return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}
