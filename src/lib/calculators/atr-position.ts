import { calculateLotSize, type LotSizeInputs } from "./lot-size";
import { D, decimal, type Numeric } from "./precision";
import { CalculationError } from "./forex";
export type AtrPositionInput = { lot: LotSizeInputs; atr: Numeric; unit: "pips" | "price"; multiple: Numeric; distanceStep?: Numeric };
export function calculateAtrPosition(i: AtrPositionInput) {
  if (!["pips", "price"].includes(i.unit)) throw new CalculationError("Choose ATR in pips or price units.");
  const atr = decimal(i.atr, "ATR", "0", "10000000", true), multiple = decimal(i.multiple, "ATR multiplier", "0", "1000", true);
  const pipSize = decimal(i.lot.instrument.pipSize, "pip size", "0", "1", true), atrPips = i.unit === "price" ? atr.div(pipSize) : atr;
  const step = i.distanceStep === undefined ? null : decimal(i.distanceStep, "stop-distance increment", "0", "1000000", true);
  if (step && step.mul(pipSize).decimalPlaces() > i.lot.instrument.pricePrecision) throw new CalculationError("The stop increment must fit the entered price precision.");
  const sizeAt = (factor: InstanceType<typeof D>) => {
    const theoreticalStop = atrPips.mul(factor), stopPips = step ? theoreticalStop.div(step).ceil().mul(step) : theoreticalStop;
    const size = calculateLotSize({ ...i.lot, stopMode: "pips", stopPips: stopPips.toString() });
    return { factor, theoreticalStop, stopPips, size };
  };
  return { atr, atrPips, multiple, step, ...sizeAt(multiple), comparisons: ["1", "1.5", "2", "3"].map(value => sizeAt(new D(value))) };
}
