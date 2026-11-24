import { CalculatorPage } from "@/components/calculators/calculator-page";
import { marginCallDefinition } from "@/lib/calculators/margin-call-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(marginCallDefinition);
export default function Page() { return <CalculatorPage tool={marginCallDefinition} />; }
