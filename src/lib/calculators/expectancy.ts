import { CalculationError } from "./forex";
import { D, decimal, type Numeric } from "./precision";
type WeightedOutcome = { probability: InstanceType<typeof D>; outcome: InstanceType<typeof D> };
export function outcomeStatistics(rows: WeightedOutcome[], divisor = new D(1)) {
  const sum = (selected: WeightedOutcome[]) => selected.reduce((total,row)=>total.add(row.probability.mul(row.outcome)),new D(0));
  const weights = (selected: WeightedOutcome[]) => selected.reduce((total,row)=>total.add(row.probability),new D(0));
  const winners=rows.filter(row=>row.outcome.gt(0)),losers=rows.filter(row=>row.outcome.lt(0));
  const rawGain=sum(winners),rawLoss=sum(losers).neg(),winWeight=weights(winners),lossWeight=weights(losers);
  const mean=sum(rows).div(divisor),gain=rawGain.div(divisor),loss=rawLoss.div(divisor);
  const winProbability=winWeight.div(divisor),lossProbability=lossWeight.div(divisor),zeroProbability=weights(rows.filter(row=>row.outcome.isZero())).div(divisor);
  const averageWin=winWeight.gt(0)?rawGain.div(winWeight):null,averageLoss=lossWeight.gt(0)?rawLoss.div(lossWeight):null;
  return {mean,gain,loss,winProbability,lossProbability,zeroProbability,averageWin,averageLoss,profitFactor:rawLoss.gt(0)?rawGain.div(rawLoss):null,payoff:averageWin!==null&&averageLoss!==null&&averageLoss.gt(0)?averageWin.div(averageLoss):null,normalized:averageLoss!==null&&averageLoss.gt(0)?mean.div(averageLoss):null};
}
export type ExpectancySummaryInput = { winPercent: Numeric; zeroPercent: Numeric; averageWin: Numeric; averageLoss: Numeric; basis: "gross" | "net"; extraCost: Numeric; count?: Numeric; initialRisk?: Numeric };
export function calculateExpectancy(i: ExpectancySummaryInput) {
  if (!["gross", "net"].includes(i.basis)) throw new CalculationError("Choose gross or already-net input outcomes.");
  const win = decimal(i.winPercent, "winning share", "0", "100").div(100), zero = decimal(i.zeroPercent, "zero-result share", "0", "100").div(100);
  if (win.add(zero).gt(1)) throw new CalculationError("Winning and zero-result percentages cannot exceed 100% together.");
  const losing = new D(1).sub(win).sub(zero), averageWin = decimal(i.averageWin, "average winning amount"), averageLoss = decimal(i.averageLoss, "average loss magnitude");
  if (win.gt(0) && averageWin.lte(0) || losing.gt(0) && averageLoss.lte(0)) throw new CalculationError("A nonzero winning/losing category needs a positive corresponding average magnitude. Classify zero outcomes separately.");
  const cost = i.basis === "gross" ? decimal(i.extraCost, "additional average cost") : new D(0);
  const raw = [{ probability: win, outcome: averageWin }, { probability: losing, outcome: averageLoss.neg() }, { probability: zero, outcome: new D(0) }];
  const before = outcomeStatistics(raw), net = outcomeStatistics(raw.map(row => ({ ...row, outcome: row.outcome.sub(cost) })));
  const count = i.count === undefined ? null : decimal(i.count, "trade count", "1", "1000000");
  if (count !== null && !count.isInteger()) throw new CalculationError("Trade count must be a whole number.");
  const risk = i.initialRisk === undefined ? null : decimal(i.initialRisk, "common initial risk", "0", undefined, true);
  const denominator = averageWin.add(averageLoss), breakeven = denominator.gt(0) ? new D(1).sub(zero).mul(averageLoss).add(cost).div(denominator) : null;
  const attainable = breakeven !== null && breakeven.lte(new D(1).sub(zero));
  return { win, zero, losing, averageWin, averageLoss, cost, before, net, count, expectedTotal: count === null ? null : net.mean.mul(count), meanR: risk === null ? null : net.mean.div(risk), breakeven: attainable ? breakeven : null, decisiveBreakeven: attainable && zero.lt(1) ? breakeven!.div(new D(1).sub(zero)) : null };
}

export type ExpectancyTrade = { outcome: string; cost?: string; risk?: string; date?: string };
export function expectancyHistory(trades: ExpectancyTrade[], basis: "gross" | "net", feeMode: "column" | "flat", flatCost: Numeric) {
  if (!trades.length || trades.length > 1000 || !["gross", "net"].includes(basis) || !["column", "flat"].includes(feeMode)) throw new CalculationError("Use 1–1,000 trades and valid result/cost modes.");
  const fixed = basis === "gross" && feeMode === "flat" ? decimal(flatCost, "additional cost per trade") : new D(0);
  const hasRisk = trades.some(trade => trade.risk !== undefined);
  if (hasRisk && trades.some(trade => trade.risk === undefined)) throw new CalculationError("Initial risk must be present for every selected trade or omitted for all.");
  let cumulative = new D(0), peak = new D(0);
  const rows = trades.map((trade, index) => {
    const raw = decimal(trade.outcome, "trade P&L", "-1000000000000"), cost = basis === "net" ? new D(0) : feeMode === "flat" ? fixed : decimal(trade.cost ?? "", "additional trade cost");
    const net = raw.sub(cost), risk = hasRisk ? decimal(trade.risk!, "individual initial risk", "0", undefined, true) : null;
    cumulative = cumulative.add(net); peak = D.max(peak, cumulative);
    return { index, date: trade.date, raw, cost, net, risk, r: risk === null ? null : net.div(risk), cumulative, peak };
  });
  const net = outcomeStatistics(rows.map(row => ({ probability: new D(1), outcome: row.net })),new D(rows.length));
  // Exact totals/count prevent rounded probability sums from perturbing the sample mean.
  const total = rows.reduce((sum, row) => sum.add(row.net), new D(0)); net.mean = total.div(rows.length);
  const meanR = hasRisk ? rows.reduce((sum, row) => sum.add(row.r!), new D(0)).div(rows.length) : null;
  const totalCost = rows.reduce((sum, row) => sum.add(row.cost), new D(0));
  const breakeven = net.averageWin !== null && net.averageLoss !== null ? new D(1).sub(net.zeroProbability).mul(net.averageLoss).div(net.averageWin.add(net.averageLoss)) : null;
  return { net, rows, total, meanR, totalCost, count: rows.length, breakeven };
}
