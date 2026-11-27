import { D, decimal, type Numeric } from "./precision";
import { checkedAccount, checkedLeverage, tradePrice, tradeVolume } from "./trade-core";
import type { AccountCurrency, FxInstrument } from "./instruments";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";
import { CalculationError } from "./forex";
export type NotionalInput={instrument:FxInstrument;account:AccountCurrency;volume:Numeric;volumeMode:"lots"|"units";price:Numeric;marginEnabled:boolean;marginMode:"leverage"|"percent";leverage:Numeric;marginPercent:Numeric;equity?:Numeric;rates:ExchangeRate[]};
export function calculateNotional(i:NotionalInput){
 checkedAccount(i.account);const size=tradeVolume(i.instrument,i.volume,i.volumeMode),price=tradePrice(i.price,"notional reference price",i.instrument);
 if(typeof i.marginEnabled!=="boolean"||!["leverage","percent"].includes(i.marginMode))throw new CalculationError("Choose a valid margin model.");
 const quote=size.units.mul(price),from=i.account===i.instrument.base?i.instrument.base:i.instrument.quote,conversion=resolveConversion(from,i.account,i.rates,Date.now(),"liability");
 const accountNotional=(from===i.instrument.base?size.units:quote).mul(conversion.factor);
 const marginRate=!i.marginEnabled?null:i.marginMode==="leverage"?new D(1).div(checkedLeverage(i.leverage)):decimal(i.marginPercent,"margin rate","0","100",true).div(100);
 const margin=marginRate===null?null:accountNotional.mul(marginRate),equity=i.equity===undefined?null:decimal(i.equity,"account equity","-1000000000000");
 const effective=equity!==null&&equity.gt(0)?accountNotional.div(equity):null;
 const comparisons=["0.01","0.1","1",size.lots.toString()].filter((value,index,all)=>all.indexOf(value)===index).map(lots=>{const units=new D(lots).mul(size.contract),quote=units.mul(price),account=(from===i.instrument.base?units:quote).mul(conversion.factor);return{lots,units,quote,account,margin:marginRate===null?null:account.mul(marginRate)};});
 return{...size,price,quote,from,conversion,accountNotional,marginRate,margin,equity,effective,comparisons};
}
