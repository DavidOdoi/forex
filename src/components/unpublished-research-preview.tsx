"use client";

import { useState } from "react";
import Link from "next/link";
import { ReviewDirectory } from "./review-directory";
import { ReviewDirectoryIndex } from "./review-directory-index";
import type { ReviewDirectoryEntry } from "@/lib/reviews/research-types";

type Preview = { entries: ReviewDirectoryEntry[]; templates: { label: string; href: string }[] };
export function UnpublishedResearchPreview() {
  const [data, setData] = useState<Preview | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  async function toggle() {
    if (data) { setOpen(value => !value); return; }
    setLoading(true); setError(false);
    try {
      const response = await fetch("/api/review-research", { cache: "no-store" });
      if (!response.ok) throw new Error("Preview unavailable");
      const result: Preview = await response.json();
      if (!Array.isArray(result.entries) || !Array.isArray(result.templates)) throw new Error("Invalid preview");
      setData(result); setOpen(true);
    } catch { setError(true); }
    finally { setLoading(false); }
  }
  return <section className="space-y-6 rounded-2xl border bg-white p-6 sm:p-8" aria-labelledby="unpublished-preview-title">
    <div><h2 id="unpublished-preview-title" className="text-2xl font-semibold">Unpublished research preview</h2><p className="mt-3 max-w-3xl text-lg leading-relaxed">Drafts contain incomplete findings and are not completed broker assessments. You can preview the work in progress below.</p></div>
    <button type="button" className="rounded-full border border-black px-6 py-3 text-base font-semibold disabled:opacity-50" aria-expanded={open} aria-controls="unpublished-preview-content" disabled={loading} onClick={toggle}>{loading ? "Loading research previews…" : open ? "Hide unpublished research" : "Preview unpublished research"}</button>
    {error && <p role="alert">Research previews could not be loaded. Please try again.</p>}
    <div id="unpublished-preview-content" hidden={!open} className="space-y-8">{data && <>
      <div className="flex flex-wrap gap-5">{data.templates.map(template => <Link key={template.href} href={template.href} rel="nofollow" prefetch={false} className="text-base font-semibold underline underline-offset-4">{template.label}</Link>)}</div>
      <ReviewDirectory entries={data.entries} /><ReviewDirectoryIndex entries={data.entries} />
    </>}</div>
  </section>;
}
