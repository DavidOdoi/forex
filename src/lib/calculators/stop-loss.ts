import { CalculationError } from "./forex";
import { calculateProfit, type ProfitInputs } from "./profit";
import { decimal, D, type Numeric } from "./precision";
import { tradePrice } from "./trade-core";
export type StopLossInputs = Omit<ProfitInputs, "exit" | "priceMode" | "spreadPips" | "slippagePips" | "commissionBasis" | "costCurrency"> & {
  mode: "pips" | "price" | "money" | "percent" | "atr"; stopPips: Numeric; stopPrice?: Numeric;
  riskAmount: Numeric; riskPercent: Numeric; riskBasis: "gross" | "net"; accountEquity?: Numeric;
  atr: Numeric; atrUnit: "pips" | "price"; atrMultiple: Numeric; priceStep: Numeric;
};
export function calculateStopLoss(input: StopLossInputs, now = Date.now()) {
  if (!["pips", "price", "money", "percent", "atr"].includes(input.mode) || !["gross", "net"].includes(input.riskBasis) || !["pips", "price"].includes(input.atrUnit)) throw new CalculationError("Choose valid stop, risk and ATR conventions.");
  const engine: ProfitInputs = { ...input, exit: input.entry, priceMode: "fills", spreadPips: "0", slippagePips: "0", commissionBasis: "total", costCurrency: "account" };
  const base = calculateProfit(engine, now), entry = base.entry, side = input.direction === "buy" ? new D(1) : new D(-1);
  const step = decimal(input.priceStep, "permitted stop-price increment", "0.0000000001", "1");
  if (step.decimalPlaces() > input.instrument.pricePrecision) throw new CalculationError("The price increment must fit the entered price precision.");
  const equity = input.accountEquity === undefined ? null : decimal(input.accountEquity, "account equity for risk percentage", "0", "1000000000000", true);
  let distance: InstanceType<typeof D>, budget: InstanceType<typeof D> | null = null;
  if (input.mode === "pips") distance = decimal(input.stopPips, "stop pips", "0", "10000000", true).mul(base.pipSize);
  else if (input.mode === "price") distance = entry.sub(tradePrice(input.stopPrice ?? "", "planned executable stop price", input.instrument)).mul(side);
  else if (input.mode === "atr") distance = decimal(input.atr, "entered ATR", "0", "1000000000", true).mul(decimal(input.atrMultiple, "ATR multiplier", "0", "1000000", true)).mul(input.atrUnit === "pips" ? base.pipSize : 1);
  else {
    if (input.mode === "percent" && !equity) throw new CalculationError("Percentage-risk mode requires positive account equity.");
    budget = input.mode === "percent" ? equity!.mul(decimal(input.riskPercent, "chosen risk percentage", "0", "100", true)).div(100) : decimal(input.riskAmount, "chosen cash risk", "0", "1000000000000", true);
    const priceLoss = input.riskBasis === "net" ? budget.sub(base.costs) : budget;
    if (priceLoss.lte(0)) throw new CalculationError("Entered costs use the entire net risk allowance. No positive adverse stop distance fits this budget.");
    distance = priceLoss.div(base.units.mul(base.debit.factor));
  }
  if (distance.lte(0)) throw new CalculationError("A protective buy stop must be below entry and a protective sell stop above entry, with a positive distance.");
  const theoretical = entry.sub(distance.mul(side));
  // Round toward entry so the chosen adverse-distance/risk ceiling is not exceeded.
  const rounded = theoretical.div(step).toDecimalPlaces(0, input.direction === "buy" ? D.ROUND_CEIL : D.ROUND_FLOOR).mul(step);
  if (theoretical.lte(0) || theoretical.gt(1000000000) || rounded.lte(0) || rounded.gt(1000000000) || entry.sub(rounded).mul(side).lte(0)) throw new CalculationError("No positive adverse-side stop fits this entered price grid and distance. Check the actual increment and position plan.");
  const result = calculateProfit({ ...engine, exit: rounded.toString() }, now), grossLoss = result.gross.neg(), netLoss = result.net.neg();
  const low = D.min(entry, rounded), width = entry.sub(rounded).abs();
  return { ...result, theoretical, rounded, step, budget, equity, grossLoss, netLoss, estimatedRiskPercent: equity ? netLoss.div(equity).mul(100) : null, stopPips: entry.sub(rounded).mul(side).div(base.pipSize), theoreticalPips: distance.div(base.pipSize),
    levels: [{ label: "Entry", price: entry }, { label: "Rounded protective stop", price: rounded }].sort((a, b) => a.price.comparedTo(b.price)).map(row => ({ ...row, position: row.price.sub(low).div(width).toNumber() })) };
}
