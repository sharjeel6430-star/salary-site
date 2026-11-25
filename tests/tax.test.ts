import { test } from "node:test";
import assert from "node:assert/strict";
import { calculate, personalAllowanceFor } from "../lib/tax.ts";

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 0.01, `${a} != ${b}`);

test("£30,000 England, no extras", () => {
  const r = calculate({ gross: 30000 });
  close(r.incomeTax, 3486);
  close(r.nationalInsurance, 1394.4);
  close(r.takeHome, 25119.6);
});

test("£60,000 England crosses higher rate and NI upper limit", () => {
  const r = calculate({ gross: 60000 });
  close(r.incomeTax, 11432);
  close(r.nationalInsurance, 3210.6);
  close(r.takeHome, 45357.4);
});

test("£110,000 England tapers the Personal Allowance", () => {
  const r = calculate({ gross: 110000 });
  assert.equal(r.personalAllowance, 7570);
  close(r.incomeTax, 33432);
  close(r.takeHome, 110000 - 33432 - 4210.6);
});

test("Personal Allowance is zero at £125,140", () => {
  assert.equal(personalAllowanceFor(125140), 0);
  assert.equal(personalAllowanceFor(100000), 12570);
});

test("£200,000 England hits additional rate", () => {
  const r = calculate({ gross: 200000 });
  // 37,700@20% + 87,440@40% + 74,860@45%
  close(r.incomeTax, 7540 + 34976 + 33687);
});

test("£30,000 Scotland", () => {
  const r = calculate({ gross: 30000, region: "scotland" });
  close(r.incomeTax, 753.73 + 2597.8 + 99.54);
  close(r.nationalInsurance, 1394.4);
});

test("£80,000 Scotland reaches advanced rate", () => {
  const r = calculate({ gross: 80000, region: "scotland" });
  // taxable 67,430
  const expected = 3967 * 0.19 + 12989 * 0.2 + 14136 * 0.21 + 31338 * 0.42 + 5000 * 0.45;
  close(r.incomeTax, expected);
});

test("Plan 2 student loan + postgraduate", () => {
  const r = calculate({ gross: 40000, studentPlan: "plan2", postgraduate: true });
  close(r.studentLoan, (40000 - 29385) * 0.09);
  close(r.postgraduateLoan, (40000 - 21000) * 0.06);
});

test("5% salary sacrifice lowers tax and NI", () => {
  const r = calculate({ gross: 40000, pensionPercent: 5, pensionType: "sacrifice" });
  close(r.pension, 2000);
  close(r.incomeTax, (38000 - 12570) * 0.2);
  close(r.nationalInsurance, (38000 - 12570) * 0.08);
});

test("5% net pay pension lowers tax only", () => {
  const r = calculate({ gross: 40000, pensionPercent: 5, pensionType: "netpay" });
  close(r.incomeTax, (38000 - 12570) * 0.2);
  close(r.nationalInsurance, (40000 - 12570) * 0.08);
});

test("Over State Pension age pays no NI", () => {
  assert.equal(calculate({ gross: 40000, noNI: true }).nationalInsurance, 0);
});

test("Marginal rate at £30k is 28%, at £110k is 62%", () => {
  close(calculate({ gross: 30000 }).marginalRate, 0.28);
  close(calculate({ gross: 110000 }).marginalRate, 0.62);
});

test("Zero and negative salary are safe", () => {
  assert.equal(calculate({ gross: 0 }).takeHome, 0);
  assert.equal(calculate({ gross: -5 }).takeHome, 0);
});
