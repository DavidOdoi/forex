import { test, expect } from "@playwright/test";
import replacements from "./fixtures/calculator-intro-rewrites.json";
import { calculators, toolPath } from "../src/lib/calculators/catalog";
const existing = replacements.filter(item => item.actualPath !== null);
test("all 29 requested entries are accounted for and every existing definition has the exact replacement", () => {
  expect(replacements).toHaveLength(29); expect(new Set(replacements.map(item=>item.number)).size).toBe(29);
  for (const item of existing) { const tool = calculators.find(tool => toolPath(tool) === item.actualPath); expect(tool, item.name).toBeDefined(); expect(tool!.intro).toBe(item.intro); expect(tool!.quickAnswer).toBe(item.quickAnswer); }
  for (const item of replacements.filter(item => item.actualPath === null)) expect(calculators.some(tool => toolPath(tool) === item.requestedPath)).toBe(false);
});
for (const item of existing) test(`${item.number}: exact intro and one Quick answer on ${item.actualPath}`, async ({ page, request }) => {
  await page.goto(item.actualPath!);
  const header = page.locator("main header").first(), intro = header.locator("h1 + p"), quick = page.locator('#quick-answer + p');
  await expect(intro).toHaveText(item.intro); await expect(quick).toHaveText(item.quickAnswer);
  await expect(page.locator('main h1')).toHaveCount(1); await expect(page.locator('#quick-answer')).toHaveCount(1); await expect(page.locator('section[aria-labelledby="quick-answer"]')).toHaveCount(1);
  await expect(page.getByText(item.intro,{exact:true})).toHaveCount(1); await expect(page.getByText(item.quickAnswer,{exact:true})).toHaveCount(1);
  const html = await (await request.get(item.actualPath!)).text(); expect(html).toContain(item.intro.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll("'",'&#x27;'));
  for (const width of [320,390]) { await page.setViewportSize({width,height:900}); expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true); expect(await intro.evaluate(node=>parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16); expect(await quick.evaluate(node=>parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16); expect(await intro.evaluate(node=>parseFloat(getComputedStyle(node).fontSize))).toBeLessThan(await header.locator('h1').evaluate(node=>parseFloat(getComputedStyle(node).fontSize))); }
  await page.locator('#calculator').scrollIntoViewIfNeeded(); await expect(page.locator('#calculator')).toBeVisible(); expect(await page.locator('#calculator').evaluate(node=>!!(node.compareDocumentPosition(document.querySelector('article')!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
});
test("unimplemented requested calculator routes remain absent",async({request})=>{for(const item of replacements.filter(item=>item.actualPath===null))expect((await request.get(item.requestedPath,{maxRedirects:0})).status(),item.requestedPath).toBe(404);});
