"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Globe2, Search, UserCircle } from "lucide-react";

const menu = [
  { label: "Compare brokers", to: "/best-brokers", items: [
    { label: "Overview", href: "/best-brokers" }, { label: "For beginners", href: "/find-my-broker" },
    { label: "Account cost example", href: "/reviews/exness#fees" }, { label: "Global broker directory", href: "/reviews" },
  ] },
  { label: "Broker reviews", to: "/reviews", items: [
    { label: "Exness", href: "/reviews/exness" }, { label: "XM", href: "/reviews/xm" },
    { label: "IC Markets", href: "/reviews/ic-markets" }, { label: "Pepperstone", href: "/reviews/pepperstone" },
  ] },
  { label: "Tools", to: "/tools", items: [
    { label: "Pip calculator", href: "/tools#pip-calculator" }, { label: "Position size", href: "/tools#position-size" }, { label: "Profit calculator", href: "/tools#profit-calculator" },
  ] },
  { label: "Insights", to: "/insights", items: [
    { label: "Beginner guides", href: "/insights#beginner-guides" }, { label: "Strategies & risk", href: "/insights#strategies" }, { label: "Platforms & technology", href: "/insights#market-guides" },
  ] },
  { label: "About us", to: "/about", items: [
    { label: "Our story", href: "/about#our-story" }, { label: "How we research", href: "/about#research-methodology" }, { label: "Corrections", href: "/about#corrections" }, { label: "Contact", href: "/about#contact" },
  ] },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="font-display text-3xl whitespace-nowrap">
          Devin<span className="text-gold"> Forex</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {menu.map((m) => (
            <div key={m.label} className="group relative">
              <Link
                href={m.to}
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition hover:text-foreground ${pathname === m.to ? "text-primary" : "text-muted-foreground"}`}
                aria-current={pathname === m.to ? "page" : undefined}
              >
                {m.label}
                <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-0 top-full w-56 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-xl border bg-card p-2 shadow-glow">
                  {m.items.map((i) => (
                    <Link
                      key={i.label}
                      href={i.href}
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      {i.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Search className="hidden h-5 w-5 text-muted-foreground sm:block" />
          <UserCircle className="hidden h-5 w-5 text-muted-foreground sm:block" />
          <span className="hidden items-center gap-1 text-sm text-muted-foreground xl:flex">
            <Globe2 size={16} aria-hidden="true" /> Global · EN
          </span>
          <Link
            href="/find-my-broker"
            className="whitespace-nowrap rounded-full bg-gold px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Find my broker
          </Link>
        </div>
      </div>
      <nav
        aria-label="Mobile navigation"
        className="flex gap-4 overflow-x-auto px-6 pb-3 text-sm text-muted-foreground lg:hidden"
      >
        {menu.map((m) => (
          <Link
            key={m.label}
            href={m.to}
            className={`whitespace-nowrap ${pathname === m.to ? "text-primary" : ""}`}
            aria-current={pathname === m.to ? "page" : undefined}
          >
            {m.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t px-6 py-12 text-center text-xs text-muted-foreground">
      <p className="font-display text-2xl text-foreground">
        Devin<span className="text-gold"> Forex</span>
      </p>
      <p className="mx-auto mt-4 max-w-3xl">
        Risk warning: CFDs and forex are complex instruments with a high risk of
        losing money rapidly due to leverage. Only trade with money you can
        afford to lose. Future affiliate relationships will be disclosed. There
        are currently no active referral links.
      </p>
      <p className="mt-4">© 2026 Devin Forex</p>
    </footer>
  );
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
