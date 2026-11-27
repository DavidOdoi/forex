import { test, expect } from "@playwright/test";
import { martingaleProgression, calculateSequentialMartingale, calculateMartingaleGrid, type ProgressionInput, type SequentialInput, type GridInput } from "../src/lib/calculators/martingale";
import { conventionalInstrument } from "../src/lib/calculators/instruments";
import { D } from "../src/lib/calculators/precision";
import { costDefinitions, costResult, costFields, changeCostField } from "../src/lib/calculators/cost-workbench";
import { serializePrivateSettings } from "../src/lib/calculators/trade-scenario";
const progression = (): ProgressionInput => ({ start: "0.01", multiplier: "2", levels: "6", minimum: "0.01", maximum: "100", increment: "0.01", rounding: "strict" });
const sequential = (): SequentialInput => ({ ...progression(), start: "1", losses: "4", account: "USD", balance: "100", minimum: "1", maximum: "1000", increment: "1", lossPerUnit: "1", winPerUnit: "1", lossFeePerUnit: "0", winFeePerUnit: "0", fixedFee: "0", reservePerUnit: "0" });
const grid = (): GridInput => ({ ...progression(), instrument: conventionalInstrument("EUR/USD"), account: "USD", direction: "buy", firstEntry: "1.1000", spacing: "20", spreadPips: "0", balance: "10000", entryFeePerLot: "0", exitFeePerLot: "0", fixedEntryFee: "0", financingPerLot: "0", marginMode: "leverage", leverage: "50", marginPercent: "2", thresholds: true, callPercent: "100", stopPercent: "50", rates: [] });
test("Martingale geometric totals match direct sums at six, eight and ten levels, including multiplier one", () => {
  const r = martingaleProgression({ ...progression(), levels: "10" });
  expect(r.rows.map(x => x.size.toString())).toEqual(["0.01", "0.02", "0.04", "0.08", "0.16", "0.32", "0.64", "1.28", "2.56", "5.12"]);
  for (const [n, expected] of [[6, "0.63"], [8, "2.55"], [10, "10.23"]] as const) { const p = martingaleProgression({ ...progression(), levels: n }); expect(p.total.toString()).toBe(expected); expect(p.theoreticalTotal.eq(p.total)).toBe(true); }
  const flat = martingaleProgression({ ...progression(), multiplier: "1" }); expect(flat.total.toString()).toBe("0.06"); expect(flat.theoreticalTotal.eq(flat.total)).toBe(true);
});
test("sequential even-money recovery and unequal winning payoffs are conditional", () => {
  const r = calculateSequentialMartingale(sequential()); expect(r.rows.map(x => x.modelledLoss.toString())).toEqual(["1", "2", "4", "8"]); expect(r.cumulativeLoss.toString()).toBe("15"); expect(r.next.size.toString()).toBe("16"); expect(r.sequenceResult.toString()).toBe("1"); expect(r.remaining.toString()).toBe("85"); expect(r.capitalFloor.toString()).toBe("31");
  expect(calculateSequentialMartingale({ ...sequential(), winPerUnit: "0.5" }).sequenceResult.toString()).toBe("-7");
  const noLosses = calculateSequentialMartingale({ ...sequential(), losses: "0" }); expect(noLosses.rows).toHaveLength(0); expect(noLosses.cumulativeLoss.isZero()).toBe(true); expect(noLosses.next.size.toString()).toBe("1");
});
test("sequential losing and winning fees are distinct, charged once and can prevent recovery", () => {
  const r = calculateSequentialMartingale({ ...sequential(), lossFeePerUnit: "0.1", winFeePerUnit: "0.2", fixedFee: "0.5" });
  expect(r.cumulativeLoss.toString()).toBe("18.5"); expect(r.winNet.toString()).toBe("12.3"); expect(r.sequenceResult.toString()).toBe("-6.2");
});
test("quantity grids never round up to minimum or cap excessive quantities", () => {
  const invalid = martingaleProgression({ ...progression(), start: "0.04", minimum: "0.03", increment: "0.02" }); expect(invalid.rows[0].issues.join()).toContain("Off");
  const down = martingaleProgression({ ...progression(), start: "0.03", multiplier: "1.5", levels: "3", minimum: "0.03", increment: "0.02", rounding: "down" }); expect(down.rows.map(x => x.size.toString())).toEqual(["0.03", "0.03", "0.05"]);
  const low = martingaleProgression({ ...progression(), start: "0.005", rounding: "down" }); expect(low.rows[0].size.toString()).toBe("0.005"); expect(low.rows[0].issues.join()).toContain("Below minimum");
  const limited = calculateMartingaleGrid({ ...grid(), maximum: "0.04" }); expect(limited.firstFailure?.level).toBe(4); expect(limited.rows.at(-1)?.blocked).toBe(true); expect(limited.last.lots.toString()).toBe("0.63");
});
test("sequential capital and opening-reserve constraints identify the first infeasible step", () => {
  expect(calculateSequentialMartingale({ ...sequential(), balance: "10" }).firstFailure?.level).toBe(4);
  expect(calculateSequentialMartingale({ ...sequential(), balance: "20", reservePerUnit: "2" }).firstFailure?.level).toBe(4);
  const nextOnly = calculateSequentialMartingale({ ...sequential(), balance: "16" }); expect(nextOnly.firstFailure).toBeNull(); expect(nextOnly.next.modelledLoss.gt(nextOnly.remaining)).toBe(true);
});
test("six-level grid produces independently specified entry, P&L, pip and break-even examples", () => {
  const r = calculateMartingaleGrid(grid()); expect(r.rows.map(x => x.entry.toString())).toEqual(["1.1", "1.098", "1.096", "1.094", "1.092", "1.09"]); expect(r.last.lots.toString()).toBe("0.63"); expect(r.last.units.toString()).toBe("63000"); expect(r.last.gross.toString()).toBe("-114"); expect(r.pip.pipValue.toString()).toBe("6.3"); expect(r.grossBreakEven.entry.toNumber()).toBeCloseTo(1.091809524, 9); expect(r.grossRecovery.toNumber()).toBeCloseTo(18.095238095, 8); expect(r.further!.gross.toString()).toBe("-240"); expect(r.further!.gross.sub(r.last.gross).toString()).toBe("-126"); expect(r.maxModelledLoss.toString()).toBe("240");
});
test("grid notional and margin use the current reference, not the first entry", () => {
  const r = calculateMartingaleGrid(grid()); expect(r.last.margin.notional.toString()).toBe("68670"); expect(r.last.margin.required.toString()).toBe("1373.4"); expect(new D("0.63").mul(100000).mul("1.1").div(50).toString()).toBe("1386");
  expect(calculateMartingaleGrid({ ...grid(), marginMode: "percent", marginPercent: "2", leverage: "" }).last.margin.required.toString()).toBe("1373.4");
});
test("buy and sell grid losses are symmetric with explicit closing spread", () => {
  const buy = calculateMartingaleGrid({ ...grid(), spreadPips: "2" }), sell = calculateMartingaleGrid({ ...grid(), direction: "sell", spreadPips: "2" });
  expect(buy.last.gross.toString()).toBe("-126.6"); expect(sell.last.gross.eq(buy.last.gross)).toBe(true); expect(sell.last.entry.toString()).toBe("1.11"); expect(sell.last.exit.toString()).toBe("1.1102"); expect(sell.grossRecovery.eq(buy.grossRecovery)).toBe(true); expect(sell.netBreakEven.rounded.lte(sell.netBreakEven.theoretical)).toBe(true);
});
test("grid fees, marked equity and reserved close-out costs are separated without double counting", () => {
  const r = calculateMartingaleGrid({ ...grid(), spreadPips: "2", entryFeePerLot: "3.5", exitFeePerLot: "3.5", fixedEntryFee: "1", financingPerLot: "-2" });
  expect(r.last.netPnl.toString()).toBe("-138.27"); expect(r.last.equity.toString()).toBe("9863.935"); expect(r.last.equity.sub(r.last.closingCosts).eq(r.balance.add(r.last.netPnl))).toBe(true); expect(r.netBreakEven.rounded.gte(r.netBreakEven.theoretical)).toBe(true); expect(r.netBreakEven.roundingNetQuote.gte(0)).toBe(true);
});
test("account conversion uses liability rates for losses and base units for base-account margin", () => {
  const eur = calculateMartingaleGrid({ ...grid(), account: "EUR", rates: [{ base: "USD", quote: "EUR", bid: "0.9", ask: "0.91", source: "manual", asOf: null }] }); expect(eur.last.gross.toString()).toBe("-103.74"); expect(eur.last.margin.notional.toString()).toBe("63000"); expect(eur.last.margin.required.toString()).toBe("1260");
  const jpy = calculateMartingaleGrid({ ...grid(), instrument: conventionalInstrument("USD/JPY"), firstEntry: "150", account: "USD", rates: [{ base: "USD", quote: "JPY", rate: "150", source: "manual", asOf: null }] }); expect(jpy.rows[1].entry.toString()).toBe("149.8"); expect(jpy.last.gross.toNumber()).toBeCloseTo(-76, 10);
  expect(() => calculateMartingaleGrid({ ...grid(), account: "UGX" })).toThrow(/conversion rate/);
});
test("price increments round adverse spacing outward and financing credits remain signed", () => {
  const r = calculateMartingaleGrid({ ...grid(), spacing: "0.15", levels: "2" }); expect(r.spacing.toString()).toBe("0.00002"); expect(r.rows[1].entry.toString()).toBe("1.09998"); expect(r.spacing.gt(r.requestedSpacing)).toBe(true);
  const credit = calculateMartingaleGrid({ ...grid(), financingPerLot: "100" }); expect(credit.last.netPnl.toString()).toBe("-51"); expect(credit.netBreakEven.theoretical.lt(credit.grossBreakEven.theoretical)).toBe(true);
});
test("margin limits and stop-out are sampled constraints, not guaranteed executable ladders", () => {
  const margin = calculateMartingaleGrid({ ...grid(), balance: "100" }); expect(margin.firstFailure?.level).toBe(3); expect(margin.rows[2].issues.join()).toContain("free margin");
  const stop = calculateMartingaleGrid({ ...grid(), balance: "100", stopPercent: "200", callPercent: "300" }); expect(stop.firstFailure?.level).toBe(2); expect(stop.rows[1].threshold?.status).toBe("At entered stop-out condition");
});
test("invalid and overflowing scenarios fail clearly, while disabled unused specifications are ignored", () => {
  for (const patch of [{ start: "0" }, { multiplier: "0.9" }, { levels: "-1" }, { levels: "21" }, { levels: "2.5" }, { start: "1000000", multiplier: "10", levels: "20" }]) expect(() => martingaleProgression({ ...progression(), ...patch })).toThrow();
  for (const patch of [{ firstEntry: "0" }, { spacing: "0" }, { spreadPips: "0.001" }, { firstEntry: "0.0001" }, { leverage: "" }, { marginPercent: "0", marginMode: "percent" as const }, { stopPercent: "200", callPercent: "100" }]) expect(() => calculateMartingaleGrid({ ...grid(), ...patch })).toThrow();
  expect(() => calculateMartingaleGrid({ ...grid(), instrument: { ...grid().instrument, contractSize: "0" } })).toThrow();
  expect(calculateMartingaleGrid({ ...grid(), thresholds: false, stopPercent: "", callPercent: "" }).last.threshold).toBeNull();
});
test("registry, private settings and pair changes preserve the shared calculator contract", () => {
  const d = costDefinitions.martingale; expect(costResult("martingale", d.defaults).value).toBe("USD -114.00");
  const params = new URLSearchParams(serializePrivateSettings(d.defaults, d.privateFields!)); for (const key of d.privateFields!) expect(params.has(key)).toBe(false); expect(params.get("privateDataOmitted")).toBe("yes");
  expect(() => costFields("martingale", { ...d.defaults, pair: "invalid" })).not.toThrow();
  expect(changeCostField("martingale", d.defaults, "pair", "USD/JPY").firstEntry).toBe("");
  expect(costFields("martingale", { ...d.defaults, analysisMode: "sequential", account: "EUR" }).some(x => x.name === "rateSource")).toBe(false);
});
