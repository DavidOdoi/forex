import type { Metadata } from "next";
import { BrokerReviewPage } from "@/components/review-template/review-page";
import { reviewTemplate } from "@/lib/reviews/template";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
export const metadata: Metadata = {
  title: { absolute: "Broker Review Template | Devin Forex" },
  description:
    "A preview of Devin Forex’s reusable broker review format, with research fields, source records, comparison sections and verification status.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Broker Review Template | Devin Forex",
    description:
      "Review-format preview. No completed broker findings or ratings are published.",
    type: "website",
  },
};
export default function Page() {
  return <BrokerReviewPage review={reviewTemplate} />;
}
