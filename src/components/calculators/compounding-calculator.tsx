"use client";

import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { calculateCompounding, frequencies, type Frequency, type GrowthRow } from "@/lib/calculators/compounding";
import { currencies, money, number as formatNumber, type Currency } from "@/lib/calculators/forex";
import { NumericField, SelectField, numeric } from "./trading-calculator";
import styles from "./calculator.module.css";

const defaults = { capital: "1000", rate: "2", periods: "12", deposit: "0", timing: "end" as "start" | "end", frequency: "monthly" as Frequency, account: "USD" as Currency };

function GrowthChart({ rows, account, duration }: { rows: GrowthRow[]; account: Currency; duration: string }) {
  const maximum = Math.max(1, ...rows.map(row => Math.max(row.closing, row.contributions)));
  const x = (index: number) => 74 + index / (rows.length - 1) * 612;
  const y = (value: number) => 220 - value / maximum * 190;
  const points = (key: "closing" | "contributions") => rows.map((row, i) => `${x(i)},${y(row[key])}`).join(" ");
  const compact = (value: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  return <figure className={styles.chart}>
    <figcaption>Hypothetical account path <span>{account}</span></figcaption>
    <svg viewBox="0 0 720 260" role="img" aria-label={`Hypothetical balance and total contributions over ${duration}. Exact values are available in the breakdown table.`}>
      <title>Compounding scenario, not a forecast</title>
      <desc>Solid line: hypothetical balance. Dashed line: contributed capital. The vertical scale starts at zero.</desc>
      {[0, maximum / 2, maximum].map(value => <g key={value}><line x1="74" y1={y(value)} x2="686" y2={y(value)} stroke="#e4e2dc" /><text x="64" y={y(value) + 5} textAnchor="end">{compact(value)}</text></g>)}
      <polyline points={points("contributions")} fill="none" stroke="#a07834" strokeWidth="2" strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />
      <polyline points={points("closing")} fill="none" stroke="#111" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <text x="74" y="248">Start</text><text x="686" y="248" textAnchor="end">{duration}</text>
    </svg>
    <div className={styles.chartLegend}><span><i />Hypothetical balance</span><span><i />Contributed capital</span></div>
  </figure>;
}

export function CompoundingCalculator() {
  const [values, setValues] = useState({ ...defaults });
  const [page, setPage] = useState(0);
  const set = <K extends keyof typeof defaults>(key: K, value: typeof defaults[K]) => { setValues(old => ({ ...old, [key]: value })); setPage(0); };
  const frequency = frequencies.find(item => item.value === values.frequency)!;
  let output: ReturnType<typeof calculateCompounding> | undefined, error: string | undefined;
  try { output = calculateCompounding({ capital: numeric(values.capital, "starting capital"), ratePercent: numeric(values.rate, "return per period"), periods: numeric(values.periods, "number of periods"), deposit: numeric(values.deposit || "0", "recurring deposit"), timing: values.timing }); }
  catch (failure) { error = failure instanceof Error ? failure.message : "Check the scenario inputs."; }
  const periods = Number(values.periods);
  const duration = `${formatNumber(periods)} ${periods === 1 ? frequency.unit : frequency.plural}`;
  const pageCount = output ? Math.ceil(output.rows.length / 20) : 0;
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const visibleRows = output?.rows.slice(currentPage * 20, currentPage * 20 + 20) ?? [];
  function download() {
    if (!output) return;
    const csv = [`Period,Opening (${values.account}),Deposit (${values.account}),Hypothetical gain or loss (${values.account}),Closing (${values.account}),Total contributions (${values.account})`, ...output.rows.map(row => [row.period, row.opening, row.deposit, row.growth, row.closing, row.contributions].join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "devin-forex-hypothetical-compounding.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={styles.workspace} data-calculator="compounding">
    <div className={styles.calculatorGrid}>
      <form className={styles.inputForm} aria-label="Compounding scenario inputs" onSubmit={event => event.preventDefault()}>
        <div className={styles.formHeading}><h3>Your scenario</h3><button className={styles.reset} type="button" onClick={() => { setValues({ ...defaults }); setPage(0); }}><RotateCcw size={14} aria-hidden="true" />Reset</button></div>
        <p className={styles.inputNote}>An illustration of fixed assumptions, not a trading forecast.</p>
        <div className={styles.fieldGrid}>
          <NumericField label="Starting capital" value={values.capital} onChange={value => set("capital", value)} min={0} />
          <SelectField label="Account currency" value={values.account} onChange={value => set("account", value as Currency)}>{currencies.map(code => <option key={code}>{code}</option>)}</SelectField>
          <SelectField label="Compounding frequency" value={values.frequency} onChange={value => set("frequency", value as Frequency)}>{frequencies.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</SelectField>
          <NumericField label="Assumed return per period (%)" value={values.rate} onChange={value => set("rate", value)} min={-100} max={100} hint={`Applied once per ${frequency.unit}. Negative returns model losses.`} />
          <NumericField label="Number of periods" value={values.periods} onChange={value => set("periods", value)} min={1} max={600} step="1" hint={`Whole periods, up to 600. Duration: ${duration}.`} />
          <NumericField label={`Deposit each ${frequency.unit}`} value={values.deposit} onChange={value => set("deposit", value)} min={0} />
          <SelectField label="Deposit timing" value={values.timing} onChange={value => set("timing", value as "start" | "end")}><option value="end">End of each period</option><option value="start">Start of each period</option></SelectField>
        </div>
        <p className={styles.fieldHelp}>The return is for one selected period, not an annual rate. Changing frequency changes the duration label; it does not convert the return or change the number of applications.</p>
        <a className={styles.viewResult} href="#calculation-result">View scenario result</a>
      </form>
      <aside id="calculation-result" className={styles.result} aria-label="Compounding result">
        <p className={styles.resultEyebrow}><span />Hypothetical scenario</p>
        <div role="status" aria-live="polite" aria-atomic="true">{error ? <div className={styles.validation}><h3>Check your scenario</h3><p>{error}</p></div> : output && <><h3>Hypothetical ending balance</h3><p className={styles.resultValue} data-result>{money(output.balance, values.account)}</p><p className={styles.resultSummary}>{duration} at {formatNumber(Number(values.rate))}% each period.</p></>}</div>
        {output && <><dl className={styles.metrics}><div><dt>Total contributions</dt><dd>{money(output.contributions, values.account)}</dd></div><div><dt>Hypothetical gain / loss</dt><dd>{money(output.growth, values.account)}</dd></div></dl><GrowthChart rows={output.rows} account={values.account} duration={duration} /><p className={styles.resultNote}>Real returns vary. Repeated losses can reduce capital sharply. This model excludes tax, inflation, trading costs and withdrawals.</p></>}
      </aside>
    </div>
    {output && <section className={styles.growthBreakdown} aria-labelledby="growth-breakdown"><div className={styles.tableHeading}><div><h3 id="growth-breakdown">Period-by-period breakdown</h3><p>Period 0 is your starting balance. Values are rounded for display.</p></div><button className={styles.download} type="button" onClick={download}><Download size={16} aria-hidden="true" />Download CSV</button></div>
      <div className={styles.tableScroll} role="region" aria-label="Compounding breakdown table" tabIndex={0}><table><caption>Amounts in {values.account}. Deposits at the {values.timing} of each {frequency.unit}.</caption><thead><tr><th scope="col">Period</th><th scope="col">Opening balance</th><th scope="col">Deposit</th><th scope="col">Gain / loss</th><th scope="col">Ending balance</th></tr></thead><tbody>{visibleRows.map(row => <tr key={row.period}><th scope="row">{row.period}</th><td>{money(row.opening, values.account)}</td><td>{money(row.deposit, values.account)}</td><td>{money(row.growth, values.account)}</td><td>{money(row.closing, values.account)}</td></tr>)}</tbody></table></div>
      <div className={styles.pagination}><span>Rows {currentPage * 20 + 1}–{Math.min(currentPage * 20 + 20, output.rows.length)} of {output.rows.length}</span><div><button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 0}>Previous</button><button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage >= pageCount - 1}>Next</button></div></div>
    </section>}
    <noscript><p className={styles.noScript}>Enable JavaScript to change the growth scenario, chart and table.</p></noscript>
  </div>;
}
