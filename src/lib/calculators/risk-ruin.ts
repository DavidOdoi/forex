import { CalculationError } from "./forex";
import { decimal } from "./precision";

export type RuinInput={capital:number;probability:number;payoff:number;risk:number;mode:"percent"|"fixed";threshold:number;thresholdMode:"initial"|"peak";trades:number;paths:number;seed:number;cost:number};
export const defaultRuinValues={capital:"10000",probability:"45",payoff:"2",risk:"2",mode:"percent",threshold:"30",thresholdMode:"initial",trades:"200",paths:"5000",seed:"20261124",cost:"0",currency:"USD"};
export function parseRuin(values:Record<string,string>):RuinInput{
 const n=(key:string,min:string,max:string,positive=false)=>{const value=decimal(values[key],key,min,max,positive).toNumber();if(!Number.isFinite(value)||(positive&&value<=0))throw new CalculationError(`${key} is outside numerical simulation precision.`);return value;};
 if(!["percent","fixed"].includes(values.mode)||!["initial","peak"].includes(values.thresholdMode))throw new CalculationError("Choose valid sizing and threshold definitions.");
 const input:RuinInput={capital:n("capital","0","1000000000000",true),probability:n("probability","0","100")/100,payoff:n("payoff","0","100",true),risk:n("risk","0",values.mode==="percent"?"100":"1000000000000",true),mode:values.mode as RuinInput["mode"],threshold:n("threshold","0.000001","100")/100,thresholdMode:values.thresholdMode as RuinInput["thresholdMode"],trades:n("trades","1","2000"),paths:n("paths","100","50000"),seed:n("seed","0","4294967295"),cost:n("cost","0","1000000000000")};
 if(!Number.isInteger(input.trades)||!Number.isInteger(input.paths)||!Number.isInteger(input.seed))throw new CalculationError("Trades, paths and seed must be whole numbers.");
 if(input.paths*input.trades>5000000)throw new CalculationError("Use at most 5,000,000 path-trade steps; reduce paths or trades.");
 return input;
}
export function seededRandom(seed:number){let state=seed>>>0;return()=>{state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
export function drawdown(peak:number,equity:number){return(peak-equity)/peak;}
export function nextEquity(equity:number,won:boolean,input:Pick<RuinInput,"risk"|"mode"|"payoff"|"cost">){
 const stake=Math.min(equity,input.mode==="percent"?equity*input.risk/100:input.risk);
 const remaining=equity+(won?stake*input.payoff:-stake)-input.cost;
 // A finite sequence of percentage losses below 100%, without extra costs,
 // leaves strictly positive mathematical equity. Never count an underflow or
 // cancellation to zero as an actual total-loss observation.
 if(equity>0&&!won&&input.mode==="percent"&&input.risk<100&&input.cost===0&&remaining<=0)throw new CalculationError("This percentage path exceeds numerical precision near zero equity. Use a practical drawdown threshold or a shorter horizon.");
 return Math.max(0,remaining);
}
export function wilsonInterval(hits:number,samples:number){const p=hits/samples,z=1.959963984540054,z2=z*z,den=1+z2/samples,center=(p+z2/(2*samples))/den,half=z*Math.sqrt(p*(1-p)/samples+z2/(4*samples*samples))/den;return{low:Math.max(0,center-half),high:Math.min(1,center+half)};}
export type RuinResult=ReturnType<typeof simulateRuin>;
export function simulateRuin(input:RuinInput){
 // The worker is untrusted input too: validate the numeric model again.
 const valid=parseRuin(Object.fromEntries(Object.entries({...input,probability:input.probability*100,threshold:input.threshold*100}).map(([key,value])=>[key,String(value)])));
 const random=seededRandom(valid.seed);let hits=0,worstDrawdown=0;
 const endings:number[]=[],samples:{trade:number;equity:number}[][]=[];
 for(let path=0;path<valid.paths;path++){
  let equity=valid.capital,peak=equity;const sample:{trade:number;equity:number}[]=[];
  if(path<12)sample.push({trade:0,equity});
  const stride=Math.max(1,Math.ceil(valid.trades/100));
  for(let trade=1;trade<=valid.trades;trade++){
   equity=nextEquity(equity,random()<valid.probability,valid);
   if(!Number.isFinite(equity)||equity>1e100)throw new CalculationError("This scenario exceeds the simulation equity limit. Reduce the horizon, payoff or risk assumption.");
   peak=Math.max(peak,equity);worstDrawdown=Math.max(worstDrawdown,drawdown(peak,equity));
   const barrier=(valid.thresholdMode==="initial"?valid.capital:peak)*(1-valid.threshold);
   const hit=equity<=barrier;
   if(path<12&&(trade%stride===0||hit||trade===valid.trades))sample.push({trade,equity});
   if(hit){hits++;break;}
  }
  endings.push(equity);if(path<12)samples.push(sample);
 }
 endings.sort((a,b)=>a-b);const percentile=(p:number)=>endings[Math.floor((endings.length-1)*p)];
 return{hits,paths:valid.paths,frequency:hits/valid.paths,interval:wilsonInterval(hits,valid.paths),initialBarrier:valid.capital*(1-valid.threshold),worstDrawdown,percentiles:{p10:percentile(.1),median:percentile(.5),p90:percentile(.9)},samples,input:valid};
}
