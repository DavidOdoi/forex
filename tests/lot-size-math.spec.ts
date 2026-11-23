import { test, expect } from "@playwright/test";
import { calculateLotSize, estimateLotMargin, type LotSizeInputs } from "../src/lib/calculators/lot-size";
import { D, cash } from "../src/lib/calculators/precision";
import { conventionalInstrument } from "../src/lib/calculators/instruments";
import { parseReferenceRates, resolveConversion, type ExchangeRate } from "../src/lib/calculators/exchange-rates";
import { defaultLotScenario, lotInputs, restoreLotScenario, serializeLotScenario } from "../src/lib/calculators/lot-scenario";

const base = (): LotSizeInputs => lotInputs({ ...defaultLotScenario });
const quote = (base: ExchangeRate["base"], quote: ExchangeRate["quote"], rate: string): ExchangeRate => ({ base, quote, rate, source: "manual", asOf: null });

test("lot-size brief A: 100-dollar budget, 10-dollar pip, 0.20 lots and 20,000 EUR", () => {
  const output = calculateLotSize(base());
  expect(output.budget.toString()).toBe("100");
  expect(output.pipValuePerLot.toString()).toBe("10");
  expect(output.lots.toString()).toBe("0.2");
  expect(output.units.toString()).toBe("20000");
  expect(output.totalRisk.toString()).toBe("100");
  expect(output.pipValue.toString()).toBe("2");
});

test("lot-size brief B: USD/JPY 160 gives 1,000 JPY or USD 6.25 per pip per lot", () => {
  const output = calculateLotSize({ ...base(), instrument: conventionalInstrument("USD/JPY"), rates: [quote("USD", "JPY", "160")] });
  expect(output.quotePipValue.toString()).toBe("1000");
  expect(output.pipValuePerLot.toString()).toBe("6.25");
  expect(output.lots.toString()).toBe("0.32");
  expect(output.totalRisk.toString()).toBe("100");
});

test("lot-size brief C: a 30-pip stop rounds 0.333333... down to 0.33 and risks 99", () => {
  const output = calculateLotSize({ ...base(), stopPips: "30" });
  expect(output.theoreticalLots.toNumber()).toBeCloseTo(1 / 3, 14);
  expect(output.lots.toString()).toBe("0.33");
  expect(output.totalRisk.toString()).toBe("99");
  expect(output.unusedBudget.toString()).toBe("1");
});

test("lot-size brief D: a minimum that would risk 10 is never recommended for a 1-dollar budget", () => {
  const output = calculateLotSize({ ...base(), riskMode: "cash", risk: "1", stopPips: "100" });
  expect(output.executable).toBe(false);
  expect(output.lots.toString()).toBe("0");
  expect(output.reason).toBe("below-minimum");
  expect(output.minimumEstimate.totalRisk.toString()).toBe("10");
  expect(output.costs.toString()).toBe("0");
});

test("lot-size brief E: invalid, missing, nonfinite and extreme financial inputs fail explicitly", () => {
  for (const value of ["0", "-1", "", "NaN", "Infinity", "1,000", "1e-99"]) expect(() => calculateLotSize({ ...base(), stopPips: value }), `stop ${value}`).toThrow();
  for (const value of ["0", "-1", "NaN", "Infinity", "1000000000001"]) expect(() => calculateLotSize({ ...base(), equity: value })).toThrow();
  for (const value of ["0", "-1", "101", "NaN", "Infinity"]) expect(() => calculateLotSize({ ...base(), risk: value })).toThrow();
  expect(() => calculateLotSize({ ...base(), riskMode: "cash", risk: "10001" })).toThrow();
  expect(() => calculateLotSize({ ...base(), account: "EUR" })).toThrow(/conversion/i);
  for (const key of ["contractSize", "pipSize", "minimumLots", "maximumLots", "lotStep"] as const) for (const value of ["0", "-1", "NaN", "Infinity"]) expect(() => calculateLotSize({ ...base(), instrument: { ...base().instrument, [key]: value } })).toThrow();
  expect(() => calculateLotSize({ ...base(), commissionPerLot: "-1" })).toThrow();
  expect(() => calculateLotSize({ ...base(), fixedCosts: "NaN" })).toThrow();
  expect(() => calculateLotSize({ ...base(), instrument: { ...base().instrument, maximumLots: "0.001" } })).toThrow();
  expect(() => calculateLotSize({ ...base(), instrument: { ...base().instrument, pricePrecision: 1.5 } })).toThrow();
});

