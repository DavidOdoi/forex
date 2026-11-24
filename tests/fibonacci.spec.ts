import{test,expect}from'@playwright/test';import{fibonacciDefinition}from'../src/lib/calculators/fibonacci-content';import{calculatorArticleWords}from'../src/lib/calculators/editorial';
const path='/calculators/fibonacci-calculator';
test('Fibonacci direction, reference distances, generic gold and validation work',async({page})=>{
 await page.goto(path);await expect(page.locator('[data-result]')).toHaveText('1.11910');await page.getByLabel('Original swing direction',{exact:true}).selectOption('down');await expect(page.locator('[data-result]')).toHaveText('1.13090');
 await page.getByLabel('Reference price · optional',{exact:true}).fill('1.12');await expect(page.locator('#calculation-result')).toContainText('Signed distance · pips');
 await page.getByLabel('Distance convention',{exact:true}).selectOption('price');await page.getByLabel('Swing high',{exact:true}).fill('4100');await page.getByLabel('Swing low',{exact:true}).fill('4000');await page.getByLabel('Original swing direction',{exact:true}).selectOption('up');await expect(page.locator('[data-result]')).toHaveText('4,038.20000');
 await page.getByLabel('Swing high',{exact:true}).fill('4000');await expect(page.locator('[data-result]')).toHaveCount(0);
});
test('Fibonacci sharing and mobile level bars remain usable',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as Window&{copied?:string}).copied=text;}}});});await page.goto(path);await page.getByLabel('Original swing direction',{exact:true}).selectOption('down');await page.getByRole('button',{name:'Copy scenario link',exact:true}).click();await page.goto(await page.evaluate(()=>(window as Window&{copied?:string}).copied!));await expect(page.locator('[data-result]')).toHaveText('1.13090');
 for(const width of[320,390,1440]){await page.setViewportSize({width,height:1000});await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-analysis-workbench]').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/fibonacci-${width}.png`});}
});
test('Fibonacci SSR copy, canonical and three FAQs match schema',async({browser,request})=>{
 expect(calculatorArticleWords(fibonacciDefinition)).toBeGreaterThanOrEqual(1600);expect(calculatorArticleWords(fibonacciDefinition)).toBeLessThanOrEqual(1800);const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();try{await page.goto('http://127.0.0.1:3100'+path);await expect(page.locator('[data-result]')).toHaveText('1.11910');await expect(page.locator('#calculator-faq details')).toHaveCount(3);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.devinforex.com'+path);expect(await(await request.get('/sitemap.xml')).text()).toContain(path);}finally{await ctx.close();}
});
