import { test, expect } from "@playwright/test";
import { calculateCommission, type CommissionInputs } from "../src/lib/calculators/commission";
import { conventionalInstrument } from "../src/lib/calculators/instruments";
const sample: CommissionInputs = { instrument: conventionalInstrument("EUR/USD"), account: "USD", feeCurrency: "USD", volumeMode: "lots", orders: [{ side: "entry", volume: "1" }, { side: "exit", volume: "1" }], mode: "lot-side", entryRate: "3.5", minimum: "0", feeLotUnits: "100000", roundTurnBilling: "split", notionalBasis: "quote", alreadyCharged: "0", repetitions: 1, pipEnabled: true, rates: [] };
test("per-side and round-turn rates match all supplied lot and pip-equivalent examples", () => {
  expect(calculateCommission(sample).total.toString()).toBe("7");
  const small = calculateCommission({ ...sample, orders: [{ side: "entry", volume: ".2" }, { side: "exit", volume: ".2" }] });
  expect(small.total.toString()).toBe("1.4"); expect(small.pipEquivalent!.toString()).toBe("0.7");
  expect(calculateCommission({ ...sample, mode: "lot-roundturn", entryRate: "7", orders: [{ side: "entry", volume: ".5" }, { side: "exit", volume: ".5" }] }).total.toString()).toBe("3.5");
});
test("partial closes preserve proportional fees but apply minimums per executed order", () => {
  const orders = [{ side: "entry" as const, volume: "1" }, { side: "exit" as const, volume: ".4" }, { side: "exit" as const, volume: ".6" }];
  expect(calculateCommission({ ...sample, orders }).total.toString()).toBe("7");
  const tiny = orders.map(row => ({ ...row, volume: String(Number(row.volume) / 10) }));
  expect(calculateCommission({ ...sample, orders: tiny, minimum: "1" }).total.toString()).toBe("3");
});
test("percentage notional uses each leg's currency and executable price", () => {
  const base = { ...sample, mode: "percent-notional" as const, entryRate: ".002", orders: [{ side: "entry" as const, volume: "1", price: "1" }] };
  expect(calculateCommission(base).total.toString()).toBe("2");
  const next = calculateCommission({ ...base, orders: [{ side: "entry", volume: "1", price: "1.1" }, { side: "exit", volume: "1", price: "1.2" }] });
  expect(next.entryFee.toString()).toBe("2.2"); expect(next.exitFee.toString()).toBe("2.4");
  expect(() => calculateCommission({ ...base, feeCurrency: "EUR" })).toThrow(/match/);
});
test("USD fees convert into EUR and million-unit fees do not assume dollar notional", () => {
  expect(calculateCommission({ ...sample, account: "EUR", rates: [{ base: "USD", quote: "EUR", rate: ".9", source: "manual", asOf: null }] }).total.toString()).toBe("6.3");
  expect(calculateCommission({ ...sample, mode: "million-units", entryRate: "35" }).total.toString()).toBe("7");
});
test("billed lot units stay separate from configured platform lots", () => {
  const r = calculateCommission({ ...sample, instrument: { ...sample.instrument, contractSize: "10000" } });
  expect(r.entryUnits.toString()).toBe("10000"); expect(r.total.toString()).toBe("0.7");
});
test("prepaid round turns are never doubled or assigned exit minimums", () => {
  const r = calculateCommission({ ...sample, mode: "lot-roundturn", entryRate: "7", roundTurnBilling: "entry", minimum: "1", alreadyCharged: "7", repetitions: 100 });
  expect(r.total.toString()).toBe("7"); expect(r.exitFee.isZero()).toBe(true); expect(r.remainingCharge.isZero()).toBe(true); expect(r.repeatedTotal.toString()).toBe("700");
});
test("optional order-level half-up rounding is explicit rather than silently rounding conversions", () => {
  const r = calculateCommission({ ...sample, orders: [{ side: "entry", volume: ".01" }], feeDecimals: 2 }); expect(r.total.toString()).toBe("0.04");
});
test("invalid schedules, rates, over-closes and unsupported precision fail closed", () => {
  for (const patch of [{ entryRate: "-1" }, { minimum: "-1" }, { orders: [{ side: "exit" as const, volume: "1" }] }, { feeDecimals: -1 }, { repetitions: 1.5 }, { alreadyCharged: "8" }]) expect(() => calculateCommission({ ...sample, ...patch })).toThrow();
  expect(() => calculateCommission({ ...sample, account: "EUR", rates: [{ base: "USD", quote: "EUR", rate: "0", source: "manual", asOf: null }] })).toThrow();
  expect(() => calculateCommission({ ...sample, minimum: "0.001", feeDecimals: 2 })).toThrow(/minimum/);
});
