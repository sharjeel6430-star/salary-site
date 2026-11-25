import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import DoctorCalculator from "@/components/DoctorCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { DOCTOR_GRADES, doctorTakeHome } from "@/lib/doctors";
import { NHS_PENSION_TIERS } from "@/lib/nhs";
import { gbp, pct, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/doctor-take-home-pay-calculator"),
  description: `NHS doctor take-home pay calculator ${TAX_YEAR.label}: FY1 to ST8 and consultant pay after tax, National Insurance, NHS pension and student loan.`,
  alternates: { canonical: "/doctor-take-home-pay-calculator" },
};

export default function DoctorPage() {
  const fy1 = doctorTakeHome(41226);
  const fy2 = doctorTakeHome(47610);
  const con = doctorTakeHome(113565);

  const faqs = [
    {
      q: "How much does an FY1 doctor take home a month?",
      a: `An FY1 doctor in England on the basic salary of £41,226 takes home about ${gbp(fy1.takeHome / 12)} a month after Income Tax, National Insurance and a 9.8% NHS pension contribution, with no student loan. Extra hours, nights and weekends add to this.`,
    },
    {
      q: "How much does an FY2 doctor earn after tax?",
      a: `FY2 basic pay in England is £47,610 from 1 April 2026, which is about ${gbp(fy2.takeHome / 12)} a month after tax, NI and NHS pension, before any extra pay.`,
    },
    {
      q: "What is the 2026/27 pay rise for doctors?",
      a: "Doctors in England received a 3.5% pay award from 1 April 2026. The 2026 resident doctor deal also split the nodal points into ten steps (3a to 5c) linked to training stages. Arrears were paid in September 2026 salaries.",
    },
    {
      q: "How much does a new consultant take home?",
      a: `A new consultant in England starts on £113,565. After a 12.5% NHS pension contribution, take-home pay is about ${gbp(con.takeHome / 12)} a month, before any additional programmed activities or clinical impact awards.`,
    },
    {
      q: "Is the NHS pension taken before tax?",
      a: "Yes. The NHS Pension Scheme is a net pay arrangement, so your contribution is taken before Income Tax, which gives you tax relief. National Insurance and student loan are still worked out on your full pay.",
    },
    {
      q: "Do doctors in Scotland get paid differently?",
      a: "Yes. Resident doctors in Scotland have their own pay scales agreed with the Scottish Government, and Scottish Income Tax rates apply. Choose 'Other' in the calculator to enter your basic salary and select Scotland for the tax rates.",
    },
    {
      q: "I'm an international medical graduate (IMG). What should I expect on my first payslip?",
      a: "Your first pay may use an emergency tax code until HMRC has your details, so you can pay too much tax at first; it is usually refunded later in the year. You will not have a UK student loan unless you studied in the UK. You will be enrolled in the NHS pension automatically, and you can opt out.",
    },
    {
      q: "How is less than full time (LTFT) pay worked out?",
      a: "LTFT doctors are paid the same proportion of the full-time basic salary as the hours they work. Enter your percentage, for example 80%, in the calculator.",
    },
  ];

  const residents = DOCTOR_GRADES.filter((g) => g.group === "resident");
  const consultants = DOCTOR_GRADES.filter((g) => g.group === "consultant");

  const Row = ({ g }: { g: (typeof DOCTOR_GRADES)[number] }) => {
    const e = doctorTakeHome(g.salary);
    const s = doctorTakeHome(g.salary, { region: "scotland" });
    return (
      <tr>
        <td>{g.label}</td>
        <td>{g.nodal}</td>
        <td>{gbp(g.salary, 0)}</td>
        <td>{pct(e.rate)}</td>
        <td>{gbp(e.takeHome / 12)}</td>
        <td>{gbp(s.takeHome / 12)}</td>
      </tr>
    );
  };

  const Head = () => (
    <thead>
      <tr>
        <th>Grade</th>
        <th>Point</th>
        <th>Basic salary</th>
        <th>NHS pension</th>
        <th>A month after tax (England tax)</th>
        <th>A month after tax (Scottish tax)</th>
      </tr>
    </thead>
  );

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Doctor Salary After Tax: NHS Doctor Take-Home Pay Calculator {TAX_YEAR.label}</h1>
      <Byline />
      <p className="lead">
        See what resident doctors (FY1 to ST8) and consultants take home each month after tax, National Insurance, NHS
        pension and student loan, using the England pay scales from 1 April 2026.
      </p>
      <DoctorCalculator />
      <div className="prose">
        <h2>Resident doctor pay scale and take-home pay 2026/27</h2>
        <p>
          England basic pay, full time (40 hours a week), 2016 contract, after the 3.5% award and 2026 nodal point
          reform. Take-home includes NHS pension and no student loan. Basic pay only: extra hours, nights and weekends
          are paid on top.
        </p>
        <div className="table-scroll">
          <table>
            <Head />
            <tbody>
              {residents.map((g) => (
                <Row key={g.key} g={g} />
              ))}
            </tbody>
          </table>
        </div>

        <h2>Consultant pay scale and take-home pay 2026/27</h2>
        <p>England, 2003 contract, 10 programmed activities. Excludes additional PAs and clinical impact awards.</p>
        <div className="table-scroll">
          <table>
            <Head />
            <tbody>
              {consultants.map((g) => (
                <Row key={g.key} g={g} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">
          The &quot;Scottish tax&quot; column applies Scottish Income Tax to England pay scales, to show the effect of tax
          alone. Doctors employed in Scotland are paid on Scottish pay scales.
        </p>

        <h2>NHS Pension contribution rates from 1 April 2026</h2>
        <table>
          <thead>
            <tr>
              <th>Pensionable pay</th>
              <th>Your contribution</th>
            </tr>
          </thead>
          <tbody>
            {NHS_PENSION_TIERS.map((t, i) => {
              const from = i === 0 ? 0 : NHS_PENSION_TIERS[i - 1].upTo + 1;
              return (
                <tr key={t.rate}>
                  <td>
                    {t.upTo === Infinity
                      ? `${gbp(from, 0)} and above`
                      : i === 0
                        ? `Up to ${gbp(t.upTo, 0)}`
                        : `${gbp(from, 0)} to ${gbp(t.upTo, 0)}`}
                  </td>
                  <td>{pct(t.rate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2>What adds to a doctor&apos;s basic pay</h2>
        <ul>
          <li>
            <strong>Additional rostered hours:</strong> hours above 40 a week in your work schedule, paid at your basic
            hourly rate.
          </li>
          <li>
            <strong>Night enhancement:</strong> extra pay for hours worked at night.
          </li>
          <li>
            <strong>Weekend allowance:</strong> a percentage of basic pay depending on how often you work weekends.
          </li>
          <li>
            <strong>On-call availability allowance</strong> and <strong>flexible pay premia</strong> for some
            specialties.
          </li>
          <li>
            <strong>London weighting</strong> for posts in and around London.
          </li>
        </ul>
        <p>
          Your work schedule shows your total pay. Add the extra amount in the calculator to see your full take-home pay.
          Nurses and other NHS staff on Agenda for Change can use the{" "}
          <Link href="/nhs-take-home-pay-calculator">NHS take home pay calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
