// Class 1 NI by pay period, checked against GOV.UK 2026/27 thresholds and worked by hand.
import { test } from "node:test";
import assert from "node:assert/strict";
import { niForPeriod, bonusNi, roundNi, NI_PERIODS } from "../lib/nationalInsurance.ts";
import { calculate } from "../lib/tax.ts";

test("NI: 2026/27 thresholds per period (GOV.UK)", () => {
  const m = NI_PERIODS.find((p) => p.key === "month")!;
  assert.deepEqual([m.lel, m.pt, m.st, m.uel], [559, 1048, 417, 4189]);
  const w = NI_PERIODS.find((p) => p.key === "week")!;
  assert.deepEqual([w.lel, w.pt, w.st, w.uel], [129, 242, 96, 967]);
  const y = NI_PERIODS.find((p) => p.key === "year")!;
  assert.deepEqual([y.pt, y.st, y.uel], [12570, 5000, 50270]);
});

test("NI: monthly category A examples", () => {
  const r = niForPeriod(3000, "month", "A");
  assert.equal(r.employee, 156.16); // (3000 - 1048) x 8%
  assert.equal(r.employer, 387.45); // (3000 - 417) x 15%
  const hi = niForPeriod(6000, "month", "A");
  assert.equal(hi.employee, roundNi((4189 - 1048) * 0.08 + (6000 - 4189) * 0.02)); // 251.28 + 36.22
  assert.equal(hi.employee, 287.5);
  assert.equal(niForPeriod(1000, "month", "A").employee, 0);
  assert.equal(niForPeriod(500, "month", "A").belowLel, true);
});

test("NI: weekly and categories", () => {
  assert.equal(niForPeriod(500, "week", "A").employee, 20.64); // (500 - 242) x 8%
  assert.equal(niForPeriod(500, "week", "A").employer, 60.6); // (500 - 96) x 15%
  assert.equal(niForPeriod(500, "week", "M").employer, 0); // under 21: 0% up to £967
  assert.equal(niForPeriod(1200, "week", "H").employer, roundNi((1200 - 967) * 0.15));
  assert.equal(niForPeriod(500, "week", "C").employee, 0);
  assert.equal(niForPeriod(500, "week", "C").employer, 60.6);
  assert.equal(niForPeriod(500, "week", "B").employee, roundNi(258 * 0.0185));
});

test("NI: annual period agrees with the main calculator", () => {
  for (const s of [12000, 25000, 40000, 60000, 120000]) {
    const r = niForPeriod(s, "year", "A");
    const c = calculate({ gross: s });
    assert.equal(r.employee, roundNi(c.nationalInsurance), `employee ${s}`);
    assert.equal(r.employer, roundNi(c.employerNI), `employer ${s}`);
  }
});

test("NI: bonus month", () => {
  const b = bonusNi(3000, 5000, "month", "A");
  // normal month 156.16; bonus month: (4189-1048) x 8% + (8000-4189) x 2% = 251.28 + 76.22 = 327.50
  assert.equal(b.withBonus.employee, 327.5);
  assert.equal(b.employeeOnBonus, 171.34);
  assert.equal(b.employerOnBonus, 750); // all of the bonus at 15%
});

test("NI: half a penny rounds down", () => {
  assert.equal(roundNi(1.005), 1);
  assert.equal(roundNi(1.0051), 1.01);
});
