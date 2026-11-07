"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDownUp, ArrowUpRight, CircleHelp, RefreshCw } from "lucide-react";
import { change, fxRate, historyChange, metalValue, metalWeight, money, percent, quoteIsFresh, ratio, timestampLabel, todayChange } from "@/lib/metals/math";
import { currencies, emptyHistory, names, type Currency, type History, type Metal, type Snapshot, type Unit } from "@/lib/metals/types";
import type { HubKind } from "@/lib/metals/content";
import styles from "./metals.module.css";

const MetalChart = dynamic(() => import("./metal-chart"), { loading: () => <div className={styles.chartPlaceholder}>Loading chart controls…</div> });
const units: Record<Unit, string> = { oz: "Troy ounces", g: "Grams", kg: "Kilograms" };
function Delta({ value }: { value: ReturnType<typeof change> }) {
  return value ? <span className={value.percent < 0 ? styles.loss : styles.gain}>{value.amount >= 0 ? "+" : "−"}{money(Math.abs(value.amount))} ({percent(value.percent)})</span> : <span>Not available</span>;
}
function CurrencySelect({ value, onChange, id }: { value: Currency; onChange: (c: Currency) => void; id: string }) {
  return <label className={styles.currency} htmlFor={id}>Display currency<select id={id} value={value} onChange={e => onChange(e.target.value as Currency)}>{currencies.map(code => <option key={code}>{code}</option>)}</select></label>;
}
export function MarketDashboard({ initial, kind, navigation }: { initial: Snapshot; kind: HubKind; navigation: ReactNode }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [now, setNow] = useState(Date.parse(initial.retrievedAt));
  const [currency, setCurrency] = useState<Currency>("USD");
  const [failed, setFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState<Record<Metal, History>>({ XAU: emptyHistory(), XAG: emptyHistory() });
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const chartRef = useRef<HTMLElement>(null);
  const retry = useRef<() => void>(() => {});
  const selected: Metal[] = kind === "gold" ? ["XAU"] : ["XAU", "XAG"];
  const rate = fxRate(currency, snapshot.fx, now);
  const selectedFx = snapshot.fx.find(row => row.currency === currency);
  const currentRatio = ratio(snapshot.quotes.XAU, snapshot.quotes.XAG, now);
  useEffect(() => {
    let disposed = false, busy = false;
    const controller = new AbortController();
    async function refresh() {
      if (busy || document.hidden || disposed) return;
      busy = true; setNow(Date.now()); setRefreshing(true);
      try {
        const response = await fetch("/api/metals", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(9000)]) });
        if (!response.ok) throw new Error();
        const data: Snapshot = await response.json();
        if (!data.quotes || !Array.isArray(data.fx) || !Number.isFinite(Date.parse(data.retrievedAt))) throw new Error();
        if (!disposed) {
          setSnapshot(previous => ({ ...data, quotes: { XAU: data.quotes.XAU ?? previous.quotes.XAU, XAG: data.quotes.XAG ?? previous.quotes.XAG } }));
          setFailed(!data.quotes.XAU || (kind === "comparison" && !data.quotes.XAG)); setNow(Date.now());
        }
      } catch { if (!disposed) { setFailed(true); setNow(Date.now()); } }
      finally { busy = false; if (!disposed) setRefreshing(false); }
    }
    retry.current = () => { void refresh(); };
    const visible = () => { if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", visible);
    const timer = setInterval(() => { if (!document.hidden) void refresh(); }, 30000);
    const start = setTimeout(() => { void refresh(); }, 0);
    return () => { disposed = true; controller.abort(); clearTimeout(start); clearInterval(timer); document.removeEventListener("visibilitychange", visible); };
  }, [kind]);
  useEffect(() => {
    const node = chartRef.current;
    if (!node) return;
    let disposed = false;
    const controller = new AbortController();
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect(); setShowCharts(true);
      void fetch("/api/metals/history", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]) }).then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      }).then(data => { if (!disposed && data.XAU && data.XAG) { setHistory(data); setHistoryLoaded(true); } }).catch(() => {
        if (!disposed) { setHistory({ XAU: { ...emptyHistory(), status: "unavailable" }, XAG: { ...emptyHistory(), status: "unavailable" } }); setHistoryLoaded(true); }
      });
    }, { rootMargin: "150px" });
    observer.observe(node);
    return () => { disposed = true; controller.abort(); observer.disconnect(); };
  }, []);
  return <div className={styles.dashboard}>
    <section id="spot-prices" aria-labelledby="spot-heading">
      <div className={styles.sectionBar}><h2 id="spot-heading">{kind === "gold" ? "Gold price today at a glance" : "Gold and silver spot prices today"}</h2><CurrencySelect id="price-currency" value={currency} onChange={setCurrency} /></div>
      <div className={kind === "gold" ? styles.singleQuote : styles.dualQuotes}>
        {selected.map(symbol => {
          const quote = snapshot.quotes[symbol], fresh = quoteIsFresh(quote, now);
          return <div key={symbol} className={`${styles.quote} ${symbol === "XAG" ? styles.silverQuote : ""}`} data-quote={symbol}>
            <div className={styles.quoteTop}><span className={styles.symbol}>{symbol === "XAU" ? "Au" : "Ag"}</span><div><h3>{names[symbol]} <span>{symbol}/USD</span></h3><p>Price per troy ounce · {currency}</p></div><span className={fresh ? styles.status : styles.stale}>{fresh ? "Recently updated" : quote ? "Stale quote" : "Feed unavailable"}</span></div>
            <p className={styles.price}>{quote && rate ? <><span className={styles.priceCurrency}>{currency} </span><span>{new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(quote.price * rate)}</span></> : "Price unavailable"}</p>
            <div className={styles.dailyChange}><span>Today vs UTC open · USD</span><Delta value={todayChange(quote, history[symbol].today, now)} /></div>
            <p className={styles.quoteTime}>{quote ? <>Provider updated <time dateTime={quote.asOf}>{timestampLabel(quote.asOf)}</time></> : "No verified provider timestamp. Please try again later."}</p>
          </div>;
        })}
        {kind === "gold" && <div className={styles.quickConversions}><p className={styles.eyebrow}>Gold, by weight</p>{(["g", "kg"] as const).map(unit => <div key={unit}><span>1 {unit === "g" ? "gram" : "kilogram"}</span><strong>{snapshot.quotes.XAU && rate ? money(metalValue(1, unit, snapshot.quotes.XAU.price, rate), currency) : "Unavailable"}</strong></div>)}<a href="#calculator">Calculate your gold’s value <ArrowUpRight size={16} aria-hidden="true" /></a></div>}
      </div>
      <div className={styles.feedLine}><p>Source: <a href="https://gold-api.com/faqs">Gold API indicative spot feed</a>. Updates checked every 30 seconds while this tab is visible. Provider time means last source fetch, not a trade timestamp. Market-open status and underlying delay are not verified.</p><button type="button" onClick={() => retry.current()} disabled={refreshing}><RefreshCw size={16} aria-hidden="true" />{refreshing ? "Checking…" : "Refresh"}</button></div>
      {failed && <p role="status" className={styles.warning}>Refresh failed for one or more feeds. Any retained quote keeps its original timestamp; it is not a new price.</p>}
      <p className={styles.fxNote}>{currency === "USD" ? "Choose ZAR, EUR or GBP for an estimated local-currency value." : selectedFx && rate ? `${currency} conversions use Frankfurter’s daily USD reference rate dated ${selectedFx.date}, not live FX. Metal moves and currency moves both affect local value.` : `The ${currency} reference rate is unavailable or too old. Choose USD to use the metal feed directly.`} <a href="#data-sources">How our data works</a></p>
    </section>

    {navigation}

    {kind === "comparison" && <section className={styles.ratioCard} id="ratio" aria-labelledby="ratio-heading"><div><p className={styles.eyebrow}>Relative value, not a trading signal</p><h2 id="ratio-heading">The gold-silver ratio</h2><p>Gold ÷ silver, using USD per troy ounce for both metals.</p></div><div className={styles.ratioValue}><strong data-ratio>{currentRatio === null ? "Unavailable" : `${currentRatio.toFixed(2)} : 1`}</strong><span>{currentRatio === null ? "Requires two recent quotes within 60 seconds of each other." : `1 oz of gold ≈ ${currentRatio.toFixed(2)} oz of silver at these spot references.`}</span></div></section>}

    <section id="charts" ref={chartRef} aria-labelledby="chart-heading" className={styles.module}>
      <div className={styles.sectionBar}><div><p className={styles.eyebrow}>See the movement</p><h2 id="chart-heading">{kind === "gold" ? "Gold price chart" : "Gold and silver price charts"}</h2></div><span className={styles.badge}>USD · daily averages · UTC</span></div>
      <p>Historical lines use completed UTC-day average spot prices, not closing prices or futures. Current quotes above are separate. A daily average can hide larger intraday moves.</p>
      {showCharts ? <MetalChart kind={kind} history={history} loaded={historyLoaded} /> : <div className={styles.chartPlaceholder}>Historical chart loads when it approaches the screen.</div>}
      <noscript>Interactive chart controls require JavaScript. Quote timestamps and the source explanation remain available above and below.</noscript>
    </section>

    <section id="calculator" className={styles.module} aria-labelledby="calculator-heading">
      <div className={styles.sectionBar}><div><p className={styles.eyebrow}>Know the spot value</p><h2 id="calculator-heading">{kind === "gold" ? "Gold price calculator" : "Gold and silver value calculators"}</h2></div><ArrowDownUp aria-hidden="true" size={24} /></div>
      <p>{kind === "gold" ? "Convert weight into estimated value, or find how much gold a budget represents. Purity adjusts the metal content; it does not estimate a jeweller’s offer." : "Estimate each metal independently using the same weight convention. A kilogram of silver and a kilogram of gold have the same mass, but very different spot values."}</p>
      <div className={kind === "gold" ? "" : styles.calculatorGrid}>{selected.map(symbol => <ValueCalculator key={symbol} symbol={symbol} snapshot={snapshot} now={now} />)}</div>
      <aside className={styles.warning}><CircleHelp size={20} aria-hidden="true" /><p><strong>Spot value is a starting point.</strong> Results exclude dealer premiums or discounts, buy-sell spreads, assay charges, tax/VAT, shipping, insurance and storage. Tax treatment varies by country and product. A resale offer may be below spot.</p></aside>
    </section>

    <section id="performance" className={styles.module} aria-labelledby="performance-heading"><p className={styles.eyebrow}>A consistent basis</p><h2 id="performance-heading">{kind === "gold" ? "Recent gold-price performance" : "Gold vs silver: performance and conversions"}</h2>
      <p>“Recent” means the last 7 or 30 calendar days, compared using completed daily averages in USD. The baseline is the latest available observation on or before the target date, up to four days earlier. YTD starts from the last available average before 1 January. Missing coverage stays unavailable.</p>
      <div className={styles.tableWrap}><table><caption>Spot quotes, daily-average returns and weight conversions</caption><thead><tr><th scope="col">Measure</th>{selected.map(s => <th scope="col" key={s}>{names[s]}</th>)}</tr></thead><tbody>
        <tr><th scope="row">Latest quote · USD/oz</th>{selected.map(s => <td key={s}>{snapshot.quotes[s] ? money(snapshot.quotes[s]!.price) : "Unavailable"}</td>)}</tr>
        <tr><th scope="row">Today vs UTC open · USD</th>{selected.map(s => <td key={s}><Delta value={todayChange(snapshot.quotes[s], history[s].today, now)} /></td>)}</tr>
        {(["week", "month", "ytd"] as const).map((period, index) => <tr key={period}><th scope="row">{["7-day", "30-day", "Year to date"][index]} · daily-average change</th>{selected.map(s => { const value = historyChange(history[s], period, now); return <td key={s}>{value ? <><span className={value.percent < 0 ? styles.loss : styles.gain}>{percent(value.percent)}</span><small>{value.from} → {value.to}</small></> : "Unavailable"}</td>; })}</tr>)}
        <tr><th scope="row">52-week high / low · USD/oz</th>{selected.map(s => <td key={s}>{history[s].year ? <>{money(history[s].year!.high)} / {money(history[s].year!.low)}<small>Through {new Date(history[s].year!.end * 1000).toISOString().slice(0, 10)} · provider observations</small></> : "Unavailable"}</td>)}</tr>
        {kind === "gold" && <tr><th scope="row">All-time high</th><td>Not asserted: complete market history is not verified.</td></tr>}
        {(["oz", "g", "kg"] as const).map(unit => <tr key={unit}><th scope="row">1 {unit === "oz" ? "troy ounce" : unit === "g" ? "gram" : "kilogram"} · {currency}</th>{selected.map(s => <td key={s}>{snapshot.quotes[s] && rate ? money(metalValue(1, unit, snapshot.quotes[s]!.price, rate), currency) : "Unavailable"}</td>)}</tr>)}
      </tbody></table></div>
      <p className={styles.fxNote}>Today’s change compares the latest quote with the provider’s first observation since 00:00 UTC. It is not a previous-New-York-close return. The 52-week range covers 364 completed days and appears only with sufficient provider coverage. Historical requests are cached for up to 12 hours; today’s opening reference for up to one hour.</p>
    </section>
  </div>;
}

