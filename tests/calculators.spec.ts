import { test, expect } from "@playwright/test";
import { calculatePip, calculatePosition, calculateProfit, calculateRisk, conversionFactor, currencies, defaultConversionDirection, money, pairCodes, pairInfo, type FxInputs } from "../src/lib/calculators/forex";
import { calculateCompounding } from "../src/lib/calculators/compounding";
import { calculators, toolPath } from "../src/lib/calculators/catalog";
import { calculatorsIndexable } from "../src/lib/calculators/seo";
import { siteOrigin } from "../src/lib/site";

const eur: FxInputs = { pair: "EUR/USD", account: "USD", contractSize: 100000 };
const profit = { ...eur, side: "buy" as const, lots: 1, entry: 1.1, exit: 1.1025, commission: 0, swap: 0 };
const position = { ...eur, balance: 10000, riskMode: "percent" as const, risk: 1, stopPips: 25, lotStep: 0.01 };

test("forex P&L handles both directions, adverse moves, spread, signed costs and custom contracts", () => {
  for (const [side, exit, expected] of [["buy", 1.1025, 250], ["buy", 1.0975, -250], ["sell", 1.1025, -250], ["sell", 1.0975, 250]] as const) {
    const result = calculateProfit({ ...profit, side, exit });
    expect(result.quoteGross).toBeCloseTo(expected, 8);
    expect(result.pips).toBeCloseTo(expected / 10, 8);
  }
  expect(calculateProfit({ ...profit, commission: 7, swap: -3 }).net).toBeCloseTo(240, 8);
  expect(calculateProfit({ ...profit, commission: 7, swap: 3 }).net).toBeCloseTo(246, 8);
  expect(calculateProfit({ ...profit, exit: 1.0975, commission: 7, swap: -3 }).net).toBeCloseTo(-260, 8);
  expect(calculateProfit({ ...profit, entry: 1.1002, exit: 1.1 }).net).toBeCloseTo(-20, 8);
  expect(calculateProfit({ ...profit, contractSize: 10000 }).net).toBeCloseTo(25, 8);
  expect(calculateProfit({ ...profit, exit: profit.entry, commission: 7 }).net).toBe(-7);
});

test("JPY pips and pipettes use the quote-currency convention", () => {
  expect(calculatePip({ ...eur, lots: 1 }).gain).toBe(10);
  const yen = calculatePip({ pair: "USD/JPY", account: "JPY", contractSize: 100000, lots: 1 });
  expect(yen.pipSize).toBe(0.01); expect(yen.pipetteSize).toBe(0.001);
  expect(yen.gain).toBe(1000); expect(yen.pipetteLoss).toBe(100);
  expect(calculatePip({ ...eur, lots: 0.01 }).gain).toBeCloseTo(0.1, 10);
});

test("direct and inverse conversions use the correct bid/ask for gains and liabilities", () => {
  const direct = { base: "GBP" as const, quote: "USD" as const, bid: 1.25, ask: 1.251 };
  const inverse = { base: "USD" as const, quote: "GBP" as const, bid: 1 / direct.ask, ask: 1 / direct.bid };
  for (const quote of [direct, inverse]) {
    const pip = calculatePip({ pair: "EUR/GBP", account: "USD", contractSize: 100000, lots: 1, conversion: quote });
    expect(pip.gain).toBeCloseTo(12.5, 10); expect(pip.loss).toBeCloseTo(12.51, 10);
    expect(calculateProfit({ ...profit, pair: "EUR/GBP", entry: 0.85, exit: 0.851, conversion: quote }).net).toBeCloseTo(125, 8);
    expect(calculateProfit({ ...profit, pair: "EUR/GBP", entry: 0.85, exit: 0.849, conversion: quote }).net).toBeCloseTo(-125.1, 8);
  }
  const conversion = { base: "USD" as const, quote: "JPY" as const, bid: 150, ask: 150.02 };
  expect(calculatePip({ pair: "USD/JPY", account: "USD", contractSize: 100000, lots: 1, conversion }).gain).toBeCloseTo(1000 / 150.02, 10);
  expect(calculatePip({ pair: "USD/JPY", account: "USD", contractSize: 100000, lots: 1, conversion }).loss).toBeCloseTo(1000 / 150, 10);
});

