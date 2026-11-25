// The 39 shortened titles (lib/titleOverrides.ts): length limit, and every page actually uses its title.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { SHORT_TITLES } from "../lib/titleOverrides.ts";

const file = (p: string) => new URL(`../${p}`, import.meta.url);

test("short titles: 44 pages, each 60 characters or less", () => {
  assert.equal(Object.keys(SHORT_TITLES).length, 44);
  for (const [path, t] of Object.entries(SHORT_TITLES)) assert.ok(t.length <= 60, `${path}: ${t.length} characters`);
});

test("short titles: each page uses its short title", () => {
  for (const path of Object.keys(SHORT_TITLES)) {
    if (path === "/") { assert.match(readFileSync(file("app/layout.tsx"), "utf8"), /SHORT_TITLES\["\/"\]/); continue; }
    if (path.startsWith("/guides/")) { assert.match(readFileSync(file("app/guides/[slug]/page.tsx"), "utf8"), /SHORT_TITLES\[`\/guides\/\$\{g\.slug\}`\]/); continue; }
    const f = file(`app${path}/page.tsx`);
    assert.ok(existsSync(f), path);
    assert.ok(readFileSync(f, "utf8").includes(`shortTitle("${path}")`), `${path} should use shortTitle`);
  }
});
