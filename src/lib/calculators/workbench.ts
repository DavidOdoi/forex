import { calculatePip } from "./pip";
import { pipScenarioInputs, defaultPipScenario, type TradeScenario } from "./trade-scenario";
import { cash, quantity } from "./precision";
import type { ExchangeRate } from "./exchange-rates";

export type WorkbenchKind = "pip";
export const workbenchDefaults = { pip: defaultPipScenario };
export const workbenchPaths = { pip: "/calculators/forex-pip-calculator" };

export function workbenchResult(kind: WorkbenchKind, values: TradeScenario, rates: ExchangeRate[] = []) {
  if (kind !== "pip") throw new Error("Choose a supported calculator.");
  const input = pipScenarioInputs(values, rates);
  const result = calculatePip(input);
  const money = (value: Parameters<typeof cash>[0]) => cash(value, input.account, 8);
  const label = (value: typeof result.pipValue) => value.isZero() ? money(value) : value.toDecimalPlaces(8).isZero() ? `${input.account} ${value.toExponential(4)}` : money(value);
  return {
    title: "Value of one pip at your volume", value: label(result.pipValue), summary: `${quantity(result.units)} ${input.instrument.base} · ${quantity(result.lots)} configured lots`,
    conversion: result.conversion,
    metrics: [["Configured pip size", `${quantity(result.pipSize, 10)} ${input.instrument.quote}`], ["Pip value in quote currency", cash(result.quoteValue, input.instrument.quote, 8)], ["Pip value per configured lot", money(result.perLot)], [`Value of ${quantity(result.pips)} ${result.pips.eq(1) ? "pip" : "pips"}`, money(result.moveValue)], ...(result.movement !== null ? [["Signed start-to-end movement", `${result.movement.gt(0) ? "+" : ""}${quantity(result.movement)} pips`]] : [])],
    tables: [{ title: "Conventional lot comparison", headers: ["Convention", "Base units", "Pip value"], rows: result.lotsTable.map(row => [row.name, quantity(row.units), money(row.pipValue)]) }, { title: "Price-movement value at your volume", headers: ["Pips", "Movement value"], rows: result.scenarios.map(row => [quantity(row.pips), money(row.value)]) }],
    steps: [`${quantity(result.units)} units × ${quantity(result.pipSize, 10)} pip size = ${cash(result.quoteValue, input.instrument.quote, 8)} per pip.`, result.conversion.identity ? `${input.instrument.quote} is your account currency, so the conversion factor is exactly 1.` : `1 ${input.instrument.quote} = ${quantity(result.conversion.factor, 12)} ${input.account}. ${result.conversion.steps.join(" → ")}`, ...(result.movement !== null ? [`(${values.end} − ${values.start}) ÷ ${quantity(result.pipSize, 10)} = ${quantity(result.movement)} signed pips.`] : [])],
    warnings: ["Pip value describes movement exposure, not net trading profit. Direction, fills, commissions, financing and other costs are separate.", ...(values.bidAsk === "yes" && !result.conversion.identity ? ["Pip values use the midpoint of each entered bid/ask conversion quote. Actual profit and loss conversion can differ."] : [])],
  };
}
