import { test } from "node:test";
import assert from "node:assert/strict";
import { minimumWagePay, checkPay, ageBandFor, minimumRate, WAGE_YEARS } from "../lib/minimumWage.ts";
import { monthlyRepayment, repaymentPlan, affordability, monthlyInterestOnly } from "../lib/mortgage.ts";
import { childBenefitYearly, childBenefitCharge, hicbcPercent, hicbcCharge } from "../lib/childBenefit.ts";
import { statutoryRedundancy, redundancyTax } from "../lib/redundancy.ts";
import { projectPension, STATE_PENSION_YEARLY, pensionableEarnings } from "../lib/pension.ts";
import { MIN_WAGE } from "../lib/site.ts";
import { calculate } from "../lib/tax.ts";

const close = (a: number, b: number, e = 0.01) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);

// ---------- Minimum wage ----------
test("Minimum wage: rates match GOV.UK for 2025, 2026 and the announced 2027 rates", () => {
  assert.equal(minimumRate("21plus", "2025/26"), 12.21);
  assert.equal(minimumRate("18to20", "2025/26"), 10.0);
  assert.equal(minimumRate("21plus", "2026/27"), 12.71);
  assert.equal(minimumRate("18to20", "2026/27"), 10.85);
  assert.equal(minimumRate("16to17", "2026/27"), 8.0);
  assert.equal(minimumRate("apprentice", "2026/27"), 8.0);
  assert.equal(minimumRate("21plus", "2027/28"), 13.21);
  assert.equal(minimumRate("18to20", "2027/28"), 11.27);
  assert.equal(minimumRate("16to17", "2027/28"), 8.31);
  assert.equal(WAGE_YEARS.find((y) => y.key === "2027/28")?.announced, true);
});

test("Minimum wage: site-wide MIN_WAGE stays in step with lib/minimumWage", () => {
  assert.equal(MIN_WAGE.nlw, minimumRate("21plus", "2026/27"));
  assert.equal(MIN_WAGE.age18to20, minimumRate("18to20", "2026/27"));
  assert.equal(MIN_WAGE.age16to17, minimumRate("16to17", "2026/27"));
});

// Hand-checked: £12.71 × 37.5 × 52 = £24,784.50. Tax (24,784.50 − 12,570) × 20% = £2,442.90; NI × 8% = £977.16.
test("Minimum wage: full-time National Living Wage pay and take-home", () => {
  const r = minimumWagePay({ band: "21plus", hoursPerWeek: 37.5 });
  close(r.weekly, 476.63);
  close(r.yearly, 24784.5);
  close(r.monthly, 2065.38);
  close(r.incomeTax, 2442.9);
  close(r.nationalInsurance, 977.16);
  close(r.takeHomeYear, 21364.44);
});

test("Minimum wage: part-time 16–17 rate is below the tax and NI thresholds", () => {
  const r = minimumWagePay({ band: "16to17", hoursPerWeek: 20 });
  close(r.yearly, 8320);
  close(r.takeHomeYear, 8320);
});

test("Minimum wage: 2027 rates use 2026/27 tax rules for take-home pay", () => {
  const r = minimumWagePay({ band: "21plus", hoursPerWeek: 37.5, year: "2027/28" });
  close(r.yearly, 25759.5);
  assert.equal(r.taxYearUsed, "2026/27");
});

test("Minimum wage: age bands", () => {
  assert.equal(ageBandFor(15), null);
  assert.equal(ageBandFor(16), "16to17");
  assert.equal(ageBandFor(18), "18to20");
  assert.equal(ageBandFor(20), "18to20");
  assert.equal(ageBandFor(21), "21plus");
  assert.equal(ageBandFor(19, true), "apprentice");
});

test("Minimum wage: pay checker converts yearly and monthly pay to an hourly rate", () => {
  const low = checkPay({ band: "21plus", amount: 24000, period: "year", hoursPerWeek: 37.5 });
  assert.equal(low.paidEnough, false);
  close(low.hourlyPaid, 12.3077, 0.001);
  close(low.shortfallPerYear, 784.5); // = 24,784.50 − 24,000
  const ok = checkPay({ band: "21plus", amount: 2100, period: "month", hoursPerWeek: 37.5 });
  assert.equal(ok.paidEnough, true);
  assert.equal(checkPay({ band: "18to20", amount: 10.85, period: "hour", hoursPerWeek: 30 }).paidEnough, true);
  assert.equal(checkPay({ band: "21plus", amount: 12.7, period: "hour", hoursPerWeek: 30 }).paidEnough, false);
});

