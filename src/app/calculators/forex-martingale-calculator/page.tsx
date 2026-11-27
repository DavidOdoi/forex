import { CalculatorPage } from "@/components/calculators/calculator-page";
import { martingaleDefinition } from "@/lib/calculators/martingale-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(martingaleDefinition);
export default function Page() { return <CalculatorPage tool={martingaleDefinition} />; }
