import type { MetadataRoute } from "next";
import { publicPaths, siteOrigin, indexable } from "@/lib/site";
import { getReview, researchEntries, reviewCountries } from "@/lib/reviews/catalog";
import { reviewSitemapEntries } from "@/lib/reviews/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  const reviews = researchEntries.flatMap(entry => reviewCountries(entry.slug).map(country => getReview(entry.slug, country)!.review));
  return [
    ...publicPaths.map(path => ({ url: new URL(path, siteOrigin).href })),
    ...reviewSitemapEntries(reviews),
  ];
}
