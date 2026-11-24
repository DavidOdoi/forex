import { CalculatorPage } from "@/components/calculators/calculator-page";
import { riskDefinition } from "@/lib/calculators/risk-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(riskDefinition);
export default function Page() { return <CalculatorPage tool={riskDefinition} />; }
