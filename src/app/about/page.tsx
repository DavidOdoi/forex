import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "About Devin Forex — Our Purpose & Research Approach" },
    description:
      "Our purpose, planned source-based research and approach to commercial disclosures.",
    openGraph: {
      title: "About Devin Forex",
      description: "Our purpose and planned source-based research approach.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "About Devin Forex",
      description: "Our purpose and planned source-based research approach.",
    },
  },
  alternates: canonical("/about"),
};
import { PageHero } from "@/components/site-header";

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="About us"
        title="Helping traders choose"
        accent="wisely"
        text="Devin Forex is being developed to help readers understand forex brokers and the questions to ask before choosing a service."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 md:grid-cols-3">
        {[
          [
            "Our story",
            "Our aim is to explain broker services, costs and risks using clearly identified sources and transparent limitations.",
          ],
          [
            "How we research",
            "We read primary broker documents and identify the relevant country and legal entity. Provider claims are attributed; regulator checks are labelled separately. Sources and check dates stay attached to findings. Drafts require editorial checks before publication. We have not tested live accounts or withdrawals, and we do not assign unsupported ratings.",
          ],
          [
            "How we earn",
            "Any future affiliate relationships will be clearly disclosed. There are currently no active referral links.",
          ],
        ].map(([t, d]) => (
          <div key={t} id={t === "How we research" ? "research-methodology" : undefined} className="scroll-mt-32 rounded-2xl glass p-8">
            <h2 className="font-display text-3xl text-gold">{t}</h2>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-28 text-center">
        <h2 className="font-display text-4xl">
          Get in <em className="text-gold">touch</em>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Questions or partnership ideas? Email us at hello@devinforex.com
        </p>
      </section>
    </main>
  );
}
