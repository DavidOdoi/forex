import type { Metadata } from "next";
import Link from "next/link";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Forex Broker Reviews — Devin Forex" },
    description:
      "Broker profiles in preparation. Official sources and regulator registers will be checked before completed reviews are published.",
    openGraph: {
      title: "Forex Broker Reviews — Devin Forex",
      description:
        "Broker research in preparation. No hands-on testing or ratings are currently published.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Broker Reviews — Devin Forex",
      description:
        "Broker research in preparation. No hands-on testing or ratings are currently published.",
    },
  },
  alternates: canonical("/reviews"),
};
import { CircleHelp } from "lucide-react";
import { PageHero } from "@/components/site-header";
import { brokers, brokerResearchNotice } from "@/lib/brokers";

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Source-based research · In preparation"
        title="Research-based broker"
        accent="reviews"
        text="We are preparing broker profiles using official publications and regulator registers. We have not carried out hands-on testing or published broker ratings."
      />
      <section className="mx-auto max-w-7xl space-y-6 px-6 pb-28">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-6">
          <div>
            <h2 className="text-xl font-semibold">Our review format</h2>
            <p className="mt-2 text-muted-foreground">
              Explore the structure before researched profiles are published.
            </p>
          </div>
          <Link
            href="/reviews/template"
            className="rounded-full bg-gold px-6 py-3 font-semibold text-primary-foreground"
          >
            Preview review template →
          </Link>
        </div>
        <p className="text-muted-foreground">{brokerResearchNotice}</p>
        {brokers.map((b) => (
          <article
            key={b.slug}
            className="grid gap-8 rounded-2xl border bg-card p-8 md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-accent">
                {b.tag}
              </span>
              <h2 className="mt-2 font-display text-4xl">
                {b.name} research preview
              </h2>
              <p className="mt-3 text-muted-foreground">{b.summary}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="mb-3 font-semibold">Checks to complete</p>
              <ul className="space-y-3">
                {[
                  "Verify the legal entity and regulator entry",
                  "Check regional account costs and payment terms",
                  "Confirm platform features and restrictions",
                ].map((question) => (
                  <li className="flex gap-2" key={question}>
                    <CircleHelp className="h-4 w-4 shrink-0" />
                    {question}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">Not rated</span>
              <a
                href={b.url}
                target="_blank"
                rel="sponsored noopener"
                className="rounded-full bg-gold px-6 py-3 font-semibold text-primary-foreground"
              >
                {b.name} link pending
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
