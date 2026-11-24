import { CalculatorPage } from "@/components/calculators/calculator-page";
import { currencyDefinition } from "@/lib/calculators/currency-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(currencyDefinition);
export default function Page() { return <CalculatorPage tool={currencyDefinition} />; }
