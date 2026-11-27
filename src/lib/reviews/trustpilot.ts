import snapshots from "@/data/trustpilot-snapshots.json";
import type { BrokerReview } from "./types";

// Dated public profile observations, not a live feed or DEVIN FOREX review score.
// A profile's hidden/internal score is never a substitute for a withheld public score.
export function applyTrustpilotSnapshot(review: BrokerReview) {
  const snapshot = snapshots.find(item => item.slug === review.broker.slug);
  if (!snapshot || review.providerType !== "retail") return;
  const previous = review.customerReviews;
  const regionalProfiles = snapshot.regionalProfiles;
  review.customerReviews = {
    publisher: "Trustpilot", url: snapshot.url, rating: snapshot.rating, reviewCount: snapshot.reviewCount,
    checkedAt: snapshot.checkedAt, profileName: snapshot.profileName, profileDomain: snapshot.profileDomain,
    retrievedAt: snapshot.retrievedAt, evidenceOrigin: "direct-profile-check", ratingStatus: snapshot.rating === null ? "unavailable" : "displayed",
    researchNote: "Checked directly on Trustpilot. This is a dated snapshot, not our editorial score or a live feed. Profile feedback can span different entities and products.",
    ...(snapshot.notice ? { notice: snapshot.notice } : {}),
    ...(regionalProfiles.length ? { regionalProfiles } : {}),
    ...(previous?.rating !== null && previous?.rating !== undefined ? { previousSnapshot: { rating: previous.rating, reviewCount: previous.reviewCount, checkedAt: previous.checkedAt } } : {}),
  };
}
