import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { siteOrigin, indexable } from "../src/lib/site";
const route = "/tools/forex-multi-target-calculator";
const calc = (page: Page) => page.getByRole("button", { name: "Calculate partial-exit plan", exact: true }).click();
const gross = (page: Page) => page.locator("[data-total-gross]");

test("initial HTML has one H1, a complete worked example, safe metadata and visible truthful schema", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    expect((await page.goto(`${route}?balance=bad&target=bad`))!.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Forex Multi Target Calculator");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", indexable ? "index, follow" : "noindex, follow");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", siteOrigin + route);
    await expect(page).toHaveTitle("Forex Multi Target Calculator: Partial Profits & R:R | DEVIN FOREX");
    await expect(page.getByRole("region", { name: "Worked example partial exits" }).locator("tbody tr")).toHaveCount(3);
    await expect(page.locator("#multi-target-worked-example")).toContainText("USD 843");
    await expect(gross(page)).toHaveText("USD 850.00");
    const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
    expect(graph.map((entry: { "@type": string }) => entry["@type"])).toEqual(["WebApplication", "BreadcrumbList"]);
    expect(JSON.stringify(graph)).not.toMatch(/AggregateRating|reviewRating|priceCurrency|Person/);
    const paths = await page.locator('main a[href^="/"]').evaluateAll(links => [...new Set(links.map(a => a.getAttribute("href")!))]);
    for (const path of paths) expect((await request.get(path)).status(), path).toBe(200);
    expect((await (await request.get("/sitemap.xml")).text()).includes(siteOrigin + route)).toBe(indexable);
  } finally { await context.close(); }
});

test("worked example hydrates, commission and stop policies preserve gross R and produce the specified net outcomes", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto(route);
  await expect(gross(page)).toHaveText("USD 850.00");
  await page.getByLabel("Include commission", { exact: true }).check();
  await expect(gross(page)).toHaveCount(0); // Stale results are not shown as current.
  await calc(page);
  await expect(page.locator("dl")).toContainText("USD 843.00");
  await expect(page.locator("dl")).toContainText("1.7000R");
  await expect(page.locator("dl")).toContainText("1.6860R");
  await page.getByLabel("Remainder stop policy", { exact: true }).selectOption("entry");
  await calc(page);
  const first = page.getByRole("region", { name: "Reversal scenario calculations" }).getByRole("row").filter({ hasText: "TP1, then stop" });
  await expect(first).toContainText("USD 250.00"); await expect(first).toContainText("USD 243.00");
  expect(errors).toEqual([]);
});

