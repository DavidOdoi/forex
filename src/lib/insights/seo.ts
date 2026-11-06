import type { Metadata } from "next";
import { siteOrigin } from "@/lib/site";
import { davidOdoi } from "@/lib/authors";
import { articleWordCount, featuredImage, type InsightArticle } from "./catalog";

// The user has explicitly authorised these guides for publication on the
// confirmed production origin. Broker-review publication guards are separate.
export const insightsIndexable = process.env.VERCEL_ENV !== "preview";
export function insightUrl(slug: string) {
  return new URL(`/insights/${slug}`, siteOrigin).href;
}
export function insightTitleTag(article: InsightArticle) {
  if (article.seoTitle) return article.seoTitle;
  const branded = `${article.title} | Devin Forex`;
  return branded.length <= 65 ? branded : article.title;
}
export function insightMetadata(article: InsightArticle): Metadata {
  const image = featuredImage(article);
  const images = image ? [{ url: new URL(image.src, siteOrigin).href, width: image.width, height: image.height, alt: image.alt }] : [];
  return {
    title: { absolute: insightTitleTag(article) },
    description: article.description,
    alternates: { canonical: insightUrl(article.slug) },
    authors: [{ name: davidOdoi.name, url: new URL(davidOdoi.profileUrl, siteOrigin).href }],
    robots: { index: insightsIndexable, follow: true },
    openGraph: {
      type: "article", title: article.title, description: article.description,
      url: insightUrl(article.slug), siteName: "Devin Forex", images,
      publishedTime: article.publishedAt, modifiedTime: article.updatedAt,
      authors: [new URL(davidOdoi.profileUrl, siteOrigin).href],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images },
  };
}
export function insightStructuredData(article: InsightArticle) {
  const url = insightUrl(article.slug);
  const image = featuredImage(article);
  const answer = article.blocks.find(block => block.type === "quick-answer");
  const graph: object[] = [{
    "@type": "Article", "@id": `${url}#article`, headline: article.title,
    description: article.description, url, mainEntityOfPage: url, inLanguage: "en",
    wordCount: articleWordCount(article),
    ...(answer?.type === "quick-answer" ? { abstract: answer.answer } : {}),
    datePublished: article.publishedAt, dateModified: article.updatedAt,
    author: { "@type": "Person", name: davidOdoi.name, url: new URL(davidOdoi.profileUrl, siteOrigin).href },
    publisher: { "@type": "Organization", "@id": `${siteOrigin}/#organization`, name: "Devin Forex", url: siteOrigin },
    ...(image ? { image: [new URL(image.src, siteOrigin).href] } : {}),
  }, {
    "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${siteOrigin}/insights` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  }];
  if (article.faqs.length) graph.push({
    "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: article.faqs.map(faq => ({
      "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  });
  return { "@context": "https://schema.org", "@graph": graph };
}
