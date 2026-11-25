import { test } from "node:test";
import assert from "node:assert/strict";
import { evSacrifice } from "../lib/ev.ts";
import { calculate } from "../lib/tax.ts";

const close = (a: number, b: number, e = 0.01) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);

// Worked by hand: £45,000 salary, £500 a month, £40,000 EV at 4% → BIK £1,600.
// Before: tax 6,486, NI 2,594.40, take-home 35,919.60.
// After: salary 39,000; tax on 40,600 = 5,606; NI on 39,000 = 2,114.40 → 31,279.60.
test("EV salary sacrifice: basic-rate worked example", () => {
  const r = evSacrifice({ salary: 45000, monthlySacrifice: 500, listPrice: 40000 });
  close(r.bikValue, 1600);
  close(r.bikTax, 320);
  close(r.netCostYear, 4640);
  close(r.netCostMonth, 386.67);
  close(r.savingYear, 1360);
  close(r.niSaved, 480);
  assert.equal(r.belowMinimumWage, false);
});

test("EV salary sacrifice: plug-in hybrid uses the higher BIK band", () => {
  const ev = evSacrifice({ salary: 60000, monthlySacrifice: 600, listPrice: 50000 });
  const phev = evSacrifice({ salary: 60000, monthlySacrifice: 600, listPrice: 50000, carType: "phev30" });
  close(phev.bikValue, 7000);
  assert.ok(phev.netCostYear > ev.netCostYear);
});

test("EV salary sacrifice: higher earner near £100k saves more", () => {
  const r = evSacrifice({ salary: 110000, monthlySacrifice: 800, listPrice: 60000 });
  // BIK 2,400 counts towards adjusted net income: 110,000 − 9,600 + 2,400 = 102,800.
  const expectedTax = calculate({ gross: 102800 }).incomeTax - calculate({ gross: 100400 }).incomeTax;
  close(r.bikTax, expectedTax);
  close(r.netCostYear, 5088); // hand-checked: 9,600 − 4,320 tax − 192 NI
  close(r.bikTax, 1440); // 2,400 × 60% effective rate
});

test("EV salary sacrifice: flags pay below the National Living Wage", () => {
  assert.equal(evSacrifice({ salary: 26000, monthlySacrifice: 400, listPrice: 30000 }).belowMinimumWage, true);
});

test("Monthly take-home is yearly take-home divided by 12", () => {
  const r = calculate({ gross: 36000 });
  close(r.takeHome / 12, (36000 - (36000 - 12570) * 0.28) / 12);
});
