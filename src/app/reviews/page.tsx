import type { Metadata } from "next";
import Link from "next/link";
import { canonical } from "@/lib/site";
import { PageHero } from "@/components/site-header";
import { ReviewDirectory } from "@/components/review-directory";
import { ReviewDirectoryIndex } from "@/components/review-directory-index";
import { directoryEntries, researchInventory } from "@/lib/reviews/catalog";

export const metadata: Metadata = {
  title: { absolute: "Forex Broker Reviews — Devin Forex" },
  description: "Explore broker research across countries, with primary-source notes, country-specific legal entities and clearly labelled verification status.",
  openGraph: { title: "Forex Broker Reviews — Devin Forex", description: "Source-based broker research across countries. Review drafts, entity disclosures and outstanding checks.", type: "website" },
  twitter: { card: "summary_large_image", title: "Forex Broker Reviews — Devin Forex", description: "Source-based broker research across countries, with transparent verification status." },
  alternates: canonical("/reviews"),
};

export default function Page() {
  const entries = directoryEntries();
  const withFindings = entries.filter(e => e.findingCount > 0).length;
  const withSources = entries.filter(e => e.sourceCount > 0).length;
  return (
    <main>
      <PageHero eyebrow="PRIMARY SOURCES · COUNTRY BY COUNTRY" title="Better research."
        accent="Clearer decisions."
        text="Explore broker disclosures, regional legal entities and documented account conditions. We have not carried out hands-on testing or published broker ratings. Every profile shows its research status." />
      <section className="mx-auto max-w-7xl space-y-8 px-6 pb-28">
        <div className="grid gap-4 sm:grid-cols-3">
          {[[researchInventory.total, "Brokers and providers"], [withSources, "Entries with source material"], [withFindings, "Entries with checked findings"]].map(([value, label]) => <div key={label} className="rounded-2xl border bg-card p-6"><p className="font-display text-5xl">{value}</p><p className="mt-2 text-muted-foreground">{label}</p></div>)}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border bg-primary p-7 text-primary-foreground">
          <div className="max-w-2xl"><h2 className="text-2xl font-semibold">See the populated review template</h2><p className="mt-2 leading-relaxed opacity-85">Exness demonstrates the detailed format. Other profiles cover entities in the UK, Australia, Cyprus, Seychelles, Singapore, the UAE and more.</p></div>
          <Link href="/reviews/template" className="rounded-full bg-gold px-6 py-3 font-semibold text-primary-foreground">View populated template →</Link>
          <Link href="/reviews/template?blank=1" className="text-sm underline underline-offset-4">Preview review template</Link>
        </div>
        <p className="leading-relaxed text-muted-foreground">All {researchInventory.total} CSV entries use the shared research layout: {researchInventory.retail} retail forex/CFD brokers and {researchInventory.separate} institutional, interbank or introducing providers. Provider profiles adapt the questions to their directory classification. These classifications and country leads are not verified eligibility. Unfinished reviews remain drafts and are excluded from search indexing.</p>
        <ReviewDirectory entries={entries} />
        <ReviewDirectoryIndex entries={entries} />
      </section>
    </main>
  );
}
