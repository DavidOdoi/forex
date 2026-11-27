import { D, decimal, type Numeric } from "./precision";
import { CalculationError } from "./forex";
export type ReturnUnit="percent"|"decimal";
export type SharpeSettings={unit:ReturnUnit;frequency:"daily"|"weekly"|"monthly"|"annual"|"custom"|"unspecified";periods:Numeric;spacing:"regular"|"unknown";rfMode:"periodic"|"annual"|"column";riskFree:Numeric;annualization:"sqrt"|"none"};
export function returnValue(value:Numeric,unit:ReturnUnit,label="simple return"){
 if(!["percent","decimal"].includes(unit))throw new CalculationError("Choose percent or decimal return units.");
 const entered=String(value).trim();const raw=unit==="percent"&&entered.endsWith("%")?entered.slice(0,-1).trim():entered;
 return decimal(raw,label,unit==="percent"?"-100":"-1",unit==="percent"?"1000":"10").div(unit==="percent"?100:1);
}
export function sharpePeriods(i:SharpeSettings){
 if(!["daily","weekly","monthly","annual","custom","unspecified"].includes(i.frequency)||!["regular","unknown"].includes(i.spacing)||!["sqrt","none"].includes(i.annualization))throw new CalculationError("Choose a valid frequency, spacing and annualization model.");
 const conventional={daily:"252",weekly:"52",monthly:"12",annual:"1"};
 return i.frequency==="unspecified"?null:i.frequency==="custom"?decimal(i.periods,"assumed periods per year","0","1000000",true):new D(conventional[i.frequency]);
}
export function periodicBenchmark(i:SharpeSettings){
 const periods=sharpePeriods(i);
 if(i.rfMode==="periodic")return{periods,rate:returnValue(i.riskFree,i.unit,"matched periodic risk-free return")};
 if(i.rfMode!=="annual")throw new CalculationError("Use an annual/periodic benchmark or supply an aligned risk-free column in history mode.");
 if(periods===null||i.spacing!=="regular")throw new CalculationError("Annual benchmark conversion requires an explicit regular-period frequency. Use matched periodic or per-row benchmarks for other data.");
 const annual=decimal(i.riskFree,"annual effective risk-free rate (%)","-100","1000",true).div(100),base=new D(1).add(annual);
 if(base.lte(0))throw new CalculationError("The annual benchmark is outside the supported positive-growth precision range.");
 return{periods,rate:base.pow(new D(1).div(periods)).sub(1)};
}
function moments(values:InstanceType<typeof D>[],sample:boolean){
 const mean=values.reduce((sum,v)=>sum.add(v),new D(0)).div(values.length),divisor=values.length-(sample?1:0);
 const variance=divisor>0?values.reduce((sum,v)=>sum.add(v.sub(mean).pow(2)),new D(0)).div(divisor):null;
 return{mean,volatility:variance===null?null:variance.sqrt()};
}
function finish(mean:InstanceType<typeof D>,volatility:InstanceType<typeof D>|null,periods:InstanceType<typeof D>|null,settings:SharpeSettings,regular=true){
 const periodic=volatility!==null&&volatility.gt(0)?mean.div(volatility):null;
 const eligible=periods!==null&&settings.spacing==="regular"&&regular&&settings.annualization==="sqrt";
 return{periodic,annualized:periodic!==null&&eligible?periodic.mul(periods!.sqrt()):null,annualizationEligible:eligible};
}
export function sharpeSummary(i:SharpeSettings&{mean:Numeric;volatility:Numeric}){
 const rf=periodicBenchmark(i),mean=returnValue(i.mean,i.unit,"mean periodic return"),volatility=decimal(i.volatility,"periodic standard deviation","0",i.unit==="percent"?"1000":"10").div(i.unit==="percent"?100:1),excess=mean.sub(rf.rate);
 return{mean,volatility,excess,rf:rf.rate,periods:rf.periods,...finish(excess,volatility,rf.periods,i)};
}
export type ReturnObservation={value:string;rf?:string;date?:string};
export function sharpeHistory(observations:ReturnObservation[],i:SharpeSettings&{volatilityMethod:"sample"|"population"}){
 if(!observations.length||observations.length>1000||!["sample","population"].includes(i.volatilityMethod))throw new CalculationError("Use 1–1,000 return observations and a valid volatility convention.");
 const dated=observations.some(row=>row.date!==undefined);let previous='';
 if(dated)for(const row of observations){const date=row.date??'',stamp=Date.parse(date);if(!/^\d{4}-\d\d-\d\d$/.test(date)||!Number.isFinite(stamp)||new Date(stamp).toISOString().slice(0,10)!==date||date<=previous||stamp>Date.now())throw new CalculationError('Return dates must be complete, valid, unique, increasing and not future dates.');previous=date;}
 const periods=sharpePeriods(i),fixed=i.rfMode==="column"?null:periodicBenchmark(i).rate;
 const rows=observations.map((o,index)=>{const value=returnValue(o.value,i.unit),rf=fixed??returnValue(o.rf??"",i.unit,"aligned periodic risk-free return");return{index,date:o.date,value,rf,excess:value.sub(rf)};});
 const sample=i.volatilityMethod==="sample",raw=moments(rows.map(r=>r.value),sample),excess=moments(rows.map(r=>r.excess),sample);
 const meanExcess=fixed===null?excess.mean:raw.mean.sub(fixed),volatility=fixed===null?excess.volatility:raw.volatility;
 let regular=true;
 if(rows.every(row=>row.date)&&["monthly","weekly","annual"].includes(i.frequency)){
  for(let n=1;n<rows.length;n++){const a=new Date(rows[n-1].date!),b=new Date(rows[n].date!);if(i.frequency==="weekly"&&(b.getTime()-a.getTime())/86400000!==7)regular=false;if(i.frequency==="monthly"&&(b.getUTCFullYear()-a.getUTCFullYear())*12+b.getUTCMonth()-a.getUTCMonth()!==1)regular=false;if(i.frequency==="annual"&&(b.getUTCFullYear()-a.getUTCFullYear()!==1||b.getUTCMonth()!==a.getUTCMonth()||Math.abs(b.getUTCDate()-a.getUTCDate())>1))regular=false;}
 }
 if(!regular&&i.rfMode==='annual')throw new CalculationError('The dated series has gaps for its declared frequency. Use aligned benchmarks or correct the return periods before annual-rate conversion.');
 return{rows,count:rows.length,mean:raw.mean,rawVolatility:raw.volatility,volatility,excess:meanExcess,meanRf:rows.reduce((sum,r)=>sum.add(r.rf),new D(0)).div(rows.length),periods,regular,...finish(meanExcess,volatility,periods,i,regular)};
}
