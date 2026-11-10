import { cashText, decimalText, type MultiTargetResult } from "./multi-target";

export function readableMultiTargetPlan(result: MultiTargetResult): string {
  const p = result, money = (amount: Parameters<typeof cashText>[0]) => cashText(amount, p.input.account);
  return [
    "DEVIN FOREX — hypothetical partial-exit plan", `${p.input.side.toUpperCase()} ${p.input.pair}; account ${p.input.account}; ${p.basis} allocation. ${p.executable ? "Matches entered volume rules; broker confirmation required." : "IDEAL MATH ONLY: partial volumes are not executable under the entered rules."}`,
    `Entry ${p.entry.toFixed()}; original stop ${p.stop.toFixed()}; ${p.lots.toFixed()} lots × ${p.contract.toFixed()} base units. Minimum ${p.minimum.toFixed()}; step ${p.step.toFixed()}.`,
    `Initial gross stop risk ${money(p.initialRisk)} (${decimalText(p.stopPips, 4)} pips). Constant conversion ${p.factor.toFixed()} ${p.input.account} per ${p.quote}.`,
    "Percentages refer to the original position.",
    ...p.rows.map(row => `TP${row.number}: ${row.price.toFixed()}, requested ${row.requestedPercent.toFixed()}%, actual ${decimalText(row.actualPercent, 8)}%, close ${row.lots.toFixed()} lots, gross ${money(row.gross)}, cumulative gross ${money(row.cumulativeGross)}, remaining ${row.remaining.toFixed()} lots.`),
    `Targets' realized gross ${money(p.targetGross)}; runner ${p.runnerLots.toFixed()} lots${p.runnerExit ? `, assumed exit ${p.runnerExit.toFixed()}` : "; any remainder stays open"}.`,
    p.weightedR ? `Whole-position price R ${decimalText(p.weightedR, 6)}; volume-weighted exit ${p.weightedExit!.toFixed()}; all-exit gross ${money(p.finalGross!)}.` : "Whole-position final R is not defined while the runner has no exit price.",
    p.input.commissionEnabled ? `Commission ${p.input.commission} ${p.input.account} per 100,000 base units per side. Full entry commission ${money(p.entryCommission)} is charged once before exits. Target cash P/L after full entry and filled exit commissions: ${money(p.targetNet)}.${p.finalNet ? ` All-exit net ${money(p.finalNet)}; net R ${decimalText(p.netR!, 6)} uses initial GROSS stop risk as denominator.` : ""}` : "Gross only; commissions not enabled.",
    "Conditional reversal paths (not probabilities):", ...p.scenarios.map(s => `${s.label}: realized gross ${money(s.realized)}; remaining before assumed exit ${s.remaining.toFixed()} lots; remainder exit ${s.exit?.toFixed() ?? (s.open ? "open" : "none")}; combined gross ${money(s.gross)}${p.input.commissionEnabled ? `; net cash ${money(s.net)}` : ""}${s.r ? `; gross cash R ${decimalText(s.r, 6)}` : "; no final R"}.`),
    "Hypothetical fill prices, constant scenario conversion, no live data. Spread/slippage must already be reflected in fills; financing, taxes, margin and broker settlement rounding are excluded. Stops do not guarantee maximum loss.",
  ].join("\n");
}
export function multiTargetCsv(p: MultiTargetResult): string {
  const header = ["Record", "Label", "Pair", "Side", "Account", "Allocation basis", "Exit price", "Lots closed / remainder before exit", "Requested original %", "Actual original %", "Partial / combined gross", "Cumulative target gross", "Net cash (cumulative for targets)", "Lots remaining open", "Price R / scenario gross cash R", "Constant account per quote factor", "Full entry commission"];
  const common = [p.input.pair, p.input.side, p.input.account, p.basis];
  const rows: (string | number)[][] = [header,
    ["Summary", p.executable ? "Matches entered volume rules; broker confirmation required" : "Ideal math only; volume rules failed", ...common, p.weightedExit?.toFixed() ?? "", p.lots.toFixed(), p.totalPercent.toFixed(), "", p.finalGross?.toFixed() ?? p.targetGross.toFixed(), "", p.input.commissionEnabled ? (p.finalNet ?? p.targetNet).toFixed() : "", p.runnerExit ? "0" : p.runnerLots.toFixed(), p.weightedR?.toFixed() ?? "", p.factor.toFixed(), p.entryCommission.toFixed()],
    ...p.rows.map(r => ["Target", `TP${r.number}; net cash is cumulative and includes full entry fee`, ...common, r.price.toFixed(), r.lots.toFixed(), r.requestedPercent.toFixed(), r.actualPercent.toFixed(), r.gross.toFixed(), r.cumulativeGross.toFixed(), p.input.commissionEnabled ? r.cumulativeNet.toFixed() : "", r.remaining.toFixed(), r.r.toFixed(), p.factor.toFixed(), p.entryCommission.toFixed()]),
    ...p.scenarios.map(s => ["Scenario", s.label, ...common, s.exit?.toFixed() ?? "", s.remaining.toFixed(), "", "", s.gross.toFixed(), s.realized.toFixed(), p.input.commissionEnabled ? s.net.toFixed() : "", s.open ? s.remaining.toFixed() : "0", s.r?.toFixed() ?? "", p.factor.toFixed(), p.entryCommission.toFixed()]),
  ];
  const assumptionHeaders = ["Entry price", "Initial stop price", "Base units per trade lot", "Pip size", "Minimum lots", "Lot step", "Initial gross account stop risk", "Gross risk budget", "Raw lots before sizing floor", "Remainder stop policy", "Move stop after target", "Runner exit after all targets", "Commission enabled", "Commission per 100000 base units per side", "Financing / tax / separate spread and slippage"];
  const assumptions = [p.entry.toFixed(), p.stop.toFixed(), p.contract.toFixed(), p.pip.toFixed(), p.minimum.toFixed(), p.step.toFixed(), p.initialRisk.toFixed(), p.budget?.toFixed() ?? "", p.rawLots.toFixed(), p.input.stopPolicy, p.input.moveAfter, p.runnerExit?.toFixed() ?? "", String(p.input.commissionEnabled), p.input.commissionEnabled ? p.input.commission : "0", "Excluded; enter hypothetical fills including spread/slippage"];
  const complete = [[...header, ...assumptionHeaders], ...rows.slice(1).map(row => [...row, ...assumptions])];
  return complete.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n") + "\r\n";
}
