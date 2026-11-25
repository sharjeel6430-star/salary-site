// Self-employed tax, checked by hand against GOV.UK 2026/27 rates and against the main calculator.
import { test } from "node:test";
import assert from "node:assert/strict";
import { selfEmployedTax, class4 } from "../lib/selfEmployed.ts";
import { calculate } from "../lib/tax.ts";

const r2 = (x: number) => Math.round(x * 100) / 100;

test("self-employed: Class 4 at 6% and 2%", () => {
  assert.equal(r2(class4(12570)), 0);
  assert.equal(r2(class4(30000)), 1045.8); // (30,000 - 12,570) x 6%
  assert.equal(r2(class4(60000)), 2456.6); // 37,700 x 6% + 9,730 x 2%
});

test("self-employed: £30,000 profit", () => {
  const r = selfEmployedTax({ income: 36000, expenses: 6000 });
  assert.equal(r.profit, 30000);
  assert.equal(r2(r.incomeTax), 3486);
  assert.equal(r2(r.class4), 1045.8);
  assert.equal(r2(r.takeHome), 25468.2);
  assert.equal(r.poaRequired, true);
  assert.equal(r2(r.poaEach), 2265.9);
  assert.equal(r2(r.firstYear.january), 6797.7); // 4,531.80 + 2,265.90
  assert.equal(r.class2TreatedAsPaid, true);
  assert.equal(r.mtdFrom, "6 April 2027");
});

test("self-employed: £60,000 profit, Scotland and student loan match the main calculator", () => {
  const r = selfEmployedTax({ income: 60000, expenses: 0 });
  assert.equal(r2(r.incomeTax), 11432);
  const s = selfEmployedTax({ income: 45000, expenses: 5000, region: "scotland", studentPlan: "plan2" });
  const c = calculate({ gross: 40000, region: "scotland", studentPlan: "plan2", noNI: true });
  assert.equal(r2(s.incomeTax), r2(c.incomeTax));
  assert.equal(r2(s.studentLoan), r2(c.studentLoan)); // 9% over £29,385
  assert.equal(r2(s.studentLoan), r2((40000 - 29385) * 0.09));
});

test("self-employed: side income on top of a salary", () => {
  const r = selfEmployedTax({ income: 10000, expenses: 0, salary: 30000 });
  assert.equal(r2(r.incomeTax), 2000); // all at 20% because the salary used the allowance
  assert.equal(r2(r.class4), 0); // Class 4 looks at profits alone
  assert.equal(r.poaRequired, true); // £2,000 owed, PAYE covered 3,486 / 5,486 = 64% < 80%
  const small = selfEmployedTax({ income: 3000, expenses: 0, salary: 60000 });
  assert.equal(r2(small.incomeTax), 1200);
  assert.equal(small.poaRequired, false); // PAYE paid 11,432 of 12,632 (over 80%), so no payments on account
  const tiny = selfEmployedTax({ income: 2000, expenses: 0, salary: 40000 });
  assert.equal(tiny.poaRequired, false); // £400 owed, under £1,000
});

test("self-employed: trading allowance", () => {
  const r = selfEmployedTax({ income: 3000, expenses: 200 });
  assert.equal(r.tradingAllowanceBetter, true);
  const t = selfEmployedTax({ income: 3000, expenses: 200, useTradingAllowance: true });
  assert.equal(t.profit, 2000);
  const under = selfEmployedTax({ income: 800, expenses: 0, useTradingAllowance: true });
  assert.equal(under.profit, 0);
  assert.equal(under.bill, 0);
});

test("self-employed: low profit and Class 2", () => {
  const r = selfEmployedTax({ income: 6000, expenses: 0 });
  assert.equal(r.bill, 0);
  assert.equal(r.class2TreatedAsPaid, false);
  assert.equal(r2(r.voluntaryClass2Year), 189.8);
});
