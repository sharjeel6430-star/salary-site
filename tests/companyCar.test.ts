// Company car tax, checked against HMRC's 2026/27 appropriate percentage table (EIM24705) and worked by hand.
import { test } from "node:test";
import assert from "node:assert/strict";
import { appropriatePercent, basePercent, companyCarTax } from "../lib/companyCar.ts";
import { calculate } from "../lib/tax.ts";
import { CAR_TYPES } from "../lib/ev.ts";

const r2 = (x: number) => Math.round(x * 100) / 100;

test("company car: every row of the 2026/27 table", () => {
  const rows: [number, number][] = [
    [51, 17], [54, 17], [55, 18], [60, 19], [65, 20], [70, 21], [74, 21], [75, 21], [79, 21], [80, 22], [85, 23], [90, 24], [95, 25],
    [100, 26], [105, 27], [110, 28], [115, 29], [120, 30], [125, 31], [130, 32], [135, 33], [140, 34], [145, 35], [150, 36], [154, 36], [155, 37], [250, 37],
  ];
  for (const [g, pct] of rows) assert.equal(basePercent(g), pct, `${g}g/km`);
  assert.equal(basePercent(0), 4);
  assert.deepEqual([130, 70, 40, 30, 10].map((m) => basePercent(35, m)), [4, 7, 10, 14, 16]);
  assert.equal(basePercent(188), 37);
  assert.equal(basePercent(83), 22); // rounded down to the 80–84 band
});

test("company car: diesel supplement and cap", () => {
  assert.equal(appropriatePercent("diesel", 120), 34);
  assert.equal(appropriatePercent("diesel-rde2", 120), 30);
  assert.equal(appropriatePercent("diesel", 150), 37); // 36 + 4 capped at 37
  assert.equal(appropriatePercent("electric", 999), 4);
});

test("company car: matches the EV salary sacrifice tool's rates", () => {
  const map: Record<string, number> = { ev: appropriatePercent("electric", 0), phev130: basePercent(30, 130), phev70: basePercent(30, 70), phev40: basePercent(30, 40), phev30: basePercent(30, 30), phev0: basePercent(30, 10) };
  for (const c of CAR_TYPES) assert.equal(map[c.key], Math.round(c.pct * 100), c.key);
});

test("company car: tax worked examples", () => {
  const ev = companyCarTax({ listPrice: 40000, fuel: "electric", salary: 35000 });
  assert.equal(ev.carBenefit, 1600);
  assert.equal(r2(ev.taxYear), 320);
  assert.equal(r2(ev.taxMonth), 26.67);
  const petrol = companyCarTax({ listPrice: 30000, fuel: "petrol", co2: 120, salary: 35000 });
  assert.equal(petrol.carBenefit, 9000);
  assert.equal(r2(petrol.taxYear), 1800);
  assert.equal(r2(petrol.taxMonth), 150);
  assert.equal(r2(petrol.employerClass1A), 1350);
  const higher = companyCarTax({ listPrice: 50000, fuel: "electric", salary: 60000 });
  assert.equal(r2(higher.taxYear), 800); // 2,000 x 40%
  const fuel = companyCarTax({ listPrice: 30000, fuel: "petrol", co2: 120, salary: 35000, freeFuel: true });
  assert.equal(fuel.fuelBenefit, 8760); // 29,200 x 30%
  // car takes pay to £44,000; fuel adds £8,760: £6,270 at 20% and £2,490 at 40%
  assert.equal(r2(fuel.fuelTaxYear), r2(6270 * 0.2 + 2490 * 0.4));
});

test("company car: contributions, part year, band crossing and taper", () => {
  const cc = companyCarTax({ listPrice: 40000, fuel: "electric", salary: 35000, capitalContribution: 6000 });
  assert.equal(cc.priceUsed, 35000); // only £5,000 counts
  const pu = companyCarTax({ listPrice: 30000, fuel: "petrol", co2: 120, salary: 35000, privateUsePayments: 1200 });
  assert.equal(pu.carBenefit, 7800);
  const half = companyCarTax({ listPrice: 30000, fuel: "petrol", co2: 120, salary: 35000, monthsAvailable: 6 });
  assert.equal(half.carBenefit, 4500);
  const cross = companyCarTax({ listPrice: 40000, fuel: "petrol", co2: 140, salary: 45000 }); // 34% = 13,600
  const want = calculate({ gross: 58600, noNI: true }).incomeTax - calculate({ gross: 45000, noNI: true }).incomeTax;
  assert.equal(r2(cross.taxYear), r2(want));
  assert.equal(r2(cross.taxYear), r2(5270 * 0.2 + 8330 * 0.4));
  const taper = companyCarTax({ listPrice: 50000, fuel: "electric", salary: 99000 }); // 2,000 benefit crosses £100k
  assert.equal(r2(taper.taxYear), r2(1000 * 0.4 + 1000 * 0.6));
  const scot = companyCarTax({ listPrice: 40000, fuel: "electric", salary: 35000, region: "scotland" });
  assert.equal(r2(scot.taxYear), 336); // 1,600 at Scotland's 21% intermediate rate
});
