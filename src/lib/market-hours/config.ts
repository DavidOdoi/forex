/**
 * Provisional editorial conventions, NOT exchange or broker opening hours.
 * Local weekdays identify the date on which a session starts. End <= start
 * means the following local day. All results use half-open [start, end).
 * References could not be retrieved under the environment's network policy.
 */
export const sessions = [
  { id: "sydney", name: "Sydney", zone: "Australia/Sydney", start: "08:00", end: "17:00", weekdays: [1, 2, 3, 4, 5] },
  { id: "tokyo", name: "Tokyo", zone: "Asia/Tokyo", start: "09:00", end: "18:00", weekdays: [1, 2, 3, 4, 5] },
  { id: "london", name: "London", zone: "Europe/London", start: "08:00", end: "17:00", weekdays: [1, 2, 3, 4, 5] },
  { id: "new-york", name: "New York", zone: "America/New_York", start: "08:00", end: "17:00", weekdays: [1, 2, 3, 4, 5] },
] as const;
export type SessionId = typeof sessions[number]["id"];
export type SessionDefinition = { id: string; name: string; zone: string; start: string; end: string; weekdays: readonly number[] };
export const weeklyMarket = { zone: "America/New_York", openDay: 7, closeDay: 5, time: "17:00" } as const;
export const scheduleReview = {
  status: "Provisional conventions — editorial approval required",
  references: [
    { title: "BabyPips: Forex trading sessions", url: "https://www.babypips.com/learn/forex/forex-trading-sessions" },
    { title: "OANDA US: Hours of operation (broker-specific)", url: "https://www.oanda.com/us-en/trading/hours-of-operation/" },
  ],
};
export const windowChoices = [
  ...sessions.map(s => ({ id: s.id, label: `${s.name} session`, members: [s.id] as readonly SessionId[] })),
  ...sessions.flatMap((left, i) => sessions.slice(i + 1).map(right => ({
    id: `${left.id}-${right.id}`, label: `${left.name}–${right.name} overlap`, members: [left.id, right.id] as readonly SessionId[],
  }))),
] as const;
