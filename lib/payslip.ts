// Payslip checker: the deductions a payslip should show for one pay period in 2026/27.
// Tax is worked out on a non-cumulative ("week 1 / month 1") basis from the tax code, which matches a normal
// payslip when pay is the same every period. NI uses HMRC's per-period thresholds. Student and postgraduate loan
// deductions are rounded down to whole pounds, as payroll does.
import { TAX_YEAR, type Region } from "./tax.ts";

export type Frequency = "week" | "fortnight" | "4weeks" | "month";

export const FREQUENCIES: { key: Frequency; label: string; periods: number }[] = [
  { key: "month", label: "Monthly", periods: 12 },
  { key: "4weeks", label: "Every 4 weeks", periods: 13 },
  { key: "fortnight", label: "Every 2 weeks", periods: 26 },
  { key: "week", label: "Weekly", periods: 52 },
];

// HMRC employee NI thresholds for 2026/27. Fortnightly and 4-weekly use multiples of the weekly figures.
const NI_THRESHOLDS: Record<Frequency, { pt: number; uel: number }> = {
  week: { pt: 242, uel: 967 },
  fortnight: { pt: 484, uel: 1934 },
  "4weeks": { pt: 968, uel: 3868 },
  month: { pt: 1048, uel: 4189 },
};

export type CodeKind = "allowance" | "K" | "BR" | "D0" | "D1" | "D2" | "D3" | "NT" | "0T";

export interface ParsedCode {
  raw: string;
  valid: boolean;
  kind: CodeKind;
  allowance: number; // yearly tax-free pay (negative for K codes)
  region: Region;
  emergency: boolean; // W1, M1 or X suffix
  note: string;
}

export function parseTaxCode(input: string): ParsedCode {
  const raw = (input || "").toUpperCase().replace(/\s+/g, "");
  let code = raw;
  let region: Region = "ruk";
  if (code.startsWith("S")) {
    region = "scotland";
    code = code.slice(1);
  } else if (code.startsWith("C")) code = code.slice(1); // Wales uses the same rates as England
  const emergency = /(W1|M1|X)$/.test(code);
  code = code.replace(/(W1|M1|X)$/, "");
  const base = { raw, region, emergency };

  if (code === "BR") return { ...base, valid: true, kind: "BR", allowance: 0, note: "All your pay from this job is taxed at the basic rate (usually a second job)." };
  if ((code === "D2" || code === "D3") && region === "ruk")
    return { ...base, valid: false, kind: "allowance", allowance: TAX_YEAR.personalAllowance, note: "D2 and D3 are Scottish codes (SD2, SD3), so we used 1257L." };
  if (/^D[0-3]$/.test(code)) return { ...base, valid: true, kind: code as CodeKind, allowance: 0, note: "All your pay from this job is taxed at one higher rate (usually a second job)." };
  if (code === "NT") return { ...base, valid: true, kind: "NT", allowance: 0, note: "No tax is taken from this pay." };
  if (code === "0T") return { ...base, valid: true, kind: "0T", allowance: 0, note: "You get no tax-free Personal Allowance from this job." };
  const k = code.match(/^K(\d{1,4})$/);
  if (k) {
    const amt = parseInt(k[1], 10) * 10;
    return { ...base, valid: true, kind: "K", allowance: -amt, note: `K code: £${amt.toLocaleString("en-GB")} of untaxed income or benefits is added to your pay before tax.` };
  }
  const m = code.match(/^(\d{1,4})([LMNT])$/);
  if (m) {
    // Payroll tables add 9 to the code number × 10 (1257L gives £12,579 of free pay a year).
    const allowance = parseInt(m[1], 10) * 10 + 9;
    const letter = m[2];
    const note =
      letter === "M"
        ? "M: you receive Marriage Allowance from your partner."
        : letter === "N"
          ? "N: you have transferred part of your allowance to your partner (Marriage Allowance)."
          : letter === "T"
            ? "T: HMRC needs to review some items in your tax code."
            : m[1] === "1257"
              ? "1257L is the standard tax code: the full £12,570 Personal Allowance."
              : "L: you get a tax-free Personal Allowance, adjusted for anything HMRC knows about.";
    return { ...base, valid: true, kind: "allowance", allowance, note };
  }
  return { ...base, valid: false, kind: "allowance", allowance: TAX_YEAR.personalAllowance, note: "We didn't recognise that tax code, so we used 1257L." };
}

function bandTax(taxable: number, region: Region) {
  let lower = 0;
  let tax = 0;
  for (const band of TAX_YEAR.bands[region]) {
    if (taxable <= lower) break;
    tax += (Math.min(taxable, band.upTo) - lower) * band.rate;
    lower = band.upTo;
  }
  return tax;
}

