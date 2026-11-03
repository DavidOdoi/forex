"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, FileText, Globe2 } from "lucide-react";
import type { ReviewDirectoryEntry } from "@/lib/reviews/research-types";

export function ReviewDirectory({ entries }: { entries: ReviewDirectoryEntry[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const matching = entries.filter(e => `${e.name} ${e.country ?? ""}`.toLowerCase().includes(query.toLowerCase().trim()) &&
    (status === "all" || (status === "findings" ? e.findingCount > 0 : status === "sources" ? e.findingCount === 0 && e.sourceCount > 0 : e.sourceCount === 0)));
  const pageCount = Math.ceil(matching.length / 24);
  const visible = matching.slice(page * 24, (page + 1) * 24);
  return (
    <div>
      <div className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-xl border bg-background px-4">
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search broker reviews</span>
          <input className="w-full min-w-0 bg-transparent py-4 text-base outline-none" type="search" placeholder="Search by broker or researched country…" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} />
        </label>
        <label className="flex flex-col items-start gap-2 text-sm font-semibold sm:flex-row sm:items-center sm:gap-3">
          Research status
          <select className="w-full max-w-full rounded-xl border bg-background px-3 py-4 text-base sm:w-auto" value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}>
            <option value="all">All brokers</option>
            <option value="findings">Checked findings</option>
            <option value="sources">Source notes only</option>
            <option value="pending">Sources pending</option>
          </select>
        </label>
      </div>
      <p className="my-6 text-muted-foreground" role="status">{matching.length} brokers · {matching.length ? `Page ${page + 1} of ${pageCount}` : "No matching brokers"}</p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map(entry => (
          <article key={entry.slug} className="flex min-w-0 flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <span className="text-sm font-semibold text-muted-foreground">{entry.findingCount ? "Checked findings · Draft" : entry.sourceCount ? "Source notes · Draft" : "Research pending"}</span>
            <h2 className="mt-3 break-words font-display text-3xl">{entry.name}</h2>
            <p className="my-4 leading-relaxed text-muted-foreground">{entry.summary}</p>
            <div className="mb-5 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2"><Globe2 size={16} className="mt-1 shrink-0" />{entry.country ?? "Country scope awaiting verification"}</p>
              <p className="flex items-center gap-2"><FileText size={16} />{entry.sourceCount} sources · Not rated</p>
            </div>
            <Link href={`/reviews/${entry.slug}`} className="mt-auto flex items-center justify-between rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Open research draft <ArrowUpRight size={18} /></Link>
          </article>
        ))}
      </div>
      {!matching.length && <p className="rounded-2xl border p-10 text-center">No brokers match your search. Try another name or research status.</p>}
      {pageCount > 1 && <nav aria-label="Review directory pages" className="mt-8 flex items-center justify-center gap-4">
        <button className="rounded-full border px-5 py-3 disabled:opacity-40" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span>{page + 1} / {pageCount}</span>
        <button className="rounded-full border px-5 py-3 disabled:opacity-40" disabled={page + 1 >= pageCount} onClick={() => setPage(p => p + 1)}>Next</button>
      </nav>}
    </div>
  );
}
