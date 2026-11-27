import { CalculatorPage } from "@/components/calculators/calculator-page";
import { hedgeDefinition } from "@/lib/calculators/hedge-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(hedgeDefinition);
export default function Page() { return <CalculatorPage tool={hedgeDefinition} />; }
