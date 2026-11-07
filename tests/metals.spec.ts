import { test, expect } from "@playwright/test";
import { DAY, GRAMS_PER_TROY_OUNCE, dayStart, fxRate, historyChange, metalValue, metalWeight, parseFx, parseHistory, parseOhlc, parseQuote, ratio, todayChange, utcDate } from "../src/lib/metals/math";
import { hubs } from "../src/lib/metals/content";
import { siteOrigin } from "../src/lib/site";
import { emptyHistory, type History, type Quote } from "../src/lib/metals/types";
import { metalsIndexable } from "../src/lib/metals/seo";
import { configuredHistoryKey } from "../src/lib/metals/config";
const now = Date.UTC(2026, 10, 7, 12), asOf = new Date(now).toISOString();
const gold: Quote = { symbol: "XAU", price: 4200, asOf }, silver: Quote = { symbol: "XAG", price: 52.5, asOf };

test("history accepts the owner's existing Production variable and preserves the documented variable's precedence", () => {
  expect(configuredHistoryKey({ gold_api: " legacy-test-key \n" })).toBe("legacy-test-key");
  expect(configuredHistoryKey({ GOLD_API_KEY: "primary-test-key", gold_api: "legacy-test-key" })).toBe("primary-test-key");
  expect(configuredHistoryKey({ GOLD_API_KEY: "  ", gold_api: "legacy-test-key" })).toBe("legacy-test-key");
  expect(configuredHistoryKey({})).toBeUndefined();
});

