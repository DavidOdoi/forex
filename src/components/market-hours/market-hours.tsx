"use client";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Clock3, Globe2, ArrowRight } from "lucide-react";
import { sessions, windowChoices } from "@/lib/market-hours/config";
import { HOUR, availability, countdown, dateAt, formatTime, intersect, isDate, isTimezone, offset, offsetChanges, overlaps, plan, selectedWindows, sessionState, sessionWindows, wallTime, weeklyStatus, type Interval } from "@/lib/market-hours/time";
import { useClock, useClockDate } from "./clock";
import styles from "./market-hours.module.css";

const storageKey = "devin-forex-market-hours-timezone";
export function browserTimezone(): string {
  try { const zone = Intl.DateTimeFormat().resolvedOptions().timeZone; return isTimezone(zone) ? zone : "UTC"; } catch { return "UTC"; }
}
function WindowTime({ window, zone }: { window: Interval; zone: string }) {
  return <><time dateTime={new Date(window.start).toISOString()}>{formatTime(window.start, zone)}</time><span className={styles.to}>to</span><time dateTime={new Date(window.end).toISOString()}>{formatTime(window.end, zone)}</time></>;
}
function LiveClock({ zone }: { zone: string }) {
  const now = useClock();
  const utcDay = now === null ? null : dateAt(now, "UTC");
  const windows = useMemo(() => utcDay ? sessionWindows({ start: Date.parse(`${utcDay}T00:00:00Z`) - 24 * HOUR, end: Date.parse(`${utcDay}T00:00:00Z`) + 9 * 24 * HOUR }) : [], [utcDay]);
  if (now === null) return <section className={styles.loading} aria-label="Live clock loading"><Clock3 aria-hidden="true" /><h2>Live forex market hours</h2><p>Loading your clock. Reference hours and methodology are available below; JavaScript is needed for live status.</p></section>;
  const market = weeklyStatus(now);
  return <section aria-labelledby="live-heading" className={styles.live}>
    <div className={styles.market}>
      <div><p className={styles.eyebrow} id="live-heading">Conventional forex week</p><h2 data-weekly-status>{market.open ? "Market week open" : "Market week closed"}</h2><p>Broker and instrument hours can differ.</p></div>
      <div className={styles.marketEvent}><strong>{market.open ? "Closes" : "Reopens"} <time dateTime={new Date(market.next).toISOString()}>{formatTime(market.next, zone)}</time></strong><p aria-live="off" data-market-countdown>In {countdown(now, market.next)}</p><small>Calculated from your device clock · {zone}</small></div>
    </div>
    <div className={styles.cards}>{sessions.map(session => {
      const status = sessionState(windows, session.id, now);
      return <article className={styles.card} key={session.id} data-session-card={session.id}>
        <div className={styles.cardHeading}><h3>{session.name}</h3><span className={status.open ? styles.open : styles.closed}>{status.open ? "Open" : "Closed"}</span></div>
        <p className={styles.zone}>{session.zone} · {offset(now, session.zone)}</p>
        <p className={styles.small}>{status.open ? "Current window" : "Next window"} in {zone}</p>
        {status.occurrence ? <><div className={styles.dates}><WindowTime window={status.occurrence} zone={zone} /></div><p className={styles.countdown} aria-live="off">{status.open ? "Closes" : "Opens"} in {countdown(now, status.next!)}</p>{status.occurrence.clipped && <p className={styles.small}>Adjusted to the weekly market boundary.</p>}</> : <p>No upcoming window found.</p>}
      </article>;
    })}</div>
  </section>;
}
function NowMarker({ day }: { day: Interval }) {
  const now = useClock();
  if (now === null || now < day.start || now >= day.end) return null;
  return <span className={styles.nowMarker} style={{ left: `${(now - day.start) / (day.end - day.start) * 100}%` }} aria-hidden="true"><span>Now</span></span>;
}
function TimezoneOffset({ zone }: { zone: string }) {
  const now = useClock();
  return <p className={styles.small}>{now === null ? "The reference schedule below uses session-local times." : `${offset(now, zone)} now · Future offsets appear beside each result.`}</p>;
}
function Timeline({ result, zone }: { result: ReturnType<typeof plan>; zone: string }) {
  const { day, windows, allOverlaps } = result;
  const duration = day.end - day.start;
  const position = (window: Interval): CSSProperties => {
    const clipped = intersect(window, day)!;
    return { left: `${(clipped.start - day.start) / duration * 100}%`, width: `${(clipped.end - clipped.start) / duration * 100}%` };
  };
  return <section className={styles.timeline} aria-labelledby="timeline-heading">
    <div className={styles.sectionHeading}><h3 id="timeline-heading">The selected day, at a glance</h3><span>{duration / HOUR} elapsed hours</span></div>
    <p className={styles.small}>Bars show the part inside this calendar day. Stripes mark overlaps. The table below gives full opening and closing dates. DST days use their actual elapsed length.</p>
    {duration > 0 ? <div className={styles.timelineScroll} role="region" aria-label="Session timeline; full text equivalent follows" tabIndex={0}>
      <div className={styles.timelineInner}>
        <div className={styles.axis} aria-hidden="true"><span /> <div>{[0, .25, .5, .75, 1].map(part => { const instant = day.start + duration * part; return <span key={part}><b>{wallTime(instant, zone)}</b><small>{offset(instant, zone)}</small></span>; })}</div></div>
        <div className={styles.tracks} aria-hidden="true">{sessions.map(session => <div key={session.id} className={styles.track}><span>{session.name}</span><div>{windows.filter(w => w.session === session.id).map(w => <span className={styles.bar} style={position(w)} key={w.start} />)}</div></div>)}<div className={styles.track}><span>Overlaps</span><div>{allOverlaps.map(w => <span className={styles.overlapBar} key={`${w.label}-${w.start}`} style={position(w)} />)}</div></div><div className={styles.markerArea}><NowMarker day={day} /></div></div>
      </div>
    </div> : <p>This calendar date is skipped by this timezone’s clock change; it has no session windows.</p>}
    <div className={styles.tableScroll} role="region" aria-label="Session windows in selected timezone" tabIndex={0}><table><caption>Session windows intersecting the selected day · {zone}</caption><thead><tr><th scope="col">Session</th><th scope="col">Opening → closing</th></tr></thead><tbody>{windows.length ? windows.map(w => <tr key={`${w.session}-${w.start}`}><th scope="row">{sessions.find(s => s.id === w.session)!.name}{w.clipped && <small>Weekly boundary applied</small>}</th><td><WindowTime window={w} zone={zone} /></td></tr>) : <tr><td colSpan={2}>No sessions intersect this date under the weekly convention.</td></tr>}</tbody></table></div>
    <details className={styles.overlapList}><summary>All overlaps on this date ({allOverlaps.length})</summary>{allOverlaps.length ? allOverlaps.map(w => <p key={`${w.label}-${w.start}`}><strong>{w.label}</strong><WindowTime window={w} zone={zone} /></p>) : <p>No session overlaps intersect this date.</p>}</details>
  </section>;
}
function Planner({ zone, initialDate }: { zone: string; initialDate: string }) {
  const [date, setDate] = useState(initialDate);
  const [choice, setChoice] = useState("london-new-york");
  const [useAvailability, setUseAvailability] = useState(false);
  const [start, setStart] = useState("18:00");
  const [end, setEnd] = useState("22:00");
  const selected = windowChoices.find(c => c.id === choice)!;
  const result = useMemo(() => isDate(date) ? plan(date, zone, selected.members) : null, [date, zone, selected]);
  const changes = useMemo(() => result ? offsetChanges(result.windows.filter(w => selected.members.some(id => id === w.session)), initialDate, zone) : [], [result, selected, initialDate, zone]);
  let available: Interval | undefined, error = "";
  if (useAvailability && result) {
    try { available = availability(date, zone, start, end); } catch (e) { error = (e as Error).message; }
  }
  const fits = available ? overlaps(selectedWindows(sessionWindows(available), selected.members), [available]) : [];
  const adjusted = available && (wallTime(available.start, zone) !== start || wallTime(available.end, zone) !== end);
  return <section id="session-planner" className={styles.planner} aria-labelledby="planner-heading">
    <div className={styles.sectionHeading}><h2 id="planner-heading">Plan a forex session</h2><span>Future dates · Your timezone</span></div>
    <p>Show intervals intersecting this calendar day in the selected timezone. Full windows can begin the previous day or finish the next day.</p>
    <div className={styles.plannerGrid}>
      <div className={styles.fields}>
        <label>Planning date<input type="date" min="1900-01-01" max="2099-12-31" value={date} onChange={e => setDate(e.target.value)} aria-describedby="planning-date-help" /></label>
        <p id="planning-date-help" className={styles.small}>The date is in {zone}, independent of each session’s local date.</p>
        <label>Session or overlap<select value={choice} onChange={e => setChoice(e.target.value)}>{windowChoices.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
        <label className={styles.check}><input type="checkbox" checked={useAvailability} onChange={e => setUseAvailability(e.target.checked)} />Compare my available hours</label>
        {useAvailability && <fieldset><legend>Availability in {zone}</legend><div className={styles.timeFields}><label>Available from<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label><label>Available until<input type="time" value={end} onChange={e => setEnd(e.target.value)} /></label></div><p className={styles.small}>An end before the start means the following day. Overnight matching includes sessions on that following day, too.</p><p className={styles.small}>During a repeated hour we use its earlier occurrence. A skipped time moves forward by the clock-change gap; check the resolved dates below.</p></fieldset>}
      </div>
      <div className={styles.results} aria-live="polite" aria-atomic="true">
        <p className={styles.eyebrow}>Your planned window</p><h3>{selected.label}</h3>
        {!result ? <p role="alert">Choose a valid date between 1900 and 2099.</p> : <>
          {result.selected.length ? result.selected.map(w => <div key={w.start} className={styles.resultWindow}><WindowTime window={w} zone={zone} /><strong>{Number(((w.end - w.start) / HOUR).toFixed(2))} elapsed hours</strong></div>) : <p data-no-window>No {selected.label.toLowerCase()} intersects this date. Weekly closure or non-overlapping session conventions can leave no window.</p>}
          {useAvailability && <div className={styles.fit}><h4>Your availability</h4>{error ? <p role="alert">{error}</p> : available && <><WindowTime window={available} zone={zone} />{adjusted && <p>A skipped wall time was moved forward for daylight saving. The resolved times above are used.</p>}{fits.length ? <><p>Your availability overlaps the {selected.label.toLowerCase()}.</p>{fits.map(w => <p key={w.start}><WindowTime window={w} zone={zone} /></p>)}</> : <p>No overlap with your availability. Try different hours or another date.</p>}</>}</div>}
          {changes.length > 0 && <aside className={styles.dstNote}><h4>Date-specific offset changes</h4><p>Compared with the equivalent session-local weekday on or after today ({initialDate}), these UTC offsets change. A local-time comparison may shift.</p><ul>{changes.map(change => <li key={change}>{change}</li>)}</ul></aside>}
        </>}
      </div>
    </div>
    {result && <Timeline result={result} zone={zone} />}
  </section>;
}
export function MarketHours() {
  const [zone, setZone] = useState("UTC");
  const [draftZone, setDraftZone] = useState("UTC");
  const today = useClockDate(zone);
  const [message, setMessage] = useState("");
  const [zones, setZones] = useState<string[]>(["UTC", ...sessions.map(s => s.zone)]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
    let detected = browserTimezone();
    let notice = detected === "UTC" ? "Using UTC. You can choose any supported IANA timezone." : "Browser timezone detected without location access.";
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && isTimezone(saved)) { detected = saved; notice = "Your saved timezone is selected."; }
      else if (saved) notice = "Your saved timezone was invalid; using your browser timezone (or UTC).";
    } catch { notice += " Preference storage is unavailable."; }
    setZone(detected); setDraftZone(detected); setMessage(notice);
    if (typeof Intl.supportedValuesOf === "function") setZones([...new Set(["UTC", detected, ...Intl.supportedValuesOf("timeZone")])].sort());
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  function choose(next: string) {
    if (!isTimezone(next)) { setMessage("Choose a valid IANA timezone, such as Africa/Nairobi, Asia/Kathmandu or UTC."); return; }
    setZone(next); setDraftZone(next); setMessage(`Showing times in ${next}.`);
    try { localStorage.setItem(storageKey, next); } catch { setMessage(`Showing times in ${next}. Preference storage is unavailable.`); }
  }
  return <div className={styles.tool}>
    <section className={styles.timezone} aria-label="Timezone settings">
      <div><p className={styles.eyebrow}><Globe2 size={16} aria-hidden="true" />Your timezone</p><strong data-selected-zone>{today ? zone : "Detecting timezone…"}</strong><TimezoneOffset zone={zone} /></div>
      <form onSubmit={e => { e.preventDefault(); choose(draftZone.trim()); }}><label htmlFor="timezone-search">Search timezones</label><div className={styles.zoneControls}><input id="timezone-search" list="market-timezones" value={draftZone} onChange={e => setDraftZone(e.target.value)} autoComplete="off" spellCheck={false} aria-describedby="timezone-help" /><datalist id="market-timezones">{zones.map(z => <option key={z} value={z} />)}</datalist><button type="submit">Apply <ArrowRight size={16} aria-hidden="true" /></button></div><button className={styles.textButton} type="button" onClick={() => choose(browserTimezone())}>Use my timezone</button></form>
      <p id="timezone-help" className={styles.small} role="status">{message || "Live status starts after your browser clock is available."}</p>
    </section>
    <LiveClock zone={zone} />
    {today ? <Planner zone={zone} initialDate={today} /> : <section className={styles.loading}><h2>Plan a forex session</h2><p>Enable JavaScript to choose a date, convert timezones and compare your availability.</p></section>}
  </div>;
}
