import{test,expect}from'@playwright/test';
import{calculateKelly,expectedLogGrowth,kellyScenario,defaultKellyValues}from'../src/lib/calculators/kelly';
test('brief:45% and2 payoff gives17.5%,8.75%,4.375% with distinct fractional results',()=>{
 const r=calculateKelly({probability:'45',payoff:'2',multiplier:'.5'});expect(r.raw.toString()).toBe('0.175');expect(r.rows[1].fraction.toString()).toBe('0.0875');expect(r.rows[2].fraction.toString()).toBe('0.04375');
});
test('brief:zero/negative edges and probability sensitivity preserve raw and nonnegative fractions',()=>{
 for(const[p,b,expected]of[['50','1','0'],['40','1','-0.2'],['40','2','0.1'],['35','2','0.025']]){const r=calculateKelly({probability:p,payoff:b,multiplier:'.5'});expect(r.raw.toString()).toBe(expected);if(r.raw.lte(0))expect(r.nonnegative.toString()).toBe('0');}
});
test('brief:100% wins is a theoretical boundary, while loss-possible full stakes have no finite log growth',()=>{
 const r=calculateKelly({probability:'100',payoff:'2',multiplier:'1'});expect(r.raw.toString()).toBe('1');expect(r.rows[0].logGrowth).toBeCloseTo(Math.log(3),14);expect(expectedLogGrowth(.45,2,1)).toBeNull();expect(expectedLogGrowth(0,2,0)).toBe(0);
});
test('expected logarithmic growth agrees with an independent high-precision reference and peaks at full Kelly',()=>{
 const r=calculateKelly({probability:'45',payoff:'2',multiplier:'.5'});expect(r.rows[0].logGrowth).toBeCloseTo(0.029242525646551299,13);
 expect(expectedLogGrowth(.45,2,.175)!).toBeGreaterThan(expectedLogGrowth(.45,2,.15)!);expect(expectedLogGrowth(.45,2,.175)!).toBeGreaterThan(expectedLogGrowth(.45,2,.2)!);
});
test('trade-count and average-amount modes show sample context and monetary expectancy',()=>{
 const r=kellyScenario({...defaultKellyValues,probabilityMode:'counts',payoffMode:'averages',capital:'10000'});expect(r.raw.toString()).toBe('0.175');expect(r.monetaryExpectancy?.toString()).toBe('35');expect(r.sample).toContain('45 wins / 100');expect(r.rows[0].amount?.toString()).toBe('1750');
});
test('brief:bad probabilities, payoff ratios, multipliers, capital and inconsistent counts reject',()=>{
 for(const patch of[{probability:'-1'},{probability:'101'},{payoff:'0'},{payoff:'-1'},{multiplier:'2'},{capital:'0'}])expect(()=>calculateKelly({probability:'45',payoff:'2',multiplier:'.5',...patch})).toThrow();
 expect(()=>kellyScenario({...defaultKellyValues,probabilityMode:'counts',wins:'101'})).toThrow();expect(()=>kellyScenario({...defaultKellyValues,payoffMode:'averages',averageLoss:'0'})).toThrow();
});
