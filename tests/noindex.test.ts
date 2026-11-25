// Off-topic tools are hidden from search engines: noindex on each page, and none of them in the sitemap list.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { NOINDEX_TOOLS, TOOLS } from "../lib/tools.ts";

test("noindex: the five off-topic tools, and only those", () => {
  assert.deepEqual([...NOINDEX_TOOLS].sort(), ["/as-the-crow-flies-distance-calculator", "/bmi-calculator", "/steps-to-miles-calculator", "/tdee-calculator", "/university-grade-calculator"]);
  for (const h of NOINDEX_TOOLS) {
    assert.ok(TOOLS.some((t) => t.href === h), `${h} is still a listed tool`);
    assert.match(readFileSync(new URL(`../app${h}/page.tsx`, import.meta.url), "utf8"), /robots: NOINDEX/, h);
  }
  for (const h of ["/mileage-calculator", "/fuel-cost-calculator"]) assert.ok(!NOINDEX_TOOLS.includes(h), `${h} stays indexed`);
});
