import { CalculatorPage } from "@/components/calculators/calculator-page";
import { expectancyDefinition } from "@/lib/calculators/expectancy-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(expectancyDefinition);
export default function Page() { return <CalculatorPage tool={expectancyDefinition} />; }
