import { CalculationError, range } from "./forex";

export const frequencies = [
  { value: "daily", label: "Daily", unit: "day", plural: "days" },
  { value: "weekly", label: "Weekly", unit: "week", plural: "weeks" },
  { value: "monthly", label: "Monthly", unit: "month", plural: "months" },
  { value: "yearly", label: "Yearly", unit: "year", plural: "years" },
] as const;
export type Frequency = typeof frequencies[number]["value"];
export type GrowthRow = { period: number; opening: number; deposit: number; growth: number; closing: number; contributions: number };

/** Rate is an effective return for ONE selected period; never annualised twice.
 * Contributions occur once per period, at the user's selected timing.
 * Floating-point arithmetic keeps unrounded values; only display is rounded.
 */
export function calculateCompounding(inputs: { capital: number; ratePercent: number; periods: number; deposit: number; timing: "start" | "end" }) {
  range(inputs.capital, "Starting capital", 0, 1e12);
  range(inputs.ratePercent, "Assumed return per period", -100, 100);
  range(inputs.periods, "Number of periods", 1, 600);
  if (!Number.isInteger(inputs.periods)) throw new CalculationError("Number of periods must be a whole number.");
  range(inputs.deposit, "Recurring deposit", 0, 1e12);
  if (inputs.timing !== "start" && inputs.timing !== "end") throw new CalculationError("Choose start or end of period for deposits.");
  let balance = inputs.capital;
  const rows: GrowthRow[] = [{ period: 0, opening: inputs.capital, deposit: 0, growth: 0, closing: inputs.capital, contributions: inputs.capital }];
  for (let period = 1; period <= inputs.periods; period++) {
    const opening = balance;
    const growth = (opening + (inputs.timing === "start" ? inputs.deposit : 0)) * inputs.ratePercent / 100;
    balance = opening + growth + inputs.deposit;
    if (!Number.isFinite(balance) || Math.abs(balance) > 1e15) throw new CalculationError("This scenario exceeds the display limit. Reduce the return, starting capital, deposits or number of periods.");
    rows.push({ period, opening, deposit: inputs.deposit, growth, closing: balance, contributions: inputs.capital + inputs.deposit * period });
  }
  const contributions = inputs.capital + inputs.deposit * inputs.periods;
  return { balance, contributions, growth: balance - contributions, rows };
}
