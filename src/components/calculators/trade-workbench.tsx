"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowRight, Copy, Link2, RotateCcw } from "lucide-react";
import { accountCurrencies, conventionalInstrument, isPair } from "@/lib/calculators/instruments";
import { pairCodes } from "@/lib/calculators/forex";
import { workbenchDefaults, workbenchPaths, workbenchResult, type WorkbenchKind } from "@/lib/calculators/workbench";
import { restoreTradeScenario, serializeTradeScenario, transferTradeQuery, type TradeScenario } from "@/lib/calculators/trade-scenario";
import type { RateSnapshot } from "@/lib/calculators/exchange-rates";
import styles from "./calculator.module.css";
import shared from "./lot-size.module.css";

const subscribe = (callback: () => void) => { window.addEventListener("popstate", callback); return () => window.removeEventListener("popstate", callback); };
const browserSearch = () => window.location.search;
const serverSearch = () => "";
const clearRates = { rate: "", bid: "", ask: "", crossRate: "", crossBid: "", crossAsk: "" };

export function TradeWorkbench({ kind }: { kind: WorkbenchKind }) {
  const search = useSyncExternalStore(subscribe, browserSearch, serverSearch);
  return <WorkbenchForm key={`${kind}-${search}`} kind={kind} search={search} />;
}

