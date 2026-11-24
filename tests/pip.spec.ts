import { test, expect } from "@playwright/test";
import { pipDefinition } from "../src/lib/calculators/pip-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
import { siteOrigin } from "../src/lib/site";

const path = "/calculators/forex-pip-calculator";

test("pip tool ships useful server-rendered content, metadata and its default example", async ({ browser, request }) => {
  expect(calculatorArticleWords(pipDefinition)).toBeGreaterThanOrEqual(1600);
  expect(calculatorArticleWords(pipDefinition)).toBeLessThanOrEqual(1800);
  expect(pipDefinition.intro.split(/\s+/).length).toBeGreaterThanOrEqual(80);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto(`http://127.0.0.1:3100${path}`);
    await expect(page.locator("h1")).toHaveText("Forex Pip Calculator");
    await expect(page).toHaveTitle(pipDefinition.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + path);
    await expect(page.locator("[data-result]")).toHaveText("USD 10.00");
    await expect(page.locator("#quick-answer + p")).toContainText("USD 6.25");
    await expect(page.locator("#calculator-faq details")).toHaveCount(3);
    const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
    expect(graph.find((v: { "@type": string }) => v["@type"] === "WebApplication").url).toBe(siteOrigin + path);
    expect(await (await request.get("/sitemap.xml")).text()).toContain(siteOrigin + path);
    const alias = await request.get("/tools/forex-pip-calculator", { maxRedirects: 0 });
    expect(alias.status()).toBe(308);
    expect(alias.headers().location).toBe(path);
  } finally { await context.close(); }
});

test("pip values, signed movement, units and conversions recalculate and validate", async ({ page }) => {
  await page.goto(path);
  const result = page.locator("#calculation-result");
  await page.getByLabel("Trade size (lots)", { exact: true }).fill("0.1");
  await expect(page.locator("[data-result]")).toHaveText("USD 1.00");
  await page.getByText("Calculate a move between two prices", { exact: true }).click();
  await page.getByLabel("Show signed price movement in pips").check();
  await expect(result).toContainText("+50 pips");
  await page.getByLabel("End price", { exact: true }).fill("1.09950");
  await expect(result).toContainText("-5 pips");
  await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await page.getByLabel("Show signed price movement in pips").uncheck();
  await expect(result).toContainText("conversion");
  await page.getByLabel("USD/JPY conversion rate", { exact: true }).fill("160");
  await page.getByLabel("Trade size (lots)", { exact: true }).fill("1");
  await expect(page.locator("[data-result]")).toHaveText("USD 6.25");
  await page.getByLabel("Trade-size input", { exact: true }).selectOption("units");
  await page.getByLabel("Trade size (USD units)", { exact: true }).fill("100000");
  await expect(page.locator("[data-result]")).toHaveText("USD 6.25");
  await page.getByLabel("USD/JPY conversion rate", { exact: true }).fill("0");
  await expect(result).toContainText("Check your inputs");
  await expect(page.locator("[data-result]")).toHaveCount(0);
});

test("daily references carry real dates, stale labels and honest failures", async ({ page }) => {
  const oldDate = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10) + "T00:00:00.000Z";
  await page.route("**/api/forex-rates", route => route.fulfill({ json: { rates: [{ base: "USD", quote: "JPY", rate: "160", source: "frankfurter", asOf: oldDate }], retrievedAt: new Date().toISOString(), provider: "Frankfurter", sourceUrl: "https://frankfurter.dev/", cached: true } }));
  await page.goto(path);
  await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await page.getByLabel("Conversion-rate source", { exact: true }).selectOption("daily");
  await expect(page.locator("[data-result]")).toHaveText("USD 6.25");
  await expect(page.locator("#calculation-result")).toContainText("Stale / cached daily reference");
  await expect(page.locator("#calculation-result")).toContainText(oldDate.slice(0, 10));
  await page.unroute("**/api/forex-rates");
  await page.route("**/api/forex-rates", route => route.fulfill({ status: 503, json: { error: "Reference provider unavailable." } }));
  await page.reload();
  await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await page.getByLabel("Conversion-rate source", { exact: true }).selectOption("daily");
  await expect(page.locator("[data-result]")).toHaveCount(0);
  await expect(page.locator("main")).toContainText("Reference provider unavailable");
});

test("copy/share restores inputs and reset clears an unsupported shared version", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copiedScenario?: string }).copiedScenario = text; } } }); });
  await page.goto(path);
  await page.getByLabel("Trade size (lots)", { exact: true }).fill("0.35");
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click();
  const link = await page.evaluate(() => (window as Window & { copiedScenario?: string }).copiedScenario!);
  expect(new URL(link).searchParams.get("volume")).toBe("0.35");
  await page.goto(link);
  await expect(page.getByLabel("Trade size (lots)", { exact: true })).toHaveValue("0.35");
  await expect(page.locator("[data-result]")).toHaveText("USD 3.50");
  await page.getByRole("button", { name: "Copy results", exact: true }).click();
  expect(await page.evaluate(() => (window as Window & { copiedScenario?: string }).copiedScenario)).toContain("USD 3.50");
  await page.goto(path + "?v=42");
  await expect(page.locator("#calculation-result")).toContainText("version");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.locator("[data-result]")).toHaveText("USD 10.00");
});

test("pip workspace remains readable and operable at phone and desktop widths", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByLabel("Trade size (lots)", { exact: true }).fill("0.2");
    await expect(page.locator("[data-result]")).toHaveText("USD 2.00");
    await page.locator("[data-trade-workbench]").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/pip-calculator-${width}.png` });
  }
});
