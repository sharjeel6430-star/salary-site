"use client";

import { useState } from "react";
import { dividendTax, DIVIDENDS } from "@/lib/business";
import { gbp } from "@/lib/tax";

export default function DividendTaxCalculator() {
  const [salary, setSalary] = useState("12570");
  const [divs, setDivs] = useState("40000");
  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };
  const r = dividendTax({ salary: n(salary), dividends: n(divs) });
  const rows = [
    { label: "Covered by Personal Allowance", amount: r.paUsedOnDividends, rate: "0%", tax: 0 },
    { label: "Dividend Allowance", amount: r.lines.allowance, rate: "0%", tax: 0 },
    { label: "Basic rate", amount: r.lines.basic, rate: "10.75%", tax: r.taxBreakdown.basic },
    { label: "Higher rate", amount: r.lines.higher, rate: "35.75%", tax: r.taxBreakdown.higher },
    { label: "Additional rate", amount: r.lines.additional, rate: "39.35%", tax: r.taxBreakdown.additional },
  ].filter((x) => x.amount > 0);

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Salary and other income (before tax)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Dividends received in the tax year</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={divs} onChange={(e) => setDivs(e.target.value)} />
            </div>
          </label>
          <p className="note">
            Dividend tax uses the same bands across the whole UK, including Scotland. Salary tax here uses England,
            Wales and NI rates.
          </p>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Dividend tax {DIVIDENDS.label}</p>
          <p className="result-big">{gbp(r.dividendTax)}</p>
          <p className="result-sub">
            Plus {gbp(r.salaryTax)} Income Tax and {gbp(r.ni)} NI on the salary
          </p>
          <dl className="stats">
            <div>
              <dt>Total tax</dt>
              <dd>{gbp(r.totalTax, 0)}</dd>
            </div>
            <div>
              <dt>Take-home</dt>
              <dd>{gbp(r.takeHome, 0)}</dd>
            </div>
            <div>
              <dt>Per month</dt>
              <dd>{gbp(r.takeHome / 12, 0)}</dd>
            </div>
          </dl>
        </div>
      </div>
      <h3 className="section-title">How your dividends are taxed</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col">Band</th>
              <th scope="col">Dividends in band</th>
              <th scope="col">Rate</th>
              <th scope="col">Tax</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.label}>
                <th scope="row">{x.label}</th>
                <td>{gbp(x.amount)}</td>
                <td>{x.rate}</td>
                <td>{gbp(x.tax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
