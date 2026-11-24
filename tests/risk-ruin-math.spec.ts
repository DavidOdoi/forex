import {test,expect} from '@playwright/test';
import {defaultRuinValues,parseRuin,nextEquity,drawdown,simulateRuin,wilsonInterval} from '../src/lib/calculators/risk-ruin';
const base=()=>parseRuin({...defaultRuinValues,paths:'1000',trades:'100'});
test('brief: ten2% and5% losses preserve percentage-of-current-equity compounding',()=>{
 for(const [risk,expected]of[[2,8170.72806887547],[5,5987.369392383787]]){let equity=10000;for(let i=0;i<10;i++)equity=nextEquity(equity,false,{...base(),risk});expect(equity).toBeCloseTo(expected,8);}
 expect(drawdown(12000,9000)).toBe(.25);
});
test('brief: initial threshold7000, deterministic endpoints and positive-payoff100% wins',()=>{
 const r=simulateRuin({...base(),probability:0,risk:5,threshold:.3});expect(r.initialBarrier).toBe(7000);expect(r.hits).toBe(r.paths);expect(r.percentiles.median).toBeLessThanOrEqual(7000);
 const wins=simulateRuin({...base(),probability:1});expect(wins.hits).toBe(0);expect(wins.frequency).toBe(0);expect(wins.interval.high).toBeGreaterThan(0);
});
test('brief: same seed and settings reproduce every output, changed seeds alter sampled paths',()=>{
 expect(simulateRuin(base())).toEqual(simulateRuin(base()));expect(simulateRuin({...base(),seed:1}).samples).not.toEqual(simulateRuin(base()).samples);
});
test('peak and initial thresholds differ; fixed losses cap at remaining equity and costs apply once',()=>{
 const r=simulateRuin({...base(),thresholdMode:'peak'});expect(r.input.thresholdMode).toBe('peak');expect(r.worstDrawdown).toBeGreaterThanOrEqual(0);
 expect(nextEquity(50,false,{...base(),risk:100,mode:'fixed',cost:0})).toBe(0);expect(nextEquity(10000,true,{...base(),risk:100,mode:'fixed',cost:7})).toBe(10193);
 expect(wilsonInterval(200,10000).low).toBeLessThan(.02);expect(wilsonInterval(200,10000).high).toBeGreaterThan(.02);
});
test('brief: invalid numbers, thresholds, horizon, counts, seeds and workload bounds reject',()=>{
 for(const patch of[{risk:'-1'},{probability:'101'},{capital:'0'},{capital:'1e-999'},{threshold:'0'},{threshold:'101'},{paths:'0'},{paths:'100.5'},{trades:'0'},{seed:'-1'},{paths:'50000',trades:'2000'},{payoff:'0'},{cost:'-1'}])expect(()=>parseRuin({...defaultRuinValues,...patch})).toThrow();
 expect(()=>simulateRuin({...base(),probability:1,risk:100,payoff:100,trades:1000})).toThrow(/limit/);
});
test('percentage sizing must not report numerical underflow as a genuine total-loss threshold hit',()=>{
 expect(()=>simulateRuin({...base(),paths:100,trades:2000,probability:0,risk:99.9,threshold:1,cost:0})).toThrow(/precision/);
 // A real 100% modeled stake or an explicit charge can legitimately exhaust equity.
 expect(nextEquity(100,false,{...base(),risk:100,cost:0})).toBe(0);
 expect(nextEquity(100,false,{...base(),risk:50,cost:50})).toBe(0);
});
