import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import NhsCalculator from "@/components/NhsCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { NHS_BANDS, NHS_PENSION_TIERS } from "@/lib/nhs";
import { gbp, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/nhs-take-home-pay-calculator"),
  description: `NHS take home pay calculator for ${TAX_YEAR.label}. Pick your Agenda for Change band and pay point to see your monthly pay after tax, NI and NHS pension contributions.`,
  alternates: { canonical: "/nhs-take-home-pay-calculator" },
};

const faqs = [
  {
    q: "How is NHS take-home pay worked out?",
    a: "Your NHS pension contribution is taken from your gross pay first, which lowers the pay you are taxed on. Income Tax, National Insurance and any student loan are then deducted to give your take-home pay.",
  },
  {
    q: "How much do I pay into the NHS pension?",
    a: "From 1 April 2026 members pay between 5.2% and 12.5% of pensionable pay, depending on their actual annual pensionable pay. The whole of your pay is charged at your tier's rate.",
  },
  {
    q: "Does NHS pension reduce National Insurance?",
    a: "No. NHS pension contributions are taken before Income Tax but not before National Insurance, so you get tax relief but still pay NI on your full salary.",
  },
  {
    q: "Are these pay scales for Scotland, Wales and Northern Ireland?",
    a: "These are the Agenda for Change pay scales for England. NHS Scotland, Wales and Northern Ireland set their own pay scales, which can differ.",
  },
];

export default function NhsPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>NHS Take Home Pay Calculator {TAX_YEAR.label}</h1>
      <Byline />
      <p className="lead">
        Choose your Agenda for Change band and pay point to see your NHS salary after tax, National Insurance and pension
        contributions. Doctors are not on Agenda for Change: use the{" "}
        <Link href="/doctor-take-home-pay-calculator">doctor take home pay calculator</Link>.
      </p>
      <NhsCalculator />
      <div className="prose">
        <h2>NHS pay bands {TAX_YEAR.label}</h2>
        <p>
          See every band&apos;s salary and take-home pay on our <Link href="/nhs-pay-bands">NHS pay bands 2026/27</Link>{" "}
          page, or jump to a band:
        </p>
        <ul className="pill-grid">
          {NHS_BANDS.map((b) => (
            <li key={b.slug}>
              <Link href={`/nhs-pay-bands/${b.slug}`}>{b.name}</Link>
            </li>
          ))}
        </ul>
        <h2>NHS pension contribution rates from April 2026</h2>
        <table>
          <thead>
            <tr>
              <th>Actual annual pensionable pay</th>
              <th>Member contribution</th>
            </tr>
          </thead>
          <tbody>
            {NHS_PENSION_TIERS.map((t, i) => {
              const from = i === 0 ? 0 : NHS_PENSION_TIERS[i - 1].upTo + 1;
              return (
                <tr key={t.rate}>
                  <td>{t.upTo === Infinity ? `${gbp(from, 0)} and above` : `${i === 0 ? "Up to" : gbp(from, 0) + " to"} ${gbp(t.upTo, 0)}`}</td>
                  <td>{(t.rate * 100).toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted">Source: NHS Employers, NHS Pension Scheme member contributions from 1 April 2026.</p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
