/** Best profitable day / total net profit only. No firm-specific policy mapping. */
export type ConsistencyResult = {
  percentage: number;
  limit: number;
  withinLimit: boolean;
  minimumTotal: number;
  additionalProfit: number;
};
const scale = BigInt(10000);
const maximumCents = BigInt(100000000000); // $1bn, well within exact display precision.
function decimalUnits(value: string, label: string, maximum: bigint): bigint {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) throw new Error(`${label}: enter a positive number with up to two decimal places.`);
  const [whole, fraction = ""] = normalized.split(".");
  const units = BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  if (units <= BigInt(0)) throw new Error(`${label}: enter a number greater than zero.`);
  if (units > maximum) throw new Error(`${label}: this value exceeds the supported range.`);
  return units;
}
export function calculateConsistency(total: string, bestDay: string, limit: string): ConsistencyResult {
  const totalCents = decimalUnits(total, "Total net profit", maximumCents);
  const bestCents = decimalUnits(bestDay, "Highest profitable day", maximumCents);
  const limitBasisPoints = decimalUnits(limit, "Consistency limit", scale);
  // Round the required target UP to a cent. Test the boundary before any display rounding.
  const requiredCents = (bestCents * scale + limitBasisPoints - BigInt(1)) / limitBasisPoints;
  const difference = requiredCents > totalCents ? requiredCents - totalCents : BigInt(0);
  return {
    percentage: Number(bestCents) / Number(totalCents) * 100,
    limit: Number(limitBasisPoints) / 100,
    withinLimit: bestCents * scale <= totalCents * limitBasisPoints,
    minimumTotal: Number(requiredCents) / 100,
    additionalProfit: Number(difference) / 100,
  };
}
export const consistencyMoney = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
