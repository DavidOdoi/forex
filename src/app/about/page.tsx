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
          <div key={t} id={t === "How we research" ? "research-methodology" : t === "Our story" ? "our-story" : "commercial-policy"} className="scroll-mt-32 rounded-2xl glass p-8">
            <h2 className="font-display text-3xl text-gold">{t}</h2>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
      <section id="corrections" className="scroll-mt-32 mx-auto max-w-3xl px-6 pb-16 text-base leading-relaxed">
        <h2 className="font-display text-4xl">Corrections and updates</h2>
        <p className="mt-4">A correction should identify the page, disputed claim, relevant legal entity and a primary-source URL with its date. Recheck the evidence and record substantive changes separately from source retrieval dates. Drafts stay unpublished until an accountable editor records approval.</p>
        <p className="mt-4">Broker information is based on linked documents and dated source checks. Financial claims require verification. Author information is available on <a className="underline" href="/authors/david-odoi">David Odoi’s profile</a>.</p>
      </section>
      <section id="country-suggestions" className="scroll-mt-32 mx-auto max-w-3xl px-6 pb-16 text-base leading-relaxed">
        <h2 className="font-display text-4xl">Country-based broker suggestions</h2>
        <p className="mt-4">The broker panel uses Vercel’s approximate IP-country header. It does not request GPS coordinates or send your location to an external geolocation service. The recommendation endpoint does not read or store your raw IP address. VPNs, travel and network routing can make browsing country differ from residence.</p>
        <p className="mt-4">You can choose your residence manually. That choice is remembered in this browser tab using session storage; select automatic detection to clear it. This feature sets no tracking cookie. General hosting and security processing are separate from this panel.</p>
        <p className="mt-4">Only brokers with a review in our current library can appear. Country articles supply research shortlists, not proof of personal suitability or eligibility. External account buttons require a dated check of the provider’s regional offer and are removed after 90 days without a new check. Where trading or funding rules need clarification, the panel links to the country guide instead. It makes no ranking, bonus or investment-return promise.</p>
        <p className="mt-4">There are currently no affiliate tracking links in this panel. Any future paid referrals must be disclosed and marked accordingly. Always check the actual contracting company, residency requirements, fees and risk disclosures with the provider.</p>
      </section>
      <section id="contact" className="scroll-mt-32 mx-auto max-w-3xl px-6 pb-28 text-center">
        <h2 className="font-display text-4xl">
          Get in <em className="text-gold">touch</em>
        </h2>
        <p className="mt-4 text-muted-foreground">
          A public contact channel has not yet been confirmed. It must be established before the research publication launches.
        </p>
      </section>
    </main>
  );
}
