"use client";
import { importSharpeCsv } from "@/lib/calculators/sharpe-workbench";
import { importExpectancyCsv } from "@/lib/calculators/expectancy-workbench";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight, Copy, Link2, RotateCcw } from "lucide-react";
import { costDefinitions, costFields, costResult, changeCostField, reverseCurrencyScenario, type CostField, type CostKind, type CostResult } from "@/lib/calculators/cost-workbench";
import { parseEquityCsv, normalizedDailyPnlCsv } from "@/lib/calculators/history-csv";
import { quantity } from "@/lib/calculators/precision";
import { restoreTradeScenario, serializeTradeScenario, serializePrivateSettings } from "@/lib/calculators/trade-scenario";
import type { RateSnapshot } from "@/lib/calculators/exchange-rates";
import styles from "./calculator.module.css";
import shared from "./lot-size.module.css";
const subscribe = (callback: () => void) => { window.addEventListener("popstate", callback); return () => window.removeEventListener("popstate", callback); };
const search = () => window.location.search;
const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
export function CostWorkbench({ kind }: { kind: CostKind }) { const query = useSyncExternalStore(subscribe, search, () => ""); return <CostForm key={`${kind}-${query}`} kind={kind} query={query} />; }
function CostForm({ kind, query }: { kind: CostKind; query: string }) {
  // Prevent edits to server-rendered controlled inputs before React attaches handlers.
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const definition = costDefinitions[kind]; const restored = restoreTradeScenario(query, definition.defaults);
  if (restored.values.privateDataOmitted === "yes") for (const name of definition.privateFields ?? []) restored.values[name] = "";
  const [values, setValues] = useState(restored.values), [copyStatus, setCopyStatus] = useState(""), [fallback, setFallback] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileRevision, setFileRevision] = useState(0);
  const [reference, setReference] = useState<{ key?: string; data?: RateSnapshot; error?: string }>({}); const [refresh, setRefresh] = useState(0);
  const referenceKey = values.rateSource === "historical" ? `historical:${values.historyDate}` : values.rateSource;
  const activeReference = reference.key === referenceKey ? reference.data : undefined;
  useEffect(() => {
    if (!["daily", "historical"].includes(values.rateSource)) return;
    const controller = new AbortController();
    void fetch(values.rateSource === "historical" ? `/api/forex-rates?date=${encodeURIComponent(values.historyDate)}` : "/api/forex-rates", { signal: controller.signal }).then(async response => { const data = await response.json(); if (!response.ok || !Array.isArray(data.rates)) throw new Error(data.error ?? "Daily references are unavailable; enter a manual quote."); if (!controller.signal.aborted) setReference({ key: referenceKey, data }); }).catch(error => { if (!controller.signal.aborted) setReference(old => (old.key === referenceKey ? { ...old, error: String(error.message) } : { key: referenceKey, error: String(error.message) })); });
    return () => controller.abort();
  }, [values.rateSource, values.historyDate, referenceKey, refresh]);
  let result: ReturnType<typeof costResult> | null = null, error = restored.error ?? uploadError ?? (values.privateDataOmitted === "yes" ? "Settings restored without private financial data. Enter your own financial inputs to calculate a result." : null);
  try { if (!error) result = costResult(kind, values, activeReference?.rates ?? []); } catch (caught) { error = caught instanceof Error ? caught.message : "Check the entered inputs."; }
  const set = (name: string, value: string) => { setValues(old => ({ ...changeCostField(kind, old, name, value), ...(definition.privateFields?.includes(name) ? { privateDataOmitted: "no" } : {}) })); setCopyStatus(""); setFallback(""); if (["history", "analysisMode"].includes(name)) setUploadError(null); };
  const readCsv = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 65536) throw new Error("Use a file no larger than 64 KiB.");
      const text = await file.text();
      if (kind === "sharpe") { const updates = importSharpeCsv(text, values); setValues(old => ({ ...old, ...updates, privateDataOmitted: "no" })); setUploadError(null); setCopyStatus("CSV read locally. Only mapped return, benchmark, date and currency fields were retained."); setFallback(""); return; }
      if (kind === "expectancy") { const updates = importExpectancyCsv(text, values); setValues(old => ({ ...old, ...updates, privateDataOmitted: "no" })); setUploadError(null); setCopyStatus("CSV read locally. Only mapped P&L, cost, risk, date and currency fields were retained."); setFallback(""); return; }
      if (kind === "consistency") { const history = normalizedDailyPnlCsv(text); setValues(old => ({ ...old, history, privateDataOmitted: "no" })); setUploadError(null); setCopyStatus("CSV read locally. Only date and net P&L columns were retained."); setFallback(""); return; }
      const parsed = parseEquityCsv(text), dated = parsed.observations.some(row => row.date !== undefined);
      const csvCell = (value: string) => /[,"\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
      const history = [(dated ? ["date", "value", "flow"] : ["value", "flow"]).join(","), ...parsed.observations.map(row => [...(dated ? [row.date ?? ""] : []), String(row.value), String(row.flow ?? "")].map(csvCell).join(","))].join("\n");
      setValues(old => ({ ...old, history, privateDataOmitted: "no", ...(parsed.columnType ? { seriesKind: parsed.columnType } : {}) })); setUploadError(null); setCopyStatus("CSV read locally. Only date, value and flow columns were retained."); setFallback("");
    } catch (caught) { setUploadError(`CSV not applied: ${caught instanceof Error ? caught.message : "Check the format."} Previous inputs were retained.`); }
  };
  const fields = costFields(kind, values);
  const field = (item: CostField) => <div className={styles.field} key={item.name}><label htmlFor={`cost-${item.name}`}>{item.label}</label>{item.options ? <select disabled={!ready} id={`cost-${item.name}`} value={values[item.name]} onChange={e => set(item.name, e.target.value)}>{item.options.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</select> : item.type === "csv" ? <input disabled={!ready} id={`cost-${item.name}`} key={fileRevision} type="file" accept=".csv,text/csv" onChange={event => { void readCsv(event.target.files?.[0]); }} aria-describedby={item.help ? `cost-${item.name}-help` : undefined} /> : item.type === "textarea" ? <textarea disabled={!ready} id={`cost-${item.name}`} value={values[item.name]} maxLength={item.name === "history" ? 65536 : 4096} onChange={e => set(item.name, e.target.value)} aria-describedby={item.help ? `cost-${item.name}-help` : undefined} /> : <input disabled={!ready} id={`cost-${item.name}`} type={item.type === "datetime-local" || item.type === "date" ? item.type : "text"} inputMode={item.type === "text" || item.type === "datetime-local" || item.type === "date" ? undefined : "decimal"} value={values[item.name]} maxLength={item.name === "sourceUrl" ? 2048 : 120} onChange={e => set(item.name, e.target.value)} aria-describedby={item.help ? `cost-${item.name}-help` : undefined} />}{item.help && <small id={`cost-${item.name}-help`}>{item.help}</small>}</div>;
  const reset = () => { window.history.replaceState(null, "", definition.path); window.dispatchEvent(new PopStateEvent("popstate")); setValues({ ...definition.defaults }); setCopyStatus(""); setFallback(""); setUploadError(null); setFileRevision(value => value + 1); };
  const copy = async (link: boolean) => { if (!result) return; const output = link ? `${window.location.origin}${definition.path}?${definition.privateFields?.length ? serializePrivateSettings(values, definition.privateFields) : serializeTradeScenario(values)}` : [result.title, result.value, result.summary, ...result.metrics.map(row => row.join(": ")), ...result.tables.flatMap(table => [table.title, ...table.rows.map(row => row.join(" | "))]), ...result.steps, ...result.warnings, ...(result.references?.map(reference => `${reference.label}: ${reference.href}`) ?? []), ...result.conversions.flatMap(conversion => conversion.rates.map(rate => `${rate.source}: ${rate.base}/${rate.quote}, ${rate.asOf ?? "manual input; no verified timestamp"}`))].join("\n"); if (link && output.length > 12000) { setCopyStatus("This history is too long for a reliable URL. Copy results or use a shorter history."); return; } try { await navigator.clipboard.writeText(output); setCopyStatus(link ? definition.privateFields?.length ? "Settings link copied. Private financial data was not included." : "Scenario link copied." : "Results copied."); } catch { setFallback(output); setCopyStatus("Select and copy the text below."); } };
  return <div className={`${styles.workspace} ${shared.workspace}`} data-cost-workbench={kind} data-ready={ready}>
    <div className={shared.topline}><span>{definition.title}</span><span>Editable assumptions · no invented broker prices</span></div>
    <a className={shared.mobileResult} href="#calculation-result"><span><strong>{result?.value ?? "Check inputs"}</strong>{result?.title ?? "Your result"}</span><span>View result <ArrowRight size={18} aria-hidden="true" /></span></a>
    <div className={styles.calculatorGrid}><form className={styles.inputForm} onSubmit={e => e.preventDefault()} aria-label={`${kind} calculator inputs`}>
      <div className={styles.formHeading}><h3>Your assumptions</h3><button disabled={!ready} type="button" className={styles.reset} onClick={reset}><RotateCcw size={15} aria-hidden="true" />Reset</button></div><p className={styles.inputNote}>{definition.note}</p>
      {kind === "currency" && <button disabled={!ready} type="button" className={styles.reset} onClick={() => { setValues(old => reverseCurrencyScenario(old)); setCopyStatus("Currencies reversed. Provider adjustments and fees cleared; re-enter cross quotes if applicable."); setFallback(""); }}>Reverse currencies</button>}
      <div className={styles.fieldGrid}>{fields.filter(item => !item.advanced).map(field)}</div>
      {fields.some(item => item.advanced) && <details className={styles.breakdown}><summary>Advanced assumptions and specification</summary><div className={styles.fieldGrid}>{fields.filter(item => item.advanced).map(field)}</div></details>}
      {["daily", "historical"].includes(values.rateSource) && <div className={shared.notice}><p>{(reference.key === referenceKey ? reference.error : undefined) ?? (activeReference ? `Dated reference retrieved ${activeReference.retrievedAt}. Observation dates appear with the result; this is not live pricing.` : "Loading dated daily references…")}</p><button disabled={!ready} type="button" className={styles.reset} onClick={() => setRefresh(value => value + 1)}>Refresh daily references</button>{activeReference?.cached && <p>Cached fallback; original observation dates retained.</p>}</div>}
      <a className={styles.viewResult} href="#calculation-result">View calculation <ArrowRight size={18} aria-hidden="true" /></a>
    </form><aside id="calculation-result" className={`${styles.result} ${shared.result}`} aria-label={`${kind} calculator results`}>
      <p className={styles.resultEyebrow}>Disclosed assumptions · not an execution quote</p><div role="status" aria-live="polite" aria-atomic="true">{error ? <div className={styles.validation}><h3>Check your inputs</h3><p>{error}</p><p>No estimate is shown until required inputs are valid.</p></div> : result && <><h3>{result.title}</h3><p className={styles.resultValue} data-result>{result.value}</p><p className={styles.resultSummary}>{result.summary}</p></>}</div>
      {result && <><dl className={styles.metrics}>{result.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        {result.chart && <HistoryChart chart={result.chart} />}
        {result.bars && <figure className={shared.levelLadder} aria-label="Exposure and equity comparison"><figcaption>{result.barsCaption}</figcaption>{result.bars.map(bar => <div className={shared.levelRow} key={bar.label}><span>{bar.label}</span><strong>{bar.value}</strong><div aria-hidden="true"><span style={{ width: `${bar.ratio * 100}%` }} /></div></div>)}</figure>}
        {result.levels && <figure className={shared.levelLadder} aria-label="Entered trade price levels"><figcaption>Entry and rounded exit levels share one price range. Bars show relative price, not outcome probability.</figcaption>{result.levels.map(level => <div className={shared.levelRow} key={level.label}><span>{level.label}</span><strong>{level.price}</strong><div aria-hidden="true"><span style={{ width: `${level.position * 100}%` }} /></div></div>)}</figure>}
        {result.tables.map(table => <div className={shared.smallTable} key={table.title} role="region" aria-label={table.title} tabIndex={0}><table className={table.headers.length > 3 ? shared.wideTable : undefined}><caption>{table.title}</caption><thead><tr>{table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>)}
        <details className={styles.breakdown} open><summary>Calculation breakdown</summary><ol>{result.steps.map(step => <li key={step}>{step}</li>)}</ol></details>
        {result.conversions.flatMap(conversion => conversion.rates).map((rate, i) => <p className={shared.notice} key={i}>{rate.base}/{rate.quote}: {rate.bid !== undefined ? `${rate.bid} bid / ${rate.ask} ask` : rate.rate}. {rate.source === "manual" ? "User-entered conversion quote; not verified as live." : `Frankfurter dated reference observed ${rate.asOf}; not executable bid/ask pricing.`}</p>)}
        {result.references?.map(reference => <p key={reference.href} className={shared.notice}><a href={reference.href} target="_blank" rel="noopener noreferrer">{reference.label}</a></p>)}
        {result.warnings.map(warning => <p className={shared.notice} key={warning}>{warning}</p>)}
        <div className={shared.actions}><button disabled={!ready} type="button" onClick={() => copy(false)}><Copy size={16} aria-hidden="true" />Copy results</button><button disabled={!ready} type="button" onClick={() => copy(true)}><Link2 size={16} aria-hidden="true" />Copy scenario link</button></div>{copyStatus && <p role="status">{copyStatus}</p>}{fallback && <div className={styles.field}><label htmlFor="cost-copy">Copy text</label><textarea disabled={!ready} id="cost-copy" value={fallback} readOnly onFocus={e => e.target.select()} /></div>}
      </>}<p className={styles.estimate}>Educational estimates, not financial advice, verified account terms or a loss guarantee. Leveraged trading can cause substantial losses.</p>
    </aside></div><noscript><p className={styles.noScript}>Enable JavaScript to edit inputs or restore a scenario. The default example and supporting guide remain readable.</p></noscript>
  </div>;
}

function HistoryChart({ chart }: { chart: NonNullable<CostResult["chart"]> }) {
  const values = chart.points.flatMap(point => [point.value, point.peak]);
  let low = Math.min(...values), high = Math.max(...values);
  if (high === low) { const padding = Math.abs(high) * 0.02 || 1; low -= padding; high += padding; }
  const first = chart.points[0], last = chart.points.at(-1)!;
  const x = (value: number) => 40 + (value - first.x) / (last.x - first.x || 1) * 580;
  const y = (value: number) => 205 - (value - low) / (high - low) * 180;
  return <figure className={shared.simulationChart} aria-label={chart.title}><figcaption>{chart.caption}</figcaption><p>{chart.axisLabel} · vertical scale {quantity(low, 4)} to {quantity(high, 4)}</p><svg viewBox="0 0 640 230" role="img" aria-label={chart.title}><line x1="40" y1="25" x2="40" y2="205" stroke="#888"/><line x1="40" y1="205" x2="620" y2="205" stroke="#888"/><polyline fill="none" stroke="#777" strokeWidth="2" strokeDasharray="6 4" points={chart.points.map(point => `${x(point.x).toFixed(2)},${y(point.peak).toFixed(2)}`).join(" ")}/><polyline fill="none" stroke="#000" strokeWidth="2.5" points={chart.points.map(point => `${x(point.x).toFixed(2)},${y(point.value).toFixed(2)}`).join(" ")}/></svg><div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span>{first.label}</span><span>{last.label}</span></div></figure>;
}
