import type { Metadata } from "next";
import Link from "next/link";
import { canonical } from "@/lib/site";
import { davidOdoi } from "@/lib/authors";

export const metadata: Metadata = {
  title: { absolute: "David Odoi — Author & Research Accountability | Devin Forex" },
  description: "David Odoi’s author role, research process and editorial accountability at Devin Forex.",
  alternates: canonical(davidOdoi.profileUrl),
  robots: { index: false, follow: true },
};

export default function AuthorPage() {
  return <main className="mx-auto max-w-3xl px-6 py-16 text-base leading-relaxed">
    <p className="font-semibold">Devin Forex · Author profile</p>
    <h1 className="mt-4 text-4xl font-bold">David Odoi</h1>
    <p className="mt-6">David Odoi is the designated author for the broker research directory on Devin Forex. This profile identifies the person attached to these drafts; a professional biography and relevant experience have not yet been supplied.</p>
    <section className="mt-10"><h2 className="text-2xl font-bold">How this research is prepared</h2><p className="mt-4">The workflow uses public broker documents, regulator records where accessible, automated collection and AI-assisted drafting. Financial claims retain source links, scope and check dates. Advertised terms are distinguished from measured results.</p><p className="mt-4">No funded-account, execution or withdrawal testing has been performed. A source check is separate from editorial approval, and an independent reviewer has not been assigned.</p></section>
    <section className="mt-10"><h2 className="text-2xl font-bold">Published trading guides</h2><p className="mt-4">David Odoi is also the named author of the <Link className="underline" href="/insights">Devin Forex learning library</Link>, covering trading platforms, automation, indicators and risk. These educational guides use cited public documentation and labelled examples. Product selections are research-based rather than hands-on performance rankings.</p></section>
    <section className="mt-10"><h2 className="text-2xl font-bold">Work and accountability</h2><p className="mt-4"><Link className="underline" href="/reviews/exness">Exness review: fees, accounts and safety</Link> is one example in the <Link className="underline" href="/reviews#all-providers">complete broker research directory</Link>. The reviews remain drafts. The author biography, substantive publication dates and recorded editorial approval must be completed before publication.</p><p className="mt-4">See the <Link className="underline" href="/about#research-methodology">research methodology</Link> and <Link className="underline" href="/about#corrections">corrections process</Link> for how claims and updates are handled.</p></section>
  </main>;
}
