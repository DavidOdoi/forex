import type { Broker } from "@/lib/brokers";
import Link from "next/link";

export function BrokerCard({ b, reviewHref }: { b: Broker; reviewHref?: string }) {
  return (
    <article className="group rounded-2xl border bg-card p-8 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent">
            {b.tag}
          </span>
          <h3 className="mt-2 font-display text-4xl">{b.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{b.reg}</p>
        </div>
        <span className="text-sm text-muted-foreground">Not rated</span>
      </div>
      <dl className="mt-8 grid grid-cols-3 gap-4 border-y py-6 text-center">
        <div>
          <dt className="text-xs text-muted-foreground">Spread from</dt>
          <dd className="mt-1 text-base font-semibold">{b.spread}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Min deposit</dt>
          <dd className="mt-1 text-base font-semibold">{b.min}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Leverage</dt>
          <dd className="mt-1 text-base font-semibold">{b.lev}</dd>
        </div>
      </dl>
      {reviewHref ? <Link
        href={reviewHref}
        className="mt-6 block rounded-full bg-gold py-4 text-center font-semibold text-primary-foreground transition group-hover:scale-[1.02]"
      >
        Read the {b.name} review →
      </Link> : <p className="mt-6 rounded-full border py-4 text-center font-semibold text-muted-foreground">Review in preparation</p>}
    </article>
  );
}
