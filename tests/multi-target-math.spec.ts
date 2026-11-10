import { test, expect } from "@playwright/test";
import { Dec, calculateMultiTarget, cashText, decimalText, equalAllocations, remainingPercentage, samplePlan, type MultiTargetInput } from "../src/lib/calculators/multi-target";
import { multiTargetCsv, readableMultiTargetPlan } from "../src/lib/calculators/multi-target-export";
import { calculateProfit } from "../src/lib/calculators/forex";

test("the supplied worked example and every original/entry-stop path match exactly", () => {
  const p = calculateMultiTarget(samplePlan());
  expect(p.stopPips.toFixed()).toBe("50"); expect(p.initialRisk.toFixed()).toBe("500");
  expect(p.rows.map(r => r.lots.toFixed())).toEqual(["0.5", "0.3", "0.2"]);
  expect(p.rows.map(r => r.gross.toFixed())).toEqual(["250", "300", "300"]);
  expect(p.targetGross.toFixed()).toBe("850"); expect(p.weightedR!.toFixed()).toBe("1.7"); expect(p.weightedExit!.toFixed()).toBe("1.1085");
  expect(p.scenarios.map(s => s.gross.toFixed())).toEqual(["-500", "0", "450", "850"]);
  const moved = calculateMultiTarget({ ...samplePlan(), stopPolicy: "entry" });
  expect(moved.scenarios.map(s => s.gross.toFixed())).toEqual(["-500", "250", "550", "850"]);
  expect(calculateMultiTarget({ ...samplePlan(), stopPolicy: "entry", moveAfter: "2" }).scenarios[1].gross.toFixed()).toBe("0");
});
test("sell and JPY contracts preserve directional pips, weights and risk", () => {
  const sell = samplePlan(); sell.side = "sell"; sell.stop = "1.1050";
  sell.targets.forEach((t, i) => { t.value = ["1.0950", "1.0900", "1.0850"][i]; });
  const p = calculateMultiTarget(sell);
  expect(p.targetGross.toFixed()).toBe("850"); expect(p.weightedExit!.toFixed()).toBe("1.0915");
  expect(p.rows.map(r => r.pips.toFixed())).toEqual(["50", "100", "150"]);
  const yen = samplePlan(); yen.pair = "USD/JPY"; yen.account = "JPY"; yen.entry = "150"; yen.stop = "149.5";
  yen.targets.forEach((t, i) => { t.value = ["150.5", "151", "151.5"][i]; });
  expect(calculateMultiTarget(yen).initialRisk.toFixed()).toBe("50000");
  expect(calculateMultiTarget(yen).stopPips.toFixed()).toBe("50");
  expect(calculateMultiTarget(yen).targetGross.toFixed()).toBe("85000");
  expect(calculateMultiTarget({ ...yen, pipOverride: "0.001" }).stopPips.toFixed()).toBe("500");
});
test("manual constant conversion supports non-USD and inverse rates without USD pip shortcuts", () => {
  const direct = calculateMultiTarget({ ...samplePlan(), account: "KES", conversionRate: "125" });
  expect(direct.initialRisk.toFixed()).toBe("62500"); expect(direct.targetGross.toFixed()).toBe("106250");
  const inverse = calculateMultiTarget({ ...samplePlan(), account: "KES", conversionDirection: "inverse", conversionRate: "0.008" });
  expect(inverse.factor.eq(direct.factor)).toBe(true); expect(inverse.targetGross.eq(direct.targetGross)).toBe(true);
  const baseAccount = calculateMultiTarget({ ...samplePlan(), account: "EUR", conversionRate: "0.8" });
  expect(baseAccount.initialRisk.toFixed()).toBe("400"); expect(baseAccount.targetGross.toFixed()).toBe("680");
  for (const p of [direct, inverse, baseAccount]) expect(p.cashR!.eq(p.weightedR!)).toBe(true);
  for (const conversionRate of ["", "0", "-1", "NaN", "Infinity"]) expect(() => calculateMultiTarget({ ...samplePlan(), account: "EUR", conversionRate })).toThrow(/conversion rate/i);
});
test("risk-based modes always round down to the actual volume grid", () => {
  for (const input of [{ ...samplePlan(), sizeMode: "cash" as const, cashRisk: "73" }, { ...samplePlan(), sizeMode: "percent" as const, balance: "7300", riskPercent: "1" }]) {
    const p = calculateMultiTarget(input);
    expect(p.lots.toFixed()).toBe("0.14"); expect(p.initialRisk.toFixed()).toBe("70");
    expect(p.initialRisk.lte(p.budget!)).toBe(true);
  }
  expect(() => calculateMultiTarget({ ...samplePlan(), sizeMode: "cash", cashRisk: "0.1" })).toThrow(/below.*minimum/);
});
test("one or ten targets, equal allocations and remaining allocation are exact decimal operations", () => {
  for (const count of [1, 3, 7, 10]) {
    const percentages = equalAllocations(count);
    expect(percentages.reduce((sum, n) => sum.plus(n), new Dec(0)).toFixed()).toBe("100");
    const p = calculateMultiTarget({ ...samplePlan(), targets: percentages.map((percent, i) => ({ mode: "r", value: String(i + 1), percent })) });
    expect(p.rows.length).toBe(count); expect(p.runnerLots.toFixed()).toBe("0");
  }
  expect(remainingPercentage([{ mode: "r", value: "1", percent: "33.33" }, { mode: "r", value: "2", percent: "33.33" }, { mode: "r", value: "3", percent: "1" }], 2)).toBe("33.34");
  expect(() => equalAllocations(0)).toThrow(); expect(() => equalAllocations(11)).toThrow();
});
test("runner mode never invents final R or realized profits for an open remainder", () => {
  const input = { ...samplePlan(), runner: true, targets: [{ mode: "r" as const, value: "1", percent: "50" }] };
  const p = calculateMultiTarget(input);
  expect(p.targetGross.toFixed()).toBe("250"); expect(p.runnerLots.toFixed()).toBe("0.5");
  expect(p.weightedR).toBeNull(); expect(p.finalGross).toBeNull(); expect(p.weightedExit).toBeNull();
  expect(p.weightedClosedExit.toFixed()).toBe("1.105"); expect(p.closedAverageR.toFixed()).toBe("1");
  expect(p.scenarios[1].open).toBe(true); expect(p.scenarios[1].r).toBeNull();
  expect(p.scenarios[2].label).toContain("stop on runner"); expect(p.scenarios[2].gross.toFixed()).toBe("0");
  const closed = calculateMultiTarget({ ...input, runnerExit: "1.1100" });
  expect(closed.finalGross!.toFixed()).toBe("750"); expect(closed.weightedR!.toFixed()).toBe("1.5");
  expect(calculateMultiTarget({ ...input, runnerExit: "1.095" }).finalGross!.toFixed()).toBe("0");
  expect(() => calculateMultiTarget({ ...input, runnerExit: "1.09" })).toThrow(/trigger first/);
  expect(() => calculateMultiTarget({ ...input, stopPolicy: "entry", runnerExit: "1.099" })).toThrow(/trigger first/);
});
test("allocation validation rejects under/over-allocation, zeros, duplicates and wrong target ordering", () => {
  const change = (percents: string[]) => ({ ...samplePlan(), targets: samplePlan().targets.map((t, i) => ({ ...t, percent: percents[i] })) });
  expect(() => calculateMultiTarget(change(["50", "30", "21"]))).toThrow(/exceeds 100/);
  expect(() => calculateMultiTarget(change(["50", "30", "19"]))).toThrow(/exactly 100/);
  expect(() => calculateMultiTarget(change(["50", "50", "0"]))).toThrow(/allocation/);
  const duplicate = samplePlan(); duplicate.targets[1].value = duplicate.targets[0].value;
  expect(() => calculateMultiTarget(duplicate)).toThrow(/duplicates/);
  const outOfOrder = samplePlan(); outOfOrder.targets[1].value = "1.102";
  expect(() => calculateMultiTarget(outOfOrder)).toThrow(/progress/);
  const lossTarget = samplePlan(); lossTarget.targets[0].value = "1.099";
  expect(() => calculateMultiTarget(lossTarget)).toThrow(/profit side/);
});
test("invalid stops, unsupported symbols, bad numeric inputs and invalid target counts cannot return a result", () => {
  for (const stop of ["1.1", "1.101"]) expect(() => calculateMultiTarget({ ...samplePlan(), stop })).toThrow(/loss side/);
  for (const field of ["entry", "stop", "lots", "contract", "minimum", "step"] as const) {
    for (const value of ["", "0", "-1", "NaN", "Infinity", NaN as unknown as string]) expect(() => calculateMultiTarget({ ...samplePlan(), [field]: value })).toThrow();
  }
  for (const pair of ["XAU/USD", "BTC/USD", "EUR/FAKE"]) expect(() => calculateMultiTarget({ ...samplePlan(), pair })).toThrow(/supported forex/);
  expect(() => calculateMultiTarget({ ...samplePlan(), targets: [] })).toThrow();
  expect(() => calculateMultiTarget({ ...samplePlan(), targets: Array(11).fill(samplePlan().targets[0]) })).toThrow();
});
test("broker-step proposals are explicit, deterministic and use actual lots in adjusted profits", () => {
  const input = { ...samplePlan(), lots: "0.03" };
  const ideal = calculateMultiTarget(input);
  expect(ideal.executable).toBe(false); expect(ideal.rows.map(r => r.idealLots.toFixed())).toEqual(["0.015", "0.009", "0.006"]);
  expect(ideal.rows.map(r => r.proposedLots!.toFixed())).toEqual(["0.01", "0.01", "0.01"]);
  expect(ideal.targetGross.toFixed()).toBe("25.5");
  const adjusted = calculateMultiTarget(input, "adjusted");
  expect(adjusted.executable).toBe(true); expect(adjusted.targetGross.toFixed()).toBe("30"); expect(adjusted.weightedR!.toFixed()).toBe("2");
  expect(adjusted.rows.every(r => r.remaining.isZero() || r.remaining.gte(adjusted.minimum))).toBe(true);
  expect(() => calculateMultiTarget({ ...samplePlan(), lots: "0.031" })).toThrow(/multiple.*lot step/);
  const small = calculateMultiTarget({ ...samplePlan(), lots: "0.02" });
  expect(small.adjustmentError).toMatch(/too small.*3 valid partial closes/);
  expect(() => calculateMultiTarget({ ...samplePlan(), lots: "0.02" }, "adjusted")).toThrow(/too small/);
  const invalidRunner = calculateMultiTarget({ ...samplePlan(), lots: "0.03", runner: true, targets: [{ mode: "r", value: "1", percent: "90" }] });
  expect(invalidRunner.volumeIssues.join(" ")).toContain("remainder is invalid");
  const validRunner = calculateMultiTarget(invalidRunner.input, "adjusted");
  expect(validRunner.runnerLots.toFixed()).toBe("0.01");
});
test("non-step-aligned minimum volumes are rounded up in step units, with no invalid remainders", () => {
  const p = calculateMultiTarget({ ...samplePlan(), minimum: "0.03", step: "0.02", lots: "0.12" }, "adjusted");
  expect(p.rows.map(r => r.lots.toFixed())).toEqual(["0.04", "0.04", "0.04"]);
  expect(p.executable).toBe(true);
});
test("commission charges full entry once and each actual exit, including entry-price stops", () => {
  const p = calculateMultiTarget({ ...samplePlan(), commissionEnabled: true });
  expect(p.entryCommission.toFixed()).toBe("3.5"); expect(p.finalCosts!.toFixed()).toBe("7"); expect(p.finalNet!.toFixed()).toBe("843");
  expect(p.rows.map(r => r.cumulativeNet.toFixed())).toEqual(["244.75", "543.7", "843"]);
  expect(p.weightedR!.toFixed()).toBe("1.7"); expect(p.netR!.toFixed()).toBe("1.686");
  const moved = calculateMultiTarget({ ...samplePlan(), commissionEnabled: true, stopPolicy: "entry" });
  expect(moved.scenarios[1].net.toFixed()).toBe("243");
  const customContract = calculateMultiTarget({ ...samplePlan(), commissionEnabled: true, contract: "10000" });
  expect(customContract.finalCosts!.toFixed()).toBe("0.7");
  const runner = calculateMultiTarget({ ...samplePlan(), commissionEnabled: true, runner: true, targets: [{ mode: "r", value: "1", percent: "50" }] });
  expect(runner.targetNet.toFixed()).toBe("244.75"); expect(runner.scenarios[1].costs.toFixed()).toBe("5.25");
});
test("single-exit agreement, split-exit conservation and fixed-conversion R invariants hold", () => {
  const one: MultiTargetInput = { ...samplePlan(), targets: [{ mode: "price", value: "1.11", percent: "100" }] };
  const single = calculateMultiTarget(one);
  expect(single.targetGross.toNumber()).toBeCloseTo(calculateProfit({ pair: "EUR/USD", account: "USD", side: "buy", lots: 1, entry: 1.1, exit: 1.11, contractSize: 100000, commission: 0, swap: 0 }).accountGross, 8);
  const exit = new Dec("1.11"), entry = new Dec("1.1"), contract = new Dec(100000);
  const split = [new Dec("0.1"), new Dec("0.2"), new Dec("0.7")].reduce((total, lots) => total.plus(exit.minus(entry).mul(contract).mul(lots)), new Dec(0));
  expect(split.eq(single.targetGross)).toBe(true); // Duplicate UI targets are intentionally rejected.
  for (const lots of ["0.03", "0.07", "0.12", "1", "3.19"]) for (const count of [1,2,3]) {
    const p = calculateMultiTarget({ ...samplePlan(), lots, targets: equalAllocations(count).map((percent, i) => ({ mode: "r", value: String(i + 1), percent })) }, "adjusted");
    expect(p.rows.reduce((sum, row) => sum.plus(row.lots), new Dec(0)).eq(p.lots)).toBe(true);
    expect(p.rows.every(r => r.remaining.gte(0))).toBe(true);
    expect(p.cashR!.minus(p.weightedR!).abs().lt("0.00000000000000000001")).toBe(true);
  }
});
test("display rounding never changes internal math, and exports preserve exact plan semantics", () => {
  const p = calculateMultiTarget({ ...samplePlan(), account: "EUR", conversionRate: "0.333333333333333333" });
  const before = p.targetGross.toFixed();
  cashText(p.targetGross, "EUR"); decimalText(p.rows[0].actualPercent, 2);
  expect(p.targetGross.toFixed()).toBe(before);
  expect(cashText(new Dec("-0.00001"), "USD")).toBe("USD 0.00");
  expect(readableMultiTargetPlan(calculateMultiTarget(samplePlan()))).toContain("USD 850.00");
  const csv = multiTargetCsv(calculateMultiTarget({ ...samplePlan(), commissionEnabled: true }));
  expect(csv).toContain('"843"'); expect(csv).toContain('"1.7"'); expect(csv).toContain("\r\n");
  expect(csv).toContain('"Initial stop price"'); expect(csv).toContain('"1.095"'); expect(csv).toContain('"100000"');
  const input = samplePlan(), snapshot = calculateMultiTarget(input); input.targets[0].value = "999";
  expect(snapshot.input.targets[0].value).toBe("1.1050");
});
