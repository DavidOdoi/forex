import { getReview } from "@/lib/reviews/catalog";
import { isPublishedReviewHref } from "@/lib/reviews/visibility";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = new URL(request.url).searchParams.get("country") || undefined;
  const result = getReview(slug, country);
  const headers = { "Content-Type": "application/json; charset=utf-8", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff" };
  if (!result) return new Response(JSON.stringify({ error: "Review or country profile not found" }), { status: 404, headers });
  const review = { ...result.review, relatedResearch: result.review.relatedResearch?.filter(entry => isPublishedReviewHref(entry.href)) };
  return new Response(JSON.stringify({ review, collectedResearch: result.research, availableCountries: result.countries }, null, 2), {
    headers: { ...headers, "Content-Disposition": `attachment; filename="${slug}-research.json"` },
  });
}
