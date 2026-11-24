import { CalculatorPage } from "@/components/calculators/calculator-page";
import { consistencyDefinition } from "@/lib/calculators/consistency-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(consistencyDefinition);
export default function Page() { return <CalculatorPage tool={consistencyDefinition} />; }
