import { test, expect } from "@playwright/test";
import { calculatePip, type PipInputs } from "../src/lib/calculators/pip";
import { conventionalInstrument } from "../src/lib/calculators/instruments";
import { defaultPipScenario, pipScenarioInputs, restoreTradeScenario, serializeTradeScenario } from "../src/lib/calculators/trade-scenario";

const base = (): PipInputs => ({ instrument: conventionalInstrument("EUR/USD"), account: "USD", volume: "1", volumeMode: "lots", pips: "1", rates: [] });

test("brief A–C: standard, mini and micro EUR/USD pip values are exact", () => {
  for (const [volume, expected] of [["1", "10"], ["0.10", "1"], ["0.01", "0.1"]]) expect(calculatePip({ ...base(), volume }).pipValue.toString()).toBe(expected);
  const units = calculatePip({ ...base(), volumeMode: "units", volume: "20000" });
  expect(units.lots.toString()).toBe("0.2");
  expect(units.pipValue.toString()).toBe("2");
});

test("brief D/G/H: inverse conversions and identity conversion preserve currency units", () => {
  const yen = calculatePip({ ...base(), instrument: conventionalInstrument("USD/JPY"), rates: [{ base: "USD", quote: "JPY", rate: "160", source: "manual", asOf: null }] });
  expect(yen.quoteValue.toString()).toBe("1000");
  expect(yen.pipValue.toString()).toBe("6.25");
  const swiss = calculatePip({ ...base(), instrument: conventionalInstrument("USD/CHF"), rates: [{ base: "USD", quote: "CHF", rate: "0.8", source: "manual", asOf: null }] });
  expect(swiss.quoteValue.toString()).toBe("10");
  expect(swiss.pipValue.toString()).toBe("12.5");
  expect(calculatePip(base()).conversion.factor.toString()).toBe("1");
});

test("brief E/F: price-to-pips retains sign, zero and fractional pips", () => {
  expect(calculatePip({ ...base(), movement: { start: "1.1000", end: "1.1050" } }).movement?.toString()).toBe("50");
  expect(calculatePip({ ...base(), movement: { start: "1.10000", end: "1.10005" } }).movement?.toString()).toBe("0.5");
  expect(calculatePip({ ...base(), movement: { start: "1.1", end: "1.1" } }).movement?.toString()).toBe("0");
  const yen = calculatePip({ ...base(), instrument: conventionalInstrument("USD/JPY"), account: "JPY", movement: { start: "160", end: "159.5" } });
  expect(yen.movement?.toString()).toBe("-50");
});

test("direct/cross and bid/ask midpoint conversions are explicit, with no early rounding", () => {
  const common = { ...base(), account: "GBP" as const };
  expect(calculatePip({ ...common, rates: [{ base: "USD", quote: "GBP", rate: "0.8", source: "manual", asOf: null }] }).pipValue.toString()).toBe("8");
  expect(calculatePip({ ...common, rates: [{ base: "USD", quote: "EUR", rate: "0.9", source: "manual", asOf: null }, { base: "EUR", quote: "GBP", rate: "0.8", source: "manual", asOf: null }] }).pipValue.toString()).toBe("7.2");
  const midpoint = calculatePip({ ...common, rates: [{ base: "GBP", quote: "USD", bid: "1.2", ask: "1.3", source: "manual", asOf: null }] });
  expect(midpoint.pipValue.toString()).toBe("8");
  const custom = calculatePip({ ...base(), instrument: { ...base().instrument, contractSize: "10000" }, volume: "1" });
  expect(custom.pipValue.toString()).toBe("1");
  expect(custom.lotsTable[0].pipValue.toString()).toBe("10");
});

test("invalid volume, missing/negative rates, reversed quotes and invalid specs never produce estimates", () => {
  for (const volume of ["0", "-1", "NaN", "Infinity", "", "1e100"]) expect(() => calculatePip({ ...base(), volume })).toThrow();
  expect(() => calculatePip({ ...base(), account: "GBP" })).toThrow(/conversion rate/);
  for (const rate of ["0", "-1", "NaN"]) expect(() => calculatePip({ ...base(), account: "GBP", rates: [{ base: "USD", quote: "GBP", rate, source: "manual", asOf: null }] })).toThrow();
  expect(() => calculatePip({ ...base(), account: "GBP", rates: [{ base: "USD", quote: "GBP", bid: "1.3", ask: "1.2", source: "manual", asOf: null }] })).toThrow(/ask/);
  expect(() => calculatePip({ ...base(), instrument: { ...base().instrument, pipSize: "0" } })).toThrow();
  expect(() => calculatePip({ ...base(), instrument: { ...base().instrument, pricePrecision: 3 } })).toThrow(/precision/);
  expect(() => calculatePip({ ...base(), movement: { start: "1.100001", end: "1.2" } })).toThrow(/decimal/);
});

test("share state restores all supported inputs, rejects unknown versions and validates malformed enums", () => {
  const values = { ...defaultPipScenario, pair: "USD/JPY", volume: "0.2", rate: "160", movementEnabled: "yes", start: "160", end: "159.5", pipSize: "0.01", precision: "3" };
  const restored = restoreTradeScenario("?" + serializeTradeScenario(values), defaultPipScenario);
  expect(restored.values).toEqual(values);
  expect(calculatePip(pipScenarioInputs(restored.values)).pipValue.toString()).toBe("1.25");
  expect(restoreTradeScenario("?v=9", defaultPipScenario).error).toMatch(/version/);
  expect(() => pipScenarioInputs({ ...values, rateDirection: "wrong" })).toThrow();
});
