import { CalculatorPage } from "@/components/calculators/calculator-page";
import { kellyDefinition } from "@/lib/calculators/kelly-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(kellyDefinition);
export default function Page() { return <CalculatorPage tool={kellyDefinition} />; }
