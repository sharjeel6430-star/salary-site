import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breakdown, BandTable, SplitBar } from "@/components/Breakdown";
import { JsonLd, Faqs, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { SALARY_PAGES, SITE_URL, MIN_SALARY, MAX_SALARY, salaryPath, kLabel } from "@/lib/site";
import { calculate, gbp, pct, TAX_YEAR } from "@/lib/tax";
import { getSalaryInsight } from "@/lib/salaryInsights";
import { salaryMeta } from "@/lib/metaOverrides";
import { getSalaryCopy } from "@/lib/pageCopy";
import { PageCopySection } from "@/components/PageCopySection";
import { MEDIAN_FULL_TIME } from "@/lib/site";

type Params = { amount: string };

export const dynamicParams = false; // static export: only the pre-built salaries exist

export function generateStaticParams(): Params[] {
  return SALARY_PAGES.map((s) => ({ amount: `${s}-after-tax` }));
}

// "40000-after-tax" -> 40000
function parse(slug: string): { salary: number } | null {
  const m = /^(\d+)-after-tax$/.exec(slug);
  if (!m) return null;
  const n = Number(m[1]);
  if (n < MIN_SALARY || n > MAX_SALARY) return null;
  return { salary: n };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = parse((await params).amount);
  if (!p) return {};
  const { salary } = p;
  const r = calculate({ gross: salary });
  const meta = salaryMeta(salary);
  const title = meta?.title ?? `${gbp(salary, 0)} After Tax UK ${TAX_YEAR.label} (${kLabel(salary)}) – ${gbp(r.takeHome / 12)} a Month`;
  const description = meta?.description ?? `${kLabel(salary)} after tax in the UK: a ${gbp(salary, 0)} salary is ${gbp(r.takeHome)} a year, ${gbp(r.takeHome / 12)} a month or ${gbp(r.takeHome / 52)} a week after Income Tax and NI (${TAX_YEAR.label}).`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: salaryPath(salary) },
    openGraph: { title, description, url: salaryPath(salary), images: ["/og-image.png"] },
  };
}

