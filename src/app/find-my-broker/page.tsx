import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Find My Forex Broker — Devin Forex" },
    description:
      "Answer 3 quick questions and get matched with the right forex broker.",
    openGraph: {
      title: "Find My Broker — Devin Forex",
      description: "Get matched with the right forex broker in 30 seconds.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Find My Broker — Devin Forex",
      description: "Get matched with the right forex broker in 30 seconds.",
    },
  },
  alternates: canonical("/find-my-broker"),
};
import Page from "@/components/find-my-broker-content";
export default Page;
