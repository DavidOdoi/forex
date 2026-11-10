import { Temporal } from "@js-temporal/polyfill";
import { sessions, weeklyMarket, type SessionDefinition } from "./config";

export type Interval = { start: number; end: number };
export type SessionWindow = Interval & { session: string; localDate: string; clipped: boolean };
export const HOUR = 3_600_000;
export function isTimezone(zone: string): boolean {
  if (zone !== "UTC" && !/^[A-Za-z_+-]+(?:\/[A-Za-z0-9_+-]+)+$/.test(zone)) return false;
  try { new Intl.DateTimeFormat("en", { timeZone: zone }).format(0); Temporal.Instant.fromEpochMilliseconds(0).toZonedDateTimeISO(zone); return true; }
  catch { return false; }
}
export function isDate(value: string): boolean {
  if (!/^(19|20)\d{2}-\d{2}-\d{2}$/.test(value)) return false;
  try { return Temporal.PlainDate.from(value).toString() === value; } catch { return false; }
}
export function dateAt(instant: number, zone: string): string {
  return Temporal.Instant.fromEpochMilliseconds(instant).toZonedDateTimeISO(zone).toPlainDate().toString();
}
export function addDays(date: string, days: number): string { return Temporal.PlainDate.from(date).add({ days }).toString(); }
// Compatible disambiguation: earlier occurrence for repeated times; shift a
// nonexistent wall time forward by its gap. UI explains availability adjustments.
export function localTime(date: string, time: string, zone: string): number {
  return Temporal.PlainDate.from(date).toPlainDateTime(time).toZonedDateTime(zone, { disambiguation: "compatible" }).epochMilliseconds;
}
export function dayBounds(date: string, zone: string): Interval {
  const day = Temporal.PlainDate.from(date);
  // startOfDay also handles zones whose clock changes at midnight.
  const start = day.toZonedDateTime(zone).startOfDay().epochMilliseconds;
  const end = day.add({ days: 1 }).toZonedDateTime(zone).startOfDay().epochMilliseconds;
  return { start, end };
}
export function intersect(a: Interval, b: Interval): Interval | null {
  const start = Math.max(a.start, b.start), end = Math.min(a.end, b.end);
  return start < end ? { start, end } : null;
}
export function overlaps(left: readonly Interval[], right: readonly Interval[]): Interval[] {
  return left.flatMap(a => right.flatMap(b => { const value = intersect(a, b); return value ? [value] : []; })).sort((a, b) => a.start - b.start);
}
export function contains(window: Interval, instant: number) { return window.start <= instant && instant < window.end; }
export function sessionOccurrence(def: SessionDefinition, date: string): Interval | null {
  if (!def.weekdays.includes(Temporal.PlainDate.from(date).dayOfWeek)) return null;
  return { start: localTime(date, def.start, def.zone), end: localTime(def.end <= def.start ? addDays(date, 1) : date, def.end, def.zone) };
}
export function marketWeeks(range: Interval): Interval[] {
  const local = Temporal.PlainDate.from(dateAt(range.start, weeklyMarket.zone));
  const sunday = local.subtract({ days: (local.dayOfWeek - weeklyMarket.openDay + 7) % 7 });
  const result: Interval[] = [];
  for (let day = sunday; ; day = day.add({ days: 7 })) {
    const start = localTime(day.toString(), weeklyMarket.time, weeklyMarket.zone);
    if (start >= range.end) break;
    const end = localTime(day.add({ days: (weeklyMarket.closeDay - weeklyMarket.openDay + 7) % 7 }).toString(), weeklyMarket.time, weeklyMarket.zone);
    if (end > range.start) result.push({ start, end });
  }
  return result;
}
export function weeklyStatus(now: number) {
  const weeks = marketWeeks({ start: now - 7 * 24 * HOUR, end: now + 8 * 24 * HOUR });
  const active = weeks.find(w => contains(w, now));
  return { open: !!active, next: active?.end ?? weeks.find(w => w.start > now)!.start };
}
export function sessionWindows(range: Interval, definitions: readonly SessionDefinition[] = sessions): SessionWindow[] {
  const weeks = marketWeeks(range);
  return definitions.flatMap(def => {
    const result: SessionWindow[] = [];
    // An occurrence starting the previous local date can extend into the range.
    const first = addDays(dateAt(range.start, def.zone), -1);
    const last = addDays(dateAt(range.end, def.zone), 1);
    for (let date = first; date <= last; date = addDays(date, 1)) {
      const raw = sessionOccurrence(def, date);
      if (!raw) continue;
      for (const week of weeks) {
        const window = intersect(raw, week);
        if (window && intersect(window, range)) result.push({ ...window, session: def.id, localDate: date, clipped: window.start !== raw.start || window.end !== raw.end });
      }
    }
    return result;
  }).sort((a, b) => a.start - b.start);
}
export function sessionState(windows: readonly SessionWindow[], id: string, now: number) {
  const occurrences = windows.filter(w => w.session === id);
  const active = occurrences.find(w => contains(w, now));
  const occurrence = active ?? occurrences.find(w => w.start > now);
  return { open: !!active, occurrence, next: active?.end ?? occurrence?.start };
}
export function pairOverlaps(windows: readonly SessionWindow[]) {
  return sessions.flatMap((left, i) => sessions.slice(i + 1).flatMap(right =>
    overlaps(windows.filter(w => w.session === left.id), windows.filter(w => w.session === right.id))
      .map(w => ({ ...w, label: `${left.name}–${right.name}` }))));
}
export function selectedWindows(windows: readonly SessionWindow[], members: readonly string[]): Interval[] {
  let selected: Interval[] = windows.filter(w => w.session === members[0]);
  for (const member of members.slice(1)) selected = overlaps(selected, windows.filter(w => w.session === member));
  return selected;
}
export function plan(date: string, zone: string, members: readonly string[]) {
  if (!isDate(date) || !isTimezone(zone) || !members.length || members.some(id => !sessions.some(s => s.id === id))) throw new Error("Choose a valid date, timezone and session.");
  const day = dayBounds(date, zone);
  const windows = sessionWindows(day);
  const selected = selectedWindows(windows, members);
  return { day, windows, selected: selected.filter(w => intersect(w, day)), allOverlaps: pairOverlaps(windows).filter(w => intersect(w, day)) };
}
export function availability(date: string, zone: string, start: string, end: string): Interval {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(end)) throw new Error("Enter both availability times.");
  if (start === end) throw new Error("Availability start and end must differ. Equal times do not imply 24 hours.");
  const result = { start: localTime(date, start, zone), end: localTime(end < start ? addDays(date, 1) : date, end, zone) };
  if (result.end <= result.start) throw new Error("These wall times leave no positive availability after the daylight saving adjustment. Choose different times.");
  return result;
}
export function wallTime(instant: number, zone: string): string {
  return Temporal.Instant.fromEpochMilliseconds(instant).toZonedDateTimeISO(zone).toPlainTime().toString({ smallestUnit: "minute" });
}
export function offset(instant: number, zone: string): string {
  return "UTC" + Temporal.Instant.fromEpochMilliseconds(instant).toZonedDateTimeISO(zone).offset;
}
export function formatTime(instant: number, zone: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(instant) + ` (${offset(instant, zone)})`;
}
export function countdown(now: number, next: number): string {
  const seconds = Math.max(0, Math.ceil((next - now) / 1000));
  const days = Math.floor(seconds / 86400), hours = Math.floor(seconds % 86400 / 3600), minutes = Math.floor(seconds % 3600 / 60);
  return `${days ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds % 60}s`;
}
/** Compare the same session-local weekday, avoiding adjacent visitor dates. */
export function offsetChanges(windows: readonly SessionWindow[], today: string, viewerZone: string): string[] {
  return [...new Set(windows.flatMap(window => {
    const def = sessions.find(s => s.id === window.session)!;
    const anchor = Temporal.PlainDate.from(dateAt(localTime(today, "12:00", viewerZone), def.zone));
    const weekday = Temporal.PlainDate.from(window.localDate).dayOfWeek;
    const equivalent = anchor.add({ days: (weekday - anchor.dayOfWeek + 7) % 7 }).toString();
    const baseline = sessionOccurrence(def, equivalent)!;
    const future = sessionOccurrence(def, window.localDate)!;
    const changes: string[] = [];
    for (const [zone, label] of [[def.zone, def.name], [viewerZone, "Your timezone"]]) {
      if (offset(baseline.start, zone) !== offset(future.start, zone) || offset(baseline.end, zone) !== offset(future.end, zone)) changes.push(`${label}: ${offset(baseline.start, zone)} → ${offset(future.start, zone)} for the equivalent ${def.name} weekday occurrence.`);
    }
    return changes;
  }))];
}
