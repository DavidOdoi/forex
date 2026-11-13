import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { malaysiaGuide, countryRegistry, sriLankaGuide } from "../src/lib/country-guides/catalog";
import { malaysiaDossier } from "../src/lib/country-guides/malaysia";
import { checkedSource, claimVerified } from "../src/lib/country-guides/evidence";
import { countryResearchPresentation } from "../src/lib/country-guides/research-comparison";
import { guideApproved } from "../src/lib/country-guides/publication";
import { countryFeaturedImage } from "../src/lib/country-guides/media";

const path = "/forex-brokers/malaysia", asOf = "2026-11-13";

test("Malaysia preserves the supplied dossier and distinguishes corrected source checks from country approval", () => {
  const archive = readFileSync(malaysiaDossier.archivePath), delimiter = Buffer.from("\n---\n\n");
  const original = archive.subarray(archive.indexOf(delimiter) + delimiter.length);
  expect(createHash("sha256").update(original).digest("hex")).toBe(malaysiaDossier.originalSha256);
  expect(malaysiaDossier.brokerResearch.map(row => row.brokerSlug)).toEqual(["ic-markets", "oanda", "xm", "fbs", "tickmill"]);
  expect(malaysiaDossier.reportedFindings).toHaveLength(5);
  expect(malaysiaDossier.legalReviewQuestions).toHaveLength(2);
  for (const reported of malaysiaDossier.reportedSources) expect(reported.checkedAt).toBeNull();
  expect(countryRegistry.sources.find(source => source.id === "my-sc-cfd-current")).toMatchObject({ publishedAt: "2024-06-14", publicationDateStatus: "verified", checkedAt: asOf, access: "retrieved" });
  expect(countryRegistry.sources.find(source => source.id === "my-sc-cfd-faq-current")).toMatchObject({ publishedAt: "2024-10-14", checkedAt: asOf });
  expect(claimVerified(malaysiaGuide.legalSummary, "malaysia", null, countryRegistry, asOf)).toBe(true);
  expect(guideApproved(malaysiaGuide, countryRegistry, asOf)).toBe(false);
  expect(malaysiaGuide).toMatchObject({ publicationStatus: "draft", legalStatus: "pending_review", legalReviewReference: null, humanApprovalReference: null, commercialLinksAllowed: false, publishedAt: null, updatedAt: null });
  expect(malaysiaGuide.brokerEntityMappings).toEqual([]);
  for (const id of malaysiaGuide.sourceIds) expect(countryRegistry.sources.some(source => source.id === id), id).toBe(true);
  expect(malaysiaGuide.sourceIds.filter(id => { const source = countryRegistry.sources.find(source => source.id === id); return source?.kind === "regulator" && checkedSource(source, asOf); })).toHaveLength(4);
});

test("the shared presentation keeps Malaysia's eligibility data separate from Sri Lankan offers and future/renamed dossiers", () => {
  const presentation = countryResearchPresentation(malaysiaGuide, asOf)!;
  expect(presentation.headers).toHaveLength(8);
  expect(presentation.rows).toHaveLength(5);
  expect(presentation.rows.some(row => row.signupUrl)).toBe(false);
  expect(presentation.rows.every(row => row.officialUrl)).toBe(true);
  expect(presentation.rows.map(row => row.slug)).toEqual(["ic-markets", "oanda", "xm", "fbs", "tickmill"]);
  expect(countryResearchPresentation(sriLankaGuide, asOf)!.headers).toHaveLength(8);
  expect(countryResearchPresentation(sriLankaGuide, asOf)!.rows.every(row => row.signupUrl)).toBe(true);
  expect(countryResearchPresentation(malaysiaGuide, "2026-11-12")).toBeNull();
  const copied = structuredClone(malaysiaGuide); copied.slug = "united-kingdom";
  expect(countryResearchPresentation(copied, asOf)).toBeNull();
  copied.suppliedResearch!.countrySlug = copied.slug;
  expect(countryResearchPresentation(copied, asOf)).toBeNull();
  expect(countryFeaturedImage(malaysiaGuide)).toBeNull();
  expect(countryFeaturedImage(copied)).toBeNull();
});

