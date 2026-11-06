import type { Metadata } from "next";
import type { BrokerReview } from "./types";
import { indexable, siteOrigin } from "../site";
import { verifiedSources } from "./template";
import { flowFaqs } from "./flow";
import { isReviewPublished } from "./publication";
import { reviewPlatformImage } from "./media";

export function reviewHeading(review: BrokerReview): string {
  const year = review.sources.map(source => source.checkedAt).sort().at(-1)?.slice(0, 4);
  if (review.providerType && review.providerType !== "retail") return `${review.broker.name} Research Profile: Services, Access & Safety`;
  if (review.broker.slug === "exness" && review.jurisdiction === "Global") return `Exness Review${year ? ` ${year}` : ""}: Fees, Safety & Account Types`;
  return `${review.broker.name} Review${year ? ` ${year}` : ""}: Fees, Accounts, Withdrawals & Safety`;
}
export function reviewUrl(review: BrokerReview): string {
  const url = new URL(`/reviews/${review.broker.slug}`, siteOrigin);
  if (review.jurisdiction && review.jurisdiction !== "Global") url.searchParams.set("country", review.jurisdiction);
  return url.href;
}
export function reviewMetadata(review: BrokerReview, deploymentIndexable = indexable): Metadata {
  const published = isReviewPublished(review);
  const title = `${reviewHeading(review)}${review.jurisdiction && review.jurisdiction !== "Global" ? ` — ${review.jurisdiction}` : ""} | Devin Forex`;
  const description = review.providerType && review.providerType !== "retail"
    ? `Research ${review.broker.name}: provider access, services and entity checks. Directory classification is unverified; editorial approval pending.`
    : review.broker.slug === "exness" && review.jurisdiction === "Global"
    ? `Exness review: compare five accounts, fees, minimum deposits, regulation and withdrawal rules. Use the cost calculator. ${published ? "See linked sources." : "Source-based draft."}`
    : `Explore ${review.broker.name}${review.jurisdiction && review.jurisdiction !== "Global" ? ` in ${review.jurisdiction}` : " worldwide"}: account costs, legal entities and linked sources. ${published ? "Read the review." : "Editorial approval pending."}`;
  const url = reviewUrl(review);
  const image = reviewPlatformImage(review);
  const images = image ? [{ url: new URL(image.src, siteOrigin).href, width: image.width, height: image.height, alt: image.alt }] : undefined;
  return {
    title: { absolute: title }, description, alternates: { canonical: url },
    robots: { index: published && deploymentIndexable, follow: true },
    openGraph: { title, description, type: "article", url, siteName: "Devin Forex", ...(images ? { images } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(images ? { images } : {}) },
  };
}
export function reviewStructuredData(review: BrokerReview) {
  const url = reviewUrl(review);
  const graph: object[] = [{
    "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: "Broker reviews", item: `${siteOrigin}/reviews` },
      { "@type": "ListItem", position: 3, name: `${review.broker.name}${review.jurisdiction && review.jurisdiction !== "Global" ? ` — ${review.jurisdiction}` : ""}`, item: url },
    ],
  }];
  const faqs = flowFaqs(review).filter(faq => faq.answer && verifiedSources(faq.sourceIds, review));
  if (faqs.length) graph.push({ "@type": "FAQPage", "@id": `${url}#review-faq`, mainEntity: faqs.map(faq => ({
    "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })) });
  if (isReviewPublished(review)) graph.push({
    "@type": "Article", "@id": `${url}#article`, headline: reviewHeading(review), url,
    datePublished: review.publication!.publishedAt, dateModified: review.publication!.updatedAt,
    author: { "@type": "Person", name: review.author!.name, url: new URL(review.author!.profileUrl!, siteOrigin).href },
    publisher: { "@type": "Organization", "@id": `${siteOrigin}/#organization`, name: "Devin Forex", url: siteOrigin },
    mainEntityOfPage: url, inLanguage: "en",
    ...(reviewPlatformImage(review) ? { image: new URL(reviewPlatformImage(review)!.src, siteOrigin).href } : {}),
  });
  // Broker research is not automatically eligible for Product review stars.
  return { "@context": "https://schema.org", "@graph": graph };
}

export function reviewSitemapEntries(reviews: BrokerReview[]) {
  return [...new Map(reviews.filter(isReviewPublished).map(review => [reviewUrl(review), {
    url: reviewUrl(review), lastModified: review.publication!.updatedAt!,
  }])).values()];
}
