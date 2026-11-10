import type { Metadata, MetadataRoute } from "next";
import { indexable, siteOrigin } from "../site";
import { countryGuides, countryRegistry } from "./catalog";
import { guideApproved } from "./publication";
import type { CountryGuide, GuideRegistry } from "./types";

export const countryGuidePath = (slug: string) => `/forex-brokers/${slug}`;
export const evaluationDate = () => new Date().toISOString().slice(0, 10);
export function countryGuideMetadata(country: CountryGuide, registry: GuideRegistry, asOf: string): Metadata {
  const title = `Forex Brokers in ${country.name}: Rules & Risks | Devin Forex`;
  const url = siteOrigin + countryGuidePath(country.slug);
  return {
    title: { absolute: title }, description: country.description, alternates: { canonical: url },
    robots: { index: indexable && guideApproved(country, registry, asOf), follow: true },
    openGraph: { type: "website", title, description: country.description, url, siteName: "Devin Forex" },
    twitter: { card: "summary", title, description: country.description },
  };
}
export function countryGuideStructuredData(country: CountryGuide, registry: GuideRegistry, asOf: string) {
  const url = siteOrigin + countryGuidePath(country.slug);
  const approved = guideApproved(country, registry, asOf);
  const author = registry.people.find(person => person.id === country.authorReference && person.roles.includes("author"));
  return { "@context": "https://schema.org", "@graph": [
    {
      "@type": approved && author ? "Article" : "WebPage", "@id": url + "#guide", url,
      name: country.title, headline: country.title, description: country.description, inLanguage: country.locale,
      creativeWorkStatus: approved ? "Approved informational guide" : "Research draft — legal and editorial review pending",
      publisher: { "@type": "Organization", name: "Devin Forex", url: siteOrigin },
      ...(approved && author ? { author: { "@type": "Person", name: author.name, url: new URL(author.profileUrl, siteOrigin).href }, datePublished: country.publishedAt, dateModified: country.updatedAt ?? country.publishedAt } : {}),
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin + "/" },
      { "@type": "ListItem", position: 2, name: "Forex Brokers by Country", item: siteOrigin + "/forex-brokers" },
      { "@type": "ListItem", position: 3, name: country.name, item: url },
    ] },
  ] };
}
export function countryGuideSitemapEntries(asOf: string, guides = countryGuides, registry = countryRegistry): MetadataRoute.Sitemap {
  if (!indexable) return [];
  const approved = guides.filter(country => guideApproved(country, registry, asOf));
  return approved.length ? [{ url: siteOrigin + "/forex-brokers" }, ...approved.map(country => ({ url: siteOrigin + countryGuidePath(country.slug), lastModified: country.updatedAt ?? country.publishedAt! }))] : [];
}
