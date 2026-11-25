"use client";

import { useState } from "react";
import { capitalGainsTax, ASSET_TYPES, ANNUAL_EXEMPT_AMOUNT, CGT_YEAR, type AssetType } from "@/lib/capitalGains";
import { gbp } from "@/lib/tax";

const num = (s: string) => {
  const v = parseFloat(s.replace(/[£,\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export default function CapitalGainsCalculator() {
  const [asset, setAsset] = useState<AssetType>("shares");
  const [sale, setSale] = useState("30000");
  const [buy, setBuy] = useState("15000");
  const [costs, setCosts] = useState("");
  const [income, setIncome] = useState("40000");
  const [badr, setBadr] = useState(false);
  const [other, setOther] = useState("");
  const [lossNow, setLossNow] = useState("");
  const [lossBf, setLossBf] = useState("");
  const r = capitalGainsTax({
    income: num(income), salePrice: num(sale), purchasePrice: num(buy), costs: num(costs), assetType: asset,
    badr: asset === "business" && badr, otherGains: num(other), lossesThisYear: num(lossNow), lossesBroughtForward: num(lossBf),
  });
  const isLoss = r.gain < 0;

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>What did you sell?</span>
            <select value={asset} onChange={(e) => setAsset(e.target.value as AssetType)}>
              {ASSET_TYPES.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Sale price (or value if you gave it away)</span>
            <div className="input-row"><span className="prefix">£</span><input inputMode="decimal" value={sale} onChange={(e) => setSale(e.target.value)} /></div>
          </label>
          <label className="field">
            <span>What you paid for it</span>
            <div className="input-row"><span className="prefix">£</span><input inputMode="decimal" value={buy} onChange={(e) => setBuy(e.target.value)} /></div>
          </label>
          <label className="field">
            <span>Buying and selling costs, and improvements</span>
            <div className="input-row"><span className="prefix">£</span><input inputMode="decimal" value={costs} placeholder="0" onChange={(e) => setCosts(e.target.value)} /></div>
          </label>
          <label className="field">
            <span>Your income this tax year, before tax</span>
            <div className="input-row"><span className="prefix">£</span><input inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} /></div>
          </label>
          {asset === "business" && (
            <label className="check">
              <input type="checkbox" checked={badr} onChange={(e) => setBadr(e.target.checked)} />
              The gain qualifies for Business Asset Disposal Relief
            </label>
          )}
          <details className="more">
            <summary>Other gains and losses this year</summary>
            <label className="field">
              <span>Other gains made this tax year</span>
              <div className="input-row"><span className="prefix">£</span><input inputMode="decimal" value={other} placeholder="0" onChange={(e) => setOther(e.target.value)} /></div>
            </label>
            <label className="field">
              <span>Losses made this tax year</span>
              <div className="input-row"><span className="prefix">£</span><input inputMode="decimal" value={lossNow} placeholder="0" onChange={(e) => setLossNow(e.target.value)} /></div>
            </label>
            <label className="field">
              <span>Unused losses from earlier years (reported to HMRC)</span>
              <div className="input-row"><span className="prefix">£</span><input inputMode="decimal" value={lossBf} placeholder="0" onChange={(e) => setLossBf(e.target.value)} /></div>
            </label>
          </details>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Capital Gains Tax {CGT_YEAR}</p>
          <p className="result-big">{gbp(Math.max(0, r.tax))}</p>
          <p className="result-sub">
            {isLoss
              ? `A loss of ${gbp(-r.gain, 0)}. No tax on this sale, and the loss can reduce other gains.`
              : `On a gain of ${gbp(r.gain, 0)}, you keep ${gbp(r.keep, 0)} after tax`}
          </p>
          <dl className="stats">
            <div><dt>Taxable gains</dt><dd>{gbp(r.taxableGains, 0)}</dd></div>
            <div><dt>Tax-free allowance used</dt><dd>{gbp(r.allowanceUsed, 0)}</dd></div>
            <div><dt>Tax on this sale</dt><dd>{gbp(Math.max(0, r.taxOnThisAsset), 0)}</dd></div>
          </dl>
          {r.reportWithin60Days && (
            <p className="result-sub">Report and pay the tax on UK residential property within 60 days of completion.</p>
          )}
        </div>
      </div>
      <h3 className="section-title">How it&apos;s worked out</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <tbody>
            <tr><th scope="row">Gain on this sale (price − cost − costs)</th><td>{gbp(r.gain)}</td></tr>
            {r.totalGains !== Math.max(0, r.gain) && <tr><th scope="row">All gains this year</th><td>{gbp(r.totalGains)}</td></tr>}
            <tr><th scope="row">After losses</th><td>{gbp(r.netGains)}</td></tr>
            <tr><th scope="row">Annual exempt amount (£{ANNUAL_EXEMPT_AMOUNT.toLocaleString("en-GB")})</th><td>–{gbp(r.allowanceUsed)}</td></tr>
            <tr><th scope="row"><b>Taxable gains</b></th><td><b>{gbp(r.taxableGains)}</b></td></tr>
            {r.atBadr > 0 && <tr><th scope="row">At 18% (Business Asset Disposal Relief)</th><td>{gbp(r.atBadr)} → {gbp(r.atBadr * 0.18)}</td></tr>}
            <tr><th scope="row">At 18% (fits in your unused basic rate band of {gbp(r.basicBandLeft, 0)})</th><td>{gbp(r.at18)} → {gbp(r.at18 * 0.18)}</td></tr>
            <tr><th scope="row">At 24%</th><td>{gbp(r.at24)} → {gbp(r.at24 * 0.24)}</td></tr>
            <tr><th scope="row"><b>Capital Gains Tax</b></th><td><b>{gbp(Math.max(0, r.tax))}</b></td></tr>
            {r.lossCarriedForward > 0 && <tr><th scope="row">Losses to carry forward (report them to HMRC)</th><td>{gbp(r.lossCarriedForward)}</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="note">
        Selling your own home is usually tax-free under Private Residence Relief. Shares in an ISA or pension are not taxed.
        Scottish taxpayers use the same UK rates and bands for Capital Gains Tax.
      </p>
    </section>
  );
}
