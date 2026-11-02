"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import { site } from "@/lib/site";
export function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const links = site.navigation.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      aria-current={pathname === link.href ? "page" : undefined}
      onClick={() => setOpen(false)}
    >
      {link.label}
    </Link>
  ));
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <div className="utility-bar">
        <div className="container">
          <span>
            <span className="status-dot" />A clearer perspective on forex
          </span>
          <Link href="/editorial-standards">
            Our commitment to you <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={`${site.name} home`}>
          <Image src={site.logo} alt="" width={35} height={35} priority />
          <span>
            {site.name}
            <small>KNOWLEDGE. BEFORE THE TRADE.</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links}
        </nav>
        <Link href="/learn" className="button header-cta">
          Start learning <Icon name="arrow" size={14} />
        </Link>
        <button
          ref={button}
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span
            className={`menu-lines ${open ? "is-open" : ""}`}
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {links}
        <Link href="/methodology" onClick={() => setOpen(false)}>
          Our methodology
        </Link>
        <Link href="/faq" onClick={() => setOpen(false)}>
          Frequently asked questions
        </Link>
      </nav>
    </header>
  );
}
