// Hand-written sections for the 20 most visited salary pages (added v13, 14-19 Nov 2026).
// The figures in `text` were checked against lib/tax.ts, lib/nhs.ts and lib/teachers.ts for 2026/27.
// tests/salaryInsights.test.ts re-checks them: when rates change each April, it fails until the text is updated.
// The two FAQs on these pages ("extra £1,000" and "employer cost") are worked out from calculate(), not stored here.
export interface SalaryInsight {
  salary: number;
  heading: string;
  text: string;
  links: { href: string; label: string }[];
}

export const SALARY_INSIGHTS: SalaryInsight[] = [
  {
    "salary": 40000,
    "heading": "Is £40,000 a good salary in 2026?",
    "text": "£40,000 is just below the median full-time UK salary (£40,911, ONS, April 2026), so a little over half of full-time employees earn more. It is the salary of an entry-level NHS Band 6 (£39,959) specialist nurse, or a teacher on M4 (£40,941). On £40k you are still £10,270 below the 40% tax band. A Plan 2 graduate repays about £955 a year, roughly £80 a month.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-6",
        "label": "NHS Band 6 pay"
      },
      {
        "href": "/teacher-take-home-pay-calculator",
        "label": "Teacher take-home pay"
      }
    ]
  },
  {
    "salary": 50000,
    "heading": "£50,000: right at the higher-rate threshold",
    "text": "At £50,000 you are £270 below the £50,270 higher-rate threshold. Any pay rise above that is taxed at 40% plus 2% NI, so you keep just 58p in the pound. A £5,000 rise to £55,000 adds only £2,938 a year to your take-home pay. Paying into a salary sacrifice pension keeps more of your income in the basic-rate band. £50,000 is around the NHS Band 6 top / Band 7 entry and teacher U1–U2 pay points. Scottish taxpayers take home £1,496 a year less.",
    "links": [
      {
        "href": "/salary-sacrifice-calculator",
        "label": "Salary sacrifice calculator"
      },
      {
        "href": "/nhs-pay-bands/band-7",
        "label": "NHS Band 7 pay"
      }
    ]
  },
  {
    "salary": 35000,
    "heading": "What a £35,000 salary means in practice",
    "text": "£35,000 is about 86% of the median full-time salary (£40,911, ONS, April 2026), and around 1.4 times full-time minimum wage pay. It falls between NHS Band 5 mid-point (£34,592) and teacher M2 (£36,042). Many lenders cap mortgages at around 4–4.5 times income, which puts a sole-applicant mortgage at roughly £140,000–£157,500. A Plan 2 graduate repays about £505 a year at this salary.",
    "links": [
      {
        "href": "/mortgage-calculator",
        "label": "How much can I borrow?"
      },
      {
        "href": "/nhs-pay-bands/band-5",
        "label": "NHS Band 5 pay"
      }
    ]
  },
  {
    "salary": 30000,
    "heading": "The £30,000 student loan tipping point",
    "text": "£30,000 is just over the Plan 2 student loan threshold, so a graduate on this salary repays only about £55 a year (£4.61 a month). Plan 5 (for courses starting from August 2023) has a lower threshold, so repayments are higher. See the table above. Each extra £1,000 of salary adds £60 a month to your take-home pay, or £52.50 if you repay Plan 2. That is because tax, NI and the 9% loan repayment take 37p in every pound.",
    "links": [
      {
        "href": "/guides/student-loan-repayments",
        "label": "Student loan repayments explained"
      }
    ]
  },
  {
    "salary": 45000,
    "heading": "The Scotland gap opens at £45,000",
    "text": "£45,000 is where Scottish taxpayers start to pay noticeably more. A Scottish taxpayer on £45k takes home £396 a year less than someone in England, Wales or Northern Ireland, up from about £85 at £42,000. This is because Scotland's 42% higher rate starts well below the rest of the UK's £50,270. Elsewhere in the UK you are £5,270 below the 40% band and still keep 72p of each extra pound.",
    "links": [
      {
        "href": "/scotland-salary-calculator",
        "label": "Scotland salary calculator"
      }
    ]
  },
  {
    "salary": 60000,
    "heading": "£60,000 and the Child Benefit charge",
    "text": "£60,000 is the point where the High Income Child Benefit Charge begins. If you or your partner claim Child Benefit, every £200 earned above £60,000 claws back 1% of it, until it is all repaid at £80,000. A pension contribution that lowers your adjusted net income to £60,000 or below avoids the charge entirely. £60,000 is close to NHS Band 8a mid-point (£60,417). Your marginal rate is 42% on tax and NI alone.",
    "links": [
      {
        "href": "/child-benefit-calculator",
        "label": "Child Benefit charge calculator"
      },
      {
        "href": "/nhs-pay-bands/band-8a",
        "label": "NHS Band 8a pay"
      }
    ]
  },
  {
    "salary": 32000,
    "heading": "£32,000 and the NHS Band 5 starting salary",
    "text": "A newly qualified NHS nurse, midwife or paramedic starts on Band 5 at £32,073, almost exactly this salary. Their take-home is lower than the figure above (about £2,040 a month) because the NHS pension takes a tiered contribution. On £32,000, the 5% salary sacrifice example only lowers your take-home by £1,152 a year while putting £1,600 into your pension.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-5",
        "label": "NHS Band 5 pay"
      },
      {
        "href": "/nhs-take-home-pay-calculator",
        "label": "NHS take-home pay calculator"
      }
    ]
  },
  {
    "salary": 38000,
    "heading": "£38,000: close to NHS Band 5 top",
    "text": "£38,000 is just below NHS Band 5 top (£39,043), the highest pay point for an experienced staff nurse. It is also near teacher M3 (£38,400). You keep 72p of every extra pound until £50,270, so moving up a pay point is still taxed lightly. Scottish taxpayers pay £45 a year more than the rest of the UK at this salary.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-5",
        "label": "NHS Band 5 pay"
      },
      {
        "href": "/teacher-take-home-pay-calculator",
        "label": "Teacher take-home pay"
      }
    ]
  },
  {
    "salary": 25000,
    "heading": "£25,000 vs the National Living Wage",
    "text": "£25,000 is only about £215 a year above full-time minimum wage pay (£24,785 in 2026/27). That equals £12.82 an hour on a 37.5-hour week. It is close to the NHS Band 2 salary of £25,272 and Band 3 entry at £25,760. On these figures, a full-time NHS healthcare assistant takes home a similar amount, before the NHS pension contribution. Your pay is still below the Plan 2 student loan threshold, so you repay nothing.",
    "links": [
      {
        "href": "/minimum-wage-calculator",
        "label": "Minimum wage calculator"
      },
      {
        "href": "/nhs-pay-bands/band-2",
        "label": "NHS Band 2 pay"
      }
    ]
  },
  {
    "salary": 55000,
    "heading": "£55,000: the first year in the 40% band",
    "text": "On £55,000, £4,730 of your salary is taxed at 40%, so your marginal rate is 42%. Each extra £1,000 of salary adds only £48 a month to your take-home pay. Salary sacrifice becomes better value here: the 5% example puts £2,750 into your pension and costs you only £1,595 in take-home pay. £55k is near NHS Band 7 top (£56,515). Scottish taxpayers take home £1,650 a year less.",
    "links": [
      {
        "href": "/salary-sacrifice-calculator",
        "label": "Salary sacrifice calculator"
      },
      {
        "href": "/nhs-pay-bands/band-7",
        "label": "NHS Band 7 pay"
      }
    ]
  },
  {
    "salary": 36000,
    "heading": "£36,000 and the M2 teacher salary",
    "text": "£36,000 is just below teacher M2 (£36,042), the salary in a teacher's second year in England outside London. Each £1,000 of extra pay still adds £720 a year (£60 a month) to your take-home pay. You are £14,270 below the higher-rate threshold, so a pay rise is taxed at the basic rate. A Plan 2 graduate repays about £595 a year here.",
    "links": [
      {
        "href": "/teacher-take-home-pay-calculator",
        "label": "Teacher take-home pay"
      }
    ]
  },
  {
    "salary": 42000,
    "heading": "£42,000 and NHS Band 6",
    "text": "£42,000 almost exactly matches the NHS Band 6 intermediate point (£42,170). Band 6 covers senior staff nurses, specialist physiotherapists and experienced paramedics. You are now within £8,270 of the higher-rate threshold. If you expect pay rises that will take you over £50,270, salary sacrifice pension contributions are the main way to keep income in the 20% band.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-6",
        "label": "NHS Band 6 pay"
      },
      {
        "href": "/salary-sacrifice-calculator",
        "label": "Salary sacrifice calculator"
      }
    ]
  },
  {
    "salary": 70000,
    "heading": "£70,000: tax planning starts to pay",
    "text": "On £70,000, £19,730 of your salary is in the 40% band. A salary sacrifice pension contribution saves 42p in every pound you put in. If you claim Child Benefit for two children, half of it (£1,191 a year) is clawed back at this income. With two children, your effective rate on income between £60,000 and £80,000 is about 54%. £70,000 matches NHS Band 8b mid-point (£70,896). A Scottish taxpayer takes home £1,950 a year less.",
    "links": [
      {
        "href": "/child-benefit-calculator",
        "label": "Child Benefit charge calculator"
      },
      {
        "href": "/nhs-pay-bands/band-8b",
        "label": "NHS Band 8b pay"
      }
    ]
  },
  {
    "salary": 33000,
    "heading": "£33,000: Band 5 nurse or newly qualified teacher",
    "text": "£33,000 is close to two common graduate public-sector starting salaries: NHS Band 5 entry (£32,073) and teacher M1 outside London (£34,069 from September 2026). Both pension schemes take a contribution, so actual take-home in those jobs is lower than shown here: about £104 a month lower for a teacher on M1 (Teachers' Pension at 7.4%) and £233 a month lower at NHS Band 5 entry (NHS Pension at 8.3%). Scottish taxpayers on £33,000 take home almost exactly the same as the rest of the UK, just £4.93 a year more.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-5",
        "label": "NHS Band 5 pay"
      },
      {
        "href": "/teacher-take-home-pay-calculator",
        "label": "Teacher take-home pay"
      }
    ]
  },
  {
    "salary": 22000,
    "heading": "Is £22,000 enough to live on?",
    "text": "£22,000 is now below full-time National Living Wage pay. At £12.71 an hour, 37.5 hours a week comes to £24,785 a year, so a £22k full-time salary works out at about £11.28 an hour. If you are 21 or over and full-time on £22,000, check your contract hours: you may be underpaid. The salary is common for part-time roles, under-21s and apprentices. You are well below the Plan 2 and Plan 5 student loan thresholds, so no loan repayments are taken.",
    "links": [
      {
        "href": "/minimum-wage-calculator",
        "label": "Minimum wage calculator"
      }
    ]
  },
  {
    "salary": 37000,
    "heading": "£37,000 compared with the UK median",
    "text": "£37,000 is about 90% of the median full-time UK salary (£40,911). It sits between teacher points M2 and M3. If you are offered £37k, compare the employer's total cost too: they pay about £4,800 in employer National Insurance on top, so the job costs them £41,800 a year. That is worth knowing in salary negotiations.",
    "links": [
      {
        "href": "/compare-salaries",
        "label": "Compare two job offers"
      }
    ]
  },
  {
    "salary": 34000,
    "heading": "£34,000 and a teacher's starting salary",
    "text": "A newly qualified teacher in England outside London starts on M1 at £34,069, so this page is effectively a new teacher's salary. After the 7.4% Teachers' Pension contribution, an M1 teacher takes home about £2,169 a month, versus £2,333 here with no pension. At £34,000 a Scottish taxpayer takes home just £5 a year less than the rest of the UK. Scotland's lower starter rate offsets its higher intermediate rate at this level.",
    "links": [
      {
        "href": "/teacher-take-home-pay-calculator",
        "label": "Teacher take-home pay"
      },
      {
        "href": "/scotland-salary-calculator",
        "label": "Scotland salary calculator"
      }
    ]
  },
  {
    "salary": 28000,
    "heading": "Where £28,000 sits in NHS and public-sector pay",
    "text": "£28,000 sits between NHS Band 3 top (£27,476) and Band 4 entry (£28,392), the pay band for senior healthcare assistants and assistant practitioners. It is about 68% of the median full-time UK salary. You are still under the Plan 2 student loan threshold (about £29,385), so Plan 2 graduates on £28k repay nothing (Plan 5, with its £25,000 threshold, takes about £270 a year). Repayments start once your pay rises another £1,385.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-4",
        "label": "NHS Band 4 pay"
      },
      {
        "href": "/guides/student-loan-repayments",
        "label": "Student loan repayments explained"
      }
    ]
  },
  {
    "salary": 65000,
    "heading": "£65,000 with children: the hidden 50%+ tax rate",
    "text": "Between £60,000 and £80,000, parents claiming Child Benefit face a much higher effective marginal rate than the 42% shown above. On £65,000 with two children, the High Income Child Benefit Charge takes back about 25% of the £2,382 a year Child Benefit, roughly £596. Paying £5,000 into a pension through salary sacrifice would remove that charge and cut your tax bill. £65,000 is around NHS Band 8a top / 8b entry.",
    "links": [
      {
        "href": "/child-benefit-calculator",
        "label": "Child Benefit charge calculator"
      },
      {
        "href": "/salary-sacrifice-calculator",
        "label": "Salary sacrifice calculator"
      }
    ]
  },
  {
    "salary": 100000,
    "heading": "The £100,000 tax trap (60% income tax)",
    "text": "From £100,000, you lose £1 of your £12,570 Personal Allowance for every £2 you earn above it. By £125,140 it is gone. Income between £100,000 and £125,140 is taxed at an effective 60% (62% with NI), the highest marginal rate in the UK system. At exactly £100,000 your marginal rate is already 62%. Each £1,000 rise adds only about £32 a month to your take-home pay. Salary sacrifice that brings your adjusted net income back to £100,000 recovers the allowance. It also protects tax-free childcare (lost above £100,000). Scottish taxpayers take home £3,300 a year less.",
    "links": [
      {
        "href": "/salary-sacrifice-calculator",
        "label": "Salary sacrifice calculator"
      },
      {
        "href": "/guides/uk-tax-bands-2026-27",
        "label": "UK tax bands 2026/27"
      }
    ]
  }
];

export const getSalaryInsight = (salary: number) => SALARY_INSIGHTS.find((i) => i.salary === salary);
