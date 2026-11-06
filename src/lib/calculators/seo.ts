import type { Metadata } from "next";
import { siteOrigin } from "@/lib/site";
import { type CalculatorDefinition, toolPath } from "./catalog";

// Publication is explicitly authorised on the confirmed origin. Draft broker
// review guards remain separate; preview deployments stay out of search.
export const calculatorsIndexable = process.env.VERCEL_ENV !== "preview";
export function calculatorMetadata(tool: CalculatorDefinition): Metadata {
  const url = new URL(toolPath(tool), siteOrigin).href;
  return {
    title: { absolute: tool.title }, description: tool.description,
    alternates: { canonical: url }, robots: { index: calculatorsIndexable, follow: true },
    openGraph: { title: tool.title, description: tool.description, type: "website", url, siteName: "Devin Forex" },
    twitter: { card: "summary", title: tool.title, description: tool.description },
  };
}
export function calculatorSchema(tool: CalculatorDefinition) {
  const url = new URL(toolPath(tool), siteOrigin).href;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "WebApplication", "@id": `${url}#calculator`, name: tool.heading, description: tool.description, url,
      applicationCategory: "FinanceApplication", operatingSystem: "Any", browserRequirements: "JavaScript is required to update calculations.",
      isAccessibleForFree: true, inLanguage: "en", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: "Devin Forex", url: siteOrigin },
    },
    { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: "Trading tools", item: `${siteOrigin}/tools` },
      { "@type": "ListItem", position: 3, name: tool.heading, item: url },
    ] },
    { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: tool.faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] };
}
