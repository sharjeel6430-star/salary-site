"use client";

import { useState } from "react";
import { gbp, type Region } from "@/lib/tax";
import { REDUNDANCY, redundancyTax, statutoryRedundancy, type Nation } from "@/lib/redundancy";

export default function RedundancyCalculator() {
  const [age, setAge] = useState("45");
  const [years, setYears] = useState("12");
  const [pay, setPay] = useState("650");
  const [payPeriod, setPayPeriod] = useState<"week" | "year">("week");
  const [nation, setNation] = useState<Nation | "scotland">("gb");
  const [extra, setExtra] = useState("");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const weekly = payPeriod === "week" ? n(pay) : n(pay) / 52;
  const r = statutoryRedundancy({ age: n(age), years: n(years), weeklyPay: weekly, nation: nation === "ni" ? "ni" : "gb" });
  const total = r.pay + n(extra);
  const region: Region = nation === "scotland" ? "scotland" : "ruk";
  const tax = redundancyTax({ total, salaryThisYear: weekly * 52, region });
  const cap = REDUNDANCY.weeklyCap[nation === "ni" ? "ni" : "gb"];

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Your age when made redundant</span>
            <div className="input-row">
              <input inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
              <span className="suffix">years</span>
            </div>
          </label>
          <label className="field">
            <span>Full years worked for this employer</span>
            <div className="input-row">
              <input inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value)} />
              <span className="suffix">years</span>
            </div>
          </label>
          <label className="field">
            <span>Your pay before tax</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={pay} onChange={(e) => setPay(e.target.value)} />
              <select value={payPeriod} onChange={(e) => setPayPeriod(e.target.value as "week" | "year")} aria-label="Pay period">
                <option value="week">per week</option>
                <option value="year">per year</option>
              </select>
            </div>
          </label>
          <label className="field">
            <span>Where do you work?</span>
            <select value={nation} onChange={(e) => setNation(e.target.value as Nation | "scotland")}>
              <option value="gb">England or Wales</option>
              <option value="scotland">Scotland</option>
              <option value="ni">Northern Ireland</option>
            </select>
          </label>
          <label className="field">
            <span>Extra redundancy pay from your employer (optional)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={extra} placeholder="0" onChange={(e) => setExtra(e.target.value)} />
            </div>
          </label>
        </form>

        <div className="calc-result" aria-live="polite">
          <p className="result-label">Statutory redundancy pay</p>
          <p className="result-big">{gbp(r.pay)}</p>
          {r.eligible ? (
            <p className="result-sub">
              {r.weeks} weeks&apos; pay × {gbp(r.weeklyPayUsed)} a week, for {r.yearsCounted} full{" "}
              {r.yearsCounted === 1 ? "year" : "years"} of service
              {r.capped ? ` (weekly pay capped at ${gbp(cap, 0)})` : ""}.
            </p>
          ) : (
            <p className="result-sub">
              <strong>You need at least 2 full years with your employer to get statutory redundancy pay.</strong> Check
              your contract, as some employers pay redundancy from day one.
            </p>
          )}
          <dl className="stats">
            <div>
              <dt>Total package</dt>
              <dd>{gbp(total, 0)}</dd>
            </div>
            <div>
              <dt>Tax to pay</dt>
              <dd>{gbp(tax.tax, 0)}</dd>
            </div>
            <div>
              <dt>You receive</dt>
              <dd>{gbp(tax.net, 0)}</dd>
            </div>
          </dl>
          <p className="result-sub">
            {total <= REDUNDANCY.taxFree
              ? "Redundancy pay up to £30,000 is free of Income Tax and National Insurance."
              : `The first £30,000 is tax-free. The other ${gbp(tax.taxable, 0)} is taxed as income — estimated here on top of a full year's salary.`}
          </p>
          {n(years) > Math.max(0, n(age) - 16) && n(age) > 0 && (
            <p className="note">Service can only count from age 16, so we used {Math.max(0, n(age) - 16)} years.</p>
          )}
        </div>
      </div>
      <p className="muted">
        Notice pay, holiday pay owed and pay in lieu of notice are paid on top and taxed as normal pay. They are not
        included here.
      </p>
      {r.eligible && (
        <>
          <h3 className="section-title">How your weeks of pay add up</h3>
          <div className="table-wrap">
            <table className="breakdown compact">
              <thead>
                <tr>
                  <th scope="col">Years of service</th>
                  <th scope="col">Age during those years</th>
                  <th scope="col">Weeks per year</th>
                  <th scope="col">Weeks</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Aged 41 or over", test: (a: number) => a >= 41, rate: 1.5 },
                  { label: "Aged 22 to 40", test: (a: number) => a >= 22 && a < 41, rate: 1 },
                  { label: "Under 22", test: (a: number) => a < 22, rate: 0.5 },
                ].map((g) => {
                  const count = r.breakdown.filter((b) => g.test(b.ageDuring)).length;
                  if (!count) return null;
                  return (
                    <tr key={g.label}>
                      <th scope="row">{count}</th>
                      <td>{g.label}</td>
                      <td>{g.rate}</td>
                      <td>{count * g.rate}</td>
                    </tr>
                  );
                })}
                <tr className="total">
                  <th scope="row">{r.yearsCounted}</th>
                  <td>Total</td>
                  <td></td>
                  <td>{r.weeks}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
