"use client";
import{useState,useSyncExternalStore}from"react";
import{ArrowRight,Copy,Link2,RotateCcw}from"lucide-react";
import{analysisDefinitions,analysisFields,analysisResult,type AnalysisKind}from"@/lib/calculators/analysis-workbench";
import{restoreTradeScenario,serializeTradeScenario}from"@/lib/calculators/trade-scenario";
import styles from"./calculator.module.css";
import shared from"./lot-size.module.css";
const subscribe=(callback:()=>void)=>{window.addEventListener("popstate",callback);return()=>window.removeEventListener("popstate",callback);};
const browserSearch=()=>window.location.search;
export function AnalysisWorkbench({kind}:{kind:AnalysisKind}){const search=useSyncExternalStore(subscribe,browserSearch,()=>"");return<AnalysisForm key={`${kind}-${search}`} kind={kind} search={search}/>;}
function AnalysisForm({kind,search}:{kind:AnalysisKind;search:string}){
 const definition=analysisDefinitions[kind];const restored=restoreTradeScenario(search,definition.defaults);const[values,setValues]=useState(restored.values);const[status,setStatus]=useState("");const[fallback,setFallback]=useState("");
 let result:ReturnType<typeof analysisResult>|null=null,error=restored.error;
 try{if(!error)result=analysisResult(kind,values);}catch(caught){error=caught instanceof Error?caught.message:"Check your inputs.";}
 const set=(name:string,value:string)=>{setValues(old=>({...old,[name]:value}));setStatus("");setFallback("");};
 const reset=()=>{window.history.replaceState(null,"",definition.path);window.dispatchEvent(new PopStateEvent("popstate"));setValues({...definition.defaults});setStatus("");setFallback("");};
 const copy=async(link:boolean)=>{if(!result)return;const text=link?`${window.location.origin}${definition.path}?${serializeTradeScenario(values)}`:[result.title,result.value,result.summary,...result.metrics.map(row=>row.join(": ")),...result.tables.flatMap(table=>[table.title,...table.rows.map(row=>row.join(" | "))]),...result.steps,...result.warnings].join("\n");try{await navigator.clipboard.writeText(text);setStatus(link?"Scenario link copied.":"Results copied.");}catch{setFallback(text);setStatus("Select and copy the text below.");}};
 const curve=result?.curve?.filter(point=>point.y!==null)as{x:number;y:number}[]|undefined;
 const min=curve?Math.min(0,...curve.map(p=>p.y)):0,max=curve?Math.max(.001,...curve.map(p=>p.y)):1;
 return<div className={`${styles.workspace} ${shared.workspace}`} data-analysis-workbench={kind}>
  <div className={shared.topline}><span>{definition.title}</span><span>Disclosed formulas · editable assumptions</span></div>
  <a className={shared.mobileResult} href="#calculation-result"><span><strong>{result?.value??"Check inputs"}</strong>{result?.title??"Calculation result"}</span><span>View result <ArrowRight size={18} aria-hidden="true"/></span></a>
  <div className={styles.calculatorGrid}><form className={styles.inputForm} onSubmit={e=>e.preventDefault()} aria-label={`${kind} calculator inputs`}>
   <div className={styles.formHeading}><h3>Your assumptions</h3><button type="button" className={styles.reset} onClick={reset}><RotateCcw size={15} aria-hidden="true"/>Reset</button></div><p className={styles.inputNote}>{definition.note}</p>
   <div className={styles.fieldGrid}>{analysisFields(kind,values).map(field=><div className={styles.field} key={field.name}><label htmlFor={`analysis-${field.name}`}>{field.label}</label>{field.options?<select id={`analysis-${field.name}`} value={values[field.name]} onChange={e=>set(field.name,e.target.value)}>{field.options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select>:<input id={`analysis-${field.name}`} value={values[field.name]} maxLength={64} inputMode={field.text||field.name==="label"?"text":"decimal"} onChange={e=>set(field.name,e.target.value)} aria-describedby={field.help?`analysis-${field.name}-help`:undefined}/>} {field.help&&<small id={`analysis-${field.name}-help`}>{field.help}</small>}</div>)}</div>
   <a className={styles.viewResult} href="#calculation-result">{definition.button}<ArrowRight size={18} aria-hidden="true"/></a>
  </form><aside id="calculation-result" className={`${styles.result} ${shared.result}`} aria-label={`${kind} calculator results`}>
   <p className={styles.resultEyebrow}>Mathematical model · not an order recommendation</p>
   <div role="status" aria-live="polite" aria-atomic="true">{error?<div className={styles.validation}><h3>Check your inputs</h3><p>{error}</p><p>No estimate is shown until required inputs are valid.</p></div>:result&&<><h3>{result.title}</h3><p className={styles.resultValue} data-result>{result.value}</p><p className={styles.resultSummary}>{result.summary}</p></>}</div>
   {result&&<><dl className={styles.metrics}>{result.metrics.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {result.levels&&<figure className={shared.levelLadder} aria-label={result.levelsLabel??"Fibonacci retracement levels within the selected swing"}><figcaption>{result.levelsCaption??"Retracements within your selected swing. Bars show relative position from low to high; row spacing is schematic."}</figcaption>{result.levels.map(row=><div className={shared.levelRow} key={row.label}><span>{row.label}</span><strong>{row.price}</strong><div aria-hidden="true"><span style={{width:`${row.position*100}%`}}/></div></div>)}</figure>}
    {curve&&<figure className={shared.simulationChart}><svg viewBox="0 0 640 250" role="img" aria-label="Expected logarithmic growth across theoretical stake fractions"><line x1="60" y1={200-(0-min)/(max-min)*175} x2="625" y2={200-(0-min)/(max-min)*175} stroke="#888" strokeDasharray="4 4"/><polyline fill="none" stroke="#000" strokeWidth="2" points={curve.map(point=>`${60+point.x*565},${200-(point.y-min)/(max-min)*175}`).join(" ")}/><text x="4" y="25" fontSize="12">{max.toFixed(3)}</text><text x="4" y="202" fontSize="12">{min.toFixed(3)}</text><text x="60" y="230" fontSize="12">0% stake</text><text x="550" y="230" fontSize="12">100% stake</text></svg><figcaption>Expected log growth under the entered binary model, not actual account-growth predictions. Fractions where total-loss log growth is unbounded are omitted.</figcaption></figure>}
    {result.tables.map(table=><div className={shared.smallTable} key={table.title} role="region" aria-label={table.title} tabIndex={0}><table className={table.headers.length>3?shared.wideTable:undefined}><caption>{table.title}</caption><thead><tr>{table.headers.map(header=><th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{table.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th key={j} scope="row">{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>)}
    <details className={styles.breakdown} open><summary>Calculation breakdown</summary><ol>{result.steps.map(step=><li key={step}>{step}</li>)}</ol></details>
    {result.warnings.map(note=><p className={shared.notice} key={note}>{note}</p>)}
    <div className={shared.actions}><button type="button" onClick={()=>copy(false)}><Copy size={16} aria-hidden="true"/>Copy results</button><button type="button" onClick={()=>copy(true)}><Link2 size={16} aria-hidden="true"/>Copy scenario link</button></div>
    {status&&<p role="status">{status}</p>}{fallback&&<div className={styles.field}><label htmlFor="analysis-copy">Copy text</label><textarea id="analysis-copy" value={fallback} readOnly onFocus={e=>e.target.select()}/></div>}
   </>}<p className={styles.estimate}>Educational mathematics, not financial advice or verified future performance. Leveraged trading can cause substantial losses.</p>
  </aside></div><noscript><p className={styles.noScript}>Enable JavaScript to edit or restore a scenario. The default example, formulas and supporting guide remain readable below.</p></noscript>
 </div>;
}
