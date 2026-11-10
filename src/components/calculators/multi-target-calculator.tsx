"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import { Copy, Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";
import { pairCodes } from "@/lib/calculators/forex";
import { accountCurrencies, calculateMultiTarget, equalAllocations, PlanError, remainingPercentage, samplePlan, type MultiTargetInput, type MultiTargetResult, type TargetInput } from "@/lib/calculators/multi-target";
import { multiTargetCsv, readableMultiTargetPlan } from "@/lib/calculators/multi-target-export";
import { MultiTargetResults } from "./multi-target-results";
import styles from "./multi-target.module.css";

type ErrorInfo = { field: string; message: string } | null;
function Field({ label, value, change, hint, error, select }: { label: string; value: string; change: (value: string) => void; hint?: string; error?: boolean; select?: ReactNode }) {
  const id = useId();
  const props = { id, value, "aria-invalid": error || undefined, "aria-describedby": hint ? `${id}-hint` : undefined, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => change(event.target.value) };
  return <div className={styles.field}><label htmlFor={id}>{label}</label>{select ? <select {...props}>{select}</select> : <input {...props} type="text" inputMode="decimal" autoComplete="off" spellCheck={false} />}{hint && <small id={`${id}-hint`}>{hint}</small>}</div>;
}
export function MultiTargetCalculator() {
  const [input, setInput] = useState<MultiTargetInput>(samplePlan);
  const [plan, setPlan] = useState<MultiTargetResult | null>(() => calculateMultiTarget(samplePlan()));
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<ErrorInfo>(null);
  const [message, setMessage] = useState("");
  const [copyFallback, setCopyFallback] = useState("");
  const results = useRef<HTMLElement>(null);
  const [base, quote] = input.pair.split("/");
  function update<K extends keyof MultiTargetInput>(key: K, value: MultiTargetInput[K]) {
    setInput(previous => ({ ...previous, [key]: value })); setDirty(true); setError(null); setMessage(""); setCopyFallback("");
  }
  function targetChange(index: number, changes: Partial<TargetInput>) { update("targets", input.targets.map((target, i) => i === index ? { ...target, ...changes } : target)); }
  function failure(cause: unknown) { setError(cause instanceof PlanError ? { field: cause.field, message: cause.message } : { field: "form", message: "Check the decimal inputs and try again." }); }
  function calculate(basis: "ideal" | "adjusted" = "ideal") {
    try { const next = calculateMultiTarget(input, basis); setPlan(next); setDirty(false); setError(null); setMessage(""); setCopyFallback(""); requestAnimationFrame(() => results.current?.focus()); }
    catch (cause) { setPlan(null); setDirty(false); failure(cause); }
  }
  function numberField(key: "entry" | "stop" | "lots" | "cashRisk" | "balance" | "riskPercent" | "contract" | "minimum" | "step" | "pipOverride" | "conversionRate" | "runnerExit" | "commission", label: string, hint?: string) {
    return <Field label={label} value={input[key]} change={value => update(key, value)} hint={hint} error={error?.field === key} />;
  }
  function selectField(key: "pair" | "account" | "side" | "sizeMode" | "conversionDirection" | "stopPolicy" | "moveAfter", label: string, choices: { value: string; label: string }[], hint?: string) {
    return <Field label={label} value={input[key]} hint={hint} change={value => {
      if (key === "pair") { setInput(previous => ({ ...previous, pair: value, entry: "", stop: "", conversionRate: "", pipOverride: "", targets: previous.targets.map(t => ({ ...t, value: t.mode === "price" ? "" : t.value })) })); setDirty(true); setError(null); }
      else if (key === "account") { setInput(previous => ({ ...previous, account: value, conversionRate: "" })); setDirty(true); setError(null); }
      else if (key === "conversionDirection") { setInput(previous => ({ ...previous, conversionDirection: value as MultiTargetInput["conversionDirection"], conversionRate: "" })); setDirty(true); setError(null); }
      else update(key, value as MultiTargetInput[typeof key]);
    }} select={choices.map(choice => <option key={choice.value} value={choice.value}>{choice.label}</option>)} />;
  }
  function preset() {
    update("targets", ["50", "30", "20"].map((percent, i) => ({ ...(input.targets[i] ?? { mode: "r", value: String(i + 1) }), percent })));
    setInput(previous => ({ ...previous, moveAfter: String(Math.min(Number(previous.moveAfter), 3)) }));
  }
  function removeTarget(index: number) {
    const targets = input.targets.filter((_, i) => i !== index);
    update("targets", targets); setInput(previous => ({ ...previous, moveAfter: String(Math.min(Number(previous.moveAfter), targets.length)) }));
  }
  function reset() {
    const next = samplePlan(); next.entry = ""; next.stop = ""; next.lots = ""; next.cashRisk = ""; next.balance = ""; next.riskPercent = ""; next.targets = next.targets.map(t => ({ ...t, value: "" }));
    setInput(next); setPlan(null); setError(null); setDirty(false); setMessage("Inputs cleared. Enter a position or load the worked example."); setCopyFallback("");
  }
  function example() { const next = samplePlan(); setInput(next); setPlan(calculateMultiTarget(next)); setDirty(false); setError(null); setMessage("Illustrative EUR/USD worked example loaded; these are not current market prices."); setCopyFallback(""); }
  const shown = !dirty ? plan : null;
  async function copy() {
    if (!shown) return;
    const text = readableMultiTargetPlan(shown);
    try { await navigator.clipboard.writeText(text); setMessage("Readable plan copied to your clipboard."); }
    catch { setCopyFallback(text); setMessage("Clipboard access is unavailable. Select and copy the readable plan below."); }
  }
  function download() {
    if (!shown) return;
    const url = URL.createObjectURL(new Blob([multiTargetCsv(shown)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "forex-multi-target-plan.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage("CSV download prepared locally. No plan data was sent to a server.");
  }
  return <div className={styles.calculator} data-multi-target-calculator>
    <div className={styles.toolbar}><span>One position · Up to ten targets · Calculated in your browser</span><div className={styles.actions}><button type="button" onClick={example}>Load worked example</button><button type="button" onClick={reset}><RotateCcw size={18} aria-hidden="true" />Reset</button></div></div>
    <p className={styles.note}>Starting values are the illustrative EUR/USD worked example, not current market quotes. Edit your assumptions and calculate to refresh results.</p>
    <form className={styles.editor} onSubmit={event => { event.preventDefault(); calculate(); }} aria-label="Multi-target trade inputs" noValidate>
      <fieldset><legend>1. Your forex position</legend><div className={styles.fieldGrid}>
        {selectField("pair", "Forex pair", pairCodes.map(value => ({ value, label: value })), `Base: ${base}. Quote: ${quote}. Only the listed forex pairs are supported.`)}
        {selectField("side", "Direction", [{ value: "buy", label: "Buy / long" }, { value: "sell", label: "Sell / short" }])}
        {selectField("account", "Account currency", accountCurrencies.map(value => ({ value, label: value })))}
        {numberField("entry", "Entry price", "Hypothetical executable fill price, with any spread already included.")}
        {numberField("stop", "Initial stop-loss price", input.side === "buy" ? "Must be strictly below entry." : "Must be strictly above entry.")}
        {selectField("sizeMode", "Position-size mode", [{ value: "lots", label: "Enter existing total lots" }, { value: "cash", label: "Size from fixed cash risk" }, { value: "percent", label: "Size from equity × risk percentage" }])}
        {input.sizeMode === "lots" && numberField("lots", "Total lots", "Actual position volume under the contract below.")}
        {input.sizeMode === "cash" && numberField("cashRisk", `Gross cash-risk budget (${input.account})`, "Price-based stop risk before commissions, gaps and slippage.")}
        {input.sizeMode === "percent" && <>{numberField("balance", `Account balance/equity (${input.account})`)}{numberField("riskPercent", "Risk percentage", "Your own risk assumption, not a recommendation.")}</>}
      </div><p className={styles.note}>Risk-based size rounds down to the lot step. Margin, leverage and stop-loss risk are different concepts; leverage is not an input to price-based P/L.</p></fieldset>
      {quote !== input.account && <fieldset><legend>Constant scenario conversion rate</legend><p>Convert quote-currency P/L into account currency using one manual factor for gains, losses, targets and stops. This illustrative constant is not a live rate; actual conversion at different exits can differ, including when the account currency is the pair’s base currency.</p><div className={styles.fieldGrid}>
        {selectField("conversionDirection", "Conversion input direction", [{ value: "direct", label: `${input.account} per 1 ${quote} (direct)` }, { value: "inverse", label: `${quote} per 1 ${input.account} (inverse)` }])}
        {numberField("conversionRate", `Conversion rate (${input.conversionDirection === "direct" ? `${input.account} per ${quote}` : `${quote} per ${input.account}`})`, input.conversionDirection === "inverse" ? `We use its reciprocal: 1 ÷ entered rate = ${input.account} per ${quote}.` : `Account P/L = quote P/L × entered ${input.account}-per-${quote} rate.`)}
      </div></fieldset>}
      <fieldset><legend>2. Broker contract and volume assumptions</legend><div className={styles.fieldGrid}>
        {numberField("contract", "Base-currency units per lot", "Editable assumption: 100,000 base units per standard lot. Confirm the actual contract.")}
        {numberField("minimum", "Minimum close / remaining lots", "The same entered minimum applies to each partial close and any nonzero remainder.")}
        {numberField("step", "Lot step", "Exact multiples anchored at zero; check your broker’s actual volume grid.")}
        {numberField("pipOverride", "Advanced pip-size override (optional)", `Blank uses ${quote === "JPY" ? "0.01" : "0.0001"} for ${input.pair}. Fractional-pip digits are not full pips.`)}
      </div></fieldset>
      <fieldset><legend>3. Build your take-profit targets</legend><p><strong>Percentages refer to the original position, not the remaining position.</strong> Targets must progress away from entry. Full-exit allocations must total exactly 100%; lower totals require explicit runner mode.</p><div className={styles.actions}>
        <button type="button" onClick={() => { const shares = equalAllocations(input.targets.length); update("targets", input.targets.map((t, i) => ({ ...t, percent: shares[i] }))); }}>Equal allocation</button>
        <button type="button" onClick={preset}>50 / 30 / 20 preset</button>
        <button type="button" onClick={() => update("targets", input.targets.map(t => ({ ...t, percent: "" })))}>Clear allocations</button>
      </div><p className={styles.note}>Equal allocation puts any final decimal remainder into the last target. The 50 / 30 / 20 preset explicitly sets three targets and their percentages; existing prices are retained where available.</p>
        <div className={styles.targetList}>{input.targets.map((target, i) => <fieldset key={i} className={styles.target} aria-label={`TP${i + 1} settings`}><legend>TP{i + 1}</legend><div className={styles.targetFields}>
          <Field label={`TP${i + 1} input type`} value={target.mode} change={mode => targetChange(i, { mode: mode as TargetInput["mode"], value: "" })} select={<><option value="price">Target price</option><option value="r">Target R multiple</option></>} />
          <Field label={`TP${i + 1} ${target.mode === "price" ? "target price" : "R multiple"}`} value={target.value} change={value => targetChange(i, { value })} error={error?.field === `target-${i}-value`} />
          <Field label={`TP${i + 1} close % of original`} value={target.percent} change={percent => targetChange(i, { percent })} error={error?.field === `target-${i}-percent`} />
        </div><div className={styles.actions}><button type="button" onClick={() => { try { targetChange(i, { percent: remainingPercentage(input.targets, i) }); } catch (cause) { failure(cause); } }}>Allocate remaining to TP{i + 1}</button><button type="button" disabled={input.targets.length === 1} onClick={() => removeTarget(i)} aria-label={`Remove TP${i + 1}`}><Trash2 size={18} aria-hidden="true" />Remove</button></div></fieldset>)}</div>
        <button type="button" onClick={() => update("targets", [...input.targets, { mode: "r", value: String(input.targets.length + 1), percent: "" }])} disabled={input.targets.length >= 10}><Plus size={18} aria-hidden="true" />Add target ({input.targets.length}/10)</button>
        <label className={styles.check}><input type="checkbox" checked={input.runner} onChange={e => update("runner", e.target.checked)} />Allow an open runner / allocation below 100%</label>
        {input.runner && numberField("runnerExit", "Runner exit price (optional)", "Assumed after all targets fill. Blank keeps the runner open, with no final whole-trade R. An exit beyond the selected remainder stop is rejected because the stop would trigger first.")}
      </fieldset>
      <fieldset><legend>4. Reversal stop and optional commission</legend><div className={styles.fieldGrid}>
        {selectField("stopPolicy", "Remainder stop policy", [{ value: "original", label: "Keep original stop" }, { value: "entry", label: "Move stop to entry after a target" }])}
        {input.stopPolicy === "entry" && selectField("moveAfter", "Move stop after", input.targets.map((_, i) => ({ value: String(i + 1), label: `TP${i + 1}` })), "Entry-price stop is not cost-adjusted break-even.")}
      </div><label className={styles.check}><input type="checkbox" checked={input.commissionEnabled} onChange={e => update("commissionEnabled", e.target.checked)} />Include commission</label>
        {input.commissionEnabled && numberField("commission", `Commission (${input.account} per standard lot per side)`, "A standard lot here means 100,000 base units. Entry is charged on the full size once; exit charges follow actual closed units, including a stopped remainder.")}
        <p className={styles.note}>No separate spread or slippage charge is subtracted: enter hypothetical fill prices that already reflect them. Financing, swaps, taxes and margin are not modeled.</p>
      </fieldset>
      {error && <p role="alert" className={styles.error}>{error.message}</p>}
      <button className={styles.primaryButton} type="submit">Calculate partial-exit plan</button>
    </form>
    <section ref={results} className={styles.results} tabIndex={-1} aria-labelledby="multi-target-results-title" aria-live="polite">
      {shown ? <MultiTargetResults plan={shown} adjust={() => calculate("adjusted")} ideal={() => calculate("ideal")} /> : <div className={styles.emptyResult}><h2 id="multi-target-results-title">Your partial-exit results</h2><p>{dirty ? "Inputs changed. Calculate to refresh the plan; previous results are not shown as current." : "Enter a valid position and calculate, or load the illustrative worked example."}</p></div>}
    </section>
    <div className={styles.exportActions}><div className={styles.actions}><button type="button" disabled={!shown} onClick={copy}><Copy size={18} aria-hidden="true" />Copy plan</button><button type="button" disabled={!shown} onClick={download}><Download size={18} aria-hidden="true" />Download CSV</button><button type="button" disabled={!shown} onClick={() => window.print()}><Printer size={18} aria-hidden="true" />Print results</button></div><p role="status">{message}</p>{copyFallback && <label className={styles.field}>Readable plan to copy<textarea readOnly value={copyFallback} rows={14} onFocus={e => e.currentTarget.select()} /></label>}</div>
  </div>;
}
