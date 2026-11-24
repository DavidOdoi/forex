import { CalculationError } from "./forex";
import type { AccountCurrency, FxInstrument } from "./instruments";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";
import { decimal, D, type Numeric } from "./precision";
import { checkedAccount, tradePrice, tradeVolume } from "./trade-core";

export type SpreadInputs = {
  instrument: FxInstrument; account: AccountCurrency; volume: Numeric; volumeMode: "lots" | "units";
  bid: Numeric; ask: Numeric; commission: Numeric; rates: ExchangeRate[];
  treatment: "standalone" | "embedded"; closingSpread?: Numeric;
};

export function calculateSpread(input: SpreadInputs, now = Date.now()) {
  const size = tradeVolume(input.instrument, input.volume, input.volumeMode);
  checkedAccount(input.account);
  if (!["standalone", "embedded"].includes(input.treatment)) throw new CalculationError("Choose how spread is accounted for.");
  const bid = tradePrice(input.bid, "market bid", input.instrument);
  const ask = tradePrice(input.ask, "market ask", input.instrument);
  if (ask.lt(bid)) throw new CalculationError("Market ask must be equal to or higher than market bid.");
  const difference = ask.sub(bid);
  const pips = difference.div(size.pipSize);
  const conversion = resolveConversion(input.instrument.quote, input.account, input.rates, now, "liability");
  const pipQuote = size.units.mul(size.pipSize);
  const pipAccount = pipQuote.mul(conversion.factor);
  const quoteCost = difference.mul(size.units);
  const spreadCost = quoteCost.mul(conversion.factor);
  const closePips = input.closingSpread === undefined ? pips : decimal(input.closingSpread, "hypothetical closing spread in pips", "0", "1000000");
  const modeledPips = pips.add(closePips).div(2);
  const modeledSpread = modeledPips.mul(pipAccount);
  const commission = decimal(input.commission, "round-turn commission in account currency", "0", "1000000000000");
  const additionalSpread = input.treatment === "embedded" ? new D(0) : modeledSpread;
  return { ...size, bid, ask, difference, pips, quoteCost, spreadCost, pipQuote, pipAccount, conversion,
    commission, closePips, modeledPips, modeledSpread, additionalSpread,
    combined: additionalSpread.add(commission), percentage: difference.div(ask).mul(100),
    scenarios: [new D(1), new D(1.5), new D(2)].map(multiplier => {
      const spread = pips.mul(multiplier);
      return { multiplier, pips: spread, cost: spread.mul(pipAccount), combined: (input.treatment === "embedded" ? new D(0) : spread.mul(pipAccount)).add(commission) };
    }),
  };
}
