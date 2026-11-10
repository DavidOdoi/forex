import type { MetadataRoute } from "next";
import { publicPaths, siteOrigin, indexable } from "@/lib/site";
import { publishedReviews } from "@/lib/reviews/visibility";
import { reviewSitemapEntries } from "@/lib/reviews/seo";
import { insightArticles } from "@/lib/insights/catalog";
import { insightUrl, insightsIndexable } from "@/lib/insights/seo";
import { calculators, toolPath } from "@/lib/calculators/catalog";
import { calculatorsIndexable } from "@/lib/calculators/seo";
import { hubPaths, editorialDate } from "@/lib/metals/content";
import { metalsIndexable } from "@/lib/metals/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  if (indexable) {
    const reviews = publishedReviews();
    const published = reviewSitemapEntries(reviews);
    entries.push(...publicPaths.filter(path => path !== "/reviews" || published.length > 0).map(path => ({ url: new URL(path, siteOrigin).href })), ...published);
  }
  if (insightsIndexable) {
    entries.push({ url: new URL("/insights", siteOrigin).href }, ...insightArticles.map(article => ({ url: insightUrl(article.slug), lastModified: article.updatedAt })));
  }
  if (calculatorsIndexable) {
    entries.push(...["/tools", ...calculators.map(toolPath)].map(path => ({ url: new URL(path, siteOrigin).href })));
  }
  if (metalsIndexable) entries.push(...hubPaths.map(path => ({ url: siteOrigin + path, lastModified: editorialDate })));
  return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}
