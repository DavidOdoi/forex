import { NextResponse } from "next/server";
import { parseReferenceRates, type RateSnapshot } from "@/lib/calculators/exchange-rates";

let lastKnown: RateSnapshot | null = null;
export async function GET() {
  try {
    const latestDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const response = await fetch(`https://api.frankfurter.dev/v2/rates?base=USD&date=${latestDate}`, { headers: { Accept: "application/json" }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error("Reference-rate service unavailable");
    const snapshot: RateSnapshot = { rates: parseReferenceRates(await response.json(), latestDate), retrievedAt: new Date().toISOString(), provider: "Frankfurter", sourceUrl: "https://frankfurter.dev/" };
    lastKnown = snapshot;
    return NextResponse.json(snapshot, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
  } catch {
    // Best effort on a warm server instance only; the original date is kept.
    // This is never advertised as a durable historical-rate database.
    if (lastKnown) return NextResponse.json({ ...lastKnown, cached: true }, { headers: { "Cache-Control": "no-store" } });
    return NextResponse.json({ error: "Daily reference rates are unavailable. Enter a manual conversion rate." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
