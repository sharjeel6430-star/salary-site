// Mortgage repayments and borrowing estimates.
// Repayments use the standard annuity formula with monthly compounding. Borrowing uses income multiples,
// which is how UK lenders give a first estimate (most lend 4 to 4.5 times income; some up to 5 or 5.5).
import { calculate, type Region } from "./tax.ts";

export function monthlyRepayment(loan: number, annualRatePct: number, years: number): number {
  const P = Math.max(0, loan || 0);
  const n = Math.round(Math.max(0, years || 0) * 12);
  if (P === 0 || n === 0) return 0;
  const r = Math.max(0, annualRatePct || 0) / 100 / 12;
  if (r === 0) return P / n;
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

export const monthlyInterestOnly = (loan: number, annualRatePct: number) =>
  (Math.max(0, loan || 0) * Math.max(0, annualRatePct || 0)) / 100 / 12;

export interface YearRow {
  year: number;
  interest: number;
  capital: number;
  balance: number;
}

export interface RepaymentResult {
  loan: number;
  monthly: number;
  interestOnlyMonthly: number;
  totalPaid: number;
  totalInterest: number;
  schedule: YearRow[];
  ltv: number | null; // loan-to-value, when a property price is given
}

export function repaymentPlan(opts: { loan: number; ratePct: number; years: number; propertyPrice?: number }): RepaymentResult {
  const loan = Math.max(0, opts.loan || 0);
  const years = Math.max(1, Math.min(40, Math.round(opts.years || 25)));
  const monthly = monthlyRepayment(loan, opts.ratePct, years);
  const r = Math.max(0, opts.ratePct || 0) / 100 / 12;
  const schedule: YearRow[] = [];
  let balance = loan;
  for (let y = 1; y <= years; y++) {
    let interest = 0;
    let capital = 0;
    for (let m = 0; m < 12; m++) {
      const i = balance * r;
      const c = Math.min(balance, monthly - i);
      interest += i;
      capital += c;
      balance -= c;
    }
    schedule.push({ year: y, interest, capital, balance: Math.max(0, balance) });
  }
  const totalPaid = monthly * years * 12;
  return {
    loan,
    monthly,
    interestOnlyMonthly: monthlyInterestOnly(loan, opts.ratePct),
    totalPaid,
    totalInterest: totalPaid - loan,
    schedule,
    ltv: opts.propertyPrice && opts.propertyPrice > 0 ? loan / opts.propertyPrice : null,
  };
}

export const INCOME_MULTIPLES = [4, 4.5, 5, 5.5];

export interface AffordabilityResult {
  income: number; // combined gross income
  multiple: number;
  maxLoan: number;
  propertyPrice: number; // loan + deposit
  ltv: number;
  monthly: number;
  takeHomeMonth: number; // combined, after tax and NI
  shareOfTakeHome: number; // monthly repayment ÷ take-home
}

export function affordability(opts: {
  income1: number;
  income2?: number;
  deposit?: number;
  multiple?: number;
  ratePct: number;
  years: number;
  region?: Region;
}): AffordabilityResult {
  const i1 = Math.max(0, opts.income1 || 0);
  const i2 = Math.max(0, opts.income2 || 0);
  const income = i1 + i2;
  const multiple = opts.multiple && opts.multiple > 0 ? opts.multiple : 4.5;
  const deposit = Math.max(0, opts.deposit || 0);
  const maxLoan = income * multiple;
  const propertyPrice = maxLoan + deposit;
  const monthly = monthlyRepayment(maxLoan, opts.ratePct, opts.years);
  const region = opts.region ?? "ruk";
  const takeHomeMonth =
    (calculate({ gross: i1, region }).takeHome + (i2 > 0 ? calculate({ gross: i2, region }).takeHome : 0)) / 12;
  return {
    income,
    multiple,
    maxLoan,
    propertyPrice,
    ltv: propertyPrice > 0 ? maxLoan / propertyPrice : 0,
    monthly,
    takeHomeMonth,
    shareOfTakeHome: takeHomeMonth > 0 ? monthly / takeHomeMonth : 0,
  };
}
