// UK university degree classification: credit-weighted module averages and year weightings.
// Boundaries are the standard UK honours scale. Individual universities add their own borderline rules.
export const CLASS_BOUNDARIES = [
  { min: 70, label: "First class (1st)", short: "First" },
  { min: 60, label: "Upper second (2:1)", short: "2:1" },
  { min: 50, label: "Lower second (2:2)", short: "2:2" },
  { min: 40, label: "Third class (3rd)", short: "Third" },
] as const;

export function classify(avg: number): { label: string; short: string } {
  const c = CLASS_BOUNDARIES.find((b) => avg >= b.min);
  return c ? { label: c.label, short: c.short } : { label: "Fail (below 40%)", short: "Fail" };
}

export interface Module {
  mark: number;
  credits: number;
}

// Credit-weighted average of the modules that have both a mark and credits. Null when nothing is entered.
export function weightedAverage(modules: Module[]): { average: number; credits: number } | null {
  const valid = modules.filter((m) => m.credits > 0 && m.mark >= 0 && m.mark <= 100);
  const credits = valid.reduce((s, m) => s + m.credits, 0);
  if (credits === 0) return null;
  return { average: valid.reduce((s, m) => s + m.mark * m.credits, 0) / credits, credits };
}

// Year weightings offered in the calculator: share of the final mark from the second year (the rest is final year).
export const WEIGHTINGS = [
  { second: 0.4, label: "40 / 60 (most common)" },
  { second: 1 / 3, label: "33 / 67" },
  { second: 0.3, label: "30 / 70" },
  { second: 0.25, label: "25 / 75" },
  { second: 0.5, label: "50 / 50" },
  { second: 0, label: "Final year only (0 / 100)" },
] as const;

export function overallAverage(secondYear: number, finalYear: number, secondWeight: number): number {
  const w = Math.min(1, Math.max(0, secondWeight));
  return secondYear * w + finalYear * (1 - w);
}

// Final-year average needed to reach a target overall mark. Null if the final year carries no weight.
export function requiredFinalYear(secondYear: number, secondWeight: number, target: number): number | null {
  const w = Math.min(1, Math.max(0, secondWeight));
  if (w >= 1) return null;
  return (target - secondYear * w) / (1 - w);
}
