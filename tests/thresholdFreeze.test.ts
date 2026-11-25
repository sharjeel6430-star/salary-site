// Re-checks every figure in the threshold freeze research (lib/thresholdFreeze.ts, /research/income-tax-threshold-freeze-2026)
// and that the published data pack files still match the model.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  FROZEN, employeeNI, extraCost, incomeTax, fortyPercentLine, indexedThresholds, minimumWageRows, nlwTaxIndexed, sameRealPay, thresholdsFor,
} from "../lib/thresholdFreeze.ts";
import { calculate } from "../lib/tax.ts";

const r = Math.round;

test("freeze: indexed thresholds", () => {
  const t = Object.fromEntries(indexedThresholds().map((x) => [x.year, x]));
  assert.deepEqual([t["2022/23"].pa, t["2023/24"].pa, t["2024/25"].pa, t["2025/26"].pa, t["2026/27"].pa, t["2027/28"].pa], [12960, 14270, 15230, 15490, 16080, 16650]);
  assert.equal(t["2026/27"].higherFrom, 64480);
  assert.equal(t["2027/28"].higherFrom, 66750);
  assert.equal(r(fortyPercentLine("2026/27")), 39317);
  assert.equal(r(fortyPercentLine("2027/28")), 37987);
});

test("freeze: frozen-threshold tax and NI match the site calculator", () => {
  for (const s of [15000, 30000, 55000, 60000, 80000, 110000, 130000, 150000]) {
    const c = calculate({ gross: s });
    assert.equal(r(incomeTax(s, FROZEN.pa, FROZEN.brl) * 100), r(c.incomeTax * 100), `tax ${s}`);
    assert.equal(r(employeeNI(s, FROZEN.pa, FROZEN.pa + FROZEN.brl) * 100), r(c.nationalInsurance * 100), `NI ${s}`);
    assert.equal(r(extraCost(s, "2021/22").total), 0, `base year ${s}`);
  }
});

test("freeze: extra cost tables", () => {
  const chk = (s: number, y: string, tax: number, ni: number, tot: number) => {
    const e = extraCost(s, y);
    assert.deepEqual([r(e.extraTax), r(e.extraNI), r(e.total)], [tax, ni, tot], `${s} ${y}`);
  };
  chk(15000, "2026/27", 486, 194, 680);
  for (const s of [20000, 30000, 40000, 50000]) chk(s, "2026/27", 702, 281, 983);
  chk(55000, "2026/27", 1648, -3, 1645);
  chk(60000, "2026/27", 2648, -303, 2345);
  for (const s of [65000, 80000, 100000, 125000]) chk(s, "2026/27", 3544, -572, 2972);
  chk(150000, "2026/27", 2140, -572, 1568);
  for (const s of [20000, 50000]) chk(s, "2027/28", 816, 326, 1142);
  chk(60000, "2027/28", 2762, -257, 2505);
  for (const s of [70000, 100000, 125000]) chk(s, "2027/28", 4112, -662, 3450);
});

test("freeze: same real pay and minimum wage", () => {
  const rp = [20000, 30000, 40000, 50000].map(sameRealPay);
  assert.deepEqual(rp.map((x) => r(x.now)), [25572, 38357, 51143, 63929]);
  assert.deepEqual(rp.map((x) => x.bandNow), ["Basic", "Basic", "Higher", "Higher"]);
  assert.deepEqual(rp.map((x) => x.bandIndexed), ["Basic", "Basic", "Basic", "Basic"]);
  assert.deepEqual(rp.map((x) => r(x.extraTax5yrs)), [2236, 2236, 2411, 10843]);
  const mw = minimumWageRows();
  assert.deepEqual(mw.map((m) => m.weeksTaxFree.toFixed(1)), ["37.6", "35.3", "32.2", "29.3", "27.5", "26.4", "25.4"]);
  assert.deepEqual(mw.map((m) => m.taxShare.toFixed(1)), ["5.5", "6.4", "7.6", "8.7", "9.4", "9.9", "10.2"]);
  assert.equal(r(mw.find((m) => m.year === "2026/27")!.tax), 2443);
  assert.equal(r(nlwTaxIndexed("2026/27")), 1741);
  // 2026/27 frozen-threshold tax agrees with the site calculator for a full-time NLW worker
  assert.equal(r(calculate({ gross: 12.71 * 1950 }).incomeTax), 2443);
});

