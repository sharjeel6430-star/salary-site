// Previous-year (2025/26) figures, worked by hand from GOV.UK rates.
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculate } from "../lib/tax.ts";

test("2025/26 rUK £30,000 matches 2026/27 (bands unchanged)", () => {
  const a = calculate({ gross: 30000, year: "2025/26" });
  assert.equal(a.incomeTax, 3486);
  assert.equal(a.nationalInsurance, 1394.4);
  assert.equal(a.takeHome, 25119.6);
  assert.equal(calculate({ gross: 30000 }).takeHome, 25119.6);
});

test("Scotland £30,000: 2025/26 vs 2026/27 bands", () => {
  assert.equal(calculate({ gross: 30000, region: "scotland", year: "2025/26" }).incomeTax, 3482.82);
  assert.equal(calculate({ gross: 30000, region: "scotland" }).incomeTax, 3451.07);
});

test("Plan 2 student loan thresholds by year", () => {
  assert.equal(calculate({ gross: 35000, studentPlan: "plan2", year: "2025/26" }).studentLoan, 587.7);
  assert.equal(calculate({ gross: 35000, studentPlan: "plan2" }).studentLoan, 505.35);
});

test("Plan 5 not repaid in 2025/26", () => {
  assert.equal(calculate({ gross: 40000, studentPlan: "plan5", year: "2025/26" }).studentLoan, 0);
  assert.equal(calculate({ gross: 40000, studentPlan: "plan5" }).studentLoan, 1350);
});
