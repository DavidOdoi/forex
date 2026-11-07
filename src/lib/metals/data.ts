import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { DAY, dayStart, parseFx, parseHistory, parseOhlc, parseQuote, utcDate } from "./math";
import { emptyHistory, type History, type Metal, type Snapshot } from "./types";

const api = "https://api.gold-api.com";
async function json(url: string, seconds: number, key?: string): Promise<unknown> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", ...(key ? { "x-api-key": key } : {}) },
      next: { revalidate: seconds }, signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch { return null; }
}
export const getSnapshot = cache(async (): Promise<Snapshot> => {
  const now = Date.now();
  // Always request the last completed UTC date. Future-dated rates are rejected.
  const fxDate = utcDate(dayStart(now) - DAY);
  const [gold, silver, fx] = await Promise.all([
    json(`${api}/price/XAU`, 30), json(`${api}/price/XAG`, 30),
    json(`https://api.frankfurter.dev/v2/rates?base=USD&quotes=ZAR,EUR,GBP&date=${fxDate}`, 86400),
  ]);
  return { quotes: { XAU: parseQuote(gold, "XAU", now), XAG: parseQuote(silver, "XAG", now) }, fx: parseFx(fx, fxDate), retrievedAt: new Date().toISOString() };
});

const cachedHistory = unstable_cache(async (symbol: Metal, date: string): Promise<History> => {
  const key = process.env.GOLD_API_KEY;
  if (!key) return emptyHistory();
  const now = Date.now(), today = Date.parse(date) / 1000;
  // Stable UTC-day boundaries and shared Next data-cache entries keep the two
  // pages and API routes within the provider's free 10 history/OHLC requests/hour.
  // Two daily series /12h + two today windows /1h + two year windows /12h.
  const query = new URLSearchParams({ symbol, startTimestamp: String(Date.UTC(1800, 0, 1) / 1000), endTimestamp: String(today - 1), groupBy: "day", aggregation: "avg", orderBy: "asc" });
  const daily = await json(`${api}/history?${query}`, 43200, key);
  // Hour boundary is stable, rather than a different cache key every request.
  const end = Math.floor(now / 3_600_000) * 3600;
  // Use defaults for end on today's OHLC: at 00:xx UTC a fixed end would be
  // before the first trade. The provider reports the actual end in its result.
  const open = await json(`${api}/ohlc/${symbol}?startTimestamp=${today}`, 3600, key);
  const yearStart = today - 364 * 86400;
  const year = await json(`${api}/ohlc/${symbol}?startTimestamp=${yearStart}&endTimestamp=${today - 1}`, 43200, key);
  const points = parseHistory(daily, now);
  const hasYearCoverage = points[0] && Date.parse(points[0].date) <= yearStart * 1000
    && points.filter(point => Date.parse(point.date) >= yearStart * 1000).length >= 200
    && dayStart(now) - Date.parse(points[points.length - 1].date) <= 4 * DAY;
  return {
    status: points.length >= 2 ? "available" : "unavailable", points,
    today: parseOhlc(open, today, Math.max(end, Math.floor(now / 1000))),
    year: hasYearCoverage ? parseOhlc(year, yearStart, today - 1) : null,
    retrievedAt: new Date().toISOString(),
  };
}, ["metals-history-v1"], { revalidate: 3600 });

export const getHistory = cache(async (symbol: Metal): Promise<History> => {
  if (!process.env.GOLD_API_KEY) return emptyHistory();
  // Cache complete failed responses too, avoiding repeated calls for an invalid
  // key, an exhausted shared quota, or a provider outage.
  return cachedHistory(symbol, utcDate());
});
