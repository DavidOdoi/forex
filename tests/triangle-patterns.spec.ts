import { test, expect } from "@playwright/test";
import { boundary, historicalPoints, futurePoints, toScreen, measuredMove, triangleKinds, scenarios, exercises, illustrationLabel } from "../src/lib/education/triangles";
import { trianglePath, triangleTitle, triangleStructuredData } from "../src/lib/education/triangle-page";
import { indexable, siteOrigin } from "../src/lib/site";

test("triangle geometry converges, preserves the intended slopes and uses correct price-to-screen mapping", () => {
  for (const kind of triangleKinds) {
    const upperStart = boundary(kind, "upper", 4), lowerStart = boundary(kind, "lower", 4);
    const upperEnd = boundary(kind, "upper", 64), lowerEnd = boundary(kind, "lower", 64);
    expect(upperEnd - lowerEnd).toBeLessThan(upperStart - lowerStart);
    for (let t = 0; t <= 82; t++) expect(boundary(kind, "upper", t)).toBeGreaterThan(boundary(kind, "lower", t));
    if (kind === "ascending") { expect(upperEnd).toBe(upperStart); expect(lowerEnd).toBeGreaterThan(lowerStart); }
    if (kind === "descending") { expect(upperEnd).toBeLessThan(upperStart); expect(lowerEnd).toBe(lowerStart); }
    if (kind === "symmetrical") { expect(upperEnd).toBeLessThan(upperStart); expect(lowerEnd).toBeGreaterThan(lowerStart); }
    const points = historicalPoints(kind);
    expect(points).toHaveLength(6);
    points.forEach((point, i) => expect(point.price).toBeCloseTo(boundary(kind, i % 2 === 0 ? "upper" : "lower", point.time), 10));
  }
  expect(toScreen({ time: 0, price: 0 })).toEqual({ x: 54, y: 245 });
  expect(toScreen({ time: 100, price: 100 })).toEqual({ x: 389, y: 63 });
  expect(toScreen({ time: 50, price: 75 }).y).toBeLessThan(toScreen({ time: 50, price: 25 }).y);
  expect(boundary("wedge", "upper", 64)).toBeGreaterThan(boundary("wedge", "upper", 4));
  expect(boundary("wedge", "lower", 64)).toBeGreaterThan(boundary("wedge", "lower", 4));
  expect(boundary("rectangle", "upper", 64) - boundary("rectangle", "lower", 64)).toBe(boundary("rectangle", "upper", 4) - boundary("rectangle", "lower", 4));
  for (let t = 14; t <= 68; t++) expect(boundary("pennant", "upper", t)).toBeGreaterThan(boundary("pennant", "lower", t));
  expect(historicalPoints("pennant")[2].price - historicalPoints("pennant")[0].price).toBeGreaterThan(60);
});

test("all fifteen scenarios match their direction; failures return inside and retests touch the original boundary", () => {
  for (const kind of triangleKinds) {
    expect(futurePoints(kind, "forming")).toEqual([]);
    const up = futurePoints(kind, "up"), down = futurePoints(kind, "down");
    expect(up[0].price).toBeGreaterThan(boundary(kind, "upper", up[0].time));
    expect(up.at(-1)!.price).toBeGreaterThan(up[0].price);
    expect(down[0].price).toBeLessThan(boundary(kind, "lower", down[0].time));
    expect(down.at(-1)!.price).toBeLessThan(down[0].price);
    const retest = futurePoints(kind, "retest");
    expect(retest[2].price).toBe(boundary(kind, "upper", retest[2].time));
    expect(retest[3].price).toBeGreaterThan(retest[2].price);
    const failure = futurePoints(kind, "false");
    expect(failure[0].price).toBeGreaterThan(boundary(kind, "upper", failure[0].time));
    expect(failure.at(-1)!.price).toBeLessThan(boundary(kind, "upper", failure.at(-1)!.time));
    expect(failure.at(-1)!.price).toBeGreaterThan(boundary(kind, "lower", failure.at(-1)!.time));
    for (const scenario of scenarios) for (const point of futurePoints(kind, scenario.id)) { expect(point.price).toBeGreaterThan(0); expect(point.price).toBeLessThan(100); }
  }
  expect(exercises.map(item => item.kind)).toEqual(["ascending", "descending", "symmetrical", "wedge", "unclear"]);
});

