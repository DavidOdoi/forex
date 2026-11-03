import { test, expect } from "@playwright/test";

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
      await expect(page.locator("article").getByText("Not rated", { exact: true })).toHaveCount(4);
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
    if (process.env.SITE_URL)
      expect(
        new URL(
          (await page.locator('link[rel="canonical"]').getAttribute("href"))!,
        ).href,
      ).toBe(new URL(route, process.env.SITE_URL).href);
    else await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
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
  const outbound = page.locator('article a[target="_blank"]');
  await expect(outbound).toHaveCount(4);
  await expect(
    page.locator("article").getByText("Not rated", { exact: true }),
  ).toHaveCount(4);
  for (const link of await outbound.all()) {
    await expect(link).toHaveAttribute("href", "#");
    await expect(link).toHaveAttribute("rel", /sponsored/);
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
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "Tools", exact: true }).click();
  await expect(page).toHaveURL(/\/tools$/);
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/reference-home-mobile.png",
    fullPage: true,
  });
});

test("the three calculators retain the export’s formulas and results", async ({
  page,
}) => {
  await page.goto("/tools");
  const pip = page.locator("section > div").filter({
    has: page.getByRole("heading", { name: "Pip calculator", exact: true }),
  });
  await expect(pip).toContainText("$10.00");
  await pip.getByLabel("Lot size", { exact: true }).fill("2.5");
  await expect(pip).toContainText("$25.00");
  const size = page.locator("section > div").filter({
    has: page.getByRole("heading", { name: "Position size", exact: true }),
  });
  await expect(size).toContainText("0.10");
  await size.getByLabel("Account balance ($)", { exact: true }).fill("2000");
  await expect(size).toContainText("0.20");
  await size.getByLabel("Stop loss (pips)", { exact: true }).fill("0");
  await expect(size).toContainText("0.00");
  const profit = page.locator("section > div").filter({
    has: page.getByRole("heading", {
      name: "Profit calculator",
      exact: true,
    }),
  });
  await expect(profit).toContainText("$150.00");
  await profit.getByLabel("Pips gained / lost", { exact: true }).fill("-30");
  await expect(profit).toContainText("$-150.00");
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
    page.getByRole("heading", { name: "Do you want to deposit with M-Pesa?" }),
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
  const indexable =
    Boolean(process.env.SITE_URL) && process.env.VERCEL_ENV !== "preview";
  expect(await robots.text()).toContain(indexable ? "Allow: /" : "Disallow: /");
  const xml = await (await request.get("/sitemap.xml")).text();
  if (process.env.SITE_URL) {
    expect((xml.match(/<loc>/g) ?? []).length).toBe(routes.length);
    for (const route of routes)
      expect(xml).toContain(new URL(route, process.env.SITE_URL).href);
  } else expect(xml).not.toContain("<loc>");
  expect((await request.get("/favicon.ico")).status()).toBe(200);
  const notFound = await page.goto("/this-page-does-not-exist");
  expect(notFound?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Go home", exact: true }).click();
  await expect(page).toHaveURL("/");
});
