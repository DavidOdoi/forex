import { CalculationError } from "./forex";
import { checkedAccount } from "./trade-core";
import { marginAccountState } from "./margin";
import { decimal, D, type Numeric } from "./precision";
import type { AccountCurrency } from "./instruments";
export type MarginCallInputs = {
  account: AccountCurrency; equityMode: "equity" | "balance-pnl"; equity: Numeric; balance: Numeric; floating: Numeric; used: Numeric;
  callPercent: Numeric; stopPercent: Numeric; comparison: "at-or-below" | "below";
  deposit: Numeric; withdrawal: Numeric; pnlChange: Numeric; costs: Numeric; scenarioUsed?: Numeric;
  profile: { mode: "illustration" | "user-source"; broker?: string; entity?: string; accountType?: string; sourceUrl?: string; checkedDate?: string; confirmed?: boolean };
};
export function calculateMarginCall(input: MarginCallInputs, now = Date.now()) {
  checkedAccount(input.account);
  if (!["equity", "balance-pnl"].includes(input.equityMode) || !["at-or-below", "below"].includes(input.comparison) || !["illustration", "user-source"].includes(input.profile.mode)) throw new CalculationError("Choose valid equity, threshold and rule-source conventions.");
  let profileUrl: string | null = null;
  if (input.profile.mode === "user-source") {
    for (const key of ["broker", "entity", "accountType"] as const) if (!input.profile[key]?.trim() || input.profile[key]!.length > 120) throw new CalculationError("Enter public broker, legal-entity and account-type names for the referenced rules. Do not enter account numbers.");
    try { const url = new URL(input.profile.sourceUrl ?? ""); if (url.protocol !== "https:" || url.username || url.password || url.href.length > 2048) throw new Error(); profileUrl = url.href; } catch { throw new CalculationError("Enter a public HTTPS account-rule source without credentials."); }
    const date = input.profile.checkedDate ?? "", timestamp = Date.parse(date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date || date > new Date(now).toISOString().slice(0, 10)) throw new CalculationError("Enter a valid rule-checked date on or before today in UTC.");
    if (!input.profile.confirmed) throw new CalculationError("Confirm that the entered percentages and comparison match that entity and account type. The calculator does not independently verify your source.");
  }
  const equity = input.equityMode === "equity" ? decimal(input.equity, "current account equity", "-1000000000000", "1000000000000") : decimal(input.balance, "account balance", "-1000000000000", "1000000000000").add(decimal(input.floating, "floating P&L", "-1000000000000", "1000000000000"));
  const used = decimal(input.used, "current used margin", "0", "1000000000000");
  const call = decimal(input.callPercent, "margin-call threshold percentage", "0", "100000"), stop = decimal(input.stopPercent, "stop-out threshold percentage", "0", "100000");
  if (stop.gt(call)) throw new CalculationError("This two-threshold model requires margin call to be at least stop-out. Check the account rules; other trigger structures need a different model.");
  const state = (eq: Numeric, usedMargin: Numeric) => {
    const account = marginAccountState(eq, usedMargin, { allowNegativeEquity: true });
    const callEquity = account.used.mul(call).div(100), stopEquity = account.used.mul(stop).div(100);
    const hit = (threshold: InstanceType<typeof D>) => input.comparison === "below" ? account.equity.lt(threshold) : account.equity.lte(threshold);
    return { ...account, callEquity, stopEquity, callDistance: account.equity.sub(callEquity), stopDistance: account.equity.sub(stopEquity), status: account.used.isZero() ? "No margin currently used" : hit(stopEquity) ? "At entered stop-out condition" : hit(callEquity) ? "At entered margin-call condition" : "No entered threshold condition met" };
  };
  const current = state(equity.toString(), used.toString());
  const deposit = decimal(input.deposit, "credited deposit scenario", "0", "1000000000000"), withdrawal = decimal(input.withdrawal, "withdrawal scenario", "0", "1000000000000"), pnlChange = decimal(input.pnlChange, "additional P&L scenario", "-1000000000000", "1000000000000"), costs = decimal(input.costs, "additional costs scenario", "0", "1000000000000");
  const alternativeUsed = input.scenarioUsed === undefined ? used : decimal(input.scenarioUsed, "scenario used margin", "0", "1000000000000");
  const scenario = state(equity.add(deposit).sub(withdrawal).add(pnlChange).sub(costs).toString(), alternativeUsed.toString());
  return { current, scenario, call, stop, deposit, withdrawal, pnlChange, costs, profileUrl, sensitivities: ["0.75", "1", "1.25", "1.5"].map(multiplier => ({ multiplier, ...state(equity.toString(), used.mul(multiplier).toString()) })) };
}
