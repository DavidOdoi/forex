import type { MetadataRoute } from "next";
import { publicPaths, siteOrigin, indexable } from "@/lib/site";
import { getReview, researchEntries, reviewCountries } from "@/lib/reviews/catalog";
import { reviewSitemapEntries } from "@/lib/reviews/seo";
import { insightArticles } from "@/lib/insights/catalog";
import { insightUrl, insightsIndexable } from "@/lib/insights/seo";
import { calculators, toolPath } from "@/lib/calculators/catalog";
import { calculatorsIndexable } from "@/lib/calculators/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  if (indexable) {
    const reviews = researchEntries.flatMap(entry => reviewCountries(entry.slug).map(country => getReview(entry.slug, country)!.review));
    entries.push(...publicPaths.map(path => ({ url: new URL(path, siteOrigin).href })), ...reviewSitemapEntries(reviews));
  }
  if (insightsIndexable) {
    entries.push({ url: new URL("/insights", siteOrigin).href }, ...insightArticles.map(article => ({ url: insightUrl(article.slug), lastModified: article.updatedAt })));
  }
  if (calculatorsIndexable) {
    entries.push(...["/tools", ...calculators.map(toolPath)].map(path => ({ url: new URL(path, siteOrigin).href })));
  }
  return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}
