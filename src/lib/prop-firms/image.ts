import { getInsightImage } from "@/lib/insights/catalog";

// Existing internet-sourced asset; its attribution and share-alike licence stay visible.
// This historical chart illustrates the platform, not an EA backtest or firm results.
export const comparisonImage = {
  ...getInsightImage("mt5-chart"),
  alt: "Historical EUR/USD candlestick chart in MetaTrader 5, a platform for forex EAs",
};
