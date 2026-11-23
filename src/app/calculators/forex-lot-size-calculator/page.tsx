import { CalculatorPage } from "@/components/calculators/calculator-page";
import { lotSizeDefinition } from "@/lib/calculators/lot-size-content";
import { calculatorMetadata } from "@/lib/calculators/seo";

export const metadata = calculatorMetadata(lotSizeDefinition);
export default function Page() { return <CalculatorPage tool={lotSizeDefinition} />; }
