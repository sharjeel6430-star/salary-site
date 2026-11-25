import { MIN_WAGE } from "./site.ts";

// Hourly rates with their own "£X an hour is how much a year" page.
export const HOURLY_RATES: number[] = (() => {
  const set = new Set<number>([MIN_WAGE.age16to17, MIN_WAGE.age18to20, MIN_WAGE.nlw]);
  for (let r = 11; r <= 30; r += 0.5) set.add(r);
  // £13.21 is the National Living Wage from April 2027.
  [10, 13.21, 31, 32, 33, 35, 40, 45, 50, 60, 75, 100].forEach((r) => set.add(r));
  return [...set].sort((a, b) => a - b);
})();

// 12.71 -> "12-71-an-hour", 15 -> "15-an-hour", 15.5 -> "15-50-an-hour"
export const hourlySlug = (r: number) =>
  `${Number.isInteger(r) ? String(r) : r.toFixed(2).replace(".", "-")}-an-hour`;

export function parseHourlySlug(slug: string): number | null {
  const m = /^(\d{1,3})(?:-(\d{2}))?-an-hour$/.exec(slug);
  if (!m) return null;
  const v = Number(`${m[1]}.${m[2] ?? "00"}`);
  return v >= 5 && v <= 500 ? v : null;
}

export const hourlyPath = (r: number) => `/hourly/${hourlySlug(r)}`;
