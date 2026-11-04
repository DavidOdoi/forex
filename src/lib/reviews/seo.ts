import type { Metadata } from "next";
import type { BrokerReview } from "./types";
import { indexable, siteUrl } from "../site";
import { reviewDigest } from "./digest";
import { validDate, scoreValue, verifiedSources } from "./template";
import { flowFaqs, verdictSentences } from "./flow";

// The user confirmed this production origin. SITE_URL can override it when the
// project moves; noindex remains in force for every unfinished review.
const origin = siteUrl ?? "https://devinforex-five.vercel.app";
export function reviewHeading(review: BrokerReview): string {
  const year = review.sources.map(s => s.checkedAt).sort().at(-1)?.slice(0, 4) ?? new Date().getUTCFullYear();
  return `${review.broker.name} Review ${year}: Fees, Accounts, Withdrawals & Safety`;
}
export function reviewUrl(review: BrokerReview): string {
  const url = new URL(`/reviews/${review.broker.slug}`, origin);
  if (review.jurisdiction && review.jurisdiction !== "Global") url.searchParams.set("country", review.jurisdiction);
  return url.href;
}
export function reviewMetadata(review: BrokerReview): Metadata {
  const title = `${reviewHeading(review)}${review.jurisdiction && review.jurisdiction !== "Global" ? ` — ${review.jurisdiction}` : ""} | Devin Forex`;
  const description = `Explore ${review.broker.name}${review.jurisdiction && review.jurisdiction !== "Global" ? ` in ${review.jurisdiction}` : " worldwide"}: account costs, legal entities, platforms and customer-review links. ${review.status === "draft" ? "Editorial checks pending." : "Read the review."}`;
  const url = reviewUrl(review);
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    robots: { index: review.status === "published" && indexable, follow: true },
    openGraph: { title, description, type: "article", url, siteName: "Devin Forex" },
    twitter: { card: "summary_large_image", title, description },
  };
}
export function reviewStructuredData(review: BrokerReview) {
  const url = reviewUrl(review);
  const graph: object[] = [{
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "Broker reviews", item: `${origin}/reviews` },
      { "@type": "ListItem", position: 3, name: `${review.broker.name}${review.jurisdiction ? ` — ${review.jurisdiction}` : ""}`, item: url },
    ],
  }];
  const faqs = flowFaqs(review).filter(f => f.answer && verifiedSources(f.sourceIds, review));
  if (faqs.length) graph.push({ "@type": "FAQPage", "@id": `${url}#review-faq`, mainEntity: faqs.map(f => ({
    "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer },
  })) });
  // Never manufacture review stars, a byline or a publication date for a draft.
  if (review.status === "published" && review.author && review.verifiedAt && validDate(review.verifiedAt)) graph.push({
    "@type": "Article", headline: `${review.broker.name} review`, url,
    description: reviewDigest(review).lead,
    dateModified: review.verifiedAt,
    author: { "@type": "Person", name: review.author.name },
    publisher: { "@type": "Organization", name: "Devin Forex", url: origin },
    mainEntityOfPage: url,
  });
  const rating = scoreValue(review.overallScore, review);
  if (review.status === "published" && rating && review.author && review.verifiedAt && validDate(review.verifiedAt)) graph.push({
    "@type": "Product", "@id": `${url}#broker-accounts`, name: `${review.broker.name} accounts${review.jurisdiction ? ` — ${review.jurisdiction}` : ""}`,
    description: reviewDigest(review).lead,
    review: { "@type": "Review", author: { "@type": "Person", name: review.author.name }, dateModified: review.verifiedAt,
      reviewBody: verdictSentences(review).join(" "), reviewRating: { "@type": "Rating", ratingValue: review.overallScore!.value, bestRating: 5, worstRating: 0 } },
  });
  return { "@context": "https://schema.org", "@graph": graph };
}
