import {test,expect} from "@playwright/test";
import {swapDefinition} from "../src/lib/calculators/swap-content";
import {calculatorArticleWords} from "../src/lib/calculators/editorial";
const path="/calculators/forex-swap-calculator";
test("swap point/pip units, direction reset and calendar overrides recalculate",async({page})=>{
 await page.goto(path);await expect(page.locator('[data-result]')).toHaveText('USD -24.00');
 await page.getByLabel('Broker swap-rate unit',{exact:true}).selectOption('pips');await page.getByLabel('Signed broker swap rate',{exact:true}).fill('-0.6');await expect(page.locator('[data-result]')).toHaveText('USD -24.00');
 await page.getByLabel('Trade direction',{exact:true}).selectOption('sell');await expect(page.getByLabel('Signed broker swap rate',{exact:true})).toHaveValue('');await expect(page.locator('[data-result]')).toHaveCount(0);
 await page.getByLabel('Signed broker swap rate',{exact:true}).fill('0.6');await expect(page.locator('[data-result]')).toHaveText('USD 24.00');
 await page.getByLabel('Holding-period input',{exact:true}).selectOption('dates');await page.getByLabel('Position opens · local time',{exact:true}).fill('2026-11-24T16:00');await expect(page.locator('[data-result]')).toHaveText('USD 24.00');
 await page.getByLabel('Dated multiplier overrides · optional',{exact:true}).fill('2026-11-24,0');await expect(page.locator('[data-result]')).toHaveText('USD 18.00');
});
test("swap SSR, article count, metadata and three FAQs remain truthful",async({browser,request})=>{
 expect(calculatorArticleWords(swapDefinition)).toBeGreaterThanOrEqual(1600);expect(calculatorArticleWords(swapDefinition)).toBeLessThanOrEqual(1800);
 const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();try{await page.goto('http://127.0.0.1:3100'+path);await expect(page.locator('[data-result]')).toHaveText('USD -24.00');await expect(page.locator('#calculator-faq details')).toHaveCount(3);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.devinforex.com'+path);expect(await(await request.get('/sitemap.xml')).text()).toContain(path);}finally{await ctx.close();}
});
test("calendar scenarios share and fit mobile layouts",async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as Window&{copied?:string}).copied=text;}}});});
 await page.goto(path);await page.getByLabel('Holding-period input',{exact:true}).selectOption('dates');await page.getByLabel('Dated multiplier overrides · optional',{exact:true}).fill('2026-11-24,0\n2026-11-25,0');await page.getByRole('button',{name:'Copy scenario link',exact:true}).click();await page.goto(await page.evaluate(()=>(window as Window&{copied?:string}).copied!));await expect(page.locator('[data-result]')).toHaveText('USD -6.00');
 for(const width of [320,390,1440]){await page.setViewportSize({width,height:1000});await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-trade-workbench]').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/swap-${width}.png`});}
});
