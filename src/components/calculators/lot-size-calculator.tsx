"use client";

import type Decimal from "decimal.js";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowRight, Check, Copy, Link2, RotateCcw } from "lucide-react";
import { calculateLotSize, estimateLotMargin, type LotSizeInputs } from "@/lib/calculators/lot-size";
import { cash, quantity } from "@/lib/calculators/precision";
import { accountCurrencies, conventionalInstrument, isPair, pairCodes } from "@/lib/calculators/instruments";
import { defaultLotScenario, lotInputs, lotSizePath, restoreLotScenario, serializeLotScenario, type LotField, type LotScenario } from "@/lib/calculators/lot-scenario";
import type { RateSnapshot } from "@/lib/calculators/exchange-rates";
import styles from "./calculator.module.css";
import lot from "./lot-size.module.css";

const subscribe = (callback: () => void) => { window.addEventListener("popstate", callback); return () => window.removeEventListener("popstate", callback); };
const browserSearch = () => window.location.search;
const serverSearch = () => "";
const utc = (value: string) => new Date(value).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");

function Select({ name, label, value, onChange, children }: { name: string; label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <div className={styles.field}><label htmlFor={`ls-${name}`}>{label}</label><select id={`ls-${name}`} value={value} onChange={event => onChange(event.target.value)}>{children}</select></div>;
}

export function LotSizeCalculator() {
  const search = useSyncExternalStore(subscribe, browserSearch, serverSearch);
  return <LotSizeForm key={search} search={search} />;
}

function LotSizeForm({ search }: { search: string }) {
  const restored = restoreLotScenario(search);
  const [values, setValues] = useState<LotScenario>(() => restored.values);
  const [restoreError, setRestoreError] = useState(restored.error);
  const [reference, setReference] = useState<{ state: "idle" | "loading" | "ready" | "error"; data?: RateSnapshot; error?: string }>({ state: values.rateSource === "daily" ? "loading" : "idle" });
  const [refresh, setRefresh] = useState(0);
  const [copied, setCopied] = useState("");
  const [copyFallback, setCopyFallback] = useState("");
  const info = conventionalInstrument(isPair(values.pair) ? values.pair : "EUR/USD");
  const needsConversion = info.quote !== values.account;
  const set = (name: LotField, value: string) => { setValues(old => ({ ...old, [name]: value })); setCopied(""); setCopyFallback(""); };
  const currencyOptions = accountCurrencies.map(code => <option key={code}>{code}</option>);
  const clearRates = { rate: "", bid: "", ask: "", crossRate: "", crossBid: "", crossAsk: "" };

  useEffect(() => {
    if (values.rateSource !== "daily" || !needsConversion) return;
    const controller = new AbortController();
    void fetch("/api/forex-rates", { signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.rates) || !data.rates.length) throw new Error(data.error ?? "Daily reference rates are unavailable. Use manual rates.");
      if (!controller.signal.aborted) setReference({ state: "ready", data });
    }).catch(error => { if (!controller.signal.aborted) setReference({ state: "error", error: error instanceof Error ? error.message : "Reference rates are unavailable. Use manual rates." }); });
    return () => controller.abort();
  }, [values.rateSource, needsConversion, refresh]);

  let input: LotSizeInputs | undefined, output: ReturnType<typeof calculateLotSize> | undefined, error: string | undefined;
  try {
    if (restoreError) throw new Error(restoreError);
    input = lotInputs(values, reference.data?.rates);
    if (values.rateSource === "daily" && needsConversion && reference.state !== "ready") throw new Error(reference.state === "error" ? reference.error : "Loading dated reference rates. You can also enter a manual rate.");
    output = calculateLotSize(input);
  } catch (failure) { error = failure instanceof Error ? failure.message : "Check your inputs."; }

  let comparison: ReturnType<typeof calculateLotSize> | undefined, comparisonError: string | undefined;
  if (output && input) try { comparison = calculateLotSize({ ...input, riskMode: "percent", risk: values.compareRisk }); } catch (failure) { comparisonError = failure instanceof Error ? failure.message : "Check the comparison percentage."; }
  let margin: ReturnType<typeof estimateLotMargin> | undefined, marginError: string | undefined;
  if (output && input && values.marginEnabled === "yes") try { margin = estimateLotMargin(input, output.lots.toString(), values.leverage, values.freeMargin, values.marginPrice); } catch (failure) { marginError = failure instanceof Error ? failure.message : "Check the margin assumptions."; }
  const lots = (value: Decimal.Value) => quantity(value, 8, 2);
  const money = (value: Decimal.Value) => cash(value, values.account);
  const field = (name: LotField, label: string, help?: string, disabled = false) => <div className={styles.field}>
    <label htmlFor={`ls-${name}`}>{label}</label><input type="text" inputMode="decimal" id={`ls-${name}`} autoComplete="off" value={values[name]} onChange={event => set(name, event.target.value)} disabled={disabled} aria-describedby={[help ? `ls-${name}-help` : "", error ? "lot-input-error" : ""].filter(Boolean).join(" ") || undefined} />
    {help && <small id={`ls-${name}-help`}>{help}</small>}
  </div>;
  function changeCurrencies(name: "pair" | "account", value: string) {
    setValues(old => {
      const next = { ...old, [name]: value, ...clearRates };
      if (name === "pair" && isPair(value)) {
        const spec = conventionalInstrument(value);
        Object.assign(next, { contract: spec.contractSize, pipSize: spec.pipSize, minimum: spec.minimumLots, maximum: spec.maximumLots, increment: spec.lotStep, precision: String(spec.pricePrecision), entry: "", stopPrice: "", marginPrice: "" });
      }
      const quote = conventionalInstrument(isPair(next.pair) ? next.pair : "EUR/USD").quote;
      next.crossCurrency = accountCurrencies.find(code => code !== quote && code !== next.account) ?? "EUR";
      return next;
    });
    setCopied(""); setCopyFallback("");
  }
  async function copy(kind: "link" | "results") {
    if (!output) return;
    const text = kind === "link" ? `${window.location.origin}${lotSizePath}?${serializeLotScenario(values)}` : [
      `DEVIN FOREX lot-size scenario: ${values.pair}, ${values.account} account`,
      `Risk budget: ${money(output.budget)}; stop: ${quantity(output.stopPips)} pips`,
      `Volume: ${output.executable ? `${lots(output.lots)} lots / ${quantity(output.units)} ${info.base}` : "No valid executable volume"}`,
      `Price risk: ${money(output.priceRisk)}; estimated costs: ${money(output.costs)}; total planned loss: ${money(output.totalRisk)}`,
      `Costs ${values.includeCosts === "yes" ? "inside" : "outside"} risk budget. Spread ${values.spreadMode === "included" ? "already included" : "added separately"}.`,
      `Conversion: ${output.conversion.identity ? "not needed" : output.conversion.steps.join(" → ")}; ${output.conversion.rates.some(rate => rate.source === "manual") ? "manual input, not verified" : output.conversion.rates.map(rate => rate.asOf).join(", ")}`,
      "Planning estimate, not a guaranteed loss limit or broker approval.",
    ].join("\n");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text); setCopied(kind === "link" ? "Scenario link copied." : "Results copied."); setCopyFallback("");
    } catch { setCopyFallback(text); setCopied("Select and copy the text below."); }
  }
  const rateLeg = (from: string, to: string, second = false) => <div className={lot.rateLeg}><p>1 {from} = rate in {to}</p><div className={styles.fieldGrid}>{values.bidAsk === "yes" ? <>{field(second ? "crossBid" : "bid", `${from}/${to} bid`)}{field(second ? "crossAsk" : "ask", `${from}/${to} ask`)}</> : field(second ? "crossRate" : "rate", `${from}/${to} rate`)}</div></div>;

  return <div className={`${styles.workspace} ${lot.workspace}`} data-calculator="lot-size">
    <div className={lot.topline}><span>Risk budget → stop distance → trade size</span><span>Example inputs · editable assumptions</span></div>
    <a className={lot.mobileResult} href="#calculation-result"><span>Current lot size<strong>{output?.executable ? `${lots(output.lots)} lots` : output ? "No valid size" : "Check inputs"}</strong></span><span>{output?.executable ? <>Planned loss<strong>{money(output.totalRisk)}</strong></> : "View the result ↓"}</span></a>
    <div className={styles.calculatorGrid}>
      <form className={styles.inputForm} onSubmit={event => event.preventDefault()} aria-label="Lot-size inputs">
        <div className={styles.formHeading}><h3>Your trade plan</h3><button className={styles.reset} type="button" onClick={() => { setValues({ ...defaultLotScenario }); setRestoreError(null); setCopied(""); setCopyFallback(""); }}><RotateCcw size={15} aria-hidden="true" />Reset inputs</button></div>
        <p className={styles.inputNote}>Start with the loss allowance, then size the position.</p>
        <div className={styles.fieldGrid}>
          <Select name="pair" label="Currency pair" value={values.pair} onChange={value => changeCurrencies("pair", value)}>{pairCodes.map(pair => <option key={pair}>{pair}</option>)}</Select>
          <Select name="account" label="Account currency" value={values.account} onChange={value => changeCurrencies("account", value)}>{currencyOptions}</Select>
          {field("equity", `Account balance / equity (${values.account})`)}
          <Select name="riskMode" label="Risk input" value={values.riskMode} onChange={value => set("riskMode", value)}><option value="percent">Percentage of account</option><option value="cash">Fixed cash amount</option></Select>
          {values.riskMode === "cash" ? field("cashRisk", `Fixed risk amount (${values.account})`) : field("risk", "Risk percentage (%)")}
          <Select name="stopMode" label="Stop-loss input" value={values.stopMode} onChange={value => set("stopMode", value)}><option value="pips">Distance in pips</option><option value="prices">Entry and stop prices</option></Select>
          {values.stopMode === "pips" ? field("stopPips", "Stop-loss distance (pips)", `Your pip size: ${values.pipSize} ${info.quote}. Check the broker’s definition.`) : <>
            <Select name="side" label="Trade direction" value={values.side} onChange={value => set("side", value)}><option value="buy">Buy / long</option><option value="sell">Sell / short</option></Select>
            {field("entry", "Entry price", "Example prices are not market quotes.")}{field("stopPrice", "Stop-loss price")}
          </>}
        </div>
        {needsConversion && <fieldset className={styles.conversion}><legend>Convert {info.quote} loss into {values.account}</legend>
          <Select name="rateSource" label="Conversion-rate source" value={values.rateSource} onChange={value => { set("rateSource", value); if (value === "daily") setReference({ state: "loading" }); }}><option value="manual">Manual rate</option><option value="daily">Daily reference · not live</option></Select>
          {values.rateSource === "manual" ? <>
            <div className={lot.rateSettings}><Select name="rateDirection" label="Conversion route" value={values.rateDirection} onChange={value => setValues(old => ({ ...old, rateDirection: value, ...clearRates }))}><option value="direct">Direct: {info.quote}/{values.account}</option><option value="inverse">Inverse: {values.account}/{info.quote}</option><option value="cross">Cross via another currency</option></Select>
              {values.rateDirection === "cross" && <Select name="crossCurrency" label="Intermediate currency" value={values.crossCurrency} onChange={value => setValues(old => ({ ...old, crossCurrency: value, ...clearRates }))}>{accountCurrencies.filter(code => code !== info.quote && code !== values.account).map(code => <option key={code}>{code}</option>)}</Select>}
              <label className={lot.checkbox}><input type="checkbox" checked={values.bidAsk === "yes"} onChange={event => set("bidAsk", event.target.checked ? "yes" : "no")} />Enter separate bid and ask</label>
            </div>
            {values.rateDirection === "cross" ? <>{rateLeg(info.quote, values.crossCurrency)}{rateLeg(values.crossCurrency, values.account, true)}</> : values.rateDirection === "direct" ? rateLeg(info.quote, values.account) : rateLeg(values.account, info.quote)}
            <p className={lot.note}>Manual input; date and market accuracy are not verified. A single rate omits conversion spread.</p>
          </> : <><p className={lot.note}>Frankfurter daily reference rates, not broker bid/ask quotes. Unsupported currencies need manual rates.</p>{reference.state === "error" && <p className={lot.notice}>{reference.error}</p>}<button type="button" className={lot.textButton} onClick={() => { setReference({ state: "loading" }); setRefresh(value => value + 1); }}>Refresh reference rates</button></>}
        </fieldset>}
        <details className={styles.settings}><summary>Trading costs</summary><div className={lot.settingsBody}>
          <label className={lot.checkbox}><input type="checkbox" checked={values.includeCosts === "yes"} onChange={event => set("includeCosts", event.target.checked ? "yes" : "no")} />Keep estimated costs inside my risk budget</label>
          <div className={styles.fieldGrid}>{field("commission", `Round-trip commission per lot (${values.account})`, "Opening plus closing commission per lot.")}{field("fixedCosts", `Other fixed trade costs (${values.account})`, "Total for this trade; not per lot.")}</div>
          <Select name="spreadMode" label="Spread accounting" value={values.spreadMode} onChange={value => set("spreadMode", value)}><option value="included">Already included in stop distance / execution prices</option><option value="additional">Add separately to a chart-based stop distance</option></Select>
          {values.spreadMode === "additional" && field("spread", "Additional spread (pips)")}
          <p className={lot.note}>{values.spreadMode === "included" ? "No extra spread is added: your stop distance must already reflect the intended execution prices." : "Spread is added once as an extra cost. Do not also include it in the stop distance."} Slippage, gaps and unknown financing are not predicted.</p>
        </div></details>
        <details className={styles.settings}><summary>Broker contract & volume limits</summary><div className={lot.settingsBody}>
          <p className={lot.note}>Conventional FX example, not a verified broker profile. Replace these assumptions with your account’s contract specification. Valid volumes start at the minimum and rise by the increment.</p>
          <div className={styles.fieldGrid}>{field("contract", "Base-currency units per lot")}{field("pipSize", "Pip size")}{field("minimum", "Minimum volume (lots)")}{field("maximum", "Maximum volume (lots)")}{field("increment", "Lot increment")}{field("precision", "Price decimal places")}</div>
        </div></details>
        <details className={styles.settings}><summary>Optional margin check</summary><div className={lot.settingsBody}>
          <label className={lot.checkbox}><input type="checkbox" checked={values.marginEnabled === "yes"} onChange={event => set("marginEnabled", event.target.checked ? "yes" : "no")} />Check a simple leverage estimate</label>
          {values.marginEnabled === "yes" && <div className={styles.fieldGrid}>{field("leverage", "Leverage (X in 1:X)")}{field("freeMargin", `Available margin (${values.account})`)}{info.base !== values.account && field("marginPrice", `${values.pair} margin reference price`, `Quote currency per 1 ${info.base}. Enter your own price.`)}</div>}
          <p className={lot.note}>Notional ÷ leverage only. Broker tiers, hedges and margin close-out rules can differ. This check does not change the risk-based size.</p>
        </div></details>
        <a href="#calculation-result" className={styles.viewResult}>View lot size <ArrowRight size={18} aria-hidden="true" /></a>
      </form>
      <aside id="calculation-result" className={`${styles.result} ${lot.result}`} aria-label="Lot-size result">
        <p className={styles.resultEyebrow}><span />Your position size</p>
        <div role="status" aria-live="polite" aria-atomic="true">{error ? <div className={styles.validation}><h3>Check your inputs</h3><p id="lot-input-error">{error}</p><p>No usable size is shown until the required inputs are valid.</p></div> : output && <>
          <h3>{output.executable ? "Lot size within the entered limits" : "No valid lot size"}</h3>
          {output.executable ? <p className={styles.resultValue} data-result>{lots(output.lots)} <span className={lot.lotUnit}>lots</span></p> : <p className={lot.notice}>The minimum {lots(output.minimum)} lots would risk {money(output.minimumEstimate.budgetedRisk)} against your {money(output.budget)} budget{values.includeCosts === "yes" ? ", including costs" : ", before costs"}. No order size fits these assumptions.</p>}
          {output.executable && <p className={styles.resultSummary}>{quantity(output.units)} {info.base} · {cash(output.pipValue, values.account, 8)} per adverse pip</p>}
        </>}</div>
        {output && <>
          <div className={lot.budgetSummary}><div><span>Risk budget</span><strong>{money(output.budget)}</strong></div><div><span>Total planned loss</span><strong>{money(output.totalRisk)}</strong></div></div>
          <dl className={styles.metrics}>
            {[["Price-movement risk", money(output.priceRisk)], ["Estimated trading costs", money(output.costs)], ["Unused risk budget", money(output.unusedBudget)], ["Mathematical size (approx.)", `${quantity(output.theoreticalLots, 8)} lots`], ["Stop distance", `${quantity(output.stopPips)} pips`], ["Pip value per full lot", cash(output.pipValuePerLot, values.account, 8)]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          {output.cappedAtMaximum && <p className={lot.notice}>The mathematical size exceeds the entered maximum. Volume is capped at {lots(output.maximumOnGrid)} lots on the permitted grid.</p>}
          {values.includeCosts === "no" && <p className={lot.notice}>Costs are outside your risk budget. {output.totalBudgetGap.lt(0) ? `Including them exceeds it by ${money(output.totalBudgetGap.abs())}.` : "Total planned loss still includes them."}</p>}
          <details className={styles.breakdown} open><summary>How this size is calculated</summary><ol>
            <li>{output.reason === "costs-exceed-budget" ? "Fixed costs use the entire risk budget; no positive trade volume fits." : <>{values.includeCosts === "yes" && output.fixed.gt(0) ? `(${money(output.budget)} − ${money(output.fixed)} fixed costs)` : money(output.budget)} ÷ {money(values.includeCosts === "yes" ? output.priceRiskPerLot.add(output.variableCostsPerLot) : output.priceRiskPerLot)} per lot = approximately {quantity(output.theoreticalLots, 8)} lots.</>}</li>
            <li>Round down on the {values.minimum} + n × {values.increment} lot grid; apply the maximum.</li>
            <li>{output.conversion.identity ? `${info.quote} is your account currency: no conversion needed.` : `1 ${info.quote} = ${quantity(output.conversion.factor, 12)} ${values.account}. ${output.conversion.steps.join(" → ")}`}</li>
          </ol></details>
          {!output.conversion.identity && <div className={lot.rateDisclosure}>
            <strong>{values.rateSource === "manual" ? "Manual conversion" : output.conversion.stale || reference.data?.cached ? "Stale / cached daily reference" : "Dated daily reference · not live"}</strong>
            <p>{values.rateSource === "manual" ? "Your entered rate; no verified market timestamp." : `${[...new Set(output.conversion.rates.map(rate => rate.asOf?.slice(0, 10)))].join(" / ")} (UTC). Retrieved ${reference.data ? utc(reference.data.retrievedAt) : "—"}.`}</p>
            {output.conversion.stale && <p className={lot.notice}>The rate is more than four days old. Refresh or enter a current manual rate before relying on the estimate.</p>}
            {values.rateSource === "daily" && <a href="https://frankfurter.dev/" rel="noopener noreferrer">Frankfurter reference-rate methodology</a>}
          </div>}
          {values.marginEnabled === "yes" && <section className={lot.marginResult} aria-label="Optional margin estimate"><h3>Margin estimate</h3>{marginError ? <p>{marginError} Affordability has not been checked.</p> : margin && <><p>{money(margin.required)} required · {money(margin.available)} available.</p><p>{margin.affordable ? "Fits the entered free margin under this simple model." : "Exceeds your entered free margin. This risk-sized position may not be affordable."}</p></>}</section>}
          <div className={lot.actions}><button type="button" onClick={() => copy("results")}><Copy size={16} aria-hidden="true" />Copy results</button><button type="button" onClick={() => copy("link")}><Link2 size={16} aria-hidden="true" />Copy scenario link</button></div>
          <p className={lot.note}>Shared links include the entered amounts. Daily conversion rates may change between visits.</p>
          {copied && <p className={lot.copyStatus} aria-live="polite"><Check size={16} aria-hidden="true" />{copied}</p>}
          {copyFallback && <div className={lot.copyFallback}><label htmlFor="lot-copy-output">Copy text</label><textarea id="lot-copy-output" readOnly value={copyFallback} onFocus={event => event.target.select()} /></div>}
          <details className={styles.breakdown}><summary>Compare risk percentages</summary><div className={lot.settingsBody}>{field("compareRisk", "Compare with risk (%)")}{comparisonError ? <p>{comparisonError}</p> : comparison && <div className={lot.smallTable}><table><caption>Same trade, two risk choices</caption><thead><tr><th scope="col">Budget</th><th scope="col">Lots</th><th scope="col">Planned loss</th></tr></thead><tbody>{[output, comparison].map((item, i) => <tr key={i}><th scope="row">{i === 0 ? "Your plan" : `${values.compareRisk}%`}: {money(item.budget)}</th><td>{item.executable ? lots(item.lots) : "No valid size"}</td><td>{money(item.totalRisk)}</td></tr>)}</tbody></table></div>}</div></details>
          <details className={styles.breakdown}><summary>Volume versus risk</summary><div className={lot.smallTable}><table><caption>Valid volumes near your result</caption><thead><tr><th scope="col">Lots</th><th scope="col">Planned loss</th><th scope="col">Total vs budget</th></tr></thead><tbody>{output.scenarios.map(item => <tr key={item.lots.toString()}><th scope="row">{lots(item.lots)}</th><td>{money(item.totalRisk)}</td><td>{item.totalRisk.lte(output.budget) ? "Within" : "Above"}</td></tr>)}</tbody></table></div></details>
        </>}
        <p className={styles.estimate}>Planning estimate, not personal advice or broker approval. Stops can slip; gaps, financing and other costs can make losses larger. Check margin, open exposure and current contract terms.</p>
      </aside>
    </div>
    <noscript><p className={styles.noScript}>Enable JavaScript to restore shared scenarios or change inputs. The values shown are the default example. Formulas and risk explanations remain readable below.</p></noscript>
  </div>;
}
