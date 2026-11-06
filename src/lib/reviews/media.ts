import assets from "@/data/reviews/platform-images.json";
import type { BrokerReview } from "./types";
import { isValidSource } from "./template";

export const reviewMediaAssets = assets;

// A product image identifies its actual provider and permitted editorial scope;
// it does not establish account availability or a first-hand platform test.
export function reviewPlatformImage(review: BrokerReview) {
  const asset = assets.find(image => image.slug === review.broker.slug && image.scopes.includes(review.jurisdiction ?? ""));
  if (!asset) return undefined;
  const matched = review.sources.some(source => isValidSource(source) &&
    (!asset.evidenceSourceId || source.id === asset.evidenceSourceId) &&
    new URL(source.url).hostname.replace(/^www\./, "") === asset.publisherHost);
  return matched ? asset : undefined;
}
