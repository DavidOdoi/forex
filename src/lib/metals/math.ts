import type { Currency, Fx, History, Metal, Ohlc, Point, Quote, Unit } from "./types";

export const GRAMS_PER_TROY_OUNCE = 31.1034768;
export const DAY = 86_400_000;
export const MAX_QUOTE_AGE = 5 * 60_000;
export function positive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= 1e12;
}
export function dayStart(now = Date.now()) { return Math.floor(now / DAY) * DAY; }
export function utcDate(now = Date.now()) { return new Date(now).toISOString().slice(0, 10); }
export function timestampLabel(value: string) {
  return new Date(value).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC").replace("Z", " UTC");
}
export function quoteIsFresh(quote: Quote | null, now = Date.now()) {
  if (!quote) return false;
  const age = now - Date.parse(quote.asOf);
  return age >= -60_000 && age <= MAX_QUOTE_AGE;
}
export function parseQuote(value: unknown, symbol: Metal, now = Date.now()): Quote | null {
  if (!value || typeof value !== "object") return null;
  const q = value as Record<string, unknown>;
  if (q.symbol !== symbol || q.currency !== "USD" || !positive(q.price) || typeof q.updatedAt !== "string" || !q.updatedAt.endsWith("Z")) return null;
  const time = Date.parse(q.updatedAt);
  if (!Number.isFinite(time) || time > now + 60_000 || time < Date.UTC(2000, 0, 1)) return null;
  return { symbol, price: q.price, asOf: new Date(time).toISOString() };
}
export function parseFx(value: unknown, latestDate: string): Fx[] {
  if (!Array.isArray(value)) return [];
  const cutoff = Date.parse(latestDate);
  return value.flatMap(row => {
    if (!row || row.base !== "USD" || !["ZAR", "EUR", "GBP"].includes(row.quote) || !positive(row.rate) || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) return [];
    const age = cutoff - Date.parse(row.date);
    if (!Number.isFinite(age) || new Date(row.date).toISOString().slice(0, 10) !== row.date || age < 0 || age > 7 * DAY) return [];
    return [{ currency: row.quote as Currency, rate: row.rate, date: row.date }];
  }).filter((row, index, rows) => rows.findIndex(other => other.currency === row.currency) === index);
}
export function fxRate(currency: Currency, fx: Fx[], now = Date.now()): number | null {
  if (currency === "USD") return 1;
  const found = fx.find(row => row.currency === currency);
  return found && dayStart(now) - Date.parse(found.date) <= 8 * DAY && Date.parse(found.date) <= dayStart(now) ? found.rate : null;
}
export function ounces(amount: number, unit: Unit) {
  if (!Number.isFinite(amount) || amount < 0 || amount > 1e12) throw new Error("Enter an amount between 0 and 1 trillion.");
  return unit === "oz" ? amount : amount * (unit === "kg" ? 1000 : 1) / GRAMS_PER_TROY_OUNCE;
}
export function metalValue(amount: number, unit: Unit, price: number, rate = 1, purity = 1) {
  if (!positive(price) || !positive(rate) || !positive(purity) || purity > 1) throw new Error("A valid price, exchange rate and purity are required.");
  const result = ounces(amount, unit) * price * rate * purity;
  if (!Number.isFinite(result) || result > 1e15) throw new Error("This amount is outside the supported calculation range.");
  return result;
}
export function metalWeight(budget: number, unit: Unit, price: number, rate = 1, purity = 1) {
  if (!Number.isFinite(budget) || budget < 0 || budget > 1e12) throw new Error("Enter a budget between 0 and 1 trillion.");
  const result = budget / metalValue(1, unit, price, rate, purity);
  if (!Number.isFinite(result) || result > 1e15) throw new Error("This amount is outside the supported calculation range.");
  return result;
}
export function ratio(gold: Quote | null, silver: Quote | null, now = Date.now()) {
  if (!quoteIsFresh(gold, now) || !quoteIsFresh(silver, now) || Math.abs(Date.parse(gold!.asOf) - Date.parse(silver!.asOf)) > 60_000) return null;
  const value = gold!.price / silver!.price;
  return positive(value) ? value : null;
}
export function change(current: number, baseline: number) {
  if (!positive(current) || !positive(baseline)) return null;
  const amount = current - baseline, percent = (current / baseline - 1) * 100;
  return Number.isFinite(amount) && Number.isFinite(percent) ? { amount, percent } : null;
}
export function todayChange(quote: Quote | null, ohlc: Ohlc | null, now = Date.now()) {
  if (!quote || !ohlc || !quoteIsFresh(quote, now) || utcDate(Date.parse(quote.asOf)) !== utcDate(now) || ohlc.start !== dayStart(now) / 1000) return null;
  return change(quote.price, ohlc.open);
}
export function parseHistory(value: unknown, now = Date.now()): Point[] {
  if (!Array.isArray(value) || value.length > 100000) return [];
  const points = value.flatMap(row => {
    if (!row || typeof row.day !== "string") return [];
    // Some SQL-backed responses serialize a daily bucket as midnight UTC and
    // decimal averages as strings. Accept only lossless, unambiguous formats.
    const match = /^(\d{4}-\d{2}-\d{2})(?:(?:T| )00:00:00(?:\.0{1,9})?(?:Z|\+00:00)?)?$/.exec(row.day);
    if (!match) return [];
    const rawPrice = row.avg_price;
    const price = typeof rawPrice === "string" && /^\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(rawPrice.trim()) ? Number(rawPrice) : rawPrice;
    if (!positive(price)) return [];
    const date = Date.parse(match[1]);
    if (!Number.isFinite(date) || new Date(date).toISOString().slice(0, 10) !== match[1] || date >= dayStart(now)) return [];
    return [{ date: match[1], price }];
  });
  return [...new Map(points.map(p => [p.date, p])).values()].sort((a, b) => a.date.localeCompare(b.date));
}
export function parseOhlc(value: unknown, start: number, end: number): Ohlc | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (![row.open, row.high, row.low, row.close].every(positive) || row.startTimestamp !== start || typeof row.endTimestamp !== "number" || row.endTimestamp > end + 60 || row.endTimestamp < start) return null;
  const { open, high, low, close } = row as { open: number; high: number; low: number; close: number };
  if (low > Math.min(open, close) || high < Math.max(open, close) || low > high) return null;
  return { open, high, low, close, start, end: row.endTimestamp };
}
export function historyChange(history: History, period: "week" | "month" | "ytd", now = Date.now()) {
  const last = history.points.at(-1);
  if (!last || dayStart(now) - Date.parse(last.date) > 4 * DAY) return null;
  const end = Date.parse(last.date);
  // Fixed day intervals; YTD uses the last available observation before Jan 1.
  const target = period === "ytd" ? Date.UTC(new Date(now).getUTCFullYear(), 0, 1) - DAY : end - (period === "week" ? 7 : 30) * DAY;
  const baseline = history.points.findLast(point => Date.parse(point.date) <= target);
  if (!baseline || target - Date.parse(baseline.date) > 4 * DAY || baseline.date >= last.date) return null;
  const result = change(last.price, baseline.price);
  return result ? { ...result, from: baseline.date, to: last.date } : null;
}
export function money(value: number, currency: Currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "code", maximumFractionDigits: 2 }).format(value);
}
export function percent(value: number) { return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`; }
