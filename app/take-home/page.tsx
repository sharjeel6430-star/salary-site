import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { grossForTakeHome, MONTHLY_TARGETS, monthlyPath } from "@/lib/reverse";
import { gbp, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/take-home"),
  description: `How much salary you need for each monthly take-home amount in the UK, from £1,500 to £10,000 a month (${TAX_YEAR.label}).`,
  alternates: { canonical: "/take-home" },
};

export default function TakeHomeIndex() {
  return (
    <div className="prose">
      <h1>Monthly take-home pay: salary needed</h1>
      <Byline />
      <p className="lead">
        Pick the amount you want to take home each month to see the salary you need. Or enter any amount in the{" "}
        <Link href="/net-to-gross-salary-calculator">net to gross salary calculator</Link>.
      </p>
      <ul className="link-grid">
        {MONTHLY_TARGETS.map((m) => (
          <li key={m}>
            <Link href={monthlyPath(m)}>
              {gbp(m, 0)} a month → {gbp(grossForTakeHome(m * 12), 0)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
