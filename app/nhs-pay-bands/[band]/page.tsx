import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { notFound } from "next/navigation";
import NhsCalculator from "@/components/NhsCalculator";
import { JsonLd, Faqs, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { NHS_BANDS, getBand } from "@/lib/nhs";
import { nhsTakeHome } from "@/lib/nhsTakeHome";
import { gbp } from "@/lib/tax";
import { SITE_URL } from "@/lib/site";

type Params = { band: string };
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return NHS_BANDS.map((b) => ({ band: b.slug }));
}

const range = (b: NonNullable<ReturnType<typeof getBand>>) => {
  const lo = b.points[0].salary;
  const hi = b.points[b.points.length - 1].salary;
  return lo === hi ? gbp(lo, 0) : `${gbp(lo, 0)} to ${gbp(hi, 0)}`;
};
// Shorter form for the page title, so it is not cut off in search results.
const shortRange = (b: NonNullable<ReturnType<typeof getBand>>) => range(b).replace(" to ", "–");

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const b = getBand((await params).band);
  if (!b) return {};
  const entry = nhsTakeHome(b.points[0].salary);
  const title = `NHS ${b.name} Salary 2026/27 – ${shortRange(b)} (${gbp(entry.takeHome / 12, 0)}/month)`;
  return {
    title: { absolute: title },
    description: `NHS ${b.name} pay 2026/27: ${range(b)} a year under Agenda for Change. See monthly take-home pay after tax, NI and NHS pension for each pay point.`,
    alternates: { canonical: `/nhs-pay-bands/${b.slug}` },
  };
}

export default async function BandPage({ params }: { params: Promise<Params> }) {
  const b = getBand((await params).band);
  if (!b) notFound();
  const rows = b.points.map((p) => ({ p, r: nhsTakeHome(p.salary), s: nhsTakeHome(p.salary, "scotland") }));
  const entry = rows[0];
  const idx = NHS_BANDS.indexOf(b);
  const faqs = [
    {
      q: `How much does an NHS ${b.name} earn in 2026/27?`,
      a: `${b.name} pays ${range(b)} a year for a full-time (37.5-hour) role in England from 1 April 2026.`,
    },
    {
      q: `What is ${b.name} take-home pay per month?`,
      a: `At the ${entry.p.label.toLowerCase()} point (${gbp(entry.p.salary, 0)}), a full-time ${b.name} takes home about ${gbp(entry.r.takeHome / 12)} a month after Income Tax, National Insurance and a ${(entry.r.rate * 100).toFixed(1)}% NHS pension contribution.`,
    },
    {
      q: `What is the ${b.name} hourly rate?`,
      a: `Based on 37.5 hours a week, ${b.name} pays ${gbp(b.points[0].salary / 52 / 37.5)}${b.points.length > 1 ? ` to ${gbp(b.points[b.points.length - 1].salary / 52 / 37.5)}` : ""} an hour before tax.`,
    },
    { q: `What jobs are ${b.name}?`, a: `Typical ${b.name} roles include ${b.roles.toLowerCase()}.` },
    {
      q: `Is NHS ${b.name} pay the same in Scotland, Wales and Northern Ireland?`,
      a: `No. These figures are the Agenda for Change pay scales for England. NHS Scotland, NHS Wales and Health and Social Care in Northern Ireland publish their own Agenda for Change pay scales, which can differ. If you live in Scotland, Scottish Income Tax also changes your take-home pay — see the Scotland column above.`,
    },
    {
      q: `Do ${b.name} staff in London get paid more?`,
      a: `Yes. NHS staff working in and around London get a High Cost Area Supplement on top of their ${b.name} salary — the highest rate for inner London, then outer London and the fringe areas. It is paid as a percentage of basic pay with a minimum and maximum amount.`,
    },
  ];
  const parttime = [30, 22.5];

  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "NHS pay bands", url: `${SITE_URL}/nhs-pay-bands` },
            { name: b.name, url: `${SITE_URL}/nhs-pay-bands/${b.slug}` },
          ]),
        ]}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › <Link href="/nhs-pay-bands">NHS pay bands</Link> › {b.name}
      </nav>
      <h1>NHS {b.name} Salary 2026/27</h1>
      <Byline />
      <p className="lead">
        NHS {b.name} pays <strong>{range(b)}</strong> a year under Agenda for Change. That&apos;s about{" "}
        <strong>{gbp(entry.r.takeHome / 12)} a month</strong> take-home at the {entry.p.label.toLowerCase()} point.
      </p>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col">Pay point</th>
              <th scope="col">Annual salary</th>
              <th scope="col">NHS pension</th>
              <th scope="col">Monthly take-home</th>
              <th scope="col">Scotland taxpayer</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, r, s }) => (
              <tr key={p.label}>
                <th scope="row">{p.label}</th>
                <td>{gbp(p.salary, 0)}</td>
                <td>{(r.rate * 100).toFixed(1)}%</td>
                <td>{gbp(r.takeHome / 12)}</td>
                <td>{gbp(s.takeHome / 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>{b.name} take home pay calculator</h2>
      <NhsCalculator initialBand={b.slug} />
      <div className="prose">
        <h2>NHS {b.name} pay per month, week and hour (Agenda for Change 2026/27)</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Pay point</th>
                <th>Per month</th>
                <th>Per week</th>
                <th>Per hour</th>
              </tr>
            </thead>
            <tbody>
              {b.points.map((p) => (
                <tr key={p.label}>
                  <td>{p.label}</td>
                  <td>{gbp(p.salary / 12)}</td>
                  <td>{gbp(p.salary / 52)}</td>
                  <td>{gbp(p.salary / 52 / 37.5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">Before tax, based on a 37.5-hour week.</p>
        <h2>Part-time NHS {b.name} pay</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Pay point</th>
                {parttime.map((h) => (
                  <th key={h}>{h} hours a week</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.points.map((p) => (
                <tr key={p.label}>
                  <td>{p.label}</td>
                  {parttime.map((h) => (
                    <td key={h}>{gbp((p.salary * h) / 37.5, 0)} a year</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Part-time NHS pay is pro rata to the 37.5-hour full-time week. Work out your exact pay after tax with the{" "}
          <Link href="/pro-rata-salary-calculator">pro rata salary calculator</Link>, or check a payslip with the{" "}
          <Link href="/payslip-checker">payslip checker</Link>. Comparing {b.name} with another job offer? Use{" "}
          <Link href="/compare-salaries">compare salaries</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
      <nav className="prevnext" aria-label="Other bands">
        {idx > 0 ? <Link href={`/nhs-pay-bands/${NHS_BANDS[idx - 1].slug}`}>← NHS {NHS_BANDS[idx - 1].name}</Link> : <span />}
        {idx < NHS_BANDS.length - 1 ? (
          <Link href={`/nhs-pay-bands/${NHS_BANDS[idx + 1].slug}`}>NHS {NHS_BANDS[idx + 1].name} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}
