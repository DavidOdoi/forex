"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BrandLogo } from "./brand-logo";
import styles from "./site-header.module.css";

const baseMenu = [
  { label: "Compare brokers", to: "/best-brokers", items: [
    { label: "Overview", href: "/best-brokers" }, { label: "For beginners", href: "/find-my-broker" },
    { label: "Account cost calculator", href: "/tools/forex-calculator" }, { label: "Broker directory", href: "/reviews" },
    { label: "Country research guides", href: "/forex-brokers" },
  ] },
  { label: "Broker reviews", to: "/reviews", items: [
    { label: "All broker reviews", href: "/reviews" }, { label: "How we research", href: "/about#research-methodology" },
  ] },
  { label: "Tools", to: "/tools", items: [
    { label: "Forex calculator", href: "/tools/forex-calculator" },
    { label: "Profit calculator", href: "/tools/forex-profit-calculator" },
    { label: "Position size calculator", href: "/tools/forex-position-size-calculator" },
    { label: "Compounding calculator", href: "/tools/forex-compounding-calculator" },
    { label: "Forex market hours", href: "/tools/forex-market-hours" },
    { label: "Prop firm consistency", href: "/prop-firm-consistency-calculator" },
    { label: "Gold price today", href: "/gold-price" },
    { label: "Gold & silver prices", href: "/gold-silver-prices" },
  ] },
  { label: "Insights", to: "/insights", items: [
    { label: "Beginner guides", href: "/insights#beginner-guides" }, { label: "Strategies & risk", href: "/insights#strategies" }, { label: "Platforms & technology", href: "/insights#market-guides" },
    { label: "Prop firms for EAs", href: "/best-prop-firm-forex-eas" },
    { label: "Crypto & payments", href: "/insights#crypto-payments" },
  ] },
  { label: "About us", to: "/about", items: [
    { label: "Our story", href: "/about#our-story" }, { label: "How we research", href: "/about#research-methodology" }, { label: "Corrections", href: "/about#corrections" }, { label: "Contact", href: "/about#contact" },
  ] },
] as const;