// ---------- Mortgage ----------
test("Mortgage: £200,000 over 25 years at 4.5% is £1,111.66 a month", () => {
  close(monthlyRepayment(200000, 4.5, 25), 1111.66);
  close(monthlyInterestOnly(200000, 4.5), 750);
  close(monthlyRepayment(200000, 0, 25), 666.67);
});

test("Mortgage: schedule repays the whole loan", () => {
  const r = repaymentPlan({ loan: 250000, ratePct: 5, years: 30, propertyPrice: 300000 });
  assert.equal(r.schedule.length, 30);
  close(r.schedule[29].balance, 0, 0.5);
  close(r.schedule.reduce((s, y) => s + y.capital, 0), 250000, 0.5);
  close(r.totalInterest, r.monthly * 360 - 250000);
  close(r.ltv ?? 0, 250000 / 300000);
  // Most of the early payments are interest.
  assert.ok(r.schedule[0].interest > r.schedule[0].capital);
});

test("Mortgage: borrowing at 4.5 × joint income", () => {
  const r = affordability({ income1: 40000, income2: 30000, deposit: 35000, multiple: 4.5, ratePct: 4.5, years: 25 });
  close(r.maxLoan, 315000);
  close(r.propertyPrice, 350000);
  close(r.ltv, 0.9);
  close(r.takeHomeMonth, (calculate({ gross: 40000 }).takeHome + calculate({ gross: 30000 }).takeHome) / 12);
  close(r.monthly, monthlyRepayment(315000, 4.5, 25));
});

// ---------- Child Benefit ----------
test("Child Benefit: yearly amounts for 2026/27 and 2025/26", () => {
  // 2026/27 has 53 Child Benefit weeks (both 6 Apr 2026 and 5 Apr 2027 are Mondays, ITEPA 2003 s681H);
  // 2025/26 has 52. Corrected in v22 (was 52 weeks for both years).
  close(childBenefitYearly(1), 1433.65);
  close(childBenefitYearly(2), 2382.35);
  close(childBenefitYearly(3), 3331.05);
  close(childBenefitYearly(1, "2025/26"), 1354.6);
  close(childBenefitYearly(0), 0);
});

test("Child Benefit: High Income Child Benefit Charge steps", () => {
  assert.equal(hicbcPercent(60000), 0);
  assert.equal(hicbcPercent(60199), 0);
  assert.equal(hicbcPercent(60200), 1);
  assert.equal(hicbcPercent(70000), 50);
  assert.equal(hicbcPercent(80000), 100);
  assert.equal(hicbcPercent(95000), 100);
  // The charge is worked out on the benefit rounded down to whole pounds (£2,382 for two children).
  assert.equal(hicbcCharge(70000, 2382.35), 1191);
  assert.equal(hicbcCharge(80000, 2382.35), 2382); // all of it at £80,000+, less the 35p
  assert.equal(childBenefitCharge({ income: 85000, children: 2 }).charge, 2382);
  close(childBenefitCharge({ income: 85000, children: 2 }).kept, 0.35);
  assert.equal(hicbcCharge(60200, 2382.35), 23);
});

test("Child Benefit: pension contributions reduce adjusted net income and the charge", () => {
  const r = childBenefitCharge({ income: 70000, pensionPercent: 10, children: 2 });
  close(r.adjustedNetIncome, 63000);
  assert.equal(r.percent, 15);
  assert.equal(r.charge, 357);
  close(r.kept, 2025.35);
  close(r.pensionToAvoid, 3000);
});

test("Child Benefit: marginal rate at £70,000 with two children", () => {
  // £200 more: 40% tax (£80) + 2% NI (£4) + charge up from £1,191 to £1,214 (£23) = £107 → 53.5%.
  const r = childBenefitCharge({ income: 70000, children: 2 });
  close(r.marginalRate, 0.535, 0.001);
});

