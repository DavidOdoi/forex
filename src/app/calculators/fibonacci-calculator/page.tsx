import { CalculatorPage } from "@/components/calculators/calculator-page";
import { fibonacciDefinition } from "@/lib/calculators/fibonacci-content";
import { calculatorMetadata } from "@/lib/calculators/seo";
export const metadata = calculatorMetadata(fibonacciDefinition);
export default function Page() { return <CalculatorPage tool={fibonacciDefinition} />; }
