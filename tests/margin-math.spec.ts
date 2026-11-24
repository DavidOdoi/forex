import { test, expect } from "@playwright/test";
import { calculateMargin, marginAccountState, type MarginInputs } from "../src/lib/calculators/margin";
import { conventionalInstrument } from "../src/lib/calculators/instruments";

const base = (): MarginInputs => ({ instrument: conventionalInstrument("EUR/USD"), account: "USD", volume: "1", volumeMode: "lots", price: "1.1000", marginMode: "leverage", leverage: "50", marginPercent: "2", snapshot: { equity: "10000", used: "0" }, rates: [] });

test("brief A/B: EUR/USD notional and margin scale exactly with volume", () => {
  const whole = calculateMargin(base());
  expect(whole.notional.toString()).toBe("110000"); expect(whole.required.toString()).toBe("2200");
  const mini = calculateMargin({ ...base(), volume: "0.2" });
  expect(mini.notional.toString()).toBe("22000"); expect(mini.required.toString()).toBe("440");
  expect(calculateMargin({ ...base(), volumeMode: "units", volume: "20000" }).required.toString()).toBe("440");
});

test("brief C: base equals account currency needs no market price or quote conversion", () => {
  const result = calculateMargin({ ...base(), instrument: conventionalInstrument("USD/JPY"), leverage: "100", price: "" });
  expect(result.notional.toString()).toBe("100000"); expect(result.required.toString()).toBe("1000");
  expect(result.baseToAccount.toString()).toBe("1"); expect(result.conversion.identity).toBe(true);
  expect(calculateMargin({ ...base(), account: "EUR", price: "" }).required.toString()).toBe("2000");
});

test("brief D/E: account equity, existing margin, margin level and deficits are distinct", () => {
  const result = calculateMargin({ ...base(), volume: "0.2" });
  expect(result.after?.free.toString()).toBe("9560"); expect(result.after?.level?.toFixed(2)).toBe("2272.73");
  const deficit = calculateMargin({ ...base(), volume: "0.2", price: "1", snapshot: { equity: "500", used: "200" } });
  expect(deficit.required.toString()).toBe("400"); expect(deficit.after?.used.toString()).toBe("600");
  expect(deficit.after?.free.toString()).toBe("-100"); expect(deficit.after?.insufficient).toBe(true);
  expect(marginAccountState("10000", "0").level).toBeNull();
});

test("explicit percentages, 1:X notation and non-USD conversions retain exact units", () => {
  expect(calculateMargin({ ...base(), marginMode: "percent", marginPercent: "2" }).required.toString()).toBe("2200");
  expect(calculateMargin({ ...base(), leverage: "1:50" }).required.toString()).toBe("2200");
  const sterling = calculateMargin({ ...base(), account: "GBP", rates: [{ base: "GBP", quote: "USD", rate: "1.25", source: "manual", asOf: null }] });
  expect(sterling.notional.toString()).toBe("88000"); expect(sterling.required.toString()).toBe("1760");
  const cross = calculateMargin({ ...base(), instrument: conventionalInstrument("EUR/GBP"), price: "0.85", rates: [{ base: "GBP", quote: "USD", rate: "1.25", source: "manual", asOf: null }] });
  expect(cross.notional.toString()).toBe("106250"); expect(cross.required.toString()).toBe("2125");
});

test("brief F: invalid leverage, prices, volume and snapshots cannot yield usable estimates", () => {
  for (const leverage of ["0", "-1", "NaN", "Infinity", "2:50", "10001"]) expect(() => calculateMargin({ ...base(), leverage })).toThrow();
  for (const marginPercent of ["0", "0.001", "-1", "101", ""]) expect(() => calculateMargin({ ...base(), marginMode: "percent", marginPercent })).toThrow();
  expect(() => calculateMargin({ ...base(), snapshot: { equity: "-1", used: "0" } })).toThrow();
  expect(() => calculateMargin({ ...base(), snapshot: { equity: "100", used: "-1" } })).toThrow();
  expect(() => calculateMargin({ ...base(), account: "GBP" })).toThrow(/conversion/);
  expect(() => calculateMargin({ ...base(), price: "" })).toThrow();
  expect(() => calculateMargin({ ...base(), volume: "0" })).toThrow();
});

test("more leverage changes collateral, not notional; optional equity does not block margin math", () => {
  const lower = calculateMargin(base()), higher = calculateMargin({ ...base(), leverage: "100", snapshot: undefined });
  expect(lower.notional.eq(higher.notional)).toBe(true); expect(lower.required.div(higher.required).toString()).toBe("2");
  expect(higher.after).toBeNull(); expect(higher.before).toBeNull();
  for (const row of lower.comparisons) expect(row.leverage.lte(lower.effectiveLeverage)).toBe(true);
});
