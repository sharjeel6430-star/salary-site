// Re-checks the figures written into lib/hourlyInsights.ts and the two worked-out FAQs (lib/hourlyFaqs.ts).
// Fails each April until the text is updated to the new rates.
import { test } from "node:test";
import assert from "node:assert/strict";
import { HOURLY_INSIGHTS, getHourlyInsight } from "../lib/hourlyInsights.ts";
import { minimumWageAnswer, payRiseAnswer } from "../lib/hourlyFaqs.ts";
import { calculate, TAX_YEAR } from "../lib/tax.ts";
import { NHS_BANDS, nhsPensionRate } from "../lib/nhs.ts";
import { minimumRate } from "../lib/minimumWage.ts";
import { MEDIAN_FULL_TIME } from "../lib/site.ts";
const MEDIAN = MEDIAN_FULL_TIME.amount;

const FT = 37.5 * 52; // full-time hours a year used across the site
const money = (n: number, dp = 0) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const text = (r: number) => getHourlyInsight(r)!.text;
const has = (r: number, phrase: string) => assert.ok(text(r).includes(phrase), `£${r} text should say "${phrase}"\n${text(r)}`);
const th = (g: number, o: Record<string, unknown> = {}) => calculate({ gross: g, ...o }).takeHome;
const loan = (g: number, plan: "plan2" | "plan5") => calculate({ gross: g, studentPlan: plan }).studentLoan;
const nhsHr = (band: string, label: string) => money(NHS_BANDS.find((b) => b.name === band)!.points.find((p) => p.label === label)!.salary / 1950, 2);
const higherFrom = TAX_YEAR.personalAllowance + TAX_YEAR.bands.ruk[0].upTo;
const NLW = minimumRate("21plus");
const NLW_NEXT = minimumRate("21plus", "2027/28");
const pctAbove = (r: number) => `${Math.round((r / NLW - 1) * 100)}% above the National Living Wage`;

test("hourly insights: 20 unique rates with heading, text and links", () => {
  assert.equal(HOURLY_INSIGHTS.length, 20);
  assert.equal(new Set(HOURLY_INSIGHTS.map((i) => i.rate)).size, 20);
  for (const i of HOURLY_INSIGHTS) {
    assert.ok(i.heading.length > 10 && i.text.length > 150, String(i.rate));
    for (const l of i.links) assert.ok(l.href.startsWith("/") && l.label, `${i.rate} link`);
  }
});

test("hourly insights: minimum wage figures", () => {
  assert.equal(NLW, 12.71);
  assert.equal(NLW_NEXT, 13.21);
  assert.equal(minimumRate("18to20"), 10.85);
  assert.equal(minimumRate("18to20", "2027/28"), 11.27);
  for (const r of [16.5, 18.5, 15]) has(r, pctAbove(r));
  has(14.5, pctAbove(14.5));
  has(13.5, "79p above the National Living Wage and still 29p above the April 2027 rate");
  has(10.85, `underpaid by £1.86 an hour, or about ${money(Math.round((NLW - 10.85) * FT))} a year`);
  has(10.85, `${money(Math.round(10.85 * FT))} a year`);
  has(12.5, `about ${money(Math.round((NLW - 12.5) * FT))} a year full-time, or about ${money(Math.round((NLW - 12.5) * 16 * 52))} a year on 16 hours`);
  has(13, "29p above the 2026 National Living Wage (£12.71), but 21p below the £13.21");
  const rise = (NLW_NEXT - NLW) * FT;
  has(12.71, `adds ${money(Math.round(rise))} a year before tax and about ${money(Math.round(th(NLW_NEXT * FT) - th(NLW * FT)))} after tax`);
  has(12.71, `or ${money((th(NLW_NEXT * FT) - th(NLW * FT)) / 12, 2)} a month`);
  has(12.71, `about ${money(Math.round((NLW_NEXT - NLW) * 16 * 52))} a year before tax`);
  has(12.71, `${money(Math.round(NLW * FT))} is just under the Plan 5`);
});

test("hourly insights: NHS hourly equivalents", () => {
  has(16.5, `Band 5 entry (${nhsHr("Band 5", "Entry")} an hour)`);
  has(14.5, `Band 4 entry (${nhsHr("Band 4", "Entry")})`);
  has(17.5, `intermediate point (${nhsHr("Band 5", "Intermediate")})`);
  has(13.5, `Band 3 entry (${nhsHr("Band 3", "Entry")}) and Band 3 top (${nhsHr("Band 3", "Top")})`);
  has(21.5, `intermediate point (${nhsHr("Band 6", "Intermediate")})`);
  has(28, `Band 7 top (${nhsHr("Band 7", "Top")})`);
  has(19.5, `Band 5 top (${nhsHr("Band 5", "Top")})`);
  has(24.5, `Band 6 top (${nhsHr("Band 6", "Top")})`);
  has(27, `(${nhsHr("Band 7", "Entry")}–${nhsHr("Band 7", "Intermediate")} an hour)`);
  has(15.5, `Band 4 top (${nhsHr("Band 4", "Top")})`);
  has(20, `Band 5 top (${nhsHr("Band 5", "Top")})`);
  const b5 = NHS_BANDS.find((b) => b.name === "Band 5")!.points.find((p) => p.label === "Entry")!.salary;
  has(16.5, `takes home about ${money(Math.round(calculate({ gross: b5, pensionPercent: nhsPensionRate(b5) * 100, pensionType: "netpay" }).takeHome / 12))} a month rather than the ${money(Math.round(th(16.5 * FT) / 12))}`);
});

