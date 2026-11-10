import { test, expect } from "@playwright/test";

test("desktop navigation supports keyboard disclosure, escape, real links and the new logo", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const header = page.locator("body > header");
  const logo = header.getByRole("img", { name: "Devin Forex", exact: true });
  await expect.poll(() => logo.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
  await expect(header).not.toContainText(/Global|\bEN\b/);
  await expect(page.locator("body > footer")).not.toContainText(/Global · English/);
  const nav = header.getByRole("navigation", { name: "Main navigation", exact: true });
  const tools = nav.getByRole("button", { name: "Tools submenu", exact: true });
  await tools.focus(); await page.keyboard.press("ArrowDown");
  const forex = nav.getByRole("link", { name: "Forex calculator", exact: true });
  await expect(forex).toBeFocused();
  await expect(tools).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(tools).toBeFocused();
  await expect(tools).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter"); await forex.click();
  await expect(page).toHaveURL(/\/tools\/forex-calculator$/);
  await header.getByRole("link", { name: "Find my broker", exact: true }).click();
  await expect(page).toHaveURL(/\/find-my-broker$/);
  await expect(page.getByRole("heading", { name: "Are you new to trading?", exact: true })).toBeVisible();
});

test("mobile navigation traps focus, closes with Escape or navigation, and restores scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open navigation", exact: true });
  await open.click();
  const drawer = page.getByRole("dialog", { name: "Site navigation", exact: true });
  await expect(drawer).toBeVisible();
  await expect(open).toHaveAttribute("aria-expanded", "true");
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    expect(await drawer.evaluate(node => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape"); await expect(drawer).not.toBeVisible(); await expect(open).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  await open.click();
  await drawer.getByRole("button", { name: "Tools links", exact: true }).click();
  await drawer.getByRole("link", { name: "Profit calculator", exact: true }).click();
  await expect(page).toHaveURL(/\/tools\/forex-profit-calculator$/); await expect(drawer).not.toBeVisible();
  await open.click(); await drawer.getByRole("link", { name: "Find my broker", exact: true }).click();
  await expect(page).toHaveURL(/\/find-my-broker$/); await expect(drawer).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "Are you new to trading?", exact: true })).toBeVisible();
  await open.click(); await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main navigation", exact: true })).toBeVisible();
});

test("broker finder handles all answer combinations, going back, review links and restarting", async ({ page, request }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/find-my-broker");
  const questions = ["Are you new to trading?", "Are low spreads your top priority?", "Do you want to compare demo accounts?"];
  for (let pattern = 0; pattern < 8; pattern++) {
    for (let step = 0; step < 3; step++) {
      await expect(page.getByRole("heading", { name: questions[step], exact: true })).toBeVisible();
      await expect(page.getByRole("progressbar", { name: "Broker finder progress", exact: true })).toHaveAttribute("value", String(step));
      await page.getByRole("button", { name: pattern & (1 << step) ? "Yes" : "No", exact: true }).click();
    }
    await expect(page.getByRole("heading", { name: "Illustrative match", exact: true })).toBeVisible();
    const review = page.locator('main article a[href^="/reviews/"]');
    await expect(review).toHaveCount(1);
    expect((await request.get((await review.getAttribute("href"))!)).status()).toBe(200);
    expect((await request.get("/reviews")).status()).toBe(200);
    await expect(page.getByRole("link", { name: "Browse all broker research", exact: true })).toHaveAttribute("href", "/reviews");
    await page.getByRole("button", { name: "Start again", exact: true }).click();
  }
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await page.getByRole("button", { name: "Previous question", exact: true }).click();
  await expect(page.getByRole("heading", { name: questions[0], exact: true })).toBeFocused();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await expect(page.getByRole("heading", { name: questions[1], exact: true })).toBeFocused();
});
