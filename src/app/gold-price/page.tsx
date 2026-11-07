import { MetalHub } from "@/components/metals/metal-hub";
import { hubMetadata } from "@/lib/metals/seo";
export const revalidate = 30;
export const metadata = hubMetadata("gold");
export default function GoldPricePage() { return <MetalHub kind="gold" />; }
