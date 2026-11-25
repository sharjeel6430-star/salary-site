"use client";

import { useState } from "react";
import { CLASS_BOUNDARIES, WEIGHTINGS, classify, overallAverage, requiredFinalYear, weightedAverage } from "@/lib/grades";

type Row = { mark: string; credits: string };
const num = (s: string) => {
  const v = parseFloat(s.replace(/[%,\s]/g, ""));
  return Number.isFinite(v) && v >= 0 ? v : NaN;
};

export default function GradeCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { mark: "68", credits: "20" },
    { mark: "72", credits: "20" },
    { mark: "64", credits: "40" },
    { mark: "", credits: "20" },
  ]);
  const [modulesAre, setModulesAre] = useState<"final" | "second">("final");
  const [otherYear, setOtherYear] = useState("");
  const [weight, setWeight] = useState(0);

  const update = (i: number, key: keyof Row, value: string) => setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: value } : row)));
  const year = weightedAverage(rows.map((r) => ({ mark: num(r.mark), credits: num(r.credits) })).filter((m) => !Number.isNaN(m.mark) && !Number.isNaN(m.credits)));
  const other = num(otherYear);
  const hasOther = !Number.isNaN(other) && other <= 100 && otherYear.trim() !== "";
  const secondWeight = WEIGHTINGS[weight].second;

  const second = modulesAre === "second" ? year?.average : hasOther ? other : undefined;
  const final = modulesAre === "final" ? year?.average : hasOther ? other : undefined;
  const overall = second !== undefined && final !== undefined ? overallAverage(second, final, secondWeight) : secondWeight === 0 && final !== undefined ? final : undefined;
  const headline = overall ?? year?.average;
  // Marks needed in final year, shown when only the second year is known.
  const needs = second !== undefined && final === undefined ? CLASS_BOUNDARIES.map((b) => ({ ...b, need: requiredFinalYear(second, secondWeight, b.min) })) : null;

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="field">
            <legend>Your modules (mark % and credits)</legend>
            {rows.map((r, i) => (
              <div className="input-row" key={i} style={{ marginBottom: 6 }}>
                <input inputMode="decimal" aria-label={`Module ${i + 1} mark`} placeholder="Mark" value={r.mark} onChange={(e) => update(i, "mark", e.target.value)} />
                <span className="suffix">%</span>
                <input inputMode="numeric" aria-label={`Module ${i + 1} credits`} placeholder="Credits" value={r.credits} onChange={(e) => update(i, "credits", e.target.value)} />
                <span className="suffix">credits</span>
              </div>
            ))}
            <button type="button" className="link-btn" onClick={() => setRows((r) => [...r, { mark: "", credits: "20" }])}>
              + Add a module
            </button>
            {rows.length > 1 && (
              <button type="button" className="link-btn" style={{ marginLeft: 12 }} onClick={() => setRows((r) => r.slice(0, -1))}>
                Remove last
              </button>
            )}
          </fieldset>
          <fieldset className="field">
            <legend>These modules are from my</legend>
            <div className="segmented">
              <button type="button" aria-pressed={modulesAre === "final"} onClick={() => setModulesAre("final")}>
                Final year
              </button>
              <button type="button" aria-pressed={modulesAre === "second"} onClick={() => setModulesAre("second")}>
                Second year
              </button>
            </div>
          </fieldset>
          <label className="field">
            <span>{modulesAre === "final" ? "Second year average (optional)" : "Final year average (leave blank to see what you need)"}</span>
            <div className="input-row">
              <input inputMode="decimal" value={otherYear} placeholder="e.g. 62" onChange={(e) => setOtherYear(e.target.value)} />
              <span className="suffix">%</span>
            </div>
          </label>
          <label className="field">
            <span>Year weighting (second year / final year)</span>
            <select value={weight} onChange={(e) => setWeight(parseInt(e.target.value, 10))}>
              {WEIGHTINGS.map((w, i) => (
                <option key={w.label} value={i}>
                  {w.label}
                </option>
              ))}
            </select>
          </label>
        </form>

        <div className="calc-result" aria-live="polite">
          {headline === undefined ? (
            <p className="result-sub">Enter at least one module mark and its credits.</p>
          ) : (
            <>
              <p className="result-label">{overall !== undefined ? "Predicted degree classification" : "This year's classification"}</p>
              <p className="result-big">{classify(headline).label}</p>
              <p className="result-sub">
                {overall !== undefined ? "Overall weighted average" : "Credit-weighted average"}: <strong>{headline.toFixed(1)}%</strong>
              </p>
              <dl className="stats">
                {year && (
                  <div>
                    <dt>{modulesAre === "final" ? "Final year" : "Second year"} average</dt>
                    <dd>{year.average.toFixed(1)}%</dd>
                  </div>
                )}
                {year && (
                  <div>
                    <dt>Credits entered</dt>
                    <dd>{year.credits}</dd>
                  </div>
                )}
                {hasOther && (
                  <div>
                    <dt>{modulesAre === "final" ? "Second year" : "Final year"} average</dt>
                    <dd>{other.toFixed(1)}%</dd>
                  </div>
                )}
              </dl>
              {needs && (
                <>
                  <p className="result-label">What you need in final year</p>
                  <table className="result-table">
                    <tbody>
                      {needs.map((b) => (
                        <tr key={b.short}>
                          <th scope="row">{b.label}</th>
                          <td>
                            {b.need === null
                              ? "–"
                              : b.need > 100
                                ? "Not reachable"
                                : b.need <= 0
                                  ? "Already secured"
                                  : `${b.need.toFixed(1)}% average`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <p className="note">A prediction only. Your university may apply borderline rules or drop your lowest marks.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
