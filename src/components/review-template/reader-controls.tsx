"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Globe2, Info, X } from "lucide-react";

export function ReaderContents({ links }: { links: { id: string; label: string }[] }) {
  const [active, setActive] = useState("overview");
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  useEffect(() => {
    const header = document.querySelector("body > header");
    const updateHeader = () => document.documentElement.style.setProperty("--br-header-height", `${header?.getBoundingClientRect().height ?? 76}px`);
    updateHeader();
    const resize = new ResizeObserver(updateHeader);
    if (header) resize.observe(header);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-150px 0px -55% 0px" });
    links.forEach(({ id }) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => { observer.disconnect(); resize.disconnect(); document.documentElement.style.removeProperty("--br-header-height"); };
  }, [links]);
  return <nav className="br-contents" aria-label="Review sections">
    <p>On this page</p>
    <button className="br-contents-toggle" type="button" aria-expanded={expanded} aria-controls={listId} onClick={() => setExpanded(value => !value)}>Contents<ChevronDown size={20} /></button>
    <ol id={listId} className={expanded ? "is-expanded" : ""}>{links.map((link, i) => <li key={link.id}><a href={`#${link.id}`} aria-current={active === link.id ? "location" : undefined} onClick={() => { setActive(link.id); setExpanded(false); }}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{link.label}</a></li>)}</ol>
  </nav>;
}

export function ReaderMarket({ current, countries, slug }: { current: string | null; countries: string[]; slug: string }) {
  const router = useRouter();
  return <div className="br-market">
    <label htmlFor="reader-market"><Globe2 size={15} />Country / entity profile</label>
    <div><select id="reader-market" value={current ?? ""} disabled={!countries.length} onChange={e => router.push(`/reviews/${slug}?country=${encodeURIComponent(e.target.value)}`)}>
      {!countries.length && <option value="">Country not established</option>}
      {countries.map(country => <option key={country}>{country}</option>)}
    </select><ChevronDown size={16} aria-hidden="true" /></div>
    <p>Account eligibility must be checked separately.</p>
  </div>;
}

export function ReaderDisclosure({ affiliate }: { affiliate: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button className="br-disclosure" type="button" onClick={() => dialog.current?.showModal()}><Info size={14} />Advertiser disclosure</button>
    <dialog ref={dialog} className="br-dialog" aria-labelledby="reader-disclosure-title" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <button aria-label="Close advertiser disclosure" type="button" onClick={() => dialog.current?.close()}><X size={20} /></button>
      <h2 id="reader-disclosure-title">How account links work</h2>
      <p>{affiliate ? "Devin Forex may receive compensation when you use an affiliate account link." : "No affiliate link or paid placement is active on this page. Account links are not configured."} Compensation does not establish a broker’s quality or suitability.</p>
      <p>Read our commercial policy in <a href="/about#research-methodology">our research approach</a>.</p>
    </dialog>
  </>;
}
