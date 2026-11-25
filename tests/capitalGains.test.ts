// Capital Gains Tax 2026/27, checked against GOV.UK's two worked examples and worked by hand.
import { test } from "node:test";
import assert from "node:assert/strict";
import { capitalGainsTax } from "../lib/capitalGains.ts";

const r2 = (x: number) => Math.round(x * 100) / 100;
const PA = 12570;

test("CGT: GOV.UK example 1 (taxable income £20,000, gain £12,600)", () => {
  const r = capitalGainsTax({ income: 20000 + PA, salePrice: 12600, purchasePrice: 0 });
  assert.equal(r.taxableGains, 9600);
  assert.equal(r2(r.tax), 1728);
});

test("CGT: GOV.UK example 2 (taxable income £20,000, gain £52,600)", () => {
  const r = capitalGainsTax({ income: 20000 + PA, salePrice: 52600, purchasePrice: 0 });
  assert.equal(r.at18, 17700);
  assert.equal(r.at24, 31900);
  assert.equal(r2(r.tax), 10842);
});

test("CGT: higher-rate taxpayer, costs, allowance", () => {
  const r = capitalGainsTax({ income: 60000, salePrice: 250000, purchasePrice: 180000, costs: 10000, assetType: "residential" });
  assert.equal(r.gain, 60000);
  assert.equal(r2(r.tax), (60000 - 3000) * 0.24);
  assert.equal(r.reportWithin60Days, true);
  const small = capitalGainsTax({ income: 30000, salePrice: 5000, purchasePrice: 2500 });
  assert.equal(small.tax, 0); // under the £3,000 allowance
});

test("CGT: no income means the full basic band is free", () => {
  const r = capitalGainsTax({ income: 0, salePrice: 40700, purchasePrice: 0 });
  assert.equal(r2(r.tax), 37700 * 0.18);
});

test("CGT: personal allowance taper reduces the band left", () => {
  const r = capitalGainsTax({ income: 110000, salePrice: 13000, purchasePrice: 0 });
  assert.equal(r2(r.tax), 10000 * 0.24);
});

test("CGT: Business Asset Disposal Relief at 18% for a higher-rate taxpayer", () => {
  const r = capitalGainsTax({ income: 80000, salePrice: 203000, purchasePrice: 0, badr: true, assetType: "business" });
  assert.equal(r2(r.tax), 200000 * 0.18);
  // BADR gain uses the basic band first, so other gains are pushed to 24%
  const mix = capitalGainsTax({ income: 20000 + PA, salePrice: 20000, purchasePrice: 0, badr: true, otherGains: 20000 });
  // allowance against the normal gain: normal 17,000; BADR 20,000 uses band (17,700) first -> 0 left -> normal all at 24%
  assert.equal(r2(mix.tax), r2(20000 * 0.18 + 17000 * 0.24));
});

test("CGT: losses", () => {
  const loss = capitalGainsTax({ income: 60000, salePrice: 8000, purchasePrice: 10000, otherGains: 10000 });
  assert.equal(loss.gain, -2000);
  assert.equal(r2(loss.tax), (10000 - 2000 - 3000) * 0.24);
  assert.equal(r2(loss.taxOnThisAsset), -480); // the loss saves £480
  const bf = capitalGainsTax({ income: 60000, salePrice: 10000, purchasePrice: 0, lossesBroughtForward: 20000 });
  assert.equal(bf.broughtForwardUsed, 7000); // only down to the £3,000 allowance
  assert.equal(bf.tax, 0);
  assert.equal(bf.lossCarriedForward, 13000);
});
