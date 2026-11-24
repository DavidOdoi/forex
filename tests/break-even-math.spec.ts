import { test, expect } from "@playwright/test";
import { calculateBreakEven, type BreakEvenInputs } from "../src/lib/calculators/break-even";
import { defaultBreakEvenScenario, breakEvenScenarioInputs, restoreTradeScenario, serializeTradeScenario } from "../src/lib/calculators/trade-scenario";
const base = (): BreakEvenInputs => breakEvenScenarioInputs(defaultBreakEvenScenario);
test("brief: one standard EUR/USD lot and USD7 commission needs bid1.10007 or ask1.09993", () => {
  const r=calculateBreakEven(base()); expect(r.theoretical.toString()).toBe("1.10007"); expect(r.rounded.toString()).toBe("1.10007"); expect(r.movement.toString()).toBe("0.7");
  expect(calculateBreakEven({ ...base(), direction:"sell" }).theoretical.toString()).toBe("1.09993");
});
test("brief: weighted entries use volume, not an unweighted average", () => {
  const r=calculateBreakEven({ ...base(), commission:"0", entries:[{ volume:"0.5",price:"1.1" },{ volume:"0.5",price:"1.102" }] }); expect(r.entry.toString()).toBe("1.101");
  const unequal=calculateBreakEven({ ...base(), commission:"0", entries:[{ volume:"0.2",price:"1.1" },{ volume:"0.8",price:"1.102" }] }); expect(unequal.entry.toString()).toBe("1.1016");
});
test("financing credits/charges, extra exits and directional grid rounding remain distinct", () => {
  expect(calculateBreakEven({ ...base(), swap:"-3" }).theoretical.toString()).toBe("1.1001");
  expect(calculateBreakEven({ ...base(), swap:"2" }).theoretical.toString()).toBe("1.10005");
  expect(calculateBreakEven({ ...base(), swap:"10" }).theoretical.toString()).toBe("1.09997");
  const r=calculateBreakEven({ ...base(), commission:"7.1" }); expect(r.theoretical.toString()).toBe("1.100071"); expect(r.rounded.toString()).toBe("1.10008"); expect(r.roundingNetQuote.gte(0)).toBe(true);
  const sell=calculateBreakEven({ ...base(), direction:"sell", commission:"7.1" }); expect(sell.rounded.toString()).toBe("1.09992"); expect(sell.roundingNetQuote.gte(0)).toBe(true);
});
test("executable fills ignore extra spread while symmetric midpoint mode labels both prices", () => {
  expect(calculateBreakEven({ ...base(), spreadPips:"1" }).theoretical.toString()).toBe("1.10007");
  const r=calculateBreakEven({ ...base(), priceMode:"mid",spreadPips:"1" }); expect(r.executableEntry.toString()).toBe("1.10005"); expect(r.theoretical.toString()).toBe("1.10012"); expect(r.midpoint?.toString()).toBe("1.10017");
});
test("account-currency costs use matching proceeds conversion and baskets survive serialization", () => {
  const r=calculateBreakEven({ ...base(), account:"GBP", commission:"8", rates:[{ base:"USD",quote:"GBP",bid:"0.8",ask:"0.82",source:"manual",asOf:null }] }); expect(r.quoteCosts.toString()).toBe("10"); expect(r.theoretical.toString()).toBe("1.1001");
  const values={ ...defaultBreakEvenScenario,entriesEnabled:"yes",entries:Array.from({ length:10 },(_,i)=>`0.1,1.10${i}`).join("\n") }; const restored=restoreTradeScenario('?'+serializeTradeScenario(values),defaultBreakEvenScenario); expect(restored.values.entries).toBe(values.entries); expect(breakEvenScenarioInputs(restored.values).entries).toHaveLength(10);
});
test("zero/invalid volume, prices, negative costs, missing conversion and bad baskets reject", () => {
  for(const patch of [{ entries:[] },{ entries:[{ volume:"0",price:"1.1" }] },{ entries:[{ volume:"1",price:"0" }] },{ commission:"-1" },{ exitCosts:"-1" },{ account:"GBP" },{ entries:Array(21).fill({ volume:"1",price:"1.1" }) }]) expect(()=>calculateBreakEven({ ...base(),...patch } as BreakEvenInputs)).toThrow();
  expect(()=>breakEvenScenarioInputs({ ...defaultBreakEvenScenario,entriesEnabled:"yes",entries:"1,1.1,extra" })).toThrow();
});
