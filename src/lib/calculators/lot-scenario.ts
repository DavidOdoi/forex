import { CalculationError } from "./forex";
import { conventionalInstrument, isAccountCurrency, isPair, type AccountCurrency } from "./instruments";
import type { ExchangeRate } from "./exchange-rates";
import type { LotSizeInputs } from "./lot-size";

export const lotSizePath = "/calculators/forex-lot-size-calculator";
export const defaultLotScenario = {
  pair: "EUR/USD", account: "USD", equity: "10000", riskMode: "percent", risk: "1", cashRisk: "100", stopMode: "pips", stopPips: "50", entry: "1.10000", stopPrice: "1.09500", side: "buy",
  contract: "100000", pipSize: "0.0001", minimum: "0.01", maximum: "100", increment: "0.01", precision: "5",
  includeCosts: "yes", spreadMode: "included", spread: "0", commission: "0", fixedCosts: "0",
  rateSource: "manual", rateDirection: "inverse", rate: "", bidAsk: "no", bid: "", ask: "", crossCurrency: "USD", crossRate: "", crossBid: "", crossAsk: "",
  compareRisk: "0.5", marginEnabled: "no", leverage: "30", freeMargin: "10000", marginPrice: "",
};
export type LotField = keyof typeof defaultLotScenario;
export type LotScenario = Record<LotField, string>;

export function restoreLotScenario(search: string): { values: LotScenario; error: string | null } {
  const params = new URLSearchParams(search);
  const values = { ...defaultLotScenario };
  if (params.has("v") && params.get("v") !== "1") return { values, error: "This link uses an unsupported scenario version. Reset the inputs to start a new calculation." };
  for (const key of Object.keys(values) as LotField[]) if (params.has(key)) values[key] = params.get(key)!.slice(0, 65);
  return { values, error: null };
}

export function serializeLotScenario(values: LotScenario) {
  const params = new URLSearchParams({ v: "1" });
  for (const key of Object.keys(defaultLotScenario) as LotField[]) params.set(key, values[key]);
  return params.toString();
}

export function lotInputs(values: LotScenario, referenceRates: ExchangeRate[] = []): LotSizeInputs {
  if (!isPair(values.pair) || !isAccountCurrency(values.account)) throw new CalculationError("Choose a supported currency pair and account currency.");
  if (!["manual", "daily"].includes(values.rateSource) || !["direct", "inverse", "cross"].includes(values.rateDirection) || ![values.bidAsk, values.includeCosts, values.marginEnabled].every(value => ["yes", "no"].includes(value))) throw new CalculationError("The shared scenario contains an unsupported setting. Reset the inputs or select valid settings.");
  const instrument = { ...conventionalInstrument(values.pair), contractSize: values.contract, pipSize: values.pipSize, minimumLots: values.minimum, maximumLots: values.maximum, lotStep: values.increment, pricePrecision: /^\d{1,2}$/.test(values.precision) ? Number(values.precision) : NaN };
  const base = conventionalInstrument(values.pair);
  if ([values.contract !== base.contractSize, values.pipSize !== base.pipSize, values.minimum !== base.minimumLots, values.maximum !== base.maximumLots, values.increment !== base.lotStep, values.precision !== String(base.pricePrecision)].some(Boolean)) instrument.sourceId = "user-entered-fx-specification";
  let rates: ExchangeRate[] = [];
  const leg = (from: AccountCurrency, to: AccountCurrency, second = false): ExchangeRate => ({ base: from, quote: to, source: "manual", asOf: null,
    ...(values.bidAsk === "yes" ? { bid: values[second ? "crossBid" : "bid"], ask: values[second ? "crossAsk" : "ask"] } : { rate: values[second ? "crossRate" : "rate"] }) });
  if (instrument.quote !== values.account) {
    if (values.rateSource === "daily") rates = referenceRates;
    else if (values.rateDirection === "direct") rates = [leg(instrument.quote, values.account)];
    else if (values.rateDirection === "inverse") rates = [leg(values.account, instrument.quote)];
    else {
      if (!isAccountCurrency(values.crossCurrency) || values.crossCurrency === instrument.quote || values.crossCurrency === values.account) throw new CalculationError("Choose an intermediate currency different from the quote and account currencies.");
      rates = [leg(instrument.quote, values.crossCurrency), leg(values.crossCurrency, values.account, true)];
    }
  }
  return { instrument, account: values.account, equity: values.equity, riskMode: values.riskMode as LotSizeInputs["riskMode"], risk: values.riskMode === "cash" ? values.cashRisk : values.risk,
    stopMode: values.stopMode as LotSizeInputs["stopMode"], stopPips: values.stopPips, entry: values.entry, stopPrice: values.stopPrice, side: values.side as LotSizeInputs["side"],
    includeCosts: values.includeCosts === "yes", spreadMode: values.spreadMode as LotSizeInputs["spreadMode"], spreadPips: values.spread, commissionPerLot: values.commission, fixedCosts: values.fixedCosts, rates };
}
