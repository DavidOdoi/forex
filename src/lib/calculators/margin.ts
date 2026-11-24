import { CalculationError } from "./forex";
import type { AccountCurrency, FxInstrument } from "./instruments";
import { decimal, D, type Numeric } from "./precision";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";
import { checkedAccount, checkedLeverage, tradePrice, tradeVolume } from "./trade-core";

export type MarginInputs = {
  instrument: FxInstrument; account: AccountCurrency; volume: Numeric; volumeMode: "lots" | "units";
  price: Numeric; marginMode: "leverage" | "percent"; leverage: Numeric; marginPercent: Numeric;
  snapshot?: { equity: Numeric; used: Numeric }; rates: ExchangeRate[];
};

export function marginAccountState(equityValue: Numeric, usedValue: Numeric, options: { allowNegativeEquity?: boolean } = {}) {
  const equity = decimal(equityValue, "account equity", options.allowNegativeEquity ? "-1000000000000" : "0", "1000000000000");
  const used = decimal(usedValue, "used margin", "0", "100000000000000000000000000000000000000000000000000");
  return { equity, used, free: equity.sub(used), level: used.isZero() ? null : equity.div(used).mul(100), insufficient: used.gt(equity) };
}

export function calculateMargin(input: MarginInputs, now = Date.now()) {
  const size = tradeVolume(input.instrument, input.volume, input.volumeMode);
  checkedAccount(input.account);
  if (!["leverage", "percent"].includes(input.marginMode)) throw new CalculationError("Choose a leverage ratio or margin percentage.");
  const rate = input.marginMode === "leverage" ? new D(1).div(checkedLeverage(input.leverage)) : decimal(input.marginPercent, "margin percentage", "0.01", "100").div(100);
  const baseIsAccount = input.instrument.base === input.account;
  const conversion = resolveConversion(baseIsAccount ? input.account : input.instrument.quote, input.account, baseIsAccount ? [] : input.rates, now);
  const price = baseIsAccount ? null : tradePrice(input.price, "notional reference price", input.instrument);
  const baseToAccount = baseIsAccount ? new D(1) : price!.mul(conversion.factor);
  const notional = size.units.mul(baseToAccount);
  const required = notional.mul(rate);
  const effectiveLeverage = new D(1).div(rate);
  const before = input.snapshot ? marginAccountState(input.snapshot.equity, input.snapshot.used) : null;
  const after = before ? marginAccountState(before.equity.toString(), before.used.add(required).toString()) : null;
  const ratios = ["1", "10", "20", "30", "50", "100", effectiveLeverage.toString()].map(value => new D(value)).filter((value, index, all) => value.lte(effectiveLeverage) && all.findIndex(other => other.eq(value)) === index).sort((a, b) => a.comparedTo(b));
  return { ...size, conversion, price, baseIsAccount, baseToAccount, notional, required, rate, effectiveLeverage, before, after,
    comparisons: ratios.map(leverage => ({ leverage, required: notional.div(leverage) })) };
}
