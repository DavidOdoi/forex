import { CalculatorPage } from "@/components/calculators/calculator-page";
import { atrPositionDefinition } from "@/lib/calculators/atr-position-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(atrPositionDefinition);
export default function Page() { return <CalculatorPage tool={atrPositionDefinition} />; }
