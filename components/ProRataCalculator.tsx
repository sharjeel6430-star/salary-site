"use client";

import { useState } from "react";
import Link from "next/link";
import { calculate, gbp, Region } from "@/lib/tax";
import { Breakdown } from "./Breakdown";
import { salaryPath, nearestSalaryPage } from "@/lib/site";

type Mode = "hours" | "days";

export default function ProRataCalculator() {
  const [fte, setFte] = useState("35000");
  const [mode, setMode] = useState<Mode>("hours");
  const [ftHours, setFtHours] = useState("37.5");
  const [myHours, setMyHours] = useState("22.5");
  const [ftDays, setFtDays] = useState("5");
  const [myDays, setMyDays] = useState("3");
  const [weeks, setWeeks] = useState("52");
  const [region, setRegion] = useState<Region>("ruk");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const fullTime = n(fte);
  const ratio =
    mode === "hours"
      ? n(ftHours) > 0 ? Math.min(1, n(myHours) / n(ftHours)) : 0
      : n(ftDays) > 0 ? Math.min(1, n(myDays) / n(ftDays)) : 0;
  const weekRatio = Math.min(52, n(weeks)) / 52;
  const proRata = fullTime * ratio * weekRatio;
  const hoursPerWeek = mode === "hours" ? n(myHours) || 1 : (n(ftHours) || 37.5) * ratio || 1;
  const r = calculate({ gross: proRata, region, hoursPerWeek });
  const rounded = Math.round(proRata);
  const nearest = nearestSalaryPage(rounded);

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Full-time salary (FTE)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={fte} onChange={(e) => setFte(e.target.value)} />
            </div>
          </label>
          <fieldset className="field">
            <legend>Work out pro rata by</legend>
            <div className="segmented">
              <button type="button" aria-pressed={mode === "hours"} onClick={() => setMode("hours")}>
                Hours per week
              </button>
              <button type="button" aria-pressed={mode === "days"} onClick={() => setMode("days")}>
                Days per week
              </button>
            </div>
          </fieldset>
          {mode === "hours" ? (
            <div className="input-row">
              <label className="field" style={{ flex: 1 }}>
                <span>Full-time hours</span>
                <input inputMode="decimal" value={ftHours} onChange={(e) => setFtHours(e.target.value)} />
              </label>
              <label className="field" style={{ flex: 1 }}>
                <span>Your hours</span>
                <input inputMode="decimal" value={myHours} onChange={(e) => setMyHours(e.target.value)} />
              </label>
            </div>
          ) : (
            <div className="input-row">
              <label className="field" style={{ flex: 1 }}>
                <span>Full-time days</span>
                <input inputMode="decimal" value={ftDays} onChange={(e) => setFtDays(e.target.value)} />
              </label>
              <label className="field" style={{ flex: 1 }}>
                <span>Your days</span>
                <input inputMode="decimal" value={myDays} onChange={(e) => setMyDays(e.target.value)} />
              </label>
            </div>
          )}
          <label className="field">
            <span>Weeks worked in the year (52 = all year)</span>
            <input inputMode="decimal" value={weeks} onChange={(e) => setWeeks(e.target.value)} />
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
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Your pro rata salary</p>
          <p className="result-big">{gbp(proRata, 0)}</p>
          <p className="result-sub">
            {(ratio * weekRatio * 100).toFixed(1)}% of {gbp(fullTime, 0)} full-time
          </p>
          <p className="result-sub">
            Take-home: <strong>{gbp(r.takeHome / 12)} a month</strong> · {gbp(r.takeHome)} a year
          </p>
          {nearest && (
            <Link className="result-link" href={salaryPath(nearest)}>
              {nearest === rounded ? "Full" : "Nearest:"} {gbp(nearest, 0)} after tax breakdown →
            </Link>
          )}
        </div>
      </div>
      <h3 className="section-title">Pro rata pay breakdown</h3>
      <Breakdown r={r} />
    </section>
  );
}
