import { useEffect, useState } from "react";

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** 1d 23hr 14m 30s. Leading zero units are dropped (5hr 02m 09s, 4m 30s). */
export function formatTimeLeft(ms) {
  const d = Math.floor(ms / DAY);
  const h = Math.floor((ms % DAY) / HOUR);
  const m = Math.floor((ms % HOUR) / MIN);
  const s = Math.floor((ms % MIN) / SEC);
  const pad = (n) => String(n).padStart(2, "0");
  if (d) return `${d}d ${h}hr ${pad(m)}m ${pad(s)}s`;
  if (h) return `${h}hr ${pad(m)}m ${pad(s)}s`;
  return `${m}m ${pad(s)}s`;
}

/**
 * Live time left until `dueAt`, ticking every second.
 * Returns { ms, label, expired } or null when there is no deadline.
 */
export default function useCountdown(dueAt) {
  const target = dueAt ? new Date(dueAt).getTime() : null;
  const [now, setNow] = useState(Date.now());

  const left = target ? Math.max(0, target - now) : null;

  useEffect(() => {
    if (!target || left === 0) return undefined;
    const timer = setInterval(() => setNow(Date.now()), SEC);
    return () => clearInterval(timer);
  }, [target, left === 0]); // eslint-disable-line react-hooks/exhaustive-deps

  if (target === null || Number.isNaN(target)) return null;
  return { ms: left, label: formatTimeLeft(left), expired: left === 0 };
}
