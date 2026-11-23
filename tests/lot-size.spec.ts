import { test, expect } from "@playwright/test";
import { lotSizePath, defaultLotScenario, serializeLotScenario } from "../src/lib/calculators/lot-scenario";
import { siteOrigin } from "../src/lib/site";
import { calculatorsIndexable } from "../src/lib/calculators/seo";

test("lot-size SEO, formulas and three matching FAQs are server-rendered; legacy links redirect", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    expect((await page.goto(`http://127.0.0.1:3100${lotSizePath}`))?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Forex Lot Size Calculator");
    await expect(page).toHaveTitle("Forex Lot Size Calculator – Position Size & Risk");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + lotSizePath);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", calculatorsIndexable ? "index, follow" : "noindex, follow");
    await expect(page.locator("[data-result]")).toHaveText("0.20 lots");
    await expect(page.locator("main noscript")).toBeVisible();
    await expect(page.locator("#quick-answer")).toHaveText("Quick answer");
    await expect(page.locator("#calculator-faq details")).toHaveCount(3);
    await expect(page.getByRole("table", { name: /Worked example/ })).toBeVisible();
    const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
    const application = graph.find((item: Record<string, unknown>) => item["@type"] === "WebApplication");
    expect(application.url).toBe(siteOrigin + lotSizePath); expect(application.offers.price).toBe("0");
    expect(JSON.stringify(graph)).not.toMatch(/aggregateRating|ratingValue/);
    const faqs = graph.find((item: Record<string, unknown>) => item["@type"] === "FAQPage").mainEntity;
    expect(faqs).toHaveLength(3);
    for (const faq of faqs) await expect(page.locator("#calculator-faq details").filter({ hasText: faq.name }).locator("p")).toHaveText(faq.acceptedAnswer.text);
    const copy = await page.locator("article").innerText(); expect(copy.split(/\s+/).length).toBeLessThan(1800);
    for (const anchor of await page.locator('main a[href^="#"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!.slice(1)))) expect(await page.locator(`[id="${anchor}"]`).count(), anchor).toBe(1);
    for (const href of [...new Set(await page.locator('main a[href^="/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!)))]) expect((await request.get(href)).status(), href).toBe(200);
  } finally { await context.close(); }
  const legacy = await request.get("/tools/forex-position-size-calculator?risk=2", { maxRedirects: 0 });
  expect(legacy.status()).toBe(308); expect(legacy.headers().location).toContain(lotSizePath + "?risk=2");
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain(siteOrigin + lotSizePath); expect(xml).not.toContain("/tools/forex-position-size-calculator");
  await page.close();
});

test("lot-size updates with rounding, rejects a too-small minimum and caps an entered maximum", async ({ page }) => {
  await page.goto(lotSizePath);
  await expect(page.locator("[data-result]")).toHaveText("0.20 lots");
  await page.getByLabel("Stop-loss distance (pips)", { exact: true }).fill("30");
  await expect(page.locator("[data-result]")).toHaveText("0.33 lots");
  await expect(page.locator("#calculation-result")).toContainText("USD 99.00");
  await page.getByLabel("Risk input", { exact: true }).selectOption("cash");
  await page.getByLabel("Fixed risk amount (USD)", { exact: true }).fill("1");
  await page.getByLabel("Stop-loss distance (pips)", { exact: true }).fill("100");
  await expect(page.locator("[data-result]")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("minimum 0.01 lots would risk USD 10.00");
  await page.getByLabel("Fixed risk amount (USD)", { exact: true }).fill("100");
  await page.getByText("Broker contract & volume limits", { exact: true }).click();
  await page.getByLabel("Maximum volume (lots)", { exact: true }).fill("0.05");
  await expect(page.locator("[data-result]")).toHaveText("0.05 lots");
  await expect(page.locator("#calculation-result")).toContainText("capped at 0.05 lots");
  await page.getByLabel("Stop-loss distance (pips)", { exact: true }).fill("0");
  await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.getByRole("status")).toContainText("stop-loss distance");
});

test("lot-size costs are inside the budget by default and spread is counted only once", async ({ page }) => {
  await page.goto(lotSizePath);
  await page.getByText("Trading costs", { exact: true }).click();
  await page.getByLabel("Round-trip commission per lot (USD)", { exact: true }).fill("7");
  await page.getByLabel("Other fixed trade costs (USD)", { exact: true }).fill("2");
  await expect(page.locator("[data-result]")).toHaveText("0.19 lots"); await expect(page.locator("#calculation-result")).toContainText("USD 98.33");
  await page.getByLabel("Spread accounting", { exact: true }).selectOption("additional");
  await page.getByLabel("Additional spread (pips)", { exact: true }).fill("2");
  await expect(page.locator("[data-result]")).toHaveText("0.18 lots"); await expect(page.locator("#calculation-result")).toContainText("USD 96.86");
  await page.getByLabel("Spread accounting", { exact: true }).selectOption("included");
  await expect(page.locator("[data-result]")).toHaveText("0.19 lots");
  await page.getByLabel("Keep estimated costs inside my risk budget").uncheck();
  await expect(page.locator("[data-result]")).toHaveText("0.20 lots");
  await expect(page.locator("#calculation-result")).toContainText("exceeds it by USD 3.40");
});

test("lot-size price mode handles long and short stops without floating-point pip errors", async ({ page }) => {
  await page.goto(lotSizePath);
  await page.getByLabel("Stop-loss input", { exact: true }).selectOption("prices");
  await expect(page.locator("[data-result]")).toHaveText("0.20 lots");
  await page.getByLabel("Stop-loss price", { exact: true }).fill("1.105");
  await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.getByRole("status")).toContainText("below");
  await page.getByLabel("Trade direction", { exact: true }).selectOption("sell");
  await expect(page.locator("[data-result]")).toHaveText("0.20 lots");
  await page.getByLabel("Stop-loss price", { exact: true }).fill("1.1");
  await expect(page.locator("[data-result]")).toHaveCount(0);
});

test("lot-size manual JPY conversion never invents a missing rate and resets quotes after currency changes", async ({ page }) => {
  const requests: string[] = []; page.on("request", request => { if (request.url().includes("/api/forex-rates")) requests.push(request.url()); });
  await page.goto(lotSizePath);
  await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.getByLabel("USD/JPY rate", { exact: true }).fill("160");
  await expect(page.locator("[data-result]")).toHaveText("0.32 lots");
  await expect(page.locator("#calculation-result")).toContainText("USD 6.25");
  await expect(page.getByText("Manual conversion", { exact: true })).toBeVisible();
  expect(requests).toHaveLength(0);
  await page.getByLabel("Account currency", { exact: true }).selectOption("JPY");
  await page.getByLabel("Account currency", { exact: true }).selectOption("USD");
  await expect(page.getByLabel("USD/JPY rate", { exact: true })).toHaveValue("");
  await expect(page.locator("[data-result]")).toHaveCount(0);
});

test("lot-size daily rates are labelled as dated references and old data is visibly stale", async ({ page }) => {
  await page.route("**/api/forex-rates", route => route.fulfill({ json: { provider: "Frankfurter", sourceUrl: "https://frankfurter.dev/", retrievedAt: new Date().toISOString(), rates: [{ base: "USD", quote: "JPY", rate: "160", source: "frankfurter", asOf: "2020-01-01T00:00:00Z" }] } }));
  await page.goto(lotSizePath);
  await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await page.getByLabel("Conversion-rate source", { exact: true }).selectOption("daily");
  await expect(page.locator("[data-result]")).toHaveText("0.32 lots");
  await expect(page.getByText("Stale / cached daily reference", { exact: true })).toBeVisible();
  await expect(page.locator("#calculation-result")).toContainText("2020-01-01 (UTC)");
  await expect(page.locator("#calculation-result")).toContainText("more than four days old");
});

test("lot-size reference-service failure leaves a working manual mode", async ({ page }) => {
  await page.route("**/api/forex-rates", route => route.fulfill({ status: 503, json: { error: "Daily reference rates are unavailable. Enter a manual conversion rate." } }));
  await page.goto(lotSizePath); await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await page.getByLabel("Conversion-rate source", { exact: true }).selectOption("daily");
  await expect(page.getByRole("status")).toContainText("unavailable"); await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.getByLabel("Conversion-rate source", { exact: true }).selectOption("manual");
  await page.getByLabel("USD/JPY rate", { exact: true }).fill("160");
  await expect(page.locator("[data-result]")).toHaveText("0.32 lots");
});

test("lot-size saved links restore complete scenarios, keep a clean canonical and support copy fallback", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true }));
  const values = { ...defaultLotScenario, risk: "2", stopPips: "30", commission: "7" };
  await page.goto(`${lotSizePath}?${serializeLotScenario(values)}`);
  await expect(page.getByLabel("Risk percentage (%)", { exact: true })).toHaveValue("2");
  await expect(page.locator("[data-result]")).toHaveText("0.65 lots");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + lotSizePath);
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click();
  const link = await page.getByLabel("Copy text", { exact: true }).inputValue();
  expect(new URL(link).searchParams.get("commission")).toBe("7");
  expect(new URL(link).searchParams.get("risk")).toBe("2");
  await page.goto(link);
  await expect(page.locator("[data-result]")).toHaveText("0.65 lots");
  await page.getByRole("button", { name: "Copy results", exact: true }).click();
  await expect(page.getByLabel("Copy text", { exact: true })).toHaveValue(/USD 199\.55/);
  await page.getByRole("button", { name: "Reset inputs", exact: true }).click();
  await expect(page.locator("[data-result]")).toHaveText("0.20 lots");
});

