import Link from "next/link";
export default function NotFound() { return <div className="container document not-found"><p className="eyebrow">404 · A MOMENT TO REORIENT</p><h1>Let’s find a clearer path.</h1><p className="document-lead">The page you’re looking for could not be found.</p><Link href="/" className="button primary">Back to home <span>→</span></Link></div>; }
