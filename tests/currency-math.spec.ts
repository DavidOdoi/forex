import { test, expect } from "@playwright/test";
import { calculateCurrency, type CurrencyInputs } from "../src/lib/calculators/currency-converter";
import { referenceRequestDate } from "../src/lib/calculators/exchange-rates";
const sample: CurrencyInputs = { from: "USD", to: "UGX", amount: "100", rates: [{ base: "USD", quote: "UGX", rate: "3700", source: "manual", asOf: null }], mode: "manual", providerMode: "reference", reduction: "0", feeBasis: "target", feePercent: "0", fixedFee: "0" };
test("USD/UGX and EUR/USD multiplication, inverse and cross examples are exact", () => {
  expect(calculateCurrency(sample).net.toString()).toBe("370000"); expect(calculateCurrency({ ...sample, amount: "250" }).net.toString()).toBe("925000");
  const rates = [{ base: "EUR" as const, quote: "USD" as const, rate: "1.1", source: "manual" as const, asOf: null }, ...sample.rates];
  expect(calculateCurrency({ ...sample, from: "EUR", to: "USD", rates }).net.toString()).toBe("110");
  expect(calculateCurrency({ ...sample, from: "USD", to: "EUR", amount: "110", rates }).net.toString()).toBe("100");
  expect(calculateCurrency({ ...sample, from: "EUR", rates }).net.toString()).toBe("407000");
});
test("provider rates and source or target fees keep the order of operations explicit", () => {
  const eur = { ...sample, from: "EUR" as const, to: "USD" as const, amount: "500", rates: [{ base: "EUR" as const, quote: "USD" as const, rate: "1.12", source: "manual" as const, asOf: null }] };
  expect(calculateCurrency(eur).net.toString()).toBe("560"); expect(calculateCurrency({ ...eur, providerMode: "rate", providerRate: "1.115" }).net.toString()).toBe("557.5");
  const fee = calculateCurrency({ ...sample, amount: "100", rates: [{ ...sample.rates[0], rate: "5000" }], feePercent: "1", fixedFee: "2000" }); expect(fee.net.toString()).toBe("493000");
  expect(calculateCurrency({ ...sample, feeBasis: "source", feePercent: "1", fixedFee: "2" }).net.toString()).toBe("358900");
  expect(calculateCurrency({ ...eur, providerMode: "reduction", reduction: "1" }).net.toString()).toBe("554.4");
});
test("currency sale uses direct bid and inverse ask rather than a reciprocal retail buy quote", () => {
  const rates = [{ base: "USD" as const, quote: "UGX" as const, bid: "3680", ask: "3720", source: "manual" as const, asOf: null }];
  expect(calculateCurrency({ ...sample, rates }).net.toString()).toBe("368000");
  expect(calculateCurrency({ ...sample, from: "UGX", to: "USD", amount: "372000", rates }).net.toString()).toBe("100");
});
test("historical requests never silently use today's observation and manual inputs do not become live", () => {
  const now = Date.parse("2026-11-24T12:00:00Z");
  const historical = { ...sample, mode: "historical" as const, historyDate: "2025-01-20", rates: [{ ...sample.rates[0], source: "frankfurter" as const, asOf: "2025-01-17T00:00:00Z" }] };
  expect(calculateCurrency(historical, now).date).toBe("2025-01-20");
  expect(() => calculateCurrency({ ...historical, rates: [{ ...historical.rates[0], asOf: "2026-11-20T00:00:00Z" }] }, now)).toThrow();
  expect(calculateCurrency(sample, now).conversion.rates[0].source).toBe("manual");
  for (const date of ["2026-02-30", "2026-11-24", "1990-01-01", ""]) expect(() => referenceRequestDate(date, now)).toThrow();
  expect(referenceRequestDate(null, now)).toBe("2026-11-23");
});
test("zero amounts, same-currency values and reported effective rates do not divide by zero", () => {
  expect(calculateCurrency({ ...sample, amount: "0" }).effectiveRate).toBeNull();
  expect(calculateCurrency({ ...sample, from: "USD", to: "USD", rates: [] }).net.toString()).toBe("100");
  expect(calculateCurrency({ ...sample, reportedReceived: "368000" }).reportedRate!.toString()).toBe("3680");
});
test("invalid rates, excessive fees and unknown conventions fail closed", () => {
  for (const rates of [[], [{ ...sample.rates[0], rate: "0" }], [{ ...sample.rates[0], rate: "-1" }]]) expect(() => calculateCurrency({ ...sample, rates })).toThrow();
  for (const patch of [{ fixedFee: "370001" }, { feePercent: "-1" }, { reduction: "100" }, { providerMode: "rate" as const, providerRate: "0" }]) expect(() => calculateCurrency({ ...sample, ...patch })).toThrow();
});
