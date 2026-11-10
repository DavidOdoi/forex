import { useId } from "react";
import { boundary, historicalPoints, futurePoints, toScreen, illustrationLabel, patterns, type StructureKind, type TriangleKind, type Scenario, type Point } from "@/lib/education/triangles";

const path = (points: Point[]) => points.map((point, index) => { const { x, y } = toScreen(point); return `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`; }).join(" ");
export function PatternDiagram({ kind, scenario = "forming", step = 4, title, neutral = false }: { kind: StructureKind; scenario?: Scenario; step?: number; title?: string; neutral?: boolean }) {
  const id = useId();
  const history = historicalPoints(kind);
  const triangle = kind === "ascending" || kind === "descending" || kind === "symmetrical";
  const future = step >= 3 && triangle ? futurePoints(kind as TriangleKind, scenario) : [];
  const start = kind === "pennant" ? 14 : 4;
  const segment = (side: "upper" | "lower", from: number, to: number) => path([{ time: from, price: boundary(kind, side, from) }, { time: to, price: boundary(kind, side, to) }]);
  const chartTitle = title ?? `${triangle ? patterns[kind as TriangleKind].name : kind} structure: ${scenario === "forming" ? "still forming" : scenario}`;
  return <figure className="tp-diagram" data-pattern={kind} data-scenario={scenario} data-step={step}>
    <svg viewBox="0 0 420 340" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{chartTitle}</title>
      <desc id={`${id}-desc`}>{illustrationLabel} Solid dark line: completed illustrative swings. {step >= 1 && kind !== "unclear" ? "Solid upper and dashed lower lines are drawn boundaries." : "Boundaries are not drawn."} {future.length ? "Dashed gold line: revealed hypothetical next segment." : "No future price segment is displayed."} Axes are relative price and time, not a quoted instrument.</desc>
      {[25, 50, 75, 100].map(value => <line key={value} className="tp-grid" x1="54" x2="389" y1={toScreen({ time: 0, price: value }).y} y2={toScreen({ time: 0, price: value }).y} />)}
      <path className="tp-axis" d="M54 43 V245 H390" fill="none" />
      <text x="8" y="25" className="tp-axis-label">Relative price ↑</text><text x="304" y="273" className="tp-axis-label">Time →</text>
      {step >= 2 && kind !== "unclear" && <path className="tp-area" d={`${segment("upper", start, 64)} L${toScreen({ time: 64, price: boundary(kind, "lower", 64) }).x},${toScreen({ time: 64, price: boundary(kind, "lower", 64) }).y} L${toScreen({ time: start, price: boundary(kind, "lower", start) }).x},${toScreen({ time: start, price: boundary(kind, "lower", start) }).y} Z`} />}
      {step >= 1 && kind !== "unclear" && <g data-boundaries>
        <path className="tp-upper" d={segment("upper", start, 64)} /><path className="tp-lower" d={segment("lower", start, 64)} />
        <path className="tp-extension" d={`${segment("upper", 64, kind === "pennant" ? 68 : 82)} ${segment("lower", 64, kind === "pennant" ? 68 : 82)}`} />
      </g>}
      <path className="tp-history" d={path(history)} data-history />
      {history.map((point, index) => { const { x, y } = toScreen(point); const high = kind === "pennant" ? index >= 2 && index % 2 === 0 : index % 2 === 0; return <g key={index}>
        <circle className="tp-swing" cx={x} cy={y} r="4" />
        {kind !== "unclear" && kind !== "pennant" && <text x={x} y={y + (high ? -13 : 25)} textAnchor="middle" className="tp-swing-label">{high ? "H" : "L"}{Math.floor(index / 2) + 1}</text>}
      </g>; })}
      {future.length > 0 && <g data-future><path className="tp-future" d={path([history.at(-1)!, ...future])} />{future.map((point, index) => { const { x, y } = toScreen(point); return <rect key={index} x={x - 4} y={y - 4} width="8" height="8" className="tp-next-point" />; })}</g>}
      {step >= 1 && kind !== "unclear" && <g className="tp-boundary-key"><line x1="12" x2="40" y1="300" y2="300" className="tp-upper" /><text x="50" y="307">{!neutral && triangle ? patterns[kind as TriangleKind].upper : "Upper boundary"}</text><line x1="12" x2="40" y1="327" y2="327" className="tp-lower" /><text x="50" y="334">{!neutral && triangle ? patterns[kind as TriangleKind].lower : "Lower boundary"}</text></g>}
    </svg>
    <figcaption>{illustrationLabel}</figcaption>
  </figure>;
}

/** Compact phone overview; the full labelled charts immediately follow it. */
export function CompactPatternComparison() {
  return <div className="tp-mobile-compare" aria-label="All three triangle shapes at a glance">{(["ascending", "descending", "symmetrical"] as const).map(kind => {
    const project = (point: Point) => `${12 + point.time * 1.35},${82 - point.price * 0.7}`;
    const line = (side: "upper" | "lower") => `M${project({ time: 4, price: boundary(kind, side, 4) })} L${project({ time: 64, price: boundary(kind, side, 64) })}`;
    return <figure key={kind}><a href={`#${kind}`}>{patterns[kind].name}</a><svg viewBox="0 0 120 100" role="img" aria-labelledby={`compact-${kind}-title`}><title id={`compact-${kind}-title`}>{`${patterns[kind].name}: ${patterns[kind].upper}; ${patterns[kind].lower}. Relative price upward; time rightward. ${illustrationLabel}`}</title><path d="M12 10 V86 H112" className="tp-axis" fill="none" /><path d={line("upper")} className="tp-upper" /><path d={line("lower")} className="tp-lower" /><path d={historicalPoints(kind).map((point, i) => `${i ? "L" : "M"}${project(point)}`).join(" ")} className="tp-history" /></svg><p>{kind === "ascending" ? "Flat highs" : "Falling highs"}<br />{kind === "descending" ? "Flat lows" : "Rising lows"}</p><figcaption>{illustrationLabel}</figcaption></figure>;
  })}</div>;
}
