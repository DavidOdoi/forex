import{test,expect}from'@playwright/test';
import{calculateFibonacci,fibonacciScenario,defaultFibonacciValues}from'../src/lib/calculators/fibonacci';
const base=()=>fibonacciScenario(defaultFibonacciValues);
test('brief:upward1.1000–1.1500 retracements and two-point extensions match all reference prices',()=>{
 const r=base();const map=new Map(r.retracements.map(row=>[row.ratio.toString(),row.price.toString()]));
 for(const[ratio,price]of[['23.6','1.1382'],['38.2','1.1309'],['50','1.125'],['61.8','1.1191'],['78.6','1.1107']])expect(map.get(ratio)).toBe(price);
 const ext=new Map(r.extensions.map(row=>[row.ratio.toString(),row.price.toString()]));expect(ext.get('127.2')).toBe('1.1636');expect(ext.get('161.8')).toBe('1.1809');
});
test('brief:downward direction reverses placements and preserves custom ratios',()=>{
 const r=fibonacciScenario({...defaultFibonacciValues,direction:'down',retracements:'38.2,61.8,76.4'});expect(r.retracements[0].price.toString()).toBe('1.1191');expect(r.retracements[1].price.toString()).toBe('1.1309');expect(r.retracements[2].price.toString()).toBe('1.1382');
});
test('reference distances, generic price units and internal precision remain explicit',()=>{
 const r=fibonacciScenario({...defaultFibonacciValues,current:'1.12'});expect(r.retracements.find(row=>row.ratio.eq(61.8))?.unitDistance?.toString()).toBe('-9');expect(r.nearestBelow?.toString()).toBe('1.1191');expect(r.nearestAbove?.toString()).toBe('1.125');
 const gold=fibonacciScenario({...defaultFibonacciValues,market:'price',low:'4000',high:'4100',unit:'1'});expect(gold.retracements.find(row=>row.ratio.eq(61.8))?.price.toString()).toBe('4038.2');
 expect(fibonacciScenario({...defaultFibonacciValues,precision:'2'}).retracements.map(row=>row.price.toString())).toEqual(base().retracements.map(row=>row.price.toString()));
});
test('brief:zero range, invalid ratios/precision/directions and missing units reject',()=>{
 for(const patch of[{high:'1.1'},{high:'1'},{precision:'11'},{direction:'sideways'},{retracements:'101'},{extensions:'99'},{retracements:''},{retracements:'NaN'},{market:'price',unit:'0'}])expect(()=>fibonacciScenario({...defaultFibonacciValues,...patch})).toThrow();
 expect(()=>calculateFibonacci({low:'1',high:'2',direction:'up',precision:3,retracements:'0,50,100',extensions:'161.8',unit:'.01',current:'0'})).toThrow();
});
