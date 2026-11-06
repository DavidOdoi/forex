// Deliverable forex estimates, not a margin engine or broker settlement ledger.
export const currencies = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD"] as const;
export type Currency = typeof currencies[number];
export const pairCodes = [
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD",
  "EUR/GBP", "EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "CHF/JPY", "NZD/JPY",
  "EUR/CHF", "EUR/AUD", "EUR/CAD", "EUR/NZD", "GBP/AUD", "GBP/CAD", "GBP/CHF",
  "GBP/NZD", "AUD/CAD", "AUD/CHF", "AUD/NZD", "NZD/CAD", "NZD/CHF", "CAD/CHF",
] as const;
export type PairCode = typeof pairCodes[number];
export type ConversionQuote = { base: Currency; quote: Currency; bid: number; ask: number };
export type FxInputs = { pair: PairCode; account: Currency; contractSize: number; conversion?: ConversionQuote };

export class CalculationError extends Error {
  constructor(message: string) { super(message); this.name = "CalculationError"; }
}

export function range(value: number, label: string, min: number, max: number, exclusiveMin = false) {
  if (!Number.isFinite(value) || (exclusiveMin ? value <= min : value < min) || value > max) {
    const display = (amount: number) => amount !== 0 && Math.abs(amount) < 0.000001 ? amount.toExponential() : amount.toLocaleString("en", { maximumFractionDigits: 12 });
    throw new CalculationError(`${label} must be ${exclusiveMin ? "greater than" : "at least"} ${display(min)} and at most ${display(max)}.`);
  }
  return value;
}

export function currency(value: string): Currency {
  if (!(currencies as readonly string[]).includes(value)) throw new CalculationError("Choose a supported account currency.");
  return value as Currency;
}

export function pairInfo(pair: PairCode) {
  if (!(pairCodes as readonly string[]).includes(pair)) throw new CalculationError("Choose a supported forex pair.");
  const [base, quote] = pair.split("/") as [Currency, Currency];
  const pipSize = quote === "JPY" ? 0.01 : 0.0001;
  return { base, quote, pipSize, pipetteSize: pipSize / 10 };
}

/** The account-currency cost/proceeds of one unit of source currency.
 * Asset: sell source. Liability: buy source to cover a loss.
 * Direct SOURCE/ACCOUNT uses bid for proceeds, ask for liabilities.
 * Inverse ACCOUNT/SOURCE uses 1/ask for proceeds, 1/bid for liabilities.
 */
export function conversionFactor(source: Currency, account: Currency, flow: "asset" | "liability", rate?: ConversionQuote) {
  currency(source); currency(account);
  if (source === account) return 1;
  if (!rate) throw new CalculationError(`Enter the conversion bid and ask to convert ${source} into ${account}.`);
  range(rate.bid, "Conversion bid", 1e-12, 1e9);
  range(rate.ask, "Conversion ask", 1e-12, 1e9);
  if (rate.ask < rate.bid) throw new CalculationError("Conversion ask must be equal to or higher than bid.");
  if (rate.base === source && rate.quote === account) return flow === "asset" ? rate.bid : rate.ask;
  if (rate.base === account && rate.quote === source) return 1 / (flow === "asset" ? rate.ask : rate.bid);
  throw new CalculationError(`The conversion pair must connect ${source} and ${account}.`);
}

export function defaultConversionDirection(source: Currency, account: Currency): "direct" | "inverse" {
  return (pairCodes as readonly string[]).includes(`${account}/${source}`) ? "inverse" : "direct";
}

function contract(inputs: FxInputs) {
  const info = pairInfo(inputs.pair);
  currency(inputs.account);
  range(inputs.contractSize, "Units per lot", 1, 1e9);
  return info;
}

