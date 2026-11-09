"use client";
import { useId, useState } from "react";
import { CheckCircle2, CircleAlert, RotateCcw, ArrowDownRight } from "lucide-react";
import { calculateConsistency, consistencyMoney } from "@/lib/calculators/consistency";
import styles from "./prop-firms.module.css";

export function ConsistencyCalculator() {
  const uid = useId();
  const [total, setTotal] = useState("2400");
  const [best, setBest] = useState("1500");
  const [preset, setPreset] = useState("40");
  const [custom, setCustom] = useState("25");
  let result;
  let error = "";
  try { result = calculateConsistency(total, best, preset === "custom" ? custom : preset); }
  catch (caught) { error = caught instanceof Error ? caught.message : "Check your inputs."; }
  const current = result ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(result.percentage) : "—";
  const errorId = `${uid}-error`;
  const invalid = (name: string) => error.startsWith(name);
  return <section className={styles.calculator} aria-label="Prop firm consistency calculator" id="calculator">
    <div className={styles.inputs}>
      <div className={styles.panelHeading}><span className={styles.eyebrow}>Your trading figures</span><button type="button" className={styles.reset} onClick={() => { setTotal(""); setBest(""); setPreset("40"); setCustom("25"); }}><RotateCcw size={16} aria-hidden="true" /> Reset</button></div>
      <p>Check your best day’s share of total net profit. The starting figures are a worked example.</p>
      <label htmlFor={`${uid}-total`}>Total net profit ($)</label>
      <div className={styles.moneyInput}><span aria-hidden="true">$</span><input id={`${uid}-total`} inputMode="decimal" maxLength={20} autoComplete="off" value={total} onChange={e => setTotal(e.target.value)} aria-describedby={`${uid}-period${invalid("Total net profit") ? ` ${errorId}` : ""}`} aria-invalid={invalid("Total net profit")} /></div>
      <span className={styles.help} id={`${uid}-period`}>Use the firm’s assessment period. Include losing days and applicable charges.</span>
      <label htmlFor={`${uid}-best`}>Highest profitable trading day ($)</label>
      <div className={styles.moneyInput}><span aria-hidden="true">$</span><input id={`${uid}-best`} inputMode="decimal" maxLength={20} autoComplete="off" value={best} onChange={e => setBest(e.target.value)} aria-describedby={`${uid}-day${invalid("Highest profitable day") ? ` ${errorId}` : ""}`} aria-invalid={invalid("Highest profitable day")} /></div>
      <span className={styles.help} id={`${uid}-day`}>Use the same period and the firm’s daily reset time.</span>
      <fieldset className={styles.presets}><legend>Consistency limit</legend><div>{["20", "30", "40", "50", "custom"].map(value => <label key={value} className={preset === value ? styles.selected : ""}><input type="radio" name={`${uid}-limit`} value={value} checked={preset === value} onChange={() => setPreset(value)} /><span>{value === "custom" ? "Custom" : `${value}%`}</span></label>)}</div></fieldset>
      {preset === "custom" && <div className={styles.custom}><label htmlFor={`${uid}-custom`}>Custom limit (%)</label><input id={`${uid}-custom`} inputMode="decimal" maxLength={20} value={custom} onChange={e => setCustom(e.target.value)} aria-invalid={invalid("Consistency limit")} aria-describedby={`${uid}-custom-help${invalid("Consistency limit") ? ` ${errorId}` : ""}`} /><span className={styles.help} id={`${uid}-custom-help`}>0.01% to 100%, with up to two decimal places.</span></div>}
      <p className={styles.help}>Presets are examples of limits, not verified rules for named firms.</p>
    </div>
    <div className={styles.results} aria-live="polite" aria-atomic="true">
      {result ? <>
        <p className={`${styles.status} ${result.withinLimit ? styles.within : styles.above}`}>{result.withinLimit ? <CheckCircle2 size={19} aria-hidden="true" /> : <CircleAlert size={19} aria-hidden="true" />}{result.withinLimit ? "Within selected limit" : "Above selected limit"}</p>
        <div className={styles.mainMetric}><span>Current consistency</span><output data-result="percentage">{current}<small>%</small></output><span>Selected limit: <strong>{result.limit}%</strong></span></div>
        <div className={styles.meter} role="progressbar" aria-label="Best day share of total net profit" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, result.percentage)} aria-valuetext={`${current} percent; selected limit ${result.limit} percent; ${result.withinLimit ? "within" : "above"} limit`}><span style={{ width: `${Math.min(100, result.percentage)}%` }} /><i style={{ left: `${result.limit}%` }} aria-hidden="true" /></div>
        <p className={styles.help}>Marker = your limit. Status uses unrounded values; the bar stops at 100%.</p>
        <dl className={styles.resultList}><div><dt>Minimum required total net profit</dt><dd data-result="minimum">{consistencyMoney(result.minimumTotal)}</dd></div><div><dt>Additional net profit needed</dt><dd className={styles.additional} data-result="additional">{consistencyMoney(result.additionalProfit)} <ArrowDownRight size={20} aria-hidden="true" /></dd></div></dl>
        <p className={styles.resultNote}>Assumes your highest profitable day stays unchanged. This checks an inclusive “at most” limit only; it does not confirm challenge completion or payout eligibility.</p>
      </> : <div className={styles.empty}><CircleAlert size={30} aria-hidden="true" /><h2>Check your figures</h2><p id={errorId} role="status">{error}</p><p>Percentage calculations need positive total net profit and a positive best day. Blank, zero or negative values cannot produce a valid result.</p></div>}
    </div>
    <noscript><p>Enable JavaScript to update the calculator. The formula and worked example below remain available without it.</p></noscript>
  </section>;
}
