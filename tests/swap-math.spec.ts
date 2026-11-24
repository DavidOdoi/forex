import { test,expect } from "@playwright/test";
import { calculateSwap,rolloverEvents } from "../src/lib/calculators/swap";
import { defaultSwapScenario,swapScenarioInputs } from "../src/lib/calculators/trade-scenario";
const base=()=>swapScenarioInputs(defaultSwapScenario);
test("brief: minus6 points at0.00001 produces minus6 ordinary and minus24 for normal plus triple",()=>{
 const r=calculateSwap(base());expect(r.ordinary.toString()).toBe("-6");expect(r.total.toString()).toBe("-24");expect(r.financingDays.toString()).toBe("4");expect(r.pipEquivalent?.toString()).toBe("-2.4");
 expect(calculateSwap({...base(),triple:"0"}).total.toString()).toBe("-6");expect(calculateSwap({...base(),volume:"0.5"}).total.toString()).toBe("-12");
});
test("pips, money and documented annual conventions remain distinct",()=>{
 expect(calculateSwap({...base(),unit:"pips",rate:"-0.6"}).total.toString()).toBe("-24");expect(calculateSwap({...base(),unit:"money",rate:"5"}).total.toString()).toBe("20");
 const r=calculateSwap({...base(),unit:"annual",rate:"-3.65",price:"1",dayBasis:"365",normal:"1",triple:"0"});expect(r.ordinary.toString()).toBe("-10");
 expect(calculateSwap({...base(),unit:"annual",rate:"-3.6",price:"1",dayBasis:"360",normal:"1",triple:"0"}).total.toString()).toBe("-10");
});
test("calendar honors actual cutoffs, configurable triple day and dated overrides",()=>{
 const input={...base(),mode:"dates" as const,open:"2026-11-24T16:00",close:"2026-11-25T18:00"};
 expect(calculateSwap(input).total.toString()).toBe("-24");expect(calculateSwap({...input,open:"2026-11-24T17:00"}).total.toString()).toBe("-18");
 expect(calculateSwap({...input,tripleDay:"4"}).total.toString()).toBe("-12");expect(calculateSwap({...input,overrides:"2026-11-24,0"}).total.toString()).toBe("-18");
 expect(calculateSwap({...input,overrides:"2026-11-24,0\n2026-11-25,0"}).total.toString()).toBe("0");
});
test("timezone DST offsets change safely and ambiguous local dates reject",()=>{
 const events=rolloverEvents({...base(),open:"2026-10-30T16:00",close:"2026-11-02T18:00"});expect(events[0].utc).toBe("2026-10-30T21:00:00Z");expect(events.at(-1)?.utc).toBe("2026-11-02T22:00:00Z");
 expect(()=>rolloverEvents({...base(),open:"2026-11-01T01:30",close:"2026-11-02T18:00"})).toThrow();expect(()=>rolloverEvents({...base(),open:"2026-03-08T02:30",close:"2026-03-09T18:00"})).toThrow();
});
test("charging-currency conversions distinguish credits from liabilities",()=>{
 const rates=[{base:"USD" as const,quote:"GBP" as const,bid:"0.8",ask:"0.82",source:"manual" as const,asOf:null}];
 expect(calculateSwap({...base(),account:"GBP",rates}).total.toString()).toBe("-19.68");expect(calculateSwap({...base(),account:"GBP",rates,rate:"6"}).total.toString()).toBe("19.2");
 const r=calculateSwap({...base(),account:"GBP",unit:"money",moneyCurrency:"account"});expect(r.total.toString()).toBe("-24");expect(r.pipEquivalent).toBeNull();
});
test("invalid rates, fractional counts, date schedules and unbounded ranges reject",()=>{
 for(const patch of [{rate:"NaN"},{normal:"0.5"},{triple:"-1"},{pointSize:"0"},{unit:"annual",dayBasis:"366"},{volume:"0"}])expect(()=>calculateSwap({...base(),...patch} as ReturnType<typeof base>)).toThrow();
 for(const patch of [{zone:"bad/zone"},{open:"2026-11-25T19:00"},{close:"2028-01-01T18:00"},{overrides:"2026-11-25,3\n2026-11-25,1"},{overrides:"2026-02-30,0"}])expect(()=>rolloverEvents({...base(),...patch})).toThrow();
});