test("volume grids start at the minimum, respect a non-grid maximum and retain decimal boundary accuracy", () => {
  const input = { ...base(), riskMode: "cash" as const, risk: "96", stopPips: "30", instrument: { ...base().instrument, minimumLots: "0.03", lotStep: "0.02" } };
  expect(calculateLotSize(input).lots.toString()).toBe("0.31");
  const capped = calculateLotSize({ ...input, instrument: { ...input.instrument, maximumLots: "0.12" } });
  expect(capped.lots.toString()).toBe("0.11"); expect(capped.cappedAtMaximum).toBe(true);
  for (const step of ["0.01", "0.001", "0.000001", "0.00000001"]) {
    const result = calculateLotSize({ ...base(), instrument: { ...base().instrument, minimumLots: step, lotStep: step } });
    expect(result.lots.toString()).toBe("0.2");
    expect(result.lots.sub(step).div(step).isInteger()).toBe(true);
    expect(result.totalRisk.lte(result.budget)).toBe(true);
  }
});

test("cost-inclusive sizing solves variable and fixed costs without double-counting spread", () => {
  const input = { ...base(), commissionPerLot: "7", fixedCosts: "2", spreadPips: "2" };
  const included = calculateLotSize(input);
  expect(included.lots.toString()).toBe("0.19");
  expect(included.priceRisk.toString()).toBe("95");
  expect(included.costs.toString()).toBe("3.33");
  expect(included.totalRisk.toString()).toBe("98.33");
  const extra = calculateLotSize({ ...input, spreadMode: "additional" });
  expect(extra.lots.toString()).toBe("0.18");
  expect(extra.costs.toString()).toBe("6.86");
  expect(extra.totalRisk.toString()).toBe("96.86");
  const excluded = calculateLotSize({ ...input, includeCosts: false });
  expect(excluded.lots.toString()).toBe("0.2");
  expect(excluded.totalRisk.toString()).toBe("103.4");
  expect(excluded.totalBudgetGap.toString()).toBe("-3.4");
  const unavailable = calculateLotSize({ ...base(), fixedCosts: "100" });
  expect(unavailable.executable).toBe(false); expect(unavailable.reason).toBe("costs-exceed-budget");
});

test("entry/stop mode computes exact fractional pips and rejects wrong-side stops", () => {
  for (const [side, stopPrice] of [["buy", "1.095"], ["sell", "1.105"]] as const) {
    const result = calculateLotSize({ ...base(), stopMode: "prices", entry: "1.1", stopPrice, side });
    expect(result.stopPips.toString()).toBe("50"); expect(result.lots.toString()).toBe("0.2");
  }
  expect(calculateLotSize({ ...base(), stopMode: "prices", entry: "1.1", stopPrice: "1.09995" }).stopPips.toString()).toBe("0.5");
  for (const stopPrice of ["1.1", "1.2", "NaN", "0"]) expect(() => calculateLotSize({ ...base(), stopMode: "prices", entry: "1.1", stopPrice })).toThrow();
  expect(() => calculateLotSize({ ...base(), stopMode: "prices", entry: "1.100001", stopPrice: "1.09" })).toThrow(/decimal places/);
});

test("conversion resolves direct, inverse and cross liability paths with the proper bid/ask", () => {
  const now = Date.parse("2026-11-23T12:00:00Z");
  const direct: ExchangeRate = { base: "GBP", quote: "USD", bid: "1.25", ask: "1.251", source: "manual", asOf: null };
  expect(resolveConversion("GBP", "USD", [direct], now).factor.toString()).toBe("1.251");
  expect(resolveConversion("USD", "GBP", [direct], now).factor.toString()).toBe("0.8");
  const cross = resolveConversion("JPY", "GBP", [quote("USD", "JPY", "160"), quote("USD", "GBP", "0.8")], now);
  expect(cross.factor.toString()).toBe("0.005"); expect(cross.steps).toHaveLength(2);
  expect(resolveConversion("USD", "USD", [], now).factor.toString()).toBe("1");
  expect(() => resolveConversion("JPY", "GBP", [direct], now)).toThrow(/required/);
  expect(() => resolveConversion("GBP", "USD", [{ ...direct, ask: "1" }], now)).toThrow(/ask/);
  expect(() => resolveConversion("GBP", "USD", [{ ...direct, bid: "0" }], now)).toThrow();
  const scoped = calculateLotSize({ ...base(), instrument: conventionalInstrument("EUR/GBP"), account: "USD", rates: [direct] });
  expect(scoped.pipValuePerLot.toString()).toBe("12.51");
});

