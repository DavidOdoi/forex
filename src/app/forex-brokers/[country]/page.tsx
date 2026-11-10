import { notFound } from "next/navigation";
import { CountryGuideContent } from "@/components/country-guides/country-guide";
import { countryGuides, countryRegistry, getCountryGuide } from "@/lib/country-guides/catalog";
import { countryAffiliates } from "@/lib/country-guides/affiliate-agreements";
import { countryGuideMetadata, countryGuideStructuredData, evaluationDate } from "@/lib/country-guides/seo";
import "../country-guides.css";

// Evaluate date-sensitive agreement expiry on the server for each request.
// Essential research still arrives as HTML; no client-side data fetch is used.
export const dynamic = "force-dynamic";
export const dynamicParams = false;
export function generateStaticParams() { return countryGuides.map(country => ({ country: country.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params; const country = getCountryGuide(slug);
  return country ? countryGuideMetadata(country, countryRegistry, evaluationDate()) : {};
}
export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params; const country = getCountryGuide(slug);
  if (!country) notFound();
  const asOf = evaluationDate();
  return <><CountryGuideContent country={country} registry={countryRegistry} affiliates={countryAffiliates} asOf={asOf} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(countryGuideStructuredData(country, countryRegistry, asOf)).replace(/</g, "\\u003c") }} /></>;
}
