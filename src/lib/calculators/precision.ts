import Decimal from "decimal.js";
import { CalculationError } from "./forex";

// Independent configuration: 40 significant digits, with no intermediate
// currency rounding. Executable volume is explicitly rounded down elsewhere.
export const D = Decimal.clone({ precision: 40, rounding: Decimal.ROUND_HALF_EVEN });
export type Numeric = string | number;

export function decimal(value: Numeric, label: string, min = "0", max = "1000000000000", positive = false): Decimal {
  const raw = String(value).trim();
  if (raw.length > 64 || !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(raw)) throw new CalculationError(`Enter a valid number for ${label}.`);
  const result = new D(raw);
  if (!result.isFinite() || (positive ? result.lte(min) : result.lt(min)) || result.gt(max)) throw new CalculationError(`${label} must be ${positive ? "greater than" : "at least"} ${min} and no more than ${max}.`);
  return result;
}

export function quantity(value: Decimal.Value, places = 8, minimumPlaces = 0) {
  let text = new D(value).toFixed(places);
  if (places > minimumPlaces) text = text.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  const [integer, fractional = ""] = text.split(".");
  const padded = fractional.padEnd(minimumPlaces, "0");
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (padded ? `.${padded}` : "");
}

export function cash(value: Decimal.Value, currency: string, precision?: number) {
  const places = new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return `${currency} ${quantity(value, precision ?? places, places)}`;
}
