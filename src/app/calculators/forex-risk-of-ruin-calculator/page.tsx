import { CalculatorPage } from "@/components/calculators/calculator-page";
import { ruinDefinition } from "@/lib/calculators/ruin-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(ruinDefinition);
export default function Page() { return <CalculatorPage tool={ruinDefinition} />; }
