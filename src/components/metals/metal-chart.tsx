"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Download, ArrowUpRight, ArrowDownRight, Clock3 } from "lucide-react";
import { DAY, percent } from "@/lib/metals/math";
import { names, type History, type Metal, type Point } from "@/lib/metals/types";
import type { HubKind } from "@/lib/metals/content";
import styles from "./metals.module.css";

const ranges = [
  { label: "24H", days: 1 }, { label: "7D", days: 7 }, { label: "30D", days: 30 },
  { label: "6M", days: 183 }, { label: "1Y", days: 365 }, { label: "5Y", days: 1826 },
  { label: "All", days: Infinity },
];

export default function MetalChart({ kind, history, loaded }: {
  kind: HubKind; history: Record<Metal, History>; loaded: boolean;
}) {
  const [range, setRange] = useState(2);
  const selected: Metal[] = kind === "gold" ? ["XAU"] : ["XAU", "XAG"];
  return <div>
    <div className={styles.chartToolbar}>
      <div className={styles.rangeButtons} role="group" aria-label="Chart timeframe">
        {ranges.filter(r => kind === "gold" || r.label !== "All").map(r => <button
          key={r.label} type="button" aria-pressed={ranges[range].label === r.label}
          onClick={() => setRange(ranges.indexOf(r))}>{r.label}</button>)}
      </div>
      <span className={styles.chartConvention}><Clock3 size={13} aria-hidden="true" />Completed UTC days</span>
    </div>
    {range === 0 ? <div className={styles.chartPlaceholder}><Clock3 size={27} aria-hidden="true" /><strong>Intraday history is not connected</strong><p>24-hour intraday history is not available from the connected free daily-data plan. Choose 7D or longer; no intraday movement is inferred from daily averages.</p></div>
      : <div className={kind === "gold" ? "" : styles.chartGrid}>{selected.map(symbol => <Chart
        key={symbol} symbol={symbol} history={history[symbol]} days={ranges[range].days} loaded={loaded} />)}</div>}
  </div>;
}

function sample(points: Point[]) {
  if (points.length <= 320) return points;
  const result = [points[0]], step = Math.ceil((points.length - 2) / 150);
  for (let i = 1; i < points.length - 1; i += step) {
    const group = points.slice(i, Math.min(i + step, points.length - 1));
    const low = group.reduce((a, b) => a.price < b.price ? a : b);
    const high = group.reduce((a, b) => a.price > b.price ? a : b);
    result.push(...[low, high].filter((p, i, a) => a.indexOf(p) === i).sort((a, b) => a.date.localeCompare(b.date)));
  }
  return [...result, points[points.length - 1]];
}

