import { test, expect } from "@playwright/test";
import { spreadDefinition } from "../src/lib/calculators/spread-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path = "/calculators/forex-spread-cost-calculator";
test("spread example and prevention of double-counting work with real controls", async ({ page }) => {
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("USD 12.00");
  await page.getByLabel("Market ask", { exact: true }).fill("1.10003");
  await page.getByLabel("Round-turn commission · account currency", { exact: true }).fill("7");
  await expect(page.locator("[data-result]")).toHaveText("USD 10.00");
  await page.getByLabel("Spread accounting", { exact: true }).selectOption("embedded");
  await expect(page.locator("[data-result]")).toHaveText("USD 7.00");
  await expect(page.locator("#calculation-result")).toContainText("informational");
  await page.getByLabel("Market ask", { exact: true }).fill("1.09");
  await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.locator("#calculation-result")).toContainText("ask must");
});
test("spread JPY conversion, optional closing spread and daily-source failure remain transparent", async ({ page }) => {
  await page.route("**/api/forex-rates", route => route.fulfill({ status: 503, json: { error: "Reference source unavailable. Use a manual quote." } }));
  await page.goto(path); await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.getByLabel("Market bid", { exact: true }).fill("159.980"); await page.getByLabel("Market ask", { exact: true }).fill("160.000");
  await page.getByLabel("USD/JPY conversion rate", { exact: true }).fill("160");
  await expect(page.locator("[data-result]")).toHaveText("USD 12.50");
  await page.getByText("Advanced assumptions and specification", { exact: true }).click();
  await page.getByLabel("Hypothetical closing spread · pips (optional)", { exact: true }).fill("4");
  await expect(page.locator("[data-result]")).toHaveText("USD 18.75");
  await page.getByLabel("Conversion rate source", { exact: true }).selectOption("daily");
  await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.locator("[data-cost-workbench]")).toContainText("Reference source unavailable");
});
test("spread scenarios share, reset and fit mobile with accessible controls", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (value: string) => { (window as Window & { copied?: string }).copied = value; } } }); });
  await page.goto(path); await page.getByLabel("Trade size", { exact: true }).fill("0.1");
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click();
  await page.goto(await page.evaluate(() => (window as Window & { copied?: string }).copied!));
  await expect(page.getByLabel("Trade size", { exact: true })).toHaveValue("0.1"); await expect(page.locator("[data-result]")).toHaveText("USD 1.20");
  await page.getByRole("button", { name: "Reset", exact: true }).click(); await expect(page.locator("[data-result]")).toHaveText("USD 12.00");
  for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
  await page.setViewportSize({ width: 390, height: 1000 }); await page.locator("[data-cost-workbench]").scrollIntoViewIfNeeded(); await page.screenshot({ path: "test-results/spread-390.png" });
});
test("spread guide and true default render without JavaScript with matched FAQ and canonical schema", async ({ browser, request }) => {
  expect(calculatorArticleWords(spreadDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(spreadDefinition)).toBeLessThanOrEqual(1800);
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:3100" + path); await expect(page.locator("h1")).toHaveCount(1); await expect(page.locator("[data-result]")).toHaveText("USD 12.00");
    await expect(page.locator("#calculator-faq details")).toHaveCount(3); await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com" + path);
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"]; expect(schema.find((item: { "@type": string }) => item["@type"] === "FAQPage").mainEntity).toHaveLength(3);
    expect(await (await request.get("/sitemap.xml")).text()).toContain(path);
  } finally { await context.close(); }
});
