import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { SALARY_PAGES, salaryPath } from "@/lib/site";
import { calculate, gbp, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/salary"),
  description: `Take-home pay for every UK salary from £10,000 to £500,000 in ${TAX_YEAR.label}: yearly and monthly net pay after Income Tax and National Insurance.`,
  alternates: { canonical: "/salary" },
};

const groups = [
  { title: "£10,000 – £29,999", min: 10000, max: 29999 },
  { title: "£30,000 – £49,999", min: 30000, max: 49999 },
  { title: "£50,000 – £79,999", min: 50000, max: 79999 },
  { title: "£80,000 – £150,000", min: 80000, max: 150000 },
  { title: "Over £150,000", min: 150001, max: Infinity },
];

export default function SalaryIndex() {
  return (
    <>
      <h1>UK Salary After Tax Table {TAX_YEAR.label}</h1>
      <Byline />
      <p className="lead">
        Take-home pay for England, Wales and Northern Ireland on a standard tax code. Click any salary for the full
        breakdown, Scottish figures, student loan and pension scenarios.
      </p>
      <p>
        <Link href="/data/uk-take-home-pay-2026-27">Take-home pay for every salary from £15k to £150k: charts, full table and CSV download</Link>{" "}
        (free to reuse with a link).
      </p>
      {groups.map((g) => (
        <section key={g.title}>
          <h2>{g.title}</h2>
          <div className="table-wrap">
            <table className="breakdown compact">
              <thead>
                <tr>
                  <th scope="col">Salary</th>
                  <th scope="col">Yearly take-home</th>
                  <th scope="col">Monthly take-home</th>
                  <th scope="col">Weekly take-home</th>
                </tr>
              </thead>
              <tbody>
                {SALARY_PAGES.filter((s) => s >= g.min && s <= g.max).map((s) => {
                  const r = calculate({ gross: s });
                  return (
                    <tr key={s}>
                      <th scope="row">
                        <Link href={salaryPath(s)}>{gbp(s, 0)}</Link>
                      </th>
                      <td>{gbp(r.takeHome)}</td>
                      <td>{gbp(r.takeHome / 12)}</td>
                      <td>{gbp(r.takeHome / 52)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}
