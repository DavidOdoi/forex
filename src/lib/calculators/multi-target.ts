import Decimal from "decimal.js";
import { pairCodes } from "./forex";

// Inputs stay decimal strings. Isolated precision avoids global library changes.
export const Dec = Decimal.clone({ precision: 48, rounding: Decimal.ROUND_HALF_UP, toExpNeg: -60, toExpPos: 60 });
export type Amount = Decimal;
export const accountCurrencies = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD", "KES", "ZAR", "NGN", "INR", "AED", "SGD", "HKD", "CNY", "SEK", "NOK", "DKK", "MXN", "BRL", "PLN", "TRY"] as const;
export type TargetInput = { mode: "price" | "r"; value: string; percent: string };
export type MultiTargetInput = {
  pair: string; account: string; side: "buy" | "sell"; entry: string; stop: string;
  sizeMode: "lots" | "cash" | "percent"; lots: string; cashRisk: string; balance: string; riskPercent: string;
  contract: string; minimum: string; step: string; pipOverride: string;
  conversionDirection: "direct" | "inverse"; conversionRate: string;
  runner: boolean; runnerExit: string; commissionEnabled: boolean; commission: string;
  stopPolicy: "original" | "entry"; moveAfter: string; targets: TargetInput[];
};
export class PlanError extends Error {
  constructor(public field: string, message: string) { super(message); this.name = "PlanError"; }
}
function read(value: string, field: string, label: string, min = "0.000000001", max = "1000000000") {
  if (typeof value !== "string" || value.trim().length > 64 || !/^(?:\d+(?:\.\d{0,18})?|\.\d{1,18})$/.test(value.trim())) throw new PlanError(field, `${label}: enter a finite decimal number (up to 18 decimal places; no scientific notation).`);
  const number = new Dec(value.trim());
  if (!number.isFinite() || number.lt(min) || number.gt(max)) throw new PlanError(field, `${label} must be between ${min} and ${max}.`);
  return number;
}
const sum = (values: Amount[]) => values.reduce((total, value) => total.plus(value), new Dec(0));
export function equalAllocations(count: number): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 10) throw new PlanError("targets", "Use one to ten targets.");
  const base = new Dec(100).div(count).toDecimalPlaces(8, Decimal.ROUND_DOWN);
  return Array.from({ length: count }, (_, i) => (i === count - 1 ? new Dec(100).minus(base.mul(count - 1)) : base).toFixed());
}
export function remainingPercentage(targets: TargetInput[], index: number): string {
  const used = sum(targets.filter((_, i) => i !== index).map((target, i) => read(target.percent, `target-${i}-percent`, "Allocation", "0", "100")));
  if (used.gte(100)) throw new PlanError(`target-${index}-percent`, "The other targets already allocate 100% or more. Reduce them first.");
  return new Dec(100).minus(used).toFixed();
}
export function samplePlan(): MultiTargetInput {
  return { pair: "EUR/USD", account: "USD", side: "buy", entry: "1.1000", stop: "1.0950", sizeMode: "lots", lots: "1.00", cashRisk: "500", balance: "50000", riskPercent: "1", contract: "100000", minimum: "0.01", step: "0.01", pipOverride: "", conversionDirection: "direct", conversionRate: "", runner: false, runnerExit: "", commissionEnabled: false, commission: "3.50", stopPolicy: "original", moveAfter: "1", targets: [{ mode: "price", value: "1.1050", percent: "50" }, { mode: "price", value: "1.1100", percent: "30" }, { mode: "price", value: "1.1150", percent: "20" }] };
}
/** Reserve a minimum for each group, distribute remaining step units in
 * proportion to requested quotas above that minimum, then largest remainders.
 * Stable ties go to the earlier target (runner last). Never increases size.
 */
