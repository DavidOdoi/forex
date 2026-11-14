import type { Metadata } from "next";
import { canonical, indexable } from "@/lib/site";
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
  robots: { index: indexable, follow: true },
};
import Page from "@/components/find-my-broker-content";
import { visibleReviewEntries } from "@/lib/reviews/visibility";
export default function FindMyBrokerPage() {
  return <Page reviewLinks={Object.fromEntries(visibleReviewEntries().map(entry => [entry.slug, entry.href!]))} />;
}
