import Link from "next/link";
import type { ReviewDirectoryEntry } from "@/lib/reviews/research-types";

export function ReviewDirectoryIndex({ entries }: { entries: ReviewDirectoryEntry[] }) {
  const selected = entries.every(entry => entry.visible);
  const groups = new Map<string, ReviewDirectoryEntry[]>();
  for (const entry of entries) {
    const first = entry.name[0].toUpperCase();
    const letter = /[A-Z]/.test(first) ? first : "0–9";
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(entry);
  }
  const ordered = [...groups].sort(([a], [b]) => a.localeCompare(b));
  const id = (letter: string) => `providers-${letter === "0–9" ? "numbers" : letter.toLowerCase()}`;
  return <section id="all-providers" className="scroll-mt-32 rounded-2xl border bg-card p-6 sm:p-8">
    <h2 className="text-2xl font-semibold">{selected ? `Our ${entries.length} broker reviews: A–Z` : `All ${entries.length} brokers and providers: A–Z`}</h2>
    <p className="mt-3 text-base leading-relaxed text-muted-foreground">{selected ? "Open a review for linked findings and outstanding checks. Account terms depend on the named entity and your location." : "Every directory entry has a research page. Provider classifications come from the supplied CSV and still require verification."}</p>
    <details className="mt-5"><summary className="cursor-pointer text-base font-semibold underline underline-offset-4">{selected ? "Browse the selected broker reviews" : "Browse the complete directory"}</summary>
      <nav aria-label="Provider index letters" className="my-6 flex flex-wrap gap-2">{ordered.map(([letter]) => <a className="rounded-lg border px-3 py-2 text-base font-semibold" key={letter} href={`#${id(letter)}`}>{letter}</a>)}</nav>
      <nav aria-label="All broker and provider research"><div className="space-y-8">{ordered.map(([letter, group]) => <section className="scroll-mt-32" key={letter} id={id(letter)}><h3 className="border-b pb-2 text-xl font-semibold">{letter}</h3><ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">{group.map(entry => <li key={entry.slug}><Link className="break-words text-base underline underline-offset-4 hover:text-primary" href={entry.href ?? `/reviews/${entry.slug}`} rel={entry.visible || entry.published ? undefined : "nofollow"} prefetch={entry.published ? undefined : false}>{entry.name}</Link></li>)}</ul></section>)}</div></nav>
    </details>
  </section>;
}
