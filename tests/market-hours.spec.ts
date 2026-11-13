import { test, expect } from "@playwright/test";
import { siteOrigin, indexable } from "../src/lib/site";
import { sessions } from "../src/lib/market-hours/config";

const route = "/tools/forex-market-hours";
type InstrumentedWindow = Window & { __clockIntervals: Set<number>; __visibility: DocumentVisibilityState };

test("initial HTML contains the reference schedule, methodology and canonical metadata without stale live claims", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    expect((await page.goto(route))!.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle("Forex Market Hours: Live Clock & Session Planner | DEVIN FOREX");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", indexable ? "index, follow" : "noindex, follow");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", siteOrigin + route);
    await expect(page.getByRole("region", { name: "Session-local reference schedule" }).locator("tbody tr")).toHaveCount(4);
    for (const s of sessions) {
      const row = page.getByRole("region", { name: "Session-local reference schedule" }).getByRole("row").filter({ hasText: s.zone });
      await expect(row).toContainText(`${s.start}–${s.end}`);
      await expect(row).toContainText("Monday–Friday");
    }
    await expect(page.locator("main")).toContainText("Source-checked session conventions");
    await expect(page.locator("#methodology")).toContainText("Sources checked 10 November 2026");
    await expect(page.locator("#methodology a")).toHaveCount(5);
    await expect(page.locator("#methodology")).not.toContainText("retrieval blocked");
    await expect(page.locator("[data-weekly-status]")).toHaveCount(0);
    const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
    expect(graph.map((entry: { "@type": string }) => entry["@type"])).toEqual(["WebPage", "BreadcrumbList"]);
    const urls = await page.locator('main a[href^="/"]').evaluateAll(links => [...new Set(links.map(a => a.getAttribute("href")!))]);
    for (const url of urls) expect((await request.get(url)).status(), url).toBe(200);
    expect((await (await request.get("/sitemap.xml")).text()).includes(siteOrigin + route)).toBe(indexable);
  } finally { await context.close(); }
});

test("timezone detection, manual keyboard selection, preference persistence and reset work", async ({ browser }) => {
  const context = await browser.newContext({ timezoneId: "Africa/Nairobi" });
  const page = await context.newPage();
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  try {
    await page.clock.setFixedTime(new Date("2026-01-20T13:30:00Z"));
    await page.goto(route);
    await expect(page.locator("[data-selected-zone]")).toHaveText("Africa/Nairobi");
    await expect(page.locator("[data-session-card=london]")).toContainText("Open");
    const input = page.getByLabel("Search timezones");
    await input.fill("Asia/Kathmandu"); await input.press("Enter");
    await expect(page.locator("[data-selected-zone]")).toHaveText("Asia/Kathmandu");
    await expect(page.locator("[data-session-card=new-york]")).toContainText("18:45");
    await page.reload();
    await expect(page.locator("[data-selected-zone]")).toHaveText("Asia/Kathmandu");
    await page.getByRole("button", { name: "Use my timezone" }).click();
    await expect(page.locator("[data-selected-zone]")).toHaveText("Africa/Nairobi");
    expect(errors).toEqual([]);
  } finally { await context.close(); }
});

test("invalid or unavailable preferences and unsupported query parameters fail safely", async ({ browser }) => {
  const context = await browser.newContext({ timezoneId: "UTC" });
  await context.addInitScript(() => localStorage.setItem("devin-forex-market-hours-timezone", "Mars/Olympus"));
  const page = await context.newPage();
  try {
    await page.goto(`${route}?timezone=Mars%2FOlympus&date=2026-99-99&session=bad`);
    await expect(page.locator("[data-selected-zone]")).toHaveText("UTC");
    await expect(page.getByRole("status")).toContainText("invalid");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + route);
    await page.getByLabel("Search timezones").fill("Not/AZone");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByRole("status")).toContainText("valid IANA timezone");
    await expect(page.locator("[data-selected-zone]")).toHaveText("UTC");
    await page.getByLabel("Planning date").fill("");
    await expect(page.locator("main").getByRole("alert")).toContainText("Choose a valid date");
  } finally { await context.close(); }
  const noStorage = await browser.newContext();
  await noStorage.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("storage denied"); } }); });
  const fallback = await noStorage.newPage();
  try { await fallback.goto(route); await expect(fallback.getByRole("status")).toContainText("storage is unavailable"); await expect(fallback.locator("[data-session-card]")).toHaveCount(4); }
  finally { await noStorage.close(); }
});

