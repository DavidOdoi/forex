import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Forex Trading Tools & Calculators — Devin Forex" },
    description:
      "Free pip value, position size and profit calculators for forex traders.",
    openGraph: {
      title: "Forex Trading Tools — Devin Forex",
      description: "Free pip, position size and profit calculators.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Trading Tools — Devin Forex",
      description: "Free pip, position size and profit calculators.",
    },
  },
  alternates: canonical("/tools"),
};
import Page from "@/components/tools-content";
export default Page;
