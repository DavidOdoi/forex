import { CalculatorPage } from "@/components/calculators/calculator-page";
import { notionalDefinition } from "@/lib/calculators/notional-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(notionalDefinition);
export default function Page() { return <CalculatorPage tool={notionalDefinition} />; }
