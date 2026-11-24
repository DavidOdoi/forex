import {CalculationError} from "./forex";
import {D,decimal,type Numeric} from "./precision";
export type KellyInput={probability:Numeric;payoff:Numeric;multiplier:Numeric;capital?:Numeric};
export const defaultKellyValues={probability:"45",payoff:"2",multiplier:"0.5",capital:"",currency:"USD",probabilityMode:"percent",wins:"45",trades:"100",payoffMode:"ratio",averageWin:"200",averageLoss:"100"};
export function expectedLogGrowth(p:number,b:number,f:number):number|null{
 if(!Number.isFinite(p)||p<0||p>1||!Number.isFinite(b)||b<=0||!Number.isFinite(f)||f<0||f>1)throw new CalculationError("Log-growth inputs require a probability0–1, positive payoff and fraction0–1.");
 if(f===1&&p<1)return null;
 return(p===0?0:p*Math.log1p(b*f))+(p===1?0:(1-p)*Math.log1p(-f));
}
export function calculateKelly(input:KellyInput){
 const p=decimal(input.probability,"win probability","0","100").div(100);
 const b=decimal(input.payoff,"payoff ratio","0.000000000001","1000000000000");
 const multiplier=decimal(input.multiplier,"fractional Kelly multiplier","0","1");
 const capital=input.capital===undefined?null:decimal(input.capital,"reference capital","0","1000000000000",true);
 const raw=p.sub(new D(1).sub(p).div(b));const nonnegative=D.max(0,raw);
 const rows=[{label:"Full Kelly",multiplier:new D(1)},{label:"Half Kelly",multiplier:new D(.5)},{label:"Quarter Kelly",multiplier:new D(.25)},{label:"Selected fraction",multiplier}].map(row=>{const fraction=nonnegative.mul(row.multiplier);return{...row,fraction,logGrowth:expectedLogGrowth(p.toNumber(),b.toNumber(),fraction.toNumber()),amount:capital?capital.mul(fraction):null,remainingAfterTenLosses:new D(1).sub(fraction).pow(10)};});
 const sensitivity=[D.max(0,p.sub(.05)),p,D.min(1,p.add(.05))].map(probability=>({probability,raw:probability.sub(new D(1).sub(probability).div(b))}));
 return{p,b,raw,nonnegative,multiplier,capital,expectancy:p.mul(b).sub(new D(1).sub(p)),rows,sensitivity,curve:Array.from({length:41},(_,i)=>({fraction:i/40,growth:expectedLogGrowth(p.toNumber(),b.toNumber(),i/40)}))};
}
export function kellyScenario(values:Record<string,string>){
 if(!["percent","counts"].includes(values.probabilityMode)||!["ratio","averages"].includes(values.payoffMode))throw new CalculationError("Choose valid probability and payoff input modes.");
 let probability=values.probability,payoff=values.payoff,sample:string|null=null;
 if(values.probabilityMode==="counts"){
  const trades=decimal(values.trades,"completed trade count","1","1000000");const wins=decimal(values.wins,"winning trades","0",trades.toString());
  if(!trades.isInteger()||!wins.isInteger())throw new CalculationError("Trade counts must be whole numbers.");
  probability=wins.div(trades).mul(100).toString();sample=`${wins.toString()} wins / ${trades.toString()} completed trades; historical sample, not a known future probability.`;
 }
 if(values.payoffMode==="averages")payoff=decimal(values.averageWin,"average net winner","0.000000000001","1000000000000").div(decimal(values.averageLoss,"average net loss magnitude","0.000000000001","1000000000000")).toString();
 const result=calculateKelly({probability,payoff,multiplier:values.multiplier,...(values.capital.trim()?{capital:values.capital}:{})});
 return{...result,sample,monetaryExpectancy:values.payoffMode==="averages"?result.p.mul(values.averageWin).sub(new D(1).sub(result.p).mul(values.averageLoss)):null};
}
