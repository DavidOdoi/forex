"use client";
import { useEffect, useId, useRef, useState } from "react";
import { DAY } from "@/lib/metals/math";
import { names, type History, type Metal, type Point } from "@/lib/metals/types";
import type { HubKind } from "@/lib/metals/content";
import styles from "./metals.module.css";
const ranges = [{ label: "24H", days: 1 }, { label: "7D", days: 7 }, { label: "30D", days: 30 }, { label: "6M", days: 183 }, { label: "1Y", days: 365 }, { label: "5Y", days: 1826 }, { label: "All", days: Infinity }];
export default function MetalChart({ kind, history, loaded }: { kind: HubKind; history: Record<Metal, History>; loaded: boolean }) {
  const [range, setRange] = useState(2);
  const selected: Metal[] = kind === "gold" ? ["XAU"] : ["XAU", "XAG"];
  return <div><div className={styles.rangeButtons} role="group" aria-label="Chart timeframe">{ranges.filter(r => kind === "gold" || r.label !== "All").map(r => <button key={r.label} type="button" aria-pressed={ranges[range].label === r.label} onClick={() => setRange(ranges.indexOf(r))}>{r.label}</button>)}</div>
    {range === 0 ? <div className={styles.chartPlaceholder}>24-hour intraday history is not available from the connected free daily-data plan. Choose 7D or longer; no intraday movement is inferred from daily averages.</div> : <div className={kind === "gold" ? "" : styles.chartGrid}>{selected.map(symbol => <Chart key={symbol} symbol={symbol} history={history[symbol]} days={ranges[range].days} loaded={loaded} />)}</div>}
  </div>;
}
function sample(points: Point[]) {
  if (points.length <= 320) return points;
  // Preserve the endpoints and both extremes within each time bucket.
  const result = [points[0]], step = Math.ceil((points.length - 2) / 150);
  for (let i = 1; i < points.length - 1; i += step) {
    const group = points.slice(i, Math.min(i + step, points.length - 1));
    const low = group.reduce((a, b) => a.price < b.price ? a : b), high = group.reduce((a, b) => a.price > b.price ? a : b);
    result.push(...[low, high].filter((p, i, a) => a.indexOf(p) === i).sort((a, b) => a.date.localeCompare(b.date)));
  }
  return [...result, points[points.length - 1]];
}
function Chart({ symbol, history, days, loaded }: { symbol: Metal; history: History; days: number; loaded: boolean }) {
  const id = useId(), [hover, setHover] = useState<Point | null>(null), [tablePage, setTablePage] = useState(0), [tableOpen, setTableOpen] = useState(false);
  const figureRef = useRef<HTMLElement>(null), [width, setWidth] = useState(700);
  useEffect(() => {
    if (!figureRef.current) return;
    const observer = new ResizeObserver(entries => {
      const size = entries[0]?.contentRect.width;
      if (size) setWidth(Math.max(240, Math.round(size)));
    });
    observer.observe(figureRef.current);
    return () => observer.disconnect();
  }, [history.points.length]);
  const last = history.points.at(-1), end = last ? Date.parse(last.date) : 0;
  const points = history.points.filter(p => Date.parse(p.date) >= end - days * DAY), visible = sample(points);
  if (points.length < 2) return <div className={styles.chartPlaceholder}><strong>{names[symbol]} history {loaded ? "unavailable" : "loading…"}</strong><p>{loaded ? "We do not have verified historical observations to draw this chart. Current quotes and calculators work independently; no sample prices or invented line are displayed." : "Retrieving the provider’s cached daily observations."}</p></div>;
  const low = Math.min(...points.map(p => p.price)), high = Math.max(...points.map(p => p.price)), span = high - low || high * 0.01;
  const x0 = Date.parse(points[0].date), duration = end - x0 || 1;
  const plotWidth = width - 90;
  const x = (p: Point) => 65 + (Date.parse(p.date) - x0) / duration * plotWidth;
  const y = (p: Point) => 210 - (p.price - low) / span * 170;
  const path = visible.map((p, i) => `${i ? "L" : "M"}${x(p).toFixed(2)},${y(p).toFixed(2)}`).join(" ");
  const active = hover && points.some(p => p.date === hover.date) ? hover : last!;
  const pageCount = Math.ceil(points.length / 50), currentPage = Math.min(tablePage, pageCount - 1);
  const number = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
  return <figure ref={figureRef} className={styles.chartFigure}><figcaption><strong>{names[symbol]} · USD/troy oz</strong><span>{active.date}: USD {number(active.price)} · daily average</span></figcaption>
    <svg viewBox={`0 0 ${width} 270`} role="img" aria-labelledby={`${id}-title ${id}-desc`} onPointerLeave={() => setHover(null)} onPointerMove={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      const date = x0 + Math.max(0, Math.min(1, (event.clientX - rect.left - rect.width * 65 / width) / (rect.width * plotWidth / width))) * duration;
      setHover(points.reduce((best, p) => Math.abs(Date.parse(p.date) - date) < Math.abs(Date.parse(best.date) - date) ? p : best));
    }}><title id={`${id}-title`}>{names[symbol]} price chart, {points[0].date} to {last!.date}</title><desc id={`${id}-desc`}>Daily-average spot prices in US dollars per troy ounce. Range {number(low)} to {number(high)}. A full accessible data table follows.</desc>
      {[low, low + span / 2, low + span].map((price, i) => <g key={i}><line x1="65" x2={width - 25} y1={210 - i * 85} y2={210 - i * 85} stroke="#dedede" strokeDasharray="3 5" /><text x="56" y={215 - i * 85} textAnchor="end" fill="#111" fontSize="13">{number(price)}</text></g>)}
      <path d={path} fill="none" stroke={symbol === "XAU" ? "#8b610c" : "#293f58"} strokeWidth="2.8" vectorEffect="non-scaling-stroke" />
      <text x="65" y="250" fontSize="13" fill="#111">{points[0].date}</text><text x={width - 25} y="268" textAnchor="end" fontSize="13" fill="#111">{last!.date}</text>
      {hover && <circle cx={x(active)} cy={y(active)} r="5" fill="#111" />}
    </svg><p className={styles.fxNote}>{points.length} daily observations. Coverage: {history.points[0].date}–{last!.date}. Missing dates are not filled with invented prices; connecting lines span gaps. {history.retrievedAt ? `History retrieved ${history.retrievedAt.replace("T", " ").replace(/\.\d{3}Z$/, " UTC")}.` : ""}</p>
    <details onToggle={event => setTableOpen(event.currentTarget.open)}><summary>View accessible chart data</summary>{tableOpen && <><div className={styles.chartTable}><table><caption>{names[symbol]} daily-average spot prices · selected range</caption><thead><tr><th scope="col">Date · UTC</th><th scope="col">USD/troy oz</th></tr></thead><tbody>{points.slice(currentPage * 50, (currentPage + 1) * 50).map(p => <tr key={p.date}><th scope="row">{p.date}</th><td>{number(p.price)}</td></tr>)}</tbody></table></div>{pageCount > 1 && <div className={styles.rangeButtons}><button type="button" disabled={currentPage === 0} onClick={() => setTablePage(currentPage - 1)}>Previous</button><span aria-live="polite">Page {currentPage + 1} of {pageCount}</span><button type="button" disabled={currentPage === pageCount - 1} onClick={() => setTablePage(currentPage + 1)}>Next</button></div>}</>}</details>
  </figure>;
}
