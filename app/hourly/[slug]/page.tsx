import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breakdown } from "@/components/Breakdown";
import { JsonLd, Faqs, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { HOURLY_RATES, hourlySlug, parseHourlySlug, hourlyPath } from "@/lib/hourly";
import { rateLabel } from "@/lib/hourlyFaqs";
import { MIN_WAGE, SITE_URL, salaryPath, nearestSalaryPage } from "@/lib/site";
import { calculate, gbp, TAX_YEAR } from "@/lib/tax";
import { hourlyMeta } from "@/lib/metaOverrides";
import { getHourlyInsight } from "@/lib/hourlyInsights";
import { minimumWageAnswer, payRiseAnswer } from "@/lib/hourlyFaqs";
import { getHourlyCopy } from "@/lib/pageCopy";
import { PageCopySection } from "@/components/PageCopySection";

type Params = { slug: string };
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return HOURLY_RATES.map((r) => ({ slug: hourlySlug(r) }));
}

function wageNote(rate: number) {
  if (rate === MIN_WAGE.nlw) return "This is the National Living Wage for workers aged 21 and over from 1 April 2026.";
  if (rate === MIN_WAGE.age18to20) return "This is the National Minimum Wage for 18 to 20 year olds from 1 April 2026.";
  if (rate === MIN_WAGE.age16to17) return "This is the National Minimum Wage for 16 and 17 year olds, and the apprentice rate, from 1 April 2026.";
  return null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const rate = parseHourlySlug((await params).slug);
  if (!rate) return {};
  const annual = rate * 37.5 * 52;
  const r = calculate({ gross: annual });
  const meta = hourlyMeta(rate);
  const title = meta?.title ?? `${gbp(rate)} an Hour is How Much a Year? (${TAX_YEAR.label} UK After Tax)`;
  return {
    title: { absolute: title },
    description:
      meta?.description ??
      `${gbp(rate)} an hour is ${gbp(annual, 0)} a year on a 37.5-hour week, or ${gbp(r.takeHome / 12)} a month after tax and National Insurance in ${TAX_YEAR.label}.`,
    alternates: { canonical: hourlyPath(rate) },
  };
}

export default async function HourlyRatePage({ params }: { params: Promise<Params> }) {
  const rate = parseHourlySlug((await params).slug);
  if (!rate) notFound();
  const annual = rate * 37.5 * 52;
  const r = calculate({ gross: annual, hoursPerWeek: 37.5 });
  const note = wageNote(rate);
  const hoursTable = [16, 20, 25, 30, 35, 37.5, 40];
  const idx = HOURLY_RATES.indexOf(rate);
  const prev = idx > 0 ? HOURLY_RATES[idx - 1] : undefined;
  const next = idx >= 0 && idx < HOURLY_RATES.length - 1 ? HOURLY_RATES[idx + 1] : undefined;

  const faqs = [
    {
      q: `${gbp(rate)} an hour is how much a year?`,
      a: `Working 37.5 hours a week for 52 weeks, ${gbp(rate)} an hour is ${gbp(annual, 0)} a year before tax. After Income Tax and National Insurance you take home ${gbp(r.takeHome)} a year.`,
    },
    {
      q: `${gbp(rate)} an hour is how much a month after tax?`,
      a: `On a full-time 37.5-hour week, you would take home about ${gbp(r.takeHome / 12)} a month after tax and NI (${gbp(annual / 12)} gross).`,
    },
    {
      q: `${gbp(rate)} an hour is how much a week?`,
      a: `${gbp(rate * 37.5)} a week before tax for 37.5 hours, or ${gbp(r.takeHome / 52)} after tax.`,
    },
  ];

  // The 20 most visited hourly rates have a hand-written section and two extra FAQs, worked out here.
  const insight = getHourlyInsight(rate);
  // Pages with hand-written copy (lib/pageCopy.ts) show only their own questions.
  const copy = getHourlyCopy(rate);
  if (copy) faqs.splice(0, faqs.length, ...copy.faqs);
  else if (insight) {
    faqs.push(
      { q: `Is ${rateLabel(rate)} an hour above the minimum wage?`, a: minimumWageAnswer(rate) },
      { q: `How much does a £1 an hour pay rise add at ${rateLabel(rate)} an hour?`, a: payRiseAnswer(rate) }
    );
  }

  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Hourly rates", url: `${SITE_URL}/hourly` },
            { name: `${gbp(rate)} an hour`, url: `${SITE_URL}${hourlyPath(rate)}` },
          ]),
        ]}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › <Link href="/hourly">Hourly rates</Link> › {gbp(rate)} an hour
      </nav>
      <h1>{gbp(rate)} an Hour is How Much a Year?</h1>
      <Byline />
      <p className="lead">
        {gbp(rate)} an hour is <strong>{gbp(annual, 0)} a year</strong> for a 37.5-hour week — that&apos;s{" "}
        <strong>{gbp(r.takeHome / 12)} a month</strong> after tax in {TAX_YEAR.label}.
        {note ? ` ${note}` : ""}
      </p>
      <div className="card">
        <Breakdown r={r} />
        <p className="note">
          37.5 hours a week, 52 paid weeks, England, Wales and Northern Ireland.{" "}
          <Link href="/hourly-to-salary">Change hours in the calculator →</Link>
        </p>
      </div>
      {copy && <PageCopySection copy={copy} subject={`${gbp(rate)} an hour`} />}
      <div className="prose">
        <h2>{gbp(rate)} an hour by hours worked</h2>
        <table>
          <thead>
            <tr>
              <th>Hours per week</th>
              <th>Yearly (gross)</th>
              <th>Monthly take-home</th>
            </tr>
          </thead>
          <tbody>
            {hoursTable.map((h) => {
              const a = rate * h * 52;
              const t = calculate({ gross: a });
              return (
                <tr key={h}>
                  <td>{h}</td>
                  <td>{gbp(a, 0)}</td>
                  <td>{gbp(t.takeHome / 12)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
        {nearestSalaryPage(annual) && (
          <p>
            <Link href={salaryPath(nearestSalaryPage(annual)!)}>
              See the full {gbp(nearestSalaryPage(annual)!, 0)} after tax breakdown →
            </Link>
          </p>
        )}
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
      <nav className="prevnext" aria-label="Other hourly rates">
        {prev ? <Link href={hourlyPath(prev)}>← {gbp(prev)} an hour</Link> : <span />}
        {next ? <Link href={hourlyPath(next)}>{gbp(next)} an hour →</Link> : <span />}
      </nav>
    </>
  );
}
