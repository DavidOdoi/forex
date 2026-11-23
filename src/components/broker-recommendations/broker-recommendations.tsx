"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useEffect, useId, useState, useSyncExternalStore, type CSSProperties } from "react";
import { brokerRecommendations, countryCode, countryOptions, type BrokerRecommendationsData } from "@/lib/broker-recommendations/model";
import styles from "./broker-recommendations.module.css";

const preferenceKey = "devin-forex-broker-country";
const preferenceEvent = "devin-forex-country-change";
let memoryPreference: string | null = null;
function savedCountry() {
  try { return countryCode(memoryPreference ?? sessionStorage.getItem(preferenceKey)) ?? ""; } catch { return countryCode(memoryPreference) ?? ""; }
}
function subscribe(callback: () => void) { window.addEventListener(preferenceEvent, callback); return () => window.removeEventListener(preferenceEvent, callback); }
function chooseCountry(value: string) {
  memoryPreference = countryCode(value) ?? "";
  try { if (memoryPreference) sessionStorage.setItem(preferenceKey, memoryPreference); else sessionStorage.removeItem(preferenceKey); } catch { /* Manual choice still works when storage is unavailable. */ }
  window.dispatchEvent(new Event(preferenceEvent));
}
const neutral = brokerRecommendations(null, "unavailable", "2026-11-23");
const hydrationSubscribe = () => () => {};
const cache = new Map<string, { data: BrokerRecommendationsData; expires: number }>();
const inflight = new Map<string, Promise<BrokerRecommendationsData>>();
function load(country: string) {
  const existing = cache.get(country);
  if (existing && existing.expires > Date.now()) return Promise.resolve(existing.data);
  const running = inflight.get(country);
  if (running) return running;
  const promise = fetch(`/api/broker-recommendations${country ? `?country=${country}` : ""}`, { cache: "no-store", signal: AbortSignal.timeout(5000) }).then(async response => {
    if (!response.ok) throw new Error("Country suggestions unavailable");
    const data = await response.json() as BrokerRecommendationsData;
    if (!Array.isArray(data.brokers) || !["regional", "research", "neutral", "guidance"].includes(data.mode)) throw new Error("Invalid suggestions");
    cache.set(country, { data, expires: Date.now() + 5 * 60000 });
    return data;
  }).finally(() => inflight.delete(country));
  inflight.set(country, promise);
  return promise;
}

export function BrokerRecommendations({ excludeBroker }: { excludeBroker?: string }) {
  const selected = useSyncExternalStore(subscribe, savedCountry, () => "");
  return <CountryBrokerPanel key={selected} selected={selected} excludeBroker={excludeBroker} />;
}

function CountryBrokerPanel({ selected, excludeBroker }: { selected: string; excludeBroker?: string }) {
  const id = useId();
  const hydrated = useSyncExternalStore(hydrationSubscribe, () => true, () => false);
  const [data, setData] = useState<BrokerRecommendationsData>(neutral);
  useEffect(() => {
    let active = true;
    void load(selected).then(result => { if (active) setData(result); }).catch(() => {
      if (active) {
        const fallback = selected ? brokerRecommendations(selected, "selected") : neutral;
        setData({ ...fallback, mode: fallback.mode === "regional" ? "research" : fallback.mode, brokers: fallback.brokers.map(broker => ({ ...broker, offer: null })) });
      }
    });
    return () => { active = false; };
  }, [selected]);
  // A failed automatic lookup never becomes a fabricated local offer. A
  // selected-country fallback preserves the research subjects but drops CTAs.
  const brokers = data.brokers.filter(broker => broker.slug !== excludeBroker);
  const local = data.mode === "regional" || data.mode === "research";
  return <aside className={styles.panel} data-broker-discovery data-nosnippet data-country={data.country ?? "unknown"} data-mode={data.mode} aria-labelledby={`${id}-title`}>
    <header className={styles.heading}>
      <h2 id={`${id}-title`}>{data.mode === "guidance" ? "Check your country’s broker rules" : local && data.countryName ? `Brokers to compare in ${data.countryName}` : "Explore reviewed brokers"}</h2>
      <label className={styles.country}><MapPin size={16} aria-hidden="true" /><span className={styles.srOnly}>Your country of residence</span><select aria-label="Your country of residence" disabled={!hydrated} value={selected || "auto"} onChange={event => chooseCountry(event.target.value === "auto" ? "" : event.target.value)}><option value="auto">{data.source === "automatic" && data.countryName ? `Automatic: ${data.countryName}` : "Detect country automatically"}</option>{hydrated && countryOptions.map(([code, name]) => <option value={code} key={code}>{name}</option>)}</select></label>
    </header>
    <p className={styles.location} aria-live="polite">{data.source === "automatic" ? "Approximate browsing country; change it if your residence differs." : selected ? "Using your selected country of residence." : "Choose your residence if automatic country detection is unavailable."}</p>
    {data.mode === "guidance" ? <div className={styles.guidance}><p>Local trading or funding rules need checking before choosing an offshore account. We aren’t presenting an account offer for this country.</p>{data.guide && <Link href={data.guide}>Read the country guide <ArrowUpRight size={16} aria-hidden="true" /></Link>}</div> : <div className={styles.cards} style={{ "--broker-columns": Math.max(1, brokers.length) } as CSSProperties}>{brokers.map(broker => <div className={styles.card} key={broker.slug}>
      <span className={styles.mark} aria-hidden="true">{broker.mark}</span>
      <div className={styles.broker}><strong>{broker.name}</strong><span>{broker.focus}</span><Link href={broker.reviewUrl}>Read review</Link></div>
      {broker.offer ? <a className={styles.cta} href={broker.offer.url} target="_blank" rel="nofollow noopener noreferrer" aria-label={`${broker.offer.action} — ${broker.name}, ${data.countryName} regional site`} data-country-broker-cta>{broker.offer.action}<ArrowUpRight size={16} aria-hidden="true" /></a> : <Link className={styles.reviewCta} href={broker.reviewUrl} aria-label={`Research ${broker.name}`}>Review<ArrowUpRight size={16} aria-hidden="true" /></Link>}
    </div>)}</div>}
    <footer className={styles.footer}>
      <span>Official links · no affiliate tracking.</span>
      {data.guide && data.mode !== "guidance" && <Link href={data.guide}>Country research</Link>}
      <Link href="/reviews">All broker reviews</Link>
      <details><summary>How these are selected</summary><p>Only brokers in our review library appear. Country guides supply research shortlists; regional account links require a dated check of the official regional offer. This is not a personal recommendation or proof of eligibility.</p>{brokers.some(broker => broker.offer) && <ul>{brokers.filter(broker => broker.offer).map(broker => <li key={broker.slug}><a href={broker.offer!.sourceUrl} target="_blank" rel="noopener noreferrer">{broker.name} regional source</a> · checked {broker.offer!.checkedAt}</li>)}</ul>}<p>Approximate country comes from Vercel’s request header. No GPS request or third-party location service is used. A manual choice is remembered in this tab. <Link href="/about#country-suggestions">Location and selection policy</Link>.</p></details>
    </footer>
    <p className={styles.risk}>{data.mode === "research" ? "Country eligibility is not confirmed by this shortlist. " : data.mode === "neutral" && data.countryName ? "No country-specific shortlist is confirmed. " : ""}Leveraged forex and CFDs can cause substantial losses. Check residence, fees and the company in your agreement.</p>
  </aside>;
}
