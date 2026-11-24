import { CalculatorPage } from "@/components/calculators/calculator-page";
import { spreadDefinition } from "@/lib/calculators/spread-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(spreadDefinition);
export default function Page() { return <CalculatorPage tool={spreadDefinition} />; }
