"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { calculatePip, calculatePosition, calculateProfit, calculateRisk, CalculationError, currencies, currency, defaultConversionDirection, money, number as formatNumber, pairCodes, pairInfo, type Currency, type FxInputs, type PairCode } from "@/lib/calculators/forex";
import styles from "./calculator.module.css";

export type TradingMode = "profit" | "pip" | "position" | "risk";
const modes: { id: TradingMode; label: string }[] = [{ id: "profit", label: "Profit & loss" }, { id: "pip", label: "Pip value" }, { id: "position", label: "Position size" }, { id: "risk", label: "Risk amount" }];
const defaults = { pair: "EUR/USD" as PairCode, account: "USD" as Currency, side: "buy" as "buy" | "sell", lots: "1", entry: "1.1000", exit: "1.1025", balance: "10000", riskPercent: "1", cashRisk: "100", stop: "25", contract: "100000", increment: "0.01", commission: "0", swap: "0", riskMode: "percent" as "percent" | "cash", direction: "direct" as "direct" | "inverse", bid: "", ask: "" };

export function NumericField({ label, value, onChange, hint, min, max, step = "any" }: { label: string; value: string; onChange: (value: string) => void; hint?: string; min?: number; max?: number; step?: string }) {
  const id = useId();
  return <div className={styles.field}><label htmlFor={id}>{label}</label><input id={id} aria-describedby={hint ? `${id}-help` : undefined} type="number" inputMode="decimal" step={step} min={min} max={max} value={value} onChange={e => onChange(e.target.value)} />{hint && <small id={`${id}-help`}>{hint}</small>}</div>;
}

export function SelectField({ label, value, onChange, children, hint }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode; hint?: string }) {
  const id = useId();
  return <div className={styles.field}><label htmlFor={id}>{label}</label><select id={id} aria-describedby={hint ? `${id}-help` : undefined} value={value} onChange={e => onChange(e.target.value)}>{children}</select>{hint && <small id={`${id}-help`}>{hint}</small>}</div>;
}

export function numeric(value: string, label: string) {
  if (!value.trim() || !Number.isFinite(Number(value))) throw new CalculationError(`Enter a valid ${label.toLowerCase()}.`);
  return Number(value);
}

type ViewResult = { title: string; value: string; summary: string; metrics: [string, string][]; formulas: string[]; warning?: string };

