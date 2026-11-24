import { CalculationError } from "./forex";
import { conventionalInstrument, isPair, isAccountCurrency, type AccountCurrency } from "./instruments";
import type { ExchangeRate } from "./exchange-rates";
import type { PipInputs } from "./pip";
import type { MarginInputs } from "./margin";

export const defaultPipScenario = {
  pair: "EUR/USD", account: "USD", volumeMode: "lots", volume: "1", pips: "1", movementEnabled: "no", start: "1.10000", end: "1.10500",
  contract: "100000", pipSize: "0.0001", precision: "5",
  rateSource: "manual", rateDirection: "inverse", rate: "", bidAsk: "no", bid: "", ask: "", crossCurrency: "USD", crossRate: "", crossBid: "", crossAsk: "",
};
export type TradeScenario = Record<string, string>;
export const defaultMarginScenario = {
  ...defaultPipScenario, price: "1.1000", marginMode: "leverage", leverage: "50", marginPercent: "2",
  snapshotEnabled: "yes", equity: "10000", usedMargin: "0",
};

export function restoreTradeScenario(search: string, defaults: TradeScenario) {
  const params = new URLSearchParams(search);
  const values = { ...defaults };
  if (params.has("v") && params.get("v") !== "1") return { values, error: "This shared scenario version is unsupported. Reset to a fresh example." };
  for (const key of Object.keys(defaults)) if (params.has(key)) values[key] = params.get(key)!.slice(0, 65);
  return { values, error: null };
}

export function serializeTradeScenario(values: TradeScenario) {
  return new URLSearchParams({ v: "1", ...values }).toString();
}

export function transferTradeQuery(values: TradeScenario, target: "lot" | "pip" | "margin") {
  const keys = ["pair", "account", "contract", "pipSize", "precision", "rateSource", "rateDirection", "rate", "bidAsk", "bid", "ask", "crossCurrency", "crossRate", "crossBid", "crossAsk"];
  const params = new URLSearchParams({ v: "1" });
  for (const key of keys) if (values[key] !== undefined) params.set(key, values[key]);
  if (target !== "lot") { params.set("volumeMode", values.volumeMode); params.set("volume", values.volume); }
  if (target === "lot" && values.snapshotEnabled === "yes") params.set("equity", values.equity);
  // A pip-value scenario has no notional price. Require one instead of
  // transferring a hidden illustrative start price as though it were entered.
  if (target === "margin") params.set("price", values.price ?? "");
  return params.toString();
}

export function scenarioInstrument(values: TradeScenario) {
  if (!isPair(values.pair) || !isAccountCurrency(values.account)) throw new CalculationError("Choose a supported forex pair and account currency.");
  const spec = conventionalInstrument(values.pair);
  return { ...spec, contractSize: values.contract, pipSize: values.pipSize, pricePrecision: /^\d{1,2}$/.test(values.precision) ? Number(values.precision) : NaN,
    sourceId: values.contract === spec.contractSize && values.pipSize === spec.pipSize ? spec.sourceId : "user-entered-fx-specification" };
}

export function scenarioRates(values: TradeScenario, from: AccountCurrency, reference: ExchangeRate[] = []): ExchangeRate[] {
  if (!isAccountCurrency(values.account)) throw new CalculationError("Choose a supported account currency.");
  if (!["manual", "daily"].includes(values.rateSource) || !["direct", "inverse", "cross"].includes(values.rateDirection) || !["yes", "no"].includes(values.bidAsk)) throw new CalculationError("Choose valid conversion settings.");
  if (from === values.account) return [];
  if (values.rateSource === "daily") return reference;
  const leg = (base: AccountCurrency, quote: AccountCurrency, second = false): ExchangeRate => ({ base, quote, source: "manual", asOf: null,
    ...(values.bidAsk === "yes" ? { bid: values[second ? "crossBid" : "bid"], ask: values[second ? "crossAsk" : "ask"] } : { rate: values[second ? "crossRate" : "rate"] }) });
  if (values.rateDirection === "direct") return [leg(from, values.account)];
  if (values.rateDirection === "inverse") return [leg(values.account, from)];
  if (!isAccountCurrency(values.crossCurrency) || values.crossCurrency === from || values.crossCurrency === values.account) throw new CalculationError("Choose a distinct intermediate currency for the cross conversion.");
  return [leg(from, values.crossCurrency), leg(values.crossCurrency, values.account, true)];
}

export function pipScenarioInputs(values: TradeScenario, reference: ExchangeRate[] = []): PipInputs {
  const instrument = scenarioInstrument(values);
  if (!["lots", "units"].includes(values.volumeMode) || !["yes", "no"].includes(values.movementEnabled)) throw new CalculationError("Choose valid volume and price-movement settings.");
  return { instrument, account: values.account as AccountCurrency, volume: values.volume, volumeMode: values.volumeMode as "lots" | "units", pips: values.pips,
    ...(values.movementEnabled === "yes" ? { movement: { start: values.start, end: values.end } } : {}), rates: scenarioRates(values, instrument.quote, reference) };
}

export function marginScenarioInputs(values: TradeScenario, reference: ExchangeRate[] = []): MarginInputs {
  const instrument = scenarioInstrument(values);
  if (!["lots", "units"].includes(values.volumeMode) || !["yes", "no"].includes(values.snapshotEnabled) || !["leverage", "percent"].includes(values.marginMode)) throw new CalculationError("Choose valid margin, volume and equity settings.");
  return { instrument, account: values.account as AccountCurrency, volume: values.volume, volumeMode: values.volumeMode as "lots" | "units", price: values.price,
    marginMode: values.marginMode as "leverage" | "percent", leverage: values.leverage, marginPercent: values.marginPercent,
    ...(values.snapshotEnabled === "yes" ? { snapshot: { equity: values.equity, used: values.usedMargin } } : {}),
    rates: scenarioRates(values, instrument.base === values.account ? instrument.base : instrument.quote, reference) };
}
