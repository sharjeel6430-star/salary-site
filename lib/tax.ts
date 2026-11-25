// UK take-home pay engine — tax year 2026/27 (6 April 2026 – 5 April 2027).
// Source: GOV.UK "Rates and thresholds for employers 2026 to 2027" and gov.scot.
// To update for a new tax year, change only the numbers in TAX_YEAR below.

export const TAX_YEAR = {
  label: "2026/27",
  personalAllowance: 12570,
  taperThreshold: 100000,
  // Bands apply to taxable income (income after the Personal Allowance).
  bands: {
    ruk: [
      { name: "Basic rate", upTo: 37700, rate: 0.2 },
      { name: "Higher rate", upTo: 125140, rate: 0.4 },
      { name: "Additional rate", upTo: Infinity, rate: 0.45 },
    ],
    scotland: [
      { name: "Starter rate", upTo: 3967, rate: 0.19 },
      { name: "Basic rate", upTo: 16956, rate: 0.2 },
      { name: "Intermediate rate", upTo: 31092, rate: 0.21 },
      { name: "Higher rate", upTo: 62430, rate: 0.42 },
      { name: "Advanced rate", upTo: 125140, rate: 0.45 },
      { name: "Top rate", upTo: Infinity, rate: 0.48 },
    ],
  },
  ni: {
    primaryThreshold: 12570,
    upperEarningsLimit: 50270,
    mainRate: 0.08,
    upperRate: 0.02,
    employerThreshold: 5000,
    employerRate: 0.15,
  },
  studentLoans: {
    plan1: { label: "Plan 1", threshold: 26900, rate: 0.09 },
    plan2: { label: "Plan 2", threshold: 29385, rate: 0.09 },
    plan4: { label: "Plan 4 (Scotland)", threshold: 33795, rate: 0.09 },
    plan5: { label: "Plan 5", threshold: 25000, rate: 0.09 },
  },
  postgraduateLoan: { threshold: 21000, rate: 0.06 },
} as const;

// Previous tax year, kept so people can compare this year with last year.
// Sources: GOV.UK "Rates and thresholds for employers 2025 to 2026"; GOV.UK "Scottish Income Tax 2025 to 2026".
export const TAX_YEAR_2025 = {
  label: "2025/26",
  personalAllowance: 12570,
  taperThreshold: 100000,
  bands: {
    ruk: [
      { name: "Basic rate", upTo: 37700, rate: 0.2 },
      { name: "Higher rate", upTo: 125140, rate: 0.4 },
      { name: "Additional rate", upTo: Infinity, rate: 0.45 },
    ],
    scotland: [
      { name: "Starter rate", upTo: 2827, rate: 0.19 },
      { name: "Basic rate", upTo: 14921, rate: 0.2 },
      { name: "Intermediate rate", upTo: 31092, rate: 0.21 },
      { name: "Higher rate", upTo: 62430, rate: 0.42 },
      { name: "Advanced rate", upTo: 125140, rate: 0.45 },
      { name: "Top rate", upTo: Infinity, rate: 0.48 },
    ],
  },
  ni: {
    primaryThreshold: 12570,
    upperEarningsLimit: 50270,
    mainRate: 0.08,
    upperRate: 0.02,
    employerThreshold: 5000,
    employerRate: 0.15,
  },
  studentLoans: {
    plan1: { label: "Plan 1", threshold: 26065, rate: 0.09 },
    plan2: { label: "Plan 2", threshold: 28470, rate: 0.09 },
    plan4: { label: "Plan 4 (Scotland)", threshold: 32745, rate: 0.09 },
    // Plan 5 repayments only start from April 2026, so nothing is repaid in 2025/26.
    plan5: { label: "Plan 5", threshold: Infinity, rate: 0.09 },
  },
  postgraduateLoan: { threshold: 21000, rate: 0.06 },
} as const;

export type TaxYearKey = "2026/27" | "2025/26";
type YearConfig = typeof TAX_YEAR | typeof TAX_YEAR_2025;
export const TAX_YEARS: Record<TaxYearKey, YearConfig> = { "2026/27": TAX_YEAR, "2025/26": TAX_YEAR_2025 };

export type Region = "ruk" | "scotland";
export type StudentPlan = "none" | "plan1" | "plan2" | "plan4" | "plan5";
export type PensionType = "sacrifice" | "netpay";

export interface TaxInput {
  gross: number; // annual gross salary (incl. any bonus)
  region?: Region;
  pensionPercent?: number; // 0–100
  pensionType?: PensionType;
  studentPlan?: StudentPlan;
  postgraduate?: boolean;
  noNI?: boolean; // over State Pension age
  hoursPerWeek?: number;
  year?: TaxYearKey; // defaults to the current tax year
}

export interface BandLine {
  name: string;
  rate: number;
  amount: number; // income taxed in this band
  tax: number;
}

