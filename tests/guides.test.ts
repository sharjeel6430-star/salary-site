// Re-checks the figures in the markdown guides (content/guides/*.md) against the calculator.
// Fails each April until the guides are updated to the new rates.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { calculate, TAX_YEAR } from "../lib/tax.ts";
import { NI_PERIODS, niForPeriod } from "../lib/nationalInsurance.ts";

const md = (f: string) => readFileSync(new URL(`../content/guides/${f}`, import.meta.url), "utf8");
const money = (n: number, dp = 0) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const row = (doc: string, first: string) => {
  const line = doc.split("\n").find((l) => l.startsWith("| " + first + " ") || l.startsWith("| " + first + "|"));
  assert.ok(line, `row starting "${first}"`);
  return line!.split("|").slice(1, -1).map((c) => c.trim());
};
const has = (doc: string, phrase: string) => assert.ok(doc.includes(phrase), `guide should say "${phrase}"`);
const PA = TAX_YEAR.personalAllowance;
const UEL = PA + TAX_YEAR.bands.ruk[0].upTo;

test("guides: tax bands table matches the calculator", () => {
  const doc = md("uk-tax-bands-additions.md");
  for (const s of [25000, 30000, 40000, 50000, 60000, 70000, 100000]) {
    const r = calculate({ gross: s });
    const c = row(doc, `[${money(s)}](/salary/${s}-after-tax)`);
    assert.deepEqual(c.slice(1, 4), [money(Math.round(r.incomeTax)), money(Math.round(r.nationalInsurance)), money(Math.round(r.takeHome))], `£${s}`);
    assert.equal(c[4], `${Math.round(r.marginalRate * 100)}%`, `£${s} marginal`);
  }
  has(doc, `40% on ${money(60000 - UEL)}`);
  has(doc, `rate is ${Math.round((calculate({ gross: 60000 }).incomeTax / 60000) * 100)}%`);
  has(doc, `${money(UEL - 50000)} below the ${money(UEL)}`);
});

test("guides: National Insurance tables and examples", () => {
  const doc = md("national-insurance-explained.md");
  assert.equal(UEL, 50270);
  const M = NI_PERIODS.find((x) => x.key === "month")!; // HMRC's published monthly thresholds
  has(doc, `up to ${money(M.pt)}`);
  has(doc, `${money(M.pt)} – ${money(M.uel)}`);
  for (const s of [25000, 40000, 60000]) {
    const ni = calculate({ gross: s }).nationalInsurance;
    const c = row(doc, money(s));
    assert.equal(c[2], money(ni, 2), `£${s} NI`);
    assert.equal(c[3], money(ni / 12, 2), `£${s} NI a month`);
    const er = calculate({ gross: s }).employerNI;
    const e = doc.split("\n").filter((l) => l.startsWith(`| ${money(s)} |`))[1].split("|").slice(1, -1).map((x) => x.trim());
    assert.deepEqual(e.slice(1), [money(er), money(s + er)], `£${s} employer`);
  }
  const normal = niForPeriod(3000, "month", "A"), bonus = niForPeriod(8000, "month", "A");
  has(doc, `pay ${money(normal.employee, 2)} NI`);
  const main = Math.round((M.uel - M.pt) * 0.08 * 100) / 100, top = Math.round((8000 - M.uel) * 0.02 * 100) / 100;
  has(doc, `(${money(main, 2)}) plus 2% on the rest (${money(top, 2)}): **${money(bonus.employee, 2)}**`);
});

test("guides: student loan tables and examples", () => {
  const doc = md("student-loan-repayments.md");
  const plans = [["Plan 1", "plan1", 26900], ["Plan 2", "plan2", 29385], ["Plan 4 (Scotland)", "plan4", 33795], ["Plan 5", "plan5", 25000], ["Postgraduate Loan", "postgrad", 21000]] as const;
  for (const [name, , t] of plans) {
    const c = row(doc, name);
    assert.deepEqual(c.slice(1, 3), [money(t), money(Math.floor(t / 12))], name);
  }
  for (const s of [25000, 30000, 40000, 50000]) {
    const c = row(doc, money(s));
    plans.forEach(([name, key], i) => {
      const got = key === "postgrad" ? calculate({ gross: s, postgraduate: true }).postgraduateLoan : calculate({ gross: s, studentPlan: key }).studentLoan;
      assert.equal(c[i + 1], money(Math.round(got)), `£${s} ${name}`);
    });
  }
  const p2 = calculate({ gross: 35000, studentPlan: "plan2" }).studentLoan;
  has(doc, `**${money(p2, 2)} a year**, about ${money(Math.round(p2 / 12))} a month`);
  const gap = calculate({ gross: 40000, studentPlan: "plan5" }).studentLoan - calculate({ gross: 40000, studentPlan: "plan2" }).studentLoan;
  has(doc, `repays ${money(Math.round(gap))} a year more`);
});

test("guides: salary sacrifice examples", () => {
  const full = md("salary-sacrifice-pension.md");
  const doc = full.slice(full.indexOf("## Example: 5% of £40,000"));
  const base = calculate({ gross: 40000 }).takeHome;
  const sac = calculate({ gross: 40000, pensionPercent: 5, pensionType: "sacrifice" });
  const net = calculate({ gross: 40000, pensionPercent: 5, pensionType: "netpay" });
  assert.deepEqual(row(doc, "No pension").slice(1, 3), ["£0", money(base, 2)]);
  assert.deepEqual(row(doc, "**Salary sacrifice**").slice(1, 4), [money(sac.pension), `**${money(sac.takeHome, 2)}**`, money(Math.round(base - sac.takeHome))]);
  assert.deepEqual(row(doc, "Net pay").slice(1, 4), [money(net.pension), money(net.takeHome, 2), money(Math.round(base - net.takeHome))]);
  has(doc, `**${money(Math.round(sac.takeHome - net.takeHome))} a year better off**`);
  const s2 = calculate({ gross: 40000, pensionPercent: 5, pensionType: "sacrifice", studentPlan: "plan2" });
  const n2 = calculate({ gross: 40000, pensionPercent: 5, pensionType: "netpay", studentPlan: "plan2" });
  has(doc, `gap becomes ${money(Math.round(s2.takeHome - n2.takeHome))}`);
  const b60 = calculate({ gross: 60000 }).takeHome;
  has(full, `**${money(Math.round(b60 - calculate({ gross: 60000, pensionPercent: 5, pensionType: "sacrifice" }).takeHome))}** (saves 40% tax + 2% NI)`);
});

test("guides: every FAQ in the markdown reaches the FAQ schema", async () => {
  const { guideFaqs } = await import("../lib/markdown.ts");
  for (const [f, n] of [["national-insurance-explained.md", 4], ["salary-sacrifice-pension.md", 3], ["student-loan-repayments.md", 3], ["uk-tax-bands-additions.md", 2]] as const) {
    const faqs = guideFaqs(md(f));
    assert.equal(faqs.length, n, f);
    for (const q of faqs) assert.ok(q.q.endsWith("?") && q.a.length > 20 && !q.a.includes("**"), `${f}: ${q.q}`);
  }
});
