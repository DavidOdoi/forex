import { test, expect } from "@playwright/test";
import { calculateMarginCall, type MarginCallInputs } from "../src/lib/calculators/margin-call";
const sample: MarginCallInputs = { account: "USD", equityMode: "equity", equity: "2000", balance: "2000", floating: "0", used: "1000", callPercent: "100", stopPercent: "50", comparison: "at-or-below", deposit: "0", withdrawal: "0", pnlChange: "0", costs: "0", profile: { mode: "illustration" } };
test("margin levels, free margin and both equity thresholds match supplied examples", () => {
  expect(calculateMarginCall(sample).current.level!.toString()).toBe("200");
  expect(calculateMarginCall({ ...sample, equity: "5000", used: "1500" }).current.free.toString()).toBe("3500");
  const large = calculateMarginCall({ ...sample, used: "2000" }); expect(large.current.callEquity.toString()).toBe("2000"); expect(large.current.stopEquity.toString()).toBe("1000");
  const account = calculateMarginCall({ ...sample, equity: "1500" }); expect(account.current.level!.toString()).toBe("150"); expect(account.current.callEquity.toString()).toBe("1000"); expect(account.current.stopEquity.toString()).toBe("500");
});
test("changes in equity and used margin have separate effects and signed distances", () => {
  expect(calculateMarginCall({ ...sample, equity: "1200" }).current.level!.toString()).toBe("120");
  const loss = calculateMarginCall({ ...sample, equity: "900" }); expect(loss.current.level!.toString()).toBe("90"); expect(loss.current.callDistance.toString()).toBe("-100"); expect(loss.current.status).toContain("margin-call");
  expect(calculateMarginCall({ ...sample, used: "1500" }).current.level!.toNumber()).toBeCloseTo(133.3333333333, 8);
  const scenario = calculateMarginCall({ ...sample, pnlChange: "-300", costs: "10", deposit: "100", withdrawal: "50", scenarioUsed: "1500" }); expect(scenario.scenario.equity.toString()).toBe("1740"); expect(scenario.current.equity.toString()).toBe("2000");
});
test("zero margin and zero-percent stop-out never divide by zero or invent a price", () => {
  const empty = calculateMarginCall({ ...sample, used: "0" }); expect(empty.current.level).toBeNull(); expect(empty.current.status).toBe("No margin currently used");
  const zero = calculateMarginCall({ ...sample, stopPercent: "0", equity: "0" }); expect(zero.current.stopEquity.isZero()).toBe(true); expect(zero.current.status).toContain("stop-out");
  expect(calculateMarginCall({ ...sample, stopPercent: "0", equity: "-1" }).current.level!.toString()).toBe("-0.1");
  expect(Object.keys(zero)).not.toContain("stopOutPrice");
});
test("equity from balance and floating P&L preserves losses and threshold equality convention", () => {
  const r = calculateMarginCall({ ...sample, equityMode: "balance-pnl", balance: "5000", floating: "-1000", used: "2000" }); expect(r.current.level!.toString()).toBe("200");
  expect(calculateMarginCall({ ...sample, equity: "1000" }).current.status).toContain("margin-call");
  expect(calculateMarginCall({ ...sample, equity: "1000", comparison: "below" }).current.status).toBe("No entered threshold condition met");
});
test("referenced broker rules require scoped public documentation and explicit user confirmation", () => {
  const profile = { mode: "user-source" as const, broker: "Example only", entity: "Example company", accountType: "Example product", sourceUrl: "https://example.com/rules", checkedDate: "2026-11-23", confirmed: true };
  expect(calculateMarginCall({ ...sample, profile }, Date.parse("2026-11-24T12:00:00Z")).profileUrl).toBe("https://example.com/rules");
  for (const patch of [{ entity: "" }, { accountType: "" }, { sourceUrl: "javascript:alert(1)" }, { sourceUrl: "https://user:secret@example.com/" }, { checkedDate: "2026-02-30" }, { confirmed: false }]) expect(() => calculateMarginCall({ ...sample, profile: { ...profile, ...patch } }, Date.parse("2026-11-24T12:00:00Z"))).toThrow();
});
test("invalid thresholds and account scenarios fail closed", () => {
  for (const patch of [{ used: "-1" }, { callPercent: "-1" }, { stopPercent: "101" }, { deposit: "-1" }]) expect(() => calculateMarginCall({ ...sample, ...patch })).toThrow();
});
