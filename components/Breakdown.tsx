import { PERIODS, TaxResult, gbp, pct, perHour } from "@/lib/tax";

// Pure display component (no hooks) — used by the live calculator and the static salary pages.
export function Breakdown({ r }: { r: TaxResult }) {
  const rows: { label: string; value: number; negative?: boolean; strong?: boolean }[] = [
    { label: "Gross pay", value: r.gross },
    ...(r.pension > 0 ? [{ label: "Pension", value: r.pension, negative: true }] : []),
    { label: "Income Tax", value: r.incomeTax, negative: true },
    { label: "National Insurance", value: r.nationalInsurance, negative: true },
    ...(r.studentLoan > 0 ? [{ label: "Student Loan", value: r.studentLoan, negative: true }] : []),
    ...(r.postgraduateLoan > 0 ? [{ label: "Postgraduate Loan", value: r.postgraduateLoan, negative: true }] : []),
    { label: "Take-home pay", value: r.takeHome, strong: true },
  ];

  return (
    <div className="table-wrap">
      <table className="breakdown">
        <thead>
          <tr>
            <th scope="col"></th>
            {PERIODS.map((p) => (
              <th scope="col" key={p.key}>
                {p.label}
              </th>
            ))}
            <th scope="col">Hourly</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className={row.strong ? "total" : undefined}>
              <th scope="row">{row.label}</th>
              {PERIODS.map((p) => (
                <td key={p.key} className={row.negative ? "neg" : undefined}>
                  {row.negative ? "−" : ""}
                  {gbp(row.value / p.divisor)}
                </td>
              ))}
              <td className={row.negative ? "neg" : undefined}>
                {row.negative ? "−" : ""}
                {gbp(perHour(row.value, r.hoursPerWeek))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SplitBar({ r }: { r: TaxResult }) {
  if (r.gross <= 0) return null;
  const parts = [
    { key: "take", label: "Take-home", value: r.takeHome },
    { key: "tax", label: "Income Tax", value: r.incomeTax },
    { key: "ni", label: "NI", value: r.nationalInsurance },
    { key: "loan", label: "Loans", value: r.studentLoan + r.postgraduateLoan },
    { key: "pension", label: "Pension", value: r.pension },
  ].filter((p) => p.value > 0);

  return (
    <div>
      <div className="splitbar" role="img" aria-label="How your gross pay is split">
        {parts.map((p) => (
          <span key={p.key} className={`seg seg-${p.key}`} style={{ width: `${(p.value / r.gross) * 100}%` }} />
        ))}
      </div>
      <ul className="legend">
        {parts.map((p) => (
          <li key={p.key}>
            <span className={`dot seg-${p.key}`} />
            {p.label} <strong>{pct(p.value / r.gross)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BandTable({ r }: { r: TaxResult }) {
  if (r.bands.length === 0) return <p className="muted">No Income Tax is due — all of this income is covered by the Personal Allowance.</p>;
  return (
    <div className="table-wrap">
      <table className="breakdown compact">
        <thead>
          <tr>
            <th scope="col">Band</th>
            <th scope="col">Rate</th>
            <th scope="col">Income in band</th>
            <th scope="col">Tax</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Personal Allowance</th>
            <td>0%</td>
            <td>{gbp(r.personalAllowance, 0)}</td>
            <td>£0.00</td>
          </tr>
          {r.bands.map((b) => (
            <tr key={b.name}>
              <th scope="row">{b.name}</th>
              <td>{(b.rate * 100).toFixed(0)}%</td>
              <td>{gbp(b.amount)}</td>
              <td>{gbp(b.tax)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
