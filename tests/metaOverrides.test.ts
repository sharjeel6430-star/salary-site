import { test } from "node:test";
import assert from "node:assert/strict";
import { SALARY_META_PAGES, HOURLY_META_PAGES, salaryMeta, hourlyMeta } from "../lib/metaOverrides.ts";
import { SALARY_PAGES } from "../lib/site.ts";
import { HOURLY_RATES } from "../lib/hourly.ts";

test("meta overrides: every listed page exists", () => {
  for (const s of SALARY_META_PAGES) assert.ok(SALARY_PAGES.includes(s), `salary page ${s}`);
  for (const r of HOURLY_META_PAGES) assert.ok(HOURLY_RATES.includes(r), `hourly page ${r}`);
});

test("meta overrides: titles 60 characters or less, descriptions 160 or less", () => {
  for (const m of [...SALARY_META_PAGES.map(salaryMeta), ...HOURLY_META_PAGES.map(hourlyMeta)]) {
    assert.ok(m!.title.length <= 60, `${m!.title} (${m!.title.length})`);
    assert.ok(m!.description.length <= 160, `${m!.description} (${m!.description.length})`);
  }
});

test("meta overrides: figures as approved on 19 Nov 2026", () => {
  assert.equal(salaryMeta(26500)!.title, "£26,500 After Tax UK 2026/27: £22,600 a Year, £1,883 a Month");
  assert.equal(hourlyMeta(16.5)!.title, "£16.50 an Hour = £32,175 a Year (£26,686 After Tax) 2026/27");
  assert.equal(salaryMeta(40000), null);
  assert.equal(hourlyMeta(15), null);
});
