import { NextRequest, NextResponse } from "next/server";
import { getReview } from "@/lib/reviews/catalog";
import { isReviewPublished } from "@/lib/reviews/publication";
import { publishedReviews } from "@/lib/reviews/visibility";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname.replace(/\/$/, "");
  if (path === "/templates/exness-review.html") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  if (path === "/reviews") {
    if (!publishedReviews().length) response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }
  const match = path.match(/^\/reviews\/([^/]+)(\/data)?$/);
  if (match) {
    const result = match[1] === "template" ? null : getReview(match[1], request.nextUrl.searchParams.get("country") || undefined);
    if (match[2] || !result || !isReviewPublished(result.review)) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
export const config = { matcher: ["/reviews/:path*", "/templates/exness-review.html"] };
