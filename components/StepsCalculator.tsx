"use client";

import { useState } from "react";
import { milesToSteps, stepsToDistance, strideMetres } from "@/lib/health";
import { useBody } from "./BodyFields";

const n = (s: string) => {
  const v = parseFloat(s.replace(/[,\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};
const whole = (x: number) => Math.round(x).toLocaleString("en-GB");

export default function StepsCalculator() {
  const body = useBody({ weight: false, age: false });
  const [mode, setMode] = useState<"steps" | "miles">("steps");
  const [steps, setSteps] = useState("10000");
  const [miles, setMiles] = useState("3");
  const [pace, setPace] = useState<"walk" | "run">("walk");
  const [ownStride, setOwnStride] = useState("");

  const stride = n(ownStride) > 0 ? n(ownStride) / 100 : strideMetres(body.heightCm, body.sex, pace);
  const d = stepsToDistance(n(steps), stride);
  const needed = milesToSteps(n(miles), stride);

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="field">
            <legend>Convert</legend>
            <div className="segmented">
              <button type="button" aria-pressed={mode === "steps"} onClick={() => setMode("steps")}>
                Steps to miles
              </button>
              <button type="button" aria-pressed={mode === "miles"} onClick={() => setMode("miles")}>
                Miles to steps
              </button>
            </div>
          </fieldset>
          {mode === "steps" ? (
            <label className="field">
              <span>Number of steps</span>
              <div className="input-row">
                <input inputMode="numeric" value={steps} onChange={(e) => setSteps(e.target.value)} />
                <span className="suffix">steps</span>
              </div>
            </label>
          ) : (
            <label className="field">
              <span>Distance</span>
              <div className="input-row">
                <input inputMode="decimal" value={miles} onChange={(e) => setMiles(e.target.value)} />
                <span className="suffix">miles</span>
              </div>
            </label>
          )}
          <fieldset className="field">
            <legend>Pace</legend>
            <div className="segmented">
              <button type="button" aria-pressed={pace === "walk"} onClick={() => setPace("walk")}>
                Walking
              </button>
              <button type="button" aria-pressed={pace === "run"} onClick={() => setPace("run")}>
                Running
              </button>
            </div>
          </fieldset>
          {body.fields}
          <label className="field">
            <span>Your measured stride length (optional)</span>
            <div className="input-row">
              <input inputMode="decimal" value={ownStride} placeholder="e.g. 72" onChange={(e) => setOwnStride(e.target.value)} />
              <span className="suffix">cm</span>
            </div>
          </label>
        </form>

        <div className="calc-result" aria-live="polite">
          {stride <= 0 ? (
            <p className="result-sub">Enter your height or your stride length.</p>
          ) : mode === "steps" ? (
            <>
              <p className="result-label">{whole(n(steps))} steps is about</p>
              <p className="result-big">{d.miles.toFixed(2)} miles</p>
              <p className="result-sub">{d.km.toFixed(2)} km</p>
            </>
          ) : (
            <>
              <p className="result-label">{n(miles)} miles is about</p>
              <p className="result-big">{whole(needed)} steps</p>
              <p className="result-sub">{(n(miles) * 1.609344).toFixed(2)} km</p>
            </>
          )}
          {stride > 0 && (
            <dl className="stats">
              <div>
                <dt>Stride length used</dt>
                <dd>{(stride * 100).toFixed(0)} cm</dd>
              </div>
              <div>
                <dt>Steps per mile</dt>
                <dd>{whole(d.stepsPerMile)}</dd>
              </div>
              <div>
                <dt>Steps per km</dt>
                <dd>{whole(1000 / stride)}</dd>
              </div>
            </dl>
          )}
          <p className="note">
            {n(ownStride) > 0 ? "Using the stride length you entered." : "Stride is estimated from your height. Measure your own for a closer result."}
          </p>
        </div>
      </div>
    </section>
  );
}
