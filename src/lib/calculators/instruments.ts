import { pairCodes, pairInfo, type PairCode } from "./forex";

export { pairCodes };
export const accountCurrencies = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD", "ZAR", "SGD", "HKD", "CNY", "INR", "MYR", "AED", "KES", "NGN", "GHS", "UGX"] as const;
export type AccountCurrency = typeof accountCurrencies[number];
export function isAccountCurrency(value: string): value is AccountCurrency { return (accountCurrencies as readonly string[]).includes(value); }
export function isPair(value: string): value is PairCode { return (pairCodes as readonly string[]).includes(value); }

export type FxInstrument = {
  symbol: PairCode; base: AccountCurrency; quote: AccountCurrency; category: "forex";
  contractSize: string; pipSize: string; minimumLots: string; maximumLots: string;
  lotStep: string; pricePrecision: number; sourceId: string; lastVerifiedAt: string | null;
};

export function conventionalInstrument(symbol: PairCode): FxInstrument {
  const { base, quote } = pairInfo(symbol);
  return { symbol, base, quote, category: "forex", contractSize: "100000", pipSize: quote === "JPY" ? "0.01" : "0.0001",
    minimumLots: "0.01", maximumLots: "100", lotStep: "0.01", pricePrecision: quote === "JPY" ? 3 : 5,
    sourceId: "conventional-fx-example", lastVerifiedAt: null };
}
