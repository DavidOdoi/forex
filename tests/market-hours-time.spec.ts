import { test, expect } from "@playwright/test";
import { sessions, type SessionDefinition } from "../src/lib/market-hours/config";
import { HOUR, addDays, availability, contains, countdown, dateAt, dayBounds, formatTime, intersect, isDate, isTimezone, localTime, offset, offsetChanges, overlaps, plan, selectedWindows, sessionOccurrence, sessionState, sessionWindows, wallTime, weeklyStatus } from "../src/lib/market-hours/time";

const instant = (value: string) => Date.parse(value);
const iso = (value: number) => new Date(value).toISOString();
const def = (id: string) => sessions.find(s => s.id === id)!;

test("weekday schedule uses each city's local clock and nine-hour conventions", () => {
  const expected = { sydney: ["2026-01-19T21:00:00.000Z", "2026-01-20T06:00:00.000Z"], tokyo: ["2026-01-20T00:00:00.000Z", "2026-01-20T09:00:00.000Z"], london: ["2026-01-20T08:00:00.000Z", "2026-01-20T17:00:00.000Z"], "new-york": ["2026-01-20T13:00:00.000Z", "2026-01-20T22:00:00.000Z"] };
  for (const session of sessions) {
    const w = sessionOccurrence(session, "2026-01-20")!;
    expect([iso(w.start), iso(w.end)]).toEqual(expected[session.id]);
    expect(w.end - w.start).toBe(9 * HOUR);
    expect(sessionOccurrence(session, "2026-01-17")).toBeNull();
  }
});
for (const [day, close] of [["2026-01-16", "22:00"], ["2026-07-17", "21:00"]]) {
  test(`weekly close is half-open, DST-aware and closes all sessions on ${day}`, () => {
    const end = instant(`${day}T${close}:00Z`);
    expect(weeklyStatus(end - 1)).toEqual({ open: true, next: end });
    expect(weeklyStatus(end).open).toBe(false);
    const windows = sessionWindows({ start: end - 24 * HOUR, end: end + 9 * 24 * HOUR });
    for (const s of sessions) expect(sessionState(windows, s.id, end).open).toBe(false);
  });
}
for (const [day, open] of [["2026-03-08", "21:00"], ["2026-11-01", "22:00"]]) {
  test(`Sunday reopening uses New York offset after its DST transition on ${day}`, () => {
    const start = instant(`${day}T${open}:00Z`);
    expect(weeklyStatus(start - 1)).toEqual({ open: false, next: start });
    expect(weeklyStatus(start).open).toBe(true);
  });
}
test("session boundaries, next occurrence and countdown agree exactly", () => {
  const bounds = dayBounds("2026-01-20", "UTC");
  const windows = sessionWindows({ start: bounds.start, end: bounds.end + 8 * 24 * HOUR });
  const start = instant("2026-01-20T08:00:00Z"), end = start + 9 * HOUR;
  expect(sessionState(windows, "london", start - 1).open).toBe(false);
  expect(sessionState(windows, "london", start)).toMatchObject({ open: true, next: end });
  expect(sessionState(windows, "london", end)).toMatchObject({ open: false, next: end + 15 * HOUR });
  expect(countdown(start, start + 1001)).toBe("0h 0m 2s");
  expect(countdown(end + 1, end)).toBe("0h 0m 0s");
  for (const w of windows) {
    expect(weeklyStatus(w.start).open).toBe(true);
    expect(weeklyStatus(w.end - 1).open).toBe(true);
  }
});
test("weekly boundary clips Sydney's Monday occurrence instead of showing it open on Sunday prematurely", () => {
  const windows = plan("2026-01-18", "UTC", ["sydney"]).selected;
  expect(windows).toHaveLength(1);
  expect(iso(windows[0].start)).toBe("2026-01-18T22:00:00.000Z");
  const raw = sessionOccurrence(def("sydney"), "2026-01-19")!;
  expect(iso(raw.start)).toBe("2026-01-18T21:00:00.000Z");
});
test("midnight-crossing local windows retain opening-date weekday semantics", () => {
  const overnight: SessionDefinition = { id: "overnight", name: "Example", zone: "Asia/Tokyo", start: "22:00", end: "06:00", weekdays: [1,2,3,4,5] };
  const raw = sessionOccurrence(overnight, "2026-01-20")!;
  expect([iso(raw.start), iso(raw.end)]).toEqual(["2026-01-20T13:00:00.000Z", "2026-01-20T21:00:00.000Z"]);
  const midnight = localTime("2026-01-21", "00:00", overnight.zone);
  expect(contains(raw, midnight)).toBe(true);
  expect(sessionWindows({ start: midnight, end: midnight + HOUR }, [overnight])).toMatchObject([{ localDate: "2026-01-20" }]);
});
test("selected visitor date includes occurrences starting on the previous date and keeps full endpoints", () => {
  const result = plan("2026-01-20", "Asia/Kathmandu", ["new-york"]);
  expect(result.selected).toHaveLength(2);
  expect(dateAt(result.selected[0].start, "Asia/Kathmandu")).toBe("2026-01-19");
  expect(wallTime(result.selected[1].start, "Asia/Kathmandu")).toBe("18:45");
  expect(offset(result.selected[1].start, "Asia/Kathmandu")).toBe("UTC+05:45");
  expect(formatTime(result.selected[1].end, "Asia/Kathmandu")).toContain("21 Jan 2026");
});
for (const [date, hours, opening] of [["2026-03-06", 4, "13:00"], ["2026-03-09", 5, "12:00"], ["2026-03-30", 4, "12:00"], ["2026-10-26", 5, "12:00"], ["2026-11-02", 4, "13:00"]] as const) {
  test(`US–UK transition comparison on ${date} yields ${hours} overlap hours`, () => {
    const [window] = plan(date, "UTC", ["london", "new-york"]).selected;
    expect(window.end - window.start).toBe(hours * HOUR);
    expect(wallTime(window.start, "UTC")).toBe(opening);
  });
}
test("overlaps are true interval intersections; touching boundaries and weekends produce no window", () => {
  expect(intersect({ start: 1, end: 5 }, { start: 3, end: 8 })).toEqual({ start: 3, end: 5 });
  expect(overlaps([{ start: 1, end: 5 }], [{ start: 5, end: 8 }])).toEqual([]);
  expect(plan("2026-01-20", "UTC", ["tokyo", "london"]).selected[0]).toMatchObject({ start: instant("2026-01-20T08:00:00Z"), end: instant("2026-01-20T09:00:00Z") });
  // Tokyo ends 18:00 JST = 09:00 UTC; London starts 08:00 UTC (one hour).
  expect(plan("2026-01-17", "UTC", ["london", "new-york"]).selected).toEqual([]);
  expect(plan("2026-01-20", "UTC", ["sydney", "london"]).selected).toEqual([]);
});
test("overnight availability includes next-day occurrences and rejects missing or equal times", () => {
  const available = availability("2026-01-20", "UTC", "23:00", "02:00");
  expect(available.end - available.start).toBe(3 * HOUR);
  const matched = overlaps(selectedWindows(sessionWindows(available), ["tokyo"]), [available]);
  expect(matched).toEqual([{ start: instant("2026-01-21T00:00:00Z"), end: instant("2026-01-21T02:00:00Z") }]);
  expect(() => availability("2026-01-20", "UTC", "", "02:00")).toThrow();
  expect(() => availability("2026-01-20", "UTC", "02:00", "02:00")).toThrow();
});
for (const [zone, short, long] of [["America/New_York", "2026-03-08", "2026-11-01"], ["Europe/London", "2026-03-29", "2026-10-25"], ["Australia/Sydney", "2026-10-04", "2026-04-05"]]) {
  test(`${zone} visitor days retain actual 23/25-hour lengths`, () => {
    for (const [date, length] of [[short, 23], [long, 25]] as const) {
      const bounds = dayBounds(date, zone);
      expect(bounds.end - bounds.start).toBe(length * HOUR);
      expect(plan(date, zone, ["sydney"]).day).toEqual(bounds);
    }
  });
}
test("Sydney and Tokyo follow independent seasonal offsets, including half-hour visitors", () => {
  expect(offset(sessionOccurrence(def("sydney"), "2026-04-03")!.start, "Australia/Sydney")).toBe("UTC+11:00");
  expect(offset(sessionOccurrence(def("sydney"), "2026-04-06")!.start, "Australia/Sydney")).toBe("UTC+10:00");
  expect(offset(sessionOccurrence(def("sydney"), "2026-10-05")!.start, "Australia/Sydney")).toBe("UTC+11:00");
  for (const date of ["2026-01-20", "2026-07-20"]) {
    expect(offset(localTime(date, "09:00", "Asia/Tokyo"), "Asia/Tokyo")).toBe("UTC+09:00");
    expect(wallTime(localTime(date, "09:00", "Asia/Tokyo"), "Asia/Kolkata")).toBe("05:30");
  }
});
test("ambiguous availability picks earlier occurrence; skipped times move forward and invalid resolved windows are rejected", () => {
  const folded = availability("2026-11-01", "America/New_York", "01:30", "02:30");
  expect(iso(folded.start)).toBe("2026-11-01T05:30:00.000Z");
  expect(folded.end - folded.start).toBe(2 * HOUR);
  const gap = availability("2026-03-08", "America/New_York", "02:30", "04:00");
  expect(wallTime(gap.start, "America/New_York")).toBe("03:30");
  expect(() => availability("2026-03-08", "America/New_York", "02:30", "03:00")).toThrow(/daylight saving/);
});
test("month/year boundaries and leap days use calendar arithmetic", () => {
  expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
  expect(addDays("2024-02-29", 1)).toBe("2024-03-01");
  expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  expect(plan("2024-02-29", "UTC", ["london"]).selected).toHaveLength(1);
  expect(plan("2027-01-01", "Asia/Kathmandu", ["sydney"]).windows.length).toBeGreaterThan(0);
  expect(dayBounds("2011-12-30", "Pacific/Apia").end - dayBounds("2011-12-30", "Pacific/Apia").start).toBe(0);
});
test("invalid timezone/date inputs are rejected and equivalent-weekday DST warnings avoid false positives", () => {
  for (const zone of ["", "Mars/Olympus", "+03:00", "<script>"]) expect(isTimezone(zone)).toBe(false);
  for (const zone of ["UTC", "Africa/Nairobi", "Asia/Kathmandu", "Pacific/Chatham"]) expect(isTimezone(zone)).toBe(true);
  for (const value of ["", "2026-02-29", "2024-02-30", "2026-13-01", "2026-1-1"]) expect(isDate(value)).toBe(false);
  expect(() => plan("2026-02-30", "UTC", ["london"])).toThrow();
  expect(() => plan("2026-01-20", "bad", ["london"])).toThrow();
  expect(() => plan("2026-01-20", "UTC", ["bad"])).toThrow();
  expect(offsetChanges(plan("2026-01-21", "Asia/Kathmandu", ["london"]).windows, "2026-01-20", "Asia/Kathmandu")).toEqual([]);
  const future = plan("2026-07-20", "UTC", ["london"]);
  expect(offsetChanges(future.windows.filter(w => w.session === "london"), "2026-01-20", "UTC").join(" ")).toContain("UTC+00:00 → UTC+01:00");
});
