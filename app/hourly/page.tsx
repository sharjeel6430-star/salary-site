import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { HOURLY_RATES, hourlyPath } from "@/lib/hourly";
import { calculate, gbp, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/hourly"),
  description: `How much a year is your hourly rate? Annual salary and monthly take-home pay for every hourly wage from £8 to £100 in ${TAX_YEAR.label}.`,
  alternates: { canonical: "/hourly" },
};

export default function HourlyIndex() {
  return (
    <>
      <h1>Hourly Rate to Salary Table UK {TAX_YEAR.label}</h1>
      <Byline />
      <p className="lead">Based on 37.5 hours a week and 52 paid weeks. Click a rate for the full breakdown.</p>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col">Hourly rate</th>
              <th scope="col">Yearly (gross)</th>
              <th scope="col">Monthly take-home</th>
            </tr>
          </thead>
          <tbody>
            {HOURLY_RATES.map((h) => {
              const a = h * 37.5 * 52;
              const r = calculate({ gross: a });
              return (
                <tr key={h}>
                  <th scope="row">
                    <Link href={hourlyPath(h)}>{gbp(h)} an hour</Link>
                  </th>
                  <td>{gbp(a, 0)}</td>
                  <td>{gbp(r.takeHome / 12)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
