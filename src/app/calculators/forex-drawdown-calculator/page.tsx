import { CalculatorPage } from "@/components/calculators/calculator-page";
import { drawdownDefinition } from "@/lib/calculators/drawdown-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(drawdownDefinition);
export default function Page() { return <CalculatorPage tool={drawdownDefinition} />; }
