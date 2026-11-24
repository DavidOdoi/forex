import { NextResponse } from "next/server";
import { parseReferenceRates, referenceRequestDate, type RateSnapshot } from "@/lib/calculators/exchange-rates";

const lastKnown = new Map<string, RateSnapshot>();
export async function GET(request: Request) {
  let latestDate: string;
  try { latestDate = referenceRequestDate(new URL(request.url).searchParams.get("date")); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid reference date." }, { status: 400, headers: { "Cache-Control": "no-store" } }); }
  try {
    const response = await fetch(`https://api.frankfurter.dev/v2/rates?base=USD&date=${latestDate}`, { headers: { Accept: "application/json" }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error("Reference-rate service unavailable");
    const snapshot: RateSnapshot = { rates: parseReferenceRates(await response.json(), latestDate), retrievedAt: new Date().toISOString(), provider: "Frankfurter", sourceUrl: "https://frankfurter.dev/" };
    if (lastKnown.size >= 64 && !lastKnown.has(latestDate)) lastKnown.delete(lastKnown.keys().next().value!);
    lastKnown.set(latestDate, snapshot);
    return NextResponse.json(snapshot, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
  } catch {
    // Best effort on a warm server instance only; the original date is kept.
    // This is never advertised as a durable historical-rate database.
    const cached = lastKnown.get(latestDate);
    if (cached) return NextResponse.json({ ...cached, cached: true }, { headers: { "Cache-Control": "no-store" } });
    return NextResponse.json({ error: "Daily reference rates are unavailable. Enter a manual conversion rate." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