function ValueCalculator({ symbol, snapshot, now }: { symbol: Metal; snapshot: Snapshot; now: number }) {
  const [mode, setMode] = useState("value"), [amount, setAmount] = useState("1"), [unit, setUnit] = useState<Unit>("oz"), [currency, setCurrency] = useState<Currency>("USD"), [purity, setPurity] = useState("1");
  const quote = snapshot.quotes[symbol], rate = fxRate(currency, snapshot.fx, now);
  let result: string | null = null, error = "";
  try {
    if (!quote || !rate) error = "A verified metal quote and currency rate are needed. Choose USD if the currency rate is unavailable.";
    else if (amount.trim() === "") error = "Enter a weight or budget.";
    else {
      const value = Number(amount), fraction = Number(purity);
      result = mode === "value" ? money(metalValue(value, unit, quote.price, rate, fraction), currency) : `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(metalWeight(value, unit, quote.price, rate, fraction))} ${unit === "oz" ? "troy oz" : unit}`;
    }
  } catch (e) { error = e instanceof Error ? e.message : "Check your inputs."; }
  return <div className={styles.calculator} data-calculator={symbol}><h3>{names[symbol]} value</h3><div className={styles.fields}>
    <label>Calculate<select aria-label="Calculate" value={mode} onChange={e => setMode(e.target.value)}><option value="value">Weight → value</option><option value="weight">Budget → weight</option></select></label>
    <label>{mode === "value" ? "Weight" : `Budget (${currency})`}<input type="number" inputMode="decimal" min="0" max="1000000000000" step="any" value={amount} onChange={e => setAmount(e.target.value)} /></label>
    <label>Weight unit<select value={unit} onChange={e => setUnit(e.target.value as Unit)}>{Object.entries(units).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label>
    <CurrencySelect id={`calc-currency-${symbol}`} value={currency} onChange={setCurrency} />
    <label>Purity<select value={purity} onChange={e => setPurity(e.target.value)}>{symbol === "XAU" ? <><option value="1">Pure gold basis (100%)</option><option value="0.9999">999.9 fine (99.99%)</option><option value={22 / 24}>22 karat (91.67%)</option><option value="0.75">18 karat (75%)</option><option value={14 / 24}>14 karat (58.33%)</option></> : <><option value="1">Pure silver basis (100%)</option><option value="0.999">999 fine (99.9%)</option><option value="0.925">Sterling (92.5%)</option></>}</select></label>
  </div><div className={styles.calcResult} aria-live="polite" aria-atomic="true">{error ? <p role="status">{error}</p> : <><span>Estimated {mode === "value" ? "spot metal value" : "metal weight before retail costs"}</span><output>{result}</output></>}</div>
    <p className={styles.fxNote}>{quote ? `${quoteIsFresh(quote, now) ? "Reference quote" : "Stale reference quote — estimate only"}: ${timestampLabel(quote.asOf)}. ` : ""}{currency !== "USD" && snapshot.fx.find(f => f.currency === currency) ? `FX reference date: ${snapshot.fx.find(f => f.currency === currency)!.date}. ` : ""}Uses unrounded inputs; display values are rounded.</p>
  </div>;
}
