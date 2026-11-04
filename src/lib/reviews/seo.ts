import type { Metadata } from "next";
import type { BrokerReview } from "./types";
import { indexable, siteOrigin } from "../site";
import { verifiedSources } from "./template";
import { flowFaqs } from "./flow";
import { isReviewPublished } from "./publication";

export function reviewHeading(review: BrokerReview): string {
  const year = review.sources.map(source => source.checkedAt).sort().at(-1)?.slice(0, 4);
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
  const description = review.broker.slug === "exness" && review.jurisdiction === "Global"
    ? `Compare Exness accounts, first deposits, commissions, overnight charges and withdrawal conditions. Source-based research${published ? "." : "; editorial approval pending."}`
    : `Explore ${review.broker.name}${review.jurisdiction && review.jurisdiction !== "Global" ? ` in ${review.jurisdiction}` : " worldwide"}: account costs, legal entities and linked sources. ${published ? "Read the review." : "Editorial approval pending."}`;
  const url = reviewUrl(review);
  return {
    title: { absolute: title }, description, alternates: { canonical: url },
    robots: { index: published && deploymentIndexable, follow: true },
    openGraph: { title, description, type: "article", url, siteName: "Devin Forex" },
    twitter: { card: "summary_large_image", title, description },
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
  });
  // Broker research is not automatically eligible for Product review stars.
  return { "@context": "https://schema.org", "@graph": graph };
}

export function reviewSitemapEntries(reviews: BrokerReview[]) {
  return [...new Map(reviews.filter(isReviewPublished).map(review => [reviewUrl(review), {
    url: reviewUrl(review), lastModified: review.publication!.updatedAt!,
  }])).values()];
}
