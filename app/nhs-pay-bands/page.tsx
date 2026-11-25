import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { NHS_BANDS } from "@/lib/nhs";
import { nhsTakeHome } from "@/lib/nhsTakeHome";
import { gbp } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/nhs-pay-bands"),
  description:
    "NHS pay bands for 2026/27: every Agenda for Change band from Band 2 to Band 9, with annual salary, monthly take-home pay after tax, NI and NHS pension.",
  alternates: { canonical: "/nhs-pay-bands" },
};

export default function NhsBandsPage() {
  return (
    <>
      <h1>NHS Pay Bands 2026/27</h1>
      <Byline />
      <p className="lead">
        Agenda for Change salaries for England from 1 April 2026, with take-home pay after Income Tax, National Insurance
        and NHS pension contributions.
      </p>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col">Band</th>
              <th scope="col">Pay point</th>
              <th scope="col">Annual salary</th>
              <th scope="col">Monthly take-home</th>
              <th scope="col">Hourly (gross)</th>
            </tr>
          </thead>
          <tbody>
            {NHS_BANDS.flatMap((b) =>
              b.points.map((p, i) => {
                const r = nhsTakeHome(p.salary);
                return (
                  <tr key={`${b.slug}-${p.label}`}>
                    <th scope="row">{i === 0 ? <Link href={`/nhs-pay-bands/${b.slug}`}>{b.name}</Link> : ""}</th>
                    <td>{p.label}</td>
                    <td>{gbp(p.salary, 0)}</td>
                    <td>{gbp(r.takeHome / 12)}</td>
                    <td>{gbp(p.salary / 52 / 37.5)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="prose">
        <p className="note">
          Full-time (37.5 hours), England, Wales or Northern Ireland tax, NHS pension at the tier rate for each salary, no
          student loan. Band 1 is closed to new entrants. Source: NHS Employers pay scales for 2026/27.
        </p>
        <p>
          <Link href="/nhs-take-home-pay-calculator">Work out your own NHS take-home pay →</Link>
        </p>
      </div>
    </>
  );
}
