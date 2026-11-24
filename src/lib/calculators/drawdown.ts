import { CalculationError } from "./forex";
import { decimal, D, type Numeric } from "./precision";
export type EquityObservation = { value: Numeric; date?: string; flow?: Numeric };
export type FlowMode = "none" | "raw" | "end-flow";
function recovery(peak: InstanceType<typeof D>, value: InstanceType<typeof D>) { return value.lte(0) ? null : D.max(0, peak.div(value).sub(1).mul(100)); }
export function drawdownSnapshot(peakInput: Numeric, currentInput: Numeric, initialInput?: Numeric) {
  const enteredPeak = decimal(peakInput, "earlier peak", "0", "1000000000000", true), current = decimal(currentInput, "current account value", "-1000000000000", "1000000000000");
  const peak = D.max(enteredPeak, current), amount = peak.sub(current), percent = amount.div(peak).mul(100);
  const initial = initialInput === undefined ? null : decimal(initialInput, "initial capital", "0", "1000000000000", true);
  return { peak, current, amount, percent, recovery: recovery(peak, current), initial, initialChange: initial ? current.div(initial).sub(1).mul(100) : null, newHigh: current.gt(enteredPeak) };
}
function summarize(values: InstanceType<typeof D>[], dates: (string | undefined)[]) {
  let peak = values[0], peakIndex = 0;
  const rows = values.map((value, index) => {
    if (value.gte(peak)) { peak = value; peakIndex = index; }
    const amount = peak.sub(value), percent = amount.div(peak).mul(100);
    return { index, date: dates[index], value, peak, peakIndex, amount, percent, recovery: recovery(peak, value), underwaterIntervals: amount.gt(0) ? index - peakIndex : 0 };
  });
  const maxPercent = rows.reduce((a, b) => b.percent.gt(a.percent) ? b : a), maxAmount = rows.reduce((a, b) => b.amount.gt(a.amount) ? b : a);
  const recoveryIndex = maxPercent.amount.isZero() ? maxPercent.index : rows.findIndex(row => row.index > maxPercent.index && row.value.gte(maxPercent.peak));
  const days = (a: number, b: number) => dates[a] && dates[b] ? (Date.parse(dates[b]!) - Date.parse(dates[a]!)) / 86400000 : null;
  return { rows, first: values[0], last: values.at(-1)!, current: rows.at(-1)!, maxPercent, maxAmount, recoveryIndex: recoveryIndex < 0 ? null : recoveryIndex, peakToTroughIntervals: maxPercent.index - maxPercent.peakIndex, peakToTroughDays: days(maxPercent.peakIndex, maxPercent.index), troughToRecoveryIntervals: recoveryIndex < 0 ? null : recoveryIndex - maxPercent.index, troughToRecoveryDays: recoveryIndex < 0 ? null : days(maxPercent.index, recoveryIndex), initialChange: values.at(-1)!.div(values[0]).sub(1).mul(100), maximumBelowInitial: D.max(0, values[0].sub(D.min(...values))), longestUnderwaterIntervals: Math.max(...rows.map(row => row.underwaterIntervals)) };
}
export function analyzeDrawdown(observations: EquityObservation[], flowMode: FlowMode, now = Date.now()) {
  if (!["none", "raw", "end-flow"].includes(flowMode)) throw new CalculationError("Choose a valid cash-flow methodology.");
  if (!Array.isArray(observations) || observations.length < 2 || observations.length > 1000) throw new CalculationError("Enter two to 1,000 ordered account-value observations.");
  const hasDates = observations[0].date !== undefined;
  const dates = observations.map((row, i) => {
    if ((row.date !== undefined) !== hasDates) throw new CalculationError("Provide dates for every observation or use value-only rows throughout.");
    if (!hasDates) return undefined;
    const date = row.date!, stamp = Date.parse(date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0, 10) !== date || date > new Date(now).toISOString().slice(0, 10)) throw new CalculationError("Use valid historical ISO dates (YYYY-MM-DD), one observation per date.");
    if (i && date <= observations[i - 1].date!) throw new CalculationError("Observation dates must be strictly increasing. Unordered or duplicate dates are not sorted silently.");
    return date;
  });
  const rawValues = observations.map((row, i) => decimal(row.value, `account value at observation ${i + 1}`, "-1000000000000", "1000000000000"));
  if (rawValues.some(value => !value.isZero() && value.toNumber() === 0)) throw new CalculationError("An entered value falls below the supported plotting precision. Use a separately scaled account-value series.");
  if (rawValues[0].lte(0)) throw new CalculationError("The first observation must be positive to define an initial percentage reference.");
  const flows = observations.map((row, i) => {
    if (flowMode === "end-flow" && row.flow === undefined) throw new CalculationError(`Flow-adjusted mode needs an explicit flow at observation ${i + 1}; enter 0 when none occurred.`);
    return decimal(row.flow ?? "0", `net external flow at observation ${i + 1}`, "-1000000000000", "1000000000000");
  });
  if (flowMode === "none" && flows.some(flow => !flow.isZero())) throw new CalculationError("External flows are present. Select raw account-value analysis explicitly or use the stated flow-adjusted method.");
  let values = rawValues;
  if (flowMode === "end-flow") {
    if (!flows[0].isZero()) throw new CalculationError("The first observation defines starting capital; its external-flow field must be 0.");
    values = [rawValues[0]];
    for (let i = 1; i < rawValues.length; i++) {
      const preFlow = rawValues[i].sub(flows[i]);
      if (rawValues[i].lt(0) || preFlow.lt(0)) throw new CalculationError("End-flow unitization requires nonnegative ending and pre-flow values. Split an insolvent history into a separately defined analysis.");
      if (rawValues[i - 1].isZero()) { if (rawValues[i].isZero() && flows[i].isZero()) values.push(new D(0)); else throw new CalculationError("Percentage-return unitization cannot continue from zero equity. Start a new capital segment instead of inventing a recovery return."); }
      else {
        const next = values[i - 1].mul(preFlow.div(rawValues[i - 1]));
        if (!next.isFinite() || next.gt("1e30") || (next.gt(0) && next.lt("1e-30"))) throw new CalculationError("The adjusted index exceeds the supported numeric range. Use an appropriately scaled, separately defined capital segment.");
        values.push(next);
      }
    }
  }
  const result = summarize(values, dates), raw = summarize(rawValues, dates);
  return { ...result, raw, flows, flowMode, adjusted: flowMode === "end-flow", hasDates, containsNonpositive: rawValues.some(value => value.lte(0)), containsFlows: flows.some(flow => !flow.isZero()) };
}
