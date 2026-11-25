// Re-checks every figure written into lib/pageCopy.ts against the calculator, NHS and teacher pay data.
// Fails each April until the text is updated to the new rates.
import { test } from "node:test";
import assert from "node:assert/strict";
import { SALARY_COPY, HOURLY_COPY } from "../lib/pageCopy.ts";
import { calculate, TAX_YEAR } from "../lib/tax.ts";
import { NHS_BANDS, nhsPensionRate } from "../lib/nhs.ts";
import { TEACHER_PAY } from "../lib/teachers.ts";
import { MEDIAN_FULL_TIME, MIN_WAGE, SALARY_PAGES } from "../lib/site.ts";
import { HOURLY_RATES } from "../lib/hourly.ts";
import { scotlandCrossover } from "../lib/takeHomeData.ts";

const FT = 37.5 * 52;
const money = (n: number, dp = 0) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const m2 = (n: number) => money(n, 2);
const calc = (g: number, o: Record<string, unknown> = {}) => calculate({ gross: g, ...o });
const th = (g: number, o: Record<string, unknown> = {}) => calc(g, o).takeHome;
const loan = (g: number, plan: string) => calc(g, { studentPlan: plan }).studentLoan;
const point = (band: string, label: string) => NHS_BANDS.find((b) => b.name === band)!.points.find((p) => p.label === label)!.salary;
const nhsMonthly = (s: number) => th(s, { pensionPercent: nhsPensionRate(s) * 100, pensionType: "netpay" }) / 12;
const higherFrom = TAX_YEAR.personalAllowance + TAX_YEAR.bands.ruk[0].upTo;
const scotHigherFrom = TAX_YEAR.personalAllowance + TAX_YEAR.bands.scotland[3 - 1].upTo + 1;

const all = (c: { example: string; edge: string; faqs: { q: string; a: string }[] }) =>
  [c.example, c.edge, ...c.faqs.map((f) => `${f.q} ${f.a}`)].join(" ");
const sHas = (s: number, phrase: string) => assert.ok(all(SALARY_COPY[s]).includes(phrase), `£${s} copy should say "${phrase}"\n${all(SALARY_COPY[s])}`);
const hHas = (r: number, phrase: string) => assert.ok(all(HOURLY_COPY[r]).includes(phrase), `£${r}/hr copy should say "${phrase}"\n${all(HOURLY_COPY[r])}`);

test("page copy: 21 salary and 6 hourly pages, all real pages, 2–3 FAQs each, no banned phrases", () => {
  assert.equal(Object.keys(SALARY_COPY).length, 21);
  assert.equal(Object.keys(HOURLY_COPY).length, 6);
  for (const s of Object.keys(SALARY_COPY)) assert.ok(SALARY_PAGES.includes(Number(s)), s);
  for (const r of Object.keys(HOURLY_COPY)) assert.ok(HOURLY_RATES.includes(Number(r)), r);
  const banned = /fast-paced|is important|delve|navigat|landscape|position \d|ranks at|gets a click/i;
  for (const c of [...Object.values(SALARY_COPY), ...Object.values(HOURLY_COPY)]) {
    assert.ok(c.faqs.length >= 2 && c.faqs.length <= 3);
    assert.ok(!banned.test(all(c)), all(c));
    assert.ok(c.link.href.startsWith("/"));
  }
});

test("page copy: every monthly take-home, tax and NI figure matches the calculator", () => {
  for (const [k, c] of Object.entries(SALARY_COPY)) {
    const s = Number(k);
    const r = calc(s);
    assert.ok(c.faqs[0].a.startsWith(`${m2(r.takeHome / 12)} a month`), `${s}: ${c.faqs[0].a}`);
    const taxFaq = c.faqs.find((f) => f.q.startsWith("How much tax"));
    if (taxFaq) assert.ok(taxFaq.a.startsWith(`${money(r.incomeTax)} Income Tax and ${m2(r.nationalInsurance)} National Insurance`), `${s}: ${taxFaq.a}`);
    const hrFaq = c.faqs.find((f) => f.q.includes("an hour"));
    if (hrFaq) assert.ok(hrFaq.a.includes(m2(s / FT)), `${s}: ${hrFaq.a}`);
  }
  for (const [k, c] of Object.entries(HOURLY_COPY)) {
    const rate = Number(k);
    const r = calc(rate * FT);
    assert.ok(c.faqs[0].a.startsWith(`${money(rate * FT)} a year`) && c.faqs[0].a.includes(`${money(rate * 40 * 52)} on a 40-hour week`), c.faqs[0].a);
    assert.ok(c.faqs[1].a.startsWith(`${m2(r.takeHome / 12)} a month`), c.faqs[1].a);
    assert.ok(c.faqs[2].a.startsWith(`${m2(r.takeHome / 52)} a week`) && c.faqs[2].a.includes(m2(rate * 37.5)), c.faqs[2].a);
  }
  sHas(16500, `${money(16500 / 12)} a month, and ${m2(calc(16500).incomeTax / 12)} goes in Income Tax and ${m2(calc(16500).nationalInsurance / 12)}`);
  sHas(17500, `${m2((calc(17500).incomeTax + calc(17500).nationalInsurance) / 12)} a month in total`);
  sHas(17500, `from ${m2(17500 / 12)} gross`);
  sHas(24000, `or ${m2(24000 / 2080)} on a 40-hour week`);
  sHas(26500, `${m2(calc(26500).takeHome / 52)} a week`);
  sHas(52500, `${m2(calc(52500).takeHome / 12)} a month`);
});