function downloadCsv(points: Point[], symbol: Metal) {
  const rows = ["date_utc,average_usd_per_troy_ounce,metal,source", ...points.map(p => `${p.date},${p.price},${symbol},https://gold-api.com/`)];
  const url = URL.createObjectURL(new Blob([rows.join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url;
  link.download = `${symbol.toLowerCase()}-daily-averages-${points[0].date}-to-${points[points.length - 1].date}.csv`;
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const number = (n: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const shortDate = (date: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));

function Chart({ symbol, history, days, loaded }: { symbol: Metal; history: History; days: number; loaded: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [hover, setHover] = useState<Point | null>(null);
  const [tablePage, setTablePage] = useState(0), [tableOpen, setTableOpen] = useState(false);
  const figureRef = useRef<HTMLElement>(null), [width, setWidth] = useState(700);
  useEffect(() => {
    if (!figureRef.current) return;
    const observer = new ResizeObserver(entries => {
      const size = entries[0]?.contentRect.width;
      if (size) setWidth(Math.max(220, Math.round(size)));
    });
    observer.observe(figureRef.current);
    return () => observer.disconnect();
  }, [history.points.length]);
  const points = useMemo(() => {
    const last = history.points.at(-1);
    if (!last) return [];
    const end = Date.parse(last.date);
    return history.points.filter(p => Date.parse(p.date) >= end - days * DAY);
  }, [history.points, days]);
  const visible = useMemo(() => sample(points), [points]);
  if (points.length < 2) return <div className={styles.chartPlaceholder}><Clock3 size={25} aria-hidden="true" /><strong>{names[symbol]} history {loaded ? "unavailable" : "loading…"}</strong><p>{loaded ? "We do not have verified historical observations to draw this chart. Current quotes and calculators work independently; no sample prices or invented line are displayed." : "Retrieving the provider’s cached daily observations."}</p></div>;

  const first = points[0], last = points[points.length - 1];
  const low = Math.min(...points.map(p => p.price)), high = Math.max(...points.map(p => p.price));
  const span = high - low || high * 0.01, padding = span * 0.08;
  const domainLow = Math.max(0, low - padding), domainHigh = high + padding;
  const left = 54, right = width - 14, top = 24, bottom = 238;
  const x0 = Date.parse(first.date), end = Date.parse(last.date), duration = end - x0 || 1;
  const x = (p: Point) => left + (Date.parse(p.date) - x0) / duration * (right - left);
  const y = (p: Point) => bottom - (p.price - domainLow) / (domainHigh - domainLow) * (bottom - top);
  const path = visible.map((p, i) => `${i ? "L" : "M"}${x(p).toFixed(2)},${y(p).toFixed(2)}`).join(" ");
  const area = `${path} L${x(last)},${bottom} L${x(first)},${bottom} Z`;
  const active = hover && hover.date >= first.date && hover.date <= last.date ? hover : last;
  const pageCount = Math.ceil(points.length / 50), currentPage = Math.min(tablePage, pageCount - 1);
  const periodChange = Number(((last.price / first.price - 1) * 100).toFixed(2));
  const colour = symbol === "XAU" ? "#98701f" : "#456583";
  const ticks = width < 480 ? [0, 1] : [0, 0.5, 1];
  const axisNumber = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: n >= 100 ? 0 : 2, ...(n >= 100000 ? { notation: "compact" as const } : {}) }).format(n);
  return <figure ref={figureRef} className={`${styles.chartFigure} ${symbol === "XAG" ? styles.silverChart : ""}`}>
    <figcaption>
      <div className={styles.chartInstrument}><span className={`${styles.metalDot} ${symbol === "XAG" ? styles.silverDot : ""}`} aria-hidden="true" /><strong>{names[symbol]} <span>USD / troy oz</span></strong><button type="button" className={styles.downloadButton} aria-label={`Download ${names[symbol]} chart data (CSV)`} onClick={() => downloadCsv(points, symbol)}><Download size={15} aria-hidden="true" /><span>CSV</span></button></div>
      <div className={styles.chartValue}><strong>USD {number(active.price)}</strong><span className={periodChange === 0 ? styles.neutral : periodChange < 0 ? styles.loss : styles.gain}>{periodChange < 0 ? <ArrowDownRight size={15} aria-hidden="true" /> : periodChange > 0 ? <ArrowUpRight size={15} aria-hidden="true" /> : null}{periodChange === 0 ? "0.00%" : percent(periodChange)}<small>selected range</small></span></div>
      <span className={styles.chartAsOf}>{shortDate(active.date)} · daily average</span>
    </figcaption>
    <svg viewBox={`0 0 ${width} 278`} role="img" aria-labelledby={`${id}-title ${id}-desc`} onPointerLeave={() => setHover(null)} onPointerMove={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      const target = x0 + Math.max(0, Math.min(1, (event.clientX - rect.left - rect.width * left / width) / (rect.width * (right - left) / width))) * duration;
      let a = 0, b = points.length - 1;
      while (a < b) { const middle = Math.floor((a + b) / 2); if (Date.parse(points[middle].date) < target) a = middle + 1; else b = middle; }
      const before = points[Math.max(0, a - 1)], after = points[a];
      setHover(Math.abs(Date.parse(before.date) - target) < Math.abs(Date.parse(after.date) - target) ? before : after);
    }}>
      <title id={`${id}-title`}>{names[symbol]} price chart, {first.date} to {last.date}</title>
      <desc id={`${id}-desc`}>Daily-average spot prices in US dollars per troy ounce. Range {number(low)} to {number(high)}. A full accessible data table follows.</desc>
      <defs><linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={colour} stopOpacity=".17" /><stop offset="100%" stopColor={colour} stopOpacity=".015" /></linearGradient></defs>
      {[0, 1 / 3, 2 / 3, 1].map((fraction, i) => { const price = domainLow + (domainHigh - domainLow) * fraction, pos = bottom - (bottom - top) * fraction; return <g key={i}><line x1={left} x2={right} y1={pos} y2={pos} stroke="#e8e9eb" strokeDasharray="3 5" /><text x={left - 9} y={pos + 4} textAnchor="end" fill="#59616b" fontSize="12">{axisNumber(price)}</text></g>; })}
      <path d={area} fill={`url(#${id}-fill)`} />
      <path d={path} fill="none" stroke={colour} strokeWidth="2.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      {ticks.map((fraction, i) => { const date = new Date(x0 + duration * fraction); return <text key={i} x={left + (right - left) * fraction} y="268" textAnchor={fraction === 0 ? "start" : fraction === 1 ? "end" : "middle"} fontSize="12" fill="#59616b">{new Intl.DateTimeFormat("en-GB", { ...(days > 365 ? { year: "numeric" as const } : { day: "numeric" as const }), month: "short", timeZone: "UTC" }).format(date)}</text>; })}
      {hover ? <g><line x1={x(active)} x2={x(active)} y1={top} y2={bottom} stroke={colour} strokeDasharray="3 4" opacity=".6" /><circle cx={x(active)} cy={y(active)} r="5" fill={colour} stroke="#fff" strokeWidth="2" /></g> : <circle cx={x(last)} cy={y(last)} r="3.5" fill={colour} stroke="#fff" strokeWidth="1.5" />}
    </svg>
    <dl className={styles.chartStats}><div><dt>Range low</dt><dd>{number(low)}</dd></div><div><dt>Range high</dt><dd>{number(high)}</dd></div><div><dt>Observations</dt><dd>{points.length.toLocaleString("en-US")}</dd></div></dl>
    <p className={styles.chartDates}>{first.date} → {last.date} · USD / troy oz</p>
    <details className={styles.coverageDetails}><summary>Source & coverage</summary><p className={styles.fxNote}>Gold API daily averages. Available coverage: {history.points[0].date}–{last.date}. Missing dates are not filled with invented prices; connecting lines span gaps. {history.retrievedAt ? `History retrieved ${history.retrievedAt.replace("T", " ").replace(/\.\d{3}Z$/, " UTC")}.` : ""} Selected-range percentage compares the first and last displayed daily averages; it is not an investment return.</p></details>
    <details className={styles.accessibleDetails} onToggle={event => setTableOpen(event.currentTarget.open)}><summary>View accessible chart data</summary>{tableOpen && <><div className={styles.chartTable}><table><caption>{names[symbol]} daily-average spot prices · selected range</caption><thead><tr><th scope="col">Date · UTC</th><th scope="col">USD/troy oz</th></tr></thead><tbody>{points.slice(currentPage * 50, (currentPage + 1) * 50).map(p => <tr key={p.date}><th scope="row">{p.date}</th><td>{number(p.price)}</td></tr>)}</tbody></table></div>{pageCount > 1 && <div className={styles.pagination}><button type="button" disabled={currentPage === 0} onClick={() => setTablePage(currentPage - 1)}>Previous</button><span aria-live="polite">Page {currentPage + 1} of {pageCount}</span><button type="button" disabled={currentPage === pageCount - 1} onClick={() => setTablePage(currentPage + 1)}>Next</button></div>}</>}</details>
  </figure>;
}
