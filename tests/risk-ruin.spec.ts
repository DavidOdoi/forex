import{test,expect}from'@playwright/test';
import{ruinDefinition}from'../src/lib/calculators/ruin-content';
import{calculatorArticleWords}from'../src/lib/calculators/editorial';
const path='/calculators/forex-risk-of-ruin-calculator';
test('simulation worker shows reproducible results and zero-hit caution while controls remain responsive',async({page})=>{
 await page.goto(path);await expect(page.locator('[data-result]')).toBeVisible({timeout:20000});const first=await page.locator('[data-result]').textContent();
 await expect(page.getByRole('img',{name:'Twelve example simulated equity paths, stopped at the threshold or trade horizon'})).toBeVisible();
 await page.getByLabel('Assumed win probability (%)',{exact:true}).fill('100');await expect(page.locator('[data-result]')).toHaveText('0%');await expect(page.locator('#calculation-result')).toContainText('not proof of zero true risk');
 await page.getByLabel('Assumed win probability (%)',{exact:true}).fill('45');await expect(page.locator('[data-result]')).toHaveText(first!);
 await page.getByLabel('Assumed win probability (%)',{exact:true}).fill('101');await expect(page.locator('[data-result]')).toHaveCount(0);await expect(page.locator('#calculation-result')).toContainText('probability');
});
test('risk simulation share links restore the seed and reject unknown versions',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as Window&{copied?:string}).copied=text;}}});});
 await page.goto(path);await page.getByLabel('Simulation seed',{exact:true}).fill('12345');await expect(page.locator('[data-result]')).toBeVisible();await page.getByRole('button',{name:'Copy scenario link',exact:true}).click();
 await page.goto(await page.evaluate(()=>(window as Window&{copied?:string}).copied!));await expect(page.getByLabel('Simulation seed',{exact:true})).toHaveValue('12345');await expect(page.locator('[data-result]')).toBeVisible();
 await page.goto(path+'?v=99');await expect(page.locator('#calculation-result')).toContainText('unsupported');await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.locator('[data-result]')).toBeVisible();
});
test('risk copy is server rendered with three FAQs and canonical/sitemap support',async({browser,request})=>{
 expect(calculatorArticleWords(ruinDefinition)).toBeGreaterThanOrEqual(1600);expect(calculatorArticleWords(ruinDefinition)).toBeLessThanOrEqual(1800);
 const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();try{await page.goto('http://127.0.0.1:3100'+path);await expect(page.locator('h1')).toHaveText(ruinDefinition.heading);await expect(page.locator('#calculator-faq details')).toHaveCount(3);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.devinforex.com'+path);expect(await(await request.get('/sitemap.xml')).text()).toContain(path);await expect(page.locator('main noscript')).toBeVisible();}finally{await ctx.close();}
});
test('risk simulation and chart fit mobile and desktop',async({page})=>{
 for(const width of[320,390,1440]){await page.setViewportSize({width,height:1000});await page.goto(path);await expect(page.locator('[data-result]')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-risk-ruin]').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/risk-ruin-${width}.png`});}
});
