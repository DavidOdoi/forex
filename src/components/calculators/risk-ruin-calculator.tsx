"use client";
import {useEffect,useMemo,useState,useSyncExternalStore} from "react";
import {ArrowRight,Copy,Link2,RotateCcw} from "lucide-react";
import {accountCurrencies,isAccountCurrency} from "@/lib/calculators/instruments";
import {defaultRuinValues,parseRuin,type RuinResult} from "@/lib/calculators/risk-ruin";
import {restoreTradeScenario,serializeTradeScenario} from "@/lib/calculators/trade-scenario";
import {cash,quantity} from "@/lib/calculators/precision";
import styles from "./calculator.module.css";
import shared from "./lot-size.module.css";
const path="/calculators/forex-risk-of-ruin-calculator";
const subscribe=(callback:()=>void)=>{window.addEventListener("popstate",callback);return()=>window.removeEventListener("popstate",callback);};
const browserSearch=()=>window.location.search;
type Simulation={key:string;result?:RuinResult;error?:string;sensitivity?:{label:string;frequency:number}[]};
export function RiskRuinCalculator(){const search=useSyncExternalStore(subscribe,browserSearch,()=>"");return <RuinForm key={search} search={search}/>;}
function RuinForm({search}:{search:string}){
 const restored=restoreTradeScenario(search,defaultRuinValues);
 const [values,setValues]=useState(restored.values);
 const [simulation,setSimulation]=useState<Simulation>({key:""});
 const [copyStatus,setCopyStatus]=useState("");const[fallback,setFallback]=useState("");
 const key=JSON.stringify(values);
 const parsed=useMemo(()=>{try{if(restored.error)throw new Error(restored.error);if(!isAccountCurrency(values.currency))throw new Error("Choose a supported display currency.");return{input:parseRuin(values),error:null};}catch(error){return{input:null,error:error instanceof Error?error.message:"Check the inputs."};}},[values,restored.error]);
 useEffect(()=>{
  if(!parsed.input)return;
  let worker:Worker|undefined;let active=true;
  const timer=setTimeout(()=>{
   try{worker=new Worker(new URL("../../lib/calculators/risk-ruin.worker.ts",import.meta.url),{type:"module"});worker.onmessage=(event:MessageEvent<Simulation>)=>{if(active)setSimulation(event.data);worker?.terminate();};worker.onerror=event=>{event.preventDefault();if(active)setSimulation({key,error:"The background simulation could not run. Check browser worker support and reload."});worker?.terminate();};worker.postMessage({input:parsed.input,key});}
   catch{if(active)setSimulation({key,error:"The browser could not start the simulation worker. Reload in a browser with Web Worker support."});}
  },200);
  return()=>{active=false;clearTimeout(timer);worker?.terminate();};
 },[parsed,key]);
 const result=simulation.key===key&&!parsed.error?simulation.result:undefined;
 const error=parsed.error||(simulation.key===key?simulation.error:null);
 const pending=!result&&!error;
 const money=(value:number)=>Math.abs(value)>=1e18?`${values.currency} ${value.toExponential(3)}`:cash(value,values.currency);
 const pct=(value:number)=>`${quantity(value*100,4)}%`;
 const set=(name:string,value:string)=>{setValues(old=>({...old,[name]:value}));setCopyStatus("");setFallback("");};
 const field=(name:string,label:string,help?:string)=><div className={styles.field}><label htmlFor={`ruin-${name}`}>{label}</label><input id={`ruin-${name}`} value={values[name]} maxLength={64} inputMode="decimal" onChange={e=>set(name,e.target.value)} aria-describedby={help?`ruin-${name}-help`:undefined}/>{help&&<small id={`ruin-${name}-help`}>{help}</small>}</div>;
 const reset=()=>{window.history.replaceState(null,"",path);window.dispatchEvent(new PopStateEvent("popstate"));setValues({...defaultRuinValues});setCopyStatus("");setFallback("");};
 const copy=async(link:boolean)=>{if(!result)return;const text=link?`${window.location.origin}${path}?${serializeTradeScenario(values)}`:["Observed threshold-hit simulation frequency",pct(result.frequency),`${result.hits} / ${result.paths} paths; horizon ${result.input.trades} trades; seed ${result.input.seed}`,`95% Wilson model sampling interval: ${pct(result.interval.low)}–${pct(result.interval.high)}`,`Threshold: ${values.threshold}% ${values.thresholdMode}; sizing ${values.risk} ${values.mode}; extra cost ${values.cost} ${values.currency}`,"Independent binary outcomes with fixed assumptions; not a known probability of real-world bankruptcy."].join("\n");try{await navigator.clipboard.writeText(text);setCopyStatus(link?"Scenario link copied.":"Results copied.");}catch{setFallback(text);setCopyStatus("Select and copy the text below.");}};
 const max=result?Math.max(result.input.capital,...result.samples.flatMap(sample=>sample.map(point=>point.equity))):1;
 return <div className={`${styles.workspace} ${shared.workspace}`} data-risk-ruin>
  <div className={shared.topline}><span>Reproducible strategy-risk model</span><span>Seeded simulation · independent binary outcomes</span></div>
  <a className={shared.mobileResult} href="#calculation-result"><span><strong>{result?pct(result.frequency):error?"Check inputs":"Calculating…"}</strong>Observed threshold-hit frequency</span><span>View result <ArrowRight size={18}/></span></a>
  <div className={styles.calculatorGrid}><form className={styles.inputForm} onSubmit={e=>e.preventDefault()} aria-label="Risk of ruin simulation inputs">
   <div className={styles.formHeading}><h3>Define the model</h3><button className={styles.reset} type="button" onClick={reset}><RotateCcw size={15}/>Reset</button></div>
   <p className={styles.inputNote}>Starting assumptions are illustrations, not measured strategy performance. Each path stops when it first hits the selected threshold or completes the horizon.</p>
   <div className={styles.fieldGrid}>
    <div className={styles.field}><label htmlFor="ruin-currency">Display currency</label><select id="ruin-currency" value={values.currency} onChange={e=>set("currency",e.target.value)}>{accountCurrencies.map(code=><option key={code}>{code}</option>)}</select></div>
    {field("capital","Starting equity")}{field("probability","Assumed win probability (%)")}{field("payoff","Average winner / average loss","Binary payoff multiple before any separately entered cost.")}
    <div className={styles.field}><label htmlFor="ruin-mode">Position-sizing model</label><select id="ruin-mode" value={values.mode} onChange={e=>set("mode",e.target.value)}><option value="percent">Percentage of current equity</option><option value="fixed">Fixed currency amount</option></select></div>
    {field("risk",values.mode==="percent"?"Risk per trade (% of current equity)":"Risk per trade (fixed currency amount)","The model caps the stake at remaining equity and floors equity at zero; real leveraged losses can differ.")}
    {field("cost","Extra cost per completed trade","In display currency. Use zero if the payoff inputs already include costs.")}
    <div className={styles.field}><label htmlFor="ruin-thresholdMode">Threshold reference</label><select id="ruin-thresholdMode" value={values.thresholdMode} onChange={e=>set("thresholdMode",e.target.value)}><option value="initial">Loss from starting equity</option><option value="peak">Drawdown from each path’s running peak</option></select></div>
    {field("threshold","Threshold loss / drawdown (%)")}{field("trades","Trade horizon")}{field("paths","Simulated paths","100–50,000 paths, 1–2,000 trades; at most 5 million steps per scenario.")}{field("seed","Simulation seed","Whole number 0–4,294,967,295. Identical settings reproduce the same run.")}
   </div><a className={styles.viewResult} href="#calculation-result">View simulation result <ArrowRight size={18}/></a>
  </form><aside id="calculation-result" className={`${styles.result} ${shared.result}`} aria-label="Risk of ruin simulation results" aria-busy={pending}>
   <p className={styles.resultEyebrow}>Simulated threshold frequency · not a forecast</p>
   <div role="status" aria-live="polite" aria-atomic="true">{error?<div className={styles.validation}><h3>Check your inputs</h3><p>{error}</p></div>:result?<><h3>Observed threshold hits in this run</h3><p className={styles.resultValue} data-result>{pct(result.frequency)}</p><p className={styles.resultSummary}>{result.hits.toLocaleString("en")} of {result.paths.toLocaleString("en")} paths · {result.input.trades} trades · seed {result.input.seed}</p></>:<><h3>Preparing the simulation</h3><p>The calculation runs in a background worker after valid inputs are entered.</p></>}</div>
   {result&&<>
    <dl className={styles.metrics}><div><dt>Threshold reference</dt><dd>{values.threshold}% {values.thresholdMode==="peak"?"from running peak":"from starting equity"}</dd></div><div><dt>{values.thresholdMode==="peak"?"Initial peak-based barrier":"Fixed equity barrier"}</dt><dd>{money(result.initialBarrier)}</dd></div><div><dt>95% model sampling interval</dt><dd>{pct(result.interval.low)}–{pct(result.interval.high)}</dd></div><div><dt>Worst observed drawdown before stopping</dt><dd>{pct(result.worstDrawdown)}</dd></div></dl>
    <figure className={shared.simulationChart}><svg viewBox="0 0 640 240" role="img" aria-label="Twelve example simulated equity paths, stopped at the threshold or trade horizon"><line x1="66" y1="12" x2="66" y2="204" stroke="#888"/><line x1="66" y1="204" x2="630" y2="204" stroke="#888"/>{result.input.thresholdMode==="initial"&&<line x1="66" y1={204-result.initialBarrier/max*180} x2="630" y2={204-result.initialBarrier/max*180} stroke="#a56e12" strokeDasharray="6 4"/>}{result.samples.map((sample,i)=><polyline key={i} fill="none" stroke={i%3===0?"#000":i%3===1?"#777":"#a56e12"} strokeWidth="1.5" strokeDasharray={i%2?"5 3":undefined} points={sample.map(point=>`${66+point.trade/result.input.trades*564},${204-point.equity/max*180}`).join(" ")}/>)}<text x="4" y="24" fontSize="12">{max>=1e7?max.toExponential(1):quantity(max,0)}</text><text x="40" y="207" fontSize="12">0</text><text x="66" y="228" fontSize="12">Trade 0</text><text x="560" y="228" fontSize="12">{result.input.trades} trades</text></svg><figcaption>12 example paths, not the entire sample. Paths stop at their first threshold hit. {values.thresholdMode==="initial"?"Dashed gold line: fixed equity barrier.":"Each path’s drawdown barrier moves with its own peak."}</figcaption></figure>
    <div className={shared.smallTable} role="region" aria-label="Stopped or horizon balance distribution" tabIndex={0}><table><caption>Balance at threshold stop or horizon · all paths</caption><thead><tr><th scope="col">10th percentile</th><th scope="col">Median</th><th scope="col">90th percentile</th></tr></thead><tbody><tr><td>{money(result.percentiles.p10)}</td><td>{money(result.percentiles.median)}</td><td>{money(result.percentiles.p90)}</td></tr></tbody></table></div>
    <div className={shared.smallTable} role="region" aria-label="Model sensitivity comparisons" tabIndex={0}><table><caption>Sensitivity · same paths, horizon and seed</caption><thead><tr><th scope="col">Changed assumption</th><th scope="col">Observed hits</th></tr></thead><tbody>{simulation.sensitivity?.map(row=><tr key={row.label}><th scope="row">{row.label}</th><td>{pct(row.frequency)}</td></tr>)}</tbody></table></div>
    <p className={shared.notice}>{result.hits===0?"No paths hit the threshold in this run. This is 0% observed frequency, not proof of zero true risk.":"This is an empirical frequency under the stated model, not a known chance of actual financial bankruptcy."} The Wilson interval describes simulation sampling uncertainty only.</p>
    <p className={shared.notice}>Independent trades, constant win probability and fixed payoffs are simplifying assumptions. The model excludes loss clustering, regime changes, intratrade drawdowns, unentered gaps and broker liquidation rules. It uses floating-point arithmetic and rejects numerical overflow or underflow.</p>
    <p className={shared.note}>Three scenarios run: your inputs, five percentage points lower win probability, and half risk per trade. Each uses the displayed path count and seed. Results are rounded for display.</p>
    <div className={shared.actions}><button type="button" onClick={()=>copy(false)}><Copy size={16}/>Copy results</button><button type="button" onClick={()=>copy(true)}><Link2 size={16}/>Copy scenario link</button></div>
    {copyStatus&&<p role="status">{copyStatus}</p>}{fallback&&<div className={styles.field}><label htmlFor="ruin-copy">Copy text</label><textarea id="ruin-copy" value={fallback} readOnly onFocus={e=>e.target.select()}/></div>}
   </>}
   <p className={styles.estimate}>Educational scenario analysis, not a recommended risk level. Leveraged trading can cause substantial losses.</p>
  </aside></div><noscript><p className={styles.noScript}>Enable JavaScript and Web Workers to run the simulation. The assumptions, formulas, worked examples and limitations remain readable below.</p></noscript>
 </div>;
}
