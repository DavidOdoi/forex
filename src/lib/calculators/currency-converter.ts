import { CalculationError } from "./forex";
import { checkedAccount } from "./trade-core";
import { decimal, D, type Numeric } from "./precision";
import { resolveConversion, referenceRequestDate, type ExchangeRate } from "./exchange-rates";
import type { AccountCurrency } from "./instruments";
export type CurrencyInputs = {
  from: AccountCurrency; to: AccountCurrency; amount: Numeric; rates: ExchangeRate[];
  mode: "manual" | "daily" | "historical"; historyDate?: string;
  providerMode: "reference" | "rate" | "reduction"; providerRate?: Numeric; reduction: Numeric;
  feeBasis: "source" | "target"; feePercent: Numeric; fixedFee: Numeric; reportedReceived?: Numeric;
};
export function calculateCurrency(input: CurrencyInputs, now = Date.now()) {
  checkedAccount(input.from); checkedAccount(input.to);
  if (!["manual", "daily", "historical"].includes(input.mode) || !["reference", "rate", "reduction"].includes(input.providerMode) || !["source", "target"].includes(input.feeBasis)) throw new CalculationError("Choose valid source, provider and fee conventions.");
  const date = input.mode === "historical" ? referenceRequestDate(input.historyDate ?? "", now) : null;
  const conversion = resolveConversion(input.from, input.to, input.rates, date ? Date.parse(date + "T23:59:59Z") : now, "asset");
  if (input.mode !== "manual" && conversion.rates.some(rate => rate.source !== "frankfurter")) throw new CalculationError("Reference mode needs dated provider data. Use manual mode for your own documented quote.");
  if (date && conversion.rates.some(rate => !rate.asOf || rate.asOf.slice(0, 10) > date)) throw new CalculationError("A historical conversion cannot use observations after the requested date.");
  const amount = decimal(input.amount, "source amount", "0", "1000000000000");
  const reduction = decimal(input.reduction, "reduction in target units received (%)", "0", "99.999999");
  const providerFactor = input.providerMode === "rate" ? decimal(input.providerRate ?? "", "provider target units per source unit", "0.000000000001", "1000000000") : input.providerMode === "reduction" ? conversion.factor.mul(new D(1).sub(reduction.div(100))) : conversion.factor;
  const feePercent = decimal(input.feePercent, "percentage fee", "0", "100"), fixedFee = decimal(input.fixedFee, "fixed fee", "0", "1000000000000");
  const referenceGross = amount.mul(conversion.factor), providerGross = amount.mul(providerFactor);
  const feeBase = input.feeBasis === "source" ? amount : providerGross;
  const fee = feeBase.mul(feePercent).div(100).add(fixedFee);
  if (fee.gt(feeBase)) throw new CalculationError("Entered fees exceed the available amount in their selected currency.");
  const net = input.feeBasis === "source" ? amount.sub(fee).mul(providerFactor) : providerGross.sub(fee);
  const reportedReceived = input.reportedReceived === undefined ? null : decimal(input.reportedReceived, "reported credited target amount", "0", "1000000000000000");
  return { amount, conversion, date, providerFactor, inverse: new D(1).div(conversion.factor), referenceGross, providerGross, fee, net, difference: referenceGross.sub(net), effectiveRate: amount.isZero() ? null : net.div(amount), reportedRate: reportedReceived !== null && !amount.isZero() ? reportedReceived.div(amount) : null, reportedReceived };
}