test("measured move uses exact decimal arithmetic in price units and validates direction, ranges and precision", () => {
  expect(measuredMove("1.1000", "1.0950", "1.1020", "up")).toEqual({ ok: true, height: "0.0050", target: "1.1070" });
  expect(measuredMove("1.1000", "1.0950", "1.1020", "down")).toEqual({ ok: true, height: "0.0050", target: "1.0970" });
  expect(measuredMove("0.3", "0.2", "0.2", "up")).toEqual({ ok: true, height: "0.1000", target: "0.3000" });
  expect(measuredMove("1.00000002", "1.00000001", "1.00000009", "up")).toEqual({ ok: true, height: "0.00000001", target: "1.00000010" });
  for (const invalid of ["", " ", "0", "-1", "NaN", "Infinity", "1e3", "1,1000", "1.000000001", "1000000000", "1.2x"]) {
    for (const field of ["upper", "lower", "reference"]) {
      const args = { upper: "1.1", lower: "1.0", reference: "1.2", [field]: invalid };
      expect(measuredMove(args.upper, args.lower, args.reference, "up"), `${field}/${invalid}`).toMatchObject({ ok: false, field });
    }
  }
  expect(measuredMove("1", "1", "1.2", "up")).toMatchObject({ ok: false, field: "upper" });
  expect(measuredMove("0.9", "1", "1.2", "up")).toMatchObject({ ok: false, field: "upper" });
  expect(measuredMove("2", "1", "1", "down")).toMatchObject({ ok: false, field: "reference" });
  expect(measuredMove("2", "1", "0.9", "down")).toMatchObject({ ok: false, field: "reference" });
  expect(measuredMove("2", "1", "3", "sideways")).toMatchObject({ ok: false, field: "direction" });
});

test("initial HTML contains core diagrams, comparison, formulas and honest source status without JavaScript", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    const response = await page.goto(trianglePath); expect(response!.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(triangleTitle); await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".tp-pattern-grid svg")).toHaveCount(3);
    await expect(page.getByRole("complementary", { name: "Editorial verification status" })).toContainText("source checks pending");
    await expect(page.locator(".tp-pattern-card")).toHaveCount(3);
    await expect(page.getByRole("table", { name: "Triangle geometry in words" })).toBeVisible();
    await expect(page.locator("#measured-move")).toContainText("1.1070");
    await expect(page.locator("#sources")).toContainText("not consulted");
    await expect(page.locator("#sources")).toContainText("no independent reviewer");
    await expect(page.locator('[data-explorer] [data-future]')).toHaveCount(0);
    await expect(page.locator(".tp-example [data-future]")).toHaveCount(2);
    await expect(page.locator(".tp-diagram figcaption")).toHaveCount(11);
    for (const caption of await page.locator(".tp-diagram figcaption").allTextContents()) expect(caption).toBe(illustrationLabel);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + trianglePath);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", indexable ? "index, follow" : "noindex, follow");
    await expect(page).toHaveTitle("Triangle Chart Patterns: Types & Examples | DEVIN FOREX");
    const schema = JSON.parse(await page.locator('main script[type="application/ld+json"]').innerText());
    expect(schema).toEqual(triangleStructuredData());
    expect(JSON.stringify(schema)).not.toMatch(/datePublished|dateModified|reviewedBy|ratingValue|Person/);
    await expect(page.locator("#faq details")).toHaveCount(9);
    const sitemap = await (await request.get("/sitemap.xml")).text(); expect(sitemap).toContain(siteOrigin + trianglePath);
    const internalLinks = await page.locator('main a[href^="/"]').evaluateAll(links => [...new Set(links.map(link => link.getAttribute("href")!))]);
    for (const href of internalLinks) expect((await request.get(href)).status(), href).toBe(200);
    const ids = await page.locator("main [id]").evaluateAll(nodes => nodes.map(node => node.id)); expect(new Set(ids).size).toBe(ids.length);
    const anchors = await page.locator('main a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute("href")!.slice(1)));
    for (const anchor of anchors) expect(await page.locator(`[id="${anchor}"]`).count(), anchor).toBe(1);
    const social = await request.get(trianglePath + "/opengraph-image"); expect(social.status()).toBe(200); expect(social.headers()["content-type"]).toContain("image/png");
  } finally { await context.close(); }
});

test("explorer controls reveal distinct correct paths for all patterns and scenarios, then reset without leaking future prices", async ({ page }) => {
  await page.goto(trianglePath); const explorer = page.locator("[data-explorer]");
  const paths = new Set<string>();
  for (const kind of triangleKinds) {
    await page.getByLabel("Pattern", { exact: true }).selectOption(kind);
    for (const scenario of scenarios) {
      await page.getByLabel("Scenario", { exact: true }).selectOption(scenario.id);
      await expect(explorer.locator("[data-future]")).toHaveCount(0);
      await expect(explorer.locator("[data-boundaries]")).toHaveCount(0);
      await expect(explorer.locator("[data-scenario-explanation]")).toHaveCount(0);
      for (let step = 1; step <= 4; step++) {
        await explorer.getByRole("button", { name: "Next step" }).click();
        if (step < 3) await expect(explorer.locator("[data-future]")).toHaveCount(0);
      }
      await expect(explorer.locator("[data-scenario-explanation]")).toContainText(scenario.observation);
      await expect(explorer.locator("[data-scenario-explanation]")).toContainText(scenario.interpretation);
      await expect(explorer.getByRole("button", { name: "Next step" })).toBeDisabled();
      if (scenario.id !== "forming") {
        const path = await explorer.locator("[data-future] path").getAttribute("d"); expect(paths.has(path!)).toBe(false); paths.add(path!);
      } else await expect(explorer.locator("[data-future]")).toHaveCount(0);
      await explorer.getByRole("button", { name: "Reset reveal" }).click();
      await expect(explorer.locator("[data-future]")).toHaveCount(0);
      await expect(explorer.locator(".tp-step-panel")).toContainText("Step 1 of 5");
    }
  }
  expect(paths.size).toBe(12);
});