// ---------- Redundancy ----------
test("Redundancy: ready reckoner examples", () => {
  const a = statutoryRedundancy({ age: 30, years: 10, weeklyPay: 600 });
  assert.equal(a.weeks, 9); // 8 years at 22–40 + 2 years under 22 × 0.5
  close(a.pay, 5400);
  assert.equal(statutoryRedundancy({ age: 22, years: 2, weeklyPay: 500 }).weeks, 1);
  assert.equal(statutoryRedundancy({ age: 41, years: 2, weeklyPay: 500 }).weeks, 2);
  assert.equal(statutoryRedundancy({ age: 42, years: 2, weeklyPay: 500 }).weeks, 2.5);
});

test("Redundancy: weekly pay cap and 20-year limit", () => {
  const b = statutoryRedundancy({ age: 50, years: 20, weeklyPay: 900 });
  assert.equal(b.weeks, 24.5);
  assert.equal(b.capped, true);
  close(b.pay, 18399.5);
  const max = statutoryRedundancy({ age: 61, years: 25, weeklyPay: 2000 });
  assert.equal(max.yearsCounted, 20);
  assert.equal(max.weeks, 30);
  close(max.pay, 22530); // GOV.UK maximum from 6 April 2026
  close(statutoryRedundancy({ age: 61, years: 25, weeklyPay: 2000, nation: "ni" }).pay, 23490);
});

test("Redundancy: under 2 years' service gets nothing, and years can't start before 16", () => {
  const r = statutoryRedundancy({ age: 25, years: 1, weeklyPay: 500 });
  assert.equal(r.eligible, false);
  assert.equal(r.pay, 0);
  assert.equal(statutoryRedundancy({ age: 18, years: 5, weeklyPay: 300 }).yearsCounted, 2);
});

test("Redundancy: tax only on the amount above £30,000", () => {
  close(redundancyTax({ total: 25000, salaryThisYear: 50000 }).tax, 0);
  const r = redundancyTax({ total: 40000, salaryThisYear: 50000 });
  close(r.taxable, 10000);
  // On top of £50,000: £270 at 20% (to £50,270) + £9,730 at 40% = £54 + £3,892 = £3,946.
  close(r.tax, 3946);
  close(r.net, 36054);
});

// ---------- Pension ----------
test("Pension: one year, no growth", () => {
  const r = projectPension({ age: 30, retireAge: 31, salary: 30000, employeePct: 5, employerPct: 3, growthPct: 0 });
  close(r.pot, 2400);
  close(r.employeeYear, 1500);
  close(r.employerYear, 900);
  close(r.netCostYear, 1200); // 20% tax relief on £1,500
  assert.equal(r.belowMinimum, false);
});

test("Pension: growth on contributions paid through the year", () => {
  const r = projectPension({ age: 30, retireAge: 31, salary: 30000, employeePct: 5, employerPct: 3, growthPct: 3 });
  close(r.pot, 2400 * 1.015);
});

test("Pension: qualifying earnings basis and minimum contributions", () => {
  close(pensionableEarnings(30000, "qualifying"), 23760);
  close(pensionableEarnings(60000, "qualifying"), 44030);
  const q = projectPension({ age: 30, retireAge: 31, salary: 30000, employeePct: 5, employerPct: 3, basis: "qualifying", growthPct: 0 });
  close(q.pot, 1900.8);
  assert.equal(q.belowMinimum, false);
  assert.equal(projectPension({ age: 30, retireAge: 31, salary: 30000, employeePct: 7, employerPct: 1, growthPct: 0 }).belowMinimum, true);
});

test("Pension: long projection, tax-free cash cap and State Pension", () => {
  const r = projectPension({ age: 30, retireAge: 40, salary: 40000, employeePct: 5, employerPct: 5, growthPct: 0 });
  close(r.pot, 40000);
  close(r.totalContributions, 40000);
  close(r.taxFreeLump, 10000);
  close(r.drawdownIncome, 1600);
  close(STATE_PENSION_YEARLY, 12547.6);
  close(r.totalIncome, 1600 + 12547.6);
  const big = projectPension({ age: 25, retireAge: 68, salary: 150000, employeePct: 10, employerPct: 10, currentPot: 200000, growthPct: 4 });
  close(big.taxFreeLump, 268275);
  assert.equal(projectPension({ age: 30, retireAge: 31, salary: 30000, employeePct: 5, employerPct: 3, statePension: false }).statePension, 0);
});
