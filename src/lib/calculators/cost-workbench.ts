import { calculateSpread } from "./spread";
import { accountCurrencies, conventionalInstrument, isPair, type AccountCurrency } from "./instruments";
import { pairCodes, CalculationError } from "./forex";
import { cash, quantity } from "./precision";
import { defaultPipScenario, scenarioInstrument, scenarioRates, type TradeScenario } from "./trade-scenario";
import type { ExchangeRate, resolveConversion } from "./exchange-rates";

export type CostKind = "spread";
export type CostField = { name: string; label: string; help?: string; advanced?: boolean; type?: "text" | "datetime-local" | "textarea"; options?: { value: string; label: string }[] };
export type CostResult = { title: string; value: string; summary: string; metrics: string[][]; tables: { title: string; headers: string[]; rows: string[][] }[]; steps: string[]; warnings: string[]; conversions: ReturnType<typeof resolveConversion>[] };
export const costDefinitions = {
  spread: { path: "/calculators/forex-spread-cost-calculator", title: "Spread and transaction-cost workspace", note: "Enter a bid and ask from the same instrument and observation time. Starting quotes are hypothetical examples, not a live broker feed. A separate closing spread models half the opening plus half the closing spread around reference midpoints.", defaults: { ...defaultPipScenario, quoteBid: "1.10000", quoteAsk: "1.10012", quoteTime: "", commission: "0", closingSpread: "", treatment: "standalone" } },
};
const options = (values: readonly string[]) => values.map(value => ({ value, label: value }));
const choice = (name: string, label: string, rows: string[][], help?: string, advanced = false): CostField => ({ name, label, options: rows.map(([value, label]) => ({ value, label })), help, advanced });
const number = (name: string, label: string, help?: string, advanced = false): CostField => ({ name, label, help, advanced });
export function costConversionFrom(_kind: CostKind, values: TradeScenario): AccountCurrency { return isPair(values.pair) ? conventionalInstrument(values.pair).quote : "USD"; }
export function costFields(kind: CostKind, values: TradeScenario): CostField[] {
  const fields: CostField[] = [
    { name: "pair", label: "Currency pair", options: options(pairCodes) }, { name: "account", label: "Account currency", options: options(accountCurrencies) },
    choice("volumeMode", "Trade size unit", [["lots", "Configured lots"], ["units", "Base-currency units"]]), number("volume", "Trade size", "One conventional standard lot is 100,000 base-currency units; change contract size below if needed."),
    number("quoteBid", "Market bid"), number("quoteAsk", "Market ask"),
    number("commission", "Round-turn commission · account currency", "The total entered fee for this volume, not a per-side or per-lot rate."),
    choice("treatment", "Spread accounting", [["standalone", "Standalone spread-plus-fee estimate"], ["embedded", "Spread already included in executable fills"]]),
    number("closingSpread", "Hypothetical closing spread · pips (optional)", "Blank uses the quoted spread at both ends. Otherwise midpoint allocation uses half of each spread.", true),
    { name: "quoteTime", label: "Manual quote observation time · UTC (optional)", type: "datetime-local", advanced: true },
    number("contract", "Base units per configured lot", "Match the actual symbol specification; these are editable forex conventions.", true),
    number("pipSize", "Pip size", "Normally 0.0001; conventionally 0.01 for JPY-quoted pairs.", true), number("precision", "Permitted price decimal places", undefined, true),
  ];
  const from = costConversionFrom(kind, values);
  if (from !== values.account) {
    fields.push(choice("rateSource", "Conversion rate source", [["manual", "Manual conversion quote"], ["daily", "Dated daily reference · not live"]], "This source converts costs; it does not supply the market bid or ask."));
    if (values.rateSource === "manual") {
      fields.push(choice("rateDirection", "Conversion quotation", [["direct", `${from}/${values.account}`], ["inverse", `${values.account}/${from}`], ["cross", "Two-leg cross conversion"]]));
      if (values.rateDirection === "cross") fields.push({ name: "crossCurrency", label: "Intermediate currency", options: options(accountCurrencies.filter(code => code !== from && code !== values.account)) });
      fields.push(choice("bidAsk", "Conversion price convention", [["no", "One entered rate"], ["yes", "Separate bid and ask"]]));
      const base = values.rateDirection === "inverse" ? values.account : from;
      const quote = values.rateDirection === "direct" ? values.account : values.rateDirection === "inverse" ? from : values.crossCurrency;
      for (const [prefix, a, b] of [["", base, quote], ...(values.rateDirection === "cross" ? [["cross", values.crossCurrency, values.account]] : [])]) {
        const rate = prefix ? "crossRate" : "rate", bid = prefix ? "crossBid" : "bid", ask = prefix ? "crossAsk" : "ask";
        fields.push(...(values.bidAsk === "yes" ? [number(bid, `${a}/${b} conversion bid`), number(ask, `${a}/${b} conversion ask`)] : [number(rate, `${a}/${b} conversion rate`, `Units of ${b} per 1 ${a}.`)]));
      }
    }
  }
  return fields;
}
export function changeCostField(_kind: CostKind, values: TradeScenario, name: string, value: string): TradeScenario {
  const next = { ...values, [name]: value };
  if (name === "pair" && isPair(value)) { const spec = conventionalInstrument(value); Object.assign(next, { contract: spec.contractSize, pipSize: spec.pipSize, precision: String(spec.pricePrecision), quoteBid: "", quoteAsk: "", quoteTime: "" }); }
  if (["pair", "account", "rateDirection", "crossCurrency", "bidAsk"].includes(name)) Object.assign(next, { rate: "", bid: "", ask: "", crossRate: "", crossBid: "", crossAsk: "" });
  const from = costConversionFrom(_kind, next);
  if (next.crossCurrency === from || next.crossCurrency === next.account) next.crossCurrency = accountCurrencies.find(code => code !== from && code !== next.account)!;
  return next;
}
export function costResult(kind: CostKind, values: TradeScenario, reference: ExchangeRate[] = []): CostResult {
  if (kind !== "spread") throw new CalculationError("Choose a supported cost tool.");
  if (values.quoteTime && (!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(values.quoteTime) || !Number.isFinite(Date.parse(values.quoteTime + "Z")) || new Date(values.quoteTime + "Z").toISOString().slice(0, 16) !== values.quoteTime)) throw new CalculationError("Enter a valid quote observation time in UTC.");
  const instrument = scenarioInstrument(values);
  const r = calculateSpread({ instrument, account: values.account as AccountCurrency, volume: values.volume, volumeMode: values.volumeMode as "lots" | "units", bid: values.quoteBid, ask: values.quoteAsk, commission: values.commission, treatment: values.treatment as "standalone" | "embedded", ...(values.closingSpread.trim() ? { closingSpread: values.closingSpread } : {}), rates: scenarioRates(values, instrument.quote, reference) });
  return { title: values.treatment === "embedded" ? "Additional fee beyond executable-price P&L" : "Estimated spread plus entered commission", value: cash(r.combined, values.account), summary: `${quantity(r.pips)}-pip quote · ${quantity(r.units)} ${instrument.base} units · ${values.quoteTime ? `user-entered observation: ${values.quoteTime.replace("T", " ")} UTC` : "manual illustrative quotes; no observation time supplied"}`,
    metrics: [["Bid/ask difference", quantity(r.difference, instrument.pricePrecision)], ["Quoted spread", `${quantity(r.pips)} pips`], ["Quoted spread cost", cash(r.quoteCost, instrument.quote)], ["Account-currency spread equivalent", cash(r.spreadCost, values.account)], ["Pip value · liability conversion", cash(r.pipAccount, values.account, 6)], ["Spread / ask price", `${quantity(r.percentage, 8)}%`], ["Modeled round-trip midpoint spread", cash(r.modeledSpread, values.account)], ["Additional spread to deduct", cash(r.additionalSpread, values.account)], ["Entered total round-turn commission", cash(r.commission, values.account)]],
    tables: [{ title: "Hypothetical spread sensitivity · unchanged volume and commission", headers: ["Quote multiple", "Spread", "Spread equivalent", "Additional combined cost"], rows: r.scenarios.map(row => [`${quantity(row.multiplier)}×`, `${quantity(row.pips)} pips`, cash(row.cost, values.account), cash(row.combined, values.account)]) }],
    steps: [`Spread = (${r.ask} − ${r.bid}) ÷ ${r.pipSize} = ${quantity(r.pips)} pips.`, `Quote-currency spread cost = ${r.difference} × ${quantity(r.units)} = ${cash(r.quoteCost, instrument.quote)}.`, ...r.conversion.steps, `Midpoint round-trip allocation = (opening ${quantity(r.pips)} + closing ${quantity(r.closePips)}) ÷ 2 = ${quantity(r.modeledPips)} pips.`, values.treatment === "embedded" ? "Spread is already in supplied executable fills: additional spread deduction is zero. The headline adds only the separately entered commission." : "Standalone headline adds the modeled spread and the entered total round-turn commission. It is a cost estimate, not trade P&L."],
    warnings: ["Market bid and ask are manual inputs, not a live or historical broker feed. Conversion references do not verify these prices.", "A quoted unchanged-market round trip costs one full spread; different opening/closing spreads use the explicitly stated midpoint model. Actual fills, slippage, financing and other fees can differ.", ...(values.treatment === "embedded" ? ["Spread equivalents remain informational. Do not deduct them again from a profit/loss result that already uses executable entry and exit prices."] : []), ...(r.conversion.stale ? ["The daily conversion reference is more than four days old. Verify a current rate before using this estimate."] : [])], conversions: [r.conversion] };
}
