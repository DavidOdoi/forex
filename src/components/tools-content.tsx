"use client";
import { useState } from "react";
import { PageHero } from "@/components/site-header";

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block text-sm text-muted-foreground">
      {label}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-lg border bg-input px-4 py-3 text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-6 rounded-xl bg-secondary p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-gold mt-1 font-display text-4xl">{value}</p>
    </div>
  );
}

export default function Page() {
  const [lots, setLots] = useState(1);
  const [balance, setBalance] = useState(1000);
  const [risk, setRisk] = useState(2);
  const [sl, setSl] = useState(20);
  const [pips, setPips] = useState(30);
  const [plLots, setPlLots] = useState(0.5);
  const pipValue = lots * 10; // USD-quoted pairs
  const size = sl > 0 ? (balance * (risk / 100)) / (sl * 10) : 0;

  return (
    <main>
      <PageHero
        eyebrow="Free tools"
        title="Calculate before you"
        accent="trade"
        text="Simple calculators for USD-quoted pairs like EUR/USD and GBP/USD."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-28 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-8">
          <h2 className="mb-6 font-display text-3xl">Pip calculator</h2>
          <Field label="Lot size" value={lots} onChange={setLots} />
          <Result label="Value per pip" value={`$${pipValue.toFixed(2)}`} />
        </div>
        <div className="rounded-2xl border bg-card p-8">
          <h2 className="mb-6 font-display text-3xl">Position size</h2>
          <div className="space-y-4">
            <Field
              label="Account balance ($)"
              value={balance}
              onChange={setBalance}
            />
            <Field label="Risk (%)" value={risk} onChange={setRisk} />
            <Field label="Stop loss (pips)" value={sl} onChange={setSl} />
          </div>
          <Result label="Lot size" value={size.toFixed(2)} />
        </div>
        <div className="rounded-2xl border bg-card p-8">
          <h2 className="mb-6 font-display text-3xl">Profit calculator</h2>
          <div className="space-y-4">
            <Field label="Lot size" value={plLots} onChange={setPlLots} />
            <Field label="Pips gained / lost" value={pips} onChange={setPips} />
          </div>
          <Result
            label="Profit / loss"
            value={`$${(plLots * 10 * pips).toFixed(2)}`}
          />
        </div>
      </section>
    </main>
  );
}
