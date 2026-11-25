"use client";

import { useState } from "react";
import { selfEmployedTax, DEADLINES, SE_YEAR, TRADING_ALLOWANCE } from "@/lib/selfEmployed";
import { gbp, type Region, type StudentPlan } from "@/lib/tax";

const num = (s: string) => {
  const v = parseFloat(s.replace(/[£,\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export default function SelfEmployedCalculator() {
  const [income, setIncome] = useState("40000");
  const [expenses, setExpenses] = useState("5000");
  const [useTA, setUseTA] = useState(false);
  const [salary, setSalary] = useState("");
  const [region, setRegion] = useState<Region>("ruk");
  const [plan, setPlan] = useState<StudentPlan>("none");
  const r = selfEmployedTax({ income: num(income), expenses: num(expenses), useTradingAllowance: useTA, salary: num(salary), region, studentPlan: plan });
  const rows = [
    { label: "Income Tax", v: r.incomeTax },
    { label: "Class 4 National Insurance", v: r.class4 },
    ...(r.studentLoan > 0 ? [{ label: "Student loan repayment", v: r.studentLoan }] : []),
  ];

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Self-employed income for the year (sales or fees, before expenses)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Allowable business expenses</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={expenses} disabled={useTA} onChange={(e) => setExpenses(e.target.value)} />
            </div>
          </label>
          <label className="check">
            <input type="checkbox" checked={useTA} onChange={(e) => setUseTA(e.target.checked)} />
            Use the £{TRADING_ALLOWANCE.toLocaleString("en-GB")} trading allowance instead of expenses
          </label>
          <label className="field">
            <span>Salary from a job in the same tax year (optional)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={salary} placeholder="0" onChange={(e) => setSalary(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Where you live</span>
            <select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
              <option value="ruk">England, Wales or Northern Ireland</option>
              <option value="scotland">Scotland</option>
            </select>
          </label>
          <label className="field">
            <span>Student loan</span>
            <select value={plan} onChange={(e) => setPlan(e.target.value as StudentPlan)}>
              <option value="none">None</option>
              <option value="plan1">Plan 1</option>
              <option value="plan2">Plan 2</option>
              <option value="plan4">Plan 4 (Scotland)</option>
              <option value="plan5">Plan 5</option>
            </select>
          </label>
          {r.tradingAllowanceBetter && (
            <p className="note">
              Your expenses are under £{TRADING_ALLOWANCE.toLocaleString("en-GB")}. Claiming the trading allowance instead
              would lower your taxable profit.
            </p>
          )}
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Take-home profit {SE_YEAR}</p>
          <p className="result-big">{gbp(r.takeHome, 0)}</p>
          <p className="result-sub">
            From a profit of {gbp(r.profit, 0)}, you pay {gbp(r.bill, 0)} through Self Assessment
          </p>
          <dl className="stats">
            <div>
              <dt>Income Tax</dt>
              <dd>{gbp(r.incomeTax, 0)}</dd>
            </div>
            <div>
              <dt>Class 4 NI</dt>
              <dd>{gbp(r.class4, 0)}</dd>
            </div>
            <div>
              <dt>Set aside a month</dt>
              <dd>{gbp(r.setAsideMonthly, 0)}</dd>
            </div>
          </dl>
          {num(salary) > 0 && <p className="note">Tax on your salary is already paid through PAYE and isn&apos;t included here.</p>}
        </div>
      </div>

      <h3 className="section-title">Your tax bill</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <tbody>
            <tr><th scope="row">Income</th><td>{gbp(num(income))}</td></tr>
            <tr><th scope="row">{useTA ? "Trading allowance" : "Expenses"}</th><td>–{gbp(r.deduction)}</td></tr>
            <tr><th scope="row"><b>Taxable profit</b></th><td><b>{gbp(r.profit)}</b></td></tr>
            {rows.map((x) => (
              <tr key={x.label}><th scope="row">{x.label}</th><td>–{gbp(x.v)}</td></tr>
            ))}
            <tr><th scope="row"><b>Take-home profit</b></th><td><b>{gbp(r.takeHome)}</b></td></tr>
            <tr><th scope="row">Share of profit paid in tax{r.studentLoan > 0 ? " and loan" : ""}</th><td>{(r.effectiveRate * 100).toFixed(1)}%</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className="section-title">When you pay</h3>
      {r.bill === 0 ? (
        <p>Nothing to pay on these figures.</p>
      ) : r.poaRequired ? (
        <div className="table-wrap">
          <table className="breakdown compact">
            <thead><tr><th scope="col">If this is your first year</th><th scope="col">Amount</th></tr></thead>
            <tbody>
              <tr><th scope="row">{DEADLINES.returnAndBalance}: the {SE_YEAR} bill plus the first payment on account for 2027/28</th><td>{gbp(r.firstYear.january)}</td></tr>
              <tr><th scope="row">{DEADLINES.secondPoa}: second payment on account</th><td>{gbp(r.firstYear.july)}</td></tr>
              <tr><th scope="row">After that, if profit stays the same: each 31 January and 31 July</th><td>{gbp(r.poaEach)}{r.studentLoan > 0 ? ` (plus ${gbp(r.studentLoan)} student loan each January)` : ""}</td></tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>
          You pay the whole {gbp(r.bill)} by {DEADLINES.returnAndBalance}. No payments on account are needed, because{" "}
          {r.incomeTax + r.class4 < 1000 ? "the Income Tax and Class 4 due are under £1,000" : "over 80% of your tax was already paid through PAYE"}.
        </p>
      )}
      <p className="note">
        {r.class2TreatedAsPaid
          ? "With profits of £7,105 or more, your Class 2 NI is treated as paid, so this year counts towards your State Pension at no cost."
          : `With profits under £7,105 you can pay voluntary Class 2 NI of £3.65 a week (${gbp(r.voluntaryClass2Year)} a year) to protect your State Pension record.`}
        {r.mtdFrom &&
          ` At this turnover, Making Tax Digital for Income Tax (digital records and quarterly updates) applies from ${r.mtdFrom}. HMRC decides this from the turnover on an earlier tax return, including any rental income.`}
      </p>
    </section>
  );
}
