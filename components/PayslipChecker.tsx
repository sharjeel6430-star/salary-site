"use client";

import { useState } from "react";
import { gbp } from "@/lib/tax";
import { FREQUENCIES, compareLine, expectedPayslip, type CheckStatus, type Frequency, type PensionMethod } from "@/lib/payslip";

const STATUS: Record<CheckStatus, { label: string; color: string }> = {
  match: { label: "✓ Matches", color: "var(--seg-take)" },
  close: { label: "≈ Close", color: "var(--muted)" },
  higher: { label: "▲ Higher than expected", color: "var(--neg)" },
  lower: { label: "▼ Lower than expected", color: "var(--neg)" },
  blank: { label: "–", color: "var(--muted)" },
};

export default function PayslipChecker() {
  const [frequency, setFrequency] = useState<Frequency>("month");
  const [gross, setGross] = useState("3000");
  const [taxCode, setTaxCode] = useState("1257L");
  const [pension, setPension] = useState("150");
  const [method, setMethod] = useState<PensionMethod>("netpay");
  const [plan, setPlan] = useState<"none" | "plan1" | "plan2" | "plan4" | "plan5">("none");
  const [postgraduate, setPostgraduate] = useState(false);
  const [noNI, setNoNI] = useState(false);
  const [aTax, setATax] = useState("");
  const [aNI, setANI] = useState("");
  const [aLoan, setALoan] = useState("");
  const [aNet, setANet] = useState("");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };
  const opt = (s: string) => {
    if (s.trim() === "") return null;
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) ? v : null;
  };

  const e = expectedPayslip({
    gross: n(gross),
    frequency,
    taxCode,
    pension: n(pension),
    pensionMethod: method,
    studentPlan: plan,
    postgraduate,
    noNI,
  });
  const loanExpected = e.studentLoan + e.postgraduateLoan;
  const lines = [
    { label: "Income Tax (PAYE)", actual: opt(aTax), expected: e.incomeTax },
    { label: "National Insurance", actual: opt(aNI), expected: e.nationalInsurance },
    ...(plan !== "none" || postgraduate ? [{ label: "Student and postgraduate loan", actual: opt(aLoan), expected: loanExpected }] : []),
    { label: "Net pay", actual: opt(aNet), expected: e.netPay },
  ].map((l) => ({ ...l, ...compareLine(l.actual, l.expected) }));
  const checked = lines.filter((l) => l.status !== "blank");
  const problems = lines.filter((l) => l.status === "higher" || l.status === "lower");
  const period = FREQUENCIES.find((f) => f.key === frequency)!.label.toLowerCase();

  const money = (value: string, set: (v: string) => void, label: string) => (
    <label className="field">
      <span>{label}</span>
      <div className="input-row">
        <span className="prefix">£</span>
        <input inputMode="decimal" value={value} placeholder="from your payslip" onChange={(ev) => set(ev.target.value)} />
      </div>
    </label>
  );

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(ev) => ev.preventDefault()}>
          <label className="field">
            <span>How often are you paid?</span>
            <select value={frequency} onChange={(ev) => setFrequency(ev.target.value as Frequency)}>
              {FREQUENCIES.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Gross pay this period (&quot;Total gross pay&quot;)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={gross} onChange={(ev) => setGross(ev.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Tax code</span>
            <input value={taxCode} onChange={(ev) => setTaxCode(ev.target.value)} autoCapitalize="characters" />
          </label>
          <div className="input-row">
            <label className="field">
              <span>Pension deducted</span>
              <div className="input-row">
                <span className="prefix">£</span>
                <input inputMode="decimal" value={pension} onChange={(ev) => setPension(ev.target.value)} />
              </div>
            </label>
            <label className="field">
              <span>Pension type</span>
              <select value={method} onChange={(ev) => setMethod(ev.target.value as PensionMethod)}>
                <option value="netpay">Before tax (net pay)</option>
                <option value="ras">After tax (relief at source)</option>
                <option value="sacrifice">Salary sacrifice (shown as a deduction)</option>
                <option value="none">No pension</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>Student loan</span>
            <select value={plan} onChange={(ev) => setPlan(ev.target.value as typeof plan)}>
              <option value="none">No student loan</option>
              <option value="plan1">Plan 1</option>
              <option value="plan2">Plan 2</option>
              <option value="plan4">Plan 4 (Scotland)</option>
              <option value="plan5">Plan 5</option>
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={postgraduate} onChange={(ev) => setPostgraduate(ev.target.checked)} />
            <span>Postgraduate Loan</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={noNI} onChange={(ev) => setNoNI(ev.target.checked)} />
            <span>I&apos;m over State Pension age (no employee NI)</span>
          </label>
          <fieldset className="more">
            <legend style={{ fontWeight: 600, padding: "0 6px" }}>Figures on your payslip (optional)</legend>
            {money(aTax, setATax, "Tax deducted")}
            {money(aNI, setANI, "National Insurance deducted")}
            {(plan !== "none" || postgraduate) && money(aLoan, setALoan, "Student loan deducted")}
            {money(aNet, setANet, "Net pay")}
          </fieldset>
        </form>

        <div className="calc-result" aria-live="polite">
          <p className="result-label">Expected net pay ({period})</p>
          <p className="result-big">{gbp(e.netPay)}</p>
          <p className="result-sub">
            {checked.length === 0
              ? "Add the figures from your payslip to check them line by line."
              : problems.length === 0
                ? "Your payslip looks right: every figure you entered is within a few pounds of what we expect."
                : `${problems.length} ${problems.length === 1 ? "figure is" : "figures are"} more than £5 away from what we expect — see the notes below.`}
          </p>
          <dl className="stats">
            <div>
              <dt>Tax</dt>
              <dd>{gbp(e.incomeTax)}</dd>
            </div>
            <div>
              <dt>NI</dt>
              <dd>{gbp(e.nationalInsurance)}</dd>
            </div>
            <div>
              <dt>Loans</dt>
              <dd>{gbp(loanExpected, 0)}</dd>
            </div>
          </dl>
          <p className="result-sub">
            Tax code {e.code.raw || "1257L"}: {e.code.note}
            {e.code.emergency && " The W1/M1/X ending means an emergency (non-cumulative) code: tax is worked out on each pay period on its own."}
          </p>
          {e.kCapApplied && (
            <p className="note">Tax under a K code can&apos;t be more than half your pay for the period, so it has been limited.</p>
          )}
        </div>
      </div>

      <h3 className="section-title">Your payslip checked line by line</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Your payslip</th>
              <th scope="col">Expected</th>
              <th scope="col">Difference</th>
              <th scope="col">Check</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Gross pay</th>
              <td>{gbp(n(gross))}</td>
              <td>{gbp(n(gross))}</td>
              <td></td>
              <td></td>
            </tr>
            {e.pension > 0 && (
              <tr>
                <th scope="row">Pension</th>
                <td>{gbp(e.pension)}</td>
                <td>{gbp(e.pension)}</td>
                <td></td>
                <td></td>
              </tr>
            )}
            {lines.map((l) => (
              <tr key={l.label} className={l.label === "Net pay" ? "total" : undefined}>
                <th scope="row">{l.label}</th>
                <td>{l.actual === null ? "–" : gbp(l.actual)}</td>
                <td>{gbp(l.expected)}</td>
                <td>{l.status === "blank" ? "" : gbp(l.difference)}</td>
                <td style={{ color: STATUS[l.status].color, fontWeight: 600 }}>{STATUS[l.status].label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {problems.length > 0 && (
        <div className="prose">
          <p className="note">
            <strong>Why might a figure be different?</strong> Most payslips work out tax cumulatively over the tax year,
            so a pay rise, bonus, overtime, a new job or a tax code change part-way through the year can make this
            period&apos;s tax higher or lower — it usually evens out by April. Benefits in kind, a second job or
            underpaid tax from a previous year change your tax code. If the difference doesn&apos;t make sense, ask your
            payroll team first, then check your tax code in the HMRC app or your personal tax account.
          </p>
        </div>
      )}
      <p className="muted">
        Expected figures use 2026/27 rates on a non-cumulative basis, which matches your payslip when your pay is the
        same each period. Salary sacrifice is usually already taken off the gross pay shown; only enter it here if your
        payslip lists it as a separate deduction.
      </p>
    </section>
  );
}