export function TradingCalculator({ initialMode = "profit", tabbed = false }: { initialMode?: TradingMode; tabbed?: boolean }) {
  const id = useId();
  const [mode, setMode] = useState<TradingMode>(initialMode);
  const [values, setValues] = useState({ ...defaults });
  const set = <K extends keyof typeof defaults>(key: K, value: typeof defaults[K]) => setValues(old => ({ ...old, [key]: value }));
  const info = pairInfo(values.pair);
  const needsConversion = mode !== "risk" && info.quote !== values.account;
  const conversionBase = values.direction === "direct" ? info.quote : values.account;
  const conversionQuote = values.direction === "direct" ? values.account : info.quote;
  function changeMarket(pair: PairCode, account: Currency) {
    setValues(old => ({ ...old, pair, account, bid: "", ask: "", direction: defaultConversionDirection(pairInfo(pair).quote, account), ...(pair !== old.pair ? { entry: "", exit: "" } : {}) }));
  }
  function field(key: "lots" | "entry" | "exit" | "balance" | "riskPercent" | "cashRisk" | "stop" | "contract" | "commission" | "swap" | "bid" | "ask", label: string, hint?: string, min?: number, max?: number) {
    return <NumericField label={label} value={values[key]} onChange={value => set(key, value)} hint={hint} min={min} max={max} />;
  }
  function result(): ViewResult {
    const account = currency(values.account);
    const cash = (amount: number, precise = false) => money(amount, account, precise ? 6 : 2);
    if (mode === "risk") {
      const balance = numeric(values.balance, "account balance"), percent = numeric(values.riskPercent, "risk percentage");
      const risk = calculateRisk(balance, percent);
      return { title: "Planned risk amount", value: cash(risk), summary: `${formatNumber(percent)}% of your account balance.`, metrics: [["Account balance", cash(balance)], ["Risk percentage", `${formatNumber(percent)}%`]], formulas: [`${cash(balance)} × ${formatNumber(percent)} ÷ 100 = ${cash(risk)}`], warning: "A chosen risk budget is not a guaranteed loss cap. Gaps, slippage and charges can increase the actual loss." };
    }
    const common: FxInputs = { pair: values.pair, account, contractSize: numeric(values.contract, "units per lot"), ...(needsConversion ? { conversion: { base: conversionBase, quote: conversionQuote, bid: numeric(values.bid, "conversion bid"), ask: numeric(values.ask, "conversion ask") } } : {}) };
    if (mode === "profit") {
      const output = calculateProfit({ ...common, side: values.side, lots: numeric(values.lots, "position size"), entry: numeric(values.entry, "entry price"), exit: numeric(values.exit, "exit price"), commission: numeric(values.commission || "0", "commission"), swap: numeric(values.swap || "0", "swap adjustment") });
      return { title: "Estimated net profit / loss", value: cash(output.net), summary: output.net > 0 ? "Hypothetical profit after the entered costs." : output.net < 0 ? "Hypothetical loss after the entered costs." : "Break-even under the entered assumptions.", metrics: [["Directional price movement", `${formatNumber(output.pips, 6)} pips`], ["Position in base units", `${formatNumber(output.units)} ${info.base}`], ["Gross P&L in quote currency", money(output.quoteGross, info.quote)], ["Gross P&L in account currency", cash(output.accountGross)], ["Round-trip commission deducted", cash(output.commission)], ["Signed swap adjustment", cash(output.swap)]], formulas: [`(${values.side === "buy" ? "Exit − entry" : "Entry − exit"}) × ${formatNumber(output.units)} units = ${money(output.quoteGross, info.quote)}`, `Quote P&L × ${formatNumber(output.conversionRate, 10)} ${account}/${info.quote} = ${cash(output.accountGross)}`, `Gross account P&L − commission + signed swap = ${cash(output.net)}`] };
    }
    if (mode === "pip") {
      const output = calculatePip({ ...common, lots: numeric(values.lots, "position size") });
      return { title: "Value of one adverse pip", value: cash(output.loss, true), summary: `For ${formatNumber(Number(values.lots))} lot(s) of ${values.pair}.`, metrics: [["One favourable pip", cash(output.gain, true)], ["One adverse pipette", cash(output.pipetteLoss, true)], ["Pip size", formatNumber(output.pipSize, 6)], ["Pipette size", formatNumber(output.pipetteSize, 6)], ["Quote-currency value per pip", money(output.quoteValue, info.quote, 6)], ["Position in base units", `${formatNumber(output.units)} ${info.base}`]], formulas: [`${formatNumber(output.units)} units × ${formatNumber(output.pipSize, 6)} = ${money(output.quoteValue, info.quote, 6)} per pip`, "Convert quote currency into account currency using the entered bid/ask."], warning: needsConversion ? "Favourable and adverse pip values differ because conversion proceeds use one side of the bid/ask and covering a loss uses the other." : undefined };
    }
    const output = calculatePosition({ ...common, balance: numeric(values.balance, "account balance"), riskMode: values.riskMode, risk: numeric(values.riskMode === "percent" ? values.riskPercent : values.cashRisk, "risk budget"), stopPips: numeric(values.stop, "stop-loss distance"), lotStep: numeric(values.increment, "lot increment") });
    return { title: common.contractSize === 100000 ? "Estimated position in standard lots" : "Estimated lots at your contract size", value: `${output.lots.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} lots`, summary: `Rounded down to a ${values.increment}-lot increment.`, metrics: [["Risk budget", cash(output.budget)], ["Planned loss at the stop", cash(output.plannedLoss)], ["Base-currency units", `${formatNumber(output.units)} ${info.base}`], ["Standard-lot equivalents (100,000 units)", formatNumber(output.standardLots, 6)], ["Mini-lot equivalents (10,000 units)", formatNumber(output.miniLots, 6)], ["Micro-lot equivalents (1,000 units)", formatNumber(output.microLots, 6)], ["Adverse pip value for this position", cash(output.pipValue, true)]], formulas: [`Risk budget ÷ (${values.stop} pips × ${cash(output.perLotPipValue, true)} per pip per lot) = ${formatNumber(output.rawLots, 8)} unrounded lots`, `Round down to the selected increment: ${formatNumber(output.lots, 6)} lots.`], warning: output.lots === 0 ? "The risk budget is too small for one selected lot increment at this stop distance. Check the broker’s permitted minimum and increment." : "Excludes commission, swaps, gaps and slippage. Stop orders do not guarantee a fill price. Available margin and broker limits may reduce the tradable size." };
  }
  let output: ViewResult | undefined, error: string | undefined;
  try { output = result(); } catch (failure) { error = failure instanceof Error ? failure.message : "Check your inputs."; }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const current = modes.findIndex(item => item.id === mode);
    const next = event.key === "ArrowRight" ? (current + 1) % modes.length : event.key === "ArrowLeft" ? (current + modes.length - 1) % modes.length : event.key === "Home" ? 0 : event.key === "End" ? modes.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault(); setMode(modes[next].id);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return <div className={styles.workspace} data-calculator="forex">
    {tabbed && <div className={styles.tabs} role="tablist" aria-label="Forex calculation">{modes.map(item => <button key={item.id} type="button" id={`${id}-${item.id}-tab`} role="tab" aria-selected={mode === item.id} aria-controls={`${id}-panel`} tabIndex={mode === item.id ? 0 : -1} onClick={() => setMode(item.id)} onKeyDown={tabKey}>{item.label}</button>)}</div>}
    <div className={styles.calculatorGrid} id={`${id}-panel`} role={tabbed ? "tabpanel" : undefined} aria-labelledby={tabbed ? `${id}-${mode}-tab` : undefined}>
      <form className={styles.inputForm} onSubmit={event => event.preventDefault()} aria-label={`${modes.find(item => item.id === mode)!.label} inputs`}>
        <div className={styles.formHeading}><h3>Your inputs</h3><button className={styles.reset} type="button" onClick={() => setValues({ ...defaults })}><RotateCcw size={14} aria-hidden="true" />Reset</button></div>
        <p className={styles.inputNote}>Manual inputs · no live price feed. Initial EUR/USD prices are illustrative.</p>
        <div className={styles.fieldGrid}>
          {mode !== "risk" && <SelectField label="Currency pair" value={values.pair} onChange={value => changeMarket(value as PairCode, values.account)}>{pairCodes.map(pair => <option key={pair}>{pair}</option>)}</SelectField>}
          <SelectField label="Account currency" value={values.account} onChange={value => changeMarket(values.pair, value as Currency)}>{currencies.map(code => <option key={code}>{code}</option>)}</SelectField>
          {mode === "profit" && <>
            <SelectField label="Trade direction" value={values.side} onChange={value => set("side", value as "buy" | "sell")}><option value="buy">Buy / long</option><option value="sell">Sell / short</option></SelectField>
            {field("lots", "Position size (lots)", undefined, 0)}
            {field("entry", `Entry price (${values.side === "buy" ? "ask" : "bid"})`, undefined, 0)}
            {field("exit", `Exit price (${values.side === "buy" ? "bid" : "ask"})`, undefined, 0)}
          </>}
          {mode === "pip" && field("lots", "Position size (lots)", undefined, 0)}
          {(mode === "position" || mode === "risk") && <>
            {field("balance", `Account balance (${values.account})`, undefined, 0)}
            {mode === "position" && <SelectField label="Risk input" value={values.riskMode} onChange={value => set("riskMode", value as "percent" | "cash")}><option value="percent">Percentage of balance</option><option value="cash">Fixed cash amount</option></SelectField>}
            {mode === "position" && values.riskMode === "cash" ? field("cashRisk", `Fixed risk amount (${values.account})`, undefined, 0) : field("riskPercent", "Risk percentage (%)", undefined, 0, 100)}
            {mode === "position" && field("stop", "Stop-loss distance (pips)", "Use pips, not pipettes or price points.", 0)}
          </>}
        </div>
        {mode === "profit" && <p className={styles.fieldHelp}>Use execution prices: a buy opens at ask and closes at bid; a sell opens at bid and closes at ask. Spread is already included in these prices.</p>}
        {needsConversion && <fieldset className={styles.conversion}><legend>Convert {info.quote} to {values.account}</legend><p>Your result needs a separate conversion quote. Enter executable bid and ask prices; these are not fetched automatically.</p><div className={styles.fieldGrid}>
          <SelectField label="Conversion pair" value={values.direction} onChange={value => setValues(old => ({ ...old, direction: value as "direct" | "inverse", bid: "", ask: "" }))}><option value="direct">{info.quote}/{values.account}</option><option value="inverse">{values.account}/{info.quote}</option></SelectField>
          <div className={styles.quoteConvention}>1 {conversionBase} = entered price in {conversionQuote}</div>
          {field("bid", `${conversionBase}/${conversionQuote} conversion bid`, undefined, 0)}
          {field("ask", `${conversionBase}/${conversionQuote} conversion ask`, undefined, 0)}
        </div></fieldset>}
        {mode === "profit" && <details className={styles.settings}><summary>Commission & swap adjustments</summary><div className={styles.fieldGrid}>
          {field("commission", `Round-trip commission (${values.account})`, "Total for this position, not a per-lot rate.", 0)}
          {field("swap", `Swap adjustment (${values.account})`, "Negative for a charge; positive for a credit.")}
        </div></details>}
        {mode !== "risk" && <details className={styles.settings}><summary>Contract size{mode === "position" ? " & lot increment" : " assumptions"}</summary><div className={styles.fieldGrid}>
          {field("contract", "Base-currency units per lot", "Default: 100,000. Confirm the broker’s contract specification.", 1, 1e9)}
          {mode === "position" && <SelectField label="Lot increment" value={values.increment} onChange={value => set("increment", value)}>{["0.001", "0.01", "0.1", "1"].map(step => <option key={step}>{step}</option>)}</SelectField>}
        </div></details>}
        <a className={styles.viewResult} href="#calculation-result">View calculation <ArrowRight size={18} aria-hidden="true" /></a>
      </form>
      <aside id="calculation-result" className={styles.result} aria-label="Calculation result">
        <p className={styles.resultEyebrow}><span />Your calculation</p>
        <div role="status" aria-live="polite" aria-atomic="true">{error ? <div className={styles.validation}><h3>Check your inputs</h3><p>{error}</p><p>No result is shown until the required inputs are valid.</p></div> : output && <><h3>{output.title}</h3><p className={styles.resultValue} data-result>{output.value}</p><p className={styles.resultSummary}>{output.summary}</p></>}</div>
        {output && <>
          <dl className={styles.metrics}>{output.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <details className={styles.breakdown} open><summary>Calculation breakdown <ArrowRight size={16} aria-hidden="true" /></summary><ol>{output.formulas.map(line => <li key={line}>{line}</li>)}</ol></details>
          {output.warning && <p className={styles.resultNote}>{output.warning}</p>}
        </>}
        <p className={styles.estimate}>Estimate only. Check the broker’s prices, contract terms and charges before trading.</p>
      </aside>
    </div>
    <noscript><p className={styles.noScript}>Enable JavaScript to update these calculators. The formulas, worked examples and assumptions below remain available.</p></noscript>
  </div>;
}