test("page copy: pay rises, bonuses and marginal rates", () => {
  const perMonth = (a: number, b: number) => (th(b) - th(a)) / 12;
  sHas(16500, `${Math.round((th(16500) / 16500) * 100)}% of your pay`);
  sHas(17500, `you keep ${Math.round((th(17500) / 17500) * 100)}%`);
  sHas(24000, `keep ${Math.round((th(24000) / 24000) * 100)}% of £24,000`);
  sHas(24500, `adds ${money(th(24500) - th(24000))} a year, or ${money(perMonth(24000, 24500))} a month`);
  sHas(25500, `a £1,000 bonus is worth ${money(th(26500) - th(25500))}`);
  sHas(27500, `adds ${money(perMonth(26500, 27500))} a month`);
  sHas(31500, `adds ${money(perMonth(30500, 31500))} a month`);
  sHas(31500, `another ${m2((loan(31500 + 1000, "plan2") - loan(31500, "plan2")) / 12)} a month`);
  sHas(34500, `adds ${money(perMonth(34000, 34500))} a month`);
  const pensionStep = (th(34500, { pensionPercent: 5, pensionType: "netpay" }) - th(34500, { pensionPercent: 6, pensionType: "netpay" })) / 12;
  sHas(34500, `costs about ${money(pensionStep)} a month`);
  sHas(34500, `about ${money(perMonth(34000, 34500) - pensionStep)} more`);
  sHas(35500, `${m2(th(35000))}, so the extra £500 here adds ${money(th(35500) - th(35000))} a year`);
  sHas(35500, `${money(higherFrom - 35500)} below`);
  sHas(35500, `A £2,000 bonus is worth ${money(th(37500) - th(35500))}`);
  sHas(38500, `adds ${money(perMonth(37500, 38500))} a month`);
  sHas(41500, `adds ${money(perMonth(39500, 41500))} a month`);
  sHas(41500, `${money(higherFrom - 41500)} below`);
  sHas(45500, `adds ${money(perMonth(45500, 46500))} a month, the same as at £25,000`);
  assert.equal(Math.round(perMonth(25000, 26000) * 100), Math.round(perMonth(45500, 46500) * 100));
  sHas(47500, `${money(higherFrom - 47500)} below`);
  sHas(47500, `you keep ${m2(th(50500) - th(47500))} of it`);
  sHas(52500, `${money(52500 - higherFrom)} above`);
  sHas(52500, `adds only ${m2(perMonth(52500, 53500))} a month`);
  assert.equal(Math.round(calc(52500).marginalRate * 100), 42);
  assert.equal(Math.round(calc(45500).marginalRate * 100), 28);
});

