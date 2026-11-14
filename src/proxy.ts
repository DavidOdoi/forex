import { NextRequest, NextResponse } from "next/server";
import { getReview, researchEntries } from "@/lib/reviews/catalog";
import { isSelectedReviewSlug } from "@/lib/reviews/selection";
import { isReviewSearchable } from "@/lib/reviews/search";
import { indexable } from "@/lib/site";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname.replace(/\/$/, "");
  if (path === "/templates/exness-review.html") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  if (path === "/reviews") {
    if (!indexable) response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }
  const match = path.match(/^\/reviews\/([^/]+)(\/data)?$/);
  if (match) {
    if (match[1] !== "template" && !isSelectedReviewSlug(match[1]) && researchEntries.some(entry => entry.slug === match[1])) {
      const headers = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };
      if (match[2]) return NextResponse.json({ error: "This broker review is no longer available." }, { status: 410, headers });
      return new NextResponse('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Review no longer available | Devin Forex</title></head><body style="font-family:system-ui,sans-serif;max-width:640px;margin:12vh auto;padding:24px;color:#111;background:white;line-height:1.7"><h1>Review no longer available</h1><p>Our broker review library now covers Exness, XM, IC Markets and Pepperstone.</p><a href="/reviews">Browse our current broker reviews</a></body></html>', { status: 410, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } });
    }
    const result = match[1] === "template" ? null : getReview(match[1], request.nextUrl.searchParams.get("country") || undefined);
    if (match[2] || !result || !isReviewSearchable(result.review) || !indexable) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
export const config = { matcher: ["/reviews/:path*", "/templates/exness-review.html"] };