test("future planner shows exact overlaps, overnight availability, no-match results and genuine DST changes", async ({ browser }) => {
  const context = await browser.newContext({ timezoneId: "UTC" }); const page = await context.newPage();
  try {
    await page.clock.setFixedTime(new Date("2026-01-20T12:00:00Z"));
    await page.goto(route);
    await page.getByLabel("Planning date").fill("2026-03-09");
    const results = page.locator('[aria-live="polite"]');
    await expect(results).toContainText("5 elapsed hours");
    await expect(results).toContainText("12:00");
    await expect(results).toContainText("17:00");
    await expect(results).toContainText("Date-specific offset changes");
    await page.getByLabel("Planning date").fill("2026-01-20");
    await expect(results).not.toContainText("Date-specific offset changes");
    await page.getByLabel("Session or overlap").selectOption("tokyo");
    await page.getByLabel("Compare my available hours").check();
    await page.getByLabel("Available from").fill("23:00"); await page.getByLabel("Available until").fill("02:00");
    await expect(results).toContainText("Your availability overlaps the tokyo session.");
    await expect(results).toContainText("21 Jan 2026");
    await page.getByLabel("Available from").fill("12:00"); await page.getByLabel("Available until").fill("13:00");
    await expect(results).toContainText("No overlap with your availability");
    await page.getByLabel("Planning date").fill("2026-01-17");
    await expect(results).toContainText("No tokyo session intersects this date");
    await page.getByLabel("Available until").fill("12:00");
    await expect(page.locator("main").getByRole("alert")).toContainText("must differ");
  } finally { await context.close(); }
});

test("timeline uses 23/25-hour selected dates and includes the now marker only on the current day", async ({ browser }) => {
  const context = await browser.newContext({ timezoneId: "America/New_York" }); const page = await context.newPage();
  try {
    await page.clock.setFixedTime(new Date("2026-01-20T12:00:00Z")); await page.goto(route);
    await expect(page.locator('[class*="nowMarker"]')).toHaveCount(1);
    await page.getByLabel("Planning date").fill("2026-03-08");
    await expect(page.getByText("23 elapsed hours", { exact: true })).toBeVisible();
    await expect(page.locator('[class*="nowMarker"]')).toHaveCount(0);
    await page.getByLabel("Planning date").fill("2026-11-01");
    await expect(page.getByText("25 elapsed hours", { exact: true })).toBeVisible();
  } finally { await context.close(); }
});

test("one clock crosses exact weekly/session boundaries, pauses hidden tabs, resumes and cleans up on navigation", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-01-16T21:59:59Z") });
  await page.addInitScript(() => {
    const w = window as unknown as InstrumentedWindow;
    w.__clockIntervals = new Set(); w.__visibility = "visible";
    Object.defineProperty(document, "visibilityState", { get: () => w.__visibility, configurable: true });
    const originalSet = window.setInterval.bind(window), originalClear = window.clearInterval.bind(window);
    window.setInterval = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => {
      const id = originalSet(handler, delay, ...args); if (delay === 1000) w.__clockIntervals.add(id); return id;
    }) as typeof window.setInterval;
    window.clearInterval = ((id?: number) => { if (id !== undefined) w.__clockIntervals.delete(id); originalClear(id); }) as typeof window.clearInterval;
  });
  await page.goto(route);
  await expect(page.locator("[data-weekly-status]")).toHaveText("Market week open");
  await expect.poll(() => page.evaluate(() => (window as unknown as InstrumentedWindow).__clockIntervals.size)).toBe(1);
  await page.clock.fastForward(2000);
  await expect(page.locator("[data-weekly-status]")).toHaveText("Market week closed");
  for (const session of sessions) await expect(page.locator(`[data-session-card=${session.id}]`)).toContainText("Closed");
  await expect(page.locator("[data-market-countdown]")).not.toContainText("-");
  await page.evaluate(() => { (window as unknown as InstrumentedWindow).__visibility = "hidden"; document.dispatchEvent(new Event("visibilitychange")); });
  expect(await page.evaluate(() => (window as unknown as InstrumentedWindow).__clockIntervals.size)).toBe(0);
  await page.clock.setSystemTime(new Date("2026-01-18T22:01:00Z"));
  await page.evaluate(() => { (window as unknown as InstrumentedWindow).__visibility = "visible"; document.dispatchEvent(new Event("visibilitychange")); });
  await expect(page.locator("[data-weekly-status]")).toHaveText("Market week open");
  await expect(page.locator("[data-session-card=sydney]")).toContainText("Open");
  await page.getByRole("link", { name: "All trading tools", exact: true }).click();
  await expect(page).toHaveURL(/\/tools$/);
  await expect.poll(() => page.evaluate(() => (window as unknown as InstrumentedWindow).__clockIntervals.size)).toBe(0);
});