test("Malaysia server-renders the existing template with five useful tables, accurate scope, three FAQs and no unsupported sign-up offer", async ({ browser, request }) => {
  const context = await browser.newContext({javaScriptEnabled:false}); const page = await context.newPage();
  try {
    const response = await page.goto(path); expect(response!.status()).toBe(200);
    const html = await response!.text();
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)![1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<[^>]+>/g," ");
    const words = main.trim().split(/\s+/u).length; console.log(`Malaysia guide: ${words} words, including closed content.`);
    expect(words).toBeLessThanOrEqual(1700);
    await expect(page.locator('main')).toHaveClass(/cg-compact/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(malaysiaGuide.title);
    await expect(page.locator('.cg-answer-brokers a')).toHaveText(['IC Markets','OANDA','XM','FBS','Tickmill']);
    await expect(page.locator('.cg-answer')).toContainText('sophisticated investors');
    await expect(page.locator('.cg-research-table thead th')).toHaveCount(8);
    await expect(page.locator('.cg-research-table tbody tr')).toHaveCount(5);
    await expect(page.locator('main table')).toHaveCount(5);
    await expect(page.locator('.cg-faq details')).toHaveCount(3);
    await expect(page.locator('.cg-faq')).not.toContainText('four brokers');
    await expect(page.locator('#local-rules')).toContainText('REIT/ETF');
    await expect(page.locator('#local-rules')).toContainText('listed commodity derivatives');
    await expect(page.locator('#local-rules')).toContainText('not a statement that every currency exchange');
    await expect(page.locator('#local-rules')).toContainText('14 October 2024');
    await expect(page.locator('main')).not.toContainText('CFDs are limited to qualifying shares and equity indices');
    await expect(page.locator('main')).not.toContainText('Malaysia-specific domain');
    await expect(page.locator('.cg-signup-link')).toHaveCount(0);
    await expect(page.locator('#research-tickmill')).toContainText('$3/lot/side');
    await expect(page.locator('#research-fbs')).toContainText('0.7 pips');
    await expect(page.locator('#research-oanda')).toContainText('$0 commission');
    await expect(page.locator('main a[rel~=sponsored]')).toHaveCount(0);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, follow');
    await expect(page.locator('#methodology')).toContainText('No sign-up or affiliate links are active');
    for (const slug of ['xm','ic-markets']) expect((await request.get('/reviews/'+slug)).status()).toBe(200);
    for (const slug of ['oanda','fbs','tickmill']) await expect(page.locator('main a[href="/reviews/'+slug+'"]')).toHaveCount(0);
    await expect(page.locator('.cg-website-link')).toHaveCount(5);
    await expect(page.locator('main img')).toHaveCount(0);
    for (const anchor of await page.locator('main a[href^="#"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')!.slice(1)))) expect(await page.locator(`[id="${anchor}"]`).count(),anchor).toBe(1);
    const sitemap = await (await request.get('/sitemap.xml')).text(); expect(sitemap).not.toContain(path);
    const hub = await (await request.get('/forex-brokers')).text(); expect(hub).toContain(path);
    expect((await request.get('/forex-brokers/united-kingdom')).status()).toBe(200);
    expect((await request.get('/forex-brokers/netherlands')).status()).toBe(404);
  } finally {await context.close();}
});

test("the existing mobile cards, source disclosure and section navigation work for Malaysia without overflow", async ({ page }) => {
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(width)).toBe(true);
    await expect(page.locator('.cg-featured-image')).toHaveCount(0);
    expect(await page.locator('main').evaluate(node=>getComputedStyle(node).backgroundColor)).toBe('rgb(255, 255, 255)');
    expect(await page.locator('.cg-direct-answer').evaluate(node=>getComputedStyle(node).fontSize)).toBe('18px');
    const nonBlack=await page.locator('main h1,main h2,main p,main a,main span,main th,main td').evaluateAll(nodes=>nodes.filter(node=>getComputedStyle(node).color!=='rgb(0, 0, 0)').map(node=>node.textContent?.slice(0,30)));
    expect(nonBlack).toEqual([]);
    await page.locator('#candidate-research').screenshot({path:`test-results/malaysia-comparison-${width}.png`,style:'body>header,.cg-section-nav{visibility:hidden}'});
  }
  await page.getByRole('navigation',{name:'Guide sections',exact:true}).getByRole('link',{name:'Local rules',exact:true}).click();
  await expect(page).toHaveURL(/#legal-status$/);
  await page.locator('#local-rules a[href="#source-my-sc-cfd-current"]').first().click();
  await expect(page.locator('.cg-source-disclosure')).toHaveAttribute('open','');
  await expect(page.locator('#source-my-sc-cfd-current')).toContainText('Independently checked: 13 Nov 2026');
  const faq=page.locator('.cg-faq summary').first();await faq.focus();await page.keyboard.press('Enter');
  await expect(page.locator('.cg-faq details').first()).toHaveAttribute('open','');
  expect(errors).toEqual([]);
});
