import { calculatePip } from "./pip";
import { pipScenarioInputs, marginScenarioInputs, profitScenarioInputs, riskScenarioInputs, defaultRiskScenario, defaultMarginScenario, defaultPipScenario, defaultProfitScenario, type TradeScenario } from "./trade-scenario";
import { cash, quantity, D } from "./precision";
import type { ExchangeRate, resolveConversion } from "./exchange-rates";
import { calculateMargin } from "./margin";
import { calculateProfit } from "./profit";
import { calculateRiskReward } from "./risk-reward";

export type WorkbenchKind = "pip" | "margin" | "profit" | "risk";
export const workbenchDefaults = { pip: defaultPipScenario, margin: defaultMarginScenario, profit: defaultProfitScenario, risk: defaultRiskScenario };
export const workbenchPaths = { pip: "/calculators/forex-pip-calculator", margin: "/calculators/forex-margin-calculator", profit: "/calculators/forex-profit-calculator", risk: "/calculators/forex-risk-reward-calculator" };
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
  if (kind === "risk") {
    const input = riskScenarioInputs(values, rates);
    const r = calculateRiskReward(input);
    const money = (value: Parameters<typeof cash>[0]) => cash(value, input.account);
    return { title: "Net risk : potential reward", value: r.netR === null ? "No positive net target" : `1 : ${quantity(r.netR, 4)}`, summary: `${quantity(r.riskPips)} risk pips · ${quantity(r.rewardPips)} reward pips · gross 1:${quantity(r.grossR, 4)}`, conversion: r.conversion,
      metrics: [["Planned net loss at stop", money(r.loss)], ["Potential net result at target", money(r.win)], ["Break-even win rate", r.breakEven === null ? "Not attainable with this target and costs" : `${quantity(r.breakEven, 4)}%`], ...(r.expectancy === null ? [] : [["Assumed win rate", `${quantity(r.probability!.mul(100), 4)}%`], ["Modeled expectancy per trade", money(r.expectancy)]])],
      tables: [{ title: "Individual targets · full volume each time", headers: ["Target price", "Gross R", "Net result", "Net R"], rows: r.targets.map(row => [quantity(row.price, input.instrument.pricePrecision), quantity(row.grossR, 4), money(row.net), row.netR === null ? "No positive reward" : quantity(row.netR, 4)]) }],
      steps: [`${quantity(r.riskPips)} risk pips and ${quantity(r.rewardPips)} reward pips give gross reward/risk ${quantity(r.grossR, 4)}.`, `Net target ${money(r.win)}; net loss magnitude ${money(r.loss)} after entered costs.`, r.breakEven === null ? "Costs consume the target gain: no feasible conventional break-even win rate is shown." : `${money(r.loss)} ÷ (${money(r.win)} + ${money(r.loss)}) × 100 = ${quantity(r.breakEven, 4)}%.`],
      warnings: ["Enter only extra round-trip costs in the account currency. The same total cost is applied to each winner and loser; executable prices already include spread.", "The stop is a planned exit, not a guaranteed maximum loss. Gaps and slippage can increase losses.", "Target comparisons apply the full volume to each independent target. They do not represent a partial-exit allocation.", "Win probability is your assumption, never inferred from the ratio. Expectancy assumes the entered fixed win/loss amounts and is not a forecast."],
    };
  }
  if (kind === "profit") {
    const input = profitScenarioInputs(values, rates);
    const r = calculateProfit(input);
    const money = (v: Parameters<typeof cash>[0]) => cash(v, input.account);
    return {
      title: r.net.gt(0) ? "Estimated net profit" : r.net.lt(0) ? "Estimated net loss" : "Estimated net P&L: flat",
      value: money(r.net), summary: `${input.direction === "buy" ? "Buy / long" : "Sell / short"} · ${quantity(r.units)} ${input.instrument.base} · ${quantity(r.pips)} directional pips`, conversion: r.conversion,
      metrics: [["Gross P&L", money(r.gross)], ["Net separately entered costs", money(r.costs)], ["Gross quote-currency P&L", cash(r.quote, input.instrument.quote)], ["Pip value: proceeds / liability", `${money(r.creditPip)} / ${money(r.debitPip)}`], ...(r.returnPercent === null ? [] : [["Return on reference equity", `${quantity(r.returnPercent, 4)}%`]])],
      tables: [{ title: "Cost breakdown", headers: ["Component", "Account amount"], rows: [["Commission charge", money(r.commission)], ["Extra spread charge", money(r.spread)], ["Extra slippage allowance", money(r.slippage)], ["Signed financing: + credit / − charge", money(r.swap)]] }, { title: "Exit-price scenarios · fixed conversion and costs", headers: ["Exit price", "Directional pips", "Net P&L"], rows: r.scenarios.map(row => [quantity(row.price, input.instrument.pricePrecision), quantity(row.pips), money(row.net)]) }, { title: "Direction and optional exit checks", headers: ["Scenario", "Exit price", "Net P&L"], rows: [["Opposite direction · same costs", quantity(r.exit, input.instrument.pricePrecision), money(r.otherSide.net)], ...(r.stop ? [["Stop-price scenario", quantity(r.stop.price, input.instrument.pricePrecision), money(r.stop.net)]] : []), ...(r.target ? [["Target-price scenario", quantity(r.target.price, input.instrument.pricePrecision), money(r.target.net)]] : [])] }],
      steps: [`${input.direction === "buy" ? `(${values.exit} − ${values.entry})` : `(${values.entry} − ${values.exit})`} × ${quantity(r.units)} = ${cash(r.quote, input.instrument.quote)} gross.`, r.conversion.identity ? "Quote and account currencies match: conversion factor 1." : `Gross conversion factor ${quantity(r.conversion.factor, 12)}: ${r.conversion.steps.join(" → ")}.`, `${money(r.gross)} gross − ${money(r.costs)} net costs = ${money(r.net)} net P&L.`, ...(r.returnPercent === null ? [] : [`${money(r.net)} ÷ ${money(r.equity!)} × 100 = ${quantity(r.returnPercent, 4)}% of reference equity.`])],
      warnings: [input.priceMode === "fills" ? "Executable entry and exit fills already reflect spread. The separate spread allowance is not deducted in this mode." : "Mid-price mode deducts one entered total spread allowance. It is a model, not an executable quote.", "Leave extra slippage at zero when actual fills already include it. Positive swap is a credit; negative swap is a charge.", "Scenario rows hold conversion rates and costs constant. Financing can differ by direction or holding period. Stop and target rows do not validate order placement or guarantee execution.", "For an exact historical check, enter the applicable closing conversion and statement charges. Daily reference rates are not historical broker fills or conversion quotes."],
    };
  }
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
