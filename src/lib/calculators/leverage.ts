import { CalculationError } from "./forex";
import { calculateMargin, marginAccountState, type MarginInputs } from "./margin";
import { checkedAccount, checkedLeverage } from "./trade-core";
import { decimal, D, type Numeric } from "./precision";
export type LeverageInputs = MarginInputs & { inputMode: "trade" | "notional"; enteredNotional: Numeric; equity: Numeric; existingUsed: Numeric; otherNotional: Numeric; availableMargin?: Numeric };
export function calculateLeverage(input: LeverageInputs, now = Date.now()) {
  checkedAccount(input.account);
  if (!["trade", "notional"].includes(input.inputMode) || !["leverage", "percent"].includes(input.marginMode)) throw new CalculationError("Choose valid exposure and margin conventions.");
  const equity = decimal(input.equity, "account equity", "0", "1000000000000", true), used = decimal(input.existingUsed, "existing used margin", "0", "1000000000000"), otherNotional = decimal(input.otherNotional, "other gross account-currency exposure", "0", "1000000000000");
  const trade = input.inputMode === "trade" ? calculateMargin({ ...input, snapshot: undefined }, now) : null;
  const notional = trade ? trade.notional : decimal(input.enteredNotional, "entered account-currency notional", "0", "1000000000000", true);
  const rate = trade ? trade.rate : input.marginMode === "leverage" ? new D(1).div(checkedLeverage(input.leverage)) : decimal(input.marginPercent, "margin percentage", "0.01", "100").div(100);
  const permitted = new D(1).div(rate), required = trade ? trade.required : notional.mul(rate), totalNotional = notional.add(otherNotional);
  const before = marginAccountState(equity.toString(), used.toString()), after = marginAccountState(equity.toString(), used.add(required).toString());
  const available = input.availableMargin === undefined ? null : decimal(input.availableMargin, "entered platform available margin", "-1000000000000", "1000000000000");
  const ratios = ["1", "10", "20", "30", "50", "100", permitted.toString()].map(value => new D(value)).filter((value, i, all) => all.findIndex(other => other.eq(value)) === i).sort((a, b) => a.comparedTo(b));
  return { trade, notional, totalNotional, otherNotional, equity, required, permitted, available, exceedsAvailable: available !== null && required.gt(available), marginPercent: rate.mul(100), effective: notional.div(equity), combinedEffective: totalNotional.div(equity), before, after, exceedsSimpleCap: totalNotional.gt(equity.mul(permitted)), comparisons: ratios.map(leverage => ({ leverage, required: notional.div(leverage), percent: new D(100).div(leverage) })) };
}
