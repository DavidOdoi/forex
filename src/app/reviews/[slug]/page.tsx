import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrokerReviewPage } from "@/components/review-template/review-page";
import { getVisibleReview } from "@/lib/reviews/visibility";
import { reviewMetadata, reviewStructuredData } from "@/lib/reviews/seo";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ country?: string }> };
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { country } = await searchParams;
  const result = getVisibleReview(slug, country);
  return result ? reviewMetadata(result.review) : { title: "Review not found | Devin Forex", robots: { index: false, follow: false } };
}
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { country } = await searchParams;
  const result = getVisibleReview(slug, country);
  if (!result) notFound();
  return <><BrokerReviewPage {...result} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewStructuredData(result.review)).replace(/</g, "\\u003c") }} /></>;
}