function proposeVolumes(total: Amount, step: Amount, minimum: Amount, percentages: Amount[]) {
  const units = total.div(step), minimumUnits = minimum.div(step).ceil();
  if (units.lt(minimumUnits.mul(percentages.length))) return null;
  const spare = units.minus(minimumUnits.mul(percentages.length));
  const weights = percentages.map(percent => Dec.max(units.mul(percent).div(100).minus(minimumUnits), 0));
  const weightTotal = sum(weights);
  const quotas = weights.map(weight => weightTotal.isZero() ? new Dec(0) : spare.mul(weight).div(weightTotal));
  const allocated = quotas.map(quota => minimumUnits.plus(quota.floor()));
  const leftover = units.minus(sum(allocated)).toNumber(); // Always less than group count (<=11).
  const priority = quotas.map((quota, i) => ({ i, remainder: quota.minus(quota.floor()) })).sort((a, b) => b.remainder.cmp(a.remainder) || a.i - b.i);
  for (let i = 0; i < leftover; i++) allocated[priority[i].i] = allocated[priority[i].i].plus(1);
  return allocated.map(value => value.mul(step));
}
function volumeIssues(total: Amount, closes: Amount[], step: Amount, minimum: Amount): string[] {
  const errors: string[] = []; let remaining = total;
  closes.forEach((lots, i) => {
    if (lots.lt(minimum) || !lots.mod(step).isZero()) errors.push(`TP${i + 1}: ${lots.toFixed()} lots does not meet the minimum and lot-step rules.`);
    remaining = remaining.minus(lots);
    if (remaining.lt(0)) errors.push(`TP${i + 1}: closes exceed the position.`);
    else if (!remaining.isZero() && (remaining.lt(minimum) || !remaining.mod(step).isZero())) errors.push(`After TP${i + 1}, the ${remaining.toFixed()}-lot remainder is invalid under the entered rules.`);
  });
  return errors;
}
export function calculateMultiTarget(input: MultiTargetInput, basis: "ideal" | "adjusted" = "ideal") {
  if (!(pairCodes as readonly string[]).includes(input.pair)) throw new PlanError("pair", "Choose a supported forex pair. Custom symbols and non-forex contracts are not supported.");
  if (!(accountCurrencies as readonly string[]).includes(input.account)) throw new PlanError("account", "Choose a supported account currency.");
  if (input.side !== "buy" && input.side !== "sell") throw new PlanError("side", "Choose buy or sell.");
  if (!["lots", "cash", "percent"].includes(input.sizeMode)) throw new PlanError("sizeMode", "Choose a position-size mode.");
  if (!["original", "entry"].includes(input.stopPolicy)) throw new PlanError("stopPolicy", "Choose a supported stop policy.");
  if (basis !== "ideal" && basis !== "adjusted") throw new PlanError("basis", "Choose ideal or adjusted allocation.");
  if (typeof input.runner !== "boolean" || typeof input.commissionEnabled !== "boolean") throw new PlanError("runner", "Choose valid runner and commission options.");
  const [base, quote] = input.pair.split("/");
  const direction = input.side === "buy" ? new Dec(1) : new Dec(-1);
  const entry = read(input.entry, "entry", "Entry price"), stop = read(input.stop, "stop", "Initial stop");
  const distance = entry.minus(stop).mul(direction);
  if (distance.lte(0)) throw new PlanError("stop", "Initial stop must be strictly on the loss side of entry (below for buy, above for sell). Zero stop distance is invalid.");
  const contract = read(input.contract, "contract", "Base units per lot", "1");
  const step = read(input.step, "step", "Lot step", "0.000001", "1000000");
  const minimum = read(input.minimum, "minimum", "Minimum lot", "0.000001", "1000000");
  const pip = input.pipOverride.trim() ? read(input.pipOverride, "pipOverride", "Pip size", "0.000000001", "1000") : new Dec(quote === "JPY" ? "0.01" : "0.0001");
  let factor = new Dec(1);
  if (quote !== input.account) {
    if (!["direct", "inverse"].includes(input.conversionDirection)) throw new PlanError("conversionDirection", "Choose the conversion direction.");
    const rate = read(input.conversionRate, "conversionRate", "Constant scenario conversion rate");
    factor = input.conversionDirection === "inverse" ? new Dec(1).div(rate) : rate;
  }
  const riskPerLot = distance.mul(contract).mul(factor);
  let budget: Amount | null = null, rawLots: Amount;
  if (input.sizeMode === "lots") rawLots = read(input.lots, "lots", "Total lots", "0.000001", "1000000");
  else {
    budget = input.sizeMode === "cash" ? read(input.cashRisk, "cashRisk", "Gross cash-risk budget", "0.000000001", "1000000000000") : read(input.balance, "balance", "Account balance/equity", "0.000000001", "1000000000000").mul(read(input.riskPercent, "riskPercent", "Risk percentage", "0.000000001", "100")).div(100);
    rawLots = budget.div(riskPerLot);
  }
  let lots = input.sizeMode === "lots" ? rawLots : rawLots.div(step).floor().mul(step);
  if (budget && riskPerLot.mul(lots).gt(budget)) lots = lots.minus(step);
  if (lots.lt(minimum)) throw new PlanError(input.sizeMode === "lots" ? "lots" : "cashRisk", "The position is below the entered minimum volume after rounding down. No risk-based size has been rounded up.");
  if (lots.gt(1000000)) throw new PlanError("lots", "Calculated size exceeds 1,000,000 lots. Check the contract, conversion and stop.");
  if (!lots.mod(step).isZero()) throw new PlanError("lots", "Total lots must be an exact multiple of the lot step, anchored at zero. Change the size or check your broker's grid.");
  if (!Array.isArray(input.targets) || input.targets.length < 1 || input.targets.length > 10) throw new PlanError("targets", "Use one to ten targets.");
  let previous = entry;
  const targets = input.targets.map((target, i) => {
    if (target.mode !== "price" && target.mode !== "r") throw new PlanError(`target-${i}-mode`, "Choose target price or target R.");
    const value = read(target.value, `target-${i}-value`, `TP${i + 1} ${target.mode === "r" ? "R multiple" : "price"}`, "0.000000001", target.mode === "r" ? "1000000" : "1000000000");
    const price = target.mode === "r" ? entry.plus(distance.mul(value).mul(direction)) : value;
    if (price.lte(0) || price.gt(1000000000)) throw new PlanError(`target-${i}-value`, `TP${i + 1} resolves outside the supported positive-price range.`);
    if (price.minus(entry).mul(direction).lte(0)) throw new PlanError(`target-${i}-value`, `TP${i + 1} must be on the profit side of entry.`);
    if (price.minus(previous).mul(direction).lte(0)) throw new PlanError(`target-${i}-value`, `TP${i + 1}: targets must progress away from entry without duplicates.`);
    previous = price;
    return { price, percent: read(target.percent, `target-${i}-percent`, `TP${i + 1} allocation`, "0.000000001", "100") };
  });
  const totalPercent = sum(targets.map(target => target.percent));
  if (totalPercent.gt(100)) throw new PlanError("targets", "Total allocation exceeds 100%. Percentages always refer to the original position.");
  if (!input.runner && !totalPercent.eq(100)) throw new PlanError("targets", "Full-exit mode requires exactly 100%. Allocate the remaining percentage or explicitly enable runner mode.");
  const runnerPercent = new Dec(100).minus(totalPercent);
  const runnerExit = input.runner && runnerPercent.gt(0) && input.runnerExit.trim() ? read(input.runnerExit, "runnerExit", "Runner exit price") : null;
  const trigger = read(input.moveAfter, "moveAfter", "Move stop after target", "1", String(targets.length));
  if (!trigger.isInteger()) throw new PlanError("moveAfter", "Select a whole target number for the stop change.");
  const finalStop = input.stopPolicy === "entry" ? entry : stop;
  if (runnerExit && runnerExit.minus(finalStop).mul(direction).lt(0)) throw new PlanError("runnerExit", "The runner exit lies beyond the selected remainder stop, which would trigger first on that path. Use an exit at or before that stop.");
  const commission = input.commissionEnabled ? read(input.commission, "commission", "Commission per standard lot per side", "0") : new Dec(0);
  const fee = (volume: Amount) => commission.mul(contract).mul(volume).div(100000);
  const entryCommission = fee(lots);
  const ideal = targets.map(target => lots.mul(target.percent).div(100));
  const idealIssues = volumeIssues(lots, ideal, step, minimum);
  const groups = [...targets.map(target => target.percent), ...(runnerPercent.gt(0) ? [runnerPercent] : [])];
  const proposal = proposeVolumes(lots, step, minimum, groups);
  const adjustmentError = proposal ? null : `This position is too small to support ${targets.length} valid partial ${targets.length === 1 ? "close" : "closes"}${runnerPercent.gt(0) ? " and a valid runner" : ""} with your entered minimum volume.`;
  if (basis === "adjusted" && !proposal) throw new PlanError("targets", adjustmentError!);
  const closes = basis === "adjusted" ? proposal!.slice(0, targets.length) : ideal;
  const issues = volumeIssues(lots, closes, step, minimum);
  let remaining = lots, cumulativeGross = new Dec(0), cumulativeExitCommission = new Dec(0);
  const rows = targets.map((target, i) => {
    const volume = closes[i]; remaining = remaining.minus(volume);
    const move = target.price.minus(entry).mul(direction);
    const quoteGross = move.mul(contract).mul(volume), gross = quoteGross.mul(factor);
    const exitCommission = fee(volume); cumulativeGross = cumulativeGross.plus(gross); cumulativeExitCommission = cumulativeExitCommission.plus(exitCommission);
    return { number: i + 1, price: target.price, requestedPercent: target.percent, actualPercent: volume.div(lots).mul(100), idealLots: ideal[i], proposedLots: proposal?.[i] ?? null, lots: volume, pips: move.div(pip), r: move.div(distance), quoteGross, gross, exitCommission, cumulativeGross, cumulativeNet: cumulativeGross.minus(entryCommission).minus(cumulativeExitCommission), remaining };
  });
  const closedLots = sum(closes), runnerLots = lots.minus(closedLots);
  const weightedClosedExit = sum(rows.map(row => row.price.mul(row.lots))).div(closedLots);
  const initialQuoteRisk = distance.mul(contract).mul(lots), initialRisk = initialQuoteRisk.mul(factor);
  const runnerGross = runnerExit ? runnerExit.minus(entry).mul(direction).mul(contract).mul(runnerLots).mul(factor) : null;
  const fullySpecified = runnerLots.isZero() || runnerExit !== null;
  const finalGross = fullySpecified ? cumulativeGross.plus(runnerGross ?? 0) : null;
  const finalCosts = fullySpecified ? entryCommission.plus(cumulativeExitCommission).plus(runnerExit ? fee(runnerLots) : 0) : null;
  const weightedExit = fullySpecified ? sum(rows.map(row => row.price.mul(row.lots))).plus(runnerExit ? runnerExit.mul(runnerLots) : 0).div(lots) : null;
  // Compute price R independently of the account-currency conversion model.
  const weightedR = weightedExit ? weightedExit.minus(entry).mul(direction).div(distance) : null;
  const scenario = (reached: number, stopRunner = false) => {
    const filled = rows.slice(0, reached), closed = sum(filled.map(row => row.lots));
    const remainder = lots.minus(closed), realized = sum(filled.map(row => row.gross));
    const allTargets = reached === rows.length;
    const open = allTargets && !stopRunner && remainder.gt(0) && runnerExit === null;
    const exit = remainder.isZero() || open ? null : allTargets && !stopRunner && runnerExit ? runnerExit : input.stopPolicy === "entry" && reached >= trigger.toNumber() ? entry : stop;
    // Original/entry stops sit behind every already-filled profitable target;
    // no custom stop is accepted that could have triggered earlier on this path.
    const remainderGross = exit ? exit.minus(entry).mul(direction).mul(contract).mul(remainder).mul(factor) : open ? null : new Dec(0);
    const gross = realized.plus(remainderGross ?? 0);
    const costs = entryCommission.plus(sum(filled.map(row => row.exitCommission))).plus(exit ? fee(remainder) : 0);
    return { reached, label: reached === 0 ? "Stop before any target" : allTargets && !stopRunner ? open ? "All targets; runner still open" : "All entered exits filled" : `${filled.map(row => `TP${row.number}`).join(" + ")}, then stop${stopRunner ? " on runner" : ""}`, realized, remaining: remainder, exit, remainderGross, gross, costs, net: gross.minus(costs), r: open ? null : gross.div(initialRisk), netR: open ? null : gross.minus(costs).div(initialRisk), open };
  };
  const scenarios = Array.from({ length: rows.length + 1 }, (_, reached) => scenario(reached));
  if (runnerLots.gt(0)) scenarios.push(scenario(rows.length, true));
  return { input: { ...input, targets: input.targets.map(target => ({ ...target })) }, basis, base, quote, entry, stop, contract, step, minimum, pip, factor, budget, rawLots, lots, stopPips: distance.div(pip), initialRisk, initialQuoteRisk, totalPercent, runnerPercent, runnerLots, runnerExit, runnerGross, entryCommission, exitCommission: cumulativeExitCommission, targetGross: cumulativeGross, targetNet: cumulativeGross.minus(entryCommission).minus(cumulativeExitCommission), closedLots, weightedClosedExit, closedAverageR: weightedClosedExit.minus(entry).mul(direction).div(distance), weightedExit, weightedR, cashR: finalGross?.div(initialRisk) ?? null, finalGross, finalCosts, finalNet: finalGross && finalCosts ? finalGross.minus(finalCosts) : null, netR: finalGross && finalCosts ? finalGross.minus(finalCosts).div(initialRisk) : null, rows, scenarios, volumeIssues: issues, idealVolumeIssues: idealIssues, adjustmentError, executable: issues.length === 0 };
}
export type MultiTargetResult = ReturnType<typeof calculateMultiTarget>;
export function decimalText(value: Amount, places = 4): string {
  const rounded = value.toDecimalPlaces(places);
  return (rounded.isZero() ? new Dec(0) : rounded).toFixed(places);
}
export function cashText(value: Amount, currency: string): string {
  const [whole, fraction] = decimalText(value, 2).split(".");
  return `${currency} ${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction}`;
}
