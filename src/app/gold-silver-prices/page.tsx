import { MetalHub } from "@/components/metals/metal-hub";
import { hubMetadata } from "@/lib/metals/seo";
export const revalidate = 30;
export const metadata = hubMetadata("comparison");
export default function GoldSilverPricesPage() { return <MetalHub kind="comparison" />; }
