import { CalculationError } from "./forex";
export function parseCsvRows(text: string): string[][] {
  if (text.length > 65536) throw new CalculationError("Use a CSV of no more than 64 KiB of text.");
  const rows: string[][] = []; let row: string[] = [], cell = "", quoted = false;
  const push = () => { row.push(cell.trim().replace(/^\uFEFF/, "")); cell = ""; };
  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    if (quoted) { if (character === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (character === '"') quoted = false; else cell += character; }
    else if (character === '"' && !cell.trim()) quoted = true;
    else if (character === ",") push();
    else if (character === "\n" || character === "\r") { if (character === "\r" && text[i + 1] === "\n") i++; push(); if (row.some(Boolean)) rows.push(row); row = []; }
    else cell += character;
  }
  if (quoted) throw new CalculationError("The CSV contains an unclosed quoted field.");
  push(); if (row.some(Boolean)) rows.push(row);
  if (rows.length > 1001) throw new CalculationError("Use no more than 1,000 observations plus a header.");
  return rows;
}
/** Read only approved columns; discard account identifiers and other CSV fields. */
export function normalizedDailyPnlCsv(text: string): string {
  const rows = parseCsvRows(text);
  if (!rows.length) throw new CalculationError("Enter a nonempty daily P&L CSV.");
  const header = rows[0].map(cell => cell.toLowerCase().replace(/[ _-]/g, ""));
  const date = header.indexOf("date"), profits = header.map((name, i) => ["netpnl", "netprofit", "profit", "pnl"].includes(name) ? i : -1).filter(i => i >= 0);
  const named = date >= 0 || profits.length > 0;
  if (named && (date < 0 || profits.length !== 1)) throw new CalculationError("A named daily P&L CSV needs one date and one netPnl column.");
  const data = named ? rows.slice(1) : rows;
  if (data.length > 1000) throw new CalculationError("Use no more than 1,000 daily observations.");
  let previous = "";
  const out = data.map(row => {
    if (!named && row.length !== 2) throw new CalculationError("Use daily date,netPnl rows without thousands separators.");
    const d = row[named ? date : 0] ?? "", value = row[named ? profits[0] : 1] ?? "";
    if (!/^\d{4}-\d\d-\d\d$/.test(d) || !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(value)) throw new CalculationError("Daily rows need ISO calendar dates and numeric net P&L.");
    if (!Number.isFinite(Date.parse(d)) || new Date(d).toISOString().slice(0, 10) !== d) throw new CalculationError("Daily rows need valid calendar dates.");
    if (d <= previous) throw new CalculationError("Daily dates must be unique and strictly increasing.");
    previous = d;
    return `${d},${value}`;
  });
  if (!out.length) throw new CalculationError("The daily CSV has no observations.");
  return ["date,netPnl", ...out].join("\n");
}
export function parseEquityCsv(text: string) {
  const rows = parseCsvRows(text); if (!rows.length) throw new CalculationError("Enter an account-value history.");
  const header = rows[0].map(cell => cell.toLowerCase().replace(/[ _-]/g, ""));
  const named = header.some(name => ["date", "value", "equity", "balance", "flow", "netflow", "cashflow"].includes(name));
  const valueColumns = header.map((name, i) => ["value", "equity", "balance"].includes(name) ? i : -1).filter(i => i >= 0);
  if (named && valueColumns.length !== 1) throw new CalculationError("A named history needs exactly one value, equity or balance column.");
  const valueIndex = named ? valueColumns[0] : -1, dateIndex = header.indexOf("date"), flowIndex = header.findIndex(name => ["flow", "netflow", "cashflow"].includes(name));
  const data = named ? rows.slice(1) : rows;
  if (data.length > 1000) throw new CalculationError("Use no more than 1,000 observations.");
  const observations = data.map(row => {
    if (!named && (row.length < 1 || row.length > 3)) throw new CalculationError("Use value-only rows or date,value,flow rows, without thousands separators.");
    const value = named ? row[valueIndex] ?? "" : row.length === 1 ? row[0] : row[1];
    const date = named ? dateIndex >= 0 ? row[dateIndex] ?? "" : undefined : row.length > 1 ? row[0] : undefined;
    const flow = named ? flowIndex >= 0 ? row[flowIndex] || undefined : undefined : row.length === 3 ? row[2] || undefined : undefined;
    return { value, ...(date === undefined ? {} : { date }), ...(flow === undefined ? {} : { flow }) };
  });
  return { observations, columnType: named && ["equity", "balance"].includes(header[valueIndex]) ? header[valueIndex] as "equity" | "balance" : null };
}
