// Every calculator on the site, used by the home page, /calculators and the sitemap.
export const TOOLS: { href: string; t: string; d: string; group: "Employees" | "Sectors" | "Business" | "Work patterns" | "Life events" | "Everyday" }[] = [
  { href: "/", t: "Take home pay calculator", d: "Salary after tax, NI, student loan and pension.", group: "Employees" },
  { href: "/monthly-salary-calculator", t: "Monthly salary calculator", d: "Your monthly take-home pay after tax, NI, pension and student loan.", group: "Employees" },
  { href: "/scotland-salary-calculator", t: "Scotland salary calculator", d: "Take-home pay with Scottish Income Tax rates.", group: "Employees" },
  { href: "/compare-salaries", t: "Compare salaries", d: "Compare two job offers or a pay rise side by side, after tax.", group: "Employees" },
  { href: "/net-to-gross-salary-calculator", t: "Net to gross salary calculator", d: "Work back from the take-home pay you want to the salary you need.", group: "Employees" },
  { href: "/salary-sacrifice-calculator", t: "Salary sacrifice calculator", d: "See how much tax and NI you save on pension contributions.", group: "Employees" },
  { href: "/electric-car-salary-sacrifice-calculator", t: "EV salary sacrifice calculator", d: "Real monthly cost of an electric car through your employer, with 4% BIK.", group: "Employees" },
  { href: "/hourly-to-salary", t: "Hourly to salary calculator", d: "Convert an hourly wage to a yearly salary, and back again.", group: "Employees" },
  { href: "/national-insurance-calculator", t: "National Insurance calculator", d: "Employee and employer NI by pay period and category letter, including bonus months.", group: "Employees" },
  { href: "/company-car-tax-calculator", t: "Company car tax calculator", d: "Monthly benefit-in-kind tax on a petrol, diesel, hybrid or electric company car.", group: "Employees" },
  { href: "/payslip-checker", t: "Payslip checker", d: "Check the tax, NI, student loan and net pay on your payslip, line by line.", group: "Employees" },
  { href: "/minimum-wage-calculator", t: "Minimum wage calculator", d: "2026 rates by age, pay after tax, the April 2027 rates and a pay check.", group: "Employees" },
  { href: "/mileage-calculator", t: "Mileage calculator", d: "HMRC business mileage at 55p a mile for 2026/27, and the tax relief you can claim.", group: "Employees" },
  { href: "/nhs-take-home-pay-calculator", t: "NHS take home pay calculator", d: "Agenda for Change bands 2–9 with NHS pension tiers.", group: "Sectors" },
  { href: "/doctor-take-home-pay-calculator", t: "Doctor take home pay calculator", d: "FY1 to ST8 and consultants, with NHS pension, 2026/27.", group: "Sectors" },
  { href: "/teacher-take-home-pay-calculator", t: "Teacher take home pay calculator", d: "2026/27 pay scales M1–U3 with Teachers' Pension.", group: "Sectors" },
  { href: "/pro-rata-salary-calculator", t: "Pro rata salary calculator", d: "Part-time or part-year pay from a full-time salary.", group: "Work patterns" },
  { href: "/pro-rata-holiday-calculator", t: "Pro rata holiday calculator", d: "Part-time holiday entitlement in days or hours.", group: "Work patterns" },
  { href: "/stamp-duty-calculator", t: "Stamp duty calculator", d: "Stamp duty in England and NI, LBTT in Scotland and LTT in Wales, for any buyer.", group: "Life events" },
  { href: "/mortgage-calculator", t: "Mortgage calculator", d: "Monthly repayments, total interest and how much you can borrow on your salary.", group: "Life events" },
  { href: "/child-benefit-calculator", t: "Child Benefit calculator", d: "How much Child Benefit you keep after the High Income Child Benefit Charge.", group: "Life events" },
  { href: "/statutory-sick-pay-calculator", t: "Statutory Sick Pay calculator", d: "SSP from day one under the April 2026 rules: £123.25 a week or 80% of earnings.", group: "Life events" },
  { href: "/redundancy-pay-calculator", t: "Redundancy pay calculator", d: "Statutory redundancy pay with the 2026 £751 weekly cap and the £30,000 tax-free limit.", group: "Life events" },
  { href: "/pension-calculator", t: "Pension calculator", d: "Your pension pot at retirement, income with the State Pension, and tax-free cash.", group: "Life events" },
  { href: "/self-employed-tax-calculator", t: "Self-employed tax calculator", d: "Income Tax, Class 4 NI and take-home profit for sole traders, with payments on account.", group: "Business" },
  { href: "/capital-gains-tax-calculator", t: "Capital Gains Tax calculator", d: "Tax on selling shares, property, crypto or business assets, with the £3,000 allowance.", group: "Business" },
  { href: "/corporation-tax-calculator", t: "Corporation Tax calculator", d: "19% and 25% rates with marginal relief.", group: "Business" },
  { href: "/dividend-tax-calculator", t: "Dividend tax calculator", d: "Tax on dividends with the new 2026/27 rates.", group: "Business" },
  { href: "/fuel-cost-calculator", t: "Fuel cost calculator", d: "Petrol, diesel or electric cost of any journey, per mile and per week.", group: "Everyday" },
  { href: "/as-the-crow-flies-distance-calculator", t: "As the crow flies distance calculator", d: "Straight-line distance between two UK postcodes, towns or coordinates.", group: "Everyday" },
  { href: "/university-grade-calculator", t: "University grade calculator", d: "Your degree classification from module marks, credits and year weightings.", group: "Everyday" },
  { href: "/bmi-calculator", t: "BMI calculator", d: "Body mass index in kg or stones, with the healthy weight range for your height.", group: "Everyday" },
  { href: "/tdee-calculator", t: "TDEE calculator", d: "Your BMR and daily maintenance calories from the Mifflin-St Jeor formula.", group: "Everyday" },
  { href: "/steps-to-miles-calculator", t: "Steps to miles calculator", d: "Convert steps to miles or km using your height and pace.", group: "Everyday" },
];

// Off-topic tools kept online but hidden from search engines (v17, 19 Nov 2026): noindex on the page, left out of the
// sitemap, the homepage and site search (the search-index script skips noindex pages). They stay in /calculators.
// Mileage and fuel cost stay indexed (work travel).
export const NOINDEX_TOOLS = [
  "/bmi-calculator",
  "/tdee-calculator",
  "/steps-to-miles-calculator",
  "/as-the-crow-flies-distance-calculator",
  "/university-grade-calculator",
];
export const NOINDEX = { index: false, follow: true } as const;
