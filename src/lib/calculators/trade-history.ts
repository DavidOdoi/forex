import { Temporal } from "@js-temporal/polyfill";
import { CalculationError } from "./forex";
import { decimal } from "./precision";
import { parseCsvRows } from "./history-csv";
import type { ExpectancyTrade } from "./expectancy";
export type TradeCsvOptions = { pnl: string; cost: string; risk: string; date: string; currency: string; account: string; basis: string; feeMode: string };
export function parseTradeHistory(text: string, o: TradeCsvOptions, now = Date.now()) {
  const input = parseCsvRows(text); if (!input.length) throw new CalculationError("Enter a nonempty trade history.");
  const header = input[0].map(value => value.toLowerCase()), column = (name: string) => name.trim() ? header.indexOf(name.trim().toLowerCase()) : -1;
  const pnlIndex = column(o.pnl), named = pnlIndex >= 0;
  if (!named && /[a-df-z]/i.test(input[0][0]) && !/^\d{4}-\d\d-\d\d/.test(input[0][0])) throw new CalculationError("Set the exact P&L column name before importing a named CSV.");
  const data = named ? input.slice(1) : input;
  if (!data.length || data.length > 1000) throw new CalculationError("Use 1–1,000 completed trades.");
  const costIndex = named ? column(o.cost) : -1, riskIndex = named ? column(o.risk) : -1, dateColumn = named ? column(o.date) : -1, currencyIndex = named ? column(o.currency) : -1;
  const dateIndex=dateColumn>=0&&data.some(row=>row[dateColumn]?.trim())?dateColumn:-1;
  if (o.basis === "gross" && o.feeMode === "column" && costIndex < 0) throw new CalculationError("Choose an existing additional-cost column, or select one flat cost per trade.");
  let dateType = "", previous = -Infinity;
  const trades: ExpectancyTrade[] = data.map(row => {
    if (!named && row.length !== 1) throw new CalculationError("Unnamed history must contain one signed P&L value per line. Use named columns for dates, costs or risk.");
    if (currencyIndex >= 0 && (row[currencyIndex] ?? "").trim().toUpperCase() !== o.account) throw new CalculationError("Every currency-labelled row must match the selected account currency. Convert mixed-currency journals first.");
    const outcome = decimal(row[named ? pnlIndex : 0] ?? "", "trade P&L", "-1000000000000").toString();
    const cost = o.basis === "gross" && costIndex >= 0 && o.feeMode === "column" ? decimal(row[costIndex] ?? "", "trade cost").toString() : undefined;
    const risk = riskIndex >= 0 && row[riskIndex]?.trim() ? decimal(row[riskIndex], "individual initial risk", "0", undefined, true).toString() : undefined;
    const date = dateIndex >= 0 ? row[dateIndex]?.trim() : undefined;
    if (dateIndex >= 0) {
      const kind = /^\d{4}-\d\d-\d\d$/.test(date ?? "") ? "day" : "instant"; let timestamp: number;
      try { timestamp = kind === "day" ? Temporal.PlainDate.from(date!, { overflow: "reject" }).toZonedDateTime("UTC").epochMilliseconds : Temporal.Instant.from(date!).epochMilliseconds; } catch { throw new CalculationError("Trade dates need ISO calendar dates or ISO timestamps with Z/offset; do not use ambiguous local timestamps."); }
      if (dateType && dateType !== kind || timestamp < previous) throw new CalculationError("Use one date convention and nondecreasing trade order. Same-day trades retain CSV order; rows are not sorted.");
      if (timestamp > now) throw new CalculationError("Completed-trade history cannot contain future observations.");
      dateType = kind; previous = timestamp;
    }
    return { outcome, ...(cost === undefined ? {} : { cost }), ...(risk === undefined ? {} : { risk }), ...(date === undefined ? {} : { date }) };
  });
  return trades;
}
export function normalizedTradeHistory(text: string, options: TradeCsvOptions) {
  const trades = parseTradeHistory(text, options);
  const output = ["pnl,fees,risk,date,currency", ...trades.map(row => [row.outcome, row.cost ?? "", row.risk ?? "", row.date ?? "", options.account].join(","))].join("\n");
  if (output.length > 65536) throw new CalculationError("The mapped history exceeds 64 KiB. Use fewer trades or shorter numeric fields.");
  return output;
}
