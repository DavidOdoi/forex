import { Temporal } from "@js-temporal/polyfill";
import { parseCsvRows } from "./history-csv";
import { returnValue, type ReturnObservation, type ReturnUnit } from "./sharpe";
import { CalculationError } from "./forex";
export type ReturnCsvOptions={column:string;rfColumn:string;dateColumn:string;currencyColumn:string;account:string;unit:ReturnUnit;rfMode:string};
export function parseReturnHistory(text:string,o:ReturnCsvOptions,now=Date.now()):ReturnObservation[]{
 const all=parseCsvRows(text);if(!all.length)throw new CalculationError('Enter a nonempty return series.');
 const headers=all[0].map(h=>h.toLowerCase()),at=(name:string)=>name.trim()?headers.indexOf(name.trim().toLowerCase()):-1,index=at(o.column),named=index>=0;
 if(['balance','equity','capital','nav','price','close','pnl','profit','amount'].includes(o.column.trim().toLowerCase()))throw new CalculationError('Select a return-rate column, not raw balances, prices or monetary P&L. Convert cash-flow-adjusted returns first.');
 if(!named&&/[a-df-z]/i.test(all[0][0]))throw new CalculationError('Set the exact return column name. Raw account balances and prices are not return rates.');
 const data=named?all.slice(1):all;if(!data.length||data.length>1000)throw new CalculationError('Use 1–1,000 returns.');
 const rfIndex=named?at(o.rfColumn):-1,dateCandidate=named?at(o.dateColumn):-1,dateIndex=dateCandidate>=0&&data.some(row=>row[dateCandidate]?.trim())?dateCandidate:-1,currencyIndex=named?at(o.currencyColumn):-1;
 if(o.rfMode==='column'&&rfIndex<0)throw new CalculationError('An aligned periodic risk-free column is required for every observation.');
 let previous='';
 return data.map(row=>{if(!named&&row.length!==1)throw new CalculationError('Use one return per line or named CSV columns.');const value=row[named?index:0]??'';returnValue(value,o.unit);
  if(currencyIndex>=0&&(row[currencyIndex]??'').toUpperCase()!==o.account)throw new CalculationError('Currency-labelled rows must match the declared portfolio/benchmark currency.');
  const rf=o.rfMode==='column'?row[rfIndex]??'':undefined;if(rf!==undefined)returnValue(rf,o.unit,'aligned periodic benchmark');
  const date=dateIndex>=0?row[dateIndex]??'':undefined;
  if(date!==undefined){try{if(!/^\d{4}-\d\d-\d\d$/.test(date))throw new Error();Temporal.PlainDate.from(date,{overflow:'reject'});}catch{throw new CalculationError('Return dates must be valid YYYY-MM-DD period-end dates.');}if(date<=previous||Date.parse(date)>now)throw new CalculationError('Return dates must be unique, increasing and not in the future.');previous=date;}
  return{value,...(rf===undefined?{}:{rf}),...(date===undefined?{}:{date})};});
}
export function normalizedReturnHistory(text:string,o:ReturnCsvOptions){const rows=parseReturnHistory(text,o);const output=['return,rf,date,currency',...rows.map(r=>[r.value,r.rf??'',r.date??'',o.account].join(','))].join('\n');if(output.length>65536)throw new CalculationError('Mapped returns exceed 64 KiB. Use a shorter series.');return output;}
