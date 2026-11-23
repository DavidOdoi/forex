import { test, expect } from "@playwright/test";
import { brokerRecommendations, countryCode, countryOptions, detectedCountry } from "../src/lib/broker-recommendations/model";
import { countryResearch } from "../src/lib/broker-recommendations/markets";
import { isSelectedReviewSlug } from "../src/lib/reviews/selection";

const date = "2026-11-23";
const samples = ["/insights/how-to-start-forex-trading-in-kenya", "/reviews/exness", "/forex-brokers/sri-lanka", "/forex-brokers/united-kingdom", "/calculators/forex-lot-size-calculator", "/gold-price", "/gold-silver-prices", "/best-prop-firm-forex-eas", "/prop-firm-consistency-calculator", "/tools/forex-market-hours", "/insights/triangle-chart-patterns", "/", "/tools", "/reviews", "/insights", "/forex-brokers", "/best-brokers"];

test("country suggestions contain at most three reviewed brokers, exclude warning subjects and expire regional account links", () => {
  expect(countryOptions).toHaveLength(249);
  for (const [code] of countryOptions) {
    const result = brokerRecommendations(code, "selected", date);
    expect(result.country).toBe(code); expect(result.brokers.length).toBeLessThanOrEqual(3);
    for (const broker of result.brokers) {
      expect(isSelectedReviewSlug(broker.slug)).toBe(true);
      expect(["aafx-trading", "z-forex"]).not.toContain(broker.slug);
      expect(broker.reviewUrl).toBe(`/reviews/${broker.slug}`);
      if (broker.offer) { expect(new URL(broker.offer.url).protocol).toBe("https:"); expect(broker.offer.checkedAt).toBe(date); }
    }
  }
  expect(brokerRecommendations("GB", "selected", date).brokers.map(broker => broker.slug)).toEqual(["ig", "pepperstone", "oanda"]);
  expect(brokerRecommendations("AU", "selected", date).brokers.map(broker => broker.slug)).toEqual(["ic-markets", "pepperstone", "ig"]);
  expect(brokerRecommendations("KE", "selected", date).brokers.map(broker => broker.slug)).toEqual(["exness", "pepperstone"]);
  for (const code of ["IN", "PK", "LK", "MY", "PH", "VN", "TZ", "ET"]) {
    const result = brokerRecommendations(code, "selected", date); expect(result.mode).toBe("guidance"); expect(result.brokers).toEqual([]); expect(result.guide).toBeTruthy();
  }
  for (const code of ["GB", "KE", "AU"]) {
    expect(brokerRecommendations(code, "selected", "2027-03-01").brokers.every(broker => broker.offer === null)).toBe(true);
    expect(brokerRecommendations(code, "selected", "2026-11-22").brokers.every(broker => broker.offer === null)).toBe(true);
  }
});

test("country detection trusts only the deployment signal and never infers residence from an invalid or missing country", () => {
  expect(detectedCountry(new Headers({ "x-vercel-ip-country": "KE" }), true)).toBe("KE");
  expect(detectedCountry(new Headers({ "x-vercel-ip-country": "KE" }), false)).toBeNull();
  for (const code of ["", "ZZ", "../../GB", "USA", "<script>"]) expect(countryCode(code)).toBeNull();
  expect(countryCode(" gb ")).toBe("GB");
  expect(detectedCountry(new Headers(), true)).toBeNull();
  expect(brokerRecommendations(null, "unavailable", date).mode).toBe("neutral");
});

test("country API is private, uncacheable, validates manual input and returns no personal location data", async ({ request }) => {
  for (const code of ["GB", "KE", "IN", "FR"]) {
    const response = await request.get(`/api/broker-recommendations?country=${code}`);
    expect(response.status()).toBe(200); expect(response.headers()["cache-control"]).toContain("no-store"); expect(response.headers()["cache-control"]).toContain("private");
    expect(response.headers()["x-robots-tag"]).toBe("noindex");
    const data = await response.json(); expect(data.country).toBe(code); expect(data.source).toBe("selected");
    for (const key of ["ip", "city", "latitude", "longitude"]) expect(data).not.toHaveProperty(key);
  }
  expect((await request.get("/api/broker-recommendations?country=ZZ")).status()).toBe(400);
  const automatic = await (await request.get("/api/broker-recommendations", { headers: { "x-vercel-ip-country": "GB" } })).json();
  if (process.env.VERCEL !== "1") { expect(automatic.country).toBeNull(); expect(automatic.source).toBe("unavailable"); }
  for (const profile of Object.values(countryResearch)) expect((await request.get(profile.guide)).status(), profile.guide).toBe(200);
});

