import { CalculatorPage } from "@/components/calculators/calculator-page";
import { swapDefinition } from "@/lib/calculators/swap-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(swapDefinition);
export default function Page() { return <CalculatorPage tool={swapDefinition} />; }
