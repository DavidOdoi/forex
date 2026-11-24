import { CalculatorPage } from "@/components/calculators/calculator-page";
import { breakEvenDefinition } from "@/lib/calculators/break-even-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(breakEvenDefinition);
export default function Page() { return <CalculatorPage tool={breakEvenDefinition} />; }
