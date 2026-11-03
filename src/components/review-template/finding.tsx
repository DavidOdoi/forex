import type { BrokerReview, ReviewField } from "@/lib/reviews/types";
import { fieldValue } from "@/lib/reviews/template";

export function Finding({ field, review }: { field: ReviewField; review: BrokerReview }) {
  const value = fieldValue(field, review);
  const supported = field.status === "verified" && value === field.value;
  return (
    <>
      {value}
      {supported && <sup className="review-citations">{field.sourceIds.map(id => (
        <a key={id} href={`#source-${id}`} aria-label={`Source: ${review.sources.find(s => s.id === id)?.title}`}>
          [{review.sources.findIndex(s => s.id === id) + 1}]
        </a>
      ))}</sup>}
    </>
  );
}
