import { D, decimal, type Numeric } from "./precision";
import { checkedAccount, checkedLeverage, tradePrice, tradeVolume } from "./trade-core";
import type { FxInstrument, AccountCurrency } from "./instruments";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";
import { calculateProfit } from "./profit";
import { CalculationError } from "./forex";
export type HedgeInput = { instrument: FxInstrument; account: AccountCurrency; volumeMode: "lots"|"units"; buyVolume: Numeric; sellVolume: Numeric; buyEntry: Numeric; sellEntry: Numeric; bid: Numeric; ask: Numeric; charges: Numeric; financing: Numeric; marginRule: "gross"|"largest"|"manual"; leverage: Numeric; manualMargin: Numeric; rates: ExchangeRate[] };
export function calculateHedge(i: HedgeInput) {
  checkedAccount(i.account); const spec=tradeVolume(i.instrument,"1","lots");
  if (!["lots","units"].includes(i.volumeMode)||!["gross","largest","manual"].includes(i.marginRule)) throw new CalculationError("Choose a valid volume convention and margin assumption.");
  const buy=decimal(i.buyVolume,"buy volume"), sell=decimal(i.sellVolume,"sell volume");
  const buyUnits=i.volumeMode==="lots"?buy.mul(spec.contract):buy, sellUnits=i.volumeMode==="lots"?sell.mul(spec.contract):sell;
  const grossUnits=buyUnits.add(sellUnits), netUnits=buyUnits.sub(sellUnits);
  if (grossUnits.isZero()) throw new CalculationError("Enter at least one positive position size.");
  const bid=tradePrice(i.bid,"current closing bid",i.instrument), ask=tradePrice(i.ask,"current closing ask",i.instrument);
  if (ask.lt(bid)) throw new CalculationError("The current ask cannot be below the bid.");
  const charges=decimal(i.charges,"additional total charges"), financing=decimal(i.financing,"signed financing","-1000000000000");
  const credit=resolveConversion(i.instrument.quote,i.account,i.rates,Date.now(),"asset"),debit=resolveConversion(i.instrument.quote,i.account,i.rates,Date.now(),"liability");
  const leg=(side:"buy"|"sell",units:InstanceType<typeof D>,exit:InstanceType<typeof D>)=>{
    if (units.isZero())return{quote:new D(0),gross:new D(0)};
    return calculateProfit({instrument:i.instrument,account:i.account,volume:units.toString(),volumeMode:"units",direction:side,entry:side==="buy"?i.buyEntry:i.sellEntry,exit:exit.toString(),priceMode:"fills",spreadPips:"0",slippagePips:"0",commission:"0",commissionBasis:"total",swap:"0",costCurrency:"account",rates:i.rates});
  };
  const buyPnl=leg("buy",buyUnits,bid),sellPnl=leg("sell",sellUnits,ask),grossPnl=buyPnl.gross.add(sellPnl.gross),netPnl=grossPnl.sub(charges).add(financing);
  const midpoint=bid.add(ask).div(2),unitNotional=i.account===i.instrument.base?new D(1):midpoint.mul(debit.factor);
  const grossNotional=grossUnits.mul(unitNotional),largestNotional=D.max(buyUnits,sellUnits).mul(unitNotional);
  const leverage=i.marginRule==="manual"?null:checkedLeverage(i.leverage);
  const margin=i.marginRule==="manual"?decimal(i.manualMargin,"platform used margin"):(i.marginRule==="gross"?grossNotional:largestNotional).div(leverage!);
  const scenarios=[-50,-10,0,10,50].map(pips=>({pips,bid:bid.add(spec.pipSize.mul(pips)),ask:ask.add(spec.pipSize.mul(pips))})).filter(row=>row.bid.gt(0)&&row.ask.lte(1000000000)).map(row=>({...row,net:leg("buy",buyUnits,row.bid).gross.add(leg("sell",sellUnits,row.ask).gross).sub(charges).add(financing)}));
  return{...spec,buyUnits,sellUnits,grossUnits,netUnits,buyLots:buyUnits.div(spec.contract),sellLots:sellUnits.div(spec.contract),grossLots:grossUnits.div(spec.contract),netLots:netUnits.div(spec.contract),coverage:D.min(buyUnits,sellUnits).div(D.max(buyUnits,sellUnits)).mul(100),bid,ask,midpoint,buyPnl,sellPnl,grossPnl,netPnl,charges,financing,grossNotional,largestNotional,margin,leverage,credit,debit,scenarios};
}
