import { CalculatorPage } from "@/components/calculators/calculator-page";
import { propDrawdownDefinition } from "@/lib/calculators/prop-drawdown-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(propDrawdownDefinition);
export default function Page() { return <CalculatorPage tool={propDrawdownDefinition} />; }
