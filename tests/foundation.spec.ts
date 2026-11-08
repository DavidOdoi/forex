import { test, expect } from "@playwright/test";
import { insightArticles } from "../src/lib/insights/catalog";
import { insightsIndexable } from "../src/lib/insights/seo";
import { calculators, toolPath } from "../src/lib/calculators/catalog";
import { calculatorsIndexable } from "../src/lib/calculators/seo";
import { hubPaths } from "../src/lib/metals/content";
import { metalsIndexable } from "../src/lib/metals/seo";
import { indexable, publicPaths } from "../src/lib/site";

const routes = [
  "/",
  "/best-brokers",
  "/reviews",
  "/tools",
  "/insights",
  "/about",
  "/find-my-broker",
];
const names = ["Exness", "XM", "IC Markets", "Pepperstone"];

test("all seven exported pages render with their metadata and assets", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    if (route === "/reviews") {
      await expect(page.getByRole("main")).toContainText("We have not carried out hands-on testing or published broker ratings");
      await expect(page.getByRole("searchbox", { name: "Search broker reviews" })).toBeVisible();
      await expect(page.getByRole("main")).not.toContainText("We open real accounts, deposit real money and test withdrawals");
    }
    await expect(page).toHaveTitle(/Devin Forex/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe(new URL(route, process.env.SITE_URL ?? "https://devinforex-five.vercel.app").href);
    expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  }
  await page.goto("/");
  expect(
    await page
      .locator("main img")
      .evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth === 1600,
      ),
  ).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Trade the world's largest market with the right partner.",
  );
  await expect(page.locator("footer")).toContainText("© 2026 Devin Forex");
  expect(errors).toEqual([]);
});

test("desktop navigation, dropdowns, comparison table and original broker cards", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const nav = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  });
  await nav.getByRole("link", { name: "Compare brokers", exact: true }).hover();
  await expect(
    nav.getByRole("link", { name: "Overview", exact: true }),
  ).toBeVisible();
  await nav.getByRole("link", { name: "Overview", exact: true }).click();
  await expect(page).toHaveURL(/\/best-brokers$/);
  await expect(page.locator("table tbody tr")).toHaveCount(4);
  await expect(
    page.locator("table tbody").getByText("Not rated", { exact: true }),
  ).toHaveCount(4);
  await expect(page.getByRole("main")).toContainText("unverified examples");
  for (const name of names)
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  const outbound = page.locator('article a[href^="/reviews/"]');
  await expect(outbound).toHaveCount(4);
  await expect(
    page.locator("article").getByText("Not rated", { exact: true }),
  ).toHaveCount(4);
  for (const link of await outbound.all()) {
    await expect(link).toHaveAttribute("href", /^\/reviews\//);
  }
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/reference-home-desktop.png",
    fullPage: true,
  });
});

test("mobile navigation and all exported pages fit responsive viewports", async ({
  page,
}) => {
  test.setTimeout(60000);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const nav = page.getByRole("navigation", {
    name: "Mobile navigation",
    exact: true,
  });
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "Tools", exact: true }).click();
  await expect(page).toHaveURL(/\/tools$/);
  await expect(page.getByRole("dialog", { name: "Site navigation", exact: true })).not.toBeVisible();
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/reference-home-mobile.png",
    fullPage: true,
  });
});

test("the tools hub links to all four working calculators and retains existing fragment targets", async ({
  page,
}) => {
  await page.goto("/tools");
  await expect(page.locator("[data-tool-card]")).toHaveCount(4);
  for (const tool of calculators) await expect(page.getByRole("main").getByRole("link", { name: tool.heading, exact: true })).toHaveAttribute("href", toolPath(tool));
  for (const id of ["pip-calculator", "position-size", "profit-calculator"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await page.getByRole("main").getByRole("link", { name: "Forex Trading Profit Calculator", exact: true }).click();
  await expect(page).toHaveURL(/\/tools\/forex-profit-calculator$/);
  await expect(page.locator("[data-result]")).toHaveText(/USD\s*250\.00/);
});

test("broker finder completes the original three questions and restarts", async ({
  page,
}) => {
  await page.goto("/find-my-broker");
  await expect(
    page.getByRole("heading", { name: "Are you new to trading?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Are low spreads your top priority?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Do you want to compare demo accounts?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Illustrative match", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Exness", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start again", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Are you new to trading?" }),
  ).toBeVisible();
});

test("homepage anchors, FAQs and reduced-motion ticker", async ({ page }) => {
  await page.goto("/");
  const marketBoard = page.getByRole("region", { name: "Markets at a glance", exact: true });
  await expect(marketBoard).toContainText("Illustrative quotes · not live market data");
  await expect(marketBoard.getByRole("listitem")).toHaveCount(7);
  await marketBoard.getByRole("button", { name: "Pause market ticker", exact: true }).click();
  await expect(page.locator(".ticker")).toHaveCSS("animation-play-state", "paused");
  await marketBoard.getByRole("button", { name: "Play market ticker", exact: true }).click();
  await page
    .getByRole("main")
    .getByRole("link", { name: "Compare brokers", exact: true })
    .click();
  await expect(page).toHaveURL(/#brokers$/);
  await expect(page.locator("#brokers")).toBeVisible();
  const faq = page.locator("details").first();
  await faq.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(faq).toHaveAttribute("open", "");
  await expect(faq.locator("p")).toContainText("Yes, in most countries");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".ticker")
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
});

test("sitemap, robots, exported favicon and custom 404", async ({
  request,
  page,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Allow: /");
  const xml = await (await request.get("/sitemap.xml")).text();
  const expectedPaths = new Set([
    ...(indexable ? publicPaths : []),
    ...(insightsIndexable ? ["/insights", ...insightArticles.map(article => `/insights/${article.slug}`)] : []),
    ...(calculatorsIndexable ? ["/tools", ...calculators.map(toolPath)] : []),
    ...(metalsIndexable ? hubPaths : []),
  ]);
  expect((xml.match(/<loc>/g) ?? []).length).toBe(expectedPaths.size);
  for (const path of expectedPaths) expect(xml).toContain(new URL(path, process.env.SITE_URL ?? "https://devinforex-five.vercel.app").href);
  expect((await request.get("/favicon.ico")).status()).toBe(200);
  const notFound = await page.goto("/this-page-does-not-exist");
  expect(notFound?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Go home", exact: true }).click();
  await expect(page).toHaveURL("/");
});
