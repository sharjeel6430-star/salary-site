import { test } from "node:test";
import assert from "node:assert/strict";
import { cityResults, grossNeeded, ENERGY_MONTHLY, councilTaxMonthly, CITIES } from "../lib/costOfLiving.ts";
import { calculate } from "../lib/tax.ts";

test("Cost of living: energy and council tax assumptions", () => {
  assert.equal(ENERGY_MONTHLY, 115); // Ofgem Oct–Dec 2026 cap x low typical use
  assert.equal(councilTaxMonthly(1800), 88); // 1800 x 7/9 x 0.75 / 12 = 87.5
});

test("Cost of living: grossNeeded is the smallest £100 step that reaches the target", () => {
  for (const region of ["ruk", "scotland"] as const) {
    for (const target of [20000, 35000, 50000]) {
      const g = grossNeeded(target, region);
      assert.ok(calculate({ gross: g, region }).takeHome >= target);
      assert.ok(calculate({ gross: g - 100, region }).takeHome < target);
      assert.equal(g % 100, 0);
    }
  }
});

test("Cost of living: results are complete, sorted and consistent", () => {
  const r = cityResults();
  assert.equal(r.length, CITIES.length);
  assert.equal(r[0].slug, "london");
  for (let i = 1; i < r.length; i++) assert.ok(r[i - 1].comfortableSalary >= r[i].comfortableSalary);
  for (const c of r) {
    assert.equal(c.essentials, c.breakdown.reduce((s, b) => s + b.value, 0));
    assert.ok(c.minSalary < c.comfortableSalary);
    assert.ok(calculate({ gross: c.comfortableSalary, region: c.region }).takeHome >= c.essentials * 2 * 12);
  }
  const london = r[0];
  assert.equal(london.essentials, 2490);
  assert.equal(london.comfortableSalary, 84900);
});
