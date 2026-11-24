import { test, expect } from "@playwright/test";
import { calculateLeverage, type LeverageInputs } from "../src/lib/calculators/leverage";
import { conventionalInstrument } from "../src/lib/calculators/instruments";
import { calculateProfit } from "../src/lib/calculators/profit";
const sample: LeverageInputs = { instrument: conventionalInstrument("EUR/USD"), account: "USD", volume: "1", volumeMode: "lots", price: "1.1", marginMode: "leverage", leverage: "50", marginPercent: "2", rates: [], inputMode: "notional", enteredNotional: "50000", equity: "5000", existingUsed: "0", otherNotional: "0" };
test("effective and permitted leverage remain separate across direct and trade-derived examples", () => {
  expect(calculateLeverage(sample).effective.toString()).toBe("10");
  expect(calculateLeverage({ ...sample, enteredNotional: "100000", equity: "10000" }).effective.toString()).toBe("10");
  const fx = calculateLeverage({ ...sample, inputMode: "trade", equity: "11000" }); expect(fx.notional.toString()).toBe("110000"); expect(fx.required.toString()).toBe("2200"); expect(fx.effective.toString()).toBe("10");
});
test("margin amounts and percentage representation match the mandatory alternatives", () => {
  expect(calculateLeverage(sample).required.toString()).toBe("1000");
  expect(calculateLeverage({ ...sample, leverage: "20" }).required.toString()).toBe("2500");
  expect(calculateLeverage({ ...sample, leverage: "100" }).required.toString()).toBe("500");
  expect(calculateLeverage({ ...sample, marginMode: "percent", marginPercent: "2" }).permitted.toString()).toBe("50");
});
test("available margin and other exposures have explicitly separate inputs", () => {
  const r = calculateLeverage({ ...sample, existingUsed: "4500", otherNotional: "300000", availableMargin: "400" }); expect(r.after.free.toString()).toBe("-500"); expect(r.combinedEffective.toString()).toBe("70"); expect(r.exceedsSimpleCap).toBe(true); expect(r.exceedsAvailable).toBe(true);
});
test("base-account identity and non-account conversions reuse the margin engine", () => {
  const r = calculateLeverage({ ...sample, inputMode: "trade", instrument: conventionalInstrument("USD/JPY"), price: "", account: "USD" }); expect(r.notional.toString()).toBe("100000");
  expect(() => calculateLeverage({ ...sample, inputMode: "trade", account: "EUR" })).not.toThrow();
  expect(() => calculateLeverage({ ...sample, inputMode: "trade", account: "GBP" })).toThrow(/conversion/);
});
test("permitted leverage cannot multiply unchanged-position gross P&L", () => {
  const profit = { instrument: sample.instrument, account: sample.account, volume: "0.5", volumeMode: "lots" as const, direction: "buy" as const, entry: "1.1", exit: "1.102", priceMode: "fills" as const, spreadPips: "0", slippagePips: "0", commission: "0", commissionBasis: "total" as const, swap: "0", costCurrency: "account" as const, rates: [] };
  for (const leverage of ["20", "100"]) { expect(calculateLeverage({ ...sample, leverage }).notional.toString()).toBe("50000"); expect(calculateProfit(profit).gross.toString()).toBe("100"); }
});
test("zero equity, invalid ratios and unsupported margin assumptions reject rather than yielding infinity", () => {
  for (const patch of [{ equity: "0" }, { equity: "-1" }, { leverage: "0" }, { leverage: "10001" }, { marginMode: "percent" as const, marginPercent: "-1" }, { existingUsed: "-1" }]) expect(() => calculateLeverage({ ...sample, ...patch })).toThrow();
});
