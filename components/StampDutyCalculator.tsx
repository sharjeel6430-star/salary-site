"use client";

import { useState } from "react";
import { propertyTax, type BuyerType, type Nation } from "@/lib/stampDuty";
import { gbp } from "@/lib/tax";

const num = (s: string) => {
  const v = parseFloat(s.replace(/[£,\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};
const pct = (r: number) => `${+(r * 100).toFixed(2)}%`;
const band = (from: number, to: number) => (to === Infinity ? `Over ${gbp(from, 0)}` : `${gbp(from === 0 ? 0 : from + 1, 0)} to ${gbp(to, 0)}`);

export default function StampDutyCalculator() {
  const [price, setPrice] = useState("300000");
  const [nation, setNation] = useState<Nation>("england");
  const [buyer, setBuyer] = useState<BuyerType>("mover");
  const [nonRes, setNonRes] = useState(false);
  const r = propertyTax({ price: num(price), nation, buyer, nonResident: nation === "england" && nonRes });

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Property price</span>
            <div className="input-row"><span className="prefix">£</span><input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
          </label>
          <label className="field">
            <span>Where is the property?</span>
            <select value={nation} onChange={(e) => setNation(e.target.value as Nation)}>
              <option value="england">England or Northern Ireland (Stamp Duty)</option>
              <option value="scotland">Scotland (LBTT)</option>
              <option value="wales">Wales (LTT)</option>
            </select>
          </label>
          <fieldset className="field">
            <legend>Which describes you?</legend>
            {([
              ["mover", "Buying my only or main home (I've owned one before)"],
              ["first", nation === "wales" ? "First-time buyer (no relief in Wales)" : "First-time buyer"],
              ["additional", "Buying an additional property (second home or buy-to-let)"],
            ] as [BuyerType, string][]).map(([k, label]) => (
              <label className="check" key={k}>
                <input type="radio" name="buyer" checked={buyer === k} onChange={() => setBuyer(k)} /> {label}
              </label>
            ))}
          </fieldset>
          {nation === "england" && (
            <label className="check">
              <input type="checkbox" checked={nonRes} onChange={(e) => setNonRes(e.target.checked)} />
              I&apos;m not a UK resident (adds 2%)
            </label>
          )}
          {buyer === "additional" && (
            <p className="note">
              Replacing your main home? If you sell your old home within {nation === "scotland" ? "36 months" : "3 years"}, you
              can usually reclaim the extra tax.
            </p>
          )}
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">{r.taxName} to pay</p>
          <p className="result-big">{gbp(r.tax, 0)}</p>
          <p className="result-sub">{pct(r.effectiveRate)} of the price. File the return and pay within {r.deadline} of completion.</p>
          <dl className="stats">
            <div><dt>Price</dt><dd>{gbp(num(price), 0)}</dd></div>
            <div><dt>Effective rate</dt><dd>{pct(r.effectiveRate)}</dd></div>
            <div><dt>{r.ftbApplied ? "First-time buyer saving" : "Price + tax"}</dt><dd>{gbp(r.ftbApplied ? r.ftbSaving : num(price) + r.tax, 0)}</dd></div>
          </dl>
          {r.ftbLostOverCap && <p className="result-sub">First-time buyer relief doesn&apos;t apply above £500,000, so standard rates are used.</p>}
          {r.supplement > 0 && <p className="result-sub">Includes the Additional Dwelling Supplement of 8% of the whole price: {gbp(r.supplement, 0)}.</p>}
        </div>
      </div>
      <h3 className="section-title">How it&apos;s worked out</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead><tr><th scope="col">Portion of the price</th><th scope="col">Rate</th><th scope="col">Amount</th><th scope="col">Tax</th></tr></thead>
          <tbody>
            {r.lines.map((l) => (
              <tr key={l.from}><th scope="row">{band(l.from, l.to)}</th><td>{pct(l.rate)}</td><td>{gbp(l.amount, 0)}</td><td>{gbp(l.tax)}</td></tr>
            ))}
            {r.supplement > 0 && <tr><th scope="row">Additional Dwelling Supplement</th><td>8%</td><td>{gbp(num(price), 0)}</td><td>{gbp(r.supplement)}</td></tr>}
            <tr><th scope="row"><b>Total</b></th><td></td><td></td><td><b>{gbp(r.tax)}</b></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
