// Page copy for the salary and hourly pages with more than 15 Search Console impressions (24 Nov 2026),
// from Sharjeel's PAGE_COPY_SALARY_HOURLY.md. Each page gets one worked example, one edge case and 2–3 FAQs
// in the words people search with; the generic FAQ list is replaced by these on these pages.
// Every figure was checked against calculate(), lib/nhs.ts and lib/teachers.ts for 2026/27, and corrected
// where the supplied text was wrong. tests/pageCopy.test.ts re-checks them: it fails each April until updated.
export interface PageCopy {
  example: string;
  edge: string;
  faqs: { q: string; a: string }[];
  link: { href: string; label: string };
}

export const COPY_CHECKED = "Checked against HMRC rates, November 2026 — Sharjeel Iqbal, UK Salary Tools.";
export const COPY_SOURCE = { href: "https://www.gov.uk/income-tax-rates", label: "GOV.UK: Income Tax rates and Personal Allowances" };

const SACRIFICE = { href: "/salary-sacrifice-calculator", label: "Salary sacrifice calculator" };
const NHS = { href: "/nhs-take-home-pay-calculator", label: "NHS take-home pay calculator" };
const SCOTLAND = { href: "/scotland-salary-calculator", label: "Scotland salary calculator" };
const HOME = { href: "/", label: "Salary calculator" };
const HOURLY = { href: "/hourly-to-salary", label: "Hourly to salary calculator" };

