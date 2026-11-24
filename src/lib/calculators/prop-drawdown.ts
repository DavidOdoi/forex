import { Temporal } from "@js-temporal/polyfill";
import { CalculationError } from "./forex";
import { D, decimal, type Numeric } from "./precision";
import { parseCsvRows } from "./history-csv";

export type PropDrawdownInput = {
  initial: Numeric; balance: Numeric; floating: Numeric; unpostedCosts: Numeric;
  method: "static" | "eod-balance" | "intraday-balance" | "intraday-equity";
  overallMetric: "equity" | "balance"; dailyMetric: "equity" | "balance";
  overallUnit: "cash" | "percent"; overallLimit: Numeric; overallBasis: "initial" | "high";
  eligibleHigh: Numeric; cap?: Numeric;
  dailyEnabled: boolean; dailyReference: Numeric; dailyReferenceKind: "bod-balance" | "bod-equity" | "initial";
  dailyUnit: "cash" | "percent"; dailyLimit: Numeric; dailyBasis: "initial" | "reference";
  comparison: "touch" | "below"; zone: string; cutoff: string; localTime: string;
  referenceDate: string; history?: string;
};
const amount = (v: Numeric, label: string) => decimal(v, label, "-1000000000000");

export function propSession(localTime: string, zone: string, cutoff: string) {
  try {
    if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(localTime) || !/^\d\d:\d\d$/.test(cutoff)) throw new Error("Use YYYY-MM-DDTHH:mm and HH:mm.");
    const snapshot = Temporal.PlainDateTime.from(localTime, { overflow: "reject" }).toZonedDateTime(zone, { disambiguation: "reject" });
    const time = Temporal.PlainTime.from(cutoff, { overflow: "reject" });
    let date = snapshot.toPlainDate();
    let reset = date.toPlainDateTime(time).toZonedDateTime(zone, { disambiguation: "reject" });
    if (Temporal.ZonedDateTime.compare(reset, snapshot) > 0) { date = date.subtract({ days: 1 }); reset = date.toPlainDateTime(time).toZonedDateTime(zone, { disambiguation: "reject" }); }
    const next = date.add({ days: 1 }).toPlainDateTime(time).toZonedDateTime(zone, { disambiguation: "reject" });
    return { snapshot, reset, next, date: date.toString() };
  } catch (error) { throw new CalculationError(`Check the firm timezone, local timestamp and reset time. Ambiguous or nonexistent local times are rejected: ${error instanceof Error ? error.message : "invalid date"}`); }
}

