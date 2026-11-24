import {test,expect} from "@playwright/test";
import {convertLots} from "../src/lib/calculators/lot-converter";
import {converterScenarioInputs,defaultConverterScenario} from "../src/lib/calculators/trade-scenario";
const base=()=>converterScenarioInputs(defaultConverterScenario);
test("brief: 0.35 standard equals35000 units,3.5mini,35micro,350nano and USD3.50pip",()=>{
 const r=convertLots(base());expect(r.units.toString()).toBe('35000');expect(r.standard.toString()).toBe('0.35');expect(r.mini.toString()).toBe('3.5');expect(r.micro.toString()).toBe('35');expect(r.nano.toString()).toBe('350');expect(r.pip?.pipValue.toString()).toBe('3.5');
 for(const [inputUnit,volume]of [['standard','0.35'],['mini','3.5'],['micro','35'],['nano','350'],['units','35000'],['configured','0.35']]as const)expect(convertLots({...base(),inputUnit,volume}).units.toString()).toBe('35000');
});
test("configured platform lots never redefine conventional equivalents",()=>{
 const r=convertLots({...base(),instrument:{...base().instrument,contractSize:'10000'},inputUnit:'configured',volume:'2'});expect(r.units.toString()).toBe('20000');expect(r.lots.toString()).toBe('2');expect(r.standard.toString()).toBe('0.2');
});
test("invalid broker volumes stay exact while alternatives respect a minimum-anchored step and maximum",()=>{
 const r=convertLots({...base(),volume:'0.015',grid:{minimum:'0.01',step:'0.01'}});expect(r.units.toString()).toBe('1500');expect(r.grid?.compatible).toBe(false);expect(r.grid?.lower?.toString()).toBe('0.01');expect(r.grid?.upper?.toString()).toBe('0.02');
 const capped=convertLots({...base(),volume:'2.2',grid:{minimum:'0.1',step:'0.3',maximum:'2.05'}});expect(capped.grid?.lower?.toString()).toBe('1.9');expect(capped.grid?.upper).toBeNull();
 expect(convertLots({...base(),volume:'0.001',grid:{minimum:'0.01',step:'0.01'}}).grid?.lower).toBeNull();
 expect(convertLots({...base(),volume:'0.35',grid:{minimum:'0.01',step:'0.01'}}).grid?.compatible).toBe(true);
});
test("missing valuation cannot destroy a valid unit conversion or invent a pip value",()=>{
 const r=convertLots({...base(),account:'JPY'});expect(r.units.toString()).toBe('35000');expect(r.pip).toBeNull();expect(r.pipError).toContain('conversion');
 const noPip=convertLots({...base(),account:'JPY',pipEnabled:false});expect(noPip.pipError).toBeNull();expect(noPip.pip).toBeNull();
});
test("invalid specs, non-positive quantities, volume limits and bad grid settings reject",()=>{
 for(const patch of [{volume:'0'},{volume:'-1'},{volume:'NaN'},{volume:'1000000000000'},{grid:{minimum:'1',step:'0'}},{grid:{minimum:'1',step:'0.1',maximum:'0.5'}},{instrument:{...base().instrument,contractSize:'0'}},{inputUnit:'unknown'}])expect(()=>convertLots({...base(),...patch}as ReturnType<typeof base>)).toThrow();
});
