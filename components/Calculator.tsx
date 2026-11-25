"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculate, gbp, pct, Region, StudentPlan, PensionType, TaxYearKey } from "@/lib/tax";
import { Breakdown, SplitBar, BandTable } from "./Breakdown";
import { salaryPath, nearestSalaryPage } from "@/lib/site";

type Period = "year" | "month" | "week" | "day" | "hour";

const PERIOD_TO_ANNUAL: Record<Period, (v: number, hours: number) => number> = {
  year: (v) => v,
  month: (v) => v * 12,
  week: (v) => v * 52,
  day: (v) => v * 260,
  hour: (v, h) => v * h * 52,
};

export default function Calculator({
  initialSalary = 35000,
  initialRegion = "ruk",
}: {
  initialSalary?: number;
  initialRegion?: Region;
}) {
  const [amount, setAmount] = useState(String(initialSalary));
  const [period, setPeriod] = useState<Period>("year");
  const [hours, setHours] = useState("37.5");
  const [bonus, setBonus] = useState("");
  const [region, setRegion] = useState<Region>(initialRegion);
  const [pensionPercent, setPensionPercent] = useState("0");
  const [pensionType, setPensionType] = useState<PensionType>("sacrifice");
  const [studentPlan, setStudentPlan] = useState<StudentPlan>("none");
  const [postgraduate, setPostgraduate] = useState(false);
  const [noNI, setNoNI] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [year, setYear] = useState<TaxYearKey>("2026/27");

  const num = (s: string) => {
    const n = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const hoursNum = num(hours) || 37.5;
  const gross = PERIOD_TO_ANNUAL[period](num(amount), hoursNum) + num(bonus);

  const opts = {
    gross,
    region,
    pensionPercent: num(pensionPercent),
    pensionType,
    studentPlan,
    postgraduate,
    noNI,
    hoursPerWeek: hoursNum,
  };
  const r = useMemo(
    () => calculate({ ...opts, year }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gross, region, pensionPercent, pensionType, studentPlan, postgraduate, noNI, hoursNum, year]
  );
  // Same pay in the other tax year, to show what changed.
  const otherYear: TaxYearKey = year === "2026/27" ? "2025/26" : "2026/27";
  const other = calculate({ ...opts, year: otherYear });
  const diffMonth = (r.takeHome - other.takeHome) / 12;

  const roundedGross = Math.round(gross);
  const nearestPage = nearestSalaryPage(roundedGross);

  return (
    <section className="calc card" aria-labelledby="calc-title">
      <h2 id="calc-title" className="visually-hidden">
        Salary calculator
      </h2>
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Your salary</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input
                inputMode="decimal"
                autoComplete="off"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Salary amount"
              />
              <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} aria-label="Pay period">
                <option value="year">per year</option>
                <option value="month">per month</option>
                <option value="week">per week</option>
                <option value="day">per day</option>
                <option value="hour">per hour</option>
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
            <span>Tax year</span>
            <select value={year} onChange={(e) => setYear(e.target.value as TaxYearKey)} aria-label="Tax year">
              <option value="2026/27">2026/27 (6 April 2026 – 5 April 2027)</option>
              <option value="2025/26">2025/26 (last tax year)</option>
            </select>
          </label>

          <label className="field">
            <span>Student loan</span>
            <select value={studentPlan} onChange={(e) => setStudentPlan(e.target.value as StudentPlan)}>
              <option value="none">No student loan</option>
              <option value="plan1">Plan 1 (started before Sept 2012)</option>
              <option value="plan2">Plan 2 (England/Wales, Sept 2012 – July 2023)</option>
              <option value="plan4">Plan 4 (Scotland)</option>
              <option value="plan5">Plan 5 (England, from Aug 2023)</option>
            </select>
          </label>

          <label className="field">
            <span>Pension contribution</span>
            <div className="input-row">
              <input
                inputMode="decimal"
                value={pensionPercent}
                onChange={(e) => setPensionPercent(e.target.value)}
                aria-label="Pension contribution percent"
              />
              <span className="suffix">%</span>
              <select value={pensionType} onChange={(e) => setPensionType(e.target.value as PensionType)} aria-label="Pension type">
                <option value="sacrifice">Salary sacrifice</option>
                <option value="netpay">Net pay (before tax)</option>
              </select>
            </div>
          </label>

          <button type="button" className="link-btn" onClick={() => setShowMore((v) => !v)} aria-expanded={showMore}>
            {showMore ? "− Fewer options" : "+ More options (bonus, hours, postgraduate loan)"}
          </button>

          {showMore && (
            <div className="more">
              <label className="field">
                <span>Annual bonus</span>
                <div className="input-row">
                  <span className="prefix">£</span>
                  <input inputMode="decimal" value={bonus} placeholder="0" onChange={(e) => setBonus(e.target.value)} />
                </div>
              </label>
              <label className="field">
                <span>Hours per week</span>
                <input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} />
              </label>
              <label className="check">
                <input type="checkbox" checked={postgraduate} onChange={(e) => setPostgraduate(e.target.checked)} />
                I have a Postgraduate Loan
              </label>
              <label className="check">
                <input type="checkbox" checked={noNI} onChange={(e) => setNoNI(e.target.checked)} />
                I am over State Pension age (no National Insurance)
              </label>
            </div>
          )}
        </form>

        <div className="calc-result" aria-live="polite">
          <p className="result-label">Your take-home pay ({year})</p>
          <p className="result-big">
            {gbp(r.takeHome / 12)}
            <span> / month</span>
          </p>
          <p className="result-sub">
            {gbp(r.takeHome)} a year · {gbp(r.takeHome / 52)} a week
          </p>
          {gross > 0 && (
            <p className="year-compare">
              {Math.abs(diffMonth) < 0.5
                ? `Same take-home as in ${otherYear}.`
                : `${gbp(Math.abs(diffMonth))} a month ${diffMonth > 0 ? "more" : "less"} than in ${otherYear}.`}
            </p>
          )}
          <SplitBar r={r} />
          <dl className="stats">
            <div>
              <dt>Effective rate</dt>
              <dd>{pct(r.effectiveRate)}</dd>
            </div>
            <div>
              <dt>Marginal rate</dt>
              <dd>{pct(r.marginalRate, 0)}</dd>
            </div>
            <div>
              <dt>Employer NI</dt>
              <dd>{gbp(r.employerNI, 0)}</dd>
            </div>
          </dl>
          {nearestPage && (
            <Link className="result-link" href={salaryPath(nearestPage)}>
              {nearestPage === roundedGross ? "Full breakdown for" : "Nearest full breakdown:"} {gbp(nearestPage, 0)} →
            </Link>
          )}
        </div>
      </div>

      <h3 className="section-title">Breakdown by pay period</h3>
      <Breakdown r={r} />

      <details className="bands">
        <summary>How your Income Tax is worked out ({year})</summary>
        <BandTable r={r} />
      </details>
    </section>
  );
}