export interface TaxResult {
  gross: number;
  pension: number;
  personalAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  bands: BandLine[];
  nationalInsurance: number;
  studentLoan: number;
  postgraduateLoan: number;
  totalDeductions: number;
  takeHome: number;
  employerNI: number;
  effectiveRate: number; // share of gross lost to tax + NI + loans
  marginalRate: number; // on the next £1 earned
  hoursPerWeek: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function personalAllowanceFor(adjustedNetIncome: number, Y: YearConfig = TAX_YEAR): number {
  const { personalAllowance, taperThreshold } = Y;
  if (adjustedNetIncome <= taperThreshold) return personalAllowance;
  const reduction = Math.floor((adjustedNetIncome - taperThreshold) / 2);
  return Math.max(0, personalAllowance - reduction);
}

function incomeTaxOn(taxable: number, region: Region, Y: YearConfig) {
  const lines: BandLine[] = [];
  let lower = 0;
  let total = 0;
  for (const band of Y.bands[region]) {
    if (taxable <= lower) break;
    const amount = Math.min(taxable, band.upTo) - lower;
    const tax = amount * band.rate;
    lines.push({ name: band.name, rate: band.rate, amount: round2(amount), tax: round2(tax) });
    total += tax;
    lower = band.upTo;
  }
  return { total, lines };
}

function niOn(niable: number, Y: YearConfig) {
  const { primaryThreshold, upperEarningsLimit, mainRate, upperRate } = Y.ni;
  const main = Math.max(0, Math.min(niable, upperEarningsLimit) - primaryThreshold);
  const upper = Math.max(0, niable - upperEarningsLimit);
  return main * mainRate + upper * upperRate;
}

function core(input: TaxInput) {
  const Y = TAX_YEARS[input.year ?? "2026/27"] ?? TAX_YEAR;
  const gross = Math.max(0, Number(input.gross) || 0);
  const region = input.region ?? "ruk";
  const pct = Math.min(100, Math.max(0, input.pensionPercent ?? 0));
  const pensionType = input.pensionType ?? "sacrifice";
  const pension = (gross * pct) / 100;

  // Salary sacrifice lowers pay for tax, NI and student loans.
  // Net pay arrangement lowers pay for income tax only.
  const taxablePay = gross - pension;
  const niablePay = pensionType === "sacrifice" ? gross - pension : gross;
  const loanPay = niablePay;

  const pa = personalAllowanceFor(taxablePay, Y);
  const taxable = Math.max(0, taxablePay - pa);
  const tax = incomeTaxOn(taxable, region, Y);
  const ni = input.noNI ? 0 : niOn(niablePay, Y);

  let studentLoan = 0;
  if (input.studentPlan && input.studentPlan !== "none") {
    const p = Y.studentLoans[input.studentPlan];
    studentLoan = Math.max(0, loanPay - p.threshold) * p.rate;
  }
  const pg = input.postgraduate
    ? Math.max(0, loanPay - Y.postgraduateLoan.threshold) * Y.postgraduateLoan.rate
    : 0;

  const employerNI = Math.max(0, niablePay - Y.ni.employerThreshold) * Y.ni.employerRate;
  const deductions = tax.total + ni + studentLoan + pg;
  const takeHome = gross - pension - deductions;

  return { gross, pension, pa, taxable, tax, ni, studentLoan, pg, deductions, takeHome, employerNI };
}

export function calculate(input: TaxInput): TaxResult {
  const r = core(input);
  // Marginal rate: what share of the next £100 is lost to tax/NI/loans/pension.
  const next = core({ ...input, gross: r.gross + 100 });
  const marginalRate = r.gross > 0 ? 1 - (next.takeHome - r.takeHome) / 100 : 0;

  return {
    gross: round2(r.gross),
    pension: round2(r.pension),
    personalAllowance: r.pa,
    taxableIncome: round2(r.taxable),
    incomeTax: round2(r.tax.total),
    bands: r.tax.lines,
    nationalInsurance: round2(r.ni),
    studentLoan: round2(r.studentLoan),
    postgraduateLoan: round2(r.pg),
    totalDeductions: round2(r.deductions),
    takeHome: round2(r.takeHome),
    employerNI: round2(r.employerNI),
    effectiveRate: r.gross > 0 ? r.deductions / r.gross : 0,
    marginalRate: Math.max(0, Math.round(marginalRate * 1000) / 1000),
    hoursPerWeek: input.hoursPerWeek && input.hoursPerWeek > 0 ? input.hoursPerWeek : 37.5,
  };
}

export const PERIODS = [
  { key: "year", label: "Yearly", divisor: 1 },
  { key: "month", label: "Monthly", divisor: 12 },
  { key: "week", label: "Weekly", divisor: 52 },
  { key: "day", label: "Daily", divisor: 260 },
] as const;

export function perPeriod(amount: number, divisor: number) {
  return amount / divisor;
}

export function perHour(amount: number, hoursPerWeek: number) {
  return amount / 52 / hoursPerWeek;
}

export const gbp = (n: number, dp = 2) =>
  "£" +
  n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp });

export const pct = (n: number, dp = 1) => (n * 100).toFixed(dp) + "%";