test("reference rates retain dates, reject malformed/future data and explicitly label stale paths", () => {
  const rates = parseReferenceRates([{ base: "USD", quote: "EUR", rate: 0.8, date: "2026-11-20" }, { base: "USD", quote: "JPY", rate: 160, date: "2026-11-20" }, { base: "USD", quote: "GBP", rate: -1, date: "2026-11-20" }, { base: "USD", quote: "ZAR", rate: 18, date: "2026-11-24" }, { base: "USD", quote: "CAD", rate: 1.4, date: "2026-02-30" }], "2026-11-22");
  expect(rates).toHaveLength(2);
  expect(resolveConversion("JPY", "EUR", rates, Date.parse("2026-11-23T12:00:00Z")).stale).toBe(false);
  expect(resolveConversion("JPY", "EUR", rates, Date.parse("2026-11-26T12:00:00Z")).stale).toBe(true);
  expect(() => parseReferenceRates([], "2026-11-22")).toThrow();
  expect(() => resolveConversion("USD", "EUR", [{ ...rates[0], asOf: null }])).toThrow(/date/);
  expect(() => resolveConversion("USD", "EUR", [{ ...rates[0], asOf: "2030-01-01T00:00:00Z" }], Date.parse("2026-11-23T12:00:00Z"))).toThrow(/date/);
});

test("currency presentation preserves precision without imposing cents on JPY", () => {
  expect(cash("1000", "JPY")).toBe("JPY 1,000");
  expect(cash("1000.25", "USD")).toBe("USD 1,000.25");
  expect(cash("0.0000001", "USD", 8)).toBe("USD 0.0000001");
});

test("optional margin checks currency units and affordability without changing the risk-sized position", () => {
  const input = base();
  const affordable = estimateLotMargin(input, "0.2", "30", "1000", "1.1");
  expect(affordable.required.toNumber()).toBeCloseTo(22000 / 30, 10); expect(affordable.affordable).toBe(true);
  expect(estimateLotMargin(input, "0.2", "30", "500", "1.1").affordable).toBe(false);
  expect(estimateLotMargin(input, "0.2", "60", "1000", "1.1").required.mul(2).toNumber()).toBeCloseTo(affordable.required.toNumber(), 10);
  const yen = { ...input, instrument: conventionalInstrument("USD/JPY"), rates: [quote("USD", "JPY", "160")] };
  expect(estimateLotMargin(yen, "1", "100", "1000", "").required.toString()).toBe("1000");
  const cross = { ...input, account: "GBP" as const, rates: [quote("USD", "GBP", "0.8")] };
  expect(estimateLotMargin(cross, "1", "100", "1000", "1.1").required.toString()).toBe("880");
  expect(() => estimateLotMargin(input, "1", "0", "1000", "1.1")).toThrow();
});

test("sizing invariants hold across risk budgets, costs, FX pairs and valid grids", () => {
  for (const pair of ["EUR/USD", "USD/JPY", "EUR/GBP"] as const) for (const risk of ["0.1", "0.5", "1", "2", "5"]) for (const stop of ["5", "30", "50", "100"]) {
    const input = { ...base(), instrument: conventionalInstrument(pair), risk, stopPips: stop, commissionPerLot: "7", fixedCosts: "0.25", rates: [quote("USD", "JPY", "160"), quote("GBP", "USD", "1.25")] };
    const output = calculateLotSize(input);
    expect(output.totalRisk.lte(output.budget)).toBe(true);
    if (output.executable) {
      expect(output.lots.gte(output.minimum) && output.lots.lte(output.maximum)).toBe(true);
      expect(output.lots.sub(output.minimum).mod(output.step).isZero()).toBe(true);
      expect(output.lots.lte(calculateLotSize({ ...input, commissionPerLot: "0", fixedCosts: "0" }).lots)).toBe(true);
      const one = output.estimate(output.lots.toString()), two = output.estimate(output.lots.mul(2).toString());
      expect(two.priceRisk.eq(one.priceRisk.mul(2))).toBe(true);
      expect(two.totalRisk.gt(one.totalRisk)).toBe(true);
      if (output.lots.add(output.step).lte(output.maximumOnGrid)) expect(output.estimate(output.lots.add(output.step).toString()).withinBudget).toBe(false);
    }
  }
  expect(new D("0.1").add("0.2").eq("0.3")).toBe(true);
});

test("scenario serialization round-trips all inputs and never imports supplied rates as live quotes", () => {
  const values = { ...defaultLotScenario, pair: "USD/JPY", rate: "160", maximum: "3", includeCosts: "no", stopMode: "prices", entry: "160", stopPrice: "159.5" };
  const restored = restoreLotScenario(serializeLotScenario(values));
  expect(restored.values).toEqual(values);
  expect(calculateLotSize(lotInputs(restored.values)).lots.toString()).toBe("0.32");
  expect(restoreLotScenario("?v=2").error).toMatch(/unsupported/);
  expect(() => calculateLotSize(lotInputs(restoreLotScenario("?risk=NaN").values))).toThrow();
  expect(() => lotInputs(restoreLotScenario("?pair=XAU/USD").values)).toThrow();
});
