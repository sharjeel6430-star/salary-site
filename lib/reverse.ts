// Work backwards from take-home pay to the gross salary needed.
import { calculate, type TaxInput } from "./tax.ts";

export function grossForTakeHome(targetAnnualNet: number, opts: Omit<TaxInput, "gross"> = {}): number {
  const target = Math.max(0, targetAnnualNet || 0);
  if (target === 0) return 0;
  let lo = 0;
  let hi = 5_000_000;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (calculate({ ...opts, gross: mid }).takeHome < target) lo = mid;
    else hi = mid;
  }
  return Math.ceil(hi); // smallest whole-pound salary that reaches the target
}

// Monthly take-home amounts that get their own page ("What salary is £3,000 a month after tax?").
export const MONTHLY_TARGETS: number[] = (() => {
  const set = new Set<number>();
  for (let m = 1200; m <= 3000; m += 100) set.add(m); // £100 steps where searches are most common
  for (let m = 1500; m <= 6000; m += 250) set.add(m);
  [7000, 8000, 10000].forEach((m) => set.add(m));
  return [...set].sort((a, b) => a - b);
})();

export const monthlyPath = (m: number) => `/take-home/${m}-a-month`;
