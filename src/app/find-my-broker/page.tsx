import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Find My Forex Broker — Devin Forex" },
    description:
      "Preview a three-question preference tool using unverified example data. No broker recommendation is provided.",
    openGraph: {
      title: "Find My Broker — Devin Forex",
      description:
        "A preference-matching demonstration. Broker verification is pending; no recommendations are provided.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Find My Broker — Devin Forex",
      description:
        "A preference-matching demonstration. Broker verification is pending; no recommendations are provided.",
    },
  },
  alternates: canonical("/find-my-broker"),
  robots: { index: false, follow: true },
};
import Page from "@/components/find-my-broker-content";
import { publishedReviewEntries } from "@/lib/reviews/visibility";
export default function FindMyBrokerPage() {
  return <Page publishedLinks={Object.fromEntries(publishedReviewEntries().map(entry => [entry.slug, entry.href!]))} />;
}
