"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
export function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const links = site.navigation.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>);
  return <header className="site-header" onKeyDown={e => { if (e.key === "Escape" && open) { setOpen(false); button.current?.focus(); } }}>
    <div className="container header-inner">
      <Link className="brand" href="/" aria-label={`${site.name} home`}><Image src={site.logo} alt="" width={36} height={36} priority /><span>{site.name}</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links}</nav>
      <span className="header-note"><span className="status-dot" />Clarity before commitment</span>
      <button ref={button} className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? "Close ✕" : "Menu ☰"}</button>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{links}<span>More topics coming soon</span></nav>
  </header>;
}
