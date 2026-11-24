import { CalculatorPage } from "@/components/calculators/calculator-page";
import { pipDefinition } from "@/lib/calculators/pip-content";
import { calculatorMetadata } from "@/lib/calculators/seo";

export const metadata = calculatorMetadata(pipDefinition);
export default function Page() { return <CalculatorPage tool={pipDefinition} />; }
