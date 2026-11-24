import { CalculatorPage } from "@/components/calculators/calculator-page";
import { leverageDefinition } from "@/lib/calculators/leverage-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(leverageDefinition);
export default function Page() { return <CalculatorPage tool={leverageDefinition} />; }