test("position sizing respects cash budgets, rounds down and keeps lot equivalents tied to base units", () => {
  const result = calculatePosition(position);
  expect(result.lots).toBe(0.4); expect(result.units).toBe(40000);
  expect(result.miniLots).toBe(4); expect(result.microLots).toBe(40); expect(result.plannedLoss).toBe(100);
  expect(calculatePosition({ ...position, riskMode: "cash", risk: 75 }).lots).toBe(0.3);
  expect(calculatePosition({ ...position, riskMode: "cash", risk: 73, lotStep: 0.1 }).lots).toBe(0.2);
  expect(calculatePosition({ ...position, riskMode: "cash", risk: 0.1 }).lots).toBe(0);
  const custom = calculatePosition({ ...position, contractSize: 10000 });
  expect(custom.lots).toBe(4); expect(custom.standardLots).toBe(0.4); expect(custom.units).toBe(40000);
  for (const pair of pairCodes) for (const account of currencies) {
    const source = pairInfo(pair).quote;
    const output = calculatePosition({ ...position, pair, account, conversion: source === account ? undefined : { base: source, quote: account, bid: 1.1, ask: 1.1002 } });
    expect(output.plannedLoss, `${pair}/${account}`).toBeLessThanOrEqual(output.budget + 1e-9);
    expect(output.lots).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(output.rawLots)).toBe(true);
  }
});

test("invalid financial inputs never silently produce a usable size or an infinite result", () => {
  for (const value of [0, -1, NaN, Infinity]) expect(() => calculatePosition({ ...position, stopPips: value })).toThrow();
  expect(() => calculatePosition({ ...position, stopPips: Number.MIN_VALUE })).toThrow(/supported range/);
  expect(() => calculatePosition({ ...position, riskMode: "cash", risk: 10001 })).toThrow();
  expect(() => calculateRisk(10000, 101)).toThrow();
  expect(() => calculateProfit({ ...profit, lots: -1 })).toThrow();
  expect(() => calculateProfit({ ...profit, entry: 0 })).toThrow();
  expect(() => calculatePip({ ...eur, account: "EUR", lots: 1 })).toThrow(/conversion/);
  expect(() => conversionFactor("GBP", "USD", "asset", { base: "GBP", quote: "USD", bid: 2, ask: 1 })).toThrow(/ask/);
  expect(() => conversionFactor("GBP", "USD", "asset", { base: "GBP", quote: "USD", bid: 0, ask: 1 })).toThrow();
  expect(() => conversionFactor("GBP", "USD", "asset", { base: "GBP", quote: "USD", bid: Number.MIN_VALUE, ask: 1 })).toThrow();
  expect(() => conversionFactor("GBP", "USD", "asset", { base: "EUR", quote: "JPY", bid: 1, ask: 1 })).toThrow(/must connect/);
  expect(defaultConversionDirection("JPY", "USD")).toBe("inverse");
});

test("compounding matches closed forms, distinguishes contributions, handles losses and checks limits", () => {
  const basic = { capital: 1000, ratePercent: 2, periods: 12, deposit: 0, timing: "end" as const };
  expect(calculateCompounding(basic).balance).toBeCloseTo(1000 * 1.02 ** 12, 8);
  const annuity = 100 * (1.02 ** 12 - 1) / 0.02;
  const end = calculateCompounding({ ...basic, deposit: 100 });
  expect(end.balance).toBeCloseTo(1000 * 1.02 ** 12 + annuity, 8);
  expect(end.contributions).toBe(2200); expect(end.growth).toBeCloseTo(end.balance - 2200, 10);
  expect(calculateCompounding({ ...basic, deposit: 100, timing: "start" }).balance).toBeCloseTo(1000 * 1.02 ** 12 + annuity * 1.02, 8);
  expect(calculateCompounding({ ...basic, ratePercent: 0, deposit: 100 }).balance).toBe(2200);
  expect(calculateCompounding({ ...basic, ratePercent: -2 }).balance).toBeCloseTo(1000 * 0.98 ** 12, 8);
  expect(calculateCompounding({ ...basic, ratePercent: -100 }).balance).toBe(0);
  expect(calculateCompounding({ ...basic, ratePercent: -100, deposit: 100 }).balance).toBe(100);
  expect(calculateCompounding({ ...basic, ratePercent: -100, deposit: 100, timing: "start" }).balance).toBe(0);
  for (const change of [{ ratePercent: -101 }, { periods: 0 }, { periods: 12.5 }, { periods: 601 }, { capital: -1 }, { ratePercent: 100, periods: 600 }]) expect(() => calculateCompounding({ ...basic, ...change })).toThrow();
});

