import { test, expect } from "@playwright/test";
import { calculateStopLoss, type StopLossInputs } from "../src/lib/calculators/stop-loss";
import { conventionalInstrument } from "../src/lib/calculators/instruments";
const sample: StopLossInputs = { instrument: conventionalInstrument("EUR/USD"), account: "USD", direction: "buy", volume: ".2", volumeMode: "lots", entry: "1.1", commission: "0", swap: "0", rates: [], mode: "pips", stopPips: "30", riskAmount: "100", riskPercent: "1", riskBasis: "gross", accountEquity: "10000", atr: "25", atrUnit: "pips", atrMultiple: "2", priceStep: ".00001" };
test("buy/sell EUR/USD and GBP/USD price and nominal loss examples are exact", () => {
  const buy = calculateStopLoss(sample); expect(buy.rounded.toString()).toBe("1.097"); expect(buy.grossLoss.toString()).toBe("60");
  expect(calculateStopLoss({ ...sample, direction: "sell" }).rounded.toString()).toBe("1.103");
  expect(calculateStopLoss({ ...sample, entry: "1.105", stopPips: "45" }).rounded.toString()).toBe("1.1005");
  const gbp = calculateStopLoss({ ...sample, instrument: conventionalInstrument("GBP/USD"), direction: "sell", entry: "1.27", stopPips: "35", volume: ".5" }); expect(gbp.rounded.toString()).toBe("1.2735"); expect(gbp.grossLoss.toString()).toBe("175");
});
test("cash and percentage risk separate price loss from entered account-currency costs", () => {
  const cash = calculateStopLoss({ ...sample, mode: "money", volume: ".5" }); expect(cash.stopPips.toString()).toBe("20"); expect(cash.rounded.toString()).toBe("1.098");
  const percent = calculateStopLoss({ ...sample, mode: "percent", volume: ".5", riskBasis: "net", commission: "10" }); expect(percent.stopPips.toString()).toBe("18"); expect(percent.netLoss.toString()).toBe("100");
  expect(() => calculateStopLoss({ ...sample, mode: "money", riskBasis: "net", commission: "100" })).toThrow(/entire/);
});
test("JPY conversion uses the explicitly entered closing assumption", () => {
  const result = calculateStopLoss({ ...sample, instrument: conventionalInstrument("USD/JPY"), entry: "160", stopPips: "40", volume: "1", priceStep: ".001", rates: [{ base: "USD", quote: "JPY", rate: "159.60", source: "manual", asOf: null }] }); expect(result.rounded.toString()).toBe("159.6"); expect(result.quote.toString()).toBe("-40000"); expect(result.grossLoss.toNumber()).toBeCloseTo(250.6265664, 6);
});
test("ATR price/pip units agree and protective rounding stays toward entry", () => {
  expect(calculateStopLoss({ ...sample, mode: "atr" }).rounded.toString()).toBe("1.095"); expect(calculateStopLoss({ ...sample, mode: "atr", atr: ".0025", atrUnit: "price" }).rounded.toString()).toBe("1.095");
  const buy = calculateStopLoss({ ...sample, stopPips: "30.37" }); expect(buy.theoretical.toString()).toBe("1.096963"); expect(buy.rounded.toString()).toBe("1.09697"); expect(buy.stopPips.lte(buy.theoreticalPips)).toBe(true);
  expect(calculateStopLoss({ ...sample, direction: "sell", stopPips: "30.37" }).rounded.toString()).toBe("1.10303");
});
test("invalid protective sides, zero volume/distance, unusable grids and missing rates reject", () => {
  for (const patch of [{ mode: "price" as const, stopPrice: "1.11" }, { volume: "0" }, { stopPips: "0" }, { mode: "percent" as const, accountEquity: "0" }, { mode: "atr" as const, atr: "-1" }, { stopPips: "0.1", priceStep: ".0001" }, { account: "EUR" as const }]) expect(() => calculateStopLoss({ ...sample, ...patch })).toThrow();
});