test("measured-move form handles live edits, exact decimal results, invalid prices and keyboard focus", async ({ page }) => {
  await page.goto(trianglePath); const calculator = page.locator("[data-measured-move]");
  await expect(calculator.locator("[data-target]")).toHaveText("1.1070");
  await page.getByLabel("Projection direction").selectOption("down");
  await expect(calculator.locator("[data-target]")).toHaveCount(0);
  await calculator.getByRole("button", { name: "Calculate reference" }).click();
  await expect(calculator.locator("[data-target]")).toHaveText("1.0970");
  await page.getByLabel("Upper measurement price").fill("0.3"); await page.getByLabel("Lower measurement price").fill("0.2"); await page.getByLabel("Breakout reference price").fill("0.2"); await page.getByLabel("Projection direction").selectOption("up");
  await calculator.getByRole("button", { name: "Calculate reference" }).click();
  await expect(calculator.locator("[data-target]")).toHaveText("0.3000");
  await page.getByLabel("Upper measurement price").fill("Infinity");
  await calculator.getByRole("button", { name: "Calculate reference" }).click();
  await expect(calculator.getByRole("alert")).toContainText("positive price");
  await expect(page.getByLabel("Upper measurement price")).toBeFocused();
  await expect(page.getByLabel("Upper measurement price")).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Upper measurement price").fill("2"); await page.getByLabel("Lower measurement price").fill("1"); await page.getByLabel("Breakout reference price").fill("0.9"); await page.getByLabel("Projection direction").selectOption("down");
  await calculator.getByRole("button", { name: "Calculate reference" }).click(); await expect(calculator.getByRole("alert")).toContainText("zero or negative");
});

test("recognition exercise explains all fixed answers, retains answers locally and resets", async ({ page }) => {
  await page.goto(trianglePath); const exercise = page.locator("[data-exercise]");
  for (let index = 0; index < exercises.length; index++) {
    await expect(exercise.locator("svg title")).toContainText(`exercise ${index + 1}`);
    await exercise.getByRole("radio", { name: exercises[index].answer, exact: true }).check();
    await expect(exercise.locator(".tp-answer-feedback")).toContainText(exercises[index].explanation);
    await expect(exercise.locator(".tp-answer-feedback")).toContainText("That matches");
    if (index < exercises.length - 1) await exercise.getByRole("button", { name: "Next example" }).click();
  }
  await exercise.getByRole("button", { name: "Previous example" }).click();
  await expect(exercise.getByRole("radio", { name: "Wedge", exact: true })).toBeChecked();
  await exercise.getByRole("radio", { name: "Ascending triangle", exact: true }).check();
  await expect(exercise.locator(".tp-answer-feedback")).toContainText("best described as: Wedge");
  await exercise.getByRole("button", { name: "Reset exercise" }).click();
  await expect(exercise.getByRole("radio", { checked: true })).toHaveCount(0);
  await expect(exercise.locator(".tp-exercise-top")).toContainText("Example 1 of 5");
});

test("keyboard, mobile charts, reduced motion and accessible descriptions remain usable", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto(trianglePath);
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), String(width)).toBe(true);
    for (const svg of await page.locator(".tp-diagram svg").all()) {
      expect(await svg.getAttribute("aria-labelledby")).toBeTruthy();
      expect(await svg.locator("title").textContent()).toBeTruthy(); expect(await svg.locator("desc").textContent()).toContain(illustrationLabel);
    }
  }
  const selector = page.getByLabel("Pattern", { exact: true }); await selector.focus(); await selector.press("ArrowDown"); await selector.press("Enter");
  await expect(selector).toHaveValue("descending");
  const next = page.locator("[data-explorer]").getByRole("button", { name: "Next step" }); await next.focus(); await page.keyboard.press("Enter");
  await expect(page.locator("[data-explorer] .tp-step-panel")).toContainText("Step 2 of 5"); await expect(next).toBeFocused();
  expect(await next.evaluate(el => getComputedStyle(el).outlineStyle)).toBe("solid");
  expect(await next.evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.locator("#faq summary").first().click(); await expect(page.locator("#faq details").first()).toHaveAttribute("open", "");
  await page.locator(".tp-first-look").screenshot({ path: "test-results/triangles-opening-desktop.png" });
  await page.setViewportSize({ width: 390, height: 900 }); await page.locator("[data-explorer]").screenshot({ path: "test-results/triangles-explorer-mobile.png", style: "body > header { visibility: hidden; }" });
  await expect(page.locator(".tp-mobile-compare")).toBeVisible();
  await page.locator(".tp-mobile-compare").screenshot({ path: "test-results/triangles-overview-mobile.png", style: "body > header { visibility: hidden; }" });
  expect(errors).toEqual([]);
});
