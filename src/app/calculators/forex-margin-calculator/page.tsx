import { CalculatorPage } from "@/components/calculators/calculator-page";
import { marginDefinition } from "@/lib/calculators/margin-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(marginDefinition);
export default function Page() { return <CalculatorPage tool={marginDefinition} />; }
