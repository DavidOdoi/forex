import type { Metadata } from "next";
import Link from "next/link";
import { canonical, indexable } from "@/lib/site";
import { PageHero } from "@/components/site-header";
import { ReviewDirectory } from "@/components/review-directory";
import { ReviewDirectoryIndex } from "@/components/review-directory-index";
import { publishedReviewEntries } from "@/lib/reviews/visibility";
import { UnpublishedResearchPreview } from "@/components/unpublished-research-preview";

const entries = publishedReviewEntries();

export const metadata: Metadata = {
  title: { absolute: "Forex Broker Reviews — Devin Forex" },
  description: "Explore broker research across countries, with primary-source notes, country-specific legal entities and clearly labelled verification status.",
  openGraph: { title: "Forex Broker Reviews — Devin Forex", description: "Source-based broker research across countries. Review drafts, entity disclosures and outstanding checks.", type: "website" },
  twitter: { card: "summary_large_image", title: "Forex Broker Reviews — Devin Forex", description: "Source-based broker research across countries, with transparent verification status." },
  alternates: canonical("/reviews"),
  robots: { index: indexable && entries.length > 0, follow: true },
};

export default function Page() {
  const withFindings = entries.filter(e => e.findingCount > 0).length;
  const withSources = entries.filter(e => e.sourceCount > 0).length;
  return (
    <main>
      <PageHero eyebrow="PRIMARY SOURCES · COUNTRY BY COUNTRY" title="Forex broker reviews."
        accent={entries.length ? "Clearer decisions." : "Research in progress."}
        text="Completed reviews appear here after their source and editorial checks. We have not carried out hands-on testing or published broker ratings. Unfinished profiles are available separately as research previews." />
      <section className="mx-auto max-w-7xl space-y-8 px-6 pb-28">
        {entries.length > 0 ? <><div className="grid gap-4 sm:grid-cols-3">
          {[[entries.length, "Published broker profiles"], [withSources, "Profiles with source material"], [withFindings, "Profiles with checked findings"]].map(([value, label]) => <div key={label} className="rounded-2xl border bg-card p-6"><p className="font-display text-5xl">{value}</p><p className="mt-2 text-muted-foreground">{label}</p></div>)}
        </div>
        <ReviewDirectory entries={entries} />
        <ReviewDirectoryIndex entries={entries} />
        </> : <section id="all-providers" className="scroll-mt-32 rounded-2xl border bg-white p-7 sm:p-10"><h2 className="text-3xl font-semibold">Reviews are being prepared</h2><p className="mt-4 max-w-3xl text-lg leading-relaxed">We are checking legal entities, account costs and payment conditions before publishing the reviews. In the meantime, explore our published guides and trading tools.</p><div className="mt-6 flex flex-wrap gap-4"><Link href="/insights" className="rounded-full bg-gold px-6 py-3 font-semibold">Read trading guides</Link><Link href="/tools" className="rounded-full border px-6 py-3 font-semibold">Explore calculators</Link></div></section>}
        <UnpublishedResearchPreview />
      </section>
    </main>
  );
}
