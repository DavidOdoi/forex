import { CalculatorPage } from "@/components/calculators/calculator-page";
import { profitDefinition } from "@/lib/calculators/profit-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(profitDefinition);
export default function Page() { return <CalculatorPage tool={profitDefinition} />; }