test("troy weight, purity and budget calculations preserve units and conversion direction", () => {
  expect(metalValue(GRAMS_PER_TROY_OUNCE, "g", 4200)).toBeCloseTo(4200, 10);
  expect(metalValue(1, "kg", 4200)).toBeCloseTo(metalValue(1000, "g", 4200), 10);
  expect(metalValue(1, "oz", 4200, 18, 0.75)).toBe(56700);
  expect(metalWeight(56700, "oz", 4200, 18, 0.75)).toBe(1);
  expect(metalValue(0, "kg", 4200)).toBe(0);
  for (const amount of [-1, NaN, Infinity, 1e13]) expect(() => metalValue(amount, "oz", 4200)).toThrow();
  for (const purity of [0, -1, NaN, Infinity, 1.1]) expect(() => metalValue(1, "oz", 4200, 1, purity)).toThrow();
  expect(() => metalWeight(1, "oz", Number.MIN_VALUE)).toThrow();
  expect(() => metalValue(1e12, "kg", 4200)).toThrow();
});
test("quote and FX ingestion reject wrong units, currencies, future dates and expired rates", () => {
  const raw = { ...gold, currency: "USD", updatedAt: asOf };
  expect(parseQuote(raw, "XAU", now)).toEqual(gold);
  for (const change of [{ currency: "ZAR" }, { symbol: "XAG" }, { price: 0 }, { price: Infinity }, { updatedAt: new Date(now + DAY).toISOString() }, { updatedAt: "not a date" }]) expect(parseQuote({ ...raw, ...change }, "XAU", now)).toBeNull();
  const row = { base: "USD", quote: "ZAR", date: "2026-11-06", rate: 18 };
  const fx = parseFx([row, row, { ...row, date: "2026-11-08" }, { ...row, quote: "XYZ" }], "2026-11-06");
  expect(fx).toEqual([{ currency: "ZAR", date: "2026-11-06", rate: 18 }]);
  expect(fxRate("ZAR", fx, now)).toBe(18); expect(fxRate("USD", [], now)).toBe(1);
  expect(fxRate("ZAR", fx, now + 10 * DAY)).toBeNull();
  expect(parseFx([{ ...row, date: "2026-02-30" }], "2026-03-02")).toEqual([]);
});
test("ratios require recent aligned quotes and returns never invent a missing baseline", () => {
  expect(ratio(gold, silver, now)).toBe(80);
  expect(ratio(gold, { ...silver, asOf: new Date(now - 61_000).toISOString() }, now)).toBeNull();
  expect(ratio(gold, silver, now + 301_000)).toBeNull(); expect(ratio(gold, null, now)).toBeNull();
  expect(ratio(gold, { ...silver, price: Number.MIN_VALUE }, now)).toBeNull();
  const open = { open: 4000, close: 4200, high: 4300, low: 3990, start: dayStart(now) / 1000, end: now / 1000 };
  expect(todayChange(gold, open, now)?.percent).toBeCloseTo(5, 10);
  expect(todayChange(gold, { ...open, start: open.start - 86400 }, now)).toBeNull();
  const history: History = { ...emptyHistory(), status: "available", points: [{ date: "2026-10-30", price: 4000 }, { date: "2026-11-06", price: 4200 }] };
  expect(historyChange(history, "week", now)?.percent).toBeCloseTo(5, 10);
  expect(historyChange(history, "month", now)).toBeNull(); expect(historyChange(history, "ytd", now)).toBeNull();
  expect(historyChange(history, "week", now + 8 * DAY)).toBeNull();
  expect(parseHistory([{ day: "2026-11-06", avg_price: 4200 }, { day: "2026-11-07", avg_price: 4300 }, { day: "2026-02-30", avg_price: 4000 }, { day: "2026-11-05", max_price: 4400 }], now)).toEqual([{ date: "2026-11-06", price: 4200 }]);
  expect(parseHistory([{ day: "2026-11-06T00:00:00.000Z", avg_price: "4200.25" }, { day: "2026-11-05 00:00:00", avg_price: "4180.50" }, { day: "2026-11-04T03:00:00Z", avg_price: 4000 }, { day: "2026-11-03T00:00:00+03:00", avg_price: 4000 }, { day: "2026-11-02", avg_price: "USD 4000" }], now)).toEqual([{ date: "2026-11-05", price: 4180.5 }, { date: "2026-11-06", price: 4200.25 }]);
  const raw = { open: 4000, close: 4200, high: 4300, low: 3900, startTimestamp: open.start, endTimestamp: open.end };
  expect(parseOhlc(raw, open.start, open.end)?.high).toBe(4300);
  expect(parseOhlc({ ...raw, high: 3000 }, open.start, open.end)).toBeNull();
});
test("history configuration is checked at runtime and missing keys cannot be cached by the CDN", async ({ request }) => {
  const response = await request.get("/api/metals/history");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["x-robots-tag"]).toBe("noindex");
  const history = await response.json();
  for (const symbol of ["XAU", "XAG"]) expect(["available", "unavailable", "not-configured"]).toContain(history[symbol].status);
  expect(JSON.stringify(history)).not.toMatch(/x-api-key|GOLD_API_KEY|credentialScope/);
});
test("both hubs expose distinct indexable server content, source links, schema and working internal destinations", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try { for (const kind of ["gold", "comparison"] as const) {
    const hub = hubs[kind];
    expect((await page.goto(hub.path))?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1); await expect(page.locator("h1")).toContainText(hub.heading);
    await expect(page).toHaveTitle(hub.title);
    expect(hub.title.length).toBeLessThan(60); expect(hub.description.length).toBeGreaterThanOrEqual(150); expect(hub.description.length).toBeLessThanOrEqual(160);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", hub.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + hub.path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", metalsIndexable ? "index, follow" : "noindex, follow");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", siteOrigin + hub.image);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", siteOrigin + hub.image);
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
    expect(schema.map((x: { "@type": string }) => x["@type"])).toEqual(expect.arrayContaining(["WebPage", "BreadcrumbList", "Person", "Organization", "FAQPage"]));
    expect(JSON.stringify(schema)).not.toMatch(/Dataset|AggregateRating|ratingValue/);
    for (const faq of schema.find((x: { "@type": string }) => x["@type"] === "FAQPage").mainEntity) {
      await expect(page.locator("main details").filter({ hasText: faq.name }).locator("p")).toHaveText(faq.acceptedAnswer.text);
    }
    const internal = [...new Set(await page.locator('main a[href^="/"]').evaluateAll(links => links.map(a => a.getAttribute("href")!)))];
    expect(internal.length).toBeGreaterThanOrEqual(5);
    for (const href of internal) expect((await request.get(href)).status(), href).toBe(200);
    expect(await page.locator('main a[href^="https://"]').count()).toBeGreaterThanOrEqual(3);
    expect(await page.locator("main").evaluate(node => [...node.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.getAttribute("href")!.slice(1))))).toBe(true);
    await expect(page.locator("main")).toContainText("not live FX");
    await expect(page.locator("main")).not.toContainText(/GOLD_API_KEY|x-api-key|guaranteed profit/);
    expect(await page.locator("main").evaluate(node => getComputedStyle(node).backgroundColor)).toBe("rgb(255, 255, 255)");
    expect((await request.get(hub.image)).status()).toBe(200);
  } } finally { await context.close(); }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const hub of Object.values(hubs)) expect(sitemap.includes(siteOrigin + hub.path)).toBe(metalsIndexable);
});

