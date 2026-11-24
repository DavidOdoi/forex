import {test,expect} from '@playwright/test';
import {converterDefinition} from '../src/lib/calculators/converter-content';
import {calculatorArticleWords} from '../src/lib/calculators/editorial';
const path='/calculators/forex-lot-size-converter';
test('converter preserves exact quantities, supports custom contracts and reports order limits',async({page})=>{
 await page.goto(path);await expect(page.locator('[data-result]')).toHaveText('35,000 EUR');await expect(page.locator('#calculation-result')).toContainText('USD 3.50');
 await page.getByLabel('Input volume convention',{exact:true}).selectOption('micro');await page.getByLabel('Quantity to convert',{exact:true}).fill('35');await expect(page.locator('[data-result]')).toHaveText('35,000 EUR');
 await page.getByLabel('Input volume convention',{exact:true}).selectOption('configured');await page.getByLabel('Quantity to convert',{exact:true}).fill('2');await page.getByText('Contract and pip assumptions',{exact:true}).click();await page.getByLabel('Base units per configured lot',{exact:true}).fill('10000');await expect(page.locator('[data-result]')).toHaveText('20,000 EUR');
 await page.getByLabel('Base units per configured lot',{exact:true}).fill('100000');await page.getByLabel('Quantity to convert',{exact:true}).fill('0.015');await page.getByLabel('Check entered broker volume limits',{exact:true}).check();await expect(page.locator('[data-result]')).toHaveText('1,500 EUR');await expect(page.locator('#calculation-result')).toContainText('Incompatible with entered limits');
});
test('missing pip conversions preserve volume, while valid unit context passes to other tools',async({page})=>{
 await page.goto(path);await page.getByLabel('Account currency',{exact:true}).selectOption('JPY');await expect(page.locator('[data-result]')).toHaveText('35,000 EUR');await expect(page.locator('#calculation-result')).toContainText('Pip value is unavailable');
 await page.getByLabel('Account currency',{exact:true}).selectOption('USD');await page.getByRole('link',{name:'Check this volume’s pip value',exact:false}).click();await expect(page.locator('[data-result]')).toHaveText('USD 3.50');
});
test('converter SSR, word count and metadata are complete',async({browser,request})=>{
 expect(calculatorArticleWords(converterDefinition)).toBeGreaterThanOrEqual(1600);expect(calculatorArticleWords(converterDefinition)).toBeLessThanOrEqual(1800);
 const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();try{await page.goto('http://127.0.0.1:3100'+path);await expect(page.locator('[data-result]')).toHaveText('35,000 EUR');await expect(page.locator('#calculator-faq details')).toHaveCount(3);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.devinforex.com'+path);expect(await(await request.get('/sitemap.xml')).text()).toContain(path);}finally{await ctx.close();}
});
test('converter scenario links and internal table scrolling fit phones',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as Window&{copied?:string}).copied=text;}}});});
 await page.goto(path);await page.getByLabel('Input volume convention',{exact:true}).selectOption('mini');await page.getByLabel('Quantity to convert',{exact:true}).fill('3.5');await page.getByRole('button',{name:'Copy scenario link',exact:true}).click();await page.goto(await page.evaluate(()=>(window as Window&{copied?:string}).copied!));await expect(page.locator('[data-result]')).toHaveText('35,000 EUR');
 for(const width of[320,390,1440]){await page.setViewportSize({width,height:1000});await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-trade-workbench]').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/lot-converter-${width}.png`});}
});
