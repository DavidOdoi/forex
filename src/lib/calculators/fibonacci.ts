import{CalculationError}from"./forex";
import{D,decimal,type Numeric}from"./precision";
import{conventionalInstrument,isPair}from"./instruments";
export const defaultFibonacciValues={low:"1.1000",high:"1.1500",direction:"up",precision:"5",retracements:"0,23.6,38.2,50,61.8,78.6,100",extensions:"127.2,161.8,200,261.8",market:"forex",pair:"EUR/USD",unit:"0.01",current:"",label:"Selected swing"};
export type FibonacciInput={low:Numeric;high:Numeric;direction:"up"|"down";precision:number;retracements:string;extensions:string;unit:Numeric;current?:Numeric};
export function parseRatios(text:string,mode:"retracement"|"extension"){
 const tokens=text.trim().split(/[\s,]+/).filter(Boolean);if(!tokens.length||tokens.length>20)throw new CalculationError("Enter one to twenty ratios in each list, separated by commas.");
 const values=tokens.map(token=>decimal(token,`${mode} percentage`,mode==="retracement"?"0":"100",mode==="retracement"?"100":"1000"));
 return values.filter((value,i)=>values.findIndex(other=>other.eq(value))===i).sort((a,b)=>a.comparedTo(b));
}
export function calculateFibonacci(input:FibonacciInput){
 const low=decimal(input.low,"swing low","0.0000000001","1000000000000"),high=decimal(input.high,"swing high",low.toString(),"1000000000000");
 if(high.eq(low))throw new CalculationError("Swing high must be greater than swing low.");
 if(!["up","down"].includes(input.direction)||!Number.isInteger(input.precision)||input.precision<0||input.precision>10)throw new CalculationError("Choose an upward/downward swing and zero to ten display decimals.");
 const range=high.sub(low),unit=decimal(input.unit,"distance-unit size","0.0000000001","1000000000000");
 const current=input.current===undefined?null:decimal(input.current,"reference price","0.0000000001","1000000000000");
 const row=(ratio:InstanceType<typeof D>,price:InstanceType<typeof D>)=>({ratio,price,priceDistance:current?price.sub(current):null,unitDistance:current?price.sub(current).div(unit):null});
 const retracements=parseRatios(input.retracements,"retracement").map(ratio=>row(ratio,input.direction==="up"?high.sub(range.mul(ratio).div(100)):low.add(range.mul(ratio).div(100))));
 const extensions=parseRatios(input.extensions,"extension").map(ratio=>row(ratio,input.direction==="up"?low.add(range.mul(ratio).div(100)):high.sub(range.mul(ratio).div(100))));
 const prices=[...retracements,...extensions].map(r=>r.price).filter(p=>p.gt(0)).sort((a,b)=>a.comparedTo(b));
 return{low,high,range,unit,current,retracements,extensions,nearestBelow:current?[...prices].reverse().find(p=>p.lte(current))??null:null,nearestAbove:current?prices.find(p=>p.gte(current))??null:null};
}
export function fibonacciScenario(v:Record<string,string>){
 if(!["forex","price"].includes(v.market))throw new CalculationError("Choose forex pips or generic price units.");
 if(v.market==="forex"&&!isPair(v.pair))throw new CalculationError("Choose a supported forex pair.");
 const unit=v.market==="forex"?conventionalInstrument(v.pair as Parameters<typeof conventionalInstrument>[0]).pipSize:v.unit;
 const precision=/^\d{1,2}$/.test(v.precision)?Number(v.precision):NaN;
 return calculateFibonacci({low:v.low,high:v.high,direction:v.direction as "up"|"down",precision,retracements:v.retracements,extensions:v.extensions,unit,...(v.current.trim()?{current:v.current}:{})});
}
