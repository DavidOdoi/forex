import { test, expect } from "@playwright/test";
import { marginDefinition } from "../src/lib/calculators/margin-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
import { siteOrigin } from "../src/lib/site";

const path = "/calculators/forex-margin-calculator";

test("margin tool publishes readable supporting content, truthful schema and a canonical route", async ({ browser, request }) => {
  expect(calculatorArticleWords(marginDefinition)).toBeGreaterThanOrEqual(1600);
  expect(calculatorArticleWords(marginDefinition)).toBeLessThanOrEqual(1800);
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    await page.goto(`http://127.0.0.1:3100${path}`);
    await expect(page.locator("h1")).toHaveText("Forex Margin Calculator");
    await expect(page.locator("[data-result]")).toHaveText("USD 2,200.00");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + path);
    await expect(page.locator("#calculator-faq details")).toHaveCount(3);
    await expect(page.locator("#quick-answer + p")).toContainText("$1,000");
    expect(await (await request.get("/sitemap.xml")).text()).toContain(siteOrigin + path);
    const alias = await request.get("/tools/forex-margin-calculator", { maxRedirects: 0 });
    expect(alias.status()).toBe(308); expect(alias.headers().location).toBe(path);
  } finally { await context.close(); }
});

test("margin account projection shows free margin, level and an explicit deficit", async ({ page }) => {
  await page.goto(path);
  await page.getByLabel("Trade size (lots)", { exact: true }).fill("0.2");
  await expect(page.locator("[data-result]")).toHaveText("USD 440.00");
  const result = page.locator("#calculation-result");
  await expect(result).toContainText("USD 9,560.00");
  await expect(result).toContainText("2,272.73%");
  await page.getByLabel("EUR/USD notional reference price", { exact: true }).fill("1");
  await page.getByLabel("Account equity (USD)", { exact: true }).fill("500");
  await page.getByLabel("Existing used margin (USD)", { exact: true }).fill("200");
  await expect(result).toContainText("USD -100.00");
  await expect(result).toContainText("Insufficient free margin");
  await expect(page.locator("[data-margin-allocation]")).toContainText("margin deficit");
  await page.getByLabel("Margin requirement input", { exact: true }).selectOption("percent");
  await page.getByLabel("Margin requirement (%)", { exact: true }).fill("5");
  await expect(page.locator("[data-result]")).toHaveText("USD 1,000.00");
  await page.getByLabel("Account equity (USD)", { exact: true }).fill("-1");
  await expect(page.locator("[data-result]")).toHaveCount(0);
});

test("base-account identity avoids an unnecessary JPY conversion and invalid ratios are rejected", async ({ page }) => {
  await page.goto(path);
  await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await page.getByLabel("Leverage (X in 1:X)", { exact: true }).fill("1:100");
  await expect(page.locator("[data-result]")).toHaveText("USD 1,000.00");
  await expect(page.getByLabel("Conversion-rate source", { exact: true })).toHaveCount(0);
  await page.getByLabel("Leverage (X in 1:X)", { exact: true }).fill("0");
  await expect(page.locator("[data-result]")).toHaveCount(0);
  await expect(page.locator("#calculation-result")).toContainText("leverage");
});

test("related tools receive entered units and rates, and copied margin links restore the snapshot", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copiedScenario?: string }).copiedScenario = text; } } }); });
  await page.goto(path);
  await page.getByLabel("Trade size (lots)", { exact: true }).fill("0.2");
  await page.getByLabel("Account equity (USD)", { exact: true }).fill("7500");
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click();
  const link = await page.evaluate(() => (window as Window & { copiedScenario?: string }).copiedScenario!);
  await page.goto(link);
  await expect(page.getByLabel("Account equity (USD)", { exact: true })).toHaveValue("7500");
  await page.getByRole("link", { name: "Check this volume’s pip value", exact: false }).click();
  await expect(page.locator("[data-result]")).toHaveText("USD 2.00");
  await page.getByRole("link", { name: "Use this volume in the margin calculator", exact: false }).click();
  await expect(page.getByLabel("EUR/USD notional reference price", { exact: true })).toHaveValue("");
  await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.getByLabel("EUR/USD notional reference price", { exact: true }).fill("1.1");
  await expect(page.locator("[data-result]")).toHaveText("USD 440.00");
  await page.getByRole("link", { name: "Reuse pair and account inputs in lot sizing", exact: false }).click();
  await expect(page.locator("h1")).toHaveText("Forex Lot Size Calculator");
  await expect(page.getByLabel("Account currency", { exact: true })).toHaveValue("USD");
});

test("margin allocation and controls fit mobile and desktop", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator("[data-trade-workbench]").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/margin-calculator-${width}.png` });
  }
});
