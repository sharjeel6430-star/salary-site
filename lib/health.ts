// BMI, daily energy (BMR and TDEE) and step-to-distance estimates.
// BMI ranges are the NHS adult ranges. BMR uses the Mifflin-St Jeor equation. All results are estimates.
export type Sex = "male" | "female";

export const KG_PER_STONE = 6.35029318;
export const KG_PER_LB = 0.45359237;
export const CM_PER_INCH = 2.54;
export const METRES_PER_MILE = 1609.344;

export const stonesToKg = (stones: number, lb = 0) => (stones || 0) * KG_PER_STONE + (lb || 0) * KG_PER_LB;
export const feetToCm = (feet: number, inches = 0) => ((feet || 0) * 12 + (inches || 0)) * CM_PER_INCH;
export function kgToStones(kg: number): { stones: number; lb: number } {
  const totalLb = kg / KG_PER_LB;
  let stones = Math.floor(totalLb / 14);
  let lb = Math.round(totalLb - stones * 14);
  if (lb === 14) {
    stones += 1;
    lb = 0;
  }
  return { stones, lb };
}

// ---------- BMI ----------
export const bmi = (kg: number, cm: number) => (kg > 0 && cm > 0 ? kg / Math.pow(cm / 100, 2) : 0);

export type BmiCategory = "Underweight" | "Healthy weight" | "Overweight" | "Obese" | "Severely obese";

// NHS adult ranges. For Asian, Black African, African-Caribbean and Middle Eastern backgrounds the NHS uses
// lower thresholds for overweight (23) and obesity (27.5).
export function bmiCategory(value: number, lowerThresholds = false): BmiCategory {
  const over = lowerThresholds ? 23 : 25;
  const obese = lowerThresholds ? 27.5 : 30;
  if (value < 18.5) return "Underweight";
  if (value < over) return "Healthy weight";
  if (value < obese) return "Overweight";
  if (value < 40) return "Obese";
  return "Severely obese";
}

export function healthyWeightRange(cm: number, lowerThresholds = false): { minKg: number; maxKg: number } {
  const m2 = Math.pow(cm / 100, 2);
  return { minKg: 18.5 * m2, maxKg: (lowerThresholds ? 23 : 25) * m2 };
}

// ---------- BMR and TDEE ----------
export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", description: "Desk job, little exercise", factor: 1.2 },
  { id: "light", label: "Lightly active", description: "Light exercise 1 to 3 days a week", factor: 1.375 },
  { id: "moderate", label: "Moderately active", description: "Exercise 3 to 5 days a week", factor: 1.55 },
  { id: "very", label: "Very active", description: "Hard exercise 6 to 7 days a week", factor: 1.725 },
  { id: "extra", label: "Extra active", description: "Physical job plus training", factor: 1.9 },
] as const;
export type ActivityId = (typeof ACTIVITY_LEVELS)[number]["id"];

// Mifflin-St Jeor: 10 x kg + 6.25 x cm - 5 x age, +5 for men, -161 for women.
export function bmr(opts: { sex: Sex; kg: number; cm: number; age: number }): number {
  if (!(opts.kg > 0) || !(opts.cm > 0) || !(opts.age > 0)) return 0;
  return 10 * opts.kg + 6.25 * opts.cm - 5 * opts.age + (opts.sex === "male" ? 5 : -161);
}

export function tdee(opts: { sex: Sex; kg: number; cm: number; age: number; activity: ActivityId }): { bmr: number; tdee: number } {
  const b = bmr(opts);
  const f = ACTIVITY_LEVELS.find((a) => a.id === opts.activity)?.factor ?? 1.2;
  return { bmr: b, tdee: b * f };
}

// ---------- Steps ----------
// Walking stride is estimated as height x 0.413 (women) or 0.415 (men); running as height x 0.65.
export function strideMetres(cm: number, sex: Sex, pace: "walk" | "run" = "walk"): number {
  if (!(cm > 0)) return 0;
  const factor = pace === "run" ? 0.65 : sex === "male" ? 0.415 : 0.413;
  return (cm / 100) * factor;
}

export function stepsToDistance(steps: number, strideM: number): { metres: number; km: number; miles: number; stepsPerMile: number } {
  const metres = Math.max(0, steps || 0) * Math.max(0, strideM || 0);
  return { metres, km: metres / 1000, miles: metres / METRES_PER_MILE, stepsPerMile: strideM > 0 ? METRES_PER_MILE / strideM : 0 };
}

export const milesToSteps = (miles: number, strideM: number) => (strideM > 0 ? (Math.max(0, miles || 0) * METRES_PER_MILE) / strideM : 0);
