"use client";

import { useState } from "react";
import Link from "next/link";
import { calculate, gbp, pct, type Region, type StudentPlan } from "@/lib/tax";
import { nearestSalaryPage, salaryPath } from "@/lib/site";

type Basis = "year" | "month";

export default function MonthlyCalculator() {
  const [amount, setAmount] = useState("35000");
  const [basis, setBasis] = useState<Basis>("year");
  const [region, setRegion] = useState<Region>("ruk");
  const [pension, setPension] = useState("0");
  const [studentPlan, setStudentPlan] = useState<StudentPlan>("none");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,%\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };
  const annual = basis === "year" ? n(amount) : n(amount) * 12;
  const r = calculate({ gross: annual, region, studentPlan, pensionPercent: Math.min(100, n(pension)) });
  const m = (x: number) => gbp(x / 12);
  const nearest = nearestSalaryPage(Math.round(annual));

  const rows = [
    { label: "Gross pay", v: r.gross },
    ...(r.pension > 0 ? [{ label: "Pension", v: -r.pension }] : []),
    { label: "Income Tax", v: -r.incomeTax },
    { label: "National Insurance", v: -r.nationalInsurance },
    ...(r.studentLoan > 0 ? [{ label: "Student loan", v: -r.studentLoan }] : []),
    { label: "Take-home pay", v: r.takeHome, strong: true },
  ];

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="field">
            <legend>I know my</legend>
            <div className="segmented">
              <button type="button" aria-pressed={basis === "year"} onClick={() => setBasis("year")}>
                Annual salary
              </button>
              <button type="button" aria-pressed={basis === "month"} onClick={() => setBasis("month")}>
                Monthly gross pay
              </button>
            </div>
          </fieldset>
          <label className="field">
            <span>{basis === "year" ? "Annual salary" : "Monthly gross pay"}</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </label>
          <fieldset className="field">
            <legend>Where do you live?</legend>
            <div className="segmented">
              <button type="button" aria-pressed={region === "ruk"} onClick={() => setRegion("ruk")}>
                England, Wales, NI
              </button>
              <button type="button" aria-pressed={region === "scotland"} onClick={() => setRegion("scotland")}>
                Scotland
              </button>
            </div>
          </fieldset>
          <label className="field">
            <span>Pension contribution (% of salary, salary sacrifice)</span>
            <div className="input-row">
              <input inputMode="decimal" value={pension} onChange={(e) => setPension(e.target.value)} />
              <span className="prefix">%</span>
            </div>
          </label>
          <label className="field">
            <span>Student loan</span>
            <select value={studentPlan} onChange={(e) => setStudentPlan(e.target.value as StudentPlan)}>
              <option value="none">No student loan</option>
              <option value="plan1">Plan 1</option>
              <option value="plan2">Plan 2</option>
              <option value="plan4">Plan 4 (Scotland)</option>
              <option value="plan5">Plan 5</option>
            </select>
          </label>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Your monthly take-home pay</p>
          <p className="result-big">{m(r.takeHome)}</p>
          <p className="result-sub">
            From {m(r.gross)} gross a month ({gbp(r.gross, 0)} a year)
          </p>
          <dl className="stats">
            <div>
              <dt>Tax a month</dt>
              <dd>{m(r.incomeTax)}</dd>
            </div>
            <div>
              <dt>NI a month</dt>
              <dd>{m(r.nationalInsurance)}</dd>
            </div>
            <div>
              <dt>Weekly</dt>
              <dd>{gbp(r.takeHome / 52)}</dd>
            </div>
          </dl>
          <p className="result-sub">
            You keep {pct(r.gross > 0 ? r.takeHome / r.gross : 0)} of your pay.
            {nearest && (
              <>
                {" "}
                See the full <Link href={salaryPath(nearest)}>{gbp(nearest, 0)} after tax</Link> breakdown.
              </>
            )}
          </p>
        </div>
      </div>
      <h3 className="section-title">Your payslip each month</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Monthly</th>
              <th scope="col">Yearly</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className={row.strong ? "total" : undefined}>
                <th scope="row">{row.label}</th>
                <td>{gbp(row.v / 12)}</td>
                <td>{gbp(row.v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
