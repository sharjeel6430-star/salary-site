// Company car tax (benefit in kind) for 2026/27.
// Appropriate percentages: HMRC Employment Income Manual EIM24705, "Tax year 2026 to 2027" table (WLTP; NEDC identical).
// Diesel supplement 4% unless the car meets RDE2, capped at the 37% maximum. Fuel benefit multiplier £29,200 (EIM25580).
// Capital contributions up to £5,000 reduce the list price; payments for private use reduce the benefit.
import { calculate, type Region } from "./tax.ts";

export const CAR_YEAR = "2026/27";
export const MAX_PCT = 37;
export const DIESEL_SUPPLEMENT = 4;
export const FUEL_MULTIPLIER = 29200;
export const CAPITAL_CONTRIBUTION_CAP = 5000;
export const CLASS_1A = 0.15;

export type FuelType = "electric" | "petrol" | "diesel-rde2" | "diesel";

export const FUEL_TYPES: { key: FuelType; label: string }[] = [
  { key: "electric", label: "Fully electric" },
  { key: "petrol", label: "Petrol, or any hybrid" },
  { key: "diesel-rde2", label: "Diesel that meets RDE2" },
  { key: "diesel", label: "Diesel that doesn't meet RDE2 (adds 4%)" },
];

// 1–50g/km: by electric-only range in miles.
export const RANGE_BANDS = [
  { min: 130, pct: 4, label: "130 miles or more" },
  { min: 70, pct: 7, label: "70 to 129 miles" },
  { min: 40, pct: 10, label: "40 to 69 miles" },
  { min: 30, pct: 14, label: "30 to 39 miles" },
  { min: 0, pct: 16, label: "under 30 miles" },
];

/** Appropriate percentage for 2026/27 before any diesel supplement. */
export function basePercent(co2: number, electricRange = 0): number {
  const g = Math.max(0, Math.floor(co2 || 0));
  if (g === 0) return 4;
  if (g <= 50) return RANGE_BANDS.find((b) => (electricRange || 0) >= b.min)!.pct;
  if (g <= 54) return 17;
  if (g <= 59) return 18;
  if (g <= 64) return 19;
  if (g <= 69) return 20;
  if (g <= 79) return 21; // 70–74 and 75–79 are both 21% in 2026/27
  return Math.min(MAX_PCT, 22 + Math.floor((g - 80) / 5));
}

export function appropriatePercent(fuel: FuelType, co2: number, electricRange = 0): number {
  if (fuel === "electric") return 4;
  const base = basePercent(co2, electricRange);
  return fuel === "diesel" ? Math.min(MAX_PCT, base + DIESEL_SUPPLEMENT) : base;
}

export interface CompanyCarInput {
  listPrice: number; // list price including VAT, delivery and options (the P11D value)
  fuel: FuelType;
  co2?: number; // g/km (ignored for fully electric)
  electricRange?: number; // miles, only matters for 1–50g/km
  salary: number; // other taxable pay for the year
  region?: Region;
  capitalContribution?: number; // one-off payment towards the car
  privateUsePayments?: number; // amount you pay your employer each year for private use
  monthsAvailable?: number; // 1–12
  freeFuel?: boolean; // employer pays for private fuel
}

export interface CompanyCarResult {
  percent: number;
  priceUsed: number;
  carBenefit: number;
  fuelBenefit: number;
  totalBenefit: number;
  taxYear: number;
  taxMonth: number;
  carTaxYear: number; // tax on the car alone
  fuelTaxYear: number; // extra tax from free fuel
  marginalRate: number; // effective rate the benefit is taxed at
  employerClass1A: number;
}

export function companyCarTax(input: CompanyCarInput): CompanyCarResult {
  const months = Math.min(12, Math.max(1, Math.round(input.monthsAvailable ?? 12)));
  const share = months / 12;
  const percent = appropriatePercent(input.fuel, input.co2 ?? 0, input.electricRange ?? 0);
  const priceUsed = Math.max(0, (input.listPrice || 0) - Math.min(CAPITAL_CONTRIBUTION_CAP, Math.max(0, input.capitalContribution || 0)));
  const carBenefit = Math.max(0, priceUsed * (percent / 100) * share - Math.max(0, input.privateUsePayments || 0));
  const fuelBenefit = input.freeFuel && input.fuel !== "electric" ? FUEL_MULTIPLIER * (percent / 100) * share : 0;
  const totalBenefit = carBenefit + fuelBenefit;

  const salary = Math.max(0, input.salary || 0);
  const region = input.region ?? "ruk";
  const tax = (g: number) => calculate({ gross: g, region, noNI: true }).incomeTax;
  const base = tax(salary);
  const carTaxYear = tax(salary + carBenefit) - base;
  const taxYear = tax(salary + totalBenefit) - base;

  return {
    percent,
    priceUsed,
    carBenefit,
    fuelBenefit,
    totalBenefit,
    taxYear,
    taxMonth: taxYear / 12,
    carTaxYear,
    fuelTaxYear: taxYear - carTaxYear,
    marginalRate: totalBenefit > 0 ? taxYear / totalBenefit : 0,
    employerClass1A: totalBenefit * CLASS_1A,
  };
}
