import { CalculationError } from "./forex";
import { conventionalInstrument, isAccountCurrency, isPair, type AccountCurrency, type FxInstrument } from "./instruments";
import { decimal, D, type Numeric } from "./precision";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";

export type LotSizeInputs = {
  instrument: FxInstrument; account: AccountCurrency; equity: Numeric;
  riskMode: "percent" | "cash"; risk: Numeric;
  stopMode: "pips" | "prices"; stopPips: Numeric; entry: Numeric; stopPrice: Numeric; side: "buy" | "sell";
  includeCosts: boolean; spreadMode: "included" | "additional"; spreadPips: Numeric;
  commissionPerLot: Numeric; fixedCosts: Numeric; rates: ExchangeRate[];
};

export function lotSizeModel(input: LotSizeInputs, now = Date.now()) {
  const spec = input.instrument;
  if (!isPair(spec.symbol) || spec.category !== "forex") throw new CalculationError("This calculator supports the listed forex pairs, not gold, crypto or index contracts.");
  const convention = conventionalInstrument(spec.symbol);
  if (spec.base !== convention.base || spec.quote !== convention.quote || !isAccountCurrency(input.account)) throw new CalculationError("The instrument's currency specification does not match the pair.");
  if (!["percent", "cash"].includes(input.riskMode) || !["pips", "prices"].includes(input.stopMode) || !["buy", "sell"].includes(input.side) || !["included", "additional"].includes(input.spreadMode) || typeof input.includeCosts !== "boolean") throw new CalculationError("Choose valid risk, stop-loss and cost modes.");
  if (!Number.isInteger(spec.pricePrecision) || spec.pricePrecision < 0 || spec.pricePrecision > 10) throw new CalculationError("Price precision must be a whole number from 0 to 10.");
  const equity = decimal(input.equity, "account balance/equity", "0", "1000000000000", true);
  const risk = decimal(input.risk, input.riskMode === "percent" ? "risk percentage" : "fixed risk", "0", input.riskMode === "percent" ? "100" : equity.toString(), true);
  const budget = input.riskMode === "percent" ? equity.mul(risk).div(100) : risk;
  const contract = decimal(spec.contractSize, "units per lot", "1", "1000000000");
  const pipSize = decimal(spec.pipSize, "pip size", "0.0000000001", "1");
  if (pipSize.decimalPlaces() > spec.pricePrecision) throw new CalculationError("Price precision must be at least the number of decimal places in the pip size.");
  const minimum = decimal(spec.minimumLots, "minimum volume", "0.00000001", "1000000");
  const maximum = decimal(spec.maximumLots, "maximum volume", minimum.toString(), "1000000");
  const step = decimal(spec.lotStep, "lot increment", "0.00000001", "1000000");
  if ([minimum, maximum, step].some(value => value.decimalPlaces() > 8)) throw new CalculationError("Broker lot limits support up to eight decimal places.");
  const maximumOnGrid = minimum.add(maximum.sub(minimum).div(step).floor().mul(step));
  let stop = decimal(input.stopMode === "pips" ? input.stopPips : "1", "stop-loss distance", "0", "10000000", true);
  if (input.stopMode === "prices") {
    const entry = decimal(input.entry, "entry price", "0", "1000000000", true);
    const exit = decimal(input.stopPrice, "stop-loss price", "0", "1000000000", true);
    if (entry.decimalPlaces() > spec.pricePrecision || exit.decimalPlaces() > spec.pricePrecision) throw new CalculationError(`Entry and stop prices support at most ${spec.pricePrecision} decimal places for this specification.`);
    if ((input.side === "buy" && exit.gte(entry)) || (input.side === "sell" && exit.lte(entry))) throw new CalculationError(`For a ${input.side}, the stop-loss price must be ${input.side === "buy" ? "below" : "above"} the entry price.`);
    stop = entry.sub(exit).abs().div(pipSize);
    if (stop.gt(10000000)) throw new CalculationError("The stop-loss distance exceeds the supported range.");
  }
  const conversion = resolveConversion(spec.quote, input.account, input.rates, now);
  const quotePipValue = contract.mul(pipSize);
  const pipValuePerLot = quotePipValue.mul(conversion.factor);
  const spread = decimal(input.spreadPips, "spread in pips", "0", "1000000");
  const commission = decimal(input.commissionPerLot, "round-trip commission per lot", "0", "1000000000");
  const fixed = decimal(input.fixedCosts, "fixed trading costs", "0", "1000000000");
  const priceRiskPerLot = stop.mul(pipValuePerLot);
  const variableCostsPerLot = commission.add(input.spreadMode === "additional" ? spread.mul(pipValuePerLot) : 0);
  const lossPerLot = priceRiskPerLot.add(input.includeCosts ? variableCostsPerLot : 0);
  const available = budget.sub(input.includeCosts ? fixed : 0);
  const theoreticalLots = available.gt(0) ? available.div(lossPerLot) : new D(0);
  if (!theoreticalLots.isFinite() || theoreticalLots.gt("1000000000000000000")) throw new CalculationError("The calculated volume exceeds the supported range. Check the stop, pip and contract inputs.");
  const estimate = (lots: Numeric) => {
    const volume = decimal(lots, "scenario volume", "0", "1000000");
    const priceRisk = volume.mul(priceRiskPerLot);
    const costs = volume.gt(0) ? volume.mul(variableCostsPerLot).add(fixed) : new D(0);
    const totalRisk = priceRisk.add(costs);
    const budgetedRisk = input.includeCosts ? totalRisk : priceRisk;
    return { lots: volume, priceRisk, costs, totalRisk, budgetedRisk, withinBudget: budgetedRisk.lte(budget) };
  };
  return { budget, equity, contract, pipSize, stopPips: stop, minimum, maximum, maximumOnGrid, step, conversion, quotePipValue, pipValuePerLot, priceRiskPerLot, variableCostsPerLot, fixed, theoreticalLots, estimate };
}

