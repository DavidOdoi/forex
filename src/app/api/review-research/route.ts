import { directoryEntries, getReview } from "@/lib/reviews/catalog";
import { isReviewPublished } from "@/lib/reviews/publication";

export function GET() {
  const entries = directoryEntries().filter(entry => !isReviewPublished(getReview(entry.slug)!.review));
  return Response.json({
    entries,
    templates: [
      { label: "View populated template →", href: "/reviews/template" },
      { label: "Preview review template", href: "/reviews/template?blank=1" },
    ],
  }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}
