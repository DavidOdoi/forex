import type { BrokerReview } from "./types";
import { isValidSource } from "./template";

// Product imagery belongs only to the broker and scope it actually depicts.
// The provider's original WebP is retained without retouching or cropping.
export function reviewPlatformImage(review: BrokerReview) {
  if (review.broker.slug !== "exness" || review.jurisdiction !== "Global") return undefined;
  const source = review.sources.find(source => source.id === "global-platforms" && isValidSource(source));
  if (source?.url !== "https://www.exness.com/trading-platforms/") return undefined;
  return {
    src: "/images/reviews/exness-terminal-preview.webp",
    width: 992,
    height: 660,
    alt: "Exness Terminal preview showing a trading chart and order-entry panel on a laptop",
    sourceUrl: source.url,
  };
}
