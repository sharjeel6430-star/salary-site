import { test } from "node:test";
import assert from "node:assert/strict";
import { corporationTax, dividendTax } from "../lib/business.ts";
import { proRataHoliday, irregularHoursHoliday } from "../lib/holiday.ts";
import { grossForTakeHome } from "../lib/reverse.ts";
import { calculate } from "../lib/tax.ts";
import { tpsRate, teacherTakeHome } from "../lib/teachers.ts";

const close = (a: number, b: number, e = 0.01) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);

test("Corporation tax: small, marginal, main", () => {
  close(corporationTax({ profits: 40000 }).tax, 7600);
  close(corporationTax({ profits: 100000 }).tax, 25000 - 0.015 * 150000); // 22,750
  close(corporationTax({ profits: 300000 }).tax, 75000);
  close(corporationTax({ profits: 50000 }).tax, 9500);
  close(corporationTax({ profits: 250000 }).tax, 62500);
});

test("Corporation tax: associated companies and short periods divide the limits", () => {
  const r = corporationTax({ profits: 40000, associated: 1 }); // limits 25k / 125k
  close(r.lower, 25000);
  close(r.tax, 40000 * 0.25 - 0.015 * (125000 - 40000));
  close(corporationTax({ profits: 30000, months: 6 }).upper, 125000);
});

test("Dividend tax: £12,570 salary + £40,000 dividends", () => {
  const r = dividendTax({ salary: 12570, dividends: 40000 });
  close(r.dividendTax, 37200 * 0.1075 + 2300 * 0.3575);
  close(r.salaryTax, 0);
  close(r.ni, 0);
});

test("Dividend tax: dividends only use the Personal Allowance first", () => {
  const r = dividendTax({ salary: 0, dividends: 20000 });
  close(r.dividendTax, (20000 - 12570 - 500) * 0.1075);
});

test("Dividend tax: higher-rate salary pushes dividends to 35.75%", () => {
  const r = dividendTax({ salary: 60000, dividends: 10000 });
  close(r.dividendTax, 9500 * 0.3575);
});

test("Dividend tax: additional rate above £125,140", () => {
  const r = dividendTax({ salary: 0, dividends: 200000 });
  // PA tapered to 0; 500 allowance, basic 37,200, higher 87,440, additional 74,860
  close(r.dividendTax, 37200 * 0.1075 + 87440 * 0.3575 + 74860 * 0.3935);
});

test("Holiday: statutory and company pro rata", () => {
  assert.equal(proRataHoliday({ daysPerWeek: 5 }).yearDays, 28);
  assert.equal(proRataHoliday({ daysPerWeek: 6 }).yearDays, 28); // capped
  close(proRataHoliday({ daysPerWeek: 3 }).yearDays, 16.8);
  close(proRataHoliday({ daysPerWeek: 3, fullTimeEntitlement: 33 }).yearDays, 19.8);
  close(proRataHoliday({ daysPerWeek: 5, months: 6 }).days, 14);
  close(proRataHoliday({ daysPerWeek: 4, hoursPerWeek: 30 }).hours!, 22.4 * 7.5);
  close(irregularHoursHoliday(1000), 120.7);
});

test("Net to gross round-trips", () => {
  for (const net of [18000, 25119.6, 36000, 60000, 90000]) {
    const g = grossForTakeHome(net);
    assert.ok(calculate({ gross: g }).takeHome >= net - 0.01);
    assert.ok(calculate({ gross: g - 1 }).takeHome < net);
  }
  assert.equal(grossForTakeHome(25119.6), 30000);
});

test("Teachers' pension tiers 2026", () => {
  assert.equal(tpsRate(34069), 0.074);
  assert.equal(tpsRate(36199), 0.089);
  assert.equal(tpsRate(52835), 0.099);
  assert.equal(tpsRate(64684), 0.105);
  const r = teacherTakeHome(34069);
  close(r.pension, 34069 * 0.074);
  close(r.nationalInsurance, (34069 - 12570) * 0.08);
});
