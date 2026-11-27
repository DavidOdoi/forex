import { CalculationError } from "./forex";
import { D, decimal, type Numeric } from "./precision";
import { checkedAccount, tradePrice, tradeVolume } from "./trade-core";
import { convertLots } from "./lot-converter";
import { calculatePip } from "./pip";
import { calculateBreakEven } from "./break-even";
import { calculateMargin, marginAccountState } from "./margin";
import { calculateMarginCall } from "./margin-call";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";
import type { AccountCurrency, FxInstrument } from "./instruments";

type Dec = InstanceType<typeof D>;
export type ProgressionInput = {
  start: Numeric; multiplier: Numeric; levels: Numeric;
  minimum: Numeric; maximum: Numeric; increment: Numeric; rounding: "strict" | "down";
};
function integer(value: Numeric, label: string, minimum: number, maximum: number) {
  const n = decimal(value, label, String(minimum), String(maximum));
  if (!n.isInteger()) throw new CalculationError(`${label} must be a whole number.`);
  return n.toNumber();
}
export function martingaleProgression(i: ProgressionInput, instrument?: FxInstrument) {
  if (!["strict", "down"].includes(i.rounding)) throw new CalculationError("Choose strict volume validation or explicit downward rounding.");
  const limit = instrument ? "1000000" : "1000000000000";
  const start = decimal(i.start, "starting quantity", "0", limit, true);
  const multiplier = decimal(i.multiplier, "increasing-size multiplier", "1", "10");
  const levels = integer(i.levels, "number of modelled levels", 1, 20);
  const minimum = decimal(i.minimum, "minimum order quantity", "0.00000001", limit);
  const maximum = decimal(i.maximum, "maximum order quantity", minimum.toString(), limit);
  const increment = decimal(i.increment, "order quantity increment", "0.00000001", limit);
  if ([start, minimum, maximum, increment].some(n => n.decimalPlaces() > 8)) throw new CalculationError("Quantity inputs support at most eight decimal places.");
  let total = new D(0);
  const rows = Array.from({ length: levels }, (_, index) => {
    const theoretical = start.mul(multiplier.pow(index));
    if (theoretical.gt(limit)) throw new CalculationError("The progression exceeds the supported quantity range. Reduce its size, multiplier or level count.");
    // Validate an unrounded quantity against the existing configured-lot grid.
    const grid = instrument ? convertLots({ instrument, account: instrument.quote, volume: theoretical.toString(), inputUnit: "configured", pipEnabled: false, rates: [], grid: { minimum: minimum.toString(), maximum: maximum.toString(), step: increment.toString() } }).grid! : null;
    const offset = theoretical.sub(minimum).div(increment);
    const size = i.rounding === "down" && theoretical.gte(minimum) ? minimum.add(offset.floor().mul(increment)) : theoretical;
    const issues: string[] = [];
    if (theoretical.lt(minimum)) issues.push("Below minimum; no upward adjustment");
    if (size.gt(maximum)) issues.push("Above per-order maximum; not capped");
    if (i.rounding === "strict" && !(grid ? grid.compatible : offset.isInteger()) && !theoretical.lt(minimum) && !theoretical.gt(maximum)) issues.push("Off the minimum-plus-increment grid");
    total = total.add(size);
    if (total.gt(limit)) throw new CalculationError("Aggregate modelled quantity exceeds the supported range. Use a smaller progression.");
    return { level: index + 1, theoretical, size, cumulative: total, issues };
  });
  const theoreticalTotal = multiplier.eq(1) ? start.mul(levels) : start.mul(multiplier.pow(levels).sub(1)).div(multiplier.sub(1));
  return { rows, start, multiplier, levels, minimum, maximum, increment, total, theoreticalTotal };
}

