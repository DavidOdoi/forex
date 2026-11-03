import type { Metadata } from "next";
import type { BrokerReview } from "./types";
import { indexable, siteUrl } from "../site";
import { reviewDigest } from "./digest";
import { validDate } from "./template";

// The user confirmed this production origin. SITE_URL can override it when the
// project moves; noindex remains in force for every unfinished review.
const origin = siteUrl ?? "https://devinforex-five.vercel.app";
export function reviewUrl(review: BrokerReview): string {
  const url = new URL(`/reviews/${review.broker.slug}`, origin);
  if (review.jurisdiction) url.searchParams.set("country", review.jurisdiction);
  return url.href;
}
export function reviewMetadata(review: BrokerReview): Metadata {
  const title = `${review.broker.name} Review${review.jurisdiction ? ` — ${review.jurisdiction}` : ""} | Devin Forex`;
  const description = `Explore ${review.broker.name}${review.jurisdiction ? ` in ${review.jurisdiction}` : ""}: documented costs, legal entities, platforms and linked sources. ${review.status === "draft" ? "Research draft; editorial checks pending." : "Read the review."}`;
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
  // Never manufacture review stars, a byline or a publication date for a draft.
  if (review.status === "published" && review.author && review.verifiedAt && validDate(review.verifiedAt)) graph.push({
    "@type": "Article", headline: `${review.broker.name} review`, url,
    description: reviewDigest(review).lead,
    dateModified: review.verifiedAt,
    author: { "@type": "Person", name: review.author.name },
    publisher: { "@type": "Organization", name: "Devin Forex", url: origin },
    mainEntityOfPage: url,
  });
  return { "@context": "https://schema.org", "@graph": graph };
}
