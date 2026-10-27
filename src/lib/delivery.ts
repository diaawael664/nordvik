/**
 * Delivery-date estimate for the product page (demo logic).
 * Lead time is parsed from the product's `leadTime` text; transit time comes
 * from the first digit of a US ZIP code (distance from the Brooklyn warehouse).
 * Replace `transitDays` with your carrier's rates for real estimates.
 */

/** "Ships in 2–4 days" → [2, 4] business days. Returns null if no date can be given. */
export function leadBusinessDays(leadTime: string): [number, number] | null {
  const m = leadTime.match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*(day|week)/i);
  if (!m) return null;
  const perUnit = /week/i.test(m[3]) ? 5 : 1;
  const lo = Number(m[1]) * perUnit;
  const hi = Number(m[2] ?? m[1]) * perUnit;
  return [lo, hi];
}

/** Business days in transit from Brooklyn, by ZIP zone. */
export function transitDays(zip: string): [number, number] {
  const zone = Number(zip[0]);
  if (zone <= 2) return [1, 2];
  if (zone <= 6) return [2, 4];
  return [4, 6];
}

export const isZip = (v: string) => /^\d{5}$/.test(v.trim());

function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

/** Earliest and latest arrival dates, or null when the product has no fixed lead time. */
export function estimateArrival(leadTime: string, zip: string, today = new Date()) {
  const lead = leadBusinessDays(leadTime);
  if (!lead) return null;
  const transit = transitDays(zip);
  return [addBusinessDays(today, lead[0] + transit[0]), addBusinessDays(today, lead[1] + transit[1])] as const;
}