export type SequentialInput = Omit<ProgressionInput, "levels"> & {
  losses: Numeric; account: AccountCurrency; balance: Numeric; lossPerUnit: Numeric; winPerUnit: Numeric;
  lossFeePerUnit: Numeric; winFeePerUnit: Numeric; fixedFee: Numeric; reservePerUnit: Numeric;
};
export function calculateSequentialMartingale(i: SequentialInput) {
  checkedAccount(i.account);
  const losses = integer(i.losses, "completed consecutive losses", 0, 19);
  const plan = martingaleProgression({ ...i, levels: losses + 1 });
  const balance = decimal(i.balance, "starting account balance", "0", "1000000000000", true);
  const lossPerUnit = decimal(i.lossPerUnit, "gross loss per quantity unit", "0", "1000000000000", true);
  const winPerUnit = decimal(i.winPerUnit, "gross winning payoff per quantity unit");
  const lossFee = decimal(i.lossFeePerUnit, "losing-trade fee per unit"), winFee = decimal(i.winFeePerUnit, "winning-trade fee per unit");
  const fixed = decimal(i.fixedFee, "fixed fee per closed trade"), reserve = decimal(i.reservePerUnit, "required opening reserve per unit");
  let cumulativeLoss = new D(0), capitalFloor = new D(0), firstFailure: { level: number; reason: string } | null = null;
  const allRows = plan.rows.map(row => {
    const before = balance.sub(cumulativeLoss), requiredReserve = row.size.mul(reserve);
    const modelledLoss = row.size.mul(lossPerUnit.add(lossFee)).add(fixed);
    capitalFloor = D.max(capitalFloor, cumulativeLoss.add(D.max(modelledLoss, requiredReserve)));
    const issues = [...row.issues];
    if (before.lte(0)) issues.push("No positive balance remains before this trade");
    if (before.lt(requiredReserve)) issues.push("Opening reserve exceeds remaining balance");
    if (row.level <= losses && before.lt(modelledLoss)) issues.push("Insufficient capital to absorb this assumed loss");
    if (!firstFailure && issues.length) firstFailure = { level: row.level, reason: issues.join("; ") };
    const result = { ...row, before, requiredReserve, modelledLoss, cumulativeLoss: cumulativeLoss.add(modelledLoss), after: before.sub(modelledLoss), issues, blocked: firstFailure !== null };
    if (row.level <= losses) cumulativeLoss = cumulativeLoss.add(modelledLoss);
    return result;
  });
  const next = allRows.at(-1)!;
  const winNet = next.size.mul(winPerUnit.sub(winFee)).sub(fixed), sequenceResult = winNet.sub(cumulativeLoss);
  return { ...plan, losses, balance, rows: allRows.slice(0, losses), next, cumulativeLoss, remaining: balance.sub(cumulativeLoss), winNet, sequenceResult, capitalFloor, firstFailure: firstFailure as { level: number; reason: string } | null };
}

