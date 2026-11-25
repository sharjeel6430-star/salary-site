import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import ProRataCalculator from "@/components/ProRataCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { calculate, gbp, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/pro-rata-salary-calculator"),
  description: `Pro rata calculator: work out your part-time or part-year salary from the full-time (FTE) amount and see your take-home pay after tax for ${TAX_YEAR.label}.`,
  alternates: { canonical: "/pro-rata-salary-calculator" },
};

const faqs = [
  {
    q: "What does pro rata mean?",
    a: "Pro rata is Latin for 'in proportion'. A pro rata salary is the full-time salary scaled down to the hours or days you actually work. A job advertised at £30,000 pro rata for 3 days a week pays £18,000 a year.",
  },
  {
    q: "How do I work out a pro rata salary?",
    a: "Divide your contracted hours by the full-time hours, then multiply by the full-time salary. For example, 22.5 ÷ 37.5 × £35,000 = £21,000 a year.",
  },
  {
    q: "What does 'FTE' mean in a job advert?",
    a: "FTE means full-time equivalent. '£35,000 FTE' tells you what the job would pay if you worked full-time; your actual pay is the pro rata amount.",
  },
  {
    q: "Is holiday pro rata too?",
    a: "Yes. Part-time workers are entitled to at least 5.6 weeks of paid holiday a year, worked out pro rata to the days or hours they work.",
  },
  {
    q: "Do part-time workers pay less tax?",
    a: "Tax rates are the same, but because your pro rata salary is lower, more of it falls within the tax-free Personal Allowance, so you pay a smaller share of your pay in tax and National Insurance.",
  },
  {
    q: "How do I work out pro rata pay for part of the year?",
    a: "Multiply the yearly salary by the number of weeks (or months) you work, divided by 52 (or 12). Starting a £36,000 job with 3 months of the tax year left gives £9,000 for that tax year.",
  },
  {
    q: "What does 0.6 FTE mean?",
    a: "FTE is a fraction of a full-time job. 0.6 FTE means 60% of full-time hours, for example 3 days a week or 22.5 hours out of 37.5. You are paid 60% of the full-time salary.",
  },
  {
    q: "Are bank holidays pro rata for part-time workers?",
    a: "They should be. Part-time workers must not be treated less favourably than full-time staff, so most employers give a pro rata share of bank holidays. Use the pro rata holiday calculator to check your entitlement.",
  },
  {
    q: "Is a pro rata pension contribution lower?",
    a: "Yes, pension contributions are usually a percentage of your actual (pro rata) pay, so they are lower in pounds. Your employer must still auto-enrol you if you earn over £10,000 a year.",
  },
  {
    q: "How is term-time only pay worked out?",
    a: "Term-time only staff are paid for the weeks they work plus a holiday allowance, then the total is usually spread over 12 equal monthly payments. For example, 39 working weeks plus 5.6 weeks of holiday is 44.6 paid weeks — about 85.5% of the full-year salary (44.6 ÷ 52.14).",
  },
  {
    q: "How do I work out an NHS pro rata salary?",
    a: "Find your Agenda for Change band salary, then multiply it by your contracted hours divided by 37.5. A Band 5 nurse on 30 hours is paid 80% of the full-time Band 5 salary. Use the NHS take home pay calculator to include NHS pension.",
  },
];

const FTE_FRACTIONS = [0.2, 0.4, 0.5, 0.6, 0.8, 0.9];

const HOURS = [15, 18.75, 22.5, 25, 30];
const FTES = [30000, 40000, 50000];

const EXAMPLES = [
  { fte: 25000, days: 3 },
  { fte: 30000, days: 3 },
  { fte: 35000, days: 4 },
  { fte: 40000, days: 3 },
  { fte: 45000, days: 4 },
  { fte: 50000, days: 2 },
];