export default async function SalaryPage({ params }: { params: Promise<Params> }) {
  const p = parse((await params).amount);
  if (!p) notFound();
  const { salary } = p;

  const r = calculate({ gross: salary });
  const scot = calculate({ gross: salary, region: "scotland" });
  const plan1 = calculate({ gross: salary, studentPlan: "plan1" });
  const plan2 = calculate({ gross: salary, studentPlan: "plan2" });
  const plan4 = calculate({ gross: salary, studentPlan: "plan4" });
  const plan5 = calculate({ gross: salary, studentPlan: "plan5" });
  const pension5 = calculate({ gross: salary, pensionPercent: 5, pensionType: "sacrifice" });
  const s = gbp(salary, 0);
  const k = kLabel(salary);
  const diffScot = scot.takeHome - r.takeHome;
  const hourlyGross = salary / 52 / 37.5;

  const idx = SALARY_PAGES.indexOf(salary);
  const prev = idx > 0 ? SALARY_PAGES[idx - 1] : SALARY_PAGES.filter((x) => x < salary).pop();
  const next = idx >= 0 ? SALARY_PAGES[idx + 1] : SALARY_PAGES.find((x) => x > salary);
  // Nearest salaries first (v22: was the 12 lowest within ±25%, so £146,000 linked £110,000–£121,000).
  const nearby = SALARY_PAGES.filter((x) => x !== salary && Math.abs(x - salary) <= salary * 0.25)
    .sort((a, b) => Math.abs(a - salary) - Math.abs(b - salary))
    .slice(0, 12);

  // Questions phrased the way people search ("40k a year is how much a month after tax").
  const faqs = [
    {
      q: `How much is ${k} after tax in the UK?`,
      a: `In England, Wales and Northern Ireland, a ${s} salary gives a take-home pay of ${gbp(r.takeHome)} a year in ${TAX_YEAR.label}, after ${gbp(r.incomeTax)} Income Tax and ${gbp(r.nationalInsurance)} National Insurance.`,
    },
    {
      q: `${k} a year is how much a month after tax?`,
      a: `${s} a year is ${gbp(r.takeHome / 12)} a month after tax and National Insurance, before any pension or student loan deductions. Your gross monthly pay is ${gbp(salary / 12)}.`,
    },
    {
      q: `How much is ${s} a week after tax?`,
      a: `You would take home about ${gbp(r.takeHome / 52)} a week, or ${gbp(r.takeHome / 260)} per working day.`,
    },
    {
      q: `What is ${s} a year as an hourly rate?`,
      a: `Based on a 37.5-hour week, ${s} is ${gbp(hourlyGross)} an hour before tax and ${gbp(r.takeHome / 52 / 37.5)} an hour after tax.`,
    },
    {
      q: `How much tax do I pay on ${s} in Scotland?`,
      a: `A Scottish taxpayer earning ${s} pays ${gbp(scot.incomeTax)} Income Tax and takes home ${gbp(scot.takeHome)} a year (${gbp(scot.takeHome / 12)} a month) — ${gbp(Math.abs(diffScot))} ${diffScot < 0 ? "less" : "more"} than in the rest of the UK.`,
    },
    {
      q: `Is ${s} a good salary in the UK?`,
      a: `${s} is ${salary > MEDIAN_FULL_TIME.amount * 1.05 ? "above" : salary >= MEDIAN_FULL_TIME.amount * 0.95 ? "close to" : "below"} the median full-time UK salary, which was ${gbp(MEDIAN_FULL_TIME.amount, 0)} in ${MEDIAN_FULL_TIME.date} (ONS Annual Survey of Hours and Earnings). Whether it is enough depends on where you live, your housing costs and whether you support a family.`,
    },
  ];

  // Pages with hand-written copy (lib/pageCopy.ts) show only their own 2–3 questions.
  const copy = getSalaryCopy(salary);
  if (copy) faqs.splice(0, faqs.length, ...copy.faqs);

  // The 20 most visited salaries have a hand-written section and two extra FAQs, worked out here.
  const insight = getSalaryInsight(salary);
  if (insight) {
    const extra = calculate({ gross: salary + 1000 }).takeHome - r.takeHome;
    const keep = Math.round(extra / 10); // pence kept per extra pound
    const higherFrom = TAX_YEAR.personalAllowance + TAX_YEAR.bands.ruk[0].upTo; // £50,270
    const crosses = salary < higherFrom && salary + 1000 > higherFrom;
    faqs.push(
      {
        q: `How much does an extra £1,000 add to a ${k} salary?`,
        a: crosses
          ? `About ${gbp(extra, 0)} a year (${gbp(extra / 12)} a month). The next £1,000 takes you over the ${gbp(higherFrom, 0)} higher-rate threshold, so part of it is taxed at 40% plus 2% National Insurance and you keep about ${keep}p of every extra pound.`
          : `About ${gbp(extra, 0)} a year (${gbp(extra / 12)} a month). At ${s} your marginal rate of tax and National Insurance is ${100 - keep}%, so you keep ${keep}p of every extra pound.`,
      },
      {
        q: `How much does a ${s} employee cost their employer?`,
        a: `About ${gbp(salary + r.employerNI, 0)} a year: the ${s} salary plus roughly ${gbp(r.employerNI, 0)} employer National Insurance in ${TAX_YEAR.label}, before any employer pension contribution.`,
      }
    );
  }

  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Salaries", url: `${SITE_URL}/salary` },
            { name: `${s} after tax`, url: `${SITE_URL}${salaryPath(salary)}` },
          ]),
        ]}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › <Link href="/salary">Salaries</Link> › {s}
      </nav>
      <h1>
        {s} After Tax UK {TAX_YEAR.label}: {k} Take Home Pay
      </h1>
      <Byline />
      {copy ? (
        <p className="lead">
          On {s} a year you take home <strong>{gbp(r.takeHome)}</strong> — <strong>{gbp(r.takeHome / 12)} a month</strong>,{" "}
          {gbp(r.takeHome / 52)} a week, after {gbp(r.incomeTax)} Income Tax and {gbp(r.nationalInsurance)} National Insurance.
        </p>
      ) : (
      <p className="lead">
        If you earn {s} ({k}) a year, your take-home pay is <strong>{gbp(r.takeHome)}</strong> — that&apos;s{" "}
        <strong>{gbp(r.takeHome / 12)} a month</strong> or {gbp(r.takeHome / 52)} a week after Income Tax and National
        Insurance.
      </p>
      )}

      <div className="summary-cards">
        <div className="hl">
          <span>Monthly take-home</span>
          <strong>{gbp(r.takeHome / 12)}</strong>
        </div>
        <div>
          <span>Yearly take-home</span>
          <strong>{gbp(r.takeHome, 0)}</strong>
        </div>
        <div>
          <span>Weekly take-home</span>
          <strong>{gbp(r.takeHome / 52)}</strong>
        </div>
        <div>
          <span>Effective tax rate</span>
          <strong>{pct(r.effectiveRate)}</strong>
        </div>
      </div>

      <div className="card">
        <SplitBar r={r} />
        <h2 className="section-title">{s} salary breakdown</h2>
        <Breakdown r={r} />
        <p className="note">
          England, Wales and Northern Ireland, standard tax code 1257L, no pension or student loan. Hourly figures assume
          37.5 hours a week. <Link href="/">Change the options in the salary calculator →</Link>
        </p>
      </div>

      {copy && <PageCopySection copy={copy} subject={s} />}

      <div className="prose">
        <h2>
          {k} a year is how much a month after tax?
        </h2>
        <p>
          On {s} a year your gross pay is {gbp(salary / 12)} a month. After {gbp(r.incomeTax / 12)} Income Tax and{" "}
          {gbp(r.nationalInsurance / 12)} National Insurance, you take home <strong>{gbp(r.takeHome / 12)} a month</strong>.
        </p>

        <h2>
          {k} take home pay per year, month, week, day and hour
        </h2>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Gross pay</th>
              <th>Take-home pay</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Per year", d: 1 },
              { label: "Per month", d: 12 },
              { label: "Per week", d: 52 },
              { label: "Per day (5-day week)", d: 260 },
              { label: "Per hour (37.5-hour week)", d: 52 * 37.5 },
            ].map((p) => (
              <tr key={p.label}>
                <td>{p.label}</td>
                <td>{gbp(salary / p.d)}</td>
                <td>{gbp(r.takeHome / p.d)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Income Tax on {s}</h2>
        <p>
          You get a tax-free Personal Allowance of {gbp(r.personalAllowance, 0)}
          {r.personalAllowance < TAX_YEAR.personalAllowance ? " (reduced because your income is over £100,000)" : ""}, so{" "}
          {gbp(r.taxableIncome, 0)} of your salary is taxable. That gives an Income Tax bill of{" "}
          <strong>{gbp(r.incomeTax)}</strong> a year. Your marginal rate — the share of any pay rise you lose to tax and NI
          — is <strong>{pct(r.marginalRate, 0)}</strong>.
        </p>
        <BandTable r={r} />

        <h2>National Insurance on {s}</h2>
        <p>
          You pay {gbp(r.nationalInsurance)} in employee National Insurance a year ({gbp(r.nationalInsurance / 12)} a
          month). Your employer also pays about {gbp(r.employerNI)} in employer NI on top of your salary.
        </p>

        <h2>{s} after tax in Scotland</h2>
        <p>
          Scottish taxpayers earning {s} pay {gbp(scot.incomeTax)} Income Tax and take home{" "}
          <strong>{gbp(scot.takeHome)}</strong> a year, or {gbp(scot.takeHome / 12)} a month.{" "}
          {Math.abs(diffScot) < 1
            ? "That is about the same as the rest of the UK."
            : `That is ${gbp(Math.abs(diffScot))} a year ${diffScot < 0 ? "less" : "more"} than in England, Wales or Northern Ireland.`}{" "}
          <Link href="/scotland-salary-calculator">Use the Scotland calculator →</Link>
        </p>

        <h2>{k} after tax and student loan or pension</h2>
        <table>
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Monthly take-home</th>
              <th>Yearly take-home</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No extras</td>
              <td>{gbp(r.takeHome / 12)}</td>
              <td>{gbp(r.takeHome)}</td>
            </tr>
            <tr>
              <td>Plan 1 student loan</td>
              <td>{gbp(plan1.takeHome / 12)}</td>
              <td>{gbp(plan1.takeHome)}</td>
            </tr>
            <tr>
              <td>Plan 2 student loan</td>
              <td>{gbp(plan2.takeHome / 12)}</td>
              <td>{gbp(plan2.takeHome)}</td>
            </tr>
            <tr>
              <td>Plan 4 student loan (Scotland)</td>
              <td>{gbp(plan4.takeHome / 12)}</td>
              <td>{gbp(plan4.takeHome)}</td>
            </tr>
            <tr>
              <td>Plan 5 student loan</td>
              <td>{gbp(plan5.takeHome / 12)}</td>
              <td>{gbp(plan5.takeHome)}</td>
            </tr>
            <tr>
              <td>5% salary sacrifice pension</td>
              <td>{gbp(pension5.takeHome / 12)}</td>
              <td>{gbp(pension5.takeHome)}</td>
            </tr>
          </tbody>
        </table>
        <p className="muted">
          A 5% salary sacrifice puts {gbp(pension5.pension)} a year into your pension but only lowers your take-home pay by{" "}
          {gbp(r.takeHome - pension5.takeHome)}, because you save tax and NI on it.{" "}
          <Link href="/salary-sacrifice-calculator">Try the salary sacrifice calculator →</Link>
        </p>

        {insight && (
          <section className="salary-insight">
            <h2>{insight.heading}</h2>
            <p>{insight.text}</p>
            {insight.links.length > 0 && (
              <p className="muted">
                See also:{" "}
                {insight.links.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 && " · "}
                    <Link href={l.href}>{l.label}</Link>
                  </span>
                ))}
              </p>
            )}
          </section>
        )}

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />

        {nearby.length > 0 && (
          <>
            <h2>Similar salaries after tax</h2>
            <ul className="pill-grid">
              {nearby.map((x) => (
                <li key={x}>
                  <Link href={salaryPath(x)}>{gbp(x, 0)}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <nav className="prevnext" aria-label="Previous and next salary">
        {prev ? <Link href={salaryPath(prev)}>← {gbp(prev, 0)} after tax</Link> : <span />}
        {next ? <Link href={salaryPath(next)}>{gbp(next, 0)} after tax →</Link> : <span />}
      </nav>
    </>
  );
}
