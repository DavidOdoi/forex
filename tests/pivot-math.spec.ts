import{test,expect}from'@playwright/test';
import{calculatePivots,pivotScenario,defaultPivotValues}from'../src/lib/calculators/pivot';
const base=()=>pivotScenario(defaultPivotValues);
test('brief:Traditional/Floor P,R1–R3,S1–S3 match the documented convention',()=>{
 const r=base();const levels=new Map(r.levels.map(row=>[row.label,row.price.toString()]));for(const[label,value]of[['P','1.115'],['R1','1.12'],['S1','1.11'],['R2','1.125'],['S2','1.105'],['R3','1.13'],['S3','1.1']])expect(levels.get(label)).toBe(value);
});
test('brief:Fibonacci ratios and four Camarilla levels are distinct and exact',()=>{
 const fib=pivotScenario({...defaultPivotValues,method:'fibonacci'});const levels=new Map(fib.levels.map(row=>[row.label,row.price.toString()]));for(const[label,value]of[['R1','1.11882'],['S1','1.11118'],['R2','1.12118'],['S2','1.10882']])expect(levels.get(label)).toBe(value);
 const cam=pivotScenario({...defaultPivotValues,method:'camarilla'});expect(cam.levels).toHaveLength(9);expect(cam.levels.find(row=>row.label==='R4')?.price.toString()).toBe('1.1205');expect(cam.levels.find(row=>row.label==='S4')?.price.toString()).toBe('1.1095');expect(cam.levels.find(row=>row.label==='R1')?.price.toDecimalPlaces(8).toString()).toBe('1.11591667');
});
test('brief:Woodie variants require different inputs and cannot be silently interchanged',()=>{
 expect(pivotScenario({...defaultPivotValues,method:'woodie-close'}).p.toString()).toBe('1.115');
 expect(()=>pivotScenario({...defaultPivotValues,method:'woodie-open'})).toThrow();
 expect(pivotScenario({...defaultPivotValues,method:'woodie-open',currentOpen:'1.119'}).p.toString()).toBe('1.117');
 expect(pivotScenario({...defaultPivotValues,method:'woodie-open',currentOpen:'1.2'}).p.toString()).toBe('1.1575');
});
test('brief:DeMark reference and all previous-close/open branches produce only defined levels',()=>{
 const common={...defaultPivotValues,method:'demark',high:'1.12',low:'1.1',close:'1.115',previousOpen:'1.11'};const r=pivotScenario(common);expect(r.x?.toString()).toBe('4.455');expect(r.p.toString()).toBe('1.11375');expect(r.levels.find(row=>row.label==='R1')?.price.toString()).toBe('1.1275');expect(r.levels.find(row=>row.label==='S1')?.price.toString()).toBe('1.1075');expect(r.levels).toHaveLength(3);
 expect(pivotScenario({...common,close:'1.105'}).x?.toString()).toBe('4.425');expect(pivotScenario({...common,close:'1.11'}).x?.toString()).toBe('4.44');
});
test('reference distances, absent opens, flat periods and display rounding are explicit',()=>{
 const r=pivotScenario({...defaultPivotValues,current:'1.114'});expect(r.levels.find(row=>row.label==='P')?.distance?.toString()).toBe('10');expect(r.comparisons.find(row=>row.method==='demark')?.value).toBeNull();
 expect(pivotScenario({...defaultPivotValues,precision:'2'}).p.toString()).toBe(base().p.toString());expect(pivotScenario({...defaultPivotValues,high:'1.1',low:'1.1',close:'1.1'}).range.toString()).toBe('0');
});
test('brief:inconsistent completed OHLC, undefined methods and invalid precision reject',()=>{
 for(const patch of[{high:'1.1'},{close:'1.13'},{previousOpen:'1.2'},{method:'demark'},{method:'unknown'},{precision:'11'},{zone:'invalid/zone'}])expect(()=>pivotScenario({...defaultPivotValues,...patch})).toThrow();
 expect(()=>calculatePivots({method:'traditional',high:'1',low:'0',close:'.5',unit:'.0001',precision:5})).toThrow();
});
