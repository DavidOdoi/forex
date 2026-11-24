import { CalculatorPage } from "@/components/calculators/calculator-page";
import { pivotDefinition } from "@/lib/calculators/pivot-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(pivotDefinition);
export default function Page() { return <CalculatorPage tool={pivotDefinition} />; }
