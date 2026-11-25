"use client";

import { useState } from "react";
import { gbp, type Region } from "@/lib/tax";
import {
  AGE_BANDS,
  WAGE_YEARS,
  checkPay,
  minimumWagePay,
  type AgeBand,
  type PayPeriod,
  type WageYearKey,
} from "@/lib/minimumWage";

const PERIOD_LABELS: { key: PayPeriod; label: string }[] = [
  { key: "hour", label: "per hour" },
  { key: "week", label: "per week" },
  { key: "month", label: "per month" },
  { key: "year", label: "per year" },
];

export default function MinimumWageCalculator() {
  const [mode, setMode] = useState<"earn" | "check">("earn");
  const [band, setBand] = useState<AgeBand>("21plus");
  const [year, setYear] = useState<WageYearKey>("2026/27");
  const [hours, setHours] = useState("37.5");
  const [region, setRegion] = useState<Region>("ruk");
  const [amount, setAmount] = useState("24000");
  const [period, setPeriod] = useState<PayPeriod>("year");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const h = n(hours);
  const pay = minimumWagePay({ band, hoursPerWeek: h, year, region });
  const check = checkPay({ band, amount: n(amount), period, hoursPerWeek: h, year });
  const y = WAGE_YEARS.find((w) => w.key === year)!;
  const bandLabel = AGE_BANDS.find((b) => b.key === band)!.short;

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="field">
            <legend>What do you want to know?</legend>
            <div className="segmented">
              <button type="button" aria-pressed={mode === "earn"} onClick={() => setMode("earn")}>
                What I&apos;ll earn
              </button>
              <button type="button" aria-pressed={mode === "check"} onClick={() => setMode("check")}>
                Am I paid enough?
              </button>
            </div>
          </fieldset>
          <label className="field">
            <span>Your age</span>
            <select value={band} onChange={(e) => setBand(e.target.value as AgeBand)}>
              {AGE_BANDS.map((b) => (
                <option key={b.key} value={b.key}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Rates from</span>
            <select value={year} onChange={(e) => setYear(e.target.value as WageYearKey)}>
              {WAGE_YEARS.map((w) => (
                <option key={w.key} value={w.key}>
                  {w.from}
                  {w.key === "2026/27" ? " (current)" : w.announced ? " (announced)" : " (previous)"}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Hours worked per week</span>
            <div className="input-row">
              <input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} />
              <span className="suffix">hours</span>
            </div>
          </label>
          {mode === "check" && (
            <label className="field">
              <span>Your pay before tax</span>
              <div className="input-row">
                <span className="prefix">£</span>
                <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <select value={period} onChange={(e) => setPeriod(e.target.value as PayPeriod)} aria-label="Pay period">
                  {PERIOD_LABELS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          )}
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
        </form>

        <div className="calc-result" aria-live="polite">
          {mode === "earn" ? (
            <>
              <p className="result-label">
                Minimum wage, {bandLabel}, from {y.from}
              </p>
              <p className="result-big">
                {gbp(pay.hourly)} <span>an hour</span>
              </p>
              <p className="result-sub">
                At {h || 0} hours a week that is <strong>{gbp(pay.yearly, 0)} a year</strong> before tax, or{" "}
                <strong>{gbp(pay.takeHomeMonth)} a month</strong> after tax and National Insurance.
              </p>
              <dl className="stats">
                <div>
                  <dt>Per week</dt>
                  <dd>{gbp(pay.weekly)}</dd>
                </div>
                <div>
                  <dt>Per month</dt>
                  <dd>{gbp(pay.monthly)}</dd>
                </div>
                <div>
                  <dt>Per year</dt>
                  <dd>{gbp(pay.yearly, 0)}</dd>
                </div>
              </dl>
              {y.announced && (
                <p className="note">
                  These rates start on {y.from}. Take-home pay uses the {pay.taxYearUsed} tax and National Insurance
                  rules, because the 2027/28 thresholds are not yet included.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="result-label">Your hourly rate</p>
              <p className="result-big">
                {gbp(check.hourlyPaid)} <span>an hour</span>
              </p>
              {h === 0 && period !== "hour" ? (
                <p className="result-sub">Enter the hours you work each week to check your pay.</p>
              ) : check.paidEnough ? (
                <p className="result-sub">
                  <strong>Yes — you are paid at least the minimum wage.</strong> The minimum for {bandLabel} from {y.from}{" "}
                  is {gbp(check.minimum)} an hour, so you are {gbp(check.difference)} an hour above it.
                </p>
              ) : (
                <p className="result-sub">
                  <strong>
                    No — that is {gbp(-check.difference)} an hour below the {gbp(check.minimum)} minimum for {bandLabel}.
                  </strong>{" "}
                  Over a year that is about {gbp(check.shortfallPerYear, 0)} less than you should be paid.
                </p>
              )}
              {!check.paidEnough && h > 0 && (
                <p className="note">
                  Check how your hours are counted first: unpaid breaks don&apos;t count, but required training, travel
                  between jobs and some on-call time do. If you are underpaid, raise it with your employer in writing,
                  or contact Acas for free advice.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {mode === "earn" && (
        <>
          <h3 className="section-title">Minimum wage pay before and after tax</h3>
          <div className="table-wrap">
            <table className="breakdown compact">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Before tax</th>
                  <th scope="col">After tax and NI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Per week</th>
                  <td>{gbp(pay.weekly)}</td>
                  <td>{gbp(pay.takeHomeWeek)}</td>
                </tr>
                <tr>
                  <th scope="row">Per month</th>
                  <td>{gbp(pay.monthly)}</td>
                  <td>{gbp(pay.takeHomeMonth)}</td>
                </tr>
                <tr className="total">
                  <th scope="row">Per year</th>
                  <td>{gbp(pay.yearly)}</td>
                  <td>{gbp(pay.takeHomeYear)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted">
            52 paid weeks a year. Income Tax {gbp(pay.incomeTax, 0)} and National Insurance{" "}
            {gbp(pay.nationalInsurance, 0)} a year, standard tax code, no pension or student loan.
          </p>
        </>
      )}
    </section>
  );
}
