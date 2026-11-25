import { test } from "node:test";
import assert from "node:assert/strict";
import { nhsPensionRate } from "../lib/nhs.ts";
import { calculate } from "../lib/tax.ts";

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 0.01, `${a} != ${b}`);

test("NHS pension tiers 2026/27", () => {
  assert.equal(nhsPensionRate(13259), 0.052);
  assert.equal(nhsPensionRate(25272), 0.065);
  assert.equal(nhsPensionRate(32073), 0.083);
  assert.equal(nhsPensionRate(39959), 0.098);
  assert.equal(nhsPensionRate(57528), 0.107);
  assert.equal(nhsPensionRate(67669), 0.125);
});

test("Band 5 entry take-home (net pay pension: tax relief, no NI relief)", () => {
  const g = 32073, pen = g * 0.083;
  const r = calculate({ gross: g, pensionPercent: 8.3, pensionType: "netpay" });
  close(r.pension, pen);
  close(r.incomeTax, (g - pen - 12570) * 0.2);
  close(r.nationalInsurance, (g - 12570) * 0.08);
});