export function calculatePropDrawdown(i: PropDrawdownInput) {
  if (!["static", "eod-balance", "intraday-balance", "intraday-equity"].includes(i.method) || !["touch", "below"].includes(i.comparison) || !["initial", "high"].includes(i.overallBasis) || !["initial", "reference"].includes(i.dailyBasis) || !["bod-balance", "bod-equity", "initial"].includes(i.dailyReferenceKind) || ![i.overallMetric, i.dailyMetric].every(m => ["equity", "balance"].includes(m))) throw new CalculationError("Choose valid rule methods, metrics and comparison.");
  const initial = decimal(i.initial, "starting account value", "0", undefined, true), balance = amount(i.balance, "current balance"), floating = amount(i.floating, "floating P&L"), costs = decimal(i.unpostedCosts, "costs not yet included");
  const equity = balance.add(floating).sub(costs), session = propSession(i.localTime, i.zone, i.cutoff);
  if (i.dailyEnabled && i.referenceDate !== session.date) throw new CalculationError(`Daily reference must be for the session starting ${session.date} in ${i.zone}. Confirm the actual reset observation.`);
  const allowance = (unit: string, value: Numeric, basis: InstanceType<typeof D>, label: string) => {
    if (unit === "cash") return decimal(value, `${label} cash allowance`, "0", undefined, true);
    if (unit !== "percent" || basis.lte(0)) throw new CalculationError(`Choose a valid ${label} unit and positive percentage basis.`);
    return basis.mul(decimal(value, `${label} percentage`, "0", "100", true)).div(100);
  };
  const cap = i.cap === undefined ? null : amount(i.cap, "floor-lock cap");
  const floorAt = (high: InstanceType<typeof D>) => {
    const loss = allowance(i.overallUnit, i.overallLimit, i.method === "static" || i.overallBasis === "initial" ? initial : high, "overall");
    const raw = (i.method === "static" ? initial : high).sub(loss);
    return { loss, raw, floor: cap !== null && i.method !== "static" ? D.min(raw, cap) : raw };
  };
  if (cap !== null && i.method === "static") throw new CalculationError("A floor lock applies only to trailing rules.");
  if (cap !== null && cap.lt(floorAt(initial).raw)) throw new CalculationError("The floor-lock cap cannot be lower than the initial trailing floor.");
  let high = i.method === "static" ? initial : D.max(initial, decimal(i.eligibleHigh, "highest eligible reference", "0", undefined, true));
  const timeline: { time: string; x: number; balance: InstanceType<typeof D>; equity: InstanceType<typeof D>; high: InstanceType<typeof D>; floor: InstanceType<typeof D> }[] = [];
  let observedHigh = initial, previous = -Infinity;
  const rows = i.history?.trim() ? parseCsvRows(i.history) : [];
  if (rows[0]?.[0].toLowerCase() === "timestamp") rows.shift();
  for (const row of rows) {
    if (row.length !== 3) throw new CalculationError("History rows need timestamp,balance,equity, with an explicit UTC offset or Z.");
    let time;
    try { time = Temporal.Instant.from(row[0]).toZonedDateTimeISO(i.zone); } catch { throw new CalculationError("Each history timestamp must be valid ISO 8601 with Z or an explicit offset."); }
    if (time.epochMilliseconds <= previous || time.epochMilliseconds > session.snapshot.epochMilliseconds) throw new CalculationError("History timestamps must be strictly increasing and no later than the entered snapshot.");
    previous = time.epochMilliseconds;
    if (i.method === "eod-balance" && (time.toPlainTime().toString({ smallestUnit: "minute" }) !== i.cutoff || time.second !== 0 || time.millisecond !== 0 || time.microsecond !== 0 || time.nanosecond !== 0)) throw new CalculationError("EOD history must contain eligible balance observations at the exact configured reset cutoff.");
    const b = amount(row[1], "history balance"), e = amount(row[2], "history equity");
    observedHigh = i.method === "static" ? initial : D.max(observedHigh, i.method === "intraday-equity" ? e : b);
    timeline.push({ time: time.toString(), x: time.epochMilliseconds, balance: b, equity: e, high: observedHigh, floor: floorAt(observedHigh).floor });
  }
  if (i.method !== "static") high = D.max(high, observedHigh, ...(i.method === "intraday-equity" ? [equity] : i.method === "intraday-balance" ? [balance] : []));
  const overall = floorAt(high), overallValue = i.overallMetric === "equity" ? equity : balance;
  const condition = (headroom: InstanceType<typeof D>) => i.comparison === "touch" ? headroom.lte(0) : headroom.lt(0);
  const overallRoom = overallValue.sub(overall.floor);
  const dailyReference = i.dailyReferenceKind === "initial" ? initial : amount(i.dailyReference, "daily reference");
  const dailyLoss = i.dailyEnabled ? allowance(i.dailyUnit, i.dailyLimit, i.dailyBasis === "initial" ? initial : dailyReference, "daily") : null;
  const dailyFloor = dailyLoss === null ? null : dailyReference.sub(dailyLoss), dailyValue = i.dailyMetric === "equity" ? equity : balance;
  const dailyRoom = dailyFloor === null ? null : dailyValue.sub(dailyFloor);
  const binding = dailyRoom !== null && dailyRoom.lt(overallRoom) ? "daily" : "overall";
  const headroom = dailyRoom === null ? overallRoom : D.min(overallRoom, dailyRoom);
  return { initial, balance, floating, costs, equity, session, high, overall, overallRoom, dailyReference, dailyLoss, dailyFloor, dailyRoom, binding, headroom, thresholdReached: condition(overallRoom) || (dailyRoom !== null && condition(dailyRoom)), atBoundary: headroom.isZero(), timeline };
}
