import { getHistory } from "@/lib/metals/data";
export const revalidate = 3600;
export async function GET() {
  // No arbitrary URL, symbol or time-range input: a public visitor cannot use
  // this route to fan out uncached requests against the authenticated provider.
  const gold = await getHistory("XAU");
  const silver = await getHistory("XAG");
  return Response.json({ XAU: gold, XAG: silver }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60", "X-Robots-Tag": "noindex" } });
}
