import { CalculatorPage } from "@/components/calculators/calculator-page";
import { stopLossDefinition } from "@/lib/calculators/stop-loss-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(stopLossDefinition);
export default function Page() { return <CalculatorPage tool={stopLossDefinition} />; }