export const SALARY_COPY: Record<number, PageCopy> = {
  16500: {
    example:
      "About 25 hours a week on the National Living Wage (£12.71 an hour) comes to £16,523 a year, so this is a typical part-time retail or care salary. Your first £12,570 is tax-free, so only £3,930 is taxed at all. That's why you keep 93% of your pay.",
    edge:
      "If you also have a second job, you only get the £12,570 Personal Allowance once. Your second employer will usually give you a BR tax code and take 20% from the first pound, so two jobs together leave you with less than two separate calculations suggest.",
    faqs: [
      { q: "How much is £16,500 a month after tax?", a: "£1,283.30 a month. Your gross pay is £1,375 a month, and £65.50 goes in Income Tax and £26.20 in National Insurance." },
      { q: "Is £16,500 a good salary?", a: "As a full-time salary it is well below the UK median of £40,911 (ONS, April 2026). As a part-time salary, about 25 hours a week at the National Living Wage, it's typical." },
      { q: "What is £16,500 after tax in Scotland?", a: "£15,438.90 a year, £39.30 more than in England, Wales and Northern Ireland. All £3,930 of your taxable pay falls in Scotland's 19% starter band." },
    ],
    link: HOME,
  },
  17500: {
    example:
      "A 20-hour week at £16.80 an hour comes to £17,472 a year, close to this figure. Only £4,930 of your pay is above the Personal Allowance, so you keep 92% of what you earn.",
    edge:
      "Nothing is taken for a student loan at this salary: repayments start at £25,000 on Plan 5, £26,900 on Plan 1 and £29,385 on Plan 2. If your payslip shows a deduction, check your tax code and which plan your employer has on record.",
    faqs: [
      { q: "How much is £17,500 a month after tax?", a: "£1,343.30 a month, from £1,458.33 gross." },
      { q: "How much tax do I pay on £17,500?", a: "£986 Income Tax and £394.40 National Insurance a year, which is £115.03 a month in total." },
      { q: "Does £17,500 qualify for Universal Credit?", a: "Possibly. Universal Credit depends on your household's income, savings, rent and children, not on your salary alone, so check with one of the free benefits calculators listed on GOV.UK." },
    ],
    link: HOME,
  },
  24000: {
    example:
      "A full-time job on the National Living Wage (£12.71 an hour, 37.5 hours a week) pays £24,784.50, a little more than this. On the standard tax code you keep 87% of £24,000.",
    edge:
      "A 5% workplace pension is £1,200 a year. With tax relief it cuts your Income Tax by £240 (£20 a month), so your take-home falls by £80 a month, not £100. Through salary sacrifice it falls by only £72, because you save National Insurance too.",
    faqs: [
      { q: "How much is £24,000 a month after tax?", a: "£1,733.30 a month." },
      { q: "What is £24,000 a year an hour?", a: "£12.31 an hour on a 37.5-hour week, or £11.54 on a 40-hour week." },
      { q: "Is £24,000 a good salary in the UK?", a: "It's below the UK full-time median of £40,911 (ONS, April 2026), and close to what a full-time National Living Wage job pays. With lower rent outside London it can work." },
    ],
    link: SACRIFICE,
  },
  24500: {
    example:
      "A £500 rise from £24,000 adds £360 a year, or £30 a month, to your take-home pay. You keep 72p of each extra pound: 20p goes in Income Tax and 8p in National Insurance.",
    edge:
      "Monthly payroll uses HMRC's monthly thresholds (£1,048 a month for National Insurance), not the yearly figures divided by 12, so a single payslip can differ from this page by a few pence. That's normal.",
    faqs: [
      { q: "How much is £24,500 a month after tax?", a: "£1,763.30 a month." },
      { q: "How much tax do I pay on £24,500?", a: "£2,386 Income Tax and £954.40 National Insurance a year." },
    ],
    link: HOME,
  },
  25500: {
    example:
      "This is a typical starting salary for a junior admin or support role. Your marginal rate is 28%, so a £1,000 bonus is worth £720 after tax and National Insurance, not £1,000.",
    edge:
      "If your student loan is Plan 5 (courses starting from August 2023), you already repay at this salary: 9% of everything over £25,000, which is £45 a year. On Plan 1 repayments start at £26,900, so more than £1,400 of overtime would add a 9% deduction on the part above it.",
    faqs: [
      { q: "How much is £25,500 a month after tax?", a: "£1,823.30 a month." },
      { q: "What is £25,500 a year an hour?", a: "About £13.08 an hour on a 37.5-hour week." },
    ],
    link: HOME,
  },
  26500: {
    example:
      "NHS Band 3 (senior healthcare assistants, clinical support workers) pays £25,760 to £27,476, so £26,500 sits inside it. The NHS pension takes 6.5% at this pay, which lowers your take-home by about £115 a month, to £1,768.47. In return you build a defined-benefit pension most private jobs don't offer.",
    edge:
      "Child Benefit isn't affected at this salary. The High Income Child Benefit Charge only starts when your adjusted net income goes over £60,000.",
    faqs: [
      { q: "How much is £26,500 a month after tax?", a: "£1,883.30 a month." },
      { q: "How much is £26,500 a week after tax?", a: "£434.61 a week." },
    ],
    link: NHS,
  },
  27500: {
    example:
      "A £1,000 rise from £26,500 adds £60 a month to your take-home pay. That 72p-in-the-pound rule (20% tax plus 8% National Insurance) holds all the way to £50,270.",
    edge:
      "If you're paid weekly, you get 52 payslips a year, so four months have five paydays. Build your budget on £1,943.30 a month (the yearly figure divided by 12), not on a five-payday month.",
    faqs: [
      { q: "How much is £27,500 a month after tax?", a: "£1,943.30 a month." },
      { q: "What is £27,500 a year an hour?", a: "About £14.10 an hour on a 37.5-hour week." },
      { q: "Do I pay student loan on £27,500?", a: "Only on Plan 1 or Plan 5. Plan 1 starts at £26,900, so you repay £54 a year (£4.50 a month); Plan 5 starts at £25,000, so you repay £225 a year. Plan 2 starts at £29,385, so nothing." },
    ],
    link: HOME,
  },
  30500: {
    example:
      "NHS Band 5 starts at £32,073, so this is just below a newly qualified nurse's pay. A 5% pension contribution with tax relief lowers your take-home by about £102 a month. Check what the pension is worth before you opt out.",
    edge:
      "Plan 2 repayments start at £29,385, so at £30,500 you repay 9% of £1,115: £100.35 a year, about £8.36 a month. It's the first salary on this list where a Plan 2 deduction appears at all.",
    faqs: [
      { q: "How much is £30,500 a month after tax?", a: "£2,123.30 a month." },
      { q: "Do I pay student loan on £30,500?", a: "On Plan 1, Plan 2 and Plan 5, yes: about £27 a month on Plan 1, £8.36 on Plan 2 and £41.25 on Plan 5. Plan 4 (Scotland) starts at £33,795, so nothing." },
    ],
    link: NHS,
  },
  31500: {
    example:
      "A £1,000 rise from £30,500 adds £60 a month after tax and National Insurance. With a Plan 2 student loan another £7.50 a month goes in repayments, so you keep about £52.50.",
    edge:
      "Salary sacrifice saves you 28% at this pay (20% tax and 8% National Insurance) on every pound you sacrifice. Higher-rate taxpayers save 42%, and between £100,000 and £125,140 the saving is 62%.",
    faqs: [
      { q: "How much is £31,500 a month after tax?", a: "£2,183.30 a month." },
      { q: "What is £31,500 a year an hour?", a: "About £16.15 an hour on a 37.5-hour week." },
    ],
    link: SACRIFICE,
  },
  32500: {
    example:
      "NHS Band 5 starts at £32,073, close to this. On the NHS pension (8.3% at that pay) a newly qualified nurse takes home about £2,040 a month. The NHS calculator gives the exact figure for each band.",
    edge:
      "Scottish taxpayers pay the 21% intermediate rate on income above £29,526, but at £32,500 they still take home about £10 a year more than in England, because of Scotland's 19% starter rate. The two only cross at £33,494.",
    faqs: [
      { q: "How much is £32,500 a month after tax?", a: "£2,243.30 a month." },
      { q: "How much tax do I pay on £32,500?", a: "£3,986 Income Tax and £1,594.40 National Insurance a year." },
    ],
    link: NHS,
  },
  33500: {
    example:
      "This is just above the Scotland crossover of £33,494. Below it, Scottish taxpayers keep slightly more than the rest of the UK; above it, slightly less. At £33,500 the gap is 7p a year, but by £43,500 it is £100.",
    edge:
      "Your student loan plan matters more than the salary. On Plan 1 you repay about £49.50 a month, on Plan 2 about £30.86, and on Plan 4 (Scotland) nothing, because it starts at £33,795.",
    faqs: [
      { q: "How much is £33,500 a month after tax?", a: "£2,303.30 a month." },
      { q: "Is £33,500 a good salary?", a: "It's about 82% of the UK full-time median of £40,911 (ONS, April 2026). Pay is higher in London and the South East, so it goes less far there." },
    ],
    link: SCOTLAND,
  },
  34500: {
    example:
      "A £500 rise from £34,000 adds £30 a month. If your pension contribution goes up from 5% to 6% at the same time, that costs about £23 a month with tax relief, so you'd see only about £7 more. Always check the net figure, not the gross.",
    edge:
      "These figures use tax code 1257L. If your partner transfers Marriage Allowance to you, your code is 1383M and you take home £252 a year more. A K code means untaxed income is being collected through your pay, so you take home less. A wrong code is the most common reason a payslip doesn't match a calculator.",
    faqs: [
      { q: "How much is £34,500 a month after tax?", a: "£2,363.30 a month." },
      { q: "What is £34,500 a year an hour?", a: "About £17.69 an hour on a 37.5-hour week." },
    ],
    link: HOME,
  },
  35500: {
    example:
      "£35,000 takes home £28,719.60, so the extra £500 here adds £360 a year, or £30 a month. That 72p-in-the-pound rule is the simplest way to judge any rise at this level.",
    edge:
      "You're £14,770 below the £50,270 higher-rate threshold, so a bonus or overtime is taxed at 20% plus 8% National Insurance, not 40%. A £2,000 bonus is worth £1,440 to you. People often overestimate the tax on a one-off payment.",
    faqs: [
      { q: "How much is £35,500 a month after tax?", a: "£2,423.30 a month." },
      { q: "How much tax do I pay on £35,500?", a: "£4,586 Income Tax and £1,834.40 National Insurance a year." },
    ],
    link: HOME,
  },
  36500: {
    example:
      "This sits between NHS Band 5 intermediate (£34,592) and top (£39,043), and between teacher pay points M2 (£36,042) and M3 (£38,400) in England. A 5% pension contribution with tax relief lowers your take-home by about £122 a month.",
    edge:
      "In Scotland you'd pay the 21% intermediate rate here but stay below the 42% band, which starts at £43,663. Scottish take-home at £36,500 is only £30 a year lower than in England, so the difference hardly shows yet.",
    faqs: [
      { q: "How much is £36,500 a month after tax?", a: "£2,483.30 a month." },
      { q: "What is £36,500 a year an hour?", a: "About £18.72 an hour on a 37.5-hour week." },
    ],
    link: SCOTLAND,
  },
  38500: {
    example:
      "A £1,000 rise from £37,500 adds £60 a month. With a Plan 2 student loan you keep about £52.50 of it, because 9% of the rise goes to repayments.",
    edge:
      "Sacrifice £2,000 a year into your pension and your take-home falls by £120 a month, while £166.67 a month goes into the pension. The £46.67 difference is the tax and National Insurance you no longer pay.",
    faqs: [
      { q: "How much is £38,500 a month after tax?", a: "£2,603.30 a month." },
      { q: "How much tax do I pay on £38,500?", a: "£5,186 Income Tax and £2,074.40 National Insurance a year." },
    ],
    link: SACRIFICE,
  },
  39500: {
    example:
      "NHS Band 5 tops out at £39,043. At that pay the NHS pension rate is 9.8%, and take-home is about £2,381 a month. The higher pension rate is why a nurse at the top of Band 5 doesn't feel the whole rise.",
    edge:
      "If a pay rise is backdated, the arrears usually arrive in one payslip and that month's tax looks high. On a standard cumulative tax code PAYE evens it out over the year, so you don't overpay Income Tax overall.",
    faqs: [
      { q: "How much is £39,500 a month after tax?", a: "£2,663.30 a month." },
      { q: "What is £39,500 a year an hour?", a: "About £20.26 an hour on a 37.5-hour week." },
    ],
    link: NHS,
  },
  41500: {
    example:
      "A £2,000 rise from £39,500 adds £120 a month after tax and National Insurance. Sacrificing the same £2,000 into your pension would instead cost £120 a month of take-home and put £166.67 a month into the pension.",
    edge:
      "You're £8,770 below the £50,270 higher-rate threshold. Any bonus bigger than that is partly taxed at 40%, so check where a one-off payment takes you before you spend it.",
    faqs: [
      { q: "How much is £41,500 a month after tax?", a: "£2,783.30 a month." },
      { q: "How much tax do I pay on £41,500?", a: "£5,786 Income Tax and £2,314.40 National Insurance a year." },
    ],
    link: SACRIFICE,
  },
  43500: {
    example:
      "A teacher on M5 in England (£43,529) or an NHS Band 6 nurse past the intermediate point (£42,170) earns about this. On the NHS pension at 9.8%, take-home is about £2,619 a month.",
    edge:
      "In Scotland the 42% higher rate starts at £43,663, just £163 above this salary. Above that line each extra pound keeps only 50p after Scottish tax and National Insurance, compared with 72p in England.",
    faqs: [
      { q: "How much is £43,500 a month after tax?", a: "£2,903.30 a month." },
      { q: "What is £43,500 a year an hour?", a: "About £22.31 an hour on a 37.5-hour week." },
    ],
    link: SCOTLAND,
  },
  45500: {
    example:
      "A £1,000 rise here adds £60 a month, the same as at £25,000, because your marginal rate doesn't change until £50,270. The rise only feels smaller because the numbers are bigger.",
    edge:
      "A 5% pension is £2,275 a year (£189.58 a month). Through salary sacrifice it saves you £455 Income Tax and £182 National Insurance, so your take-home falls by £136.50 a month. Through a net pay scheme you save only the tax, and take-home falls by about £151.67.",
    faqs: [
      { q: "How much is £45,500 a month after tax?", a: "£3,023.30 a month." },
      { q: "How much tax do I pay on £45,500?", a: "£6,586 Income Tax and £2,634.40 National Insurance a year." },
    ],
    link: SACRIFICE,
  },
  47500: {
    example:
      "You're £2,770 below the higher-rate threshold. A £3,000 bonus is split: the first £2,770 is taxed at 20% plus 8% National Insurance and the last £230 at 40% plus 2%, so you keep £2,127.80 of it.",
    edge:
      "If a pay rise or bonus would take you over £50,270, you lose 42% of the part above the threshold to tax and National Insurance. Sacrificing that part into your pension means none of it is taxed at 40%.",
    faqs: [
      { q: "How much is £47,500 a month after tax?", a: "£3,143.30 a month." },
      { q: "What is £47,500 a year an hour?", a: "About £24.36 an hour on a 37.5-hour week." },
    ],
    link: SACRIFICE,
  },
  52500: {
    example:
      "This salary is £2,230 above the £50,270 higher-rate threshold. That £2,230 is taxed at 40% Income Tax and 2% National Insurance, so your marginal rate jumps from 28% to 42% at exactly £50,270.",
    edge:
      "A £1,000 rise from £52,500 adds only £48.33 a month, against £60 a month for a rise below £50,270. That surprises people most: the first £1,000 above the threshold is worth less than the last £1,000 below it.",
    faqs: [
      { q: "How much is £52,500 a month after tax?", a: "£3,417.28 a month." },
      { q: "How much tax do I pay on £52,500?", a: "£8,432 Income Tax and £3,060.60 National Insurance a year." },
      { q: "When do I pay 40% tax?", a: "On income above £50,270 in England, Wales and Northern Ireland. In Scotland the 42% higher rate starts at £43,663." },
    ],
    link: SACRIFICE,
  },
};

