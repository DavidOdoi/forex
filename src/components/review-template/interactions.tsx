"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, CircleHelp, Globe2, X } from "lucide-react";
import type { BrokerReview, ReviewField } from "@/lib/reviews/types";
import { Finding } from "./finding";
import { useRouter } from "next/navigation";
export const sectionLinks = [
  ["key-data", "Key data"],
  ["fees", "Fees"],
  ["safety", "Safety"],
  ["deposit-and-withdrawal", "Deposit & withdrawal"],
  ["account-opening", "Account opening"],
  ["mobile-app", "Mobile app"],
  ["web-platform", "Web platform"],
  ["product-selection", "Products"],
  ["review-faq", "FAQ"],
  ["sources", "Sources"],
] as const;
export function ReviewNavigation() {
  const [active, setActive] = useState("key-data");
  useEffect(() => {
    const header = document.querySelector("body > header");
    const update = () =>
      document.documentElement.style.setProperty(
        "--review-header-height",
        `${header?.getBoundingClientRect().height ?? 70}px`,
      );
    update();
    const resize = new ResizeObserver(update);
    if (header) resize.observe(header);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-160px 0px -55% 0px", threshold: 0 },
    );
    for (const [id] of sectionLinks) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => {
      resize.disconnect();
      observer.disconnect();
      document.documentElement.style.removeProperty("--review-header-height");
    };
  }, []);
  return (
    <nav className="review-navigation" aria-label="Review sections">
      <div className="review-container">
        {sectionLinks.map(([id, label]) => (
          <a
            href={`#${id}`}
            key={id}
            aria-current={active === id ? "location" : undefined}
            onClick={() => setActive(id)}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
export function DisclosureButton({
  hasAffiliateLink = false,
}: {
  hasAffiliateLink?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        className="review-disclosure-link"
        type="button"
        onClick={() => ref.current?.showModal()}
      >
        <CircleHelp size={15} />
        Advertiser disclosure
      </button>
      <dialog
        className="review-dialog"
        ref={ref}
        aria-labelledby="review-disclosure-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
      >
        <div className="review-dialog-header">
          <h2 id="review-disclosure-title">Commercial transparency</h2>
          <button
            type="button"
            aria-label="Close advertiser disclosure"
            onClick={() => ref.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <p>
          {hasAffiliateLink
            ? "Account-opening links in this review may earn Devin Forex a commission. Commercial relationships do not establish a broker’s quality or suitability."
            : "No affiliate link or paid placement is active on this page. Account links remain inactive until configured and checked."}
        </p>
        <p>
          Any future commercial relationship will be disclosed alongside the
          relevant review. Compensation must not be presented as evidence of a
          broker’s quality.
        </p>
        <button
          className="review-button"
          type="button"
          onClick={() => ref.current?.close()}
        >
          Got it
        </button>
      </dialog>
    </>
  );
}
export function CountryScope({ current, countries = [], slug }: { current?: string | null; countries?: string[]; slug?: string }) {
  const [country, setCountry] = useState("");
  const router = useRouter();
  if (slug) return (
    <div className="review-country">
      <label htmlFor="review-country"><Globe2 size={16} />Country / entity profile</label>
      <div>
        <select id="review-country" value={current ?? ""} onChange={e => router.push(`/reviews/${slug}?country=${encodeURIComponent(e.target.value)}`)} disabled={!countries.length}>
          {!countries.length && <option value="">Country not yet established</option>}
          {countries.map(c => <option key={c}>{c}</option>)}
        </select>
        <ChevronDown size={15} />
      </div>
      <p role="status">{current ? `Showing the ${current} entity profile. Resident eligibility and account terms must be checked separately. Other countries’ terms are not applied.` : "Country and legal entity are still being researched. No resident eligibility is inferred."}</p>
    </div>
  );
  return (
    <div className="review-country">
      <label htmlFor="review-country">
        <Globe2 size={16} />
        Review market
      </label>
      <div>
        <select
          id="review-country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Select a country</option>
          {[
            "Kenya",
            "United Kingdom",
            "South Africa",
            "United States",
            "Australia",
            "Other markets",
          ].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <ChevronDown size={15} />
      </div>
      <p role="status">
        {country
          ? `${country}: eligibility, legal entity and protections still need verification.`
          : "Availability and terms must be verified for each country."}
      </p>
    </div>
  );
}
function DataTable({
  fields,
  review,
}: {
  fields: ReviewField[];
  review: BrokerReview;
}) {
  return (
    <table className="review-data-table">
      <thead>
        <tr>
          <th scope="col">Data point</th>
          <th scope="col">Verified finding</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((f) => (
          <tr key={f.id}>
            <th scope="row">{f.label}</th>
            <td><Finding field={f} review={review} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function KeyData({ review }: { review: BrokerReview }) {
  const [tab, setTab] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  return (
    <div className="review-data-card">
      <div
        role="tablist"
        aria-label="Broker data"
        className="review-data-tabs"
        onKeyDown={(e) => {
          let target = tab;
          if (e.key === "ArrowRight" || e.key === "ArrowLeft")
            target = (tab + 1) % 2;
          else if (e.key === "Home") target = 0;
          else if (e.key === "End") target = 1;
          else return;
          e.preventDefault();
          setTab(target);
          refs.current[target]?.focus();
        }}
      >
        {["Key data", "Benchmark fees"].map((label, i) => (
          <button
            key={label}
            id={`${id}-tab-${i}`}
            aria-controls={`${id}-panel-${i}`}
            role="tab"
            aria-selected={tab === i}
            tabIndex={tab === i ? 0 : -1}
            type="button"
            ref={(node) => {
              refs.current[i] = node;
            }}
            onClick={() => setTab(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {[0, 1].map((i) => (
        <div
          key={i}
          role="tabpanel"
          hidden={tab !== i}
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          tabIndex={0}
        >
          <DataTable
            fields={i === 0 ? review.keyData : review.benchmarks}
            review={review}
          />
        </div>
      ))}
      <div className="review-data-footnote">
        <CircleHelp size={15} />
        Every value needs a dated source and the applicable legal entity.
      </div>
    </div>
  );
}
export function ComparisonPreview() {
  const [metric, setMetric] = useState("Minimum deposit");
  return (
    <section className="review-comparison" aria-labelledby="comparison-title">
      <div className="review-overline">A CONSISTENT POINT OF COMPARISON</div>
      <h2 id="comparison-title">How does this broker compare?</h2>
      <p>Compare equivalent accounts and products in the same market.</p>
      <label className="review-field-label" htmlFor="comparison-metric">
        Compare by
      </label>
      <select
        id="comparison-metric"
        value={metric}
        onChange={(e) => setMetric(e.target.value)}
      >
        {[
          "Minimum deposit",
          "EUR/USD trading cost",
          "Withdrawal fee",
          "Currency conversion fee",
        ].map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>
      <div className="review-comparison-empty" role="status">
        <span className="review-comparison-symbol" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <strong>{metric}: no verified comparison yet</strong>
        <span>
          Add sourced values for this broker and selected peers to populate the
          comparison.
        </span>
      </div>
      <a className="review-inline-link" href="#sources">
        See the source requirements
        <ArrowUpRight size={15} />
      </a>
    </section>
  );
}