test("four pages ship distinct metadata, complete educational copy and truthful schema without JavaScript", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try { for (const tool of calculators) {
    const response = await page.goto(`http://127.0.0.1:3100${toolPath(tool)}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(tool.heading);
    await expect(page).toHaveTitle(tool.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", tool.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + toolPath(tool));
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", calculatorsIndexable ? "index, follow" : "noindex, follow");
    await expect(page.locator("#quick-answer")).toHaveText("Quick answer");
    expect(await page.locator("#quick-answer").evaluate(node => node.parentElement?.previousElementSibling?.tagName)).toBe("P");
    const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
    expect(graph.find((item: { "@type": string }) => item["@type"] === "WebApplication").offers.price).toBe("0");
    expect(JSON.stringify(graph)).not.toMatch(/aggregateRating|ratingValue/);
    const faqs = graph.find((item: { "@type": string }) => item["@type"] === "FAQPage").mainEntity;
    expect(faqs).toHaveLength(3); await expect(page.locator("#calculator-faq details")).toHaveCount(3);
    for (const faq of faqs) await expect(page.locator("#calculator-faq details").filter({ hasText: faq.name }).locator("p")).toHaveText(faq.acceptedAnswer.text);
    expect(await page.locator("article").evaluate(node => (node.textContent?.match(/\S+/g) ?? []).length)).toBeLessThan(1800);
    await expect(page.locator("main noscript")).toBeVisible();
    expect(await page.locator("main").evaluate(node => [...node.querySelectorAll('a[href^="#"]')].every(link => document.getElementById(link.getAttribute("href")!.slice(1))))).toBe(true);
    const slash = await request.get(toolPath(tool) + "/"); expect(slash.status()).toBe(200); expect(slash.url()).toBe(`http://127.0.0.1:3100${toolPath(tool)}`);
  } } finally { await context.close(); }
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const tool of calculators) expect(xml.includes(siteOrigin + toolPath(tool))).toBe(calculatorsIndexable);
  expect((await request.get("/tools/not-a-real-calculator")).status()).toBe(404);
});

test("multi-tool tabs work with the keyboard and validate risk inputs", async ({ page }) => {
  await page.goto("/tools/forex-calculator");
  await expect(page.locator("[data-result]")).toHaveText(money(250, "USD"));
  await page.getByRole("tab", { name: "Profit & loss", exact: true }).focus(); await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Pip value", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("[data-result]")).toHaveText(money(10, "USD", 6));
  await page.getByLabel("Position size (lots)", { exact: true }).fill("2.5");
  await expect(page.locator("[data-result]")).toHaveText(money(25, "USD", 6));
  await page.getByRole("tab", { name: "Position size", exact: true }).click(); await expect(page.locator("[data-result]")).toHaveText("0.40 lots");
  await page.getByRole("tab", { name: "Risk amount", exact: true }).click(); await expect(page.locator("[data-result]")).toHaveText(money(100, "USD"));
  await page.getByLabel("Risk percentage (%)", { exact: true }).fill("0"); await expect(page.locator("[data-result]")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Risk percentage");
});

test("profit inputs handle negative outcomes, optional costs and a signed swap credit", async ({ page }) => {
  await page.goto("/tools/forex-profit-calculator");
  await page.getByText("Commission & swap adjustments", { exact: true }).click();
  await page.getByLabel("Round-trip commission (USD)", { exact: true }).fill("7"); await page.getByLabel("Swap adjustment (USD)", { exact: true }).fill("-3");
  await expect(page.locator("[data-result]")).toHaveText(money(240, "USD"));
  await page.getByLabel("Trade direction", { exact: true }).selectOption("sell"); await expect(page.locator("[data-result]")).toHaveText(money(-260, "USD"));
  await page.getByLabel("Trade direction", { exact: true }).selectOption("buy"); await page.getByLabel("Swap adjustment (USD)", { exact: true }).fill("3");
  await expect(page.locator("[data-result]")).toHaveText(money(246, "USD"));
  await page.getByLabel("Round-trip commission (USD)", { exact: true }).fill(""); await page.getByLabel("Swap adjustment (USD)", { exact: true }).fill("");
  await expect(page.locator("[data-result]")).toHaveText(money(250, "USD"));
});

test("JPY conversion requires manual bid/ask and changing currencies discards stale quotes", async ({ page }) => {
  await page.goto("/tools/forex-profit-calculator");
  await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.getByLabel("Entry price (ask)", { exact: true }).fill("150"); await page.getByLabel("Exit price (bid)", { exact: true }).fill("150.01");
  await page.getByLabel("USD/JPY conversion bid", { exact: true }).fill("150"); await page.getByLabel("USD/JPY conversion ask", { exact: true }).fill("150.02");
  await expect(page.locator("[data-result]")).toHaveText(money(1000 / 150.02, "USD"));
  await page.getByLabel("USD/JPY conversion ask", { exact: true }).fill("149"); await expect(page.getByRole("status")).toContainText("ask must be equal to or higher"); await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.getByLabel("Account currency", { exact: true }).selectOption("JPY"); await expect(page.locator("[data-result]")).toHaveText(money(1000, "JPY"));
  await page.getByLabel("Account currency", { exact: true }).selectOption("USD"); await expect(page.getByLabel("USD/JPY conversion bid", { exact: true })).toHaveValue(""); await expect(page.locator("[data-result]")).toHaveCount(0);
});

test("sizing supports fixed cash risk, rounding and custom contracts and rejects a zero stop", async ({ page }) => {
  await page.goto("/tools/forex-position-size-calculator");
  await page.getByLabel("Risk input", { exact: true }).selectOption("cash"); await page.getByLabel("Fixed risk amount (USD)", { exact: true }).fill("73");
  await page.getByText("Contract size & lot increment", { exact: true }).click(); await page.getByLabel("Lot increment", { exact: true }).selectOption("0.1");
  await expect(page.locator("[data-result]")).toHaveText("0.20 lots");
  await page.getByLabel("Base-currency units per lot", { exact: true }).fill("10000"); await expect(page.locator("[data-result]")).toHaveText("2.90 lots");
  await page.getByLabel("Stop-loss distance (pips)", { exact: true }).fill("0"); await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.getByRole("status")).toContainText("Stop-loss distance");
});

