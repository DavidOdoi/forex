import { CalculationError } from "./forex";
import { D,decimal,type Numeric } from "./precision";
import { calculatePip,type PipInputs } from "./pip";
import { tradeVolume,checkedAccount } from "./trade-core";

export type LotConverterInputs = Omit<PipInputs,"pips"|"movement"|"volumeMode"> & { inputUnit:"configured"|"standard"|"mini"|"micro"|"nano"|"units"; pipEnabled:boolean; grid?:{minimum:Numeric;step:Numeric;maximum?:Numeric} };
export function convertLots(input:LotConverterInputs){
  checkedAccount(input.account);
  // Validate the FX contract and convention independently of optional valuation.
  const spec=tradeVolume(input.instrument,"1","units");
  const factors={configured:spec.contract,standard:new D(100000),mini:new D(10000),micro:new D(1000),nano:new D(100),units:new D(1)};
  if(!Object.hasOwn(factors,input.inputUnit))throw new CalculationError("Choose a supported input volume unit.");
  const amount=decimal(input.volume,"input quantity","0","1000000000000",true);
  const units=amount.mul(factors[input.inputUnit]);
  if(units.gt(1000000000000))throw new CalculationError("The converter supports at most 1,000,000,000,000 base units per scenario.");
  const lots=units.div(spec.contract);
  let grid=null;
  if(input.grid){
    const min=decimal(input.grid.minimum,"minimum configured lots","0","1000000000000");
    const step=decimal(input.grid.step,"configured lot step","0","1000000000000",true);
    const max=input.grid.maximum===undefined?null:decimal(input.grid.maximum,"maximum configured lots",min.toString(),"1000000000000");
    const offset=lots.sub(min).div(step);
    const compatible=lots.gte(min)&&(!max||lots.lte(max))&&offset.isInteger();
    const last=max?min.add(max.sub(min).div(step).floor().mul(step)):null;
    const lower=lots.lt(min)?null: min.add(offset.floor().mul(step));
    const upper=lots.lte(min)?min:min.add(offset.ceil().mul(step));
    const allowedLower=lower===null?null:last&&lower.gt(last)?last:lower;
    grid={min,step,max,compatible,lower:allowedLower?.gt(0)?allowedLower:null,upper:upper.lte(0)||(max&&upper.gt(max))?null:upper};
  }
  let pip:ReturnType<typeof calculatePip>|null=null,pipError:string|null=null;
  if(input.pipEnabled){try{pip=calculatePip({...input,volume:units.toString(),volumeMode:"units",pips:"1"});}catch(error){if(error instanceof CalculationError)pipError=error.message;else throw error;}}
  return {units,lots,standard:units.div(100000),mini:units.div(10000),micro:units.div(1000),nano:units.div(100),grid,pip,pipError};
}
