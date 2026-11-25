// Hand-written sections for the 20 most visited hourly pages (added v16, 19 Nov 2026), from Sharjeel's
// uksalarytools-top20-hourly-content.csv. Figures checked against lib/tax.ts, lib/nhs.ts and lib/minimumWage.ts.
// tests/hourlyInsights.test.ts re-checks them each April. The two FAQs on these pages are worked out in
// app/hourly/[slug]/page.tsx, not stored here.
export interface HourlyInsight {
  rate: number;
  heading: string;
  text: string;
  links: { href: string; label: string }[];
}

export const HOURLY_INSIGHTS: HourlyInsight[] = [
  {
    "rate": 16.5,
    "heading": "£16.50 an hour: a newly qualified nurse's rate",
    "text": "£16.50 is almost exactly NHS Band 5 entry (£16.45 an hour), the starting rate for newly qualified nurses, midwives and paramedics. On the NHS pension, a Band 5 starter takes home about £2,040 a month rather than the £2,224 shown above. Full-time, £16.50 is 30% above the National Living Wage, and a Plan 2 graduate repays about £251 a year.",
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
    "rate": 14.5,
    "heading": "£14.50 an hour and NHS Band 4",
    "text": "£14.50 is almost exactly NHS Band 4 entry (£14.56), the band for assistant practitioners and senior admin roles. It's 14% above the National Living Wage. Full-time, £28,275 is still under the Plan 2 threshold (£29,385). Plan 2 graduates repay nothing; Plan 5 graduates repay about £295 a year. A £1 an hour rise adds about £117 a month to your take-home pay.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-4",
        "label": "NHS Band 4 pay"
      },
      {
        "href": "/guides/student-loan-repayments",
        "label": "Student loan repayments"
      }
    ]
  },
  {
    "rate": 17.5,
    "heading": "£17.50 an hour: mid-point of NHS Band 5",
    "text": "£17.50 is close to the NHS Band 5 intermediate point (£17.74). The full-time salary, £34,125, is also almost the same as a newly qualified teacher on M1 in England (£34,069). You're £16,145 below the higher-rate threshold, so overtime is taxed at the basic rate: you keep 72p of every extra pound.",
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
    "rate": 13.5,
    "heading": "£13.50 an hour: NHS Band 3 territory",
    "text": "£13.50 sits between NHS Band 3 entry (£13.21) and Band 3 top (£14.09), the band for senior healthcare assistants. It's 79p above the National Living Wage and still 29p above the April 2027 rate. Full-time, £26,325 a year is above the Plan 5 student loan threshold, so a graduate who started in 2023 or later repays about £119 a year (£10 a month).",
    "links": [
      {
        "href": "/nhs-pay-bands/band-3",
        "label": "NHS Band 3 pay"
      },
      {
        "href": "/minimum-wage-calculator",
        "label": "Minimum wage calculator"
      }
    ]
  },
  {
    "rate": 10.85,
    "heading": "£10.85 an hour: the 18–20 minimum wage",
    "text": "£10.85 is the legal minimum for 18 to 20 year olds from 1 April 2026. It rises to £11.27 in April 2027. If you're 21 or over, you're entitled to £12.71, so on £10.85 you'd be underpaid by £1.86 an hour, or about £3,627 a year full-time. Full-time on £10.85 is £21,158 a year, well below every undergraduate student loan threshold, so nothing is deducted for a loan.",
    "links": [
      {
        "href": "/minimum-wage-calculator",
        "label": "Minimum wage calculator"
      }
    ]
  },
  {
    "rate": 27.5,
    "heading": "£27.50 an hour: how much overtime really pays",
    "text": "Full-time, £27.50 an hour is £53,625, which is £3,355 into the higher-rate band. Every overtime hour now earns you about £15.95 after tax and NI, or 58% of the gross rate. If you claim Child Benefit, the charge starts at £60,000. That's about 232 hours of overtime a year at this rate.",
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
    "rate": 18.5,
    "heading": "What £18.50 an hour means in practice",
    "text": "Full-time, £18.50 an hour is £36,075, about 88% of the median full-time UK salary (£40,911). It's 46% above the National Living Wage. On a 16-hour week you'd take home about £1,217 a month, and on 20 hours about £1,448. A Plan 2 graduate on full-time hours repays about £602 a year.",
    "links": [
      {
        "href": "/pro-rata-salary-calculator",
        "label": "Pro rata calculator"
      }
    ]
  },
  {
    "rate": 21.5,
    "heading": "£21.50 an hour and NHS Band 6",
    "text": "£21.50 matches the NHS Band 6 intermediate point (£21.63), the band for senior staff nurses and specialist physios. Full-time, £41,925 is about 2% above the median salary. You're £8,345 below the 40% band, which is around 388 hours of overtime a year before higher-rate tax applies.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-6",
        "label": "NHS Band 6 pay"
      }
    ]
  },
  {
    "rate": 28.0,
    "heading": "£28 an hour: NHS Band 7 and higher-rate tax",
    "text": "£28 is close to NHS Band 7 top (£28.98), the band for advanced practitioners and ward managers. Full-time, £54,600 means £4,330 of your pay is taxed at 40%. A £1 an hour rise adds about £94 a month after tax, compared with £117 for someone below £50,270. Salary sacrifice pension contributions save 42p in tax and NI for every pound you put in.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-7",
        "label": "NHS Band 7 pay"
      },
      {
        "href": "/salary-sacrifice-calculator",
        "label": "Salary sacrifice calculator"
      }
    ]
  },
  {
    "rate": 19.5,
    "heading": "£19.50 an hour: approaching NHS Band 5 top",
    "text": "£19.50 is just under NHS Band 5 top (£20.02), the highest point for an experienced staff nurse. Full-time it's £38,025 a year. You're £12,245 below the 40% tax band, so overtime of up to about 628 hours a year (around 12 hours a week) is still taxed at the basic rate.",
    "links": [
      {
        "href": "/nhs-pay-bands/band-5",
        "label": "NHS Band 5 pay"
      }
    ]
  },
  {
    "rate": 24.5,
    "heading": "£24.50 an hour: overtime starts to cost more",
    "text": "Full-time, £24.50 is £47,775, just £2,495 below the £50,270 higher-rate threshold. That's only about 102 hours of overtime a year. Beyond it, you keep 58p of each extra pound rather than 72p. £24.50 is also close to NHS Band 6 top (£24.68). Paying into a salary sacrifice pension keeps more of your pay in the basic-rate band.",
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
    "rate": 27.0,
    "heading": "£27 an hour: your first year in the 40% band",
    "text": "Full-time, £27 an hour is £52,650, so £2,380 of your pay is taxed at 40%, plus 2% NI. Each extra hour of overtime earns you about £15.66 after tax, not £27. A Scottish taxpayer on this rate is already deep in the 42% band. The full-time salary sits between NHS Band 7 entry and intermediate (£25.33–£26.63 an hour).",
    "links": [
      {
        "href": "/nhs-pay-bands/band-7",
        "label": "NHS Band 7 pay"
      },
      {
        "href": "/scotland-salary-calculator",
        "label": "Scotland salary calculator"
      }
    ]
  },
  {
    "rate": 22.0,
    "heading": "£22 an hour: just under Scotland's 42% band",
    "text": "Full-time, £22 an hour is £42,900. In Scotland, the 42% higher rate starts at £43,663, so a Scottish taxpayer on £22 is only £763 (about 35 hours of overtime) away from it. Elsewhere in the UK, the 40% band doesn't start until £50,270. That's why the Scotland gap grows quickly from around this rate.",
    "links": [
      {
        "href": "/scotland-salary-calculator",
        "label": "Scotland salary calculator"
      }
    ]
  },
  {
    "rate": 15.0,
    "heading": "£15 an hour: just under the Plan 2 threshold",
    "text": "Full-time, £15 an hour is £29,250, just £135 below the Plan 2 student loan threshold. So Plan 2 graduates repay nothing, but almost any pay rise or overtime will start repayments. Plan 5 graduates already repay about £383 a year. £15 is 18% above the National Living Wage and a common rate for skilled care, warehouse supervisors and entry-level trades.",
    "links": [
      {
        "href": "/guides/student-loan-repayments",
        "label": "Student loan repayments"
      }
    ]
  },
  {
    "rate": 12.5,
    "heading": "£12.50 an hour is below the 2026 minimum wage for over-21s",
    "text": "Since 1 April 2026, workers aged 21 and over must be paid at least £12.71 an hour. On £12.50 you'd be 21p an hour short: about £410 a year full-time, or about £175 a year on 16 hours a week. If you're 18–20, £12.50 is comfortably above your £10.85 minimum. Check your age band and use the minimum wage calculator if you think you're underpaid.",
    "links": [
      {
        "href": "/minimum-wage-calculator",
        "label": "Minimum wage calculator"
      }
    ]
  },
  {
    "rate": 25.0,
    "heading": "£25 an hour and the 40% tax band",
    "text": "At £25 an hour, a 37.5-hour week is £48,750 a year: £1,520 below the 40% band. Just 61 hours of overtime a year (about 1.2 hours a week) pushes you into higher-rate tax. On 40 hours a week (£52,000) you're already over it. If you regularly work extra hours, a salary sacrifice pension can keep that income at 20% tax.",
    "links": [
      {
        "href": "/salary-sacrifice-calculator",
        "label": "Salary sacrifice calculator"
      }
    ]
  },
  {
    "rate": 15.5,
    "heading": "£15.50 an hour and student loan repayments",
    "text": "Full-time, £15.50 an hour is £30,225, just over the Plan 2 threshold. Plan 2 graduates repay only about £76 a year, while Plan 5 graduates repay about £470. You're close to NHS Band 4 top (£15.98). Each extra £1 an hour adds about £117 a month after tax and NI, or about £102 if you're repaying a Plan 2 loan.",
    "links": [
      {
        "href": "/guides/student-loan-repayments",
        "label": "Student loan repayments"
      },
      {
        "href": "/nhs-pay-bands/band-4",
        "label": "NHS Band 4 pay"
      }
    ]
  },
  {
    "rate": 20.0,
    "heading": "£20 an hour is almost exactly the UK median salary",
    "text": "Full-time, £20 an hour is £39,000 a year, £1,911 below the median full-time UK salary (£40,911, ONS, April 2026), so a little over half of full-time employees earn more. It's close to NHS Band 5 top (£20.02). On a 4-day, 30-hour week, £20 an hour comes to about £31,200 a year.",
    "links": [
      {
        "href": "/salary/39000-after-tax",
        "label": "£39,000 after tax"
      },
      {
        "href": "/nhs-pay-bands/band-5",
        "label": "NHS Band 5 pay"
      }
    ]
  },
  {
    "rate": 13.0,
    "heading": "£13 an hour vs the minimum wage",
    "text": "£13 is 29p above the 2026 National Living Wage (£12.71), but 21p below the £13.21 rate due in April 2027. Unless your employer raises it, a £13 job will become a minimum-wage job next April. It's very close to the NHS Band 2 hourly rate (£12.96). Full-time it's £25,350 a year, just over the Plan 5 threshold, so a recent graduate repays about £32 a year.",
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
    "rate": 12.71,
    "heading": "£12.71 is the National Living Wage, and it rises in April 2027",
    "text": "£12.71 is the National Living Wage for 21+ from 1 April 2026. The announced April 2027 rate is £13.21, a 50p rise. Full-time, that adds £975 a year before tax and about £702 after tax and NI, or £58.50 a month. On a 16-hour week the rise is worth about £416 a year before tax. Full-time minimum wage pay of £24,785 is just under the Plan 5 student loan threshold (£25,000), so you won't repay anything yet.",
    "links": [
      {
        "href": "/minimum-wage-calculator",
        "label": "Minimum wage calculator"
      }
    ]
  }
];

export const getHourlyInsight = (rate: number) => HOURLY_INSIGHTS.find((i) => Math.abs(i.rate - rate) < 0.001);
