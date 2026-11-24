import { CalculationError } from "./forex";
import { calculateProfit, type ProfitInputs } from "./profit";
import { decimal, D, type Numeric } from "./precision";
import { tradePrice } from "./trade-core";
export type TakeProfitInputs = Omit<ProfitInputs, "exit" | "priceMode" | "spreadPips" | "slippagePips" | "commissionBasis" | "costCurrency"> & {
  mode: "pips" | "money" | "ratio" | "price"; targetPips: Numeric; targetMoney: Numeric; targetBasis: "gross" | "net";
  multiple: Numeric; ratioBasis: "gross" | "net"; stopPrice?: Numeric; explicitTarget?: Numeric; priceStep: Numeric;
};
export function calculateTakeProfit(input: TakeProfitInputs, now = Date.now()) {
  if (!["pips", "money", "ratio", "price"].includes(input.mode) || !["gross", "net"].includes(input.targetBasis) || !["gross", "net"].includes(input.ratioBasis)) throw new CalculationError("Choose valid target and profit conventions.");
  const engine: ProfitInputs = { ...input, exit: input.entry, priceMode: "fills", spreadPips: "0", slippagePips: "0", commissionBasis: "total", costCurrency: "account" };
  const base = calculateProfit(engine, now), entry = base.entry, side = input.direction === "buy" ? new D(1) : new D(-1);
  const step = decimal(input.priceStep, "permitted price increment", "0.0000000001", "1");
  if (step.decimalPlaces() > input.instrument.pricePrecision) throw new CalculationError("The price increment must fit the entered price precision.");
  const stop = input.stopPrice === undefined ? null : tradePrice(input.stopPrice, "planned stop price", input.instrument);
  if (stop && entry.sub(stop).mul(side).lte(0)) throw new CalculationError("A buy stop must be below entry; a sell stop must be above entry.");
  const stopResult = stop ? calculateProfit({ ...engine, exit: stop.toString() }, now) : null;
  let distance: InstanceType<typeof D>, objective: InstanceType<typeof D> | null = null;
  if (input.mode === "pips") distance = decimal(input.targetPips, "target pips", "0", "10000000", true).mul(base.pipSize);
  else if (input.mode === "price") distance = tradePrice(input.explicitTarget ?? "", "explicit profit target", input.instrument).sub(entry).mul(side);
  else {
    let requiredGross: InstanceType<typeof D>;
    if (input.mode === "money") {
      objective = decimal(input.targetMoney, "desired monetary profit", "0", "1000000000000", true);
      requiredGross = input.targetBasis === "net" ? objective.add(base.costs) : objective;
    } else {
      if (!stop || !stopResult) throw new CalculationError("Reward-to-risk targeting requires a valid stop price.");
      const multiple = decimal(input.multiple, "reward-to-risk multiple", "0", "1000000", true);
      if (input.ratioBasis === "gross") requiredGross = entry.sub(stop).abs().mul(base.units).mul(base.credit.factor).mul(multiple);
      else { if (stopResult.net.gte(0)) throw new CalculationError("A net reward-to-risk target needs a modeled net loss at the stop."); objective = stopResult.net.neg().mul(multiple); requiredGross = objective.add(base.costs); }
    }
    if (requiredGross.lte(0)) throw new CalculationError("The entered credit assumptions already meet the net objective without a favorable move. This conventional profit-target model requires a positive favorable distance.");
    distance = requiredGross.div(base.units.mul(base.credit.factor));
  }
  if (distance.lte(0)) throw new CalculationError("A buy profit target must be above entry and a sell profit target below entry.");
  const theoretical = entry.add(distance.mul(side));
  const rounded = theoretical.div(step).toDecimalPlaces(0, input.direction === "buy" ? D.ROUND_CEIL : D.ROUND_FLOOR).mul(step);
  if (theoretical.lte(0) || theoretical.gt(1000000000) || rounded.lte(0) || rounded.gt(1000000000)) throw new CalculationError("The target falls outside the supported positive price range.");
  const result = calculateProfit({ ...engine, exit: rounded.toString() }, now);
  const grossR = stop ? rounded.sub(entry).abs().div(entry.sub(stop).abs()) : null;
  const netR = stopResult && stopResult.net.lt(0) && result.net.gt(0) ? result.net.div(stopResult.net.neg()) : null;
  const domain = [entry, rounded, ...(stop ? [stop] : [])], low = D.min(...domain), high = D.max(...domain), width = high.sub(low);
  return { ...result, theoretical, rounded, targetPips: rounded.sub(entry).mul(side).div(base.pipSize), theoreticalPips: distance.div(base.pipSize), objective, stop, stopResult, grossR, netR, step,
    levels: [{ label: "Entry", price: entry }, { label: "Rounded profit target", price: rounded }, ...(stop ? [{ label: "Planned stop", price: stop }] : [])].sort((a, b) => a.price.comparedTo(b.price)).map(row => ({ ...row, position: row.price.sub(low).div(width).toNumber() })),
  };
}
