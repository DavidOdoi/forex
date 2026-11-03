import { getReview } from "@/lib/reviews/catalog";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = new URL(request.url).searchParams.get("country") || undefined;
  const result = getReview(slug, country);
  const headers = { "Content-Type": "application/json; charset=utf-8", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff" };
  if (!result) return new Response(JSON.stringify({ error: "Review or country profile not found" }), { status: 404, headers });
  return new Response(JSON.stringify({ review: result.review, collectedResearch: result.research, availableCountries: result.countries }, null, 2), {
    headers: { ...headers, "Content-Disposition": `attachment; filename="${slug}-research.json"` },
  });
}
