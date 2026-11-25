// Electric car (and low-emission plug-in hybrid) salary sacrifice — tax year 2026/27.
// Benefit-in-kind appropriate percentages: HMRC Employment Income Manual EIM24705 (2026 to 2027 table).
// Cars with CO2 of 75g/km or less are exempt from the optional remuneration (OpRA) rules,
// so the taxable benefit is the normal BIK (list price × appropriate %), not the amount sacrificed.
import { calculate, type Region, type StudentPlan, type TaxResult } from "./tax.ts";
import { MIN_WAGE } from "./site.ts";

export const BIK_YEAR = "2026/27";

export const CAR_TYPES = [
  { key: "ev", label: "Fully electric (0g/km)", pct: 0.04 },
  { key: "phev130", label: "Plug-in hybrid, 1–50g/km, 130+ miles electric range", pct: 0.04 },
  { key: "phev70", label: "Plug-in hybrid, 1–50g/km, 70–129 miles", pct: 0.07 },
  { key: "phev40", label: "Plug-in hybrid, 1–50g/km, 40–69 miles", pct: 0.1 },
  { key: "phev30", label: "Plug-in hybrid, 1–50g/km, 30–39 miles", pct: 0.14 },
  { key: "phev0", label: "Plug-in hybrid, 1–50g/km, under 30 miles", pct: 0.16 },
] as const;

export type CarType = (typeof CAR_TYPES)[number]["key"];

// Zero-emission BIK rates already announced for later years (shown on the page for context).
export const EV_BIK_FUTURE = [
  { year: "2025/26", pct: 0.03 },
  { year: "2026/27", pct: 0.04 },
  { year: "2027/28", pct: 0.05 },
  { year: "2028/29", pct: 0.07 },
  { year: "2029/30", pct: 0.09 },
];

export interface EvInput {
  salary: number; // annual gross salary before the car
  monthlySacrifice: number; // gross monthly amount sacrificed for the car (lease, insurance, maintenance)
  listPrice: number; // P11D value
  carType?: CarType;
  region?: Region;
  studentPlan?: StudentPlan;
  hoursPerWeek?: number;
}

export interface EvResult {
  before: TaxResult;
  after: TaxResult; // on the reduced salary, before BIK tax
  annualSacrifice: number;
  bikPercent: number;
  bikValue: number; // taxable benefit
  bikTax: number; // extra Income Tax because of the benefit
  netCostYear: number; // fall in take-home pay, including BIK tax
  netCostMonth: number;
  personalLeaseYear: number; // paying the same lease out of take-home pay
  savingYear: number;
  savingPercent: number;
  taxSaved: number;
  niSaved: number;
  loanSaved: number;
  employerNISaved: number;
  belowMinimumWage: boolean;
}

export function evSacrifice(input: EvInput): EvResult {
  const salary = Math.max(0, input.salary || 0);
  const annualSacrifice = Math.min(salary, Math.max(0, input.monthlySacrifice || 0) * 12);
  const type = CAR_TYPES.find((c) => c.key === (input.carType ?? "ev")) ?? CAR_TYPES[0];
  const bikValue = Math.max(0, input.listPrice || 0) * type.pct;
  const base = { region: input.region ?? "ruk", studentPlan: input.studentPlan ?? "none" } as const;

  const before = calculate({ gross: salary, ...base });
  const reduced = salary - annualSacrifice;
  const after = calculate({ gross: reduced, ...base });
  // The benefit counts for Income Tax (and the Personal Allowance taper) but not employee NI or student loans.
  const withBik = calculate({ gross: reduced + bikValue, ...base });
  const bikTax = Math.max(0, withBik.incomeTax - after.incomeTax);

  const netCostYear = before.takeHome - (after.takeHome - bikTax);
  const personalLeaseYear = annualSacrifice;
  const savingYear = personalLeaseYear - netCostYear;
  const hours = input.hoursPerWeek && input.hoursPerWeek > 0 ? input.hoursPerWeek : 37.5;

  return {
    before,
    after,
    annualSacrifice,
    bikPercent: type.pct,
    bikValue,
    bikTax,
    netCostYear,
    netCostMonth: netCostYear / 12,
    personalLeaseYear,
    savingYear,
    savingPercent: personalLeaseYear > 0 ? savingYear / personalLeaseYear : 0,
    taxSaved: before.incomeTax - withBik.incomeTax,
    niSaved: before.nationalInsurance - after.nationalInsurance,
    loanSaved: before.studentLoan - after.studentLoan,
    employerNISaved: before.employerNI - after.employerNI,
    belowMinimumWage: reduced > 0 && reduced / 52 / hours < MIN_WAGE.nlw,
  };
}
