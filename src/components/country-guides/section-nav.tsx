"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CountrySectionNav({ items }: { items: { id: string; label: string }[] }) {
  const nav = useRef<HTMLElement>(null);
  const links = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(items[0]?.id);
  const [enhanced, setEnhanced] = useState(false);
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const root = nav.current?.closest<HTMLElement>(".cg-page");
    const header = document.querySelector<HTMLElement>("body > header");
    const rail = links.current;
    if (!root || !rail || !nav.current) return;
    const update = () => {
      root.style.setProperty("--cg-header-height", `${header?.getBoundingClientRect().height ?? 112}px`);
      root.style.setProperty("--cg-nav-height", `${nav.current?.getBoundingClientRect().height ?? 64}px`);
      setEdges({ left: rail.scrollLeft > 2, right: rail.scrollWidth - rail.clientWidth - rail.scrollLeft > 2 });
    };
    const observer = new ResizeObserver(update);
    if (header) observer.observe(header);
    observer.observe(nav.current); observer.observe(rail);
    const sections = items.flatMap(item => { const section = document.getElementById(item.id); return section ? [section] : []; });
    const position = () => {
      const top = (header?.getBoundingClientRect().height ?? 112) + (nav.current?.getBoundingClientRect().height ?? 64) + 28;
      let current = sections[0]?.id;
      let closest = -Infinity;
      for (const section of sections) {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= top && sectionTop >= closest) { closest = sectionTop; current = section.id; }
      }
      if (current) setActive(current);
    };
    setEnhanced(true); update(); position();
    rail.addEventListener("scroll", update, { passive: true }); window.addEventListener("scroll", position, { passive: true });
    return () => { observer.disconnect(); rail.removeEventListener("scroll", update); window.removeEventListener("scroll", position); root.style.removeProperty("--cg-header-height"); root.style.removeProperty("--cg-nav-height"); };
  }, [items]);
  function scroll(direction: number) {
    links.current?.scrollBy({ left: direction * Math.max(240, links.current.clientWidth * .65), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  return <nav ref={nav} className="cg-section-nav" aria-label="Guide sections"><div className="cg-container cg-section-nav-inner"><div className="cg-section-links" ref={links}>
    {items.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined} onClick={() => setActive(item.id)}>{item.label}</a>)}
  </div>{enhanced && (edges.left || edges.right) && <div className="cg-section-controls"><button type="button" aria-label="Scroll section links left" disabled={!edges.left} onClick={() => scroll(-1)}><ChevronLeft size={18} aria-hidden="true" /></button><button type="button" aria-label="Scroll section links right" disabled={!edges.right} onClick={() => scroll(1)}><ChevronRight size={18} aria-hidden="true" /></button></div>}</div></nav>;
}
