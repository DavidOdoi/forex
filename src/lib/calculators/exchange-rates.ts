import type Decimal from "decimal.js";
import { CalculationError } from "./forex";
import { D, decimal, type Numeric } from "./precision";
import { isAccountCurrency, type AccountCurrency } from "./instruments";

export type ExchangeRate = {
  base: AccountCurrency; quote: AccountCurrency; rate?: Numeric; bid?: Numeric; ask?: Numeric;
  source: "manual" | "frankfurter"; asOf: string | null;
};
export type RateSnapshot = { rates: ExchangeRate[]; retrievedAt: string; provider: "Frankfurter"; sourceUrl: string; cached?: boolean };
export const REFERENCE_MAX_AGE = 4 * 86400000;

export function referenceRequestDate(value: string | null, now = Date.now()) {
  const latest = new Date(now - 86400000).toISOString().slice(0, 10);
  if (value === null) return latest;
  const timestamp = Date.parse(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value || value < "1999-01-04" || value > latest) throw new CalculationError("Choose a valid reference date from 1999-01-04 through the previous completed UTC day. Coverage varies by currency and provider.");
  return value;
}

function edges(rate: ExchangeRate, now: number, valuation: "liability" | "asset") {
  if (!isAccountCurrency(rate.base) || !isAccountCurrency(rate.quote) || rate.base === rate.quote) throw new CalculationError("The conversion quote must connect two different supported currencies.");
  const paired = rate.bid !== undefined || rate.ask !== undefined;
  const bid = decimal(paired ? rate.bid ?? "" : rate.rate ?? "", "conversion bid/rate", "0.000000000001", "1000000000");
  const ask = decimal(paired ? rate.ask ?? "" : rate.rate ?? "", "conversion ask/rate", "0.000000000001", "1000000000");
  if (ask.lt(bid)) throw new CalculationError("Conversion ask must be equal to or higher than bid.");
  let stale = false;
  if (rate.source === "frankfurter") {
    const timestamp = rate.asOf ? Date.parse(rate.asOf) : NaN;
    if (!Number.isFinite(timestamp) || timestamp > now + 60000) throw new CalculationError("The reference-rate date is missing or invalid.");
    stale = now - timestamp > REFERENCE_MAX_AGE;
  } else if (rate.source !== "manual") throw new CalculationError("Choose a supported conversion-rate source.");
  const direct = valuation === "asset" ? bid : ask;
  const inverse = valuation === "asset" ? ask : bid;
  // Sell proceeds at direct bid / inverse ask; cover a liability at
  // direct ask / inverse bid. Single reference rates have no spread.
  return [
    { from: rate.base, to: rate.quote, factor: direct, label: `${rate.base}/${rate.quote} × ${direct.toString()}`, rate, stale },
    { from: rate.quote, to: rate.base, factor: new D(1).div(inverse), label: `${rate.base}/${rate.quote} ÷ ${inverse.toString()}`, rate, stale },
  ];
}

export function resolveConversion(from: AccountCurrency, to: AccountCurrency, rates: ExchangeRate[], now = Date.now(), valuation: "liability" | "asset" = "liability") {
  if (!isAccountCurrency(from) || !isAccountCurrency(to)) throw new CalculationError("Choose supported currencies.");
  if (from === to) return { factor: new D(1), steps: [] as string[], rates: [] as ExchangeRate[], stale: false, identity: true };
  const links = rates.flatMap(rate => edges(rate, now, valuation));
  const queue: { at: AccountCurrency; factor: Decimal; steps: string[]; rates: ExchangeRate[]; stale: boolean; visited: AccountCurrency[] }[] = [{ at: from, factor: new D(1), steps: [], rates: [], stale: false, visited: [from] }];
  while (queue.length) {
    const path = queue.shift()!;
    for (const edge of links.filter(link => link.from === path.at && !path.visited.includes(link.to))) {
      const next = { at: edge.to, factor: path.factor.mul(edge.factor), steps: [...path.steps, edge.label], rates: [...path.rates, edge.rate], stale: path.stale || edge.stale, visited: [...path.visited, edge.to] };
      if (next.at === to) return { factor: next.factor, steps: next.steps, rates: next.rates, stale: next.stale, identity: false };
      if (next.steps.length < 2) queue.push(next);
    }
  }
  throw new CalculationError(`A conversion rate from ${from} to ${to} is required. Enter a manual quote or choose an available daily reference.`);
}

export function parseReferenceRates(data: unknown, latestDate: string): ExchangeRate[] {
  if (!Array.isArray(data)) throw new CalculationError("The reference-rate provider returned an invalid response.");
  const cutoff = Date.parse(latestDate);
  const rates: ExchangeRate[] = [];
  for (const item of data) {
    if (!item || item.base !== "USD" || !isAccountCurrency(item.quote) || item.quote === "USD" || typeof item.rate !== "number" || !Number.isFinite(item.rate) || item.rate <= 0 || typeof item.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) continue;
    const date = Date.parse(item.date);
    if (!Number.isFinite(date) || new Date(date).toISOString().slice(0, 10) !== item.date || date > cutoff || cutoff - date > 30 * 86400000 || rates.some(rate => rate.quote === item.quote)) continue;
    rates.push({ base: "USD", quote: item.quote, rate: String(item.rate), source: "frankfurter", asOf: `${item.date}T00:00:00.000Z` });
  }
  if (!rates.length) throw new CalculationError("No usable reference rates were returned. Enter a manual rate instead.");
  return rates;
}
