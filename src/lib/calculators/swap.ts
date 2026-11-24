import { Temporal } from "@js-temporal/polyfill";
import { CalculationError } from "./forex";
import { D, decimal, type Numeric } from "./precision";
import { checkedAccount, tradePrice, tradeVolume } from "./trade-core";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";
import type { FxInstrument, AccountCurrency } from "./instruments";

export type RolloverEvent = { label: string; utc: string; multiplier: number };
export type SwapInputs = {
  instrument: FxInstrument; account: AccountCurrency; direction: "buy" | "sell"; volume: Numeric; volumeMode: "lots" | "units";
  rate: Numeric; unit: "points" | "pips" | "money" | "annual"; pointSize: Numeric; moneyCurrency: "quote" | "account";
  price: Numeric; dayBasis: "360" | "365"; mode: "counts" | "dates"; normal: Numeric; triple: Numeric;
  open: string; close: string; zone: string; cutoff: string; tripleDay: string; overrides: string; rates: ExchangeRate[];
};

export function rolloverEvents(input: Pick<SwapInputs,"open"|"close"|"zone"|"cutoff"|"tripleDay"|"overrides">): RolloverEvent[] {
  try {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input.open) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input.close) || !/^\d{2}:\d{2}$/.test(input.cutoff)) throw new Error("Use local dates/times and a valid HH:mm cutoff.");
    const first = Temporal.PlainDateTime.from(input.open, { overflow:"reject" }).toZonedDateTime(input.zone,{disambiguation:"reject"});
    const last = Temporal.PlainDateTime.from(input.close, { overflow:"reject" }).toZonedDateTime(input.zone,{disambiguation:"reject"});
    const cutoff = Temporal.PlainTime.from(input.cutoff,{overflow:"reject"});
    if (last.epochMilliseconds <= first.epochMilliseconds || last.epochMilliseconds-first.epochMilliseconds>367*86400000) throw new Error("Closing time must follow opening time, within 366 local days.");
    if (!/^[0-7]$/.test(input.tripleDay)) throw new Error("Choose a valid triple-rollover weekday or none.");
    const overrides = new Map<string,number>();
    const lines = input.overrides.trim() ? input.overrides.trim().split(/\n/) : [];
    if(lines.length>30) throw new Error("Use at most 30 dated overrides.");
    for(const line of lines){
      const [date,mult,...extra]=line.trim().split(/\s*,\s*/);
      if(extra.length || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d+(?:\.\d+)?$/.test(mult??"") || overrides.has(date)) throw new Error("Overrides need unique YYYY-MM-DD,multiplier rows.");
      Temporal.PlainDate.from(date,{overflow:"reject"}); const amount=decimal(mult,"rollover multiplier","0","10").toNumber();overrides.set(date,amount);
    }
    const events:RolloverEvent[]=[];
    for(let day=first.toPlainDate(),count=0;Temporal.PlainDate.compare(day,last.toPlainDate())<=0;day=day.add({days:1}),count++){
      if(count>366)throw new Error("The date range may cover at most 366 local days.");
      const moment=day.toPlainDateTime(cutoff).toZonedDateTime(input.zone,{disambiguation:"reject"});
      if(moment.epochMilliseconds>first.epochMilliseconds && moment.epochMilliseconds<=last.epochMilliseconds){
        const date=day.toString(); const multiplier=overrides.get(date)??(day.dayOfWeek===Number(input.tripleDay)?3:day.dayOfWeek<=5?1:0);
        events.push({label:date,utc:moment.toInstant().toString(),multiplier});
      }
    }
    return events;
  }catch(error){throw new CalculationError(`Check the rollover dates, timezone and schedule: ${error instanceof Error?error.message:"invalid date"}`);}
}

export function calculateSwap(input:SwapInputs,now=Date.now()){
  checkedAccount(input.account); const size=tradeVolume(input.instrument,input.volume,input.volumeMode);
  if(!["buy","sell"].includes(input.direction)||!["points","pips","money","annual"].includes(input.unit)||!["counts","dates"].includes(input.mode)||!["quote","account"].includes(input.moneyCurrency))throw new CalculationError("Choose valid swap units, direction and holding-period settings.");
  const rate=decimal(input.rate,"signed broker swap rate","-1000000","1000000");
  const from=input.unit==="money"&&input.moneyCurrency==="account"?input.account:input.instrument.quote;
  const conversion=resolveConversion(from,input.account,input.rates,now,rate.gte(0)?"asset":"liability");
  let ordinary;
  if(input.unit==="points") ordinary=rate.mul(decimal(input.pointSize,"point size","0","1",true)).mul(size.units);
  else if(input.unit==="pips")ordinary=rate.mul(size.pipSize).mul(size.units);
  else if(input.unit==="money")ordinary=rate.mul(size.lots);
  else{
    if(!["360","365"].includes(input.dayBasis))throw new CalculationError("Choose the documented annual day-count basis: 360 or 365.");
    ordinary=size.units.mul(tradePrice(input.price,"annual notional reference price",input.instrument)).mul(rate).div(100).div(input.dayBasis);
  }
  const normal= input.mode==="counts"?decimal(input.normal,"normal rollover count","0","10000"):new D(0);
  const triple= input.mode==="counts"?decimal(input.triple,"triple rollover count","0","10000"):new D(0);
  if(!normal.isInteger()||!triple.isInteger())throw new CalculationError("Rollover counts must be whole numbers.");
  const events=input.mode==="dates"?rolloverEvents(input):[{label:`${normal.toString()} normal rollovers`,utc:"Manual count",multiplier:normal.toNumber()},{label:`${triple.toString()} triple rollovers`,utc:"Manual count",multiplier:triple.mul(3).toNumber()}];
  const financingDays=events.reduce((sum,event)=>sum.add(event.multiplier),new D(0));
  const nativeTotal=ordinary.mul(financingDays);const total=nativeTotal.mul(conversion.factor);
  const pipEquivalent=from===input.instrument.quote?nativeTotal.div(size.units.mul(size.pipSize)):null;
  return {...size,rate,from,conversion,ordinary,ordinaryAccount:ordinary.mul(conversion.factor),events,financingDays,nativeTotal,total,pipEquivalent};
}
