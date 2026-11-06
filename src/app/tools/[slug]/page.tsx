import { notFound } from "next/navigation";
import { calculators, getCalculator } from "@/lib/calculators/catalog";
import { calculatorMetadata } from "@/lib/calculators/seo";
import { CalculatorPage } from "@/components/calculators/calculator-page";

export const dynamicParams = false;
export function generateStaticParams() { return calculators.map(tool => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const tool = getCalculator((await params).slug);
  return tool ? calculatorMetadata(tool) : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const tool = getCalculator((await params).slug);
  if (!tool) notFound();
  return <CalculatorPage tool={tool} />;
}
