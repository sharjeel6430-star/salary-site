// Child Benefit and the High Income Child Benefit Charge (HICBC).
// Sources: GOV.UK "Child Benefit: what you'll get" and "High Income Child Benefit Charge".
// The charge is 1% of the Child Benefit for every £200 of adjusted net income over £60,000 (percentage rounded down),
// so it takes back all of it at £80,000. It is paid by the partner with the higher adjusted net income.
import { calculate, type Region, type TaxYearKey } from "./tax.ts";

export const CB_RATES: Record<TaxYearKey, { eldest: number; other: number }> = {
  "2026/27": { eldest: 27.05, other: 17.9 },
  "2025/26": { eldest: 26.05, other: 17.25 },
};

export const HICBC = { threshold: 60000, upper: 80000, step: 200 };

export function childBenefitWeekly(children: number, year: TaxYearKey = "2026/27") {
  const n = Math.max(0, Math.floor(children || 0));
  if (n === 0) return 0;
  const r = CB_RATES[year];
  return r.eldest + r.other * (n - 1);
}

// Yearly Child Benefit. A Child Benefit week starts on a Monday (ITEPA 2003 s681H), and in 2026/27
// both 6 April 2026 and 5 April 2027 are Mondays, so the year has 53 weekly payments, not 52
// (HMRC's own Child Benefit tax calculator gives £2,382.35 for two children in 2026/27).
// 2025/26 has 52 weeks. Corrected in v22 (2026-11-24).
export const CB_WEEKS: Record<TaxYearKey, number> = { "2026/27": 53, "2025/26": 52 };

export const childBenefitYearly = (children: number, year: TaxYearKey = "2026/27") =>
  Math.round(childBenefitWeekly(children, year) * CB_WEEKS[year] * 100) / 100;

export function hicbcPercent(adjustedNetIncome: number) {
  if (!(adjustedNetIncome > HICBC.threshold)) return 0;
  return Math.min(100, Math.floor((adjustedNetIncome - HICBC.threshold) / HICBC.step));
}

// The charge is rounded down to whole pounds, and the benefit it is charged on is first rounded
// down to whole pounds (ITEPA 2003 s681C): at 100% the charge equals the floored benefit, so a few
// pence of benefit survive (e.g. two children at £80,000: charge £2,382, £0.35 kept).
export function hicbcCharge(adjustedNetIncome: number, benefit: number) {
  const b = Math.floor(Math.max(0, benefit));
  const p = hicbcPercent(adjustedNetIncome);
  return p >= 100 ? b : Math.floor((b * p) / 100);
}

export interface ChildBenefitInput {
  income: number; // higher earner's gross income (salary, bonus, other taxable income)
  pensionPercent?: number; // pension contributions as % of income (reduce adjusted net income)
  giftAid?: number; // gross Gift Aid donations (also reduce adjusted net income)
  children: number;
  year?: TaxYearKey;
  region?: Region;
}

export interface ChildBenefitResult {
  benefit: number; // yearly Child Benefit
  adjustedNetIncome: number;
  percent: number;
  charge: number;
  kept: number;
  pensionToAvoid: number; // extra gross pension contribution that removes the charge
  marginalRate: number; // effective rate on the next £100 in the £60k–£80k range, incl. tax, NI and the charge
}

export function childBenefitCharge(input: ChildBenefitInput): ChildBenefitResult {
  const year = input.year ?? "2026/27";
  const income = Math.max(0, input.income || 0);
  const pension = (income * Math.min(100, Math.max(0, input.pensionPercent ?? 0))) / 100;
  const ani = Math.max(0, income - pension - Math.max(0, input.giftAid || 0));
  const benefit = childBenefitYearly(input.children, year);
  const percent = hicbcPercent(ani);
  const charge = hicbcCharge(ani, benefit);

  // Marginal rate: tax + NI + extra charge on £200 more income, divided by £200 (one charge step).
  const region = input.region ?? "ruk";
  const base = calculate({ gross: ani, region, year });
  const more = calculate({ gross: ani + 200, region, year });
  const extra = more.incomeTax + more.nationalInsurance - base.incomeTax - base.nationalInsurance + (hicbcCharge(ani + 200, benefit) - charge);

  return {
    benefit,
    adjustedNetIncome: ani,
    percent,
    charge,
    kept: benefit - charge,
    pensionToAvoid: Math.max(0, ani - HICBC.threshold),
    marginalRate: extra / 200,
  };
}
