import { CalculationError } from "./forex";
import { conventionalInstrument, isAccountCurrency, isPair, type AccountCurrency, type FxInstrument } from "./instruments";
import { decimal, D, type Numeric } from "./precision";

export function tradeVolume(instrument: FxInstrument, volume: Numeric, mode: "lots" | "units") {
  if (!isPair(instrument.symbol) || instrument.category !== "forex") throw new CalculationError("Choose a supported forex pair. These conventions do not cover metals, indices or crypto contracts.");
  const canonical = conventionalInstrument(instrument.symbol);
  if (instrument.base !== canonical.base || instrument.quote !== canonical.quote) throw new CalculationError("The pair and its base/quote currencies do not match.");
  if (mode !== "lots" && mode !== "units") throw new CalculationError("Choose lots or base-currency units.");
  const contract = decimal(instrument.contractSize, "base units per configured lot", "1", "1000000000");
  const pipSize = decimal(instrument.pipSize, "pip size", "0.0000000001", "1");
  if (!Number.isInteger(instrument.pricePrecision) || instrument.pricePrecision < pipSize.decimalPlaces() || instrument.pricePrecision > 10) throw new CalculationError("Price precision must accommodate the pip size and be at most 10 decimal places.");
  const amount = decimal(volume, mode === "lots" ? "lots" : "base-currency units", "0", mode === "lots" ? "1000000" : "1000000000000", true);
  const units = mode === "lots" ? amount.mul(contract) : amount;
  return { contract, pipSize, units, lots: units.div(contract) };
}

export function checkedAccount(value: string): AccountCurrency {
  if (!isAccountCurrency(value)) throw new CalculationError("Choose a supported account currency.");
  return value;
}

export function tradePrice(value: Numeric, label: string, instrument: FxInstrument) {
  const price = decimal(value, label, "0", "1000000000", true);
  if (price.decimalPlaces() > instrument.pricePrecision) throw new CalculationError(`${label} supports at most ${instrument.pricePrecision} decimal places under this specification.`);
  return price;
}

export const conventionalLotUnits = [{ name: "Standard", units: new D(100000) }, { name: "Mini", units: new D(10000) }, { name: "Micro", units: new D(1000) }];
