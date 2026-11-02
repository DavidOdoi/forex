import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/about",
  "/contact",
  "/affiliate-disclosure",
  "/risk-disclosure",
  "/privacy-policy",
  "/terms-and-conditions",
  "/learn",
  "/glossary",
  "/methodology",
  "/editorial-standards",
  "/faq",
];
test("public pages, metadata, legal notices and security headers", async ({
  page,
}) => {
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response?.headers()["x-frame-options"]).toBe("DENY");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Devin Forex/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Devin Forex/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary",
    );
    if (process.env.SITE_URL)
      expect(
        new URL(
          (await page.locator('link[rel="canonical"]').getAttribute("href"))!,
        ).href,
      ).toBe(new URL(route, process.env.SITE_URL).href);
    else await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    if (
      route.includes("disclosure") ||
      route.includes("policy") ||
      route.includes("conditions")
    )
      await expect(
        page.getByText("Draft — for final legal review."),
      ).toBeVisible();
  }
});
test("desktop navigation, placeholders, landmarks and local links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.locator(".category-card a")).toHaveCount(0);
  await expect(page.locator(".category-card")).toHaveCount(3);
  const links = await page
    .locator('a[href^="/"]')
    .evaluateAll((elements) => [
      ...new Set(elements.map((e) => e.getAttribute("href"))),
    ]);
  for (const href of links) expect(routes).toContain(href!.split("#")[0]);
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
});
test("mobile menu, escape key, navigation and responsive widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator(".menu-button");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation", exact: true })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
});
test("contact validates locally and never sends form data", async ({
  page,
}) => {
  await page.goto("/contact");
  const button = page.getByRole("button", { name: "Check entries locally" });
  await button.click();
  expect(
    await page
      .locator("form")
      .evaluate((form: HTMLFormElement) => form.checkValidity()),
  ).toBe(false);
  await page.getByLabel("Your name").fill("Test Visitor");
  await page.getByLabel("Email address").fill("visitor@example.test");
  await page
    .getByLabel("Message", { exact: true })
    .fill("This is a local form demonstration.");
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") requests.push(request.url());
  });
  await button.click();
  await expect(page.getByRole("status")).toContainText(
    "Nothing was sent or saved",
  );
  expect(requests).toEqual([]);
});
test("robots, sitemap, organization schema, custom 404", async ({
  page,
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const indexable =
    Boolean(process.env.SITE_URL) && process.env.VERCEL_ENV !== "preview";
  expect(await robots.text()).toContain(indexable ? "Allow: /" : "Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  if (process.env.SITE_URL) {
    expect((xml.match(/<loc>/g) ?? []).length).toBe(routes.length);
    for (const route of routes)
      expect(xml).toContain(new URL(route, process.env.SITE_URL).href);
  } else expect(xml).not.toContain("<loc>");
  await page.goto("/");
  const schema = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(schema["@type"]).toBe("Organization");
  expect(schema.name).toBe("Devin Forex");
  expect(schema).not.toHaveProperty("aggregateRating");
  const missing = await page.goto("/page-that-does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Let’s find a clearer path.",
  );
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL("/");
});

test("glossary search, topic filters, empty state and reset", async ({
  page,
}) => {
  await page.goto("/glossary");
  const input = page.getByRole("searchbox", { name: "Search forex terms" });
  await expect(page.locator(".glossary-entry")).toHaveCount(17);
  await page.getByRole("button", { name: "Risk", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Risk", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".glossary-entry")).toHaveCount(4);
  await input.fill("leverage");
  await expect(page.locator(".glossary-entry")).toHaveCount(2);
  await expect(
    page.getByRole("heading", { level: 2, name: "Leverage", exact: true }),
  ).toBeVisible();
  await input.fill("no-such-term");
  await expect(
    page.getByRole("heading", { name: "No matching terms, yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all terms" }).click();
  await expect(input).toHaveValue("");
  await expect(page.locator(".glossary-entry")).toHaveCount(17);
  await page.screenshot({
    path: "test-results/glossary-desktop.png",
    fullPage: true,
  });
});
test("FAQ disclosure controls and learning deep links", async ({ page }) => {
  await page.goto("/faq");
  const first = page.locator("details").first();
  await first.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("open", "");
  await expect(first.locator("p")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(first).not.toHaveAttribute("open", "");
  for (const section of ["basics", "costs", "risk", "platforms"]) {
    await page.goto(`/learn#${section}`);
    await expect(page.locator(`#${section}`)).toBeVisible();
  }
  for (const term of ["leverage", "spread", "pip"]) {
    await page.goto(`/glossary#${term}`);
    await expect(page.locator(`#${term}`)).toBeVisible();
  }
});
test("WCAG accessibility checks on every public page", async ({ page }) => {
  test.setTimeout(90000);
  const failures: unknown[] = [];
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    if (results.violations.length)
      failures.push({
        route,
        violations: results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            details: n.any.map((a) => a.data),
          })),
        })),
      });
  }
  expect(failures).toEqual([]);
});
