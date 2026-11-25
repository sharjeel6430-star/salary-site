// The data page (/data/uk-take-home-pay-2026-27) and its CSV.
import { test } from "node:test";
import assert from "node:assert/strict";
import { takeHomeTable, takeHomeCsv, headlineFacts } from "../lib/takeHomeData.ts";
import { calculate } from "../lib/tax.ts";

test("take-home data: 136 rows from £15k to £150k, matching the calculator", () => {
  const rows = takeHomeTable();
  assert.equal(rows.length, 136);
  assert.equal(rows[0].salary, 15000);
  assert.equal(rows.at(-1)!.salary, 150000);
  for (const r of rows) assert.equal(r.takeHome, calculate({ gross: r.salary }).takeHome);
  const csv = takeHomeCsv().trim().split("\n");
  assert.equal(csv.length, 137);
  assert.equal(csv[0], "salary,income_tax,ni,take_home,monthly,effective_rate,marginal_rate,scotland_take_home,scotland_diff,plan2,plan5");
});

test("take-home data: headline figures", () => {
  const f = headlineFacts();
  assert.equal(f.taperMarginal, 62);
  assert.equal(Math.round(f.taperGain), 9553);
  assert.equal(f.taperKeepPence, 38);
  assert.equal(f.scotlandCrossover, 33494);
  assert.equal(f.doublingRatio, 1.8);
  // The crossover really is the switch point.
  const gap = (s: number) => calculate({ gross: s, region: "scotland" }).takeHome - calculate({ gross: s }).takeHome;
  assert.ok(gap(33493) >= 0 && gap(33494) < 0);
});
