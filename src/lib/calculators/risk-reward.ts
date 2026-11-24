import { CalculationError } from "./forex";
import { calculateProfit, type ProfitInputs } from "./profit";
import { decimal, D, type Numeric } from "./precision";
import { tradePrice } from "./trade-core";

export type RiskRewardInputs = Omit<ProfitInputs, "exit" | "stop" | "target" | "equity"> & { stop: Numeric; target: Numeric; probability?: Numeric; extraTargets?: Numeric[] };
export function calculateRiskReward(input: RiskRewardInputs) {
  const entry = tradePrice(input.entry, "entry price", input.instrument);
  const stop = tradePrice(input.stop, "stop price", input.instrument);
  const target = tradePrice(input.target, "target price", input.instrument);
  const side = input.direction === "buy" ? new D(1) : new D(-1);
  const risk = entry.sub(stop).mul(side);
  const reward = target.sub(entry).mul(side);
  if (risk.lte(0) || reward.lte(0)) throw new CalculationError("For a buy, stop must be below entry and target above it. For a sell, stop must be above entry and target below it.");
  const lossResult = calculateProfit({ ...input, exit: input.stop });
  const winResult = calculateProfit({ ...input, exit: input.target });
  const loss = lossResult.net.neg();
  if (loss.lte(0)) throw new CalculationError("The modeled stop must produce a net loss for a conventional risk/reward calculation.");
  const win = winResult.net;
  const probability = input.probability === undefined ? null : decimal(input.probability, "assumed win probability", "0", "100").div(100);
  const evaluateTarget = (value: Numeric) => {
    const price = tradePrice(value, "alternative target price", input.instrument);
    const distance = price.sub(entry).mul(side);
    if (distance.lte(0)) throw new CalculationError("Every alternative target must be on the profitable side of entry.");
    const result = calculateProfit({ ...input, exit: value });
    return { price, pips: distance.div(winResult.pipSize), grossR: distance.div(risk), net: result.net, netR: result.net.gt(0) ? result.net.div(loss) : null };
  };
  return { riskPips: risk.div(winResult.pipSize), rewardPips: reward.div(winResult.pipSize), grossR: reward.div(risk), netR: win.gt(0) ? win.div(loss) : null, breakEven: win.gt(0) ? loss.div(win.add(loss)).mul(100) : null, loss, win, lossResult, winResult, conversion: winResult.conversion, probability, expectancy: probability === null ? null : probability.mul(win).sub(new D(1).sub(probability).mul(loss)), targets: [input.target, ...(input.extraTargets ?? [])].map(evaluateTarget) };
}