test("the broker panel follows the intro across all content templates and remains useful without JavaScript", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    for (const path of samples) {
      await page.goto(`http://127.0.0.1:3100${path}`);
      await expect(page.locator("[data-broker-discovery]")).toHaveCount(1);
      const panel = page.locator("[data-broker-discovery]");
      await expect(panel).toHaveAttribute("data-mode", "neutral");
      await expect(panel.locator("[data-country-broker-cta]")).toHaveCount(0);
      await expect(panel.getByRole("link", { name: "Read review", exact: true }).first()).toBeVisible();
      expect(await panel.evaluate(node => !!node.previousElementSibling && ["P", "DIV", "HEADER"].includes(node.previousElementSibling.tagName)), path).toBe(true);
      await expect(page.locator("h1")).toHaveCount(1);
      const robots = await page.locator('meta[name="robots"]').getAttribute("content"); expect(robots ?? "").not.toContain("noindex");
      const reviewLinks = await panel.locator('a[href^="/reviews/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute("href")!))]);
      for (const link of reviewLinks) expect((await request.get(link)).status()).toBe(200);
    }
  } finally { await context.close(); }
});

test("automatic suggestions change by country, manual residence persists between articles, and restricted markets receive guidance", async ({ page }) => {
  await page.route("**/api/broker-recommendations*", route => {
    const selected = new URL(route.request().url()).searchParams.get("country");
    return route.fulfill({ json: brokerRecommendations(selected ?? "GB", selected ? "selected" : "automatic", date) });
  });
  await page.goto(samples[0]);
  const panel = page.locator("[data-broker-discovery]");
  await expect(panel).toHaveAttribute("data-country", "GB");
  await expect(panel.getByRole("heading")).toHaveText("Brokers to compare in United Kingdom");
  await expect(panel.locator("[data-country-broker-cta]")).toHaveCount(3);
  await expect(panel).toContainText("Approximate browsing country");
  await panel.getByLabel("Your country of residence", { exact: true }).selectOption("KE");
  await expect(panel).toHaveAttribute("data-country", "KE");
  await expect(panel.getByRole("link", { name: "Read review", exact: true })).toHaveCount(2);
  await expect(panel.locator('a[href="https://my.exness.ke/accounts/sign-up?lng=en"]')).toBeVisible();
  await page.goto("/calculators/forex-lot-size-calculator");
  await expect(panel).toHaveAttribute("data-country", "KE");
  await panel.getByLabel("Your country of residence", { exact: true }).selectOption("IN");
  await expect(panel).toHaveAttribute("data-mode", "guidance");
  await expect(panel.locator("[data-country-broker-cta]")).toHaveCount(0);
  await expect(panel.getByRole("link", { name: "Read the country guide" })).toHaveAttribute("href", "/forex-brokers/india");
  await panel.getByLabel("Your country of residence", { exact: true }).selectOption("auto");
  await expect(panel).toHaveAttribute("data-country", "GB");
});

test("network failure and unknown markets never fabricate country availability or direct account buttons", async ({ page }) => {
  await page.route("**/api/broker-recommendations*", route => route.fulfill({ status: 503, json: { error: "Unavailable" } }));
  await page.goto(samples[0]);
  const panel = page.locator("[data-broker-discovery]");
  await expect(panel.getByRole("heading")).toHaveText("Explore reviewed brokers");
  await panel.getByLabel("Your country of residence", { exact: true }).selectOption("GB");
  await expect(panel).toHaveAttribute("data-country", "GB");
  await expect(panel.locator("[data-country-broker-cta]")).toHaveCount(0);
  await expect(panel.getByRole("link", { name: "Read review", exact: true })).toHaveCount(3);
  await panel.getByLabel("Your country of residence", { exact: true }).selectOption("FR");
  await expect(panel.getByRole("heading")).toHaveText("Explore reviewed brokers");
  await expect(panel).toContainText("No country-specific shortlist is confirmed");
});

test("review pages do not suggest the current broker and the panel fits mobile and desktop with keyboard access", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.route("**/api/broker-recommendations*", route => route.fulfill({ json: brokerRecommendations("KE", "automatic", date) }));
  await page.goto("/reviews/exness");
  const panel = page.locator("[data-broker-discovery]");
  await expect(panel).toHaveAttribute("data-country", "KE");
  await expect(panel.locator('a[href="/reviews/exness"]')).toHaveCount(0);
  await expect(panel.locator('a[href="/reviews/pepperstone"]')).toHaveCount(1);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), String(width)).toBe(true);
    for (const button of await panel.locator("[data-country-broker-cta]").all()) {
      await expect(button).toHaveAttribute("rel", "nofollow noopener noreferrer");
      expect(await button.evaluate(node => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    }
    if (width === 390 || width === 1440) await panel.screenshot({ path: `test-results/country-brokers-${width}.png`, style: "body>header,.br-sticky-nav{visibility:hidden}" });
  }
  await panel.getByText("How these are selected", { exact: true }).focus(); await page.keyboard.press("Enter");
  await expect(panel.locator("details")).toHaveAttribute("open", "");
  await page.unroute("**/api/broker-recommendations*");
  await page.route("**/api/broker-recommendations*", route => route.fulfill({ json: brokerRecommendations("GB", "automatic", date) }));
  await page.goto(samples[0]);
  await expect(panel).toHaveAttribute("data-country", "GB");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await panel.screenshot({ path: `test-results/country-brokers-${width}.png`, style: "body>header{visibility:hidden}" });
  }
  expect(errors).toEqual([]);
});
