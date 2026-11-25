import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import HolidayCalculator from "@/components/HolidayCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { proRataHoliday } from "@/lib/holiday";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/pro-rata-holiday-calculator"),
  description:
    "Pro rata holiday calculator: part-time holiday entitlement in days or hours, including starters, leavers and the 12.07% irregular-hours method.",
  alternates: { canonical: "/pro-rata-holiday-calculator" },
};

const faqs = [
  {
    q: "How much holiday is a part-time worker entitled to?",
    a: "Almost all workers get at least 5.6 weeks of paid holiday a year. For someone working 3 days a week that is 3 × 5.6 = 16.8 days. The legal maximum is 28 days, even if you work more than 5 days a week.",
  },
  {
    q: "Are bank holidays included?",
    a: "Employers can include the 8 bank holidays in England and Wales within the 5.6 weeks. Part-time workers should get a pro rata share of bank holidays, not just the ones that fall on their working days.",
  },
  {
    q: "How do I work out pro rata holiday in hours?",
    a: "Multiply your weekly hours by 5.6. Someone working 22.5 hours a week is entitled to 22.5 × 5.6 = 126 hours of holiday a year.",
  },
  {
    q: "What is the 12.07% holiday calculation?",
    a: "For irregular-hours and part-year workers, in leave years starting on or after 1 April 2024, holiday builds up at 12.07% of the hours worked in each pay period.",
  },
  {
    q: "What if I start or leave part way through the year?",
    a: "Your entitlement is pro rata to the part of the holiday year you work. Starting halfway through the year gives you half the annual entitlement.",
  },
];

const EXAMPLES = [1, 2, 3, 4, 5];

export default function HolidayPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Pro Rata Holiday Calculator UK</h1>
      <Byline />
      <p className="lead">
        Work out holiday entitlement for part-time workers, starters and leavers, in days or hours.
      </p>
      <HolidayCalculator />
      <div className="prose">
        <h2>Statutory holiday entitlement by days worked</h2>
        <table>
          <thead>
            <tr>
              <th>Days worked per week</th>
              <th>Statutory holiday (days)</th>
              <th>With 33 days full-time*</th>
            </tr>
          </thead>
          <tbody>
            {EXAMPLES.map((d) => (
              <tr key={d}>
                <td>{d}</td>
                <td>{proRataHoliday({ daysPerWeek: d }).statutoryDays}</td>
                <td>{proRataHoliday({ daysPerWeek: d, fullTimeEntitlement: 33 }).yearDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted">*25 days plus 8 bank holidays, a common company allowance. Includes bank holidays.</p>
        <h2>How to calculate pro rata holiday</h2>
        <ol>
          <li>Statutory minimum: days you work each week × 5.6 (capped at 28 days).</li>
          <li>Company allowance: full-time days × your days ÷ full-time days.</li>
          <li>Part-year: multiply by the months you work ÷ 12.</li>
        </ol>
        <p>
          Working out part-time pay as well? Use the <Link href="/pro-rata-salary-calculator">pro rata salary calculator</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          Source: GOV.UK, &quot;Holiday entitlement&quot; and &quot;Calculate holiday entitlement&quot;. Guidance only;
          check your contract for your employer&apos;s scheme.
        </p>
      </div>
    </>
  );
}