export function SiteHeader({ reviewLinks = [] }: { reviewLinks?: { label: string; href: string }[] }) {
  const menu = baseMenu.map(group => group.label === "Broker reviews" && reviewLinks.length ? { ...group, items: reviewLinks } : group);
  const pathname = usePathname();
  const countryResearch = pathname === "/forex-brokers" || pathname.startsWith("/forex-brokers/");
  const countryTemplate = pathname.startsWith("/forex-brokers/");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const active = (path: string) => pathname === path || pathname.startsWith(path + "/");
  function closeDrawer() { drawer.current?.close(); }
  function openDrawer() { drawer.current?.showModal(); setMobileOpen(true); }
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1200px)");
    const closeOnWide = () => { if (wide.matches) drawer.current?.close(); };
    wide.addEventListener("change", closeOnWide);
    return () => wide.removeEventListener("change", closeOnWide);
  }, []);
  useEffect(() => { drawer.current?.close(); }, [pathname]);
  function menuKey(event: KeyboardEvent<HTMLDivElement>, id: string) {
    if (event.key === "Escape") {
      event.preventDefault(); setOpenMenu(null);
      event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
    } else if (event.key === "ArrowDown" && event.target instanceof HTMLElement && !event.target.closest("[data-dropdown]")) {
      event.preventDefault(); setOpenMenu(id);
      const group = event.currentTarget;
      requestAnimationFrame(() => group.querySelector<HTMLAnchorElement>("[data-dropdown] a")?.focus());
    }
  }
  function drawerKey(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const dialog = event.currentTarget;
    const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')].filter(node => node.getClientRects().length > 0);
    const first = focusable[0], last = focusable.at(-1);
    if (!first || !last) { event.preventDefault(); dialog.focus(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }
  return <header className={`${styles.header} ${countryTemplate ? styles.countryTemplate : ""}`}>
    <div className={styles.bar}>
      <Link href="/" className={styles.brand} aria-label="Devin Forex home">{countryTemplate ? <span className={styles.wordmark}>DEVIN<span>FOREX</span></span> : <BrandLogo className={styles.logo} priority />}</Link>
      <nav className={styles.desktopNav} aria-label="Main navigation">
        {menu.map((item, index) => <div className={styles.menuGroup} key={item.label}
          onPointerEnter={event => { if (event.pointerType === "mouse") setOpenMenu(item.label); }}
          onPointerLeave={event => { if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) setOpenMenu(null); }}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null); }}
          onKeyDown={event => menuKey(event, item.label)}>
          <div className={`${styles.menuTop} ${active(item.to) ? styles.active : ""}`}>
            <Link href={item.to} aria-current={pathname === item.to ? "page" : undefined} onClick={() => setOpenMenu(null)}>{item.label}</Link>
            <button type="button" aria-label={`${item.label} submenu`} aria-expanded={openMenu === item.label} aria-controls={`desktop-submenu-${index}`} onClick={() => setOpenMenu(current => current === item.label ? null : item.label)}><ChevronDown size={16} aria-hidden="true" /></button>
          </div>
          <div id={`desktop-submenu-${index}`} data-dropdown className={styles.dropdown} hidden={openMenu !== item.label}>
            <p>{item.label}</p>{item.items.map(link => <Link key={link.label} href={link.href} onClick={() => setOpenMenu(null)}>{link.label}<ArrowRight size={15} aria-hidden="true" /></Link>)}
          </div>
        </div>)}
      </nav>
      <div className={styles.headerActions}>
        {!countryResearch && <Link className={styles.findBroker} href="/find-my-broker">Find my broker <ArrowRight size={17} aria-hidden="true" /></Link>}
        <button ref={trigger} className={styles.mobileTrigger} type="button" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={mobileOpen} aria-controls="mobile-navigation-drawer" onClick={openDrawer}><Menu size={25} aria-hidden="true" /></button>
      </div>
    </div>
    <dialog ref={drawer} id="mobile-navigation-drawer" className={styles.drawer} aria-label="Site navigation" onKeyDown={drawerKey} onClose={() => { setMobileOpen(false); trigger.current?.focus({ preventScroll: true }); }} onClick={event => {
      if (event.target === event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDrawer();
      }
    }}>
      <div className={styles.drawerHeader}><Link href="/" aria-label="Devin Forex home" onClick={closeDrawer}><BrandLogo className={styles.drawerLogo} /></Link><button type="button" aria-label="Close navigation" onClick={closeDrawer}><X size={24} aria-hidden="true" /></button></div>
      <nav className={styles.mobileNav} aria-label="Mobile navigation">
        {menu.map((item, index) => <div key={item.label} className={styles.mobileGroup}>
          <div className={`${styles.mobileTop} ${active(item.to) ? styles.active : ""}`}><Link href={item.to} onClick={closeDrawer} aria-current={pathname === item.to ? "page" : undefined}>{item.label}</Link><button type="button" aria-label={`${item.label} links`} aria-expanded={mobileGroup === item.label} aria-controls={`mobile-submenu-${index}`} onClick={() => setMobileGroup(current => current === item.label ? null : item.label)}><ChevronDown size={20} aria-hidden="true" /></button></div>
          <div className={styles.mobileSubmenu} id={`mobile-submenu-${index}`} hidden={mobileGroup !== item.label}>{item.items.map(link => <Link href={link.href} key={link.label} onClick={closeDrawer}>{link.label}<ArrowRight size={15} aria-hidden="true" /></Link>)}</div>
        </div>)}
      </nav>
      <div className={styles.drawerBottom}><p>{countryResearch ? "Check country-specific permissions first." : "Ready to explore your options?"}</p><Link className={styles.findBroker} href={countryResearch ? "/forex-brokers" : "/find-my-broker"} onClick={closeDrawer}>{countryResearch ? "Country research" : "Find my broker"} <ArrowRight size={18} aria-hidden="true" /></Link></div>
    </dialog>
  </header>;
}

export function PageHero({
  eyebrow,
  title,
  accent,
  text,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 pt-20">
      <p className="mb-6 inline-block rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h1 className="font-display text-5xl leading-none md:text-7xl">
        {title} <em className="text-gold">{accent}</em>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{text}</p>
    </section>
  );
}
