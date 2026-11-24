"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight, Copy, Link2, RotateCcw } from "lucide-react";
import { costDefinitions, costFields, costResult, changeCostField, type CostField, type CostKind } from "@/lib/calculators/cost-workbench";
import { restoreTradeScenario, serializeTradeScenario } from "@/lib/calculators/trade-scenario";
import type { RateSnapshot } from "@/lib/calculators/exchange-rates";
import styles from "./calculator.module.css";
import shared from "./lot-size.module.css";
const subscribe = (callback: () => void) => { window.addEventListener("popstate", callback); return () => window.removeEventListener("popstate", callback); };
const search = () => window.location.search;
export function CostWorkbench({ kind }: { kind: CostKind }) { const query = useSyncExternalStore(subscribe, search, () => ""); return <CostForm key={`${kind}-${query}`} kind={kind} query={query} />; }
function CostForm({ kind, query }: { kind: CostKind; query: string }) {
  const definition = costDefinitions[kind]; const restored = restoreTradeScenario(query, definition.defaults);
  const [values, setValues] = useState(restored.values), [copyStatus, setCopyStatus] = useState(""), [fallback, setFallback] = useState("");
  const [reference, setReference] = useState<{ data?: RateSnapshot; error?: string }>({}); const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (values.rateSource !== "daily") return;
    const controller = new AbortController();
    void fetch("/api/forex-rates", { signal: controller.signal }).then(async response => { const data = await response.json(); if (!response.ok || !Array.isArray(data.rates)) throw new Error(data.error ?? "Daily references are unavailable; enter a manual quote."); if (!controller.signal.aborted) setReference({ data }); }).catch(error => { if (!controller.signal.aborted) setReference(old => ({ ...old, error: String(error.message) })); });
    return () => controller.abort();
  }, [values.rateSource, refresh]);
  let result: ReturnType<typeof costResult> | null = null, error = restored.error;
  try { if (!error) result = costResult(kind, values, reference.data?.rates ?? []); } catch (caught) { error = caught instanceof Error ? caught.message : "Check the entered inputs."; }
  const set = (name: string, value: string) => { setValues(old => changeCostField(kind, old, name, value)); setCopyStatus(""); setFallback(""); };
  const fields = costFields(kind, values);
  const field = (item: CostField) => <div className={styles.field} key={item.name}><label htmlFor={`cost-${item.name}`}>{item.label}</label>{item.options ? <select id={`cost-${item.name}`} value={values[item.name]} onChange={e => set(item.name, e.target.value)}>{item.options.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</select> : item.type === "textarea" ? <textarea id={`cost-${item.name}`} value={values[item.name]} maxLength={4096} onChange={e => set(item.name, e.target.value)} aria-describedby={item.help ? `cost-${item.name}-help` : undefined} /> : <input id={`cost-${item.name}`} type={item.type === "datetime-local" ? item.type : "text"} inputMode={item.type === "text" || item.type === "datetime-local" ? undefined : "decimal"} value={values[item.name]} maxLength={256} onChange={e => set(item.name, e.target.value)} aria-describedby={item.help ? `cost-${item.name}-help` : undefined} />}{item.help && <small id={`cost-${item.name}-help`}>{item.help}</small>}</div>;
  const reset = () => { window.history.replaceState(null, "", definition.path); window.dispatchEvent(new PopStateEvent("popstate")); setValues({ ...definition.defaults }); setCopyStatus(""); setFallback(""); };
  const copy = async (link: boolean) => { if (!result) return; const output = link ? `${window.location.origin}${definition.path}?${serializeTradeScenario(values)}` : [result.title, result.value, result.summary, ...result.metrics.map(row => row.join(": ")), ...result.tables.flatMap(table => [table.title, ...table.rows.map(row => row.join(" | "))]), ...result.steps, ...result.warnings, ...result.conversions.flatMap(conversion => conversion.rates.map(rate => `${rate.source}: ${rate.base}/${rate.quote}, ${rate.asOf ?? "manual input; no verified timestamp"}`))].join("\n"); try { await navigator.clipboard.writeText(output); setCopyStatus(link ? "Scenario link copied." : "Results copied."); } catch { setFallback(output); setCopyStatus("Select and copy the text below."); } };
  return <div className={`${styles.workspace} ${shared.workspace}`} data-cost-workbench={kind}>
    <div className={shared.topline}><span>{definition.title}</span><span>Editable assumptions · no invented broker prices</span></div>
    <a className={shared.mobileResult} href="#calculation-result"><span><strong>{result?.value ?? "Check inputs"}</strong>{result?.title ?? "Your result"}</span><span>View result <ArrowRight size={18} aria-hidden="true" /></span></a>
    <div className={styles.calculatorGrid}><form className={styles.inputForm} onSubmit={e => e.preventDefault()} aria-label={`${kind} calculator inputs`}>
      <div className={styles.formHeading}><h3>Your assumptions</h3><button type="button" className={styles.reset} onClick={reset}><RotateCcw size={15} aria-hidden="true" />Reset</button></div><p className={styles.inputNote}>{definition.note}</p>
      <div className={styles.fieldGrid}>{fields.filter(item => !item.advanced).map(field)}</div>
      {fields.some(item => item.advanced) && <details className={styles.breakdown}><summary>Advanced assumptions and specification</summary><div className={styles.fieldGrid}>{fields.filter(item => item.advanced).map(field)}</div></details>}
      {values.rateSource === "daily" && <div className={shared.notice}><p>{reference.error ?? (reference.data ? `Daily reference retrieved ${reference.data.retrievedAt}. Observation dates appear with the result; this is not live pricing.` : "Loading dated daily references…")}</p><button type="button" className={styles.reset} onClick={() => setRefresh(value => value + 1)}>Refresh daily references</button>{reference.data?.cached && <p>Cached fallback; original observation dates retained.</p>}</div>}
      <a className={styles.viewResult} href="#calculation-result">View calculation <ArrowRight size={18} aria-hidden="true" /></a>
    </form><aside id="calculation-result" className={`${styles.result} ${shared.result}`} aria-label={`${kind} calculator results`}>
      <p className={styles.resultEyebrow}>Disclosed assumptions · not an execution quote</p><div role="status" aria-live="polite" aria-atomic="true">{error ? <div className={styles.validation}><h3>Check your inputs</h3><p>{error}</p><p>No estimate is shown until required inputs are valid.</p></div> : result && <><h3>{result.title}</h3><p className={styles.resultValue} data-result>{result.value}</p><p className={styles.resultSummary}>{result.summary}</p></>}</div>
      {result && <><dl className={styles.metrics}>{result.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        {result.tables.map(table => <div className={shared.smallTable} key={table.title} role="region" aria-label={table.title} tabIndex={0}><table className={table.headers.length > 3 ? shared.wideTable : undefined}><caption>{table.title}</caption><thead><tr>{table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>)}
        <details className={styles.breakdown} open><summary>Calculation breakdown</summary><ol>{result.steps.map(step => <li key={step}>{step}</li>)}</ol></details>
        {result.conversions.flatMap(conversion => conversion.rates).map((rate, i) => <p className={shared.notice} key={i}>{rate.base}/{rate.quote}: {rate.bid !== undefined ? `${rate.bid} bid / ${rate.ask} ask` : rate.rate}. {rate.source === "manual" ? "User-entered conversion quote; not verified as live." : `Frankfurter daily reference observed ${rate.asOf}; not executable bid/ask pricing.`}</p>)}
        {result.warnings.map(warning => <p className={shared.notice} key={warning}>{warning}</p>)}
        <div className={shared.actions}><button type="button" onClick={() => copy(false)}><Copy size={16} aria-hidden="true" />Copy results</button><button type="button" onClick={() => copy(true)}><Link2 size={16} aria-hidden="true" />Copy scenario link</button></div>{copyStatus && <p role="status">{copyStatus}</p>}{fallback && <div className={styles.field}><label htmlFor="cost-copy">Copy text</label><textarea id="cost-copy" value={fallback} readOnly onFocus={e => e.target.select()} /></div>}
      </>}<p className={styles.estimate}>Educational estimates, not financial advice, verified account terms or a loss guarantee. Leveraged trading can cause substantial losses.</p>
    </aside></div><noscript><p className={styles.noScript}>Enable JavaScript to edit inputs or restore a scenario. The default example and supporting guide remain readable.</p></noscript>
  </div>;
}
