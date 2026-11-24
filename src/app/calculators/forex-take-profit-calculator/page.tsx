import { CalculatorPage } from "@/components/calculators/calculator-page";
import { takeProfitDefinition } from "@/lib/calculators/take-profit-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(takeProfitDefinition);
export default function Page() { return <CalculatorPage tool={takeProfitDefinition} />; }
