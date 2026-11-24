import { test,expect } from "@playwright/test";
import { breakEvenDefinition } from "../src/lib/calculators/break-even-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path="/calculators/forex-break-even-calculator";
test("break-even supports a precise default, sell exits, financing and weighted baskets",async({page})=>{
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("1.10007");
  await page.getByLabel("Trade direction",{exact:true}).selectOption("sell"); await expect(page.locator("[data-result]")).toHaveText("1.09993");
  await page.getByLabel("Trade direction",{exact:true}).selectOption("buy"); await page.getByLabel("Signed accrued swap",{exact:true}).fill("-3"); await expect(page.locator("[data-result]")).toHaveText("1.10010");
  await page.getByLabel("Use a weighted entry basket",{exact:true}).check(); await page.getByLabel("Combined commission",{exact:true}).fill("0"); await page.getByLabel("Signed accrued swap",{exact:true}).fill("0"); await expect(page.locator("[data-result]")).toHaveText("1.10100");
  await page.getByLabel("Entry rows: volume,price",{exact:true}).fill("0.2,1.1\n0.8,1.102"); await expect(page.locator("[data-result]")).toHaveText("1.10160");
  await page.getByLabel("Combined commission",{exact:true}).fill("-1"); await expect(page.locator("[data-result]")).toHaveCount(0);
});
test("break-even has server-rendered explanatory copy, three FAQs and a canonical",async({browser,request})=>{
  expect(calculatorArticleWords(breakEvenDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(breakEvenDefinition)).toBeLessThanOrEqual(1800);
  const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();try{await page.goto('http://127.0.0.1:3100'+path);await expect(page.locator("[data-result]")).toHaveText("1.10007");await expect(page.locator("#calculator-faq details")).toHaveCount(3);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href",'https://www.devinforex.com'+path);expect(await(await request.get('/sitemap.xml')).text()).toContain(path);}finally{await ctx.close();}
});
test("midpoint convention, shared basket and mobile controls remain explicit",async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(navigator,"clipboard",{value:{writeText:async(text:string)=>{(window as Window&{copied?:string}).copied=text;}}});});
  await page.goto(path); await page.getByLabel("Entry price convention",{exact:true}).selectOption("mid"); await page.getByLabel("Modeled spread (pips)",{exact:true}).fill("1"); await expect(page.locator("[data-result]")).toHaveText("1.10012");await expect(page.locator("#calculation-result")).toContainText("1.10017");
  await page.getByLabel("Use a weighted entry basket",{exact:true}).check();await page.getByRole("button",{name:"Copy scenario link",exact:true}).click(); await page.goto(await page.evaluate(()=>(window as Window&{copied?:string}).copied!));await expect(page.getByLabel("Use a weighted entry basket",{exact:true})).toBeChecked();
  await page.getByLabel("Entry rows: volume,price",{exact:true}).fill("0.2,1.1\n0.3,1.102");
  await page.getByRole("link",{name:"Check this volume’s pip value",exact:false}).click(); await expect(page.locator("[data-result]")).toHaveText("USD 5.00");
  for(const width of [320,390,1440]){await page.setViewportSize({width,height:1000});await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-trade-workbench]').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/break-even-${width}.png`});}
});
