"use client";

import { useState } from "react";
import { gbp, pct, type Region } from "@/lib/tax";
import { INCOME_MULTIPLES, affordability, repaymentPlan } from "@/lib/mortgage";

export default function MortgageCalculator() {
  const [mode, setMode] = useState<"repay" | "borrow">("repay");
  // Repayments
  const [price, setPrice] = useState("300000");
  const [deposit, setDeposit] = useState("30000");
  const [rate, setRate] = useState("4.5");
  const [term, setTerm] = useState("25");
  const [interestOnly, setInterestOnly] = useState(false);
  // Borrowing
  const [income1, setIncome1] = useState("40000");
  const [income2, setIncome2] = useState("");
  const [multiple, setMultiple] = useState(4.5);
  const [region, setRegion] = useState<Region>("ruk");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,%\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const years = Math.min(40, Math.max(1, Math.round(n(term) || 25)));
  const loan = Math.max(0, n(price) - n(deposit));
  const plan = repaymentPlan({ loan, ratePct: n(rate), years, propertyPrice: n(price) });
  const afford = affordability({
    income1: n(income1),
    income2: n(income2),
    deposit: n(deposit),
    multiple,
    ratePct: n(rate),
    years,
    region,
  });
  const monthly = interestOnly ? plan.interestOnlyMonthly : plan.monthly;
  const milestones = plan.schedule.filter((r) => r.year % 5 === 0 || r.year === 1 || r.year === years);

  const rateAndTerm = (
    <>
      <label className="field">
        <span>Interest rate</span>
        <div className="input-row">
          <input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          <span className="suffix">%</span>
        </div>
      </label>
      <label className="field">
        <span>Mortgage term</span>
        <div className="input-row">
          <input inputMode="numeric" value={term} onChange={(e) => setTerm(e.target.value)} />
          <span className="suffix">years</span>
        </div>
      </label>
    </>
  );

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="field">
            <legend>What do you want to work out?</legend>
            <div className="segmented">
              <button type="button" aria-pressed={mode === "repay"} onClick={() => setMode("repay")}>
                Monthly repayments
              </button>
              <button type="button" aria-pressed={mode === "borrow"} onClick={() => setMode("borrow")}>
                How much can I borrow?
              </button>
            </div>
          </fieldset>

          {mode === "repay" ? (
            <>
              <label className="field">
                <span>Property price</span>
                <div className="input-row">
                  <span className="prefix">£</span>
                  <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </label>
              <label className="field">
                <span>Deposit</span>
                <div className="input-row">
                  <span className="prefix">£</span>
                  <input inputMode="decimal" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                </div>
              </label>
              {rateAndTerm}
              <fieldset className="field">
                <legend>Mortgage type</legend>
                <div className="segmented">
                  <button type="button" aria-pressed={!interestOnly} onClick={() => setInterestOnly(false)}>
                    Repayment
                  </button>
                  <button type="button" aria-pressed={interestOnly} onClick={() => setInterestOnly(true)}>
                    Interest only
                  </button>
                </div>
              </fieldset>
            </>
          ) : (
            <>
              <label className="field">
                <span>Your annual salary (before tax)</span>
                <div className="input-row">
                  <span className="prefix">£</span>
                  <input inputMode="decimal" value={income1} onChange={(e) => setIncome1(e.target.value)} />
                </div>
              </label>
              <label className="field">
                <span>Second applicant&apos;s salary (optional)</span>
                <div className="input-row">
                  <span className="prefix">£</span>
                  <input inputMode="decimal" value={income2} placeholder="0" onChange={(e) => setIncome2(e.target.value)} />
                </div>
              </label>
              <label className="field">
                <span>Deposit</span>
                <div className="input-row">
                  <span className="prefix">£</span>
                  <input inputMode="decimal" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                </div>
              </label>
              <label className="field">
                <span>Income multiple</span>
                <select value={multiple} onChange={(e) => setMultiple(parseFloat(e.target.value))}>
                  {INCOME_MULTIPLES.map((m) => (
                    <option key={m} value={m}>
                      {m} × income{m === 4.5 ? " (most common)" : m >= 5 ? " (some lenders, higher earners)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              {rateAndTerm}
              <fieldset className="field">
                <legend>Where do you live? (for take-home pay)</legend>
                <div className="segmented">
                  <button type="button" aria-pressed={region === "ruk"} onClick={() => setRegion("ruk")}>
                    England, Wales, NI
                  </button>
                  <button type="button" aria-pressed={region === "scotland"} onClick={() => setRegion("scotland")}>
                    Scotland
                  </button>
                </div>
              </fieldset>
            </>
          )}
        </form>

        <div className="calc-result" aria-live="polite">
          {mode === "repay" ? (
            <>
              <p className="result-label">Monthly repayment</p>
              <p className="result-big">{gbp(monthly)}</p>
              <p className="result-sub">
                On a {gbp(loan, 0)} {interestOnly ? "interest-only" : "repayment"} mortgage over {years} years at{" "}
                {n(rate)}%.
              </p>
              <dl className="stats">
                <div>
                  <dt>Loan to value</dt>
                  <dd>{plan.ltv !== null ? pct(plan.ltv, 0) : "–"}</dd>
                </div>
                <div>
                  <dt>Total interest</dt>
                  <dd>{gbp(interestOnly ? plan.interestOnlyMonthly * years * 12 : plan.totalInterest, 0)}</dd>
                </div>
                <div>
                  <dt>Total repaid</dt>
                  <dd>{gbp(interestOnly ? plan.interestOnlyMonthly * years * 12 + loan : plan.totalPaid, 0)}</dd>
                </div>
              </dl>
              {interestOnly ? (
                <p className="note">
                  With interest only, you still owe the full {gbp(loan, 0)} at the end of the term and need a plan to repay
                  it. The repayment version would cost {gbp(plan.monthly)} a month.
                </p>
              ) : (
                <p className="result-sub">
                  Interest only would be {gbp(plan.interestOnlyMonthly)} a month, but you would still owe {gbp(loan, 0)} at
                  the end.
                </p>
              )}
              {n(deposit) > n(price) && <p className="note">Your deposit is larger than the property price.</p>}
            </>
          ) : (
            <>
              <p className="result-label">You could borrow around</p>
              <p className="result-big">{gbp(afford.maxLoan, 0)}</p>
              <p className="result-sub">
                {multiple} × {gbp(afford.income, 0)} income. With your {gbp(n(deposit), 0)} deposit, that buys a home up to{" "}
                <strong>{gbp(afford.propertyPrice, 0)}</strong>.
              </p>
              <dl className="stats">
                <div>
                  <dt>Monthly repayment</dt>
                  <dd>{gbp(afford.monthly, 0)}</dd>
                </div>
                <div>
                  <dt>Take-home a month</dt>
                  <dd>{gbp(afford.takeHomeMonth, 0)}</dd>
                </div>
                <div>
                  <dt>Share of take-home</dt>
                  <dd>{pct(afford.shareOfTakeHome, 0)}</dd>
                </div>
              </dl>
              <p className="result-sub">Loan to value: {pct(afford.ltv, 0)}.</p>
              {afford.shareOfTakeHome > 0.4 && (
                <p className="note">
                  The repayment would take over 40% of your take-home pay. Lenders also check your spending, debts and
                  whether you could still pay if rates rose, so you may be offered less.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {mode === "repay" && !interestOnly && loan > 0 && (
        <>
          <h3 className="section-title">How your mortgage balance falls</h3>
          <div className="table-wrap">
            <table className="breakdown compact">
              <thead>
                <tr>
                  <th scope="col">Year</th>
                  <th scope="col">Interest paid that year</th>
                  <th scope="col">Capital repaid that year</th>
                  <th scope="col">Balance left</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((r) => (
                  <tr key={r.year}>
                    <th scope="row">Year {r.year}</th>
                    <td>{gbp(r.interest, 0)}</td>
                    <td>{gbp(r.capital, 0)}</td>
                    <td>{gbp(r.balance, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted">Assumes the same interest rate for the whole term. Fees and stamp duty are not included.</p>
        </>
      )}
    </section>
  );
}