async function mockFeeds(page: import("@playwright/test").Page, stale = false, historyAvailable = true) {
  const time = Date.now(), stamp = new Date(time - (stale ? 10 * 60_000 : 0)).toISOString();
  await page.route("**/api/metals", route => route.fulfill({ json: { quotes: { XAU: { ...gold, asOf: stamp }, XAG: { ...silver, asOf: stamp } }, fx: [{ currency: "ZAR", rate: 18, date: utcDate(time - DAY) }], retrievedAt: new Date(time).toISOString() } }));
  const make = (price: number, opening: number): History => ({ status: "available", points: Array.from({ length: 400 }, (_, i) => ({ date: utcDate(dayStart(time) - (400 - i) * DAY), price: price * (0.8 + i / 2000) })), today: { open: opening, high: price * 1.1, low: opening * 0.9, close: price, start: dayStart(time) / 1000, end: time / 1000 }, year: null, retrievedAt: new Date(time).toISOString() });
  await page.route("**/api/metals/history", route => route.fulfill({ json: historyAvailable ? { XAU: make(4200, 4000), XAG: make(52.5, 50) } : { XAU: emptyHistory(), XAG: emptyHistory() } }));
}
test("calculators, ratio, honest free-plan chart ranges and accessible data work on a small mobile screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 }); await mockFeeds(page);
  await page.goto("/gold-silver-prices");
  await expect(page.locator("[data-ratio]")).toHaveText("80.00 : 1");
  const priceBox = await page.locator('[data-quote="XAU"]').getByText(/^USD\s+4,200\.00$/).boundingBox();
  expect(priceBox).not.toBeNull(); expect(priceBox!.y + priceBox!.height).toBeLessThanOrEqual(844);
  const calc = page.locator('[data-calculator="XAU"]');
  await expect(calc.locator("output")).toHaveText(/4,200\.00/);
  await calc.getByLabel("Display currency").selectOption("ZAR"); await expect(calc.locator("output")).toHaveText(/75,600\.00/);
  await calc.getByLabel("Purity").selectOption("0.75"); await expect(calc.locator("output")).toHaveText(/56,700\.00/);
  await calc.getByLabel("Calculate", { exact: true }).selectOption("weight"); await calc.getByLabel("Budget (ZAR)").fill("56700"); await expect(calc.locator("output")).toHaveText("1 troy oz");
  await calc.getByLabel("Budget (ZAR)").fill("-1"); await expect(calc.locator("output")).toHaveCount(0);
  await expect(calc.getByRole("status")).toContainText("budget");
  await page.locator("#charts").scrollIntoViewIfNeeded();
  await expect(page.locator("#charts svg[role=img]")).toHaveCount(2);
  await page.getByRole("button", { name: "24H", exact: true }).click(); await expect(page.locator("#charts")).toContainText("no intraday movement is inferred"); await expect(page.locator("#charts svg")).toHaveCount(0);
  await page.getByRole("button", { name: "1Y", exact: true }).click();
  await page.getByText("View accessible chart data", { exact: true }).first().click();
  await expect(page.locator("#charts table").first().locator("tbody tr")).toHaveCount(50);
  await page.getByRole("button", { name: "Next", exact: true }).click(); await expect(page.locator("#charts")).toContainText("Page 2 of");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("stale or unavailable feeds never produce a current ratio or a fictional historical chart", async ({ page }) => {
  await mockFeeds(page, true, false); await page.goto("/gold-silver-prices");
  await expect(page.locator('[data-quote="XAU"]')).toContainText("Stale quote");
  await expect(page.locator("[data-ratio]")).toHaveText("Unavailable");
  await page.locator("#charts").scrollIntoViewIfNeeded(); await expect(page.locator("#charts")).toContainText("no sample prices or invented line");
  await expect(page.locator("#charts svg")).toHaveCount(0);
  const calc = page.locator('[data-calculator="XAU"]'); await expect(calc).toContainText("Stale reference quote");
  await expect(calc.locator("output")).toHaveText(/4,200\.00/);
});
