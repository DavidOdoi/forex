import { CalculationError } from "./forex";
import type { AccountCurrency, FxInstrument } from "./instruments";
import { resolveConversion, type ExchangeRate } from "./exchange-rates";
import { decimal, D, type Numeric } from "./precision";
import { checkedAccount, tradePrice, tradeVolume } from "./trade-core";

export type ProfitInputs = {
  instrument: FxInstrument; account: AccountCurrency; volume: Numeric; volumeMode: "lots" | "units";
  direction: "buy" | "sell"; entry: Numeric; exit: Numeric; priceMode: "fills" | "mid";
  spreadPips: Numeric; slippagePips: Numeric; commission: Numeric;
  commissionBasis: "total" | "lot-roundtrip" | "lot-side";
  swap: Numeric; costCurrency: "account" | "quote"; equity?: Numeric;
  stop?: Numeric; target?: Numeric; rates: ExchangeRate[];
};

export function calculateProfit(input: ProfitInputs, now = Date.now()) {
  const size = tradeVolume(input.instrument, input.volume, input.volumeMode);
  checkedAccount(input.account);
  if (!["buy", "sell"].includes(input.direction) || !["fills", "mid"].includes(input.priceMode) || !["account", "quote"].includes(input.costCurrency) || !["total", "lot-roundtrip", "lot-side"].includes(input.commissionBasis)) throw new CalculationError("Choose valid direction, price and cost conventions.");
  const entry = tradePrice(input.entry, "entry price", input.instrument);
  const exit = tradePrice(input.exit, "exit price", input.instrument);
  const credit = resolveConversion(input.instrument.quote, input.account, input.rates, now, "asset");
  const debit = resolveConversion(input.instrument.quote, input.account, input.rates, now, "liability");
  const convert = (amount: InstanceType<typeof D>) => amount.mul(amount.gte(0) ? credit.factor : debit.factor);
  const spreadPips = decimal(input.spreadPips, "additional spread pips", "0", "1000000");
  const slippagePips = decimal(input.slippagePips, "additional slippage pips", "0", "1000000");
  const pipQuote = size.units.mul(size.pipSize);
  const spread = input.priceMode === "mid" ? spreadPips.mul(pipQuote).mul(debit.factor) : new D(0);
  const slippage = slippagePips.mul(pipQuote).mul(debit.factor);
  const commissionInput = decimal(input.commission, "commission", "0", "1000000000000");
  const commissionTotal = commissionInput.mul(input.commissionBasis === "total" ? 1 : size.lots).mul(input.commissionBasis === "lot-side" ? 2 : 1);
  const commission = input.costCurrency === "quote" ? commissionTotal.mul(debit.factor) : commissionTotal;
  const swapInput = decimal(input.swap, "signed swap adjustment", "-1000000000000", "1000000000000");
  const swap = input.costCurrency === "quote" ? convert(swapInput) : swapInput;
  const costs = commission.add(spread).add(slippage).sub(swap);
  const equity = input.equity === undefined ? null : decimal(input.equity, "reference account equity", "0", "1000000000000", true);
  const direction = input.direction === "buy" ? new D(1) : new D(-1);
  const atExit = (price: InstanceType<typeof D>, side = direction) => {
    const move = price.sub(entry).mul(side);
    const quote = move.mul(size.units);
    const gross = convert(quote);
    return { price, pips: move.div(size.pipSize), quote, gross, net: gross.sub(costs) };
  };
  const main = atExit(exit);
  const otherSide = atExit(exit, direction.neg());
  const optional = (value: Numeric | undefined, label: string) => value === undefined ? null : atExit(tradePrice(value, label, input.instrument));
  const stop = optional(input.stop, "stop-scenario exit price");
  const target = optional(input.target, "target-scenario exit price");
  const scenarios = [-50, -25, 0, 25, 50].map(pips => ({ pips, price: entry.add(size.pipSize.mul(pips).mul(direction)) })).filter(row => row.price.gt(0) && row.price.lte(1000000000)).map(row => atExit(row.price));
  return { ...size, entry, exit, ...main, conversion: main.quote.gte(0) ? credit : debit, credit, debit, pipQuote, creditPip: pipQuote.mul(credit.factor), debitPip: pipQuote.mul(debit.factor), commission, spread, slippage, swap, costs, equity, returnPercent: equity ? main.net.div(equity).mul(100) : null, otherSide, stop, target, scenarios };
}
