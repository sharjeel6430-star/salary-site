// Workplace pension projection, in today's money.
// Sources: GOV.UK "Workplace pensions: what you, your employer and the government pay" (2026/27 qualifying earnings
// £6,240 to £50,270, minimum 8% with at least 3% from the employer) and GOV.UK "The new State Pension" (£241.30 a week
// in 2026/27). Lump Sum Allowance £268,275 (GOV.UK "Tax on your private pension").
import { calculate, type Region } from "./tax.ts";

export const PENSION = {
  qualifyingLower: 6240,
  qualifyingUpper: 50270,
  autoEnrolTrigger: 10000,
  minTotal: 0.08,
  minEmployer: 0.03,
  statePensionWeekly: 241.3,
  lumpSumAllowance: 268275,
  annualAllowance: 60000,
  minimumPensionAge: 55, // rising to 57 from 6 April 2028
};

export const STATE_PENSION_YEARLY = Math.round(PENSION.statePensionWeekly * 52 * 100) / 100; // £12,547.60

export type Basis = "full" | "qualifying";

export const pensionableEarnings = (salary: number, basis: Basis) =>
  basis === "full"
    ? Math.max(0, salary)
    : Math.max(0, Math.min(salary, PENSION.qualifyingUpper) - PENSION.qualifyingLower);

export interface PensionInput {
  age: number;
  retireAge: number;
  salary: number;
  employeePct: number; // %
  employerPct: number; // %
  basis?: Basis;
  currentPot?: number;
  growthPct?: number; // investment growth after inflation and charges, % a year
  salaryGrowthPct?: number; // pay rises above inflation, % a year
  withdrawalPct?: number; // drawdown rate used to estimate income, % a year
  statePension?: boolean;
  region?: Region;
}

export interface PensionYear {
  age: number;
  contributions: number;
  pot: number;
}

export interface PensionResult {
  years: number;
  pot: number;
  totalContributions: number; // employee + employer, before growth
  growth: number;
  employeeYear: number; // this year's employee contribution
  employerYear: number;
  netCostYear: number; // fall in take-home pay this year after tax relief
  taxFreeLump: number;
  drawdownIncome: number; // pot × withdrawal rate
  statePension: number;
  totalIncome: number;
  belowMinimum: boolean; // contributions below the auto-enrolment minimum
  timeline: PensionYear[];
}

export function projectPension(input: PensionInput): PensionResult {
  const age = Math.floor(Math.max(16, Math.min(80, input.age || 0)));
  const retireAge = Math.floor(Math.max(age, Math.min(80, input.retireAge || 0)));
  const years = retireAge - age;
  const basis = input.basis ?? "full";
  const eePct = Math.max(0, input.employeePct || 0) / 100;
  const erPct = Math.max(0, input.employerPct || 0) / 100;
  const g = (input.growthPct ?? 3) / 100;
  const sg = (input.salaryGrowthPct ?? 0) / 100;
  const salary0 = Math.max(0, input.salary || 0);

  let pot = Math.max(0, input.currentPot || 0);
  let salary = salary0;
  let totalContributions = 0;
  const timeline: PensionYear[] = [{ age, contributions: 0, pot }];
  for (let i = 0; i < years; i++) {
    const c = pensionableEarnings(salary, basis) * (eePct + erPct);
    // Contributions are paid monthly through the year, so on average they earn half a year's growth.
    pot = pot * (1 + g) + c * (1 + g / 2);
    totalContributions += c;
    timeline.push({ age: age + i + 1, contributions: totalContributions, pot });
    salary *= 1 + sg;
  }

  const earnings = pensionableEarnings(salary0, basis);
  const employeeYear = earnings * eePct;
  const employerYear = earnings * erPct;
  // Cost after tax relief, using a net pay arrangement (relief at source gives the same result for basic-rate taxpayers).
  const region = input.region ?? "ruk";
  const without = calculate({ gross: salary0, region });
  const withPension = calculate({
    gross: salary0,
    region,
    pensionType: "netpay",
    pensionPercent: salary0 > 0 ? (employeeYear / salary0) * 100 : 0,
  });
  const netCostYear = without.takeHome - withPension.takeHome;

  const withdrawal = (input.withdrawalPct ?? 4) / 100;
  const statePension = input.statePension === false ? 0 : STATE_PENSION_YEARLY;
  const drawdownIncome = pot * withdrawal;
  const minEarnings = pensionableEarnings(salary0, "qualifying");
  const belowMinimum =
    salary0 >= PENSION.autoEnrolTrigger &&
    (employeeYear + employerYear < minEarnings * PENSION.minTotal - 0.01 || employerYear < minEarnings * PENSION.minEmployer - 0.01);

  return {
    years,
    pot,
    totalContributions,
    growth: pot - totalContributions - Math.max(0, input.currentPot || 0),
    employeeYear,
    employerYear,
    netCostYear,
    taxFreeLump: Math.min(pot * 0.25, PENSION.lumpSumAllowance),
    drawdownIncome,
    statePension,
    totalIncome: drawdownIncome + statePension,
    belowMinimum,
    timeline,
  };
}