test("mobile and desktop layouts, keyboard controls and site discovery work without console errors", async ({ browser }) => {
  const context = await browser.newContext({ timezoneId: "Africa/Nairobi", reducedMotion: "reduce" }); const page = await context.newPage();
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message)); page.on("console", e => { if (e.type() === "error") errors.push(e.text()); });
  try {
    await page.clock.setFixedTime(new Date("2026-01-20T12:00:00Z"));
    await page.goto("/tools");
    await page.getByRole("link", { name: "Open session planner" }).click();
    await expect(page).toHaveURL(new RegExp(route + "$"));
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      await expect(page.getByLabel("Planning date")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      const inconsistentBodyText = await page.locator("main p, main small, main label, main input, main select, main button, main td, main th, main caption, main summary, main li, main time").evaluateAll(elements => elements.filter(element => {
        const style = getComputedStyle(element);
        return style.fontSize !== "18px" || !style.fontFamily.includes("Manrope");
      }).map(element => `${element.tagName}: ${element.textContent?.trim().slice(0, 50)}`));
      expect(inconsistentBodyText, `Body text at ${width}px should use 18px Manrope`).toEqual([]);
      await page.screenshot({ path: `test-results/market-hours-${width}.png`, fullPage: true });
    }
    await page.getByLabel("Search timezones").focus(); await page.keyboard.press("ControlOrMeta+A"); await page.keyboard.type("UTC"); await page.keyboard.press("Enter");
    await expect(page.locator("[data-selected-zone]")).toHaveText("UTC");
    await page.getByLabel("Planning date").focus();
    expect(await page.getByLabel("Planning date").evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
    await page.getByText("All overlaps on this date", { exact: false }).click();
    await expect(page.locator("details[open]")).toContainText("London–New York");
    expect(errors).toEqual([]);
  } finally { await context.close(); }
});

test("reference layout pairs market status with timezone controls, loads city banners and highlights active sessions", async ({ browser }) => {
  const context = await browser.newContext({ timezoneId: "Africa/Nairobi", viewport: { width: 1440, height: 1100 } });
  const page = await context.newPage();
  try {
    await page.clock.setFixedTime(new Date("2026-01-20T12:00:00Z"));
    await page.goto(route);
    await expect(page.locator('[data-session-card="london"]')).toHaveAttribute("data-open", "true");
    await expect(page.locator('[data-session-card="new-york"]')).toHaveAttribute("data-open", "false");
    const market = await page.getByRole("region", { name: "Market week status", exact: true }).boundingBox();
    const timezone = await page.getByRole("region", { name: "Timezone settings", exact: true }).boundingBox();
    expect(market).not.toBeNull(); expect(timezone).not.toBeNull();
    expect(market!.y).toBe(timezone!.y);
    expect(market!.x + market!.width).toBeLessThan(timezone!.x);
    await expect.poll(() => page.locator("[data-session-card] img").evaluateAll(images => images.filter(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0).length)).toBe(4);
    await expect(page.locator("[data-market-countdown] > span")).toHaveCount(4);
    await expect(page.getByRole("region", { name: "How to use this tool" }).getByRole("link")).toHaveCount(3);
    await expect(page.getByText("Current local time:", { exact: false })).toContainText("15:00:00");
    await page.locator('[class*="dashboard"]').screenshot({ path: "test-results/market-hours-dashboard.png" });
    await page.getByRole("link", { name: /3\. Plan your trades/ }).click();
    await expect(page).toHaveURL(new RegExp(route + "#session-planner$"));
    await expect(page.getByLabel("Planning date")).toBeInViewport();
    await page.screenshot({ path: "test-results/market-hours-reference-desktop.png", fullPage: true });
    await page.setViewportSize({ width: 390, height: 960 });
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: "test-results/market-hours-reference-mobile.png", fullPage: true });
  } finally { await context.close(); }
});