test("invalid stops, exact allocation, runner exposure and impossible runner exit paths are handled explicitly", async ({ page }) => {
  await page.goto(route);
  await page.getByLabel("Initial stop-loss price", { exact: true }).fill("1.1000"); await calc(page);
  await expect(page.locator("main").getByRole("alert")).toContainText("loss side");
  await expect(page.getByLabel("Initial stop-loss price", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Initial stop-loss price", { exact: true }).fill("1.0950");
  await page.getByLabel("TP3 close % of original", { exact: true }).fill("19"); await calc(page);
  await expect(page.locator("main").getByRole("alert")).toContainText("exactly 100%");
  await page.getByLabel("Allow an open runner / allocation below 100%", { exact: true }).check(); await calc(page);
  await expect(gross(page)).toHaveText("USD 835.00");
  await expect(page.locator("dl")).toContainText("Not final — runner has no exit price");
  await page.getByLabel("Runner exit price (optional)", { exact: true }).fill("1.12"); await calc(page);
  await expect(gross(page)).toHaveText("USD 855.00");
  await page.getByLabel("Runner exit price (optional)", { exact: true }).fill("1.09"); await calc(page);
  await expect(page.locator("main").getByRole("alert")).toContainText("trigger first");
  await page.getByRole("button", { name: "Allocate remaining to TP3", exact: true }).click();
  await expect(page.getByLabel("TP3 close % of original", { exact: true })).toHaveValue("20");
});

test("explicit broker-step adjustment changes actual lots and R without changing requested allocations", async ({ page }) => {
  await page.goto(route); await page.getByLabel("Total lots", { exact: true }).fill("0.03"); await calc(page);
  await expect(gross(page)).toHaveText("USD 25.50");
  await expect(page.getByLabel("Volume validation")).toContainText("Ideal math only");
  await page.getByRole("button", { name: "Adjust volumes to broker steps", exact: true }).click();
  await expect(gross(page)).toHaveText("USD 30.00"); await expect(page.locator("dl")).toContainText("2.0000R");
  await expect(page.getByLabel("TP1 close % of original", { exact: true })).toHaveValue("50");
  await expect(page.getByRole("region", { name: "Partial-exit calculations" }).locator("tbody tr").first()).toContainText("33.33333333%");
  await page.getByLabel("Total lots", { exact: true }).fill("0.02"); await calc(page);
  await expect(page.getByLabel("Volume validation")).toContainText("too small to support 3 valid partial closes");
  await expect(page.getByRole("button", { name: "Adjust volumes to broker steps", exact: true })).toBeDisabled();
});

test("non-USD direct and inverse rates, cash/percentage risk sizing and custom contracts work", async ({ page }) => {
  await page.goto(route); await page.getByLabel("Account currency", { exact: true }).selectOption("KES"); await calc(page);
  await expect(page.locator("main").getByRole("alert")).toContainText("conversion rate");
  await page.getByLabel("Conversion rate (KES per USD)", { exact: true }).fill("125"); await calc(page);
  await expect(gross(page)).toHaveText("KES 106,250.00");
  await page.getByLabel("Conversion input direction", { exact: true }).selectOption("inverse");
  await expect(page.getByLabel("Conversion rate (USD per KES)", { exact: true })).toHaveValue("");
  await page.getByLabel("Conversion rate (USD per KES)", { exact: true }).fill("0.008"); await calc(page);
  await expect(gross(page)).toHaveText("KES 106,250.00");
  await page.getByRole("button", { name: "Load worked example", exact: true }).click();
  await page.getByLabel("Position-size mode", { exact: true }).selectOption("cash");
  await page.getByLabel("Gross cash-risk budget (USD)", { exact: true }).fill("73"); await calc(page);
  await expect(page.locator("dl")).toContainText("0.14 lots"); await expect(page.locator("dl")).toContainText("USD 70.00");
  await page.getByLabel("Position-size mode", { exact: true }).selectOption("percent");
  await page.getByLabel("Account balance/equity (USD)", { exact: true }).fill("7300"); await calc(page);
  await expect(page.locator("dl")).toContainText("0.14 lots");
  await page.getByLabel("Base-currency units per lot", { exact: true }).fill("10000"); await calc(page);
  await expect(page.locator("dl")).toContainText("1.46 lots");
});

test("target builder supports ten and one targets, presets, R inputs, sell and JPY modes", async ({ page }) => {
  await page.goto(route);
  for (let i = 0; i < 7; i++) await page.getByRole("button", { name: /Add target/ }).click();
  await expect(page.getByRole("group", { name: /^TP\d+ settings$/ })).toHaveCount(10);
  await expect(page.getByRole("button", { name: /Add target/ })).toBeDisabled();
  await page.getByRole("button", { name: "Equal allocation", exact: true }).click(); await calc(page);
  await expect(page.getByRole("region", { name: "Partial-exit calculations" }).locator("tbody tr")).toHaveCount(10);
  await page.getByRole("button", { name: "50 / 30 / 20 preset", exact: true }).click();
  await expect(page.getByRole("group", { name: /^TP\d+ settings$/ })).toHaveCount(3);
  for (let i = 1; i <= 3; i++) { await page.getByLabel(`TP${i} input type`, { exact: true }).selectOption("r"); await page.getByLabel(`TP${i} R multiple`, { exact: true }).fill(String(i)); }
  await page.getByLabel("Direction", { exact: true }).selectOption("sell");
  await page.getByLabel("Initial stop-loss price", { exact: true }).fill("1.105"); await calc(page);
  await expect(gross(page)).toHaveText("USD 850.00");
  await page.getByRole("button", { name: "Remove TP3", exact: true }).click(); await page.getByRole("button", { name: "Remove TP2", exact: true }).click();
  await page.getByRole("button", { name: "Equal allocation", exact: true }).click();
  await expect(page.getByRole("button", { name: "Remove TP1", exact: true })).toBeDisabled(); await calc(page);
  await expect(gross(page)).toHaveText("USD 500.00");
  await page.getByLabel("Forex pair", { exact: true }).selectOption("USD/JPY");
  await expect(page.getByLabel("Entry price", { exact: true })).toHaveValue("");
  await page.getByLabel("Direction", { exact: true }).selectOption("buy"); await page.getByLabel("Account currency", { exact: true }).selectOption("JPY");
  await page.getByLabel("Entry price", { exact: true }).fill("150"); await page.getByLabel("Initial stop-loss price", { exact: true }).fill("149.5"); await calc(page);
  await expect(gross(page)).toHaveText("JPY 50,000.00"); await expect(page.locator("dl")).toContainText("50.0000 pips");
});

test("copy, CSV, print and reset use the current plan locally and never serialize it into URLs", async ({ browser }) => {
  const context = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] }); const page = await context.newPage();
  type PrintWindow = Window & { __printCalled: boolean };
  const posts: string[] = []; page.on("request", req => { if (req.method() === "POST") posts.push(req.url()); });
  try {
    await page.addInitScript(() => { window.print = () => { (window as unknown as PrintWindow).__printCalled = true; }; });
    await page.goto(route);
    await page.getByRole("button", { name: "Copy plan", exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("USD 850.00");
    const pending = page.waitForEvent("download"); await page.getByRole("button", { name: "Download CSV", exact: true }).click();
    const download = await pending; const csv = await readFile((await download.path())!, "utf8");
    expect(download.suggestedFilename()).toBe("forex-multi-target-plan.csv"); expect(csv).toContain('"850"'); expect(csv).toContain('"1.7"');
    await page.getByRole("button", { name: "Print results", exact: true }).click();
    expect(await page.evaluate(() => (window as unknown as PrintWindow).__printCalled)).toBe(true);
    await page.emulateMedia({ media: "print" }); await expect(page.getByRole("form", { name: "Multi-target trade inputs" })).toBeHidden(); await expect(gross(page)).toBeVisible(); await page.emulateMedia({ media: "screen" });
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await expect(page.getByLabel("Entry price", { exact: true })).toHaveValue(""); await expect(gross(page)).toHaveCount(0); await expect(page.getByRole("button", { name: "Copy plan", exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "Load worked example", exact: true }).click(); await expect(gross(page)).toHaveText("USD 850.00");
    expect(new URL(page.url()).search).toBe(""); expect(posts).toEqual([]);
  } finally { await context.close(); }
});

test("mobile, desktop, keyboard and typography remain usable without hydration or console errors", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" }); const page = await context.newPage();
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message)); page.on("console", e => { if (e.type() === "error") errors.push(e.text()); });
  try {
    await page.goto("/tools"); await page.getByRole("link", { name: "Plan partial exits", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(route + "$"));
    for (const width of [320,390,768,1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator("main p, main label, main input, main select, main small, main td").evaluateAll(elements => elements.every(element => getComputedStyle(element).fontSize === "18px" && getComputedStyle(element).fontFamily.includes("Manrope")))).toBe(true);
    }
    await page.getByLabel("Entry price", { exact: true }).focus();
    expect(await page.getByLabel("Entry price", { exact: true }).evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
    await page.keyboard.press("Tab"); await expect(page.getByLabel("Initial stop-loss price", { exact: true })).toBeFocused();
    await page.locator('[class*="resultHeadline"]').screenshot({ path: "test-results/multi-target-results-desktop.png" });
    await page.setViewportSize({ width: 390, height: 1000 }); await page.locator("[data-multi-target-calculator] form > fieldset").first().screenshot({ path: "test-results/multi-target-inputs-mobile.png" });
    expect(errors).toEqual([]);
  } finally { await context.close(); }
});
