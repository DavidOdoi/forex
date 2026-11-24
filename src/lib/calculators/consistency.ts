import { Temporal } from "@js-temporal/polyfill";
import { D, decimal, type Numeric } from "./precision";
import { CalculationError } from "./forex";
import { parseCsvRows } from "./history-csv";
/** Legacy API retained for integrations; the public page uses the extended rule model below. */
export type ConsistencyResult = {
  percentage: number;
  limit: number;
  withinLimit: boolean;
  minimumTotal: number;
  additionalProfit: number;
};
const scale = BigInt(10000);
const maximumCents = BigInt(100000000000); // $1bn, well within exact display precision.
function decimalUnits(value: string, label: string, maximum: bigint): bigint {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) throw new Error(`${label}: enter a positive number with up to two decimal places.`);
  const [whole, fraction = ""] = normalized.split(".");
  const units = BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  if (units <= BigInt(0)) throw new Error(`${label}: enter a number greater than zero.`);
  if (units > maximum) throw new Error(`${label}: this value exceeds the supported range.`);
  return units;
}
export function calculateConsistency(total: string, bestDay: string, limit: string): ConsistencyResult {
  decimalUnits(total, "Total net profit", maximumCents);
  decimalUnits(bestDay, "Highest profitable day", maximumCents);
  decimalUnits(limit, "Consistency limit", scale);
  const r = calculateConsistencyRule({ total, best: bestDay, limit, mode: "ratio", target: "0", persistence: "reset", previousBest: "0", comparison: "at-most", decimals: 2 });
  return { percentage: r.score!.toNumber(), limit: r.limit.toNumber(), withinLimit: r.numericalCondition, minimumTotal: r.requiredTotal!.toNumber(), additionalProfit: r.additional!.toNumber() };
}
export const consistencyMoney = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

export type ConsistencyRuleInput = { total: Numeric; best: Numeric; limit: Numeric; mode: "ratio" | "fixed-target" | "adjusted-target"; target: Numeric; persistence: "reset" | "perpetual"; previousBest: Numeric; comparison: "at-most" | "below"; decimals: number };
export function calculateConsistencyRule(i: ConsistencyRuleInput) {
  if (!["ratio", "fixed-target", "adjusted-target"].includes(i.mode) || !["reset", "perpetual"].includes(i.persistence) || !["at-most", "below"].includes(i.comparison) || !Number.isInteger(i.decimals) || i.decimals < 0 || i.decimals > 8) throw new CalculationError("Choose valid consistency method, persistence and currency precision.");
  const total = decimal(i.total, "eligible net profit", "-1000000000000"), periodBest = decimal(i.best, "largest positive day"), limit = decimal(i.limit, "consistency percentage", "0", "100", true);
  if (total.gt(0) && periodBest.isZero()) throw new CalculationError("Positive eligible net profit requires a positive largest day.");
  const previousBest = i.persistence === "perpetual" ? decimal(i.previousBest, "retained previous best day") : new D(0), best = D.max(periodBest, previousBest);
  const step = new D(10).pow(-i.decimals), rawRequired = best.mul(100).div(limit);
  const ratioRequired = i.comparison === "at-most" ? rawRequired.toDecimalPlaces(i.decimals, D.ROUND_CEIL) : rawRequired.toDecimalPlaces(i.decimals, D.ROUND_FLOOR).add(step);
  const target = i.mode === "ratio" ? new D(0) : decimal(i.target, "base profit target", "0", undefined, true);
  const qualifyingTarget = i.mode === "adjusted-target" ? D.max(target.toDecimalPlaces(i.decimals, D.ROUND_CEIL), ratioRequired) : target;
  const denominator = i.mode === "ratio" ? total : qualifyingTarget;
  const positive = total.gt(0) && best.gt(0);
  const compare = (base: InstanceType<typeof D>) => i.comparison === "at-most" ? best.mul(100).lte(base.mul(limit)) : best.mul(100).lt(base.mul(limit));
  const score = denominator.gt(0) && best.gt(0) ? best.div(denominator).mul(100) : null;
  const numericalCondition = positive && compare(denominator), targetReached = i.mode === "ratio" ? null : total.gte(qualifyingTarget);
  const requiredTotal = i.mode === "fixed-target" ? compare(denominator) && best.gt(0) ? target : null : i.mode === "adjusted-target" ? qualifyingTarget : ratioRequired;
  const additional = requiredTotal === null ? null : D.max(0, requiredTotal.sub(total));
  return { total, periodBest, previousBest, best, limit, score, target, qualifyingTarget, targetReached, numericalCondition, rawRequired, requiredTotal, additional, positive };
}

export function consistencyDays(text: string, start: string, end: string, persistence: "reset" | "perpetual") {
  let first, last;
  try { first = Temporal.PlainDate.from(start, { overflow: "reject" }); last = Temporal.PlainDate.from(end, { overflow: "reject" }); } catch { throw new CalculationError("Enter valid ISO payout-window dates."); }
  if (!/^\d{4}-\d\d-\d\d$/.test(start) || !/^\d{4}-\d\d-\d\d$/.test(end) || Temporal.PlainDate.compare(first, last) > 0) throw new CalculationError("The payout window must have ordered YYYY-MM-DD dates.");
  const rows = parseCsvRows(text); if (rows[0]?.[0].toLowerCase() === "date") rows.shift();
  if (!rows.length) throw new CalculationError("Enter at least one daily net-P&L observation.");
  let previous = "";
  const days = rows.map(row => {
    if (row.length !== 2 || !/^\d{4}-\d\d-\d\d$/.test(row[0])) throw new CalculationError("Use date,netPnl rows, already grouped by the firm’s trading-day cutoff.");
    try { Temporal.PlainDate.from(row[0], { overflow: "reject" }); } catch { throw new CalculationError("Each daily observation needs a valid date."); }
    if (row[0] <= previous) throw new CalculationError("Daily dates must be unique and strictly increasing; aggregate trades into firm sessions first.");
    previous = row[0]; return { date: row[0], profit: decimal(row[1], "daily net P&L", "-1000000000000") };
  });
  const selected = days.filter(day => day.date >= start && day.date <= end);
  if (!selected.length) throw new CalculationError("No observations fall inside the selected payout window.");
  const total = selected.reduce((sum, day) => sum.add(day.profit), new D(0)), best = D.max(0, ...selected.map(day => day.profit));
  const previousBest = persistence === "perpetual" ? D.max(0, ...days.filter(day => day.date < start).map(day => day.profit)) : new D(0);
  return { total, best, previousBest, selected, all: days };
}
