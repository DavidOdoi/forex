import { CalculatorPage } from "@/components/calculators/calculator-page";
import { sharpeDefinition } from "@/lib/calculators/sharpe-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(sharpeDefinition);
export default function Page() { return <CalculatorPage tool={sharpeDefinition} />; }
