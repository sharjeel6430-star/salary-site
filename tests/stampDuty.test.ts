// Property purchase taxes, checked against the worked examples on GOV.UK, gov.wales and by hand.
import { test } from "node:test";
import assert from "node:assert/strict";
import { propertyTax } from "../lib/stampDuty.ts";

const t = (price: number, nation: "england" | "scotland" | "wales", buyer: "mover" | "first" | "additional", nonResident = false) =>
  Math.round(propertyTax({ price, nation, buyer, nonResident }).tax * 100) / 100;

test("SDLT: GOV.UK examples", () => {
  assert.equal(t(295000, "england", "mover"), 4750);
  assert.equal(t(500000, "england", "first"), 10000);
});

test("SDLT: bands, first-time buyer cap, surcharges", () => {
  assert.equal(t(125000, "england", "mover"), 0);
  assert.equal(t(1000000, "england", "mover"), 2500 + 33750 + 7500); // 43,750
  assert.equal(t(2000000, "england", "mover"), 2500 + 33750 + 57500 + 60000); // 153,750
  assert.equal(t(300000, "england", "first"), 0);
  assert.equal(t(510000, "england", "first"), t(510000, "england", "mover")); // relief lost above £500,000
  assert.equal(propertyTax({ price: 510000, nation: "england", buyer: "first" }).ftbLostOverCap, true);
  assert.equal(t(250000, "england", "additional"), 250000 * 0.05 + 2500); // 5% on all + 2% band = 15,000
  assert.equal(t(39999, "england", "additional"), 0); // higher rates start at £40,000
  assert.equal(t(250000, "england", "mover", true), 2500 + 250000 * 0.02); // non-resident +2%
  assert.equal(t(400000, "england", "first", true), 5000 + 400000 * 0.02); // non-resident first-time buyer
});

test("LTT (Wales): gov.wales examples", () => {
  assert.equal(t(350000, "wales", "mover"), 7500);
  assert.equal(t(1700000, "wales", "mover"), 135750);
  assert.equal(t(280000, "wales", "mover"), 3300);
  assert.equal(t(260000, "wales", "additional"), 15950);
  assert.equal(t(330000, "wales", "additional"), 22950);
  assert.equal(t(300000, "wales", "first"), t(300000, "wales", "mover")); // no first-time buyer relief
});

test("LBTT (Scotland): bands, first-time buyer relief, ADS", () => {
  assert.equal(t(300000, "scotland", "mover"), 2100 + 2500); // 4,600
  assert.equal(t(300000, "scotland", "first"), 1500 + 2500); // 4,000: relief worth £600
  assert.equal(propertyTax({ price: 300000, nation: "scotland", buyer: "first" }).ftbSaving, 600);
  assert.equal(t(300000, "scotland", "additional"), 4600 + 24000); // ADS 8% of the whole price
  assert.equal(t(800000, "scotland", "mover"), 2100 + 3750 + 42500 + 6000);
});
