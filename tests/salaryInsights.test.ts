// Re-checks the figures written into lib/salaryInsights.ts. If rates change (each April), this fails
// until the text is updated to match.
import { test } from "node:test";
import assert from "node:assert/strict";
import { SALARY_INSIGHTS } from "../lib/salaryInsights.ts";
import { calculate } from "../lib/tax.ts";
import { teacherTakeHome, TEACHER_PAY } from "../lib/teachers.ts";
import { NHS_BANDS, nhsPensionRate } from "../lib/nhs.ts";
import { childBenefitYearly } from "../lib/childBenefit.ts";

const th = (g: number, o: Parameters<typeof calculate>[0] extends infer T ? Partial<T> : never = {}) => calculate({ gross: g, ...o }).takeHome;
const text = (s: number) => SALARY_INSIGHTS.find((i) => i.salary === s)!.text;
const has = (s: number, phrase: string) => assert.ok(text(s).includes(phrase), `£${s} text should say "${phrase}"`);
const money = (n: number, dp = 0) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const scotGap = (s: number) => th(s) - th(s, { region: "scotland" });
const point = (band: string, label: string) => NHS_BANDS.find((b) => b.name === band)!.points.find((p) => p.label === label)!.salary;

test("salary insights: 20 unique pages, each with a heading and text", () => {
  assert.equal(SALARY_INSIGHTS.length, 20);
  assert.equal(new Set(SALARY_INSIGHTS.map((i) => i.salary)).size, 20);
  for (const i of SALARY_INSIGHTS) assert.ok(i.heading.length > 10 && i.text.length > 150, String(i.salary));
});

test("salary insights: Scotland differences", () => {
  has(50000, `take home ${money(Math.round(scotGap(50000)))} a year less`);
  has(45000, `takes home ${money(Math.round(scotGap(45000)))} a year less`);
  has(45000, `about ${money(Math.round(scotGap(42000)))} at £42,000`);
  has(55000, `take home ${money(Math.round(scotGap(55000)))} a year less`);
  has(70000, `takes home ${money(Math.round(scotGap(70000)))} a year less`);
  has(100000, `take home ${money(Math.round(scotGap(100000)))} a year less`);
  has(38000, `pay ${money(Math.round(scotGap(38000)))} a year more`);
  has(33000, `just ${money(-scotGap(33000), 2)} a year more`);
  has(34000, `just ${money(Math.round(scotGap(34000)))} a year less`);
});

test("salary insights: student loans, sacrifice and pay rises", () => {
  const loan = (s: number, plan: "plan2" | "plan5") => calculate({ gross: s, studentPlan: plan }).studentLoan;
  has(40000, `about ${money(Math.round(loan(40000, "plan2")))} a year`);
  has(35000, `about ${money(Math.round(loan(35000, "plan2")))} a year`);
  has(36000, `about ${money(Math.round(loan(36000, "plan2")))} a year`);
  has(30000, `about ${money(Math.round(loan(30000, "plan2")))} a year (${money(loan(30000, "plan2") / 12, 2)} a month)`);
  has(28000, `takes about ${money(loan(28000, "plan5"))} a year`);
  has(50000, `adds only ${money(Math.round(th(55000) - th(50000)))} a year`);
  const sac = (s: number) => [calculate({ gross: s, pensionPercent: 5, pensionType: "sacrifice" }), th(s)] as const;
  const [s32, b32] = sac(32000); has(32000, `by ${money(Math.round(b32 - s32.takeHome))} a year while putting ${money(s32.pension)}`);
  const [s55, b55] = sac(55000); has(55000, `puts ${money(s55.pension)} into your pension and costs you only ${money(Math.round(b55 - s55.takeHome))}`);
});

test("salary insights: NHS, teacher and Child Benefit figures", () => {
  has(32000, `about ${money(Math.round(calculate({ gross: 32073, pensionPercent: nhsPensionRate(32073) * 100, pensionType: "netpay" }).takeHome / 12))} a month`);
  has(34000, `about ${money(Math.round(teacherTakeHome(TEACHER_PAY.england.M1).takeHome / 12))} a month, versus ${money(Math.round(th(34000) / 12))}`);
  has(33000, `about ${money(Math.round(th(33000) / 12 - teacherTakeHome(TEACHER_PAY.england.M1).takeHome / 12))} a month lower for a teacher`);
  has(33000, `${money(Math.round(th(33000) / 12 - calculate({ gross: 32073, pensionPercent: nhsPensionRate(32073) * 100, pensionType: "netpay" }).takeHome / 12))} a month lower at NHS Band 5`);
  for (const [s, band, label] of [[40000, "Band 6", "Entry"], [42000, "Band 6", "Intermediate"], [38000, "Band 5", "Top"], [60000, "Band 8a", "Intermediate"], [70000, "Band 8b", "Intermediate"], [55000, "Band 7", "Top"], [35000, "Band 5", "Intermediate"]] as const)
    has(s, money(point(band, label)));
  for (const [s, p] of [[40000, "M4"], [36000, "M2"], [38000, "M3"], [34000, "M1"], [33000, "M1"]] as const) has(s, money(TEACHER_PAY.england[p]));
  has(70000, `(${money(Math.round(childBenefitYearly(2) / 2))} a year)`);
  has(65000, `the ${money(Math.round(childBenefitYearly(2)))} a year Child Benefit, roughly ${money(Math.round(childBenefitYearly(2) * 0.25))}`);
});
