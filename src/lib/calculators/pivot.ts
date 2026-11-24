import{CalculationError}from"./forex";
import{D,decimal,type Numeric}from"./precision";
import{conventionalInstrument,isPair}from"./instruments";
export const pivotMethods={traditional:"Traditional / Floor · stated R3/S3",fibonacci:"Fibonacci · 0.382/0.618/1 range",camarilla:"Camarilla · four levels around close","woodie-close":"Woodie · previous close · R1/S1","woodie-open":"Woodie · current open · R1/S1",demark:"DeMark · previous open · R1/S1"};
export type PivotMethod=keyof typeof pivotMethods;
export const defaultPivotValues={method:"traditional",high:"1.1200",low:"1.1100",close:"1.1150",previousOpen:"",currentOpen:"",current:"",precision:"5",market:"forex",pair:"EUR/USD",unit:"0.01",period:"Daily",zone:"Etc/UTC",label:"Manual completed-period example"};
export type PivotInput={method:PivotMethod;high:Numeric;low:Numeric;close:Numeric;previousOpen?:Numeric;currentOpen?:Numeric;current?:Numeric;unit:Numeric;precision:number};
export function calculatePivots(input:PivotInput){
 if(!Object.hasOwn(pivotMethods,input.method))throw new CalculationError("Choose a defined pivot method.");
 const low=decimal(input.low,"previous low","0.0000000001","1000000000000"),high=decimal(input.high,"previous high",low.toString(),"1000000000000"),close=decimal(input.close,"previous close",low.toString(),high.toString());
 const previousOpen=input.previousOpen===undefined?null:decimal(input.previousOpen,"previous open",low.toString(),high.toString());
 const currentOpen=input.currentOpen===undefined?null:decimal(input.currentOpen,"current-period open","0.0000000001","1000000000000");
 const current=input.current===undefined?null:decimal(input.current,"manual reference price","0.0000000001","1000000000000");
 const unit=decimal(input.unit,"distance-unit size","0.0000000001","1000000000000");
 if(!Number.isInteger(input.precision)||input.precision<0||input.precision>10)throw new CalculationError("Choose zero to ten display decimals.");
 const range=high.sub(low);let p=high.add(low).add(close).div(3),x:InstanceType<typeof D>|null=null;
 const pairs:{label:string;price:InstanceType<typeof D>}[]=[];const formulas:string[]=[];
 const pair=(n:number,r:InstanceType<typeof D>,s:InstanceType<typeof D>)=>{pairs.push({label:`R${n}`,price:r},{label:`S${n}`,price:s});};
 if(input.method==="traditional"){
  pair(1,p.mul(2).sub(low),p.mul(2).sub(high));pair(2,p.add(range),p.sub(range));pair(3,high.add(p.sub(low).mul(2)),low.sub(high.sub(p).mul(2)));
  formulas.push("P=(H+L+C)/3; R1=2P−L; S1=2P−H.","R2=P+(H−L); S2=P−(H−L).","R3=H+2(P−L); S3=L−2(H−P). This is the stated Traditional/Floor convention.");
 }else if(input.method==="fibonacci"){
  [.382,.618,1].forEach((ratio,i)=>pair(i+1,p.add(range.mul(ratio)),p.sub(range.mul(ratio))));formulas.push("P=(H+L+C)/3.","R1/S1=P±0.382×range; R2/S2=P±0.618×range; R3/S3=P±1.000×range.");
 }else if(input.method==="camarilla"){
  [12,6,4,2].forEach((den,i)=>pair(i+1,close.add(range.mul(1.1).div(den)),close.sub(range.mul(1.1).div(den))));formulas.push("Central reference P=(H+L+C)/3; Camarilla levels themselves are anchored at C.","R1–R4=C+1.1×range/[12,6,4,2]; S1–S4=C−1.1×range/[12,6,4,2]. No R5/S5 is invented.");
 }else if(input.method==="woodie-close"||input.method==="woodie-open"){
  if(input.method==="woodie-open"&&currentOpen===null)throw new CalculationError("Woodie current-open requires the current period’s opening price, separately from the previous OHLC record.");
  const weighted=input.method==="woodie-close"?close:currentOpen!;p=high.add(low).add(weighted.mul(2)).div(4);pair(1,p.mul(2).sub(low),p.mul(2).sub(high));formulas.push(input.method==="woodie-close"?"P=(previous H+previous L+2×previous C)/4.":"P=(previous H+previous L+2×current-period O)/4.","R1=2P−previous L; S1=2P−previous H. This implementation reports R1/S1 only for the labelled Woodie variant.");
 }else{
  if(previousOpen===null)throw new CalculationError("DeMark requires the previous period’s open within the same completed high/low range.");
  x=close.lt(previousOpen)?high.add(low.mul(2)).add(close):close.gt(previousOpen)?high.mul(2).add(low).add(close):high.add(low).add(close.mul(2));p=x.div(4);pair(1,x.div(2).sub(low),x.div(2).sub(high));formulas.push("If C<O: X=H+2L+C; if C>O: X=2H+L+C; if C=O: X=H+L+2C.","P=X/4; R1=X/2−L; S1=X/2−H. R2/R3/S2/S3 are not defined by this implementation.");
 }
 const levels=[{label:"P",price:p},...pairs].map(row=>({...row,distance:current?row.price.sub(current).div(unit):null}));
 return{p,x,high,low,close,previousOpen,currentOpen,current,unit,range,levels,formulas};
}
export function pivotScenario(v:Record<string,string>){
 if(!["forex","price"].includes(v.market)||!["Daily","Weekly","Monthly","Custom"].includes(v.period))throw new CalculationError("Choose a valid distance convention and source period.");
 if(v.market==="forex"&&!isPair(v.pair))throw new CalculationError("Choose a supported forex pair.");
 try{new Intl.DateTimeFormat("en",{timeZone:v.zone}).format();}catch{throw new CalculationError("Enter a valid source-session timezone.");}
 const input:PivotInput={method:v.method as PivotMethod,high:v.high,low:v.low,close:v.close,...(v.previousOpen.trim()?{previousOpen:v.previousOpen}:{}),...(v.currentOpen.trim()?{currentOpen:v.currentOpen}:{}),...(v.current.trim()?{current:v.current}:{}),unit:v.market==="forex"?conventionalInstrument(v.pair as Parameters<typeof conventionalInstrument>[0]).pipSize:v.unit,precision:/^\d{1,2}$/.test(v.precision)?Number(v.precision):NaN};
 const result=calculatePivots(input);
 const comparisons=(Object.keys(pivotMethods)as PivotMethod[]).map(method=>{if(method==="woodie-open"&&input.currentOpen===undefined)return{method,value:null,needs:"Needs current-period open"};if(method==="demark"&&input.previousOpen===undefined)return{method,value:null,needs:"Needs previous-period open"};return{method,value:calculatePivots({...input,method}).p,needs:null};});
 return{...result,comparisons};
}
