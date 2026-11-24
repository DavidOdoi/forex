import { test, expect } from "@playwright/test";
import { calculateSpread, type SpreadInputs } from "../src/lib/calculators/spread";
import { conventionalInstrument } from "../src/lib/calculators/instruments";
import { calculateProfit } from "../src/lib/calculators/profit";
const sample: SpreadInputs = { instrument: conventionalInstrument("EUR/USD"), account: "USD", volume: "1", volumeMode: "lots", bid: "1.10000", ask: "1.10012", commission: "0", treatment: "standalone", rates: [] };
test("spread quotes, pipettes and proportional volume reproduce the supplied examples", () => {
  const first = calculateSpread(sample); expect(first.pips.toString()).toBe("1.2"); expect(first.combined.toString()).toBe("12");
  const next = { ...sample, bid: "1.10510", ask: "1.10525" };
  expect(calculateSpread(next).pips.toString()).toBe("1.5"); expect(calculateSpread(next).spreadCost.toString()).toBe("15");
  expect(calculateSpread({ ...next, volume: ".1" }).spreadCost.toString()).toBe("1.5");
  expect(calculateSpread({ ...sample, ask: "1.10001" }).pips.toString()).toBe("0.1");
  expect(calculateSpread({ ...sample, ask: sample.bid }).spreadCost.isZero()).toBe(true);
});
test("JPY quote cost converts with the declared inverse rate instead of a universal dollar pip", () => {
  const result = calculateSpread({ ...sample, instrument: conventionalInstrument("USD/JPY"), bid: "159.980", ask: "160.000", rates: [{ base: "USD", quote: "JPY", rate: "160", source: "manual", asOf: null }] });
  expect(result.pips.toString()).toBe("2"); expect(result.quoteCost.toString()).toBe("2000"); expect(result.spreadCost.toString()).toBe("12.5");
});
test("commission and wider-closing models disclose their distinct price conventions", () => {
  expect(calculateSpread({ ...sample, ask: "1.10003", commission: "7" }).combined.toString()).toBe("10");
  const varied = calculateSpread({ ...sample, ask: "1.10010", closingSpread: "3" });
  expect(varied.spreadCost.toString()).toBe("10"); expect(varied.modeledSpread.toString()).toBe("20");
  expect(varied.scenarios[2].pips.toString()).toBe("2");
});
test("embedded spreads are informational and never deducted from executable-price P&L twice", () => {
  const result = calculateSpread({ ...sample, treatment: "embedded", commission: "7" });
  expect(result.spreadCost.toString()).toBe("12"); expect(result.additionalSpread.isZero()).toBe(true); expect(result.combined.toString()).toBe("7");
  const pnl = calculateProfit({ ...sample, entry: sample.ask, exit: sample.bid, direction: "buy", priceMode: "fills", spreadPips: "1.2", slippagePips: "0", swap: "0", commission: "7", commissionBasis: "total", costCurrency: "account" });
  expect(pnl.net.toString()).toBe("-19");
});
test("cost conversion covers a liability at inverse bid and retains the rate date", () => {
  const result = calculateSpread({ ...sample, account: "EUR", rates: [{ base: "EUR", quote: "USD", bid: "1.2", ask: "1.21", source: "manual", asOf: null }] });
  expect(result.spreadCost.toString()).toBe("10"); expect(result.conversion.rates[0].asOf).toBeNull();
});
test("invalid quotes, contract inputs and nonpositive volumes never show a usable estimate", () => {
  for (const change of [{ ask: "1.09" }, { volume: "0" }, { volume: "-1" }, { bid: "0" }, { ask: "1.100001" }, { commission: "-1" }, { closingSpread: "-1" }]) expect(() => calculateSpread({ ...sample, ...change })).toThrow();
  expect(() => calculateSpread({ ...sample, instrument: { ...sample.instrument, contractSize: "0" } })).toThrow();
  expect(() => calculateSpread({ ...sample, account: "EUR" })).toThrow(/conversion/);
});
