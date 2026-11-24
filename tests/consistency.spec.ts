import { test, expect } from "@playwright/test";
import { consistencyDefinition as d } from "../src/lib/calculators/consistency-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path="/calculators/prop-firm-consistency-calculator";
test("old consistency URL redirects and ratio, custom share and nonpositive totals stay explicit",async({page,request})=>{
  const response=await request.get('/prop-firm-consistency-calculator',{maxRedirects:0}); expect(response.status()).toBe(308); expect(response.headers().location).toBe(path);
  await page.goto('/prop-firm-consistency-calculator'); await expect(page).toHaveURL(new RegExp(path+'$')); await expect(page.locator('[data-result]')).toHaveText('62.5%');
  await page.getByLabel('Total eligible net profit',{exact:true}).fill('3750'); await expect(page.locator('#calculation-result')).toContainText('Entered share condition met');
  await page.getByLabel('Allowed consistency share',{exact:true}).selectOption('custom'); await page.getByLabel('Custom consistency limit (%)',{exact:true}).fill('20'); await expect(page.locator('#calculation-result')).toContainText('USD 7,500.00');
  await page.getByLabel('Total eligible net profit',{exact:true}).fill('0'); await expect(page.locator('[data-result]')).toHaveText('Unavailable'); await expect(page.locator('#calculation-result')).toContainText('Positive eligible net profit required');
});
test("daily CSV, payout reset/persistence, target modes and private links behave distinctly",async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as Window&{copied?:string}).copied=text;}}});});
  await page.goto(path); await page.getByLabel('Eligible profit inputs',{exact:true}).selectOption('history');
  await page.getByLabel('Read daily net-P&L CSV locally (optional)',{exact:true}).setInputFiles({name:'daily.csv',mimeType:'text/csv',buffer:Buffer.from('date,netPnl,account\n2025-12-01,2000,PRIVATE\n2026-01-01,500,PRIVATE\n2026-01-02,-100,PRIVATE\n2026-01-03,600,PRIVATE')});
  await expect(page.locator('[data-result]')).toHaveText('60%'); await expect(page.getByLabel('Daily results · date,netPnl',{exact:true})).not.toHaveValue(/PRIVATE/);
  await page.getByLabel('Best-day persistence',{exact:true}).selectOption('perpetual'); await expect(page.locator('[data-result]')).toHaveText('200%');
  await page.getByRole('button',{name:'Copy scenario link',exact:true}).click(); const url=await page.evaluate(()=>(window as Window&{copied?:string}).copied!); for(const name of ['history','total','best','previousBest'])expect(new URL(url).searchParams.has(name)).toBe(false); await page.goto(url); await expect(page.locator('[data-result]')).toHaveCount(0);
  await page.getByRole('button',{name:'Reset',exact:true}).click(); await expect(page.locator('[data-result]')).toHaveText('62.5%'); await page.getByLabel('Consistency formula',{exact:true}).selectOption('fixed-target'); await expect(page.locator('[data-result]')).toHaveText('50%'); await expect(page.locator('#calculation-result')).toContainText('No current-profit amount repairs'); await page.getByLabel('Consistency formula',{exact:true}).selectOption('adjusted-target'); await expect(page.locator('[data-result]')).toHaveText('40%'); await expect(page.locator('#calculation-result')).toContainText('Separate profit target reached');
});
test("consistency SEO and contextual links are crawlable, canonical and mobile friendly",async({page,browser,request})=>{
  expect(calculatorArticleWords(d)).toBeGreaterThanOrEqual(1600);expect(calculatorArticleWords(d)).toBeLessThanOrEqual(1800);expect(d.description.length).toBeGreaterThanOrEqual(150);expect(d.description.length).toBeLessThanOrEqual(160);
  await page.goto(path); for(const width of [320,390,1440]){await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
  for(const anchor of ['Topstep’s official consistency rules','FundedNext’s perpetual consistency rule'])await expect(page.getByRole('link',{name:anchor,exact:true})).toHaveAttribute('href',/^https:\/\//);
  const context=await browser.newContext({javaScriptEnabled:false});const p=await context.newPage();try{await p.goto('http://127.0.0.1:3100'+path);await expect(p.locator('h1')).toHaveCount(1);await expect(p.locator('[data-result]')).toHaveText('62.5%');await expect(p.locator('#calculator-faq details')).toHaveCount(3);await expect(p.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.devinforex.com'+path);const xml=await(await request.get('/sitemap.xml')).text();expect(xml).toContain('<loc>https://www.devinforex.com'+path+'</loc>');expect(xml).not.toContain('<loc>https://www.devinforex.com/prop-firm-consistency-calculator</loc>');}finally{await context.close();}
});
test("server-rendered inputs wait for hydration before accepting pasted history",async({page})=>{
  let release!:()=>void; const gate=new Promise<void>(resolve=>{release=resolve;});
  await page.route('**/_next/static/**/*.js',async route=>{await gate;await route.continue();});
  try {
    await page.goto('/calculators/forex-drawdown-calculator',{waitUntil:'commit'});
    const input=page.getByLabel('Ordered history · value or date,value,flow',{exact:true}); await expect(input).toBeDisabled(); await expect(page.locator('[data-result]')).toHaveText('25%');
    release(); await expect(input).toBeEnabled(); const text=Array.from({length:1000},()=> '10000.123456789012345').join('\n'); await input.fill(text); await expect(input).toHaveValue(text); await expect(page.locator('[data-result]')).toHaveText('0%');
  } finally { release(); }
});
