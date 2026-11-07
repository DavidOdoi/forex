import { getHistory } from "@/lib/metals/data";
// Read the deployment's current configuration at request time. Historical data
// remains cached in getHistory; a missing-key response must not be prerendered
// or retained by a CDN across configuration changes.
export const revalidate = 0;
export async function GET() {
  // No arbitrary URL, symbol or time-range input: a public visitor cannot use
  // this route to fan out uncached requests against the authenticated provider.
  const gold = await getHistory("XAU");
  const silver = await getHistory("XAG");
  return Response.json({ XAU: gold, XAG: silver }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
