import type { Metadata } from "next";
import { indexable, siteOrigin } from "@/lib/site";
import { checkedAt, propPaths } from "./content";
import { comparisonImage } from "./image";
export function propMetadata(path: string, title: string, description: string): Metadata {
  const url = siteOrigin + path;
  const images = path === propPaths.comparison ? [{ url: siteOrigin + comparisonImage.src, width: comparisonImage.width, height: comparisonImage.height, alt: comparisonImage.alt }] : undefined;
  return { title: { absolute: title }, description, alternates: { canonical: url }, robots: { index: indexable, follow: true },
    openGraph: { title, description, url, type: "website", siteName: "Devin Forex", ...(images ? { images } : {}) },
    twitter: { card: "summary", title, description, ...(images ? { images: images.map(image => image.url) } : {}) },
  };
}
export function propSchema(path: string, title: string, description: string, faqs: { question: string; answer: string }[]) {
  const url = siteOrigin + path;
  const calculator = path === propPaths.calculator;
  const parent = calculator ? { name: "Trading tools", path: "/tools" } : { name: "Trading insights", path: "/insights" };
  return { "@context": "https://schema.org", "@graph": [
    { "@type": calculator ? "WebApplication" : "Article", "@id": `${url}#${calculator ? "calculator" : "article"}`, url, name: title, headline: title, description,
      inLanguage: "en", datePublished: checkedAt, dateModified: checkedAt, isAccessibleForFree: true,
      author: { "@type": "Person", name: "David Odoi", url: siteOrigin + "/authors/david-odoi" },
      publisher: { "@type": "Organization", name: "Devin Forex", url: siteOrigin },
      ...(calculator ? { applicationCategory: "FinanceApplication", operatingSystem: "Any", browserRequirements: "JavaScript is required for interactive calculations.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } } : { mainEntityOfPage: url, image: { "@type": "ImageObject", url: siteOrigin + comparisonImage.src, contentUrl: siteOrigin + comparisonImage.src, width: comparisonImage.width, height: comparisonImage.height, caption: comparisonImage.alt, creator: { "@type": "Person", name: comparisonImage.creator }, license: comparisonImage.licenseUrl, creditText: `${comparisonImage.creator} / Wikimedia Commons, ${comparisonImage.license}`, isBasedOn: comparisonImage.sourceUrl } }),
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin + "/" },
      { "@type": "ListItem", position: 2, name: parent.name, item: siteOrigin + parent.path },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ] },
    { "@type": "FAQPage", "@id": url + "#faq", mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] };
}
