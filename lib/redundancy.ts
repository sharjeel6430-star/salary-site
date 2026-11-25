// Statutory redundancy pay (Employment Rights Act 1996, sections 162 and 227).
// Source: GOV.UK "Redundancy pay" and the Employment Rights (Increase of Limits) Order 2026.
// For redundancies on or after 6 April 2026 a week's pay is capped at £751 (England, Scotland and Wales)
// and £783 (Northern Ireland). Only the last 20 full years of service count, and you need 2 years to qualify.
import { calculate, type Region } from "./tax.ts";

export const REDUNDANCY = {
  from: "6 April 2026",
  weeklyCap: { gb: 751, ni: 783 },
  maxYears: 20,
  minYears: 2,
  taxFree: 30000, // first £30,000 of a termination payment is free of Income Tax and NI
};

export type Nation = "gb" | "ni";

export interface RedundancyInput {
  age: number; // age at the date of redundancy
  years: number; // full years of continuous service
  weeklyPay: number; // gross weekly pay before tax
  nation?: Nation;
}

export interface RedundancyYear {
  ageDuring: number; // age at the start of that year of service
  weeks: number;
}

export interface RedundancyResult {
  eligible: boolean;
  yearsCounted: number;
  weeks: number; // total weeks' pay
  weeklyPayUsed: number; // after the cap
  capped: boolean;
  pay: number;
  breakdown: RedundancyYear[];
}

// 0.5 week for each full year in which you were under 22, 1 week for each full year aged 22 to 40,
// 1.5 weeks for each full year aged 41 or over. Years are counted back from the redundancy date.
export function statutoryRedundancy(input: RedundancyInput): RedundancyResult {
  const age = Math.floor(Math.max(0, input.age || 0));
  // Service can't start before 16, so cap the years at age − 16.
  const years = Math.max(0, Math.min(Math.floor(input.years || 0), Math.max(0, age - 16)));
  const cap = REDUNDANCY.weeklyCap[input.nation ?? "gb"];
  const weeklyPay = Math.max(0, input.weeklyPay || 0);
  const weeklyPayUsed = Math.min(weeklyPay, cap);
  const eligible = years >= REDUNDANCY.minYears;
  const yearsCounted = eligible ? Math.min(years, REDUNDANCY.maxYears) : 0;

  const breakdown: RedundancyYear[] = [];
  for (let i = 0; i < yearsCounted; i++) {
    const ageDuring = age - i - 1; // a full year that started when you were this age
    breakdown.push({ ageDuring, weeks: ageDuring >= 41 ? 1.5 : ageDuring >= 22 ? 1 : 0.5 });
  }
  const weeks = breakdown.reduce((s, y) => s + y.weeks, 0);
  return {
    eligible,
    yearsCounted,
    weeks,
    weeklyPayUsed,
    capped: weeklyPay > cap,
    pay: Math.round(weeks * weeklyPayUsed * 100) / 100,
    breakdown,
  };
}

// Tax on a redundancy package: the first £30,000 is tax-free; any excess is taxed as income in the year it is paid.
// Estimated as the extra Income Tax on top of the year's salary (no employee NI is due on the excess).
export function redundancyTax(opts: { total: number; salaryThisYear: number; region?: Region }) {
  const total = Math.max(0, opts.total || 0);
  const taxable = Math.max(0, total - REDUNDANCY.taxFree);
  if (taxable === 0) return { taxable: 0, tax: 0, net: total };
  const region = opts.region ?? "ruk";
  const base = calculate({ gross: Math.max(0, opts.salaryThisYear || 0), region });
  const withPay = calculate({ gross: Math.max(0, opts.salaryThisYear || 0) + taxable, region });
  const tax = Math.max(0, withPay.incomeTax - base.incomeTax);
  return { taxable, tax, net: total - tax };
}
