// Self-employed (sole trader) tax for 2026/27: Income Tax, Class 4 NI, student loan through Self Assessment, and
// payments on account. Sources: GOV.UK "Self-employed National Insurance rates" (6% £12,570–£50,270, 2% above;
// Class 2 treated as paid from £7,105, voluntary £3.65 a week); GOV.UK "Understand your Self Assessment tax bill:
// payments on account"; GOV.UK "Trading allowance".
import { calculate, type Region, type StudentPlan } from "./tax.ts";

export const SE_YEAR = "2026/27";
export const CLASS4 = { lowerProfitsLimit: 12570, upperProfitsLimit: 50270, mainRate: 0.06, upperRate: 0.02 };
export const CLASS2 = { smallProfitsThreshold: 7105, weekly: 3.65 };
export const TRADING_ALLOWANCE = 1000;
export const POA_MIN = 1000;
export const DEADLINES = { returnAndBalance: "31 January 2028", secondPoa: "31 July 2028", nextBalance: "31 January 2029" };

export interface SelfEmployedInput {
  income: number; // turnover: total sales or fees before expenses
  expenses: number; // allowable business expenses
  useTradingAllowance?: boolean; // claim the £1,000 trading allowance instead of expenses
  salary?: number; // employment income taxed through PAYE in the same year
  region?: Region;
  studentPlan?: StudentPlan;
}

export interface SelfEmployedResult {
  profit: number;
  deduction: number; // expenses or trading allowance used
  tradingAllowanceBetter: boolean;
  incomeTax: number; // Income Tax due on the profit (after tax already paid on the salary)
  class4: number;
  studentLoan: number; // extra repayment collected through Self Assessment
  bill: number; // total due through Self Assessment for the year
  takeHome: number; // profit after tax, NI and student loan
  effectiveRate: number; // bill as a share of profit
  setAsideMonthly: number;
  class2TreatedAsPaid: boolean;
  voluntaryClass2Year: number;
  poaRequired: boolean;
  poaEach: number;
  firstYear: { january: number; july: number }; // 2026/27 bill + first payment on account for 2027/28, then the second
  mtdFrom: string | null; // when Making Tax Digital for Income Tax applies, judged on this year's turnover
}

export function class4(profit: number): number {
  const p = Math.max(0, profit);
  return (
    Math.max(0, Math.min(p, CLASS4.upperProfitsLimit) - CLASS4.lowerProfitsLimit) * CLASS4.mainRate +
    Math.max(0, p - CLASS4.upperProfitsLimit) * CLASS4.upperRate
  );
}

export function selfEmployedTax(input: SelfEmployedInput): SelfEmployedResult {
  const income = Math.max(0, input.income || 0);
  const expenses = Math.max(0, input.expenses || 0);
  const salary = Math.max(0, input.salary || 0);
  const region = input.region ?? "ruk";
  const studentPlan = input.studentPlan ?? "none";

  const allowance = Math.min(TRADING_ALLOWANCE, income);
  const deduction = input.useTradingAllowance ? allowance : Math.min(expenses, income);
  const profit = Math.max(0, income - deduction);
  const tradingAllowanceBetter = !input.useTradingAllowance && expenses < allowance;

  const all = calculate({ gross: salary + profit, region, studentPlan, noNI: true });
  const paye = calculate({ gross: salary, region, studentPlan, noNI: true });
  const incomeTax = Math.max(0, all.incomeTax - paye.incomeTax);
  const c4 = class4(profit);
  const studentLoan = Math.max(0, all.studentLoan - paye.studentLoan);
  const bill = incomeTax + c4 + studentLoan;
  const takeHome = profit - bill;

  // Payments on account cover Income Tax and Class 4 (not student loan). None are due if that is under £1,000,
  // or if at least 80% of the year's Income Tax and Class 4 was already paid through PAYE.
  const relevant = incomeTax + c4;
  const assessed = all.incomeTax + c4;
  const poaRequired = relevant >= POA_MIN && paye.incomeTax < 0.8 * assessed;
  const poaEach = poaRequired ? relevant / 2 : 0;

  return {
    profit,
    deduction,
    tradingAllowanceBetter,
    incomeTax,
    class4: c4,
    studentLoan,
    bill,
    takeHome,
    effectiveRate: profit > 0 ? bill / profit : 0,
    setAsideMonthly: bill / 12,
    class2TreatedAsPaid: profit >= CLASS2.smallProfitsThreshold,
    voluntaryClass2Year: CLASS2.weekly * 52,
    poaRequired,
    poaEach,
    firstYear: { january: bill + poaEach, july: poaEach },
    mtdFrom: income > 50000 ? "6 April 2026" : income > 30000 ? "6 April 2027" : income > 20000 ? "6 April 2028" : null,
  };
}
