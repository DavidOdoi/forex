import{test,expect}from'@playwright/test';
import{kellyDefinition}from'../src/lib/calculators/kelly-content';import{calculatorArticleWords}from'../src/lib/calculators/editorial';
const path='/calculators/kelly-criterion-calculator';
test('Kelly shows raw/half/quarter fractions, no-bet states and a major100% caution',async({page})=>{
 await page.goto(path);await expect(page.locator('[data-result]')).toHaveText('17.5%');await expect(page.locator('#calculation-result')).toContainText('8.75%');await expect(page.locator('#calculation-result')).toContainText('4.375%');
 await page.getByLabel('Assumed win probability (%)',{exact:true}).fill('40');await page.getByLabel('Average net winner / net loss magnitude',{exact:true}).fill('1');await expect(page.locator('[data-result]')).toHaveText('-20%');await expect(page.locator('#calculation-result')).toContainText('not a forex sell signal');
 await page.getByLabel('Assumed win probability (%)',{exact:true}).fill('100');await expect(page.locator('[data-result]')).toHaveText('100%');await expect(page.locator('#calculation-result')).toContainText('Major caution');
 await page.getByLabel('Average net winner / net loss magnitude',{exact:true}).fill('0');await expect(page.locator('[data-result]')).toHaveCount(0);
});
test('historical counts/amounts, shared state and mobile charts work',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as Window&{copied?:string}).copied=text;}}});});
 await page.goto(path);await page.getByLabel('Win-probability input',{exact:true}).selectOption('counts');await page.getByLabel('Payoff input',{exact:true}).selectOption('averages');await expect(page.locator('#calculation-result')).toContainText('USD 35.00');await page.getByRole('button',{name:'Copy scenario link',exact:true}).click();await page.goto(await page.evaluate(()=>(window as Window&{copied?:string}).copied!));await expect(page.getByLabel('Win-probability input',{exact:true})).toHaveValue('counts');
 for(const width of[320,390,1440]){await page.setViewportSize({width,height:1000});await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-analysis-workbench]').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/kelly-${width}.png`});}
});
test('Kelly content, default example, schema and metadata render without JS',async({browser,request})=>{
 expect(calculatorArticleWords(kellyDefinition)).toBeGreaterThanOrEqual(1600);expect(calculatorArticleWords(kellyDefinition)).toBeLessThanOrEqual(1800);const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();try{await page.goto('http://127.0.0.1:3100'+path);await expect(page.locator('[data-result]')).toHaveText('17.5%');await expect(page.locator('#calculator-faq details')).toHaveCount(3);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.devinforex.com'+path);expect(await(await request.get('/sitemap.xml')).text()).toContain(path);}finally{await ctx.close();}
});
