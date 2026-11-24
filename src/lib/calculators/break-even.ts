import { CalculationError } from "./forex";
import { D, decimal, type Numeric } from "./precision";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";
import { checkedAccount, tradePrice, tradeVolume } from "./trade-core";
import type { AccountCurrency, FxInstrument } from "./instruments";

export type BreakEvenInputs = {
  instrument: FxInstrument; account: AccountCurrency; direction: "buy" | "sell"; volumeMode: "lots" | "units";
  entries: { volume: Numeric; price: Numeric }[]; commission: Numeric; exitCosts: Numeric; swap: Numeric;
  costCurrency: "account" | "quote"; priceMode: "fills" | "mid"; spreadPips: Numeric; rates: ExchangeRate[];
};
export function calculateBreakEven(input: BreakEvenInputs, now = Date.now()) {
  checkedAccount(input.account);
  if (!["buy", "sell"].includes(input.direction) || !["account", "quote"].includes(input.costCurrency) || !["fills", "mid"].includes(input.priceMode)) throw new CalculationError("Choose valid trade and cost conventions.");
  if (!input.entries.length || input.entries.length > 20) throw new CalculationError("Enter between one and twenty same-direction entries.");
  const rows = input.entries.map(row => ({ ...tradeVolume(input.instrument, row.volume, input.volumeMode), price: tradePrice(row.price, "entry price", input.instrument) }));
  const units = rows.reduce((sum, row) => sum.add(row.units), new D(0));
  const entry = rows.reduce((sum, row) => sum.add(row.price.mul(row.units)), new D(0)).div(units);
  const commission = decimal(input.commission, "combined commission", "0", "1000000000000");
  const exitCosts = decimal(input.exitCosts, "additional anticipated exit costs", "0", "1000000000000");
  const swap = decimal(input.swap, "signed accrued swap", "-1000000000000", "1000000000000");
  const costs = commission.add(exitCosts).sub(swap);
  const conversion = resolveConversion(input.instrument.quote, input.account, input.rates, now, costs.gte(0) ? "asset" : "liability");
  const quoteCosts = input.costCurrency === "quote" ? costs : costs.div(conversion.factor);
  const spread = decimal(input.spreadPips, "whole-trade spread allowance", "0", "1000000");
  const side = input.direction === "buy" ? new D(1) : new D(-1);
  const pipSize = rows[0].pipSize;
  // A total entry+exit spread allowance moves the required closing midpoint.
  // The executable closing side sits half that modeled spread away.
  const halfSpread = input.priceMode === "mid" ? spread.mul(pipSize).div(2) : new D(0);
  const executableEntry = entry.add(halfSpread.mul(side));
  const theoretical = executableEntry.add(quoteCosts.div(units).mul(side));
  if (theoretical.lte(0) || theoretical.gt(1000000000)) throw new CalculationError("These costs imply a non-positive or unsupported break-even exit price.");
  const rounded = theoretical.toDecimalPlaces(input.instrument.pricePrecision, input.direction === "buy" ? D.ROUND_CEIL : D.ROUND_FLOOR);
  if (rounded.lte(0)) throw new CalculationError("The rounded exit is outside the supported price grid.");
  const midpoint = input.priceMode === "mid" ? theoretical.add(halfSpread.mul(side)) : null;
  const movement = theoretical.sub(executableEntry).mul(side).div(pipSize);
  const roundedQuoteGross = rounded.sub(executableEntry).mul(side).mul(units);
  return { units, lots: units.div(rows[0].contract), entry, executableEntry, theoretical, rounded, midpoint, halfSpread, movement, quoteCosts, costs, commission, exitCosts, swap, conversion, rows, roundingNetQuote: roundedQuoteGross.sub(quoteCosts), pipSize };
}
