import type { FxInstrument, AccountCurrency } from "./instruments";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";
import { decimal, D, type Numeric } from "./precision";
import { checkedAccount, conventionalLotUnits, tradePrice, tradeVolume } from "./trade-core";

export type PipInputs = {
  instrument: FxInstrument; account: AccountCurrency; volume: Numeric; volumeMode: "lots" | "units";
  pips: Numeric; movement?: { start: Numeric; end: Numeric }; rates: ExchangeRate[];
};

export function calculatePip(input: PipInputs, now = Date.now()) {
  const size = tradeVolume(input.instrument, input.volume, input.volumeMode);
  checkedAccount(input.account);
  // A neutral pip value uses a mid conversion when a user supplies bid/ask.
  // Single manual and daily reference quotes have one identical rate.
  const midRates = input.rates.map(rate => {
    if (rate.bid === undefined && rate.ask === undefined) return rate;
    const bid = decimal(rate.bid ?? "", "conversion bid", "0", "1000000000", true);
    const ask = decimal(rate.ask ?? "", "conversion ask", "0", "1000000000", true);
    // Preserve validation of inverted bid/ask in the shared resolver.
    resolveConversion(rate.base, rate.quote, [rate], now);
    return { ...rate, bid: undefined, ask: undefined, rate: bid.add(ask).div(2).toString() };
  });
  const conversion = resolveConversion(input.instrument.quote, input.account, midRates, now);
  const quoteValue = size.units.mul(size.pipSize);
  const pipValue = quoteValue.mul(conversion.factor);
  const pips = decimal(input.pips, "pip count", "0", "10000000");
  const movement = input.movement ? tradePrice(input.movement.end, "end price", input.instrument).sub(tradePrice(input.movement.start, "start price", input.instrument)).div(size.pipSize) : null;
  return { ...size, conversion, quoteValue, pipValue, pips, moveValue: pips.mul(pipValue), movement,
    perLot: size.contract.mul(size.pipSize).mul(conversion.factor),
    lotsTable: conventionalLotUnits.map(item => ({ ...item, configuredLots: item.units.div(size.contract), pipValue: item.units.mul(size.pipSize).mul(conversion.factor) })),
    scenarios: [10, 25, 50, 100].map(count => ({ pips: new D(count), value: pipValue.mul(count) })),
  };
}
