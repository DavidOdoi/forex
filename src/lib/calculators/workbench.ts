import { calculatePip } from "./pip";
import { pipScenarioInputs, marginScenarioInputs, defaultMarginScenario, defaultPipScenario, type TradeScenario } from "./trade-scenario";
import { cash, quantity, D } from "./precision";
import type { ExchangeRate, resolveConversion } from "./exchange-rates";
import { calculateMargin } from "./margin";

export type WorkbenchKind = "pip" | "margin";
export const workbenchDefaults = { pip: defaultPipScenario, margin: defaultMarginScenario };
export const workbenchPaths = { pip: "/calculators/forex-pip-calculator", margin: "/calculators/forex-margin-calculator" };
export type WorkbenchOutput = {
  title: string; value: string; summary: string; conversion: ReturnType<typeof resolveConversion>;
  metrics: string[][]; tables: { title: string; headers: string[]; rows: string[][] }[];
  steps: string[]; warnings: string[];
  marginVisual?: { usedPercent: number; used: string; available: string; deficit: boolean };
};
const exposureMoney = (value: Parameters<typeof cash>[0], currency: string) => {
  const amount = new D(value);
  return !amount.isZero() && amount.toDecimalPlaces(8).isZero() ? `${currency} ${amount.toExponential(6)}` : cash(amount, currency, 8);
};

export function workbenchResult(kind: WorkbenchKind, values: TradeScenario, rates: ExchangeRate[] = []): WorkbenchOutput {
  if (kind === "margin") {
    const input = marginScenarioInputs(values, rates);
    const result = calculateMargin(input);
    const money = (value: Parameters<typeof cash>[0]) => exposureMoney(value, input.account);
    return {
      title: "Estimated margin for this position", value: money(result.required), summary: `${quantity(result.units)} ${input.instrument.base} · ${quantity(result.rate.mul(100), 8)}% margin · 1:${quantity(result.effectiveLeverage, 8)}`,
      conversion: result.conversion,
      metrics: [["Notional exposure", money(result.notional)], ["Base-to-account factor", `${quantity(result.baseToAccount, 12)} ${input.account} / ${input.instrument.base}`], ...(result.after ? [["New total used margin", money(result.after.used)], ["Estimated free margin", money(result.after.free)], ["Margin level after trade", result.after.level === null ? "No margin in use" : `${quantity(result.after.level, 2)}%`], ["Current margin level", result.before?.level == null ? "No margin in use" : `${quantity(result.before.level, 2)}%`]] : [])],
      tables: [{ title: "Illustrative leverage comparisons", headers: ["Leverage", "Required margin"], rows: result.comparisons.map(row => [`1:${quantity(row.leverage, 8)}`, money(row.required)]) }],
      steps: [result.baseIsAccount ? `${input.instrument.base} is your account currency: ${quantity(result.units)} base units = ${money(result.notional)} notional, with no conversion quote required.` : `${quantity(result.units)} ${input.instrument.base} × ${values.price} ${input.instrument.quote}/${input.instrument.base} × ${quantity(result.conversion.factor, 12)} = ${money(result.notional)} notional.`, `${money(result.notional)} × ${quantity(result.rate.mul(100), 8)}% = ${money(result.required)} estimated margin.`, ...(result.after && result.before ? [`${money(result.before.used)} existing margin + ${money(result.required)} proposed margin = ${money(result.after.used)} total.`, `${money(result.after.equity)} equity − ${money(result.after.used)} used = ${money(result.after.free)} free margin.`] : [])],
      warnings: ["Margin is collateral, not a fee or a maximum loss. This flat-rate estimate excludes netting, hedging, tiering and broker-specific close-out rules.", "Leverage comparisons illustrate the mathematics, not the leverage available or suitable for your account.", ...(result.after ? ["This account projection holds equity constant. Entry costs and changing floating P&L are not deducted here."] : []), ...(result.after?.insufficient ? ["Insufficient free margin under these assumptions. Do not interpret this estimate as confirmation that the trade can be opened."] : []), ...(values.bidAsk === "yes" && !result.conversion.identity ? ["The conversion uses the conservative funding side: direct ask or inverse 1/bid. A broker may apply a different margin conversion."] : [])],
      ...(result.after ? { marginVisual: { usedPercent: result.after.equity.isZero() ? 100 : Math.min(100, Math.max(0, result.after.used.div(result.after.equity).mul(100).toNumber())), used: money(result.after.used), available: money(result.after.free), deficit: result.after.insufficient } } : {}),
    };
  }
  if (kind !== "pip") throw new Error("Choose a supported calculator.");
  const input = pipScenarioInputs(values, rates);
  const result = calculatePip(input);
  const money = (value: Parameters<typeof cash>[0]) => exposureMoney(value, input.account);
  return {
    title: "Value of one pip at your volume", value: money(result.pipValue), summary: `${quantity(result.units)} ${input.instrument.base} · ${quantity(result.lots)} configured lots`,
    conversion: result.conversion,
    metrics: [["Configured pip size", `${quantity(result.pipSize, 10)} ${input.instrument.quote}`], ["Pip value in quote currency", cash(result.quoteValue, input.instrument.quote, 8)], ["Pip value per configured lot", money(result.perLot)], [`Value of ${quantity(result.pips)} ${result.pips.eq(1) ? "pip" : "pips"}`, money(result.moveValue)], ...(result.movement !== null ? [["Signed start-to-end movement", `${result.movement.gt(0) ? "+" : ""}${quantity(result.movement)} pips`]] : [])],
    tables: [{ title: "Conventional lot comparison", headers: ["Convention", "Base units", "Pip value"], rows: result.lotsTable.map(row => [row.name, quantity(row.units), money(row.pipValue)]) }, { title: "Price-movement value at your volume", headers: ["Pips", "Movement value"], rows: result.scenarios.map(row => [quantity(row.pips), money(row.value)]) }],
    steps: [`${quantity(result.units)} units × ${quantity(result.pipSize, 10)} pip size = ${cash(result.quoteValue, input.instrument.quote, 8)} per pip.`, result.conversion.identity ? `${input.instrument.quote} is your account currency, so the conversion factor is exactly 1.` : `1 ${input.instrument.quote} = ${quantity(result.conversion.factor, 12)} ${input.account}. ${result.conversion.steps.join(" → ")}`, ...(result.movement !== null ? [`(${values.end} − ${values.start}) ÷ ${quantity(result.pipSize, 10)} = ${quantity(result.movement)} signed pips.`] : [])],
    warnings: ["Pip value describes movement exposure, not net trading profit. Direction, fills, commissions, financing and other costs are separate.", ...(values.bidAsk === "yes" && !result.conversion.identity ? ["Pip values use the midpoint of each entered bid/ask conversion quote. Actual profit and loss conversion can differ."] : [])],
  };
}
