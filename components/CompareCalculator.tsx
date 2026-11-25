"use client";

// Compare two salaries or job offers side by side, after tax, NI, student loan and pension.
import { useState } from "react";
import { calculate, gbp, pct, Region, StudentPlan, TaxYearKey } from "@/lib/tax";

type Offer = { salary: string; bonus: string; pension: string; region: Region };

const n = (s: string) => {
  const v = parseFloat(s.replace(/[£,%\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

function OfferFields({ title, o, set }: { title: string; o: Offer; set: (o: Offer) => void }) {
  return (
    <fieldset className="compare-offer">
      <legend>{title}</legend>
      <label className="field">
        <span>Salary per year</span>
        <div className="input-row">
          <span className="prefix">£</span>
          <input inputMode="decimal" value={o.salary} onChange={(e) => set({ ...o, salary: e.target.value })} />
        </div>
      </label>
      <label className="field">
        <span>Bonus per year</span>
        <div className="input-row">
          <span className="prefix">£</span>
          <input inputMode="decimal" placeholder="0" value={o.bonus} onChange={(e) => set({ ...o, bonus: e.target.value })} />
        </div>
      </label>
      <label className="field">
        <span>Your pension contribution</span>
        <div className="input-row">
          <input inputMode="decimal" value={o.pension} onChange={(e) => set({ ...o, pension: e.target.value })} aria-label={`${title} pension percent`} />
          <span className="suffix">%</span>
        </div>
      </label>
      <label className="field">
        <span>Job location</span>
        <select value={o.region} onChange={(e) => set({ ...o, region: e.target.value as Region })}>
          <option value="ruk">England, Wales or NI</option>
          <option value="scotland">Scotland</option>
        </select>
      </label>
    </fieldset>
  );
}

export default function CompareCalculator() {
  const [a, setA] = useState<Offer>({ salary: "35000", bonus: "", pension: "5", region: "ruk" });
  const [b, setB] = useState<Offer>({ salary: "42000", bonus: "", pension: "5", region: "ruk" });
  const [studentPlan, setStudentPlan] = useState<StudentPlan>("none");
  const [year, setYear] = useState<TaxYearKey>("2026/27");

  const run = (o: Offer) =>
    calculate({
      gross: n(o.salary) + n(o.bonus),
      region: o.region,
      pensionPercent: Math.min(50, n(o.pension)),
      pensionType: "sacrifice",
      studentPlan,
      year,
    });
  const ra = run(a);
  const rb = run(b);
  const grossDiff = rb.gross - ra.gross;
  const netDiff = rb.takeHome - ra.takeHome;
  const kept = grossDiff !== 0 ? netDiff / grossDiff : 0;

  const rows = [
    { label: "Gross pay", a: ra.gross, b: rb.gross },
    { label: "Pension (yours)", a: ra.pension, b: rb.pension },
    { label: "Income Tax", a: ra.incomeTax, b: rb.incomeTax },
    { label: "National Insurance", a: ra.nationalInsurance, b: rb.nationalInsurance },
    ...(studentPlan !== "none" ? [{ label: "Student loan", a: ra.studentLoan, b: rb.studentLoan }] : []),
    { label: "Take-home a year", a: ra.takeHome, b: rb.takeHome, strong: true },
    { label: "Take-home a month", a: ra.takeHome / 12, b: rb.takeHome / 12, strong: true },
    { label: "Take-home a week", a: ra.takeHome / 52, b: rb.takeHome / 52 },
  ];

  return (
    <section className="card">
      <div className="compare-grid">
        <OfferFields title="Salary A (current job)" o={a} set={setA} />
        <OfferFields title="Salary B (new offer)" o={b} set={setB} />
      </div>
      <div className="compare-shared">
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
        <label className="field">
          <span>Tax year</span>
          <select value={year} onChange={(e) => setYear(e.target.value as TaxYearKey)}>
            <option value="2026/27">2026/27</option>
            <option value="2025/26">2025/26</option>
          </select>
        </label>
      </div>

      <div className="calc-result compare-result" aria-live="polite">
        <p className="result-label">Salary B vs Salary A</p>
        <p className="result-big">
          {netDiff >= 0 ? "+" : "−"}
          {gbp(Math.abs(netDiff / 12))}
          <span> / month take-home</span>
        </p>
        <p className="result-sub">
          {netDiff >= 0 ? "+" : "−"}
          {gbp(Math.abs(netDiff))} a year after tax, from a {grossDiff >= 0 ? "+" : "−"}
          {gbp(Math.abs(grossDiff), 0)} difference in gross pay.
          {grossDiff !== 0 && kept > 0 && <> You keep {pct(kept, 0)} of the difference.</>}
        </p>
      </div>

      <h3 className="section-title">Side-by-side comparison ({year})</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Salary A</th>
              <th scope="col">Salary B</th>
              <th scope="col">Difference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={r.strong ? "total" : undefined}>
                <th scope="row">{r.label}</th>
                <td>{gbp(r.a)}</td>
                <td>{gbp(r.b)}</td>
                <td>
                  {r.b - r.a >= 0 ? "+" : "−"}
                  {gbp(Math.abs(r.b - r.a))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Pension is treated as salary sacrifice. Employer pension and benefits are not included.</p>
    </section>
  );
}
