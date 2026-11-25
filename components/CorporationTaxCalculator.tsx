"use client";

import { useState } from "react";
import Link from "next/link";
import { corporationTax } from "@/lib/business";
import { gbp, pct } from "@/lib/tax";

export default function CorporationTaxCalculator() {
  const [profits, setProfits] = useState("100000");
  const [months, setMonths] = useState("12");
  const [associated, setAssociated] = useState("0");
  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };
  const r = corporationTax({ profits: n(profits), months: n(months) || 12, associated: n(associated) });
  const bandLabel =
    r.band === "small" ? "Small profits rate (19%)" : r.band === "main" ? "Main rate (25%)" : "Main rate with marginal relief";

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Taxable profits for the accounting period</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={profits} onChange={(e) => setProfits(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Length of accounting period (months)</span>
            <input inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} />
          </label>
          <label className="field">
            <span>Number of associated companies (not counting this one)</span>
            <input inputMode="numeric" value={associated} onChange={(e) => setAssociated(e.target.value)} />
          </label>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Corporation Tax to pay</p>
          <p className="result-big">{gbp(r.tax)}</p>
          <p className="result-sub">{bandLabel}</p>
          <dl className="stats">
            <div>
              <dt>Profit after tax</dt>
              <dd>{gbp(r.afterTax, 0)}</dd>
            </div>
            <div>
              <dt>Effective rate</dt>
              <dd>{pct(r.effectiveRate, 2)}</dd>
            </div>
            <div>
              <dt>Marginal relief</dt>
              <dd>{gbp(r.marginalRelief, 0)}</dd>
            </div>
          </dl>
          <p className="result-sub">
            Your limits: {gbp(r.lower, 0)} (19%) and {gbp(r.upper, 0)} (25%).
          </p>
          <Link className="result-link" href="/dividend-tax-calculator">
            Paying yourself dividends? Work out the dividend tax →
          </Link>
        </div>
      </div>
    </section>
  );
}