test("freeze: every value in the published data pack matches the model", () => {
  const rd = (f: string) => readFileSync(new URL(`../public/research/data/threshold-freeze-2026/${f}`, import.meta.url), "utf8").trim().split("\n").slice(1).map((l) => l.split(","));
  const eq = (a: string, b: number, what: string, tol = 0.051) => assert.ok(Math.abs(Number(a) - b) <= tol, `${what}: file ${a}, model ${b}`);
  for (const [y, s, tf, ti, et, nf, ni, en, tot] of rd("freeze_cost_by_salary.csv")) {
    const t = thresholdsFor(y), S = Number(s), e = extraCost(S, y);
    eq(tf, incomeTax(S, FROZEN.pa, FROZEN.brl), `tax frozen ${y} ${s}`);
    eq(ti, incomeTax(S, t.pa, t.brl), `tax indexed ${y} ${s}`);
    eq(et, e.extraTax, `extra tax ${y} ${s}`);
    eq(nf, employeeNI(S, FROZEN.pa, FROZEN.pa + FROZEN.brl), `NI frozen ${y} ${s}`);
    eq(ni, employeeNI(S, t.pa, t.higherFrom), `NI indexed ${y} ${s}`);
    eq(en, e.extraNI, `extra NI ${y} ${s}`);
    eq(tot, e.total, `total ${y} ${s}`);
  }
  const mw = minimumWageRows();
  for (const [y, nlw, hrs, wks, pay, tf, share, ti] of rd("minimum_wage_and_allowance.csv")) {
    const m = mw.find((x) => x.year === y)!;
    eq(nlw, m.nlw, `NLW ${y}`);
    eq(hrs, Math.round(FROZEN.pa / m.nlw), `hours ${y}`, 0.5);
    eq(wks, Number(m.weeksTaxFree.toFixed(1)), `weeks ${y}`);
    eq(pay, m.nlw * 1950, `pay ${y}`);
    eq(tf, m.tax, `tax ${y}`);
    eq(share, Number(m.taxShare.toFixed(1)), `share ${y}`);
    eq(ti, nlwTaxIndexed(y), `tax indexed ${y}`);
  }
  const now = thresholdsFor("2026/27");
  for (const [b, pay, bf, bi, e1, e5] of rd("same_real_pay_worker.csv")) {
    const x = sameRealPay(Number(b));
    eq(pay, Math.round(x.now), `pay ${b}`, 0.5);
    assert.equal(bf, x.bandNow.toLowerCase(), `band now ${b}`);
    assert.equal(bi, x.bandIndexed.toLowerCase(), `band indexed ${b}`);
    eq(e1, Math.round(incomeTax(x.now, FROZEN.pa, FROZEN.brl) - incomeTax(x.now, now.pa, now.brl)), `extra 2026/27 ${b}`, 0.5);
    eq(e5, Math.round(x.extraTax5yrs), `extra 5 years ${b}`, 0.5);
  }
  for (const [y, pf, pi, hf, hi] of rd("thresholds_frozen_vs_indexed.csv")) {
    const t = thresholdsFor(y);
    eq(pf, FROZEN.pa, `PA frozen ${y}`); eq(pi, t.pa, `PA indexed ${y}`);
    eq(hf, FROZEN.pa + FROZEN.brl, `40% frozen ${y}`); eq(hi, t.higherFrom, `40% indexed ${y}`);
  }
});
