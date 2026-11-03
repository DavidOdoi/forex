import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrokerReviewPage } from "@/components/review-template/review-page";
import { getReview } from "@/lib/reviews/catalog";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ country?: string }> };
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { country } = await searchParams;
  const result = getReview(slug, country);
  return {
    title: { absolute: result ? `${result.review.broker.name} Review${result.review.jurisdiction ? ` — ${result.review.jurisdiction}` : ""} | Devin Forex` : "Review not found | Devin Forex" },
    description: result ? `Source-based ${result.review.broker.name} research draft. Country-specific entity findings, documented account conditions and unresolved checks. No hands-on testing or rating.` : "Broker review not found.",
    robots: { index: false, follow: false },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { country } = await searchParams;
  const result = getReview(slug, country);
  if (!result) notFound();
  return <BrokerReviewPage {...result} />;
}
