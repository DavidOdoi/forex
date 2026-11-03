import type { Metadata } from "next";
import { BrokerReviewPage } from "@/components/review-template/review-page";
import { reviewTemplate } from "@/lib/reviews/template";
import { getReview } from "@/lib/reviews/catalog";
import { reviewMetadata } from "@/lib/reviews/seo";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ blank?: string }> }): Promise<Metadata> {
  if ((await searchParams).blank === "1") return {
    title: { absolute: "Broker Review Template | Devin Forex" },
    description: "Blank, reusable review format with evidence fields and source records.",
    robots: { index: false, follow: false },
  };
  return { ...reviewMetadata(getReview("fxpesa", "Kenya")!.review), robots: { index: false, follow: false } };
}
export default async function Page({ searchParams }: { searchParams: Promise<{ blank?: string }> }) {
  const { blank } = await searchParams;
  if (blank === "1") return <BrokerReviewPage review={reviewTemplate} />;
  return <BrokerReviewPage {...getReview("fxpesa", "Kenya")!} />;
}