test("page copy: pensions and salary sacrifice", () => {
  const net5 = (s: number) => (th(s) - th(s, { pensionPercent: 5, pensionType: "netpay" })) / 12;
  const ss5 = (s: number) => (th(s) - th(s, { pensionPercent: 5, pensionType: "sacrifice" })) / 12;
  sHas(24000, `falls by ${money(net5(24000))} a month`);
  sHas(24000, `falls by only ${money(ss5(24000))}`);
  sHas(30500, `about ${money(net5(30500))} a month`);
  sHas(36500, `about ${money(net5(36500))} a month`);
  const sac2000 = (s: number) => (th(s) - th(s, { pensionPercent: (2000 / s) * 100 })) / 12;
  sHas(38500, `falls by ${money(sac2000(38500))} a month, while ${m2(2000 / 12)}`);
  sHas(38500, `The ${m2(2000 / 12 - sac2000(38500))} difference`);
  sHas(41500, `cost ${money(sac2000(41500))} a month`);
  const r = calc(45500), s5 = calc(45500, { pensionPercent: 5 });
  sHas(45500, `${m2(45500 * 0.05 / 12)} a month`);
  sHas(45500, `saves you ${money(r.incomeTax - s5.incomeTax)} Income Tax and ${money(r.nationalInsurance - s5.nationalInsurance)} National Insurance`);
  sHas(45500, `falls by ${m2(ss5(45500))} a month`);
  sHas(45500, `about ${m2(net5(45500))}`);
  hHas(18.5, `${m2((18.5 * FT * 0.05) / 12)} a month`);
  hHas(18.5, `about ${money(net5(18.5 * FT))} a month`);
  const above = 27.5 * FT - higherFrom;
  hHas(27.5, `${money(above)} of your full-time pay`);
  const saving = (above - (th(27.5 * FT) - th(27.5 * FT, { pensionPercent: (above / (27.5 * FT)) * 100 }))) / 12;
  hHas(27.5, `about ${money(saving)} a month`);
  sHas(31500, "Higher-rate taxpayers save 42%");
});

test("page copy: student loans", () => {
  const T = TAX_YEAR.studentLoans;
  sHas(17500, `${money(T.plan5.threshold)} on Plan 5, ${money(T.plan1.threshold)} on Plan 1 and ${money(T.plan2.threshold)} on Plan 2`);
  assert.equal(loan(17500, "plan5"), 0);
  sHas(25500, `which is ${money(loan(25500, "plan5"))} a year`);
  sHas(25500, `start at ${money(T.plan1.threshold)}, so more than ${money(T.plan1.threshold - 25500)} of overtime`);
  sHas(27500, `you repay ${money(loan(27500, "plan1"))} a year (${m2(loan(27500, "plan1") / 12)} a month)`);
  sHas(27500, `so you repay ${money(loan(27500, "plan5"))} a year`);
  sHas(30500, `9% of ${money(30500 - T.plan2.threshold)}: ${m2(loan(30500, "plan2"))} a year, about ${m2(loan(30500, "plan2") / 12)} a month`);
  sHas(30500, `about ${money(loan(30500, "plan1") / 12)} a month on Plan 1, ${m2(loan(30500, "plan2") / 12)} on Plan 2 and ${m2(loan(30500, "plan5") / 12)} on Plan 5`);
  sHas(30500, `Plan 4 (Scotland) starts at ${money(T.plan4.threshold)}`);
  sHas(33500, `about ${m2(loan(33500, "plan1") / 12)} a month, on Plan 2 about ${m2(loan(33500, "plan2") / 12)}`);
  assert.equal(loan(33500, "plan4"), 0);
  sHas(38500, `about ${m2((perMonthRaise(37500) - (loan(38500, "plan2") - loan(37500, "plan2")) / 12))} of it`);
  hHas(14.5, `about ${money(loan(14.5 * 40 * 52, "plan2") / 12)} a month at 40 hours`);
  assert.equal(loan(14.5 * FT, "plan2"), 0);
  hHas(16.5, `about ${money(loan(16.5 * FT, "plan2") / 12)} a month on Plan 2, ${money(loan(16.5 * FT, "plan1") / 12)} on Plan 1 and ${money(loan(16.5 * FT, "plan5") / 12)} on Plan 5`);
});
function perMonthRaise(from: number) {
  return (th(from + 1000) - th(from)) / 12;
}

test("page copy: Scotland", () => {
  const gap = (s: number) => th(s, { region: "scotland" }) - th(s);
  sHas(16500, `${m2(th(16500, { region: "scotland" }))} a year, ${m2(gap(16500))} more`);
  assert.ok(16500 - TAX_YEAR.personalAllowance <= TAX_YEAR.bands.scotland[0].upTo);
  sHas(32500, `about ${money(gap(32500))} a year more`);
  sHas(32500, `income above ${money(TAX_YEAR.personalAllowance + TAX_YEAR.bands.scotland[1].upTo)}`);
  sHas(32500, `cross at ${money(scotlandCrossover())}`);
  sHas(33500, `crossover of ${money(scotlandCrossover())}`);
  sHas(33500, `the gap is ${Math.round(-gap(33500) * 100)}p a year, but by £43,500 it is ${money(-gap(43500))}`);
  sHas(36500, `only ${money(-gap(36500))} a year lower`);
  sHas(36500, `starts at ${money(scotHigherFrom)}`);
  sHas(43500, `starts at ${money(scotHigherFrom)}, just ${money(scotHigherFrom - 43500)} above`);
  const keepScot = 1 - calc(scotHigherFrom + 500, { region: "scotland" }).marginalRate;
  sHas(43500, `keeps only ${Math.round(keepScot * 100)}p`);
  sHas(52500, `starts at ${money(scotHigherFrom)}`);
});

