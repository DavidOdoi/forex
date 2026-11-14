import type { Metadata } from "next";
import { canonical, indexable } from "@/lib/site";
import { PageHero } from "@/components/site-header";
import { ReviewDirectory } from "@/components/review-directory";
import { ReviewDirectoryIndex } from "@/components/review-directory-index";
import { visibleReviewEntries } from "@/lib/reviews/visibility";

const entries = visibleReviewEntries();
export const metadata: Metadata = {
  title: { absolute: "Forex Broker Reviews — Devin Forex" },
  description: "Forex broker reviews: compare account costs, platforms, funding requirements and entity-specific protections using linked sources from Devin Forex.",
  openGraph: { title: "Forex Broker Reviews — Devin Forex", description: "Explore our selected broker reviews, with linked evidence and transparent verification status.", type: "website" },
  twitter: { card: "summary_large_image", title: "Forex Broker Reviews — Devin Forex", description: "Compare forex broker fees, platforms and entity-specific protections using source-based research." },
  alternates: canonical("/reviews"),
  robots: { index: indexable, follow: true },
};
export default function Page() {
  return <main>
    <PageHero eyebrow={`${entries.length} BROKERS · SOURCE-BASED RESEARCH`} title="Forex broker reviews."
      accent="Start with the facts."
      text={`Compare ${entries.map(entry => entry.name).join(", ")}. Each review links to sources and identifies outstanding checks. We have not carried out hands-on testing or published broker ratings.`} />
    <section className="mx-auto max-w-7xl space-y-8 px-6 pb-28" aria-label="Selected broker reviews">
      <div className="grid gap-4 sm:grid-cols-3">{[[entries.length, "Broker reviews to explore"], [entries.filter(entry => entry.sourceCount > 0).length, "With linked source material"], ["Global", "With entity-specific research"]].map(([value,label]) => <div key={label} className="rounded-2xl border bg-card p-6"><p className="font-display text-5xl">{value}</p><p className="mt-2 text-muted-foreground">{label}</p></div>)}</div>
      <ReviewDirectory entries={entries} />
      <ReviewDirectoryIndex entries={entries} />
    </section>
  </main>;
}
