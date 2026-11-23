import { NextRequest, NextResponse } from "next/server";
import { brokerRecommendations, countryCode, detectedCountry } from "@/lib/broker-recommendations/model";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store, max-age=0", "Vary": "X-Vercel-IP-Country", "X-Robots-Tag": "noindex" };
export function GET(request: NextRequest) {
  const selected = request.nextUrl.searchParams.get("country");
  if (selected !== null && !countryCode(selected)) return NextResponse.json({ error: "Choose a supported country." }, { status: 400, headers });
  const detected = detectedCountry(request.headers, process.env.VERCEL === "1");
  const country = countryCode(selected) ?? detected;
  // No raw IP, city, coordinates, personal information, third-party location
  // service or tracking cookie is used. An IP country is not proof of residence.
  return NextResponse.json(brokerRecommendations(country, selected ? "selected" : country ? "automatic" : "unavailable"), { headers });
}
