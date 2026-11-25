// Class 1 National Insurance by pay period, tax year 2026/27, for employees and employers.
// Sources: GOV.UK "Rates and thresholds for employers 2026 to 2027"; GOV.UK "National Insurance rates and categories";
// HMRC CA38 (2026 to 2027). Thresholds per pay period are HMRC's published figures, not the annual figure divided.

export const NI_YEAR = "2026/27";

export const NI_PERIODS = [
  { key: "week", label: "Weekly", perYear: 52, lel: 129, pt: 242, st: 96, uel: 967 },
  { key: "fortnight", label: "Every 2 weeks", perYear: 26, lel: 258, pt: 484, st: 192, uel: 1934 },
  { key: "fourweek", label: "Every 4 weeks", perYear: 13, lel: 516, pt: 968, st: 384, uel: 3868 },
  { key: "month", label: "Monthly", perYear: 12, lel: 559, pt: 1048, st: 417, uel: 4189 },
  { key: "year", label: "Yearly (directors' annual earnings period)", perYear: 1, lel: 6708, pt: 12570, st: 5000, uel: 50270 },
] as const;
export type NiPeriodKey = (typeof NI_PERIODS)[number]["key"];

// Employee main rate between PT and UEL, and above the UEL. Employer: 0% up to an upper secondary threshold
// (equal to the UEL) for under-21s, apprentices under 25 and veterans in their first year, 15% above the ST otherwise.
export const NI_CATEGORIES = [
  { key: "A", label: "A: most employees", main: 0.08, upper: 0.02, employerZeroToUel: false },
  { key: "M", label: "M: under 21", main: 0.08, upper: 0.02, employerZeroToUel: true },
  { key: "H", label: "H: apprentice under 25", main: 0.08, upper: 0.02, employerZeroToUel: true },
  { key: "V", label: "V: veteran, first 12 months of civilian work", main: 0.08, upper: 0.02, employerZeroToUel: true },
  { key: "C", label: "C: over State Pension age", main: 0, upper: 0, employerZeroToUel: false },
  { key: "B", label: "B: married woman or widow with a reduced-rate election", main: 0.0185, upper: 0.02, employerZeroToUel: false },
] as const;
export type NiCategoryKey = (typeof NI_CATEGORIES)[number]["key"];

export const EMPLOYER_RATE = 0.15;
export const EMPLOYMENT_ALLOWANCE = 10500;

// HMRC exact percentage method: round to the nearest penny, with exactly half a penny rounded down.
export const roundNi = (x: number) => {
  const p = x * 100;
  const f = Math.floor(p);
  return (p - f > 0.5 + 1e-9 ? f + 1 : f) / 100;
};

export interface NiBand { label: string; from: number; to: number; amount: number; rate: number; ni: number }

export interface NiResult {
  pay: number;
  period: (typeof NI_PERIODS)[number];
  category: (typeof NI_CATEGORIES)[number];
  employee: number;
  employer: number;
  employeeBands: NiBand[];
  employerBands: NiBand[];
  belowLel: boolean; // no NI record credit for this period
  perYear: { employee: number; employer: number };
}

const slice = (pay: number, from: number, to: number) => Math.max(0, Math.min(pay, to) - from);

export function niForPeriod(pay: number, periodKey: NiPeriodKey = "month", categoryKey: NiCategoryKey = "A"): NiResult {
  const period = NI_PERIODS.find((p) => p.key === periodKey)!;
  const category = NI_CATEGORIES.find((c) => c.key === categoryKey)!;
  const p = Math.max(0, pay || 0);

  const employeeBands: NiBand[] = [
    { label: "Up to the Primary Threshold", from: 0, to: period.pt, rate: 0, amount: slice(p, 0, period.pt), ni: 0 },
    { label: "Primary Threshold to Upper Earnings Limit", from: period.pt, to: period.uel, rate: category.main, amount: slice(p, period.pt, period.uel), ni: 0 },
    { label: "Above the Upper Earnings Limit", from: period.uel, to: Infinity, rate: category.upper, amount: slice(p, period.uel, Infinity), ni: 0 },
  ].map((b) => ({ ...b, ni: b.amount * b.rate }));

  const zeroTop = category.employerZeroToUel ? period.uel : period.st;
  const employerBands: NiBand[] = [
    { label: "Up to the Secondary Threshold", from: 0, to: period.st, rate: 0, amount: slice(p, 0, period.st), ni: 0 },
    ...(category.employerZeroToUel
      ? [{ label: "Secondary Threshold to Upper Secondary Threshold", from: period.st, to: period.uel, rate: 0, amount: slice(p, period.st, period.uel), ni: 0 }]
      : []),
    { label: category.employerZeroToUel ? "Above the Upper Secondary Threshold" : "Above the Secondary Threshold", from: zeroTop, to: Infinity, rate: EMPLOYER_RATE, amount: slice(p, zeroTop, Infinity), ni: 0 },
  ].map((b) => ({ ...b, ni: b.amount * b.rate }));

  const employee = roundNi(employeeBands.reduce((s, b) => s + b.ni, 0));
  const employer = roundNi(employerBands.reduce((s, b) => s + b.ni, 0));
  return {
    pay: p,
    period,
    category,
    employee,
    employer,
    employeeBands,
    employerBands,
    belowLel: p < period.lel,
    perYear: { employee: employee * period.perYear, employer: employer * period.perYear },
  };
}

/** NI in a normal pay period and in one with a bonus on top: how much of the bonus goes in NI. */
export function bonusNi(pay: number, bonus: number, periodKey: NiPeriodKey = "month", categoryKey: NiCategoryKey = "A") {
  const normal = niForPeriod(pay, periodKey, categoryKey);
  const withBonus = niForPeriod(pay + Math.max(0, bonus || 0), periodKey, categoryKey);
  return {
    normal,
    withBonus,
    employeeOnBonus: roundNi(withBonus.employee - normal.employee),
    employerOnBonus: roundNi(withBonus.employer - normal.employer),
  };
}