function WorkbenchForm({ kind, search }: { kind: WorkbenchKind; search: string }) {
  const restored = restoreTradeScenario(search, workbenchDefaults[kind]);
  const [values, setValues] = useState<TradeScenario>(() => restored.values);
  const [restoreError, setRestoreError] = useState(restored.error);
  const [reference, setReference] = useState<{ state: "idle" | "loading" | "ready" | "error"; data?: RateSnapshot; error?: string }>({ state: "idle" });
  const [refresh, setRefresh] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const [copyFallback, setCopyFallback] = useState("");
  const spec = conventionalInstrument(isPair(values.pair) ? values.pair : "EUR/USD");
  const from = kind === "margin" && spec.base === values.account ? spec.base : spec.quote;
  const labels = { pip: { workspace: "Forex pip-value workspace", result: "Per pip at this volume", note: "Change volume, currency or pip convention to see the effect. No broker account or live quote is required.", button: "View pip value", eyebrow: "Pip value and movement" }, margin: { workspace: "Forex margin workspace", result: "Estimated required margin", note: "Estimate collateral from volume, leverage and conversion assumptions. Add your equity and existing used margin to check the account effect.", button: "View margin estimate", eyebrow: "Collateral and available equity" }, profit: { workspace: "Forex profit and loss workspace", result: "Estimated net profit / loss", note: "Compare entry and exit prices, direction and volume. Add only costs that are not already included in those fills. All starting values are editable examples.", button: "View net profit or loss", eyebrow: "Gross result, costs and net P&L" }, risk: { workspace: "Forex risk–reward workspace", result: "Net risk : potential reward", note: "Compare planned loss and potential gain. Enter executable price assumptions, extra costs and an optional win-rate assumption. The ratio cannot predict which exit will be reached.", button: "View risk and reward", eyebrow: "Planned risk, potential reward and costs" }, breakeven: { workspace: "Forex break-even workspace", result: "Estimated break-even closing price", note: "Find the executable exit needed to recover entered costs. Use actual entry fills or clearly modeled mid prices; combine same-direction entries with volume-weighted pricing.", button: "View break-even price", eyebrow: "Closing price, costs and rounding" } }[kind];
  const needsConversion = from !== values.account;
  const update = (patch: TradeScenario) => { setValues(old => ({ ...old, ...patch })); setCopyStatus(""); setCopyFallback(""); };
  const set = (name: string, value: string) => update({ [name]: value });
  const crossFor = (quote: string, account: string) => values.crossCurrency !== quote && values.crossCurrency !== account ? values.crossCurrency : accountCurrencies.find(code => code !== quote && code !== account)!;
  useEffect(() => {
    if (values.rateSource !== "daily" || !needsConversion) return;
    const controller = new AbortController();
    void fetch("/api/forex-rates", { signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.rates) || !data.rates.length) throw new Error(data.error ?? "Daily rates are unavailable. Enter a manual rate.");
      if (!controller.signal.aborted) setReference({ state: "ready", data });
    }).catch(error => { if (!controller.signal.aborted) setReference(old => ({ state: "error", data: old.data, error: String(error.message) })); });
    return () => controller.abort();
  }, [values.rateSource, needsConversion, refresh]);

  let result: ReturnType<typeof workbenchResult> | null = null;
  let error = restoreError;
  try {
    if (!error) result = workbenchResult(kind, values, reference.data?.rates ?? []);
  } catch (caught) { error = values.rateSource === "daily" && needsConversion && !reference.data && reference.state !== "error" ? "Load the daily reference rates or enter a manual conversion quote." : caught instanceof Error ? caught.message : "Check the entered values."; }
  const transferValues = result?.transfer ?? values;

  const field = (name: string, label: string, help?: string) => <div className={styles.field}>
    <label htmlFor={`trade-${name}`}>{label}</label><input id={`trade-${name}`} type="text" inputMode="decimal" value={values[name]} maxLength={65} onChange={e => set(name, e.target.value)} aria-describedby={help ? `trade-${name}-help` : undefined} />
    {help && <small id={`trade-${name}-help`}>{help}</small>}
  </div>;
  const select = (name: string, label: string, options: ReactNode, change?: (v: string) => void) => <div className={styles.field}><label htmlFor={`trade-${name}`}>{label}</label><select id={`trade-${name}`} value={values[name]} onChange={e => change ? change(e.target.value) : set(name, e.target.value)}>{options}</select></div>;
  const currencies = accountCurrencies.map(code => <option key={code}>{code}</option>);
  const rateLeg = (base: string, quote: string, second = false) => <div className={shared.rateLeg}><p>1 {base} is quoted in {quote}.</p><div className={styles.fieldGrid}>{values.bidAsk === "yes" ? <>{field(second ? "crossBid" : "bid", `${base}/${quote} bid`)}{field(second ? "crossAsk" : "ask", `${base}/${quote} ask`)}</> : field(second ? "crossRate" : "rate", `${base}/${quote} conversion rate`)}</div></div>;
  const reset = () => { setValues({ ...workbenchDefaults[kind] }); setRestoreError(null); setCopyStatus(""); setCopyFallback(""); window.history.replaceState(null, "", workbenchPaths[kind]); window.dispatchEvent(new PopStateEvent("popstate")); };
  const copy = async (link: boolean) => {
    if (!result) return;
    const text = link ? `${window.location.origin}${workbenchPaths[kind]}?${serializeTradeScenario(values)}` : [result.title, result.value, result.summary, ...result.metrics.map(row => row.join(": ")), ...result.tables.flatMap(table => [table.title, ...table.rows.map(row => row.join(": "))]), ...result.steps, ...result.warnings, `Source: ${values.rateSource === "daily" ? `Dated reference: ${result.conversion.rates.map(rate => rate.asOf).join(" / ")}` : "manual inputs / convention; not live prices"}`].join("\n");
    try { await navigator.clipboard.writeText(text); setCopyStatus(link ? "Scenario link copied." : "Results copied."); } catch { setCopyFallback(text); setCopyStatus("Select and copy the text below."); }
  };

  return <div className={`${styles.workspace} ${shared.workspace}`} data-trade-workbench={kind}>
    <div className={shared.topline}><span>{labels.workspace}</span><span>Conventional FX examples · editable assumptions</span></div>
    <a href="#calculation-result" className={shared.mobileResult}><span><strong>{result?.value ?? "Check inputs"}</strong>{labels.result}</span><span>View result <ArrowRight size={18} aria-hidden="true" /></span></a>
    <div className={styles.calculatorGrid}>
      <form className={styles.inputForm} onSubmit={event => event.preventDefault()} aria-label={`Forex ${kind} calculator inputs`}>
        <div className={styles.formHeading}><h3>Your trade assumptions</h3><button type="button" className={styles.reset} onClick={reset}><RotateCcw size={15} aria-hidden="true" />Reset</button></div>
        <p className={styles.inputNote}>{labels.note}</p>
        {restoreError && <p className={shared.notice}>{restoreError}</p>}
        <div className={styles.fieldGrid}>
          {select("pair", "Currency pair", pairCodes.map(code => <option key={code}>{code}</option>), pair => { if (isPair(pair)) { const next = conventionalInstrument(pair); update({ pair, contract: next.contractSize, pipSize: next.pipSize, precision: String(next.pricePrecision), crossCurrency: crossFor(next.quote, values.account), ...(kind === "margin" ? { price: "" } : ["profit", "risk", "breakeven"].includes(kind) ? { entry: "", exit: "", stop: "", target: "" } : {}), ...clearRates }); } })}
          {select("account", "Account currency", currencies, account => update({ account, crossCurrency: crossFor(kind === "margin" && spec.base === account ? spec.base : spec.quote, account), ...clearRates }))}
          {select("volumeMode", "Trade-size input", <><option value="lots">Configured lots</option><option value="units">Base-currency units</option></>)}
          {!(kind === "breakeven" && values.entriesEnabled === "yes") && field("volume", values.volumeMode === "units" ? `Trade size (${spec.base} units)` : "Trade size (lots)")}
          {kind === "pip" ? field("pips", "Number of pips to value", "Magnitude of a move, not a net profit estimate.") : kind === "margin" ? <>
            {select("marginMode", "Margin requirement input", <><option value="leverage">Leverage ratio</option><option value="percent">Margin percentage</option></>)}
            {values.marginMode === "leverage" ? field("leverage", "Leverage (X in 1:X)", "50 means 1:50. Use the leverage permitted for your actual account.") : field("marginPercent", "Margin requirement (%)", "2 means 2% of notional, equivalent to 1:50.")}
            {spec.base !== values.account && field("price", `${values.pair} notional reference price`, `Enter ${spec.quote} per 1 ${spec.base}. The starting price is an editable example, not a market quote.`)}
          </> : kind === "breakeven" ? <>
            {select("direction", "Trade direction", <><option value="buy">Buy / long</option><option value="sell">Sell / short</option></>)}
            {select("priceMode", "Entry price convention", <><option value="fills">Executable entry fill</option><option value="mid">Mid price · model symmetric spread</option></>)}
            {values.entriesEnabled !== "yes" && field("entry", "Entry price", "Buy: opening ask. Sell: opening bid. Mid mode uses the entered midpoint instead.")}
          </> : kind === "risk" ? <>
            {select("direction", "Trade direction", <><option value="buy">Buy / long</option><option value="sell">Sell / short</option></>)}
            {field("entry", "Entry price", "Executable-price assumption, not a live quote.")}
            {field("stop", "Stop-loss price")}{field("target", "Take-profit target price")}
            {field("commission", `Additional round-trip costs (${values.account})`, "Total for this whole position, applied to both outcomes. Do not add spread already embedded in the prices.")}
            {field("probability", "Assumed win rate (%) · optional", "Your own assumption from suitable evidence; never inferred from the ratio.")}
          </> : <>
            {select("direction", "Trade direction", <><option value="buy">Buy / long</option><option value="sell">Sell / short</option></>)}
            {select("priceMode", "Entry and exit price convention", <><option value="fills">Executable fills · spread already included</option><option value="mid">Mid prices · add total spread allowance</option></>)}
            {field("entry", "Entry price", values.priceMode === "fills" ? `Buy opens at ask; sell opens at bid. ${spec.quote} per ${spec.base}.` : "Illustrative mid-market entry, not a fill.")}
            {field("exit", "Exit price", values.priceMode === "fills" ? "Buy closes at bid; sell closes at ask." : "Illustrative mid-market exit, not a fill.")}
          </>}
        </div>
        {kind === "breakeven" && <>
          <details className={styles.settings} open><summary>Multiple entries · same pair and direction</summary><div className={shared.settingsBody}>
            <label className={shared.checkbox}><input type="checkbox" checked={values.entriesEnabled === "yes"} onChange={e => set("entriesEnabled", e.target.checked ? "yes" : "no")} />Use a weighted entry basket</label>
            {values.entriesEnabled === "yes" && <div className={styles.field}><label htmlFor="trade-entries">Entry rows: volume,price</label><textarea id="trade-entries" rows={5} value={values.entries} maxLength={4096} onChange={e => set("entries", e.target.value)} aria-describedby="trade-entries-help" /><small id="trade-entries-help">One volume,price per line, using the selected lots/units mode. Up to 20 entries; no thousands separators. Costs below apply to the whole basket.</small></div>}
          </div></details>
          <details className={styles.settings} open><summary>Combined charges and accrued financing</summary><div className={shared.settingsBody}><div className={styles.fieldGrid}>
            {select("costCurrency", "Cost currency", <><option value="account">Account currency · {values.account}</option><option value="quote">Quote currency · {spec.quote}</option></>)}
            {field("commission", "Combined commission", "Whole basket, including any opening and closing commission being recovered.")}
            {field("exitCosts", "Additional anticipated exit costs", "Exclude closing commission already counted above.")}
            {field("swap", "Signed accrued swap", "Positive credit; negative charge. Future rollover is not predicted.")}
            {values.priceMode === "mid" && field("spreadPips", "Modeled spread (pips)", "Constant symmetric full bid/ask spread at entry and exit.")}
          </div></div></details>
        </>}
        {kind === "risk" && <details className={styles.settings}><summary>Compare two alternative targets</summary><div className={shared.settingsBody}><p className={shared.note}>Each target assumes the entire position exits there. This is not a partial-exit plan.</p><div className={styles.fieldGrid}>{field("target2", "Alternative target 2 · optional")}{field("target3", "Alternative target 3 · optional")}</div></div></details>}
        {kind === "profit" && <>
          <details className={styles.settings} open><summary>Costs and reference equity</summary><div className={shared.settingsBody}>
            <p className={shared.note}>Enter zero for unused costs. Commission and swap share the selected charging currency. A positive swap is a credit; a negative swap is a charge.</p>
            <div className={styles.fieldGrid}>
              {select("costCurrency", "Commission and swap currency", <><option value="account">Account currency · {values.account}</option><option value="quote">Pair quote currency · {spec.quote}</option></>)}
              {select("commissionBasis", "Commission charging basis", <><option value="total">Total round-trip charge for this position</option><option value="lot-roundtrip">Per configured lot · round trip</option><option value="lot-side">Per configured lot · each side</option></>)}
              {field("commission", `Commission (${values.costCurrency === "quote" ? spec.quote : values.account})`)}
              {field("swap", `Signed swap adjustment (${values.costCurrency === "quote" ? spec.quote : values.account})`)}
              {values.priceMode === "mid" && field("spreadPips", "Total extra spread allowance (pips)", "One additional whole-trade allowance, not a charge per side.")}
              {field("slippagePips", "Additional slippage allowance (pips)", "Use zero when entry and exit already reflect actual slippage.")}
              {field("equity", `Reference account equity (${values.account}) · optional`, "Positive equity before this trade; used only for percentage return.")}
            </div>
          </div></details>
          <details className={styles.settings}><summary>Optional stop and target exit scenarios</summary><div className={shared.settingsBody}><p className={shared.note}>These are hypothetical exits, not validated orders. They use the same entered conversion and costs, not a forecast of future rates.</p><div className={styles.fieldGrid}>{field("stop", "Stop-scenario exit price · optional")}{field("target", "Target-scenario exit price · optional")}</div></div></details>
        </>}
        {needsConversion && <fieldset className={styles.conversion}><legend>Convert {from} amounts to {values.account}</legend>
          {select("rateSource", "Conversion-rate source", <><option value="manual">Manual rate</option><option value="daily">Daily reference · not live</option></>, value => { set("rateSource", value); if (value === "daily") setReference(old => ({ ...old, state: "loading" })); })}
          {values.rateSource === "manual" ? <>
            <div className={shared.rateSettings}>{select("rateDirection", "Conversion route", <><option value="direct">Direct: {from}/{values.account}</option><option value="inverse">Inverse: {values.account}/{from}</option><option value="cross">Cross via another currency</option></>, rateDirection => update({ rateDirection, crossCurrency: crossFor(from, values.account), ...clearRates }))}
              {values.rateDirection === "cross" && select("crossCurrency", "Intermediate currency", accountCurrencies.filter(code => code !== from && code !== values.account).map(code => <option key={code}>{code}</option>), crossCurrency => update({ crossCurrency, ...clearRates }))}
              <label className={shared.checkbox}><input type="checkbox" checked={values.bidAsk === "yes"} onChange={e => set("bidAsk", e.target.checked ? "yes" : "no")} />Enter bid and ask</label>
            </div>
            {values.rateDirection === "cross" ? <>{rateLeg(from, values.crossCurrency)}{rateLeg(values.crossCurrency, values.account, true)}</> : values.rateDirection === "direct" ? rateLeg(from, values.account) : rateLeg(values.account, from)}
            <p className={shared.note}>Your rate is not verified or timestamped. {kind === "pip" ? "Bid/ask inputs use a midpoint for this neutral exposure estimate." : kind === "margin" ? "Bid/ask inputs use a conservative funding conversion: direct ask or inverse 1/bid. Broker margin conversion can differ." : "Gains use direct bid or inverse 1/ask; losses use direct ask or inverse 1/bid. Separate costs use their corresponding credit/debit side."}</p>
          </> : <><p className={shared.note}>Frankfurter daily reference rates, not live prices or broker bid/ask quotes. Unsupported currencies require manual input.</p>{reference.state === "error" && <p className={shared.notice}>{reference.error}{reference.data ? " Using the previously loaded dated snapshot." : ""}</p>}<button type="button" className={shared.textButton} onClick={() => { setReference(old => ({ ...old, state: "loading" })); setRefresh(v => v + 1); }}>Refresh reference rates</button></>}
        </fieldset>}
        {kind === "pip" && <details className={styles.settings}><summary>Calculate a move between two prices</summary><div className={shared.settingsBody}>
          <label className={shared.checkbox}><input type="checkbox" checked={values.movementEnabled === "yes"} onChange={e => set("movementEnabled", e.target.checked ? "yes" : "no")} />Show signed price movement in pips</label>
          {values.movementEnabled === "yes" && <div className={styles.fieldGrid}>{field("start", "Start price", "Editable example, not a market quote.")}{field("end", "End price")}</div>}
        </div></details>}
        {kind === "margin" && <details className={styles.settings} open><summary>Account equity and existing margin</summary><div className={shared.settingsBody}>
          <label className={shared.checkbox}><input type="checkbox" checked={values.snapshotEnabled === "yes"} onChange={e => set("snapshotEnabled", e.target.checked ? "yes" : "no")} />Estimate free margin and margin level</label>
          {values.snapshotEnabled === "yes" && <div className={styles.fieldGrid}>{field("equity", `Account equity (${values.account})`, "Equity includes current floating P&L; it is not necessarily your balance.")}{field("usedMargin", `Existing used margin (${values.account})`, "Before this proposed position.")}</div>}
        </div></details>}
        <details className={styles.settings}><summary>{kind === "margin" ? "Contract and price assumptions" : "Contract and pip assumptions"}</summary><div className={shared.settingsBody}>
          <p className={shared.note}>No broker profile is verified here. The defaults are conventional forex examples; use your broker’s actual specification. {kind === "margin" ? "This uses one flat margin requirement; broker tiers, hedges and netting can change the result." : "A pip and its smallest quoted point can differ."}</p>
          <div className={styles.fieldGrid}>{field("contract", "Base units per configured lot")}{kind !== "margin" && field("pipSize", "Pip size")}{field("precision", "Price decimal places")}</div>
        </div></details>
        <a className={styles.viewResult} href="#calculation-result">{labels.button} <ArrowRight size={18} aria-hidden="true" /></a>
      </form>
      <aside id="calculation-result" className={`${styles.result} ${shared.result}`} aria-label={`${kind} calculator results`}>
        <p className={styles.resultEyebrow}><span />{labels.eyebrow}</p>
        <div role="status" aria-live="polite" aria-atomic="true">{error ? <div className={styles.validation}><h3>Check your inputs</h3><p>{error}</p><p>No estimate is shown until the required inputs are valid.</p></div> : result && <><h3>{result.title}</h3><p className={styles.resultValue} data-result>{result.value}</p><p className={styles.resultSummary}>{result.summary}</p></>}</div>
        {result && <>
          <dl className={styles.metrics}>{result.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          {result.marginVisual && <figure className={shared.allocation} aria-label="Estimated margin allocation" data-margin-allocation>
            <div className={shared.allocationTrack} role="img" aria-label={`${result.marginVisual.used} used margin; ${result.marginVisual.available} free margin`}><span style={{ width: `${result.marginVisual.usedPercent}%` }} /></div>
            <figcaption>{result.marginVisual.used} used · {result.marginVisual.available} free{result.marginVisual.deficit ? " · margin deficit" : ""}</figcaption>
          </figure>}
          {result.tables.map(table => <div className={shared.smallTable} key={table.title} role="region" aria-label={table.title} tabIndex={0}><table><caption>{table.title}</caption><thead><tr>{table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>)}
          <details className={styles.breakdown} open><summary>Calculation breakdown</summary><ol>{result.steps.map(step => <li key={step}>{step}</li>)}</ol></details>
          {!result.conversion.identity && <div className={shared.rateDisclosure}><strong>{values.rateSource === "manual" ? "Manual conversion · not live" : result.conversion.stale || reference.data?.cached || reference.state === "error" ? "Stale / cached daily reference" : "Dated daily reference · not live"}</strong><p>{values.rateSource === "manual" ? "No verified market timestamp." : `${[...new Set(result.conversion.rates.map(rate => rate.asOf?.slice(0, 10)))].join(" / ")} UTC. Retrieved ${reference.data?.retrievedAt.replace("T", " ")} UTC.`}</p>{result.conversion.stale && <p className={shared.notice}>The rate is more than four days old. Refresh or enter a suitable manual rate.</p>}{values.rateSource === "daily" && <a href="https://frankfurter.dev/" rel="noopener noreferrer">Frankfurter reference-rate source</a>}</div>}
          {result.warnings.map(note => <p className={shared.notice} key={note}>{note}</p>)}
          <div className={shared.actions}><button type="button" onClick={() => copy(false)}><Copy size={16} aria-hidden="true" />Copy results</button><button type="button" onClick={() => copy(true)}><Link2 size={16} aria-hidden="true" />Copy scenario link</button></div>
          <nav className={shared.connected} aria-label="Continue with these trade inputs">
            <a href={`/calculators/forex-lot-size-calculator?${transferTradeQuery(transferValues, "lot")}`}>Reuse pair and account inputs in lot sizing <ArrowRight size={17} aria-hidden="true" /></a>
            <a href={`${kind === "pip" ? workbenchPaths.margin : workbenchPaths.pip}?${transferTradeQuery(transferValues, kind === "pip" ? "margin" : "pip")}`}>{kind === "pip" ? "Use this volume in the margin calculator" : "Check this volume’s pip value"}<ArrowRight size={17} aria-hidden="true" /></a>
            {kind !== "profit" && <a href={`${workbenchPaths.profit}?${transferTradeQuery(transferValues, "profit")}`}>Estimate this volume’s profit and loss <ArrowRight size={17} aria-hidden="true" /></a>}
            {kind === "profit" && <a href={`${workbenchPaths.margin}?${transferTradeQuery(transferValues, "margin")}`}>Check margin for this position <ArrowRight size={17} aria-hidden="true" /></a>}
          </nav>
          {copyStatus && <p className={shared.copyStatus} role="status">{copyStatus}</p>}
          {copyFallback && <div className={shared.copyFallback}><label htmlFor="trade-copy-output">Copy text</label><textarea id="trade-copy-output" readOnly value={copyFallback} onFocus={e => e.target.select()} /></div>}
          <p className={shared.note}>Shared URLs include entered values. Reference rates may change between visits.</p>
        </>}
        <p className={styles.estimate}>Educational estimate, not personal advice or an executable broker quote. Leveraged trading can cause substantial losses.</p>
      </aside>
    </div>
    <noscript><p className={styles.noScript}>Enable JavaScript to edit or restore a scenario. The displayed result is the default example; formulas and examples remain readable below.</p></noscript>
  </div>;
}
