// Public log of updates and corrections, shown on /methodology#corrections. Add a line whenever published
// figures are corrected (type "correction") or a notable update goes live (type "update"). Newest first.
export interface LogEntry {
  date: string; // ISO date
  type: "correction" | "update";
  text: string;
}

export const CHANGE_LOG: LogEntry[] = [
  {
    date: "2026-11-24",
    type: "correction",
    text: "Child Benefit: 2026/27 has 53 weekly payments, not 52, because both 6 April 2026 and 5 April 2027 are Mondays (ITEPA 2003 s681H). A full year is £1,433.65 for one child and £2,382.35 for two (was £1,406.60 and £2,337.40). The High Income Child Benefit Charge is now worked out on the benefit rounded down to whole pounds, so at £70,000 with two children the charge is £1,191 (was £1,168) and at £80,000 it is £2,382, keeping £0.35.",
  },
  {
    date: "2026-11-24",
    type: "update",
    text: "Added a worked example, a common pitfall and questions in searchers' own words to 21 salary pages (£16,500 to £52,500) and 6 hourly pages. Updated the median full-time UK salary to £40,911 (ONS, April 2026, provisional) from £39,039 (April 2025).",
  },
  {
    date: "2026-11-21",
    type: "correction",
    text: "National Insurance guide: the monthly examples used the yearly thresholds divided by 12 (£1,047.50 and £4,189.17). They now use HMRC's published monthly thresholds of £1,048 and £4,189, which payroll uses: NI on £3,000 a month is £156.16 (was £156.20) and on an £8,000 bonus month £327.50 (was £327.55).",
  },
  {
    date: "2026-11-21",
    type: "update",
    text: "Added five calculators: Capital Gains Tax (2026/27 rates, losses and Business Asset Disposal Relief), Stamp Duty (England and Northern Ireland, Scotland and Wales), National Insurance (employee and employer, by pay period and category), Self-Employed Tax (Income Tax, Class 4 NI and payments on account) and Company Car Tax (2026/27 benefit-in-kind rates).",
  },
  {
    date: "2026-11-20",
    type: "update",
    text: "Published research on the income tax threshold freeze: what it costs at every salary in 2026/27 and 2027/28, with charts and a free data pack.",
  },
  {
    date: "2026-11-19",
    type: "update",
    text: "Rewrote the National Insurance, student loan and salary sacrifice guides with worked examples. Added worked figures to the 20 most visited salary pages and 20 most visited hourly pages, this methodology page, the author page and the take-home pay data page with a CSV download.",
  },
  {
    date: "2026-11-14",
    type: "update",
    text: "Added mileage and fuel cost calculators for work travel.",
  },
  {
    date: "2026-11-12",
    type: "update",
    text: "Added the minimum wage, Child Benefit, redundancy, pension, payslip checker and Statutory Sick Pay calculators, all on 2026/27 rates.",
  },
  {
    date: "2026-10-21",
    type: "update",
    text: "Site launched with 2026/27 Income Tax, National Insurance and student loan rates from GOV.UK.",
  },
];
