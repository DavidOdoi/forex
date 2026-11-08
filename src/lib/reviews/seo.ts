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
  const retail = !review.providerType || review.providerType === "retail";
  const scope = review.jurisdiction && review.jurisdiction !== "Global" ? ` — ${review.jurisdiction}` : "";
  const fullTitle = `${reviewHeading(review)}${scope}`;
  const year = review.sources.map(source => source.checkedAt).sort().at(-1)?.slice(0, 4);
  const shortTitle = `${review.broker.name} ${retail ? `Review${year ? ` ${year}` : ""}: Fees & Safety` : "Research Profile: Access & Safety"}${scope}`;
  const titleCore = fullTitle.length <= 70 ? fullTitle : shortTitle;
  const title = titleCore.length + " | Devin Forex".length <= 70 ? `${titleCore} | Devin Forex` : titleCore;
  let description = !retail
    ? `${review.broker.name} research profile: service access, pricing, entities and settlement checks. Directory classification is unverified; editorial review pending.`
    : review.broker.slug === "exness" && review.jurisdiction === "Global"
    ? `Exness review: compare five accounts, fees, minimum deposits, regulation and withdrawal rules. Use the cost calculator. ${published ? "See linked sources." : "Source-based draft."}`
    : `${review.broker.name} review${review.jurisdiction && review.jurisdiction !== "Global" ? ` for ${review.jurisdiction}` : ""}: account costs, regulation, funding and linked sources. ${published ? "Compare the documented terms." : "Research draft; unverified terms are identified."}`;
  if (description.length > 160) description = `${review.broker.name} ${retail ? "review" : "research profile"}${scope}: ${retail ? "fees, legal entities and funding" : "access, pricing and settlement"}. ${published ? "Read the sourced findings." : "Draft; outstanding checks are shown."}`;
  const url = reviewUrl(review);
  const image = reviewPlatformImage(review);
  const images = image ? [{ url: new URL(image.src, siteOrigin).href, width: image.width, height: image.height, alt: image.alt }] : undefined;
  return {
    title: { absolute: title }, description, alternates: { canonical: url },
    robots: { index: published && deploymentIndexable, follow: published && deploymentIndexable },
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
  const faqs = flowFaqs(review).filter(faq => faq.answer && (faq.evidence === "research-status" || verifiedSources(faq.sourceIds, review)));
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