test("hourly insights: student loans", () => {
  has(16.5, `repays about ${money(Math.round(loan(16.5 * FT, "plan2")))} a year`);
  has(14.5, `Plan 5 graduates repay about ${money(Math.round(loan(14.5 * FT, "plan5")))} a year`);
  assert.equal(loan(14.5 * FT, "plan2"), 0);
  has(13.5, `about ${money(Math.round(loan(13.5 * FT, "plan5")))} a year (${money(Math.round(loan(13.5 * FT, "plan5") / 12))} a month)`);
  has(18.5, `repays about ${money(Math.round(loan(18.5 * FT, "plan2")))} a year`);
  has(15, `just ${money(29385 - 15 * FT)} below the Plan 2`);
  has(15, `about ${money(Math.round(loan(15 * FT, "plan5")))} a year`);
  has(15.5, `only about ${money(Math.round(loan(15.5 * FT, "plan2")))} a year, while Plan 5 graduates repay about ${money(Math.round(loan(15.5 * FT, "plan5")))}`);
  has(13, `repays about ${money(Math.round(loan(13 * FT, "plan5")))} a year`);
  assert.equal(loan(10.85 * FT, "plan5"), 0);
  assert.equal(loan(NLW * FT, "plan5"), 0);
});

test("hourly insights: higher-rate thresholds and overtime", () => {
  assert.equal(higherFrom, 50270);
  has(17.5, `${money(higherFrom - 17.5 * FT)} below the higher-rate threshold`);
  has(27.5, `${money(27.5 * FT - higherFrom)} into the higher-rate band`);
  has(27.5, `about ${money(27.5 * (1 - 0.42), 2)} after tax and NI`);
  has(27.5, `about ${Math.round((60000 - 27.5 * FT) / 27.5)} hours of overtime`);
  has(21.5, `${money(higherFrom - 21.5 * FT)} below the 40% band, which is around ${Math.round((higherFrom - 21.5 * FT) / 21.5)} hours`);
  has(28, `${money(28 * FT - higherFrom)} of your pay is taxed at 40%`);
  has(19.5, `${money(higherFrom - 19.5 * FT)} below the 40% tax band, so overtime of up to about ${Math.round((higherFrom - 19.5 * FT) / 19.5)} hours`);
  has(24.5, `just ${money(higherFrom - 24.5 * FT)} below`);
  has(24.5, `about ${Math.round((higherFrom - 24.5 * FT) / 24.5)} hours of overtime`);
  has(27, `so ${money(27 * FT - higherFrom)} of your pay is taxed at 40%`);
  has(27, `about ${money(27 * 0.58, 2)} after tax`);
  has(25, `${money(higherFrom - 25 * FT)} below the 40% band. Just ${Math.round((higherFrom - 25 * FT) / 25)} hours`);
  has(22, `starts at ${money(43663)}`);
  has(22, `only ${money(43663 - 22 * FT)} (about ${Math.round((43663 - 22 * FT) / 22)} hours`);
});

test("hourly insights: pay rises and other figures", () => {
  const rise = (r: number, o: Record<string, unknown> = {}) => money(Math.round((th((r + 1) * FT, o) - th(r * FT, o)) / 12));
  has(14.5, `adds about ${rise(14.5)} a month`);
  has(28, `adds about ${rise(28)} a month after tax, compared with ${rise(14.5)}`);
  has(15.5, `about ${rise(15.5)} a month after tax and NI, or about ${rise(15.5, { studentPlan: "plan2" })} if`);
  has(18.5, `about ${money(Math.round(th(18.5 * 16 * 52) / 12))} a month, and on 20 hours about ${money(Math.round(th(18.5 * 20 * 52) / 12))}`);
  has(18.5, `about ${Math.round((18.5 * FT) / MEDIAN * 100)}% of the median`);
  has(21.5, `about ${Math.round((21.5 * FT / MEDIAN - 1) * 100)}% above the median`);
  has(20, `${money(MEDIAN - 20 * FT)} below the median`);
  has(20, `about ${money(20 * 30 * 52)} a year`);
  has(25, `40 hours a week (${money(25 * 40 * 52)})`);
});

test("hourly FAQs: minimum wage and pay-rise answers", () => {
  assert.match(minimumWageAnswer(10.85), /exactly the minimum for 18 to 20 year olds/);
  assert.match(minimumWageAnswer(12.5), /21p/);
  const a25 = payRiseAnswer(25);
  assert.match(a25, /£50,270 higher-rate threshold/);
  assert.match(a25, new RegExp(money(Math.round(th(26 * FT) - th(25 * FT))).replace("£", "£")));
  for (const i of HOURLY_INSIGHTS) {
    assert.ok(minimumWageAnswer(i.rate).length > 40, `${i.rate} minimum wage answer`);
    assert.ok(payRiseAnswer(i.rate).length > 40, `${i.rate} pay rise answer`);
  }
});