export function calculateLotSize(input: LotSizeInputs, now = Date.now()) {
  const model = lotSizeModel(input, now);
  const { minimum, maximumOnGrid, step, theoreticalLots, budget } = model;
  // Broker grid: minimum + n × increment. A zero-anchored grid is incorrect
  // for specifications such as a 0.03 minimum with a 0.02 increment.
  let lots = theoreticalLots.lt(minimum) ? new D(0) : minimum.add(D.min(theoreticalLots, maximumOnGrid).sub(minimum).div(step).floor().mul(step));
  // Final conservative guard against any finite-precision boundary artefact.
  if (lots.gt(0) && !model.estimate(lots.toString()).withinBudget) lots = lots.sub(step).gte(minimum) ? lots.sub(step) : new D(0);
  const actual = model.estimate(lots.toString());
  const minimumEstimate = model.estimate(minimum.toString());
  const candidates = [minimum, lots, lots.add(step)].filter(value => value.gte(minimum) && value.lte(maximumOnGrid));
  const scenarios = candidates.filter((value, index) => candidates.findIndex(other => other.eq(value)) === index).sort((a, b) => a.comparedTo(b)).map(value => model.estimate(value.toString()));
  return { ...model, ...actual, units: lots.mul(model.contract), pipValue: lots.mul(model.pipValuePerLot), unusedBudget: budget.sub(actual.budgetedRisk), totalBudgetGap: budget.sub(actual.totalRisk),
    executable: lots.gt(0), cappedAtMaximum: theoreticalLots.gt(maximumOnGrid), minimumEstimate, scenarios,
    reason: theoreticalLots.lt(minimum) ? (model.fixed.gte(budget) && input.includeCosts ? "costs-exceed-budget" : "below-minimum") : null };
}

export function estimateLotMargin(input: LotSizeInputs, lots: Numeric, leverage: Numeric, freeMargin: Numeric, price: Numeric, now = Date.now()) {
  const size = decimal(lots, "volume", "0", "1000000");
  const ratio = decimal(leverage, "leverage", "1", "10000");
  const available = decimal(freeMargin, "available margin", "0", "1000000000000");
  const baseRate = input.instrument.base === input.account ? new D(1)
    : decimal(price, "margin reference price", "0", "1000000000", true).mul(resolveConversion(input.instrument.quote, input.account, input.rates, now).factor);
  const required = size.mul(decimal(input.instrument.contractSize, "units per lot", "1", "1000000000")).mul(baseRate).div(ratio);
  return { required, available, remaining: available.sub(required), affordable: available.gte(required) };
}