export type GridInput = ProgressionInput & {
  instrument: FxInstrument; account: AccountCurrency; direction: "buy" | "sell"; firstEntry: Numeric; spacing: Numeric;
  spreadPips: Numeric; balance: Numeric; entryFeePerLot: Numeric; exitFeePerLot: Numeric; fixedEntryFee: Numeric; financingPerLot: Numeric;
  marginMode: "leverage" | "percent"; leverage: Numeric; marginPercent: Numeric;
  thresholds: boolean; callPercent: Numeric; stopPercent: Numeric; rates: ExchangeRate[];
};
export function calculateMartingaleGrid(i: GridInput) {
  checkedAccount(i.account);
  if (!["buy", "sell"].includes(i.direction) || typeof i.thresholds !== "boolean") throw new CalculationError("Choose a valid direction and threshold setting.");
  const spec = tradeVolume(i.instrument, "1", "lots"), plan = martingaleProgression(i, i.instrument);
  const first = tradePrice(i.firstEntry, "first executed entry price", i.instrument);
  const requestedSpacing = decimal(i.spacing, "grid distance in pips", "0", "1000000", true).mul(spec.pipSize);
  const tick = new D(10).pow(-i.instrument.pricePrecision), spacing = requestedSpacing.div(tick).ceil().mul(tick);
  const spread = decimal(i.spreadPips, "closing bid/ask spread in pips", "0", "1000000").mul(spec.pipSize);
  if (!spread.div(tick).isInteger()) throw new CalculationError("The assumed spread must fit the configured price increment.");
  const balance = decimal(i.balance, "starting balance / equity before this grid", "0", "1000000000000", true);
  const entryFee = decimal(i.entryFeePerLot, "opening fee per lot"), exitFee = decimal(i.exitFeePerLot, "closing fee per lot");
  const fixed = decimal(i.fixedEntryFee, "fixed opening fee per position"), financing = decimal(i.financingPerLot, "signed accrued financing per lot", "-1000000000000");
  const debit = resolveConversion(i.instrument.quote, i.account, i.rates, Date.now(), "liability"), credit = resolveConversion(i.instrument.quote, i.account, i.rates, Date.now(), "asset");
  const side = i.direction === "buy" ? new D(1) : new D(-1);
  const entries = plan.rows.map(row => ({ ...row, entry: tradePrice(first.sub(spacing.mul(row.level - 1).mul(side)).toString(), "grid entry", i.instrument), units: row.size.mul(spec.contract) }));
  let firstFailure: { level: number; reason: string } | null = null;
  const snapshot = (count: number, entrySide: Dec) => {
    const selected = entries.slice(0, count), lots = selected.at(-1)!.cumulative, units = lots.mul(spec.contract);
    const exit = tradePrice(entrySide.sub(spread.mul(side)).toString(), "executable closing side", i.instrument);
    const quotePnl = selected.reduce((sum, row) => sum.add(exit.sub(row.entry).mul(side).mul(row.units)), new D(0));
    const gross = quotePnl.mul(quotePnl.gte(0) ? credit.factor : debit.factor);
    const openingCosts = lots.mul(entryFee).add(fixed.mul(count)), closingCosts = lots.mul(exitFee), carry = lots.mul(financing);
    const equity = balance.add(gross).sub(openingCosts).add(carry), netPnl = gross.sub(openingCosts).sub(closingCosts).add(carry);
    // Base/account valuation and quote/account conversions follow the shared margin model.
    const margin = calculateMargin({ instrument: i.instrument, account: i.account, volume: lots.toString(), volumeMode: "lots", price: exit.toString(), marginMode: i.marginMode, leverage: i.leverage, marginPercent: i.marginPercent, rates: i.rates });
    const state = marginAccountState(equity.toString(), margin.required.toString(), { allowNegativeEquity: true });
    const threshold = i.thresholds ? calculateMarginCall({ account: i.account, equityMode: "equity", equity: equity.toString(), balance: "0", floating: "0", used: margin.required.toString(), callPercent: i.callPercent, stopPercent: i.stopPercent, comparison: "at-or-below", deposit: "0", withdrawal: "0", pnlChange: "0", costs: "0", profile: { mode: "illustration" } }).current : null;
    return { lots, units, exit, quotePnl, gross, openingCosts, closingCosts, carry, equity, netPnl, margin, state, threshold };
  };
  const rows = entries.map(row => {
    const s = snapshot(row.level, row.entry), issues = [...row.issues];
    if (s.equity.lte(0)) issues.push("No positive modelled equity");
    if (s.state.insufficient) issues.push("Insufficient free margin after this addition");
    if (s.threshold?.status === "At entered stop-out condition") issues.push("Entered stop-out condition reached at or before this level");
    if (!firstFailure && issues.length) firstFailure = { level: row.level, reason: issues.join("; ") };
    return { ...row, ...s, issues, blocked: firstFailure !== null };
  });
  const last = rows.at(-1)!, furtherEntry = last.entry.sub(spacing.mul(side));
  // A non-positive further scenario is unavailable rather than a negative FX quote.
  const further = furtherEntry.gt(0) && furtherEntry.lte(1000000000) && furtherEntry.sub(spread.mul(side)).gt(0) ? snapshot(rows.length, furtherEntry) : null;
  const beInput = { instrument: i.instrument, account: i.account, direction: i.direction, volumeMode: "lots" as const, entries: entries.map(row => ({ volume: row.size.toString(), price: row.entry.toString() })), commission: last.openingCosts.toString(), exitCosts: last.closingCosts.toString(), swap: last.carry.toString(), costCurrency: "account" as const, priceMode: "fills" as const, spreadPips: "0", rates: i.rates };
  const grossBreakEven = calculateBreakEven({ ...beInput, commission: "0", exitCosts: "0", swap: "0" });
  const netBreakEven = calculateBreakEven(beInput);
  const pip = calculatePip({ instrument: i.instrument, account: i.account, volume: last.lots.toString(), volumeMode: "lots", pips: "1", rates: i.rates });
  return { ...plan, rows, last, further, firstFailure: firstFailure as { level: number; reason: string } | null, balance, spacing, requestedSpacing, spread, tick, debit, credit, pip, grossBreakEven, netBreakEven,
    grossRecovery: grossBreakEven.theoretical.sub(last.exit).mul(side).div(spec.pipSize),
    netRecovery: netBreakEven.theoretical.sub(last.exit).mul(side).div(spec.pipSize),
    maxModelledLoss: D.max(0, ...rows.map(row => row.netPnl.neg()), ...(further ? [further.netPnl.neg()] : [])) };
}
