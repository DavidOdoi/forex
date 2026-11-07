export const metals = ["XAU", "XAG"] as const;
export type Metal = typeof metals[number];
export const currencies = ["USD", "ZAR", "EUR", "GBP"] as const;
export type Currency = typeof currencies[number];
export type Unit = "oz" | "g" | "kg";
export type Quote = { symbol: Metal; price: number; asOf: string };
export type Fx = { currency: Currency; rate: number; date: string };
export type Point = { date: string; price: number };
export type Ohlc = { open: number; high: number; low: number; close: number; start: number; end: number };
export type History = {
  status: "available" | "not-configured" | "unavailable";
  points: Point[];
  today: Ohlc | null;
  year: Ohlc | null;
  retrievedAt: string | null;
};
export type Snapshot = {
  quotes: Record<Metal, Quote | null>;
  fx: Fx[];
  retrievedAt: string;
};
export const emptyHistory = (): History => ({ status: "not-configured", points: [], today: null, year: null, retrievedAt: null });
export const names: Record<Metal, string> = { XAU: "Gold", XAG: "Silver" };
