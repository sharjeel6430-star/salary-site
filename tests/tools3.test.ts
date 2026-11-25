import { test } from "node:test";
import assert from "node:assert/strict";
import { statutorySickPay, toWeekly, SSP } from "../lib/ssp.ts";
import { parseTaxCode, expectedPayslip, compareLine } from "../lib/payslip.ts";
import { calculate } from "../lib/tax.ts";

const close = (a: number, b: number, e = 0.01) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);

// ---------- Statutory Sick Pay (from 6 April 2026) ----------
test("SSP: £500 a week, 5 qualifying days, off 3 days = £73.95 (paid from day one)", () => {
  const r = statutorySickPay({ averageWeeklyEarnings: 500, qualifyingDaysPerWeek: 5, sickDays: 3 });
  close(r.weeklyRate, 123.25);
  close(r.dailyRate, 24.65);
  close(r.total, 73.95);
  assert.equal(r.usesEarningsRate, false);
  close(r.previousRules, 0); // old rules: 3 waiting days unpaid
});

test("SSP: low earner gets 80% of average weekly earnings", () => {
  const r = statutorySickPay({ averageWeeklyEarnings: 100, qualifyingDaysPerWeek: 5, sickDays: 5 });
  close(r.weeklyRate, 80);
  close(r.total, 80);
  assert.equal(r.usesEarningsRate, true);
  close(r.previousRules, 0); // below the old £125 Lower Earnings Limit
  // £155 a week: 80% is £124, so the flat £123.25 applies.
  close(statutorySickPay({ averageWeeklyEarnings: 155, qualifyingDaysPerWeek: 5, sickDays: 5 }).weeklyRate, 123.25);
});

test("SSP: paid for up to 28 weeks", () => {
  const r = statutorySickPay({ averageWeeklyEarnings: 600, qualifyingDaysPerWeek: 5, sickDays: 150 });
  assert.equal(r.maxDays, 140);
  assert.equal(r.daysPaid, 140);
  close(r.total, 28 * 123.25);
  close(statutorySickPay({ averageWeeklyEarnings: 600, qualifyingDaysPerWeek: 5, sickDays: 40 }).total, 8 * 123.25);
});

test("SSP: old rules comparison and pay conversion", () => {
  const r = statutorySickPay({ averageWeeklyEarnings: 500, qualifyingDaysPerWeek: 5, sickDays: 10 });
  close(r.previousRules, (118.75 / 5) * 7);
  close(toWeekly(2600, "month"), 600);
  close(toWeekly(31200, "year"), 600);
  assert.equal(SSP.weeklyRate, 123.25);
});

// ---------- Payslip checker ----------
test("Payslip: tax code parsing", () => {
  const std = parseTaxCode("1257L");
  assert.equal(std.allowance, 12579);
  assert.equal(std.region, "ruk");
  assert.equal(parseTaxCode("s1257l").region, "scotland");
  assert.equal(parseTaxCode("C1257L").region, "ruk");
  assert.equal(parseTaxCode("1257L M1").emergency, true);
  assert.equal(parseTaxCode("1257LX").emergency, true);
  assert.equal(parseTaxCode("K500").allowance, -5000);
  assert.equal(parseTaxCode("BR").kind, "BR");
  assert.equal(parseTaxCode("NT").kind, "NT");
  assert.equal(parseTaxCode("SD1").kind, "D1");
  assert.equal(parseTaxCode("D2").valid, false);
  assert.equal(parseTaxCode("hello").valid, false);
  assert.equal(parseTaxCode("1383M").allowance, 13839);
});

test("Payslip: £3,000 a month on 1257L matches the yearly calculator within pennies", () => {
  const r = expectedPayslip({ gross: 3000, taxCode: "1257L" });
  close(r.incomeTax, calculate({ gross: 36000 }).incomeTax / 12, 0.2);
  close(r.incomeTax, 390.35); // (36,000 − 12,579) × 20% ÷ 12
  close(r.nationalInsurance, (3000 - 1048) * 0.08); // £156.16
  close(r.netPay, 3000 - 390.35 - 156.16);
});

test("Payslip: Scottish code uses Scottish bands", () => {
  const r = expectedPayslip({ gross: 3000, taxCode: "S1257L" });
  close(r.incomeTax, calculate({ gross: 36000, region: "scotland" }).incomeTax / 12, 0.2);
});

test("Payslip: weekly NI and flat-rate codes", () => {
  close(expectedPayslip({ gross: 600, frequency: "week", taxCode: "BR" }).nationalInsurance, (600 - 242) * 0.08);
  close(expectedPayslip({ gross: 2000, taxCode: "BR" }).incomeTax, 400);
  close(expectedPayslip({ gross: 2000, taxCode: "D0" }).incomeTax, 800);
  close(expectedPayslip({ gross: 2000, taxCode: "SD0" }).incomeTax, 420);
  close(expectedPayslip({ gross: 2000, taxCode: "NT" }).incomeTax, 0);
  close(expectedPayslip({ gross: 2000, taxCode: "0T" }).incomeTax, 400);
  close(expectedPayslip({ gross: 5000, frequency: "month", taxCode: "1257L" }).nationalInsurance, (4189 - 1048) * 0.08 + (5000 - 4189) * 0.02);
});

test("Payslip: K code adds income and is capped at 50% of pay", () => {
  close(expectedPayslip({ gross: 2000, taxCode: "K500" }).incomeTax, (24000 + 5000) * 0.2 / 12);
  const capped = expectedPayslip({ gross: 1000, taxCode: "K9999" });
  assert.equal(capped.kCapApplied, true);
  close(capped.incomeTax, 500);
});

test("Payslip: pensions and student loans", () => {
  // Net pay pension: £150 off taxable pay, NI still on £3,000.
  const net = expectedPayslip({ gross: 3000, pension: 150, pensionMethod: "netpay" });
  close(net.taxablePay, 2850);
  close(net.nationalInsurance, (3000 - 1048) * 0.08);
  // Plan 2: (3,000 − 29,385/12) × 9% = £49.61 → £49 (rounded down).
  assert.equal(expectedPayslip({ gross: 3000, studentPlan: "plan2" }).studentLoan, 49);
  // Postgraduate: (3,000 − 1,750) × 6% = £75.
  assert.equal(expectedPayslip({ gross: 3000, postgraduate: true }).postgraduateLoan, 75);
  // Salary sacrifice reduces NI and the student loan too.
  const sac = expectedPayslip({ gross: 3000, pension: 150, pensionMethod: "sacrifice", studentPlan: "plan2" });
  close(sac.nationalInsurance, (2850 - 1048) * 0.08);
  assert.equal(sac.studentLoan, 36); // (2,850 − 2,448.75) × 9% = 36.11
});

test("Payslip: comparing figures", () => {
  assert.equal(compareLine(390.4, 390.35).status, "match");
  assert.equal(compareLine(393, 390.35).status, "close");
  assert.equal(compareLine(450, 390.35).status, "higher");
  assert.equal(compareLine(300, 390.35).status, "lower");
  assert.equal(compareLine(null, 390.35).status, "blank");
});
