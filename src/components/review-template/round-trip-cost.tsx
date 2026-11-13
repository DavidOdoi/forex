"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { calculatePip, range } from "@/lib/calculators/forex";

const money = (value: number) => `US$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export function RoundTripCost({ brokerName = "Exness", initialSpread = "0.3", initialCommission = "3.5" }: { brokerName?: string; initialSpread?: string; initialCommission?: string }) {
  const id = useId();
  const [lots, setLots] = useState("1");
  const [spread, setSpread] = useState(initialSpread);
  const [commission, setCommission] = useState(initialCommission);
  let result: { spread: number; commission: number; total: number; pips: number } | undefined;
  let error = "";
  try {
    if ([lots, spread, commission].some(value => !value.trim())) throw new Error("Complete all three fields to calculate the cost.");
    const size = range(Number(lots), "Standard lots", 0.01, 1000);
    const width = range(Number(spread), "Spread in pips", 0, 100);
    const charge = range(Number(commission), "Commission per lot per side", 0, 100);
    const pip = calculatePip({ pair: "EUR/USD", account: "USD", contractSize: 100000, lots: size });
    const spreadCost = width * pip.loss;
    const roundTripCommission = 2 * charge * size;
    result = { spread: spreadCost, commission: roundTripCommission, total: spreadCost + roundTripCommission, pips: (spreadCost + roundTripCommission) / pip.loss };
  } catch (issue) { error = issue instanceof Error ? issue.message : "Check the values."; }
  return <figure className="br-cost-example br-cost-calculator" data-illustrative-cost>
    <figcaption><strong>Estimate your EUR/USD round-trip cost</strong><span>Not a measured {brokerName} quote</span></figcaption>
    <p>USD account · 100,000 EUR/standard lot · US$10/pip per lot. Edit these hypothetical defaults.</p>
    <div className="br-cost-inputs" data-roundtrip-controls>
      <label htmlFor={`${id}-lots`}>Standard lots<input id={`${id}-lots`} type="number" inputMode="decimal" min="0.01" max="1000" step="0.01" value={lots} onChange={event => setLots(event.target.value)} aria-describedby={`${id}-note`} /></label>
      <label htmlFor={`${id}-spread`}>Spread (pips)<input id={`${id}-spread`} type="number" inputMode="decimal" min="0" max="100" step="0.01" value={spread} onChange={event => setSpread(event.target.value)} /></label>
      <label htmlFor={`${id}-commission`}>US$/lot/side<input id={`${id}-commission`} type="number" inputMode="decimal" min="0" max="100" step="0.01" value={commission} onChange={event => setCommission(event.target.value)} /></label>
    </div>
    <div role="status" aria-live="polite" aria-atomic="true" data-roundtrip-result>
      {result ? <dl><div><dt>Spread cost</dt><dd>{money(result.spread)}</dd></div><div><dt>Open + close commission</dt><dd>{money(result.commission)}</dd></div><div><dt>Round-trip total</dt><dd><strong>{money(result.total)} / {result.pips.toFixed(1)} {Number(result.pips.toFixed(1)) === 1 ? "pip" : "pips"}</strong></dd></div></dl> : <p className="br-cost-error">{error}</p>}
    </div>
    <p id={`${id}-note`}>Spread × pip value + 2 × commission × lots. Excludes price movement, swaps, slippage and conversion. Cent lots use different units. <Link href="/tools/forex-position-size-calculator">Size your position</Link>.</p>
    <noscript><p>The example above is fixed without JavaScript: 1 standard lot, {initialSpread} pips and {money(Number(initialCommission))}/lot/side.</p></noscript>
  </figure>;
}
