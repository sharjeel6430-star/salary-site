import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import TeacherCalculator from "@/components/TeacherCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { TEACHER_AREAS, TEACHER_POINTS, TEACHER_PAY, TPS_TIERS, teacherTakeHome } from "@/lib/teachers";
import { gbp, pct } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/teacher-take-home-pay-calculator"),
  description:
    "Teacher take home pay calculator for England 2026/27: pay scales M1–U3 in all four pay areas, Teachers' Pension, tax, NI and student loan.",
  alternates: { canonical: "/teacher-take-home-pay-calculator" },
};

const faqs = [
  {
    q: "How much does a newly qualified teacher earn in 2026/27?",
    a: "An early career teacher on M1 earns £34,069 outside London, £35,602 in the London Fringe, £39,196 in Outer London and £41,729 in Inner London from September 2026.",
  },
  {
    q: "What was the 2026 teacher pay award?",
    a: "Teachers in England received a 3.5% pay award from September 2026, applied to all points on the main and upper pay ranges.",
  },
  {
    q: "How much do teachers pay into the Teachers' Pension?",
    a: "Member contributions range from 7.4% to 12% of salary depending on what you earn. Contributions are taken before Income Tax (a net pay arrangement), so you get tax relief, but National Insurance is still charged on your full salary.",
  },
  {
    q: "Do part-time teachers get a pro rata salary?",
    a: "Yes. Part-time teachers are paid a proportion of the full-time salary for their point on the scale. Enter your contract percentage (for example 60%) in the calculator.",
  },
  {
    q: "Does this cover Scotland, Wales or Northern Ireland?",
    a: "The pay scales shown are for England. Teachers in Scotland, Wales and Northern Ireland have their own pay scales, but you can still enter your salary and choose Scottish tax rates.",
  },
];

export default function TeacherPage() {
  const m1 = teacherTakeHome(TEACHER_PAY.england.M1);
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Teacher Take Home Pay Calculator 2026/27</h1>
      <Byline />
      <p className="lead">
        Pick your pay area and point on the scale to see your monthly take-home pay after tax, National Insurance,
        student loan and Teachers&apos; Pension.
      </p>
      <TeacherCalculator />
      <div className="prose">
        <p>
          For example, a teacher on M1 outside London earns {gbp(TEACHER_PAY.england.M1, 0)} and takes home about{" "}
          <strong>{gbp(m1.takeHome / 12)} a month</strong> after a {pct(m1.rate)} pension contribution (no student loan).
        </p>
        <h2>Teacher pay scales 2026/27 (England)</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Point</th>
                {TEACHER_AREAS.map((a) => (
                  <th key={a.key}>{a.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEACHER_POINTS.map((p) => (
                <tr key={p}>
                  <td>{p}</td>
                  {TEACHER_AREAS.map((a) => (
                    <td key={a.key}>{gbp(TEACHER_PAY[a.key][p], 0)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">From 1 September 2026, after the 3.5% award. M = main pay range, U = upper pay range.</p>
        <h2>Monthly take-home on each point (outside London)</h2>
        <table>
          <thead>
            <tr>
              <th>Point</th>
              <th>Salary</th>
              <th>Pension rate</th>
              <th>Monthly take-home</th>
            </tr>
          </thead>
          <tbody>
            {TEACHER_POINTS.map((p) => {
              const r = teacherTakeHome(TEACHER_PAY.england[p]);
              return (
                <tr key={p}>
                  <td>{p}</td>
                  <td>{gbp(TEACHER_PAY.england[p], 0)}</td>
                  <td>{pct(r.rate)}</td>
                  <td>{gbp(r.takeHome / 12)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted">England tax rates, no student loan.</p>
        <h2>Teachers&apos; Pension contribution rates (from 1 April 2026)</h2>
        <table>
          <thead>
            <tr>
              <th>Full-time equivalent salary</th>
              <th>Contribution rate</th>
            </tr>
          </thead>
          <tbody>
            {TPS_TIERS.map((t, i) => {
              const from = i === 0 ? 0 : TPS_TIERS[i - 1].upTo + 0.01;
              return (
                <tr key={t.rate}>
                  <td>
                    {t.upTo === Infinity
                      ? `${gbp(from, 0)} and above`
                      : i === 0
                        ? `Up to ${gbp(t.upTo)}`
                        : `${gbp(from, 0)} to ${gbp(t.upTo)}`}
                  </td>
                  <td>{pct(t.rate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p>
          Work in the NHS instead? Try the <Link href="/nhs-take-home-pay-calculator">NHS take home pay calculator</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          Sources: School Teachers&apos; Pay and Conditions Document and published 2026 pay scales (NEU); Teachers&apos;
          Pensions member contribution rates. Guidance only.
        </p>
      </div>
    </>
  );
}
