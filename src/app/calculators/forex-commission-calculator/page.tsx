import { CalculatorPage } from "@/components/calculators/calculator-page";
import { commissionDefinition } from "@/lib/calculators/commission-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(commissionDefinition);
export default function Page() { return <CalculatorPage tool={commissionDefinition} />; }