test("page copy: NHS, teacher, minimum wage and median figures", () => {
  sHas(26500, `pays ${money(point("Band 3", "Entry"))} to ${money(point("Band 3", "Top"))}`);
  assert.equal(nhsPensionRate(26500), 0.065);
  sHas(26500, `about ${money((th(26500) / 12) - nhsMonthly(26500))} a month, to ${m2(nhsMonthly(26500))}`);
  sHas(30500, `Band 5 starts at ${money(point("Band 5", "Entry"))}`);
  sHas(32500, `(${(nhsPensionRate(point("Band 5", "Entry")) * 100).toFixed(1)}% at that pay) a newly qualified nurse takes home about ${money(nhsMonthly(point("Band 5", "Entry")))}`);
  sHas(36500, `Band 5 intermediate (${money(point("Band 5", "Intermediate"))}) and top (${money(point("Band 5", "Top"))})`);
  sHas(36500, `M2 (${money(TEACHER_PAY.england.M2)}) and M3 (${money(TEACHER_PAY.england.M3)})`);
  sHas(39500, `tops out at ${money(point("Band 5", "Top"))}`);
  sHas(39500, `about ${money(nhsMonthly(point("Band 5", "Top")))} a month`);
  sHas(43500, `M5 in England (${money(TEACHER_PAY.england.M5)})`);
  sHas(43500, `intermediate point (${money(point("Band 6", "Intermediate"))})`);
  sHas(43500, `about ${money(nhsMonthly(43500))} a month`);
  assert.equal(nhsPensionRate(43500), 0.098);
  sHas(16500, `(${m2(MIN_WAGE.nlw)} an hour) comes to ${money(25 * MIN_WAGE.nlw * 52)} a year`);
  sHas(24000, `pays ${m2(MIN_WAGE.nlw * FT)}`);
  sHas(17500, `${money(20 * 16.8 * 52)} a year`);
  for (const s of [16500, 24000, 33500]) sHas(s, money(MEDIAN_FULL_TIME.amount));
  sHas(33500, `about ${Math.round((33500 / MEDIAN_FULL_TIME.amount) * 100)}% of the UK full-time median`);
  hHas(13.5, `National Living Wage (${m2(MIN_WAGE.nlw)})`);
  hHas(13.5, "£14.10 an hour (£15.45 in London)");
  assert.ok(13.5 < 14.1);
});

test("page copy: hourly 40-hour weeks and rises", () => {
  const m40 = (r: number) => th(r * 40 * 52) / 12;
  const extra = (r: number) => (th(r * 40 * 52) - th(r * FT)) / 12;
  hHas(13.5, `${money(13.5 * 40 * 52)} a year and about ${money(m40(13.5))} a month`);
  hHas(13.5, `add about ${money(extra(13.5))} a month`);
  hHas(14.5, `${money(14.5 * 40 * 52)} a year, about ${money(m40(14.5))} a month`);
  hHas(14.5, `adds ${m2((th(15 * FT) - th(14.5 * FT)) / 12)} a month`);
  hHas(14.5, `or ${money(th(15 * FT) - th(14.5 * FT))} a year`);
  hHas(16.5, `about ${money(m40(16.5))} a month`);
  hHas(16.5, `add about ${money(extra(16.5))} a month`);
  hHas(17.5, `about ${money(m40(17.5))} a month`);
  hHas(17.5, `worth about ${money((th(17.5 * FT) - th(16.5 * FT)) / 12)} a month`);
  hHas(18.5, `about ${money(m40(18.5))} a month`);
  hHas(18.5, `adds ${m2(18.5 * (1 - calc(18.5 * FT).marginalRate))} after tax`);
  hHas(27.5, `about ${money(m40(27.5))} a month`);
  hHas(27.5, `add about ${money(extra(27.5))} a month`);
});
