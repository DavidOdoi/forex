import type { Broker } from "@/lib/brokers";

export function BrokerCard({ b, rank }: { b: Broker; rank: number }) {
  return (
    <article className="group rounded-2xl border bg-card p-8 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent">
            #{rank} · {b.tag}
          </span>
          <h3 className="mt-2 font-display text-4xl">{b.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{b.reg}</p>
        </div>
        <span className="text-gold text-3xl font-bold">★ {b.rating}</span>
      </div>
      <dl className="mt-8 grid grid-cols-3 gap-4 border-y py-6 text-center">
        <div>
          <dt className="text-xs text-muted-foreground">Spread from</dt>
          <dd className="mt-1 text-xl font-semibold">{b.spread} pips</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Min deposit</dt>
          <dd className="mt-1 text-xl font-semibold">{b.min}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Leverage</dt>
          <dd className="mt-1 text-xl font-semibold">{b.lev}</dd>
        </div>
      </dl>
      <a
        href={b.url}
        target="_blank"
        rel="sponsored noopener"
        className="mt-6 block rounded-full bg-gold py-4 text-center font-semibold text-primary-foreground transition group-hover:scale-[1.02]"
      >
        Open account at {b.name} →
      </a>
    </article>
  );
}
