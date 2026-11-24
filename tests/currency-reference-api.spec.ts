import { test, expect } from "@playwright/test";
import { GET } from "../src/app/api/forex-rates/route";
test("historical reference API retains requested-date cache boundaries during outages", async () => {
  const originalFetch = globalThis.fetch;
  let fail = false; const requested: string[] = [];
  globalThis.fetch = async input => {
    requested.push(String(input));
    if (fail) throw new Error("Simulated provider outage");
    return Response.json([{ base: "USD", quote: "EUR", rate: 0.9, date: "2025-01-20" }]);
  };
  try {
    const first = await GET(new Request("http://localhost/api/forex-rates?date=2025-01-20")); expect(first.status).toBe(200);
    expect((await first.json()).rates[0].asOf).toBe("2025-01-20T00:00:00.000Z"); expect(requested[0]).toContain("date=2025-01-20");
    fail = true;
    const otherDate = await GET(new Request("http://localhost/api/forex-rates?date=2025-01-21")); expect(otherDate.status).toBe(503);
    const sameDate = await GET(new Request("http://localhost/api/forex-rates?date=2025-01-20")); expect(sameDate.status).toBe(200);
    const cached = await sameDate.json(); expect(cached.cached).toBe(true); expect(cached.rates[0].asOf).toBe("2025-01-20T00:00:00.000Z");
  } finally { globalThis.fetch = originalFetch; }
});
test("invalid historical dates return a client error without querying the provider", async () => {
  const originalFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error("Must not fetch"); };
  try { expect((await GET(new Request("http://localhost/api/forex-rates?date=2026-02-30"))).status).toBe(400); expect(calls).toBe(0); }
  finally { globalThis.fetch = originalFetch; }
});
