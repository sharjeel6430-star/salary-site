import { test } from "node:test";
import assert from "node:assert/strict";
import { normalize, tokens, prepare, search } from "../lib/search.ts";

const INDEX = prepare([
  { u: "/salary/30000-after-tax", t: "£30,000 After Tax 2026/27", d: "Take-home pay on £30,000.", h: "£30,000 after tax", x: "On a £30,000 salary you take home £25,119.60 a year." },
  { u: "/salary/35000-after-tax", t: "£35,000 After Tax 2026/27", d: "Take-home pay on £35,000.", h: "£35,000 after tax", x: "On a £35,000 salary you take home £28,719.60 a year." },
  { u: "/nhs-pay-bands/band-5", t: "NHS Band 5 Pay 2026/27 After Tax", d: "Band 5 nurse pay.", h: "Band 5", x: "Band 5 nurses earn from £31,049." },
  { u: "/scotland-salary-calculator", t: "Scotland Salary Calculator 2026/27", d: "Scottish Income Tax.", h: "Scottish tax bands", x: "Scottish taxpayers pay 19% to 48%." },
  { u: "/salary-needed-to-live-uk-cities", t: "Salary Needed to Live in UK Cities 2026/27", d: "London, Manchester and more.", h: "London vs the rest of the UK", x: "Rent in Manchester and London." },
]);

test("Search: normalize handles £, commas and k", () => {
  assert.equal(normalize("£30,000"), "30000");
  assert.equal(normalize("35k salary"), "35000 salary");
  assert.equal(normalize("12.71 an hour."), "12.71 an hour");
  assert.deepEqual(tokens("the salary in uk"), ["salary"]);
});

test("Search: salary amounts find the right page in any format", () => {
  for (const q of ["30000", "£30,000", "30k", "30,000 after tax"]) {
    assert.equal(search(INDEX, q)[0].entry.u, "/salary/30000-after-tax", q);
  }
});

test("Search: titles beat body text, and all words must match", () => {
  assert.equal(search(INDEX, "band 5")[0].entry.u, "/nhs-pay-bands/band-5");
  assert.equal(search(INDEX, "nurse")[0].entry.u, "/nhs-pay-bands/band-5");
  assert.equal(search(INDEX, "scot")[0].entry.u, "/scotland-salary-calculator");
  assert.equal(search(INDEX, "manchester")[0].entry.u, "/salary-needed-to-live-uk-cities");
  assert.equal(search(INDEX, "manchester nurse").length, 0);
  assert.equal(search(INDEX, "  ").length, 0);
});
