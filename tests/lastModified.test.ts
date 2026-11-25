// Sitemap dates: the pages changed on 19 Nov 2026 get that date; the rest keep the baseline.
import { test } from "node:test";
import assert from "node:assert/strict";
import { lastModified, CHANGED_PATHS, BASELINE_DATE } from "../lib/lastModified.ts";

test("sitemap dates: 237 changed pages, everything else on the baseline date", () => {
  assert.equal(CHANGED_PATHS.length, 237); // v22 adds /child-benefit-calculator to the 2026-11-24 set
  assert.equal(lastModified("/national-insurance-calculator").toISOString().slice(0, 10), "2026-11-21");
  assert.equal(lastModified("/research/income-tax-threshold-freeze-2026").toISOString().slice(0, 10), "2026-11-20");
  assert.equal(lastModified("/").toISOString().slice(0, 10), "2026-11-20");
  assert.equal(lastModified("/salary/40000-after-tax").toISOString().slice(0, 10), "2026-11-24");
  assert.equal(lastModified("/hourly/16-50-an-hour").toISOString().slice(0, 10), "2026-11-24");
  assert.equal(lastModified("/salary/41000-after-tax").toISOString().slice(0, 10), "2026-11-24");
  assert.equal(lastModified("/hourly/12-50-an-hour").toISOString().slice(0, 10), "2026-11-19");
  assert.equal(lastModified("/hourly/11-an-hour").toISOString().slice(0, 10), BASELINE_DATE);
  assert.equal(lastModified("/mileage-calculator").toISOString().slice(0, 10), BASELINE_DATE);
});
