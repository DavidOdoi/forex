import { CalculatorPage } from "@/components/calculators/calculator-page";
import { converterDefinition } from "@/lib/calculators/converter-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(converterDefinition);
export default function Page() { return <CalculatorPage tool={converterDefinition} />; }
