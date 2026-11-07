import type { Metadata } from "next";
import { siteOrigin } from "@/lib/site";
import { editorialDate, hubs, type HubKind } from "./content";
export const metalsIndexable = process.env.VERCEL_ENV !== "preview";
export function hubMetadata(kind: HubKind): Metadata {
  const hub = hubs[kind], url = siteOrigin + hub.path;
  const images = [{ url: siteOrigin + hub.image, width: 1200, height: 630, alt: hub.imageAlt }];
  return {
    title: { absolute: hub.title }, description: hub.description,
    alternates: { canonical: url }, robots: { index: metalsIndexable, follow: true },
    authors: [{ name: "David Odoi", url: siteOrigin + "/authors/david-odoi" }],
    openGraph: { type: "website", url, title: hub.title, description: hub.description, siteName: "Devin Forex", images },
    twitter: { card: "summary_large_image", title: hub.title, description: hub.description, images },
  };
}
export function hubSchema(kind: HubKind) {
  const hub = hubs[kind], url = siteOrigin + hub.path;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${siteOrigin}/#organization`, name: "Devin Forex", url: siteOrigin },
    { "@type": "Person", "@id": `${siteOrigin}/authors/david-odoi#person`, name: "David Odoi", url: `${siteOrigin}/authors/david-odoi` },
    { "@type": "WebPage", "@id": url + "#webpage", url, name: hub.title, description: hub.description, inLanguage: "en", dateModified: editorialDate,
      author: { "@id": `${siteOrigin}/authors/david-odoi#person` }, publisher: { "@id": `${siteOrigin}/#organization` },
      primaryImageOfPage: { "@type": "ImageObject", url: siteOrigin + hub.image, width: 1200, height: 630 }, breadcrumb: { "@id": url + "#breadcrumb" },
    },
    { "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin + "/" },
      { "@type": "ListItem", position: 2, name: hub.heading, item: url },
    ] },
    { "@type": "FAQPage", "@id": url + "#faq", mainEntity: hub.faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] };
}
