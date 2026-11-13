import { test, expect } from "@playwright/test";
import { siteOrigin } from "../src/lib/site";

const path = "/forex-brokers/sri-lanka";
test("country guide retains the site header and uniform 18px article typography", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/insights/common-mistakes-in-funded-trading-accounts");
  const articleFont = await page.locator(".insight-content p").first().evaluate(node => ({ family: getComputedStyle(node).fontFamily, size: getComputedStyle(node).fontSize, lineHeight: getComputedStyle(node).lineHeight }));
  const header = await page.locator("body>header").evaluate(node => ({ background: getComputedStyle(node).backgroundColor, height: node.getBoundingClientRect().height }));
  await page.goto(path);
  expect(await page.locator("body>header").evaluate(node => ({ background: getComputedStyle(node).backgroundColor, height: node.getBoundingClientRect().height }))).toEqual(header);
  for (const selector of [".cg-direct-answer", ".cg-reader-grid p", ".cg-checks .cg-evidence>p", "#methodology .cg-method-grid p", ".cg-decision-table td"]) {
    expect(await page.locator(selector).first().evaluate(node => ({ family: getComputedStyle(node).fontFamily, size: getComputedStyle(node).fontSize, lineHeight: getComputedStyle(node).lineHeight })),selector).toEqual(articleFont);
  }
});

test("the complete guide stays below 1700 words, including all collapsed FAQs and source records", async ({ request, page }) => {
  const response = await request.get(path);expect(response.status()).toBe(200);
  const html = await response.text();
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)![1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ");
  const words = main.trim().split(/\s+/u).filter(Boolean).length;
  console.log(`Sri Lanka guide: ${words} words, including closed content.`);
  expect(words).toBeLessThanOrEqual(1700);
  await page.goto(path);
  await expect(page.locator('.cg-faq details')).toHaveCount(3);
  const longest = await page.locator('.cg-article p').evaluateAll(nodes => Math.max(...nodes.map(n => (n.textContent??'').trim().split(/\s+/u).length)));
  expect(longest).toBeLessThanOrEqual(120);
  await expect(page.locator('.cg-answer h2')).toHaveText('Quick answer');
  await expect(page.locator('.cg-direct-answer')).toContainText('No Sri Lanka-specific broker recommendation');
  await expect(page.locator('h1')).toContainText('Forex Brokers in Sri Lanka');
  await expect(page).toHaveTitle(/Forex Brokers in Sri Lanka/);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',siteOrigin+path);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, follow');
});

test("research rows link to real global reviews while keeping country eligibility separate", async ({ browser, request }) => {
  const context = await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  try {
    await page.goto('http://127.0.0.1:3100'+path);
    const table=page.getByRole('region',{name:'Sri Lanka research candidate status',exact:true});
    await expect(table.locator('tbody tr')).toHaveCount(4);
    await expect(table.locator('thead th')).toHaveCount(3);
    for (const [slug,name] of [['exness','Exness'],['xm','XM'],['ic-markets','IC Markets'],['pepperstone','Pepperstone']]) {
      const row=page.locator('#research-'+slug);
      await expect(row).toContainText('Not established');
      await expect(row.getByRole('link',{name:'Read '+name+' review'})).toHaveAttribute('href','/reviews/'+slug);
      expect((await request.get('/reviews/'+slug)).status()).toBe(200);
    }
    await expect(page.locator('main')).toContainText('They do not confirm Sri Lanka resident eligibility');
    await expect(page.locator('.cg-decision-table')).toHaveCount(2);
    await expect(page.locator('main a[rel~="sponsored"]')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('USD 100,000');
    await expect(page.locator('#owner-evidence')).toHaveCount(0);
  } finally {await context.close();}
});

test("desktop section links land below the sticky header and reveal nested checks and sources", async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:1000});await page.goto(path);
  const nav=page.getByRole('navigation',{name:'Guide sections',exact:true});
  await expect(nav.getByRole('link',{name:'Compare brokers',exact:true})).toHaveAttribute('aria-current','location');
  await nav.getByRole('link',{name:'2026 rules',exact:true}).click();
  await expect(page).toHaveURL(/#investment-rules-2026$/);
  const header=await page.locator('body>header').boundingBox(),rail=await nav.boundingBox(),heading=await page.locator('#investment-rules-2026 h2').boundingBox();
  expect(Math.abs(rail!.y-(header!.y+header!.height))).toBeLessThan(3);
  expect(heading!.y).toBeGreaterThanOrEqual(rail!.y+rail!.height);
  const shortlist=page.getByRole('region',{name:'Brokers in this research'});
  await shortlist.getByRole('tab',{name:'Brokers',exact:true}).focus();await page.keyboard.press('ArrowRight');
  await expect(shortlist.getByRole('tab',{name:'Key checks',exact:true})).toHaveAttribute('aria-selected','true');
  await shortlist.getByRole('link',{name:'Are trading and funding lawful for this resident?'}).click();
  await expect(page.locator('.cg-check-disclosure')).toHaveAttribute('open','');
  await expect(page.locator('#country-check-4')).toBeVisible();
  await page.locator('#local-rules a[href="#source-cbsl-2019-notice"]').first().click();
  await expect(page.locator('.cg-source-disclosure')).toHaveAttribute('open','');
  await expect(page.locator('#source-cbsl-2019-notice h3')).toBeVisible();
  await page.locator('.cg-source-disclosure>summary').focus();await page.keyboard.press('Enter');
  await expect(page.locator('.cg-source-disclosure')).not.toHaveAttribute('open');
});

test("mobile comparison cards and keyboard navigation work without page overflow or browser errors", async ({ page }) => {
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(width)).toBe(true);
    await expect(page.locator('.cg-reader-grid>section')).toHaveCount(4);
    await expect(page.locator('.cg-research-table tbody tr')).toHaveCount(4);
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`test-results/country-reader-${width}.png`});
  }
  await page.setViewportSize({width:390,height:1000});
  expect(await page.locator('.cg-research-table tbody tr').first().evaluate(n=>getComputedStyle(n).display)).toBe('block');
  const nav=page.getByRole('navigation',{name:'Guide sections',exact:true}),rail=nav.locator('.cg-section-links');
  await nav.getByRole('button',{name:'Scroll section links right'}).click();
  await expect.poll(()=>rail.evaluate(n=>n.scrollLeft)).toBeGreaterThan(0);
  const faq=nav.getByRole('link',{name:'FAQs',exact:true});await faq.focus();await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#country-faq$/);
  await page.locator('.cg-faq summary').first().focus();await page.keyboard.press('Enter');
  await expect(page.locator('.cg-faq details').first()).toHaveAttribute('open','');
  expect(errors).toEqual([]);
});
