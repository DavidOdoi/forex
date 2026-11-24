import { test, expect } from "@playwright/test";
import { analyzeDrawdown, drawdownSnapshot } from "../src/lib/calculators/drawdown";
import { parseEquityCsv } from "../src/lib/calculators/history-csv";
import { D } from "../src/lib/calculators/precision";
import { serializePrivateSettings } from "../src/lib/calculators/trade-scenario";
test("snapshot declines and asymmetric recovery percentages match mandatory examples", () => {
  expect(drawdownSnapshot("10000", "8000").percent.toString()).toBe("20"); expect(drawdownSnapshot("10000", "8000").recovery!.toString()).toBe("25");
  expect(drawdownSnapshot("12000", "9000", "10000").percent.toString()).toBe("25"); expect(drawdownSnapshot("12000", "9000", "10000").initialChange!.toString()).toBe("-10");
  expect(drawdownSnapshot("20000", "14000").recovery!.toNumber()).toBeCloseTo(42.857142857, 8); expect(drawdownSnapshot("10000", "5000").recovery!.toString()).toBe("100");
  expect(drawdownSnapshot("10000", "0").recovery).toBeNull(); expect(drawdownSnapshot("10000", "-100").percent.toString()).toBe("101");
});
test("ordered history identifies maximum and current drawdown separately and observes recovery", () => {
  const r = analyzeDrawdown([10000, 12000, 10800, 9000, 11500, 13000].map((value, i) => ({ value, date: `2026-01-0${i + 1}` })), "none");
  expect(r.maxPercent.percent.toString()).toBe("25"); expect(r.current.percent.isZero()).toBe(true); expect(r.recoveryIndex).toBe(5); expect(r.peakToTroughDays).toBe(2); expect(r.troughToRecoveryDays).toBe(2);
  const unresolved = analyzeDrawdown([10000, 12000, 9000, 11000].map(value => ({ value })), "none"); expect(unresolved.recoveryIndex).toBeNull(); expect(unresolved.current.percent.gt(0)).toBe(true);
});
test("maximum money and maximum percentage can belong to different episodes", () => {
  const r = analyzeDrawdown([100, 50, 1000, 900].map(value => ({ value })), "none"); expect(r.maxPercent.percent.toString()).toBe("50"); expect(r.maxAmount.amount.toString()).toBe("100"); expect(r.maxPercent.index).not.toBe(r.maxAmount.index);
});
test("end-of-interval cash flows avoid classifying a withdrawal as a trading loss", () => {
  const r = analyzeDrawdown([{ value: "10000", flow: "0" }, { value: "6000", flow: "-4000" }], "end-flow"); expect(r.maxPercent.percent.isZero()).toBe(true); expect(r.raw.maxPercent.percent.toString()).toBe("40");
  const deposit = analyzeDrawdown([{ value: "10000", flow: "0" }, { value: "14000", flow: "5000" }], "end-flow"); expect(deposit.maxPercent.percent.toString()).toBe("10");
  expect(() => analyzeDrawdown([{ value: "10000" }, { value: "6000", flow: "-4000" }], "end-flow")).toThrow(/explicit flow/);
});
test("fixed-percentage loss sequences reproduce the brief without forecasting recovery", () => {
  for (const [risk, remaining] of [["0.01", 90.4382075], ["0.05", 59.8736939]] as const) { const values = Array.from({ length: 11 }, (_, i) => ({ value: new D(10000).mul(new D(1).sub(risk).pow(i)).toString() })); const r = analyzeDrawdown(values, "none"); expect(r.last.div(r.first).mul(100).toNumber()).toBeCloseTo(remaining, 6); expect(r.recoveryIndex).toBeNull(); }
});
test("CSV headers, quotes and dates parse without silently sorting or omitting required flows", () => {
  const parsed = parseEquityCsv('date,equity,flow\n2026-01-01,"10000",0\n2026-01-02,"8000",0'); expect(parsed.columnType).toBe("equity"); expect(analyzeDrawdown(parsed.observations, "none").current.percent.toString()).toBe("20");
  expect(() => analyzeDrawdown([{ value: "10000", date: "2026-01-02" }, { value: "9000", date: "2026-01-01" }], "none")).toThrow(/increasing/);
  expect(() => analyzeDrawdown([{ value: "10000" }, { value: "6000", flow: "-4000" }], "none")).toThrow(/flows/);
  expect(() => analyzeDrawdown([{ value: "0" }, { value: "100" }], "none")).toThrow(/first/);
});
test("shared settings omit financial histories and snapshot amounts", () => {
  const query = new URLSearchParams(serializePrivateSettings({ account: "USD", analysisMode: "history", flowMode: "end-flow", history: "2026-01-01,123456.78,0", peak: "123456.78", current: "111111.11" }, ["history", "peak", "current"]));
  expect(query.get("account")).toBe("USD"); expect(query.get("flowMode")).toBe("end-flow"); expect(query.get("privateDataOmitted")).toBe("yes");
  for (const field of ["history", "peak", "current"]) expect(query.has(field)).toBe(false);
  expect(query.toString()).not.toContain("123456");
});
