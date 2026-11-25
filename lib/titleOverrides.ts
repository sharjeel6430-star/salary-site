// Page titles of 60 characters or less (39 from v17, three new calculators added in v19), without the " | UK Salary Tools" suffix (v17, 19 Nov 2026),
// from Sharjeel's uksalarytools-title-fixes.csv. Used as absolute titles, so the layout template adds nothing.
// tests/titles.test.ts checks every one is 60 characters or less and that each page uses it.
import { TAX_YEAR } from "./tax.ts";

const Y = TAX_YEAR.label;

export const SHORT_TITLES: Record<string, string> = {
  "/net-to-gross-salary-calculator": `Net to Gross Salary Calculator UK ${Y}`,
  "/mileage-calculator": `Mileage Calculator UK ${Y}: HMRC 55p Mileage`,
  "/nhs-take-home-pay-calculator": `NHS Take Home Pay Calculator ${Y} (All Bands)`,
  "/doctor-take-home-pay-calculator": `Doctor Salary After Tax UK ${Y} | Resident & Consultant`,
  "/pro-rata-holiday-calculator": `Pro Rata Holiday Calculator UK (Part-Time Holiday)`,
  "/fuel-cost-calculator": `Fuel Cost Calculator UK: Cost of Any Journey`,
  "/salary-needed-to-live-uk-cities": `Salary Needed to Live in UK Cities ${Y}`,
  "/compare-salaries": `Compare Salaries UK ${Y}: Pay Rise & Job Offer`,
  "/minimum-wage-calculator": `Minimum Wage 2026 UK: Rates by Age + Take-Home Pay`,
  "/pension-calculator": `Pension Calculator UK ${Y}: Retirement Savings`,
  "/monthly-salary-calculator": `Monthly Salary Calculator UK ${Y}: Take Home Pay`,
  "/redundancy-pay-calculator": `Redundancy Pay Calculator UK 2026 (Statutory)`,
  "/corporation-tax-calculator": `Corporation Tax Calculator UK ${Y} + Marginal Relief`,
  "/university-grade-calculator": `Uni Grade Calculator: Work Out Your Degree Class`,
  "/teacher-take-home-pay-calculator": `Teacher Take Home Pay Calculator ${Y} (M1–U3)`,
  "/": `Salary Calculator UK ${Y} – Take Home Pay Calculator`,
  "/pro-rata-salary-calculator": `Pro Rata Calculator UK ${Y}: Salary After Tax`,
  "/mortgage-calculator": `Mortgage Calculator UK: Repayments & How Much to Borrow`,
  "/statutory-sick-pay-calculator": `Statutory Sick Pay Calculator ${Y} (SSP £123.25)`,
  "/hourly-to-salary": `Hourly Wage Calculator UK ${Y}: Hourly to Salary`,
  "/salary-sacrifice-calculator": `Salary Sacrifice Calculator UK ${Y}: Tax & NI Saved`,
  "/bmi-calculator": `BMI Calculator for Men and Women (kg or Stones)`,
  "/scotland-salary-calculator": `Take Home Pay Calculator Scotland ${Y}`,
  "/electric-car-salary-sacrifice-calculator": `EV Salary Sacrifice Calculator UK ${Y}`,
  "/as-the-crow-flies-distance-calculator": `As the Crow Flies Distance Calculator UK`,
  "/steps-to-miles-calculator": `Steps to Miles Calculator: Convert Steps by Height`,
  "/child-benefit-calculator": `Child Benefit Calculator ${Y} + High Income Charge`,
  "/tdee-calculator": `TDEE Calculator: Daily Calories and the Formula`,
  "/dividend-tax-calculator": `Dividend Tax Calculator UK ${Y} (New 10.75% Rate)`,
  "/guides/uk-tax-bands-2026-27": `UK Tax Brackets ${Y}: Income Tax Bands and Rates`,
  "/about": `About UK Salary Tools: Who Runs It and Our Sources`,
  "/nhs-pay-bands": `NHS Pay Bands ${Y}: Agenda for Change Salaries`,
  "/salary": `Salary After Tax Table UK ${Y}: £10k to £500k`,
  "/methodology": `How We Calculate Take-Home Pay | UK Salary Tools`,
  "/national-insurance-calculator": `National Insurance Calculator ${Y}: Employee & Employer`,
  "/self-employed-tax-calculator": `Self-Employed Tax Calculator UK ${Y}`,
  "/company-car-tax-calculator": `Company Car Tax Calculator ${Y} (BIK)`,
  "/capital-gains-tax-calculator": `Capital Gains Tax Calculator UK ${Y}`,
  "/stamp-duty-calculator": "Stamp Duty Calculator 2026: England, Scotland & Wales",
  "/payslip-checker": `Payslip Checker & Payslip Calculator UK ${Y}`,
  "/author/sharjeel": `Sharjeel, Founder and Editor of UK Salary Tools`,
  "/guides/salary-sacrifice-pension": `Salary Sacrifice vs Net Pay vs Relief at Source`,
  "/hourly": `Hourly Rate to Annual Salary Table UK ${Y}`,
  "/take-home": `Monthly Take-Home Pay to Salary UK ${Y}`,
};

/** The absolute title for a page in SHORT_TITLES. Throws at build time if the path is missing, so a typo can't slip through. */
export function shortTitle(path: string): { absolute: string } {
  const t = SHORT_TITLES[path];
  if (!t) throw new Error(`No short title for ${path}`);
  return { absolute: t };
}
