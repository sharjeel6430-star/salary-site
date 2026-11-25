import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { notFound } from "next/navigation";
import NetToGrossCalculator from "@/components/NetToGrossCalculator";
import { Breakdown } from "@/components/Breakdown";
import { JsonLd, Faqs, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { grossForTakeHome, MONTHLY_TARGETS, monthlyPath } from "@/lib/reverse";
import { calculate, gbp, TAX_YEAR } from "@/lib/tax";
import { SITE_URL, SALARY_PAGES, salaryPath } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return MONTHLY_TARGETS.map((m) => ({ slug: `${m}-a-month` }));
}

function parse(slug: string) {
  const m = /^(\d+)-a-month$/.exec(slug);
  const n = m ? Number(m[1]) : NaN;
  return MONTHLY_TARGETS.includes(n) ? n : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const m = parse((await params).slug);
  if (!m) return {};
  const gross = grossForTakeHome(m * 12);
  const title = `What Salary Is ${gbp(m, 0)} a Month After Tax? (UK ${TAX_YEAR.label})`;
  const description = `To take home ${gbp(m, 0)} a month in the UK you need a gross salary of about ${gbp(gross, 0)} a year in ${TAX_YEAR.label}. See the figures for Scotland, student loans and pension.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: monthlyPath(m) },
    openGraph: { title, description, url: monthlyPath(m), images: ["/og-image.png"] },
  };
}

export default async function TakeHomePage({ params }: { params: Promise<Params> }) {
  const m = parse((await params).slug);
  if (!m) notFound();
  const net = m * 12;
  const gross = grossForTakeHome(net);
  const r = calculate({ gross });
  const scot = grossForTakeHome(net, { region: "scotland" });
  const plan2 = grossForTakeHome(net, { studentPlan: "plan2" });
  const plan5 = grossForTakeHome(net, { studentPlan: "plan5" });
  const pen5 = grossForTakeHome(net, { pensionPercent: 5, pensionType: "sacrifice" });
  const nearest = SALARY_PAGES.reduce((a, b) => (Math.abs(b - gross) < Math.abs(a - gross) ? b : a));
  const idx = MONTHLY_TARGETS.indexOf(m);
  const prev = MONTHLY_TARGETS[idx - 1];
  const next = MONTHLY_TARGETS[idx + 1];
  const M = gbp(m, 0);

  const faqs = [
    {
      q: `What salary do I need to take home ${M} a month?`,
      a: `About ${gbp(gross, 0)} a year in England, Wales or Northern Ireland, with no pension or student loan (${TAX_YEAR.label} rates).`,
    },
    {
      q: `What salary gives ${M} a month in Scotland?`,
      a: `About ${gbp(scot, 0)} a year, because Scottish Income Tax rates are different.`,
    },
    {
      q: `How much is ${M} a month a year?`,
      a: `${M} a month is ${gbp(net, 0)} a year of take-home pay, or about ${gbp(net / 52)} a week.`,
    },
  ];

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Net to gross calculator", url: `${SITE_URL}/net-to-gross-salary-calculator` },
          { name: `${M} a month`, url: `${SITE_URL}${monthlyPath(m)}` },
        ])}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › <Link href="/net-to-gross-salary-calculator">Net to gross</Link> › {M} a month
      </nav>
      <h1>What salary is {M} a month after tax?</h1>
      <Byline />
      <p className="lead">
        To take home <strong>{M} a month</strong> in {TAX_YEAR.label} you need a gross salary of about{" "}
        <strong>{gbp(gross, 0)}</strong> a year (England, Wales and Northern Ireland, no pension or student loan).
      </p>
      <div className="prose">
        <h2>Salary needed for {M} a month</h2>
        <table>
          <thead>
            <tr>
              <th>Situation</th>
              <th>Salary needed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>England, Wales or Northern Ireland</td>
              <td>{gbp(gross, 0)}</td>
            </tr>
            <tr>
              <td>Scotland</td>
              <td>{gbp(scot, 0)}</td>
            </tr>
            <tr>
              <td>With Plan 2 student loan</td>
              <td>{gbp(plan2, 0)}</td>
            </tr>
            <tr>
              <td>With Plan 5 student loan</td>
              <td>{gbp(plan5, 0)}</td>
            </tr>
            <tr>
              <td>With 5% salary sacrifice pension</td>
              <td>{gbp(pen5, 0)}</td>
            </tr>
          </tbody>
        </table>
        <h2>Breakdown of a {gbp(gross, 0)} salary</h2>
      </div>
      <Breakdown r={r} />
      <h2>Try your own figures</h2>
      <NetToGrossCalculator initialMonthly={m} />
      <div className="prose">
        <p>
          See the full breakdown for a <Link href={salaryPath(nearest)}>{gbp(nearest, 0)} salary after tax</Link>.
        </p>
        <p>
          {prev && <Link href={monthlyPath(prev)}>← {gbp(prev, 0)} a month</Link>}
          {prev && next && " · "}
          {next && <Link href={monthlyPath(next)}>{gbp(next, 0)} a month →</Link>}
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