export const HOURLY_COPY: Record<number, PageCopy> = {
  13.5: {
    example:
      "On a 40-hour week £13.50 an hour is £28,080 a year and about £1,978 a month after tax. The extra 2.5 hours a week add about £105 a month to your take-home pay.",
    edge:
      "£13.50 is above the National Living Wage (£12.71), but below the voluntary real Living Wage, which rises to £14.10 an hour (£15.45 in London) under the rates the Living Wage Foundation announced in October 2026. Employers signed up to it have until 1 May 2027 to pay the new rate.",
    faqs: [
      { q: "How much is £13.50 an hour a year?", a: "£26,325 a year on a 37.5-hour week, or £28,080 on a 40-hour week, before tax." },
      { q: "How much is £13.50 an hour a month after tax?", a: "£1,872.80 a month on 37.5 hours a week." },
      { q: "How much is £13.50 an hour a week after tax?", a: "£432.18 a week after tax on 37.5 hours (£506.25 gross)." },
    ],
    link: { href: "/minimum-wage-calculator", label: "Minimum wage calculator" },
  },
  14.5: {
    example:
      "On a 40-hour week £14.50 an hour is £30,160 a year, about £2,103 a month after tax. That's above the £29,385 Plan 2 threshold, so a Plan 2 graduate starts repaying about £6 a month at 40 hours.",
    edge:
      "A 50p rise to £15 an hour adds £58.50 a month after tax and National Insurance on a 37.5-hour week, or £702 a year. Small on one payslip, but worth asking for.",
    faqs: [
      { q: "How much is £14.50 an hour a year UK?", a: "£28,275 a year before tax on a 37.5-hour week, or £30,160 on a 40-hour week." },
      { q: "How much is £14.50 an hour a month after tax?", a: "£1,989.80 a month on 37.5 hours a week." },
      { q: "How much is £14.50 an hour a week after tax?", a: "£459.18 a week after tax on 37.5 hours (£543.75 gross)." },
    ],
    link: HOURLY,
  },
  16.5: {
    example:
      "On a 40-hour week £16.50 an hour is £34,320 a year, about £2,353 a month after tax. The extra 2.5 hours a week add about £129 a month.",
    edge:
      "The same hourly rate gives a different payslip depending on your student loan: about £21 a month on Plan 2, £40 on Plan 1 and £54 on Plan 5, on a 37.5-hour week.",
    faqs: [
      { q: "How much is £16.50 an hour a year?", a: "£32,175 a year before tax on a 37.5-hour week, or £34,320 on a 40-hour week." },
      { q: "How much is £16.50 an hour a month after tax?", a: "£2,223.80 a month on 37.5 hours a week." },
      { q: "How much is £16.50 an hour a week after tax?", a: "£513.18 a week after tax on 37.5 hours (£618.75 gross)." },
    ],
    link: NHS,
  },
  17.5: {
    example:
      "On a 40-hour week £17.50 an hour is £36,400 a year, about £2,477 a month after tax. A £1 rise from £16.50 to £17.50 is worth about £117 a month on 37.5 hours.",
    edge:
      "On a fixed 37.5-hour contract, holidays and bank holidays are paid at your normal rate, so the yearly figure holds in months with time off. On a zero-hours contract no hours are guaranteed, so there's no guaranteed yearly figure, and holiday builds up as you work.",
    faqs: [
      { q: "How much is £17.50 an hour a year?", a: "£34,125 a year before tax on a 37.5-hour week, or £36,400 on a 40-hour week." },
      { q: "How much is £17.50 an hour a month after tax?", a: "£2,340.80 a month on 37.5 hours a week." },
      { q: "How much is £17.50 an hour a week after tax?", a: "£540.18 a week after tax on 37.5 hours (£656.25 gross)." },
    ],
    link: { href: "/pro-rata-holiday-calculator", label: "Holiday entitlement calculator" },
  },
  18.5: {
    example:
      "On a 40-hour week £18.50 an hour is £38,480 a year, about £2,602 a month after tax. Each extra hour of overtime at the same rate adds £13.32 after tax and National Insurance.",
    edge:
      "A 5% pension takes £150.31 a month from your gross pay, but with tax relief your take-home falls by only about £120 a month. The other £30 is Income Tax you no longer pay.",
    faqs: [
      { q: "How much is £18.50 an hour a year?", a: "£36,075 a year before tax on a 37.5-hour week, or £38,480 on a 40-hour week." },
      { q: "How much is £18.50 an hour a month after tax?", a: "£2,457.80 a month on 37.5 hours a week." },
      { q: "How much is £18.50 an hour a week after tax?", a: "£567.18 a week after tax on 37.5 hours (£693.75 gross)." },
    ],
    link: { href: "/pension-calculator", label: "Pension calculator" },
  },
  27.5: {
    example:
      "On a 40-hour week £27.50 an hour is £57,200 a year, about £3,644 a month after tax. The extra 2.5 hours a week add about £173 a month, less per hour than your first hours because they're taxed at 42%.",
    edge:
      "£3,355 of your full-time pay falls in the 40% band. Sacrifice that much into your pension and you save 42% on it, about £117 a month, and drop back below £50,270.",
    faqs: [
      { q: "How much is £27.50 an hour a year?", a: "£53,625 a year before tax on a 37.5-hour week, or £57,200 on a 40-hour week." },
      { q: "How much is £27.50 an hour a month after tax?", a: "£3,471.66 a month on 37.5 hours a week." },
      { q: "How much is £27.50 an hour a week after tax?", a: "£801.15 a week after tax on 37.5 hours (£1,031.25 gross)." },
    ],
    link: SACRIFICE,
  },
};

export const getSalaryCopy = (salary: number) => SALARY_COPY[salary];
export const getHourlyCopy = (rate: number) => HOURLY_COPY[Math.round(rate * 100) / 100];