export function calculateProfit(inputs: FxInputs & { side: "buy" | "sell"; lots: number; entry: number; exit: number; commission: number; swap: number }) {
  const info = contract(inputs);
  if (inputs.side !== "buy" && inputs.side !== "sell") throw new CalculationError("Choose buy or sell.");
  range(inputs.lots, "Position size in lots", 0, 1e6, true);
  range(inputs.entry, "Entry price", 1e-12, 1e9);
  range(inputs.exit, "Exit price", 1e-12, 1e9);
  range(inputs.commission, "Round-trip commission", 0, 1e12);
  range(inputs.swap, "Swap adjustment", -1e12, 1e12);
  const units = inputs.lots * inputs.contractSize;
  const move = (inputs.exit - inputs.entry) * (inputs.side === "buy" ? 1 : -1);
  const quoteGross = move * units;
  const factor = conversionFactor(info.quote, inputs.account, quoteGross < 0 ? "liability" : "asset", inputs.conversion);
  const accountGross = quoteGross * factor;
  return { ...info, units, pips: move / info.pipSize, quoteGross, accountGross, conversionRate: factor,
    commission: inputs.commission, swap: inputs.swap, net: accountGross - inputs.commission + inputs.swap };
}

export function calculatePip(inputs: FxInputs & { lots: number }) {
  const info = contract(inputs);
  range(inputs.lots, "Position size in lots", 0, 1e6, true);
  const units = inputs.lots * inputs.contractSize;
  const quoteValue = units * info.pipSize;
  const gain = quoteValue * conversionFactor(info.quote, inputs.account, "asset", inputs.conversion);
  const loss = quoteValue * conversionFactor(info.quote, inputs.account, "liability", inputs.conversion);
  return { ...info, units, quoteValue, gain, loss, pipetteGain: gain / 10, pipetteLoss: loss / 10 };
}

export function calculateRisk(balance: number, riskPercent: number) {
  range(balance, "Account balance", 0, 1e12, true);
  range(riskPercent, "Risk percentage", 0, 100, true);
  return balance * riskPercent / 100;
}

export function calculatePosition(inputs: FxInputs & { balance: number; riskMode: "percent" | "cash"; risk: number; stopPips: number; lotStep: number }) {
  contract(inputs);
  range(inputs.balance, "Account balance", 0, 1e12, true);
  range(inputs.stopPips, "Stop-loss distance in pips", 0, 1e7, true);
  range(inputs.lotStep, "Lot increment", 0.000001, 1);
  if (inputs.riskMode !== "percent" && inputs.riskMode !== "cash") throw new CalculationError("Choose percentage or fixed cash risk.");
  const budget = inputs.riskMode === "percent" ? calculateRisk(inputs.balance, inputs.risk) : range(inputs.risk, "Cash risk", 0, inputs.balance, true);
  const pip = calculatePip({ ...inputs, lots: 1 });
  const lossPerLot = inputs.stopPips * pip.loss;
  const rawLots = budget / lossPerLot;
  if (!(lossPerLot > 0) || !Number.isFinite(rawLots) || rawLots > 1e9) throw new CalculationError("The calculated size exceeds the supported range. Check stop distance, conversion quotes and contract size.");
  // Compensate only for floating-point noise at an exact increment boundary.
  const quotient = rawLots / inputs.lotStep;
  const increments = Math.floor(quotient + 4 * Number.EPSILON * Math.max(1, quotient));
  const lots = Number((increments * inputs.lotStep).toFixed(10));
  const units = lots * inputs.contractSize;
  const pipValue = lots * pip.loss;
  return { budget, rawLots, lots, units, standardLots: units / 100000, miniLots: units / 10000, microLots: units / 1000,
    pipValue, perLotPipValue: pip.loss, plannedLoss: inputs.stopPips * pipValue, pipSize: pip.pipSize };
}

export function money(value: number, account: Currency, precision = 2) {
  return new Intl.NumberFormat("en", { style: "currency", currency: account, currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: precision }).format(Object.is(value, -0) ? 0 : value);
}

export function number(value: number, precision = 4) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: precision }).format(Object.is(value, -0) ? 0 : value);
}