export default function ProRataPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Pro Rata Calculator UK</h1>
      <Byline />
      <p className="lead">
        Use this pro rata salary calculator to work out your part-time salary from a full-time (FTE) salary — by hours or
        days per week — and see what you take home after tax in {TAX_YEAR.label}.
      </p>
      <ProRataCalculator />
      <div className="prose">
        <h2>What does pro rata mean? (Pro rata meaning)</h2>
        <p>
          <strong>Pro rata</strong> means &quot;in proportion&quot;. When a job is advertised as &quot;£30,000 pro
          rata&quot;, £30,000 is the full-time salary. If you work fewer hours, you are paid the same proportion of it.
        </p>
        <h2>How to work out pro rata salary</h2>
        <ol>
          <li>Divide your weekly hours by the full-time hours (e.g. 22.5 ÷ 37.5 = 0.6).</li>
          <li>Multiply the full-time salary by that number (0.6 × £35,000 = £21,000).</li>
          <li>If you only work part of the year, multiply again by weeks worked ÷ 52.</li>
        </ol>
        <h2>Pro rata salary examples</h2>
        <table>
          <thead>
            <tr>
              <th>Full-time salary</th>
              <th>Days per week</th>
              <th>Pro rata salary</th>
              <th>Monthly take-home</th>
            </tr>
          </thead>
          <tbody>
            {EXAMPLES.map((e) => {
              const pr = (e.fte * e.days) / 5;
              const r = calculate({ gross: pr });
              return (
                <tr key={`${e.fte}-${e.days}`}>
                  <td>{gbp(e.fte, 0)}</td>
                  <td>{e.days}</td>
                  <td>{gbp(pr, 0)}</td>
                  <td>{gbp(r.takeHome / 12)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted">England, Wales and Northern Ireland, no pension or student loan.</p>
        <h2>Pro rata salary by hours (37.5-hour full-time week)</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Hours a week</th>
                {FTES.map((f) => (
                  <th key={f}>{gbp(f, 0)} FTE</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((h) => (
                <tr key={h}>
                  <td>
                    {h} hours ({Math.round((h / 37.5) * 100)}%)
                  </td>
                  {FTES.map((f) => (
                    <td key={f}>{gbp((f * h) / 37.5, 0)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>FTE to salary table</h2>
        <p>What a full-time-equivalent fraction pays at common full-time salaries, before tax.</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>FTE</th>
                <th>Hours (of 37.5)</th>
                {FTES.map((f) => (
                  <th key={f}>{gbp(f, 0)} FTE</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FTE_FRACTIONS.map((x) => (
                <tr key={x}>
                  <td>{x.toFixed(1)}</td>
                  <td>{(37.5 * x).toFixed(2).replace(/\.?0+$/, "")}</td>
                  {FTES.map((f) => (
                    <td key={f}>{gbp(f * x, 0)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Term-time only salary</h2>
        <p>
          School support staff and some council jobs are paid <strong>term-time only</strong>. Your salary is pro rata for
          both your hours and the weeks you work:
        </p>
        <ol>
          <li>Work out the hours fraction: your weekly hours ÷ full-time hours.</li>
          <li>
            Work out the weeks fraction: working weeks plus holiday weeks ÷ 52.14. For 39 weeks plus 5.6 weeks of holiday
            that is 44.6 ÷ 52.14 = 85.5%.
          </li>
          <li>Multiply the full-time salary by both fractions. Most employers then pay it in 12 equal monthly instalments.</li>
        </ol>
        <p>
          Example: a £28,000 FTE teaching assistant post at 32.5 hours a week, term-time only, pays about{" "}
          {gbp(28000 * (32.5 / 37.5) * (44.6 / 52.14), 0)} a year, or{" "}
          {gbp(calculate({ gross: 28000 * (32.5 / 37.5) * (44.6 / 52.14) }).takeHome / 12)} a month after tax. Your
          employer&apos;s exact holiday weeks may differ, so check your contract. In the calculator, enter your paid weeks in
          the weeks field.
        </p>

        <h2>NHS and part-time public sector pay</h2>
        <p>
          NHS jobs are advertised at the full-time Agenda for Change salary for 37.5 hours. A Band 5 role at 30 hours is 0.8
          FTE, so you get 80% of the band salary and pro rata annual leave. Use the{" "}
          <Link href="/nhs-take-home-pay-calculator">NHS take home pay calculator</Link> to include NHS pension, or the{" "}
          <Link href="/teacher-take-home-pay-calculator">teacher take home pay calculator</Link> for part-time teachers.
        </p>
        <p>
          Working out holiday too? Use the <Link href="/pro-rata-holiday-calculator">pro rata holiday calculator</Link>.
        </p>
        <p>
          Paid by the hour instead? Use the <Link href="/hourly-to-salary">hourly to salary calculator</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