test("compounding updates the chart, models losses, paginates full history and downloads numerical CSV", async ({ page }) => {
  await page.goto("/tools/forex-compounding-calculator");
  await expect(page.locator("[data-result]")).toHaveText(money(1000 * 1.02 ** 12, "USD")); await expect(page.locator('svg[role="img"]')).toHaveCount(1);
  await page.getByLabel("Deposit each month", { exact: true }).fill("100");
  await expect(page.locator("[data-result]")).toHaveText(money(1000 * 1.02 ** 12 + 100 * (1.02 ** 12 - 1) / .02, "USD"));
  await page.getByLabel("Deposit timing", { exact: true }).selectOption("start"); await expect(page.locator("[data-result]")).toHaveText(money(1000 * 1.02 ** 12 + 100 * (1.02 ** 12 - 1) / .02 * 1.02, "USD"));
  await page.getByLabel("Deposit each month", { exact: true }).fill("0"); await page.getByLabel("Assumed return per period (%)", { exact: true }).fill("-2");
  await expect(page.locator("[data-result]")).toHaveText(money(1000 * .98 ** 12, "USD"));
  await page.getByLabel("Compounding frequency", { exact: true }).selectOption("weekly"); await expect(page.getByLabel("Deposit each week", { exact: true })).toBeVisible();
  await expect(page.locator("[data-result]")).toHaveText(money(1000 * .98 ** 12, "USD"));
  await page.getByLabel("Number of periods", { exact: true }).fill("25");
  const table = page.getByRole("region", { name: "Compounding breakdown table", exact: true }); await expect(table.locator("tbody tr")).toHaveCount(20);
  await page.getByRole("button", { name: "Next", exact: true }).click(); await expect(table.locator("tbody tr")).toHaveCount(6);
  const downloadEvent = page.waitForEvent("download"); await page.getByRole("button", { name: "Download CSV", exact: true }).click(); const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("devin-forex-hypothetical-compounding.csv");
  const stream = await download.createReadStream(); const chunks = []; for await (const chunk of stream!) chunks.push(chunk);
  const csv = Buffer.concat(chunks).toString("utf8"); expect(csv.split("\r\n")).toHaveLength(27); expect(csv.split("\r\n")[1]).toBe("0,1000,0,0,1000,1000");
  await page.getByLabel("Number of periods", { exact: true }).fill("0"); await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.getByRole("status")).toContainText("Number of periods");
});

test("all tool pages fit small phones through desktop without browser errors", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/tools", ...calculators.map(toolPath)]) {
      await page.goto(path); await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} at ${width}`).toBe(true);
      expect(await page.locator("main").evaluate(node => getComputedStyle(node).backgroundColor)).toBe("rgb(255, 255, 255)");
      if (path !== "/tools") {
        expect(await page.locator('article p, [data-calculator] p:not([class*="resultEyebrow"]):not([data-result]), article td, article th').evaluateAll(nodes => [...new Set(nodes.map(node => getComputedStyle(node).fontSize))])).toEqual(["18px"]);
        if (width < 800) {
          const jump = page.getByRole("main").getByRole("link", { name: /View (calculation|scenario result)/, exact: true });
          await expect(jump).toHaveCSS("color", "rgb(255, 255, 255)");
          await jump.click();
          await expect(page.locator("#calculation-result")).toBeInViewport();
        }
      }
    }
  }
  expect(errors).toEqual([]);
  for (const width of [390,1440]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto("/tools/forex-calculator"); await page.locator("#calculator").scrollIntoViewIfNeeded(); await page.screenshot({ path: `test-results/forex-calculator-${width}.png` });
    await page.goto("/tools/forex-compounding-calculator"); await page.locator("#calculator").scrollIntoViewIfNeeded(); await page.screenshot({ path: `test-results/compounding-calculator-${width}.png` });
  }
});
