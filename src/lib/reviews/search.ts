import { isSelectedReviewSlug } from "./selection";
import type { BrokerReview } from "./types";

// The owner has authorised indexing of all public content. Search visibility
// does not certify factual verification or invent an editorial approval record.
export function isReviewSearchable(review: BrokerReview): boolean {
  return review.status !== "template" && isSelectedReviewSlug(review.broker.slug);
}
