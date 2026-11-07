import { getSnapshot } from "@/lib/metals/data";
export const revalidate = 30;
export async function GET() {
  return Response.json(await getSnapshot(), { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30", "X-Robots-Tag": "noindex" } });
}
