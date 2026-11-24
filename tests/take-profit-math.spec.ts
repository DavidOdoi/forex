import { test, expect } from "@playwright/test";
import { calculateTakeProfit, type TakeProfitInputs } from "../src/lib/calculators/take-profit";
import { conventionalInstrument } from "../src/lib/calculators/instruments";
const sample: TakeProfitInputs = { instrument: conventionalInstrument("EUR/USD"), account: "USD", direction: "buy", volume: ".2", volumeMode: "lots", entry: "1.1", commission: "0", swap: "0", rates: [], mode: "pips", targetPips: "50", targetMoney: "150", targetBasis: "gross", multiple: "2", ratioBasis: "gross", priceStep: ".00001" };
test("buy and sell pip targets reproduce mandatory EUR/USD and GBP/USD examples", () => {
  const buy = calculateTakeProfit(sample); expect(buy.rounded.toString()).toBe("1.105"); expect(buy.gross.toString()).toBe("100");
  expect(calculateTakeProfit({ ...sample, direction: "sell" }).rounded.toString()).toBe("1.095");
  const gbp = calculateTakeProfit({ ...sample, instrument: conventionalInstrument("GBP/USD"), direction: "sell", entry: "1.28", targetPips: "60", volume: ".5" }); expect(gbp.rounded.toString()).toBe("1.274"); expect(gbp.gross.toString()).toBe("300");
});
test("monetary gross and net goals use the shared fee engine", () => {
  const gross = calculateTakeProfit({ ...sample, mode: "money" }); expect(gross.targetPips.toString()).toBe("75"); expect(gross.rounded.toString()).toBe("1.1075");
  const net = calculateTakeProfit({ ...sample, mode: "money", targetBasis: "net", commission: "10" }); expect(net.targetPips.toString()).toBe("80"); expect(net.rounded.toString()).toBe("1.108"); expect(net.net.toString()).toBe("150");
});
test("gross and net reward-to-risk targeting are distinct after fees", () => {
  expect(calculateTakeProfit({ ...sample, mode: "ratio", stopPrice: "1.0975" }).rounded.toString()).toBe("1.105");
  const net = calculateTakeProfit({ ...sample, mode: "ratio", ratioBasis: "net", stopPrice: "1.0975", commission: "10" }); expect(net.netR!.gte(2)).toBe(true); expect(net.stopResult!.net.toString()).toBe("-60");
});
test("price increments round buy upward and sell downward to retain the minimum target", () => {
  const r = calculateTakeProfit({ ...sample, targetPips: "50.37" }); expect(r.theoretical.toString()).toBe("1.105037"); expect(r.rounded.toString()).toBe("1.10504");
  const sell = calculateTakeProfit({ ...sample, direction: "sell", targetPips: "50.37" }); expect(sell.rounded.toString()).toBe("1.09496");
  const grid = calculateTakeProfit({ ...sample, targetPips: "50.37", priceStep: ".00003" }); expect(grid.rounded.mod(".00003").isZero()).toBe(true);
});
test("JPY and account-currency examples use frozen entered conversions, never a universal dollar pip", () => {
  const r = calculateTakeProfit({ ...sample, instrument: conventionalInstrument("USD/JPY"), entry: "160", targetPips: "20", priceStep: ".001", rates: [{ base: "USD", quote: "JPY", rate: "160", source: "manual", asOf: null }] }); expect(r.rounded.toString()).toBe("160.2"); expect(r.gross.toString()).toBe("25");
});
test("invalid directions, price goals, stop sides, volume, ticks and missing conversion reject", () => {
  for (const patch of [{ mode: "price" as const, explicitTarget: "1.09" }, { volume: "0" }, { mode: "ratio" as const, stopPrice: "1.11" }, { priceStep: ".000001" }, { targetPips: "-1" }, { account: "EUR" as const }]) expect(() => calculateTakeProfit({ ...sample, ...patch })).toThrow();
  expect(() => calculateTakeProfit({ ...sample, instrument: { ...sample.instrument, contractSize: "0" } })).toThrow();
});
