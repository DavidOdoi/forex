import { Arrow } from "@/components/arrow";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
export function Footer() { return <footer className="site-footer"><div className="container">
  <div className="footer-top"><div><Link href="/" className="brand"><Image src={site.logo} alt="" width={32} height={32}/>{site.name}</Link><p>A clearer perspective on trading services.</p></div><nav aria-label="Footer navigation">{site.footerLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav></div>
  <div className="footer-disclosures"><p><strong>Risk comes first.</strong> {site.disclaimer}</p><p><strong>Transparency matters.</strong> Future content may contain affiliate links. None are active in this foundation. <Link href="/affiliate-disclosure">Read our disclosure <Arrow/></Link></p></div>
  <div className="footer-bottom"><span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span><span>Information. Perspective. Informed decisions.</span></div>
  {site.socialLinks.length > 0 && <nav aria-label="Social links">{site.socialLinks.map(link => <a key={link.href} href={link.href} rel="noopener noreferrer">{link.label}</a>)}</nav>}
</div></footer>; }
