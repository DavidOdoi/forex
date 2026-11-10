"use client";
import { useSyncExternalStore } from "react";
import { dateAt } from "@/lib/market-hours/time";

// One ticker, regardless of subscriber count. Only live cards and the marker
// subscribe; the planner and editorial page do not render on every second.
let now: number | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();
function publish() { now = Date.now(); for (const listener of listeners) listener(); }
function resume() {
  if (timer !== undefined) clearInterval(timer);
  timer = undefined;
  publish();
  if (document.visibilityState !== "hidden") timer = setInterval(publish, 1000);
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    resume();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(timer); timer = undefined; now = null;
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
    }
  };
}
export function useClock() { return useSyncExternalStore(subscribe, () => now, () => null); }
export function useClockDate(zone: string) { return useSyncExternalStore(subscribe, () => now === null ? null : dateAt(now, zone), () => null); }
