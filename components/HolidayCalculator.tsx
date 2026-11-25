"use client";

import { useState } from "react";
import { proRataHoliday, irregularHoursHoliday } from "@/lib/holiday";

export default function HolidayCalculator() {
  const [days, setDays] = useState("3");
  const [hours, setHours] = useState("22.5");
  const [ftEnt, setFtEnt] = useState("28");
  const [ftDays, setFtDays] = useState("5");
  const [months, setMonths] = useState("12");
  const [irregular, setIrregular] = useState("1000");
  const n = (s: string, d = 0) => {
    const v = parseFloat(s.replace(/[,\s]/g, ""));
    return Number.isFinite(v) && v >= 0 ? v : d;
  };
  const r = proRataHoliday({
    daysPerWeek: n(days),
    hoursPerWeek: n(hours),
    fullTimeEntitlement: n(ftEnt, 28),
    fullTimeDays: n(ftDays, 5) || 5,
    months: n(months, 12),
  });

  return (
    <>
      <section className="card">
        <div className="calc-grid">
          <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-row">
              <label className="field" style={{ flex: 1 }}>
                <span>Days you work a week</span>
                <input inputMode="decimal" value={days} onChange={(e) => setDays(e.target.value)} />
              </label>
              <label className="field" style={{ flex: 1 }}>
                <span>Hours you work a week</span>
                <input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} />
              </label>
            </div>
            <div className="input-row">
              <label className="field" style={{ flex: 1 }}>
                <span>Full-time holiday (days, incl. bank holidays)</span>
                <input inputMode="decimal" value={ftEnt} onChange={(e) => setFtEnt(e.target.value)} />
              </label>
              <label className="field" style={{ flex: 1 }}>
                <span>Full-time days a week</span>
                <input inputMode="decimal" value={ftDays} onChange={(e) => setFtDays(e.target.value)} />
              </label>
            </div>
            <label className="field">
              <span>Months of the holiday year you work (12 = all year)</span>
              <input inputMode="decimal" value={months} onChange={(e) => setMonths(e.target.value)} />
            </label>
            <p className="note">
              28 days is the legal minimum for a 5-day week (5.6 weeks). If your employer gives more, for example 25
              days plus 8 bank holidays, enter 33.
            </p>
          </form>
          <div className="calc-result" aria-live="polite">
            <p className="result-label">Your holiday entitlement</p>
            <p className="result-big">
              {r.days}
              <span> days</span>
            </p>
            {r.hours !== null && <p className="result-sub">That&apos;s {r.hours} hours of paid holiday</p>}
            <dl className="stats">
              <div>
                <dt>Legal minimum</dt>
                <dd>{r.statutoryDays} days</dd>
              </div>
              <div>
                <dt>Your employer&apos;s scheme</dt>
                <dd>{r.companyDays} days</dd>
              </div>
              <div>
                <dt>In weeks</dt>
                <dd>{r.weeks}</dd>
              </div>
            </dl>
            <p className="result-sub">
              {r.usesStatutory
                ? "You get the legal minimum (5.6 weeks, up to 28 days)."
                : "Your employer's scheme is more generous than the legal minimum."}
            </p>
          </div>
        </div>
      </section>
      <section className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Irregular hours or part-year worker?</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          For leave years starting on or after 1 April 2024, holiday builds up at 12.07% of the hours you actually work.
        </p>
        <label className="field">
          <span>Hours worked in the pay period</span>
          <input inputMode="decimal" value={irregular} onChange={(e) => setIrregular(e.target.value)} />
        </label>
        <p style={{ marginBottom: 0 }}>
          Holiday earned: <strong>{irregularHoursHoliday(n(irregular))} hours</strong>
        </p>
      </section>
    </>
  );
}
