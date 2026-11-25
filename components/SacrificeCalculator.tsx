"use client";

import { useState } from "react";
import { calculate, gbp, Region, StudentPlan } from "@/lib/tax";

export default function SacrificeCalculator() {
  const [salary, setSalary] = useState("45000");
  const [unit, setUnit] = useState<"pct" | "gbp">("pct");
  const [amount, setAmount] = useState("5");
  const [region, setRegion] = useState<Region>("ruk");
  const [studentPlan, setStudentPlan] = useState<StudentPlan>("none");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,%\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };
  const gross = n(salary);
  const pct = gross > 0 ? Math.min(100, unit === "pct" ? n(amount) : (n(amount) / gross) * 100) : 0;

  const base = { gross, region, studentPlan };
  const before = calculate(base);
  const after = calculate({ ...base, pensionPercent: pct, pensionType: "sacrifice" });
  const netpay = calculate({ ...base, pensionPercent: pct, pensionType: "netpay" });

  const contribution = after.pension;
  const cost = before.takeHome - after.takeHome;
  const saving = contribution - cost;
  const taxSaved = before.incomeTax - after.incomeTax;
  const niSaved = before.nationalInsurance - after.nationalInsurance;
  const loanSaved = before.studentLoan - after.studentLoan;
  const employerNISaved = before.employerNI - after.employerNI;

  const rows = [
    { label: "Gross salary", b: before.gross, a: after.gross },
    { label: "Pension contribution", b: 0, a: contribution },
    { label: "Income Tax", b: before.incomeTax, a: after.incomeTax },
    { label: "National Insurance", b: before.nationalInsurance, a: after.nationalInsurance },
    ...(studentPlan !== "none" ? [{ label: "Student Loan", b: before.studentLoan, a: after.studentLoan }] : []),
    { label: "Take-home pay", b: before.takeHome, a: after.takeHome, strong: true },
  ];

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Annual salary</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Amount you sacrifice into your pension</span>
            <div className="input-row">
              <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="Sacrifice amount" />
              <select value={unit} onChange={(e) => setUnit(e.target.value as "pct" | "gbp")} aria-label="Unit">
                <option value="pct">% of salary</option>
                <option value="gbp">£ per year</option>
              </select>
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
          <p className="result-label">Into your pension each year</p>
          <p className="result-big">{gbp(contribution, 0)}</p>
          <p className="result-sub">
            Costs you only <strong>{gbp(cost)}</strong> in take-home pay ({gbp(cost / 12)} a month)
          </p>
          <dl className="stats">
            <div>
              <dt>Tax saved</dt>
              <dd>{gbp(taxSaved, 0)}</dd>
            </div>
            <div>
              <dt>NI saved</dt>
              <dd>{gbp(niSaved, 0)}</dd>
            </div>
            <div>
              <dt>{loanSaved > 0 ? "Loan saved" : "Total saved"}</dt>
              <dd>{gbp(loanSaved > 0 ? loanSaved : saving, 0)}</dd>
            </div>
          </dl>
          <p className="result-sub">
            vs a net pay pension: you keep {gbp(after.takeHome - netpay.takeHome)} more a year. Your employer saves{" "}
            {gbp(employerNISaved, 0)} in employer NI.
          </p>
        </div>
      </div>
      <h3 className="section-title">Before and after salary sacrifice (yearly)</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Before</th>
              <th scope="col">After</th>
              <th scope="col">Difference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={r.strong ? "total" : undefined}>
                <th scope="row">{r.label}</th>
                <td>{gbp(r.b)}</td>
                <td>{gbp(r.a)}</td>
                <td>{gbp(r.a - r.b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
