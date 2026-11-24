import { test, expect } from "@playwright/test";
import { calculateRiskReward, type RiskRewardInputs } from "../src/lib/calculators/risk-reward";
import { riskScenarioInputs, defaultRiskScenario } from "../src/lib/calculators/trade-scenario";
import { conventionalInstrument } from "../src/lib/calculators/instruments";
const base = (): RiskRewardInputs => riskScenarioInputs(defaultRiskScenario);
test("brief: 20/40 pips gives 1:2 and one-third break-even; costs yield 390/210 and 35%", () => {
  const r = calculateRiskReward(base()); expect(r.riskPips.toString()).toBe("20"); expect(r.rewardPips.toString()).toBe("40"); expect(r.grossR.toString()).toBe("2"); expect(r.breakEven?.toNumber()).toBeCloseTo(100/3, 10);
  const net = calculateRiskReward({ ...base(), commission: "10", probability: "40" });
  expect(net.win.toString()).toBe("390"); expect(net.loss.toString()).toBe("210"); expect(net.netR?.toNumber()).toBeCloseTo(390/210,10); expect(net.breakEven?.toString()).toBe("35"); expect(net.expectancy?.toString()).toBe("30");
});
test("sell ordering, alternative targets, unit sizes and zero probability are supported", () => {
  const r = calculateRiskReward({ ...base(), direction: "sell", stop: "1.102", target: "1.096", extraTargets: ["1.098", "1.094"], volumeMode: "units", volume: "100000", probability: "0" });
  expect(r.grossR.toString()).toBe("2"); expect(r.targets.map(t => t.grossR.toString())).toEqual(["2","1","3"]); expect(r.expectancy?.toString()).toBe("-200");
  expect(calculateRiskReward({ ...base(), probability: "100" }).expectancy?.toString()).toBe("400");
});
test("costs consuming the target do not produce a fictitious positive ratio or win rate", () => {
  const r = calculateRiskReward({ ...base(), commission: "400", probability: "50" }); expect(r.netR).toBeNull(); expect(r.breakEven).toBeNull(); expect(r.expectancy?.toString()).toBe("-300");
});
test("wrong-side stops and targets, zero risks, invalid probabilities and negative costs reject", () => {
  for (const patch of [{ stop: "1.1" }, { stop: "1.101" }, { target: "1.099" }, { target: "1.1" }, { commission: "-1" }, { probability: "-1" }, { probability: "101" }, { extraTargets: ["1.09"] }, { volume: "0" }]) expect(() => calculateRiskReward({ ...base(), ...patch })).toThrow();
});
test("JPY pips and account conversions preserve monetary risk independently of price ratios", () => {
  const r = calculateRiskReward({ ...base(), instrument: conventionalInstrument("USD/JPY"), entry: "160", stop: "159.8", target: "160.4", rates: [{ base: "USD", quote: "JPY", bid: "160", ask: "160.1", source: "manual", asOf: null }] });
  expect(r.riskPips.toString()).toBe("20"); expect(r.grossR.toString()).toBe("2"); expect(r.loss.toNumber()).toBeCloseTo(20000/160,8); expect(r.win.toNumber()).toBeCloseTo(40000/160.1,8);
});