const FLAT_RATES: Record<Region, Record<"BR" | "D0" | "D1" | "D2" | "D3", number | undefined>> = {
  ruk: { BR: 0.2, D0: 0.4, D1: 0.45, D2: undefined, D3: undefined },
  scotland: { BR: 0.2, D0: 0.21, D1: 0.42, D2: 0.45, D3: 0.48 },
};

export type PensionMethod = "netpay" | "sacrifice" | "ras" | "none";

export interface PayslipInput {
  gross: number; // gross pay for the period
  frequency?: Frequency;
  taxCode?: string;
  pension?: number; // pension deduction for the period
  pensionMethod?: PensionMethod;
  studentPlan?: "none" | "plan1" | "plan2" | "plan4" | "plan5";
  postgraduate?: boolean;
  noNI?: boolean; // over State Pension age (NI category C)
}

export interface ExpectedPayslip {
  code: ParsedCode;
  periods: number;
  taxablePay: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  postgraduateLoan: number;
  pension: number;
  netPay: number;
  kCapApplied: boolean;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function expectedPayslip(input: PayslipInput): ExpectedPayslip {
  const freq = input.frequency ?? "month";
  const periods = FREQUENCIES.find((f) => f.key === freq)!.periods;
  const gross = Math.max(0, input.gross || 0);
  const code = parseTaxCode(input.taxCode ?? "1257L");
  const pension = Math.max(0, input.pension || 0);
  const method = input.pensionMethod ?? "none";

  // A net pay pension or salary sacrifice reduces pay for tax; sacrifice also reduces it for NI and loans.
  const reduces = method === "netpay" || method === "sacrifice";
  const taxablePay = Math.max(0, gross - (reduces ? pension : 0));
  const niPay = Math.max(0, gross - (method === "sacrifice" ? pension : 0));

  let incomeTax = 0;
  let kCapApplied = false;
  if (code.kind === "allowance" || code.kind === "0T" || code.kind === "K") {
    const yearly = taxablePay * periods;
    const taxableYear = Math.max(0, yearly - code.allowance);
    incomeTax = bandTax(taxableYear, code.region) / periods;
    if (code.kind === "K" && incomeTax > taxablePay * 0.5) {
      incomeTax = taxablePay * 0.5; // tax under a K code can't be more than half your pay in a period
      kCapApplied = true;
    }
  } else if (code.kind !== "NT") {
    const rate = FLAT_RATES[code.region][code.kind as "BR"] ?? FLAT_RATES.ruk[code.kind as "BR"] ?? 0.2;
    incomeTax = taxablePay * rate;
  }

  const t = NI_THRESHOLDS[freq];
  const nationalInsurance = input.noNI
    ? 0
    : Math.max(0, Math.min(niPay, t.uel) - t.pt) * TAX_YEAR.ni.mainRate + Math.max(0, niPay - t.uel) * TAX_YEAR.ni.upperRate;

  let studentLoan = 0;
  if (input.studentPlan && input.studentPlan !== "none") {
    const p = TAX_YEAR.studentLoans[input.studentPlan];
    studentLoan = Math.floor(Math.max(0, niPay - p.threshold / periods) * p.rate);
  }
  const postgraduateLoan = input.postgraduate
    ? Math.floor(Math.max(0, niPay - TAX_YEAR.postgraduateLoan.threshold / periods) * TAX_YEAR.postgraduateLoan.rate)
    : 0;

  // Salary sacrifice is normally already taken off the gross pay shown, but if entered we deduct it here.
  const netPay = gross - incomeTax - nationalInsurance - studentLoan - postgraduateLoan - (method === "none" ? 0 : pension);

  return {
    code,
    periods,
    taxablePay: r2(taxablePay),
    incomeTax: r2(incomeTax),
    nationalInsurance: r2(nationalInsurance),
    studentLoan,
    postgraduateLoan,
    pension: method === "none" ? 0 : r2(pension),
    netPay: r2(netPay),
    kCapApplied,
  };
}

export type CheckStatus = "match" | "close" | "higher" | "lower" | "blank";

// Compares one payslip figure with the expected amount. Within £1 = match, within £5 = close (rounding,
// cumulative tax or HMRC table differences).
export function compareLine(actual: number | null, expected: number): { status: CheckStatus; difference: number } {
  if (actual === null || !Number.isFinite(actual)) return { status: "blank", difference: 0 };
  const difference = r2(actual - expected);
  const abs = Math.abs(difference);
  if (abs <= 1) return { status: "match", difference };
  if (abs <= 5) return { status: "close", difference };
  return { status: difference > 0 ? "higher" : "lower", difference };
}
