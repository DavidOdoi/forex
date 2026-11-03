import type { Metadata } from "next";
import { BrokerReviewPage } from "@/components/review-template/review-page";
import { reviewTemplate } from "@/lib/reviews/template";
import { getReview } from "@/lib/reviews/catalog";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
export const metadata: Metadata = {
  title: { absolute: "Broker Review Template | Devin Forex" },
  description:
    "A populated FXPesa Kenya research example in the reusable Devin Forex review template. Source-based draft; editorial checks pending.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Broker Review Template | Devin Forex",
    description:
      "Populated research example with linked primary sources and outstanding checks.",
    type: "website",
  },
};
export default async function Page({ searchParams }: { searchParams: Promise<{ blank?: string }> }) {
  const { blank } = await searchParams;
  if (blank === "1") return <BrokerReviewPage review={reviewTemplate} />;
  return <BrokerReviewPage {...getReview("fxpesa", "Kenya")!} />;
}