test("lot-size copies results through the browser clipboard when it is available", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(lotSizePath);
  await page.getByRole("button", { name: "Copy results", exact: true }).click();
  await expect(page.getByText("Results copied.", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("0.20 lots / 20,000 EUR");
});

test("lot-size comparisons and optional margin estimates do not silently alter the risk-based result", async ({ page }) => {
  await page.goto(lotSizePath);
  await page.getByText("Compare risk percentages", { exact: true }).click();
  const comparison = page.getByRole("table", { name: "Same trade, two risk choices", exact: true });
  await expect(comparison).toContainText("0.10");
  await page.getByLabel("Compare with risk (%)", { exact: true }).fill("2");
  await expect(comparison).toContainText("0.40");
  await page.getByText("Volume versus risk", { exact: true }).click();
  await expect(page.getByRole("table", { name: "Valid volumes near your result", exact: true })).toContainText("Above");
  await page.getByText("Optional margin check", { exact: true }).click();
  await page.getByLabel("Check a simple leverage estimate").check();
  await page.getByLabel("Available margin (USD)", { exact: true }).fill("500");
  await page.getByLabel("EUR/USD margin reference price", { exact: true }).fill("1.1");
  await expect(page.getByRole("region", { name: "Optional margin estimate", exact: true })).toContainText("USD 733.33");
  await expect(page.locator("#calculation-result")).toContainText("may not be affordable");
  await expect(page.locator("[data-result]")).toHaveText("0.20 lots");
});

test("lot-size layout fits phones and desktop with usable keyboard controls", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto(lotSizePath);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), String(width)).toBe(true);
    expect(await page.getByLabel("Risk percentage (%)", { exact: true }).evaluate(node => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    if (width === 390 || width === 1440) await page.locator('[data-calculator="lot-size"]').screenshot({ path: `test-results/lot-size-${width}.png`, style: "body>header{visibility:hidden}" });
  }
  await page.getByLabel("Currency pair", { exact: true }).focus(); await page.keyboard.press("Tab");
  await expect(page.getByLabel("Account currency", { exact: true })).toBeFocused();
  await page.keyboard.press("Tab"); await expect(page.getByLabel("Account balance / equity (USD)", { exact: true })).toBeFocused();
  await page.getByText("Trading costs", { exact: true }).focus(); await page.keyboard.press("Enter");
  await expect(page.getByLabel("Round-trip commission per lot (USD)", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
