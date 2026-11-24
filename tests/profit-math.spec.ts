import { test, expect } from "@playwright/test";
import { calculateProfit, type ProfitInputs } from "../src/lib/calculators/profit";
import { profitScenarioInputs, defaultProfitScenario } from "../src/lib/calculators/trade-scenario";
import { conventionalInstrument } from "../src/lib/calculators/instruments";

const base = (): ProfitInputs => profitScenarioInputs(defaultProfitScenario);
test("brief A–C/E/F: long/short signs, costs and equity returns", () => {
  const r = calculateProfit(base()); expect(r.pips.toString()).toBe("50"); expect(r.gross.toString()).toBe("100");
  expect(calculateProfit({ ...base(), direction: "sell" }).gross.toString()).toBe("-100");
  const net = calculateProfit({ ...base(), commission: "7", equity: "10000" });
  expect(net.net.toString()).toBe("93"); expect(net.returnPercent?.toString()).toBe("0.93");
  expect(calculateProfit({ ...base(), volume: "0.1", entry: "1.105", exit: "1.1" }).net.toString()).toBe("-50");
});
test("brief D: JPY proceeds use the explicitly entered closing conversion", () => {
  const r = calculateProfit({ ...base(), instrument: conventionalInstrument("USD/JPY"), volume: "1", direction: "sell", entry: "160", exit: "159.5", rates: [{ base: "USD", quote: "JPY", rate: "159.5", source: "manual", asOf: null }] });
  expect(r.quote.toString()).toBe("50000"); expect(r.gross.toNumber()).toBeCloseTo(313.4796238, 7);
});
test("brief H: executable fills never double-count extra spread; mid quotes include it once", () => {
  expect(calculateProfit({ ...base(), spreadPips: "2" }).net.toString()).toBe("100");
  expect(calculateProfit({ ...base(), priceMode: "mid", spreadPips: "2" }).net.toString()).toBe("96");
  expect(calculateProfit({ ...base(), slippagePips: "1", swap: "3" }).net.toString()).toBe("101");
  expect(calculateProfit({ ...base(), commissionBasis: "lot-side", commission: "3.5" }).commission.toString()).toBe("1.4");
});
test("credits and liabilities use their own bid/ask sides, including costs and crosses", () => {
  const rates = [{ base: "USD" as const, quote: "GBP" as const, bid: "0.8", ask: "0.82", source: "manual" as const, asOf: null }];
  expect(calculateProfit({ ...base(), account: "GBP", rates }).gross.toString()).toBe("80");
  const loss = calculateProfit({ ...base(), direction: "sell", account: "GBP", rates, costCurrency: "quote", commission: "7", swap: "3" });
  expect(loss.gross.toString()).toBe("-82"); expect(loss.commission.toString()).toBe("5.74"); expect(loss.swap.toString()).toBe("2.4"); expect(loss.net.toString()).toBe("-85.34");
  const cross = calculateProfit({ ...base(), account: "JPY", rates: [...rates, { base: "GBP", quote: "JPY", bid: "200", ask: "201", source: "manual", asOf: null }] });
  expect(cross.gross.toString()).toBe("16000");
});
test("custom contract/units and stop/target scenarios retain prices and signed outcomes", () => {
  const r = calculateProfit({ ...base(), volumeMode: "units", volume: "20000", stop: "1.098", target: "1.104" });
  expect(r.net.toString()).toBe("100"); expect(r.stop?.net.toString()).toBe("-40"); expect(r.target?.net.toString()).toBe("80");
  expect(r.otherSide.net.toString()).toBe("-100"); expect(r.scenarios.map(row => row.pips.toNumber())).toEqual([-50,-25,0,25,50]);
  expect(calculateProfit({ ...base(), instrument: { ...base().instrument, contractSize: "10000" } }).net.toString()).toBe("10");
});
test("brief G: invalid prices, missing conversions, volume and negative charges reject", () => {
  for (const patch of [{ entry: "0" }, { exit: "NaN" }, { volume: "0" }, { commission: "-1" }, { slippagePips: "-1" }, { spreadPips: "-1" }, { equity: "0" }, { stop: "-1" }, { direction: "other" }, { commissionBasis: "unknown" }, { account: "GBP" }]) expect(() => calculateProfit({ ...base(), ...patch } as ProfitInputs)).toThrow();
});
