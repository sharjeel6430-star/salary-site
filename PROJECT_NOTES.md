# UK Salary Calculator (iSkills project) — uksalarytools.co.uk

- Niche assigned by iSkills: UK salary calculator.
- **LIVE at https://www.uksalarytools.co.uk** (built 2026-10-21). Brand: "UK Salary Tools". Run by "Sharjeel, an independent publisher" (first name only on the site, by choice).
- **Setup complete (2026-10-21):**
  - Domain at Cloudflare Registrar; hosting on Cloudflare Pages, project "uksalarycalculator" (uksalarycalculator-be7.pages.dev), deployed by direct upload of uksalarytools-upload.zip.
  - Custom domains: apex and www both Active with SSL. A 301 redirect rule sends root to www (verified).
  - Google Search Console: URL-prefix property https://www.uksalarytools.co.uk/ verified. sitemap.xml submitted. By 2026-10-23 the home page, the corporation tax, dividend, net-to-gross and holiday calculators, and About were indexed.
  - Cloudflare Email Routing: hello@uksalarytools.co.uk forwards to sharjeel.6430@gmail.com.
  - Cloudflare Web Analytics is enabled.
  - AdSense: pub-9421649089099149, site ownership verified, ads.txt live, consent via Google's Privacy & messaging CMP. Plan: request review around mid-November 2026, once ~30+ pages are indexed.
- Code: Next.js 15 static export at C:\Users\sharj\Documents\uk-salary-calculator. **303 pages, 28 tests** (as of 2026-11-07 v5).
  - To update the site, rebuild and upload a new zip via Workers & Pages → uksalarycalculator → Create deployment.
  - The old app/opengraph-image.tsx still exists on the PC and must be deleted before rebuilding there.
- Theme: Union Flag navy #012169 and red #C8102E, flag ribbon, serif headings. Not a GOV.UK look-alike.
- Rates live in lib/tax.ts, lib/nhs.ts, lib/teachers.ts, lib/business.ts, lib/holiday.ts and lib/site.ts.
- lib/sources.ts holds the sources list (each with an id) and LAST_REVIEWED. lib/tools.ts lists every tool. lib/pageInfo.ts maps each URL to its sources and related tools.
- components/PageFooterInfo.tsx is rendered in the layout under every page. It shows the related calculators, "Last updated" and the page's sources. It is hidden on about, contact, privacy, terms and calculators.

## Pages added 2026-10-21 (v2)
- /corporation-tax-calculator (19% / 25% with marginal relief, associated companies, short periods)
- /dividend-tax-calculator (2026/27: £500 allowance, 10.75% / 35.75% / 39.35%)
- /pro-rata-holiday-calculator (5.6 weeks capped at 28 days, company allowance, part-year, 12.07% irregular hours)
- /teacher-take-home-pay-calculator (England M1–U3, 4 pay areas, 3.5% award, TPS tiers)
- /net-to-gross-salary-calculator plus /take-home and 22 pages /take-home/{1500…10000}-a-month
- /calculators (all tools), /contact, and a rewritten /about (who runs it, sources, update policy, corrections)

## v3, 2026-10-23 (Priority 1 work before the AdSense review)
- Added /terms (Terms of Use and Disclaimer); it is linked from the footer and listed in the sitemap.
- Every calculator and content page now has a sources and "Last updated" box and a related calculators block.

## v5, 2026-11-07 (competitor work vs thesalarycalculator.co.uk)
- Added /compare-salaries, a tool comparing two job offers, with pay rise and Scotland vs England tables and 7 FAQs. It is in the nav.
- Added a tax year selector (2026/27 or 2025/26) to the main calculator, which shows the monthly difference. TAX_YEAR_2025 is in lib/tax.ts (Scottish bands 2,827/14,921; student loans P1 26,065, P2 28,470, P4 32,745; Plan 5 not repaid in 2025/26).
- Home page: "wage calculator" wording, a how-to, a common salaries table, a 2026/27 vs 2025/26 thresholds table, and 12 FAQs.
- Hourly and pro rata pages: more tables and FAQs.
- 28 tests and 303 pages. Backlink plan doc: https://claude.ai/artifact/VWogB6c7G4K1f85xr5ChR8
- Earlier (v4): broken salary links fixed, with 48 old URLs 301-redirected via public/_redirects, and robots.txt disallowing /cdn-cgi/.

## Remaining roadmap
- Priority 2 (content): add one new calculator or guide per week. Check volumes in Semrush first.
  - Calculator candidates: maternity pay, redundancy pay, self-employed tax, bonus tax, Child Benefit charge, overtime.
  - Guide candidates: tax codes, Marriage Allowance, England vs Scotland, tax refunds.
  - Strengthen internal links between the salary and take-home pages.
- Priority 3 (technical): add calculator/Organization schema and breadcrumbs on all pages, run a PageSpeed check, and run a broken-link check.
- Off-site: Bing Webmaster Tools (import from GSC); directory listings and social profiles; post the Reddit/Quora answers 1–2 a day; add AdSense payment details.

## Keyword research (Semrush UK, 2026-10-20). Full table in KEYWORDS.md.
- Head terms are hard: salary calculator uk is 110k searches a month (KD 57).
- Quick wins: "£X after tax" pages (KD 8–16), pro rata (KD 4–9), NHS take home pay (KD 23), NHS band pages, plus the five new calculators above.

## Routine
- Weekly: check Search Console Pages and Performance; add 1 new page.
- Request the AdSense review around mid-November 2026.
- Each 6 April: update all rates, then change LAST_REVIEWED in lib/sources.ts.

## v7, 2026-11-10: salary needed by city (link-building asset)
- Added /salary-needed-to-live-uk-cities: salary needed to live alone in 10 UK cities (London, Bristol, Edinburgh, Manchester, Cardiff, Glasgow, Birmingham, Newcastle, Leeds, Liverpool).
- Data in lib/costOfLiving.ts (ONS one-bed rents Sept 2026, 2026/27 Band D council tax, Ofgem Oct–Dec 2026 cap). Tax uses lib/tax.ts calculate(). Charts in components/CityCharts.tsx (SVG, no JS). Styles: .col-* in globals.css.
- Real Unsplash photos (London by Benjamin Davies, Manchester by Mylo Kaye), credited on the page.
- New source ids onsRents, ofgemCap, councilTax; pageInfo rule; sitemap; footer link; card at top of /guides.
- 34 tests, 311 pages. Refresh rents each quarter when ONS publishes new data.

## v8, 2026-11-11: site search box
- Search box in the header (components/SiteSearch.tsx) searches page titles, descriptions, headings and text as you type; arrow keys + Enter work; Enter with nothing selected opens /search?q= (components/SearchResults.tsx, noindex).
- Index: scripts/build-search-index.mjs runs automatically after `npm run build` (postbuild) and writes out/search-index.json (~305 pages, ~75 KB gzipped, loaded only when someone clicks the box). It is not created by `npm run dev`, so test search with a build.
- Scoring and synonyms (nurse → NHS, wage → salary, etc.) in lib/search.ts; "35k", "£35,000" and "35000" all match. Tests in tests/search.test.ts. 37 tests, 312 pages.

## v10, 2026-11-12: five new calculators + SEO quick wins
- /minimum-wage-calculator (lib/minimumWage.ts, components/MinimumWageCalculator.tsx): 2025, 2026 and announced April 2027 rates (LPC, confirmed 28 Oct 2026: £13.21 / £11.27 / £8.31 / £8.31; offset £11.53), pay per week/month/year after tax, "Am I paid enough?" checker. 2027 take-home uses 2026/27 tax rules until 2027/28 thresholds are added. A test keeps lib/site.ts MIN_WAGE in step.
- /mortgage-calculator (lib/mortgage.ts): repayments, interest-only, yearly balance table, borrowing at 4–5.5× income with share of take-home pay.
- /child-benefit-calculator (lib/childBenefit.ts): £27.05 / £17.90 a week (2026/27), HICBC 1% per £200 over £60,000, pension reduces adjusted net income.
- /redundancy-pay-calculator (lib/redundancy.ts): weekly cap £751 GB / £783 NI from 6 April 2026, 20-year limit, £30,000 tax-free limit, optional enhanced pay.
- /pension-calculator (lib/pension.ts): today's money projection, qualifying earnings £6,240–£50,270, 8%/3% minimums, State Pension £241.30/week, Lump Sum Allowance £268,275.
- New tools group "Life events" (mortgage, Child Benefit, redundancy, pension) in lib/tools.ts and /calculators. New source ids nmw2027, livingWage, childBenefit, hicbc, redundancy, workplacePension, statePension, pensionTax. pageInfo rules added. Footer: "Minimum wage 2026"; "Tax bands" link renamed "Tax brackets".
- SEO quick wins: tax bands guide retitled "UK Tax Brackets 2026/27…", new Personal Allowance section and Scottish 2026/27 vs 2025/26 table; home page "What is take home pay?" heading, PAYE paragraph and FAQ.
- Search synonyms: nlw, hicbc, redundant, retirement, retire, borrow, paye.
- /payslip-checker (lib/payslip.ts, components/PayslipChecker.tsx): tax code parser (L/M/N/T, K with 50% cap, BR, D0–D3, NT, 0T, S/C prefixes, W1/M1/X), non-cumulative tax, per-period NI (weekly £242/£967, monthly £1,048/£4,189, 2- and 4-weekly as multiples of weekly), loans rounded down to whole pounds; compares payslip figures (within £1 = match, £5 = close) + "payslip explained" table.
- /statutory-sick-pay-calculator (lib/ssp.ts): from 6 April 2026 the lower of £123.25 or 80% of AWE, from day one, no Lower Earnings Limit, 28 weeks; shows what the old 2025/26 rules would have paid.
- NHS band pages (all bands): new "pay per month, week and hour (Agenda for Change 2026/27)" table, part-time pay table, 2 extra FAQs (other UK nations, London HCAS), links to pro rata, payslip checker and compare salaries.
- LAST_REVIEWED changed to 12 November 2026. 75 tests (tests/tools2.test.ts, tests/tools3.test.ts), 317 HTML pages.
- Each 6 April also update: lib/minimumWage.ts (move the announced year to current), lib/childBenefit.ts, lib/redundancy.ts (cap), lib/pension.ts (State Pension, thresholds), lib/ssp.ts (weekly rate), lib/payslip.ts (NI per-period thresholds).

## v11, 2026-11-12: Phase 2 on-page optimisation (from the Semrush content gap vs thesalarycalculator.co.uk)
- Gap file: 5,531 keywords where the competitor ranks and we don't. "£X after tax" (271k searches, KD 0), hourly (71k, KD ~5), pro rata (51k, KD 0) are already covered by our pages, so the gap there is ranking, not content.
- /hourly-to-salary retitled "Hourly Wage Calculator UK" (hourly wage calculator 17k, KD 1); /pro-rata-salary-calculator H1/title "Pro Rata Calculator UK" (pro rata calculator 12k, KD 0); payslip checker title adds "Payslip Calculator" and mentions payroll calculator; home title "…Take Home Pay Calculator UK" (23k, KD 8).
- Salary pages: H1 "£X After Tax UK 2026/27: Xk Take Home Pay"; new year/month/week/day/hour table; Plan 1 and Plan 4 rows in the student loan table.
- New pages: monthly take-home £1,200–£3,000 in £100 steps (now 34 pages); hourly £10, £13.21 (April 2027 NLW), £31, £33.
- Home page: "Popular hourly rates after tax" and "What salary gives this take-home pay a month?" link grids.
- Next (Phase 3): maternity pay calculator (7,400, KD 43), gross vs net pay guide, pay rise calculator, bonus tax calculator, second job tax calculator, weekly pay and NI calculators.

## v12, 2026-11-14: seven everyday calculators from Google Trends research (category: Calculators & Reference Tools)
- Trend research and the articles: https://claude.ai/artifact/H8z29iTA6chB9GHH4Hv6W8. Left out on purpose: retatrutide dosage (unlicensed drug), and the silver and MM2 (Roblox) calculators, which were built and then removed before upload as off-topic for a UK pay site ahead of the AdSense review.
- New pages, each a calculator with its article, FAQs, FAQ and WebApplication schema:
  - /mileage-calculator (lib/mileage.ts): HMRC AMAP 2026/27 55p first 10,000 miles then 25p (was 45p in 2025/26; change announced 21 May 2026, backdated to 6 April), motorcycles 24p, bicycles 20p, passengers 5p; Mileage Allowance Relief at the chosen tax rate. Group "Employees".
  - /fuel-cost-calculator (lib/fuel.ts): miles or km, mpg or l/100 km, pence per litre, electric (miles per kWh), return trip, cost sharing, weekly/monthly/yearly.
  - /as-the-crow-flies-distance-calculator (lib/distance.ts): haversine; 38 built-in towns, coordinates, and UK postcodes through the free api.postcodes.io (the only outside request on the site besides analytics and ads; described on /privacy).
  - /university-grade-calculator (lib/grades.ts): credit-weighted module average, year weighting, class boundaries 70/60/50/40, mark needed in final year.
  - /bmi-calculator, /tdee-calculator, /steps-to-miles-calculator (lib/health.ts, shared inputs in components/BodyFields.tsx): NHS adult BMI ranges with the 23/27.5 thresholds option and no adult category under 18; Mifflin-St Jeor BMR x activity factor, no figure under 18; stride = height x 0.413/0.415 (walking) or 0.65 (running).
- New tools group "Everyday" in lib/tools.ts, shown as "Everyday calculators" on /calculators and in its own block on the home page (kept out of "More UK pay calculators").
- lib/pageInfo.ts: rules for all seven; `plain: true` drops the "2026/27 tax year" wording and "financial advice" from the footer box on non-tax pages. New source ids mileage, nhsBmi, nhsCalories, nhsActivity, postcodes.
- CSS: .result-table (small table inside a result panel) and min-width fixes so long select options cannot widen a calculator on phones.
- Search synonyms: petrol, diesel, calories, degree, uni, walking, postcode, amap, expenses. LAST_REVIEWED 14 November 2026.
- 88 tests (tests/everyday.test.ts adds 13), 343 HTML files in out/.
- Each 6 April also update lib/mileage.ts (the Government is reviewing rates beyond 2026/27).

## v13, 2026-11-19: top 20 salary pages content + shorter titles and descriptions
- 20 salary pages (£22k–£100k, the most visited in Search Console) gained a hand-written section above the FAQs and two extra FAQs. Text supplied by Sharjeel (uksalarytools-top20-salary-content.csv), stored in lib/salaryInsights.ts with a "See also" line of related links.
- Every figure was checked against lib/tax.ts, lib/nhs.ts and lib/teachers.ts. Corrections made to the supplied text: £33k (NHS/teacher take-home gap is £104 for teacher M1 and £233 for NHS Band 5 entry, not "£165–£175"); £70k ("with two children" added to the 54% effective rate; Child Benefit half is £1,169, not £1,168).
- The two FAQs ("extra £1,000" and "employer cost") are calculated in app/salary/[amount]/page.tsx, not stored. This corrected £50k: the next £1,000 crosses £50,270, so it adds £618 (about 62p in the pound), not £720.
- tests/salaryInsights.test.ts re-checks the figures in the text. EACH APRIL it will fail until the 20 paragraphs are updated for the new rates: that is intended.
- Also in this build (part of the approved clean-up): shorter titles on 17 tool pages, NHS band pages and the tax-bands guide; all meta descriptions now 160 characters or less (salary pages dropped the trailing "Scotland, student loan and pension figures included").
- Still to do from the clean-up: slimmer home page, grouped navigation, breadcrumbs on tool pages; 28 titles are still over 70 characters including " | UK Salary Tools".
- 92 tests, 343 HTML files.

## v14, 2026-11-19: Ahrefs Web Analytics
- Added the Ahrefs Web Analytics script (data-key qrolBqRnN9YOtz7DK4DOdw) to <head> in app/layout.tsx, next to AdSense, so it is on every page.
- Privacy page "Analytics" section now names Ahrefs Web Analytics alongside Cloudflare (both cookieless). LAST_REVIEWED 19 November 2026.
- Includes everything in v13. 92 tests, 343 HTML files.

## v15, 2026-11-19: new titles and descriptions for 26 pages
- 16 salary pages (£24,500–£47,500, the in-between amounts that rank 6–11) and 10 hourly pages (£10.85, £13.50–£27.50) get click-focused titles (≤60 characters) and descriptions (≤160), from Sharjeel's title_meta_updates.csv.
- lib/metaOverrides.ts builds them from calculate(), so the figures follow the rates. All 26 matched the CSV exactly. Used in generateMetadata of app/salary/[amount] and app/hourly/[slug]; every other page keeps its old pattern.
- lib/hourly.ts now imports "./site.ts" (with the extension) so tests can load it.
- tests/metaOverrides.test.ts: pages exist, length limits, approved examples. 95 tests, 343 HTML files.
- Includes v13 and v14.

## v16, 2026-11-19: trust pages, top 20 hourly content, guide rewrites, take-home data CSV
- Trust: new /methodology (steps from TAX_YEAR, £40k example, assumptions, sources, checks, update schedule, #corrections) and /author/sharjeel (first name only, by choice; no photo or sameAs until Sharjeel supplies them). Organization JSON-LD site-wide (logo /logo.png, founder, publishingPrinciples, correctionsPolicy). Byline component under the H1 on 39 page templates (WebPage JSON-LD with author/reviewedBy/publisher, dateModified LAST_REVIEWED_ISO); non-tax tools omit "Checked against HMRC rates". Footer and PageFooterInfo link to /methodology.
- Hourly: 20 most-visited hourly pages get a hand-written section (lib/hourlyInsights.ts, from uksalarytools-top20-hourly-content.csv) and two calculated FAQs (lib/hourlyFaqs.ts: minimum wage, £1 pay rise). Corrections to the supplied text: £16.50 Plan 2 repayment £251; £12.50 links to the minimum wage calculator; £12.71 rise is £58.50 a month (not £58); £25 pay-rise FAQ handles crossing £50,270; £10.85 FAQ says "exactly the minimum for 18 to 20 year olds"; amounts under £1 in pence.
- Guides: NI, student loans and salary sacrifice now render from content/guides/*.md (lib/markdown.ts, marked). Tax bands guide keeps its JSX body plus uk-tax-bands-additions.md. FAQ schema built from each markdown FAQ section (parser fixed to include the first question under the heading). Article schema with author/publisher. Guides index regrouped; the supplied "Planned guides" notes were not published. Corrections: Plan 1/4 vs Plan 2/5 threshold uprating; Postgraduate threshold unchanged since 2016; net-pay low earner top-up from 2024/25.
- Data: /data/uk-take-home-pay-2026-27.csv (route handler, force-static) built from calculate() for £15k–£150k; matched Sharjeel's CSV on all 136 rows. Linked from /salary.
- Outreach wave 1 (15 emails) added as a tab in the marketing Sheet; quoting fixed in row 12, Markdown bold removed from email bodies. Rows 2 and 9 link to /methodology: send only after v16 is live.
- tests/hourlyInsights.test.ts and tests/guides.test.ts re-check every written figure: both fail each April until text is updated. 107 tests, 345 HTML files, 0 broken internal links.
- Includes v13–v15.

## v17, 2026-11-19: take-home pay data page + 39 shorter titles
- New /data/uk-take-home-pay-2026-27 (title "UK Take-Home Pay 2026/27: Every Salary £15k–£150k"), rebuilt in the site design from Sharjeel's uksalarytools-data-page.html: breadcrumbs, byline, four headline figures, take-home + marginal rate chart (hover readout), Scotland gap chart, full 136-row table with jump-to-salary and links to each salary page, "Use this data" (CC BY 4.0 with credit link), CSV download. Charts scroll sideways on phones so labels stay readable.
- lib/takeHomeData.ts builds the rows, the CSV (/data/uk-take-home-pay-2026-27.csv) and the headline figures from calculate(). Headline figures matched the supplied page: 62%, £9,553 (38p), £33,494, 1.8×.
- Dataset JSON-LD (Google Dataset Search): name, description, creator/publisher, licence, temporal and spatial coverage, variables, sources, CSV DataDownload. In the sitemap; linked from the homepage, /salary and /guides (new "Data" section).
- 39 titles shortened per uksalarytools-title-fixes.csv (lib/titleOverrides.ts, absolute titles with no " | UK Salary Tools" suffix; homepage via the layout default; two guides via generateMetadata). All 39 matched the CSV in the built pages; no duplicate titles.
- tests/titles.test.ts and tests/takeHomeData.test.ts (headline figures fail each April until updated). 111 tests, 346 HTML files, 0 broken internal links.
- Off-topic tools hidden from search: /bmi-calculator, /tdee-calculator, /steps-to-miles-calculator, /as-the-crow-flies-distance-calculator and /university-grade-calculator get <meta name="robots" content="noindex, follow"> (NOINDEX_TOOLS in lib/tools.ts), are left out of the sitemap and the homepage, and drop out of site search (the search-index script skips noindex pages). They still work and stay on /calculators. Mileage and fuel cost stay indexed as work-travel tools; the homepage "Everyday calculators" section was removed and fuel cost now sits in "More UK pay calculators". tests/noindex.test.ts. 112 tests, sitemap 338 URLs.
- Includes v13–v16.
- Author page: photo (public/sharjeel.jpg, cropped from Sharjeel's photo), LinkedIn link (rel="me"), background paragraph (MBA in Marketing, Bahauddin Zakariya University; 16 years in sales and marketing). Person schema adds image, sameAs LinkedIn, alumniOf, hasCredential; the site-wide Organization founder now carries name, url and sameAs inline. Display name stays "Sharjeel".
- Methodology: "Corrections and updates log" (lib/changelog.ts, newest first). No corrections to published figures so far; four update entries.
- Sitemap: real lastmod dates from lib/lastModified.ts instead of the build time: 50 pages changed on 2026-11-19 (home, /salary, /guides, 4 guides, methodology, author, data page, 20 salary + 20 hourly insight pages); the other 288 on 2026-11-14 (v12). Update that file when content changes. tests/lastModified.test.ts. 113 tests.

## v18, 2026-11-20: income tax threshold freeze research
- New /research/income-tax-threshold-freeze-2026 ("The £39,317 line…", title "Income Tax Threshold Freeze 2026: The £39,317 Line"), from Sharjeel's Part A article. Every figure is computed on the page from lib/thresholdFreeze.ts: thresholds uprated by previous-September CPI (3.1, 10.1, 6.7, 1.7, 3.8, 3.5; PA rounded up to £10, basic rate limit to £100), today's rates, £100k taper and £125,140 ART unchanged, NI thresholds aligned. All article figures matched the model.
- Wording corrected: "nearly ten years" → ten years (and the October 2026 Budget left the freeze in place); "latest inflation figure" → the September 2026 figure (October's was out by publication); the £4,112 from April 2027 applies from £66,750, not £65,000; "last five tax years" → 2022/23 to 2026/27; standfirst's £702 is for basic-rate taxpayers over about £16,000. The internal "next step for the site" note was not published.
- Charts (Sharjeel's PNGs, compressed) and his checker's data pack (four CSVs + charts, plus a README with credit line and method) in public/research/data/threshold-freeze-2026/ — NOT under the page path, because a folder with the page's name showed a directory listing instead of the page. tests/thresholdFreeze.test.ts checks all 327 values in the CSVs against the model, the model against calculate(), and every headline number.
- Article + Dataset JSON-LD. Linked from the homepage (salary calculator) and /guides ("Research and data"); in the sitemap (lastmod 2026-11-20 for it, / and /guides). New sources onsCpi and freeze2031. Changelog entry. LAST_REVIEWED now 20 November 2026.
- 118 tests, 347 HTML files. Includes v13–v17.

## v19, 2026-11-21: National Insurance, Self-Employed Tax and Company Car Tax calculators
- /national-insurance-calculator (lib/nationalInsurance.ts): employee and employer Class 1 NI per pay period (weekly, 2-weekly, 4-weekly, monthly, annual directors) using HMRC's published period thresholds (monthly PT £1,048, UEL £4,189, ST £417, LEL £559); categories A, M, H, V, C, B; bonus-month comparison; HMRC exact percentage rounding (half a penny down). Annual results agree with calculate().
- /self-employed-tax-calculator (lib/selfEmployed.ts): income and expenses or the £1,000 trading allowance; optional PAYE salary (tax on salary excluded, Class 4 on profits alone); Scotland; student loan plans; Class 4 6%/2%; Class 2 treated as paid from £7,105 (voluntary £3.65/wk); payments on account (Income Tax + Class 4 only, none if under £1,000 or ≥80% paid via PAYE) with a first-year schedule (31 Jan 2028, 31 Jul 2028); Making Tax Digital note.
- /company-car-tax-calculator (lib/companyCar.ts): full EIM24705 2026/27 table (70–74 and 75–79 both 21%, 155+ = 37%), 1–50g/km by electric range, diesel +4% unless RDE2 (not diesel hybrids), capital contribution cap £5,000, private-use payments, months available, fuel benefit £29,200 × %, marginal tax including band crossing and the £100k taper, employer Class 1A 15%. Hybrid rates match lib/ev.ts.
- Verified on GOV.UK/HMRC on 21 Nov: employer rates 2026/27, NI categories, self-employed NI, MTD dates, payments on account rules, EIM24705, EIM25580 (£29,200), mandatory payrolling of company cars and fuel from 6 April 2027, RDE2 for new diesels from January 2021.
- Links: NI guide, payslip checker, EV salary sacrifice, corporation tax pages; tools list (homepage and /calculators); sitemap; titles (42 short titles).
- Correction (in the changelog): NI guide monthly examples now use HMRC monthly thresholds — £156.16 (was £156.20) and £327.50 (was £327.55); guide test now checks against lib/nationalInsurance.ts.
- 135 tests, 350 HTML files. LAST_REVIEWED 21 November 2026. Includes v13–v18.

## v20, 2026-11-21: Capital Gains Tax and Stamp Duty calculators
- /capital-gains-tax-calculator (lib/capitalGains.ts): sale price − cost − costs; asset types (shares, residential property, crypto, business, other); income sets the unused UK basic band (£37,700, also for Scottish taxpayers; PA taper included); £3,000 annual exempt amount; 18%/24%; BADR 18% using the band first; losses this year in full, brought-forward losses only down to the allowance; tax on this asset vs without it; 60-day reporting note for residential property. Matches both GOV.UK worked examples (£1,728 and £10,842). Budget 2026 checked: rates unchanged; BADR lifetime limit £500,000 from 6 April 2027 (in FAQ).
- /stamp-duty-calculator (lib/stampDuty.ts): SDLT (England and NI) standard, first-time buyer (0% to £300k, 5% to £500k, none above £500k), additional property +5% from £40,000, non-resident +2%; LBTT (Scotland) 0/2/5/10/12 with FTB nil band £175k and 8% ADS on the whole price; LTT (Wales) main rates and higher rates from 11 Dec 2024, no FTB relief. Matches GOV.UK (£4,750; £10,000) and gov.wales (£7,500; £135,750; £3,300; £15,950; £22,950) examples. Budget 2026, Scottish and Welsh budgets 2026-27: rates unchanged.
- Linked from mortgage, dividend tax pages, tools list; titles (44); sources cgt, cgtExamples, sdlt, sdltHigher, lbtt, ltt; sitemap dates.
- 146 tests, 352 HTML files. Includes v13–v19.

## v21, 2026-11-24: page copy for 21 salary and 6 hourly pages
- From Sharjeel's PAGE_COPY_SALARY_HOURLY.md (pages with >15 GSC impressions). lib/pageCopy.ts + components/PageCopySection.tsx: short-answer lead, "A worked example at £X", "Watch out for this at £X", the line "Checked against HMRC rates, November 2026 — Sharjeel Iqbal, UK Salary Tools." with the GOV.UK Income Tax rates link and one internal link. On these 27 pages the FAQ list (and FAQ schema) is just the page's own 2–3 questions.
- All take-home, tax and NI figures in the brief were right. Corrected before publishing: £16,500 is ~25 hours at NLW (not 16); Plan 1 threshold is £26,900 in 2026/27 (not £26,065) so Plan 1 figures at £30,500/£33,500/£16.50 changed; £32,500 Scotland takes home ~£10 MORE (crossover £33,494); £36,500 Scotland gap is £30 a year (not £25 a month), and it's Band 5/teacher M2–M3, not Band 6/M3–M4; 1383M is the Marriage Allowance code (not 1257M); £38,500 sacrifice: £166.67 is the whole sacrifice, £46.67 is the tax+NI saved; £43,500 NHS take-home £2,619 (not £2,550), "already gets a click" removed; £45,500 pension saving only via salary sacrifice; £47,500 £3,000 bonus keeps £2,127.80 (not £1,950) and the sacrifice point rewritten; "62% saving higher earners get" → 42% (62% only £100k–£125,140); £26,500 is NHS Band 3 (Band 2 is £25,272); £13.50 real Living Wage now £14.10 / £15.45 London (announced 15 Oct 2026); £14.50: 50p rise = £58.50/month, £702/year (not £76/£912); 40-hour figures for £13.50 (£1,978), £14.50 (£2,103), £16.50 (£2,353), £27.50 (£3,644); ranking positions removed.
- Median full-time salary updated site-wide to £40,911 (ONS ASHE April 2026, provisional, published 22 Oct 2026) from £39,039: MEDIAN_FULL_TIME in lib/site.ts drives the "Is £X a good salary" FAQ on every salary page; insight texts for £40k, £35k, £37k, £28k, £18.50, £20, £21.50 rewritten. New source "ashe" on salary pages; livingWage source on £13.50.
- tests/pageCopy.test.ts re-checks every figure (fails each April until updated). Sitemap: all salary pages + the 6 hourly pages + £20/£21.50 dated 2026-11-24 (236 dated pages). Changelog entry. LAST_REVIEWED 24 November 2026.
- 154 tests, 352 HTML files, 0 broken internal links, 0 duplicate titles. Includes v13–v20.

## v22, 2026-11-24: audit + Child Benefit 53-week correction
- Full audit (AUDIT_V22.md): rates, links/sitemap, content/management. Baseline before fixes: 154 tests pass, build 352 HTML files, sitemap 344 URLs.
- CORRECTION — Child Benefit 2026/27 has 53 weekly payments, not 52 (ITEPA 2003 s681H: a Child Benefit week starts on a Monday, and both 6 Apr 2026 and 5 Apr 2027 are Mondays; HMRC's own calculator gives £2,382.35 for two children). lib/childBenefit.ts now has CB_WEEKS {"2026/27": 53, "2025/26": 52}. Yearly: 1 child £1,433.65, 2 children £2,382.35, 3 children £3,331.05. HICBC is now charged on the benefit rounded down to whole pounds, so at £70,000 with two children the charge is £1,191 (was £1,168) and at £80,000 it is £2,382, keeping £0.35. Salary insights updated (£70k £1,191; £65k £2,382 / roughly £596). tests/tools2.test.ts updated (marginal rate at £70k is now 53.5%, not 54%).
- BUG — public/_redirects line 57 sent the real page /salary/175000-after-tax to /salary/170000-after-tax, which does not exist (SALARY_PAGES has 175000, not 170000). Redirect deleted. The same audit found GSC's 30×404 cause: dynamic families 404 outside their pre-built lists, and only /salary/ had redirects. Added 16 redirects: 8 salary (£15,250, £60,500, £151k, £155k, £225k, £275k, £350k, £450k), 4 take-home (£1,000, £1,100, £6,500, £9,000 a month), 4 hourly (£11.25, £13.75, £22.75, £55). All 64 redirect targets verified against the sitemap. (No redirect for £175,000: it is a real page.)
- "Similar salaries" on salary pages now lists the 12 nearest (was the 12 lowest within ±25% — £146,000 linked £110,000–£121,000). lib/tools.ts comment corrected: noindex tools are NOT in site search (the search-index script skips noindex pages). KEYWORDS.md §4 marked built/superseded.
- NOT fixed in v22 (see AUDIT_V22.md): Ofgem Jan–Mar 2027 cap (announced 25 Nov 2026 — update after publication, do not use forecasts); ONS October 2026 rents (headline only — city 1-bed figures need the local dataset); NHS calculator Scotland path (uses England AfC bands/pension tiers — needs Scotland data, not a constant change); SSP rounding (1p, secondary source only); apex→www redirect (needs a Cloudflare rule/live check); 285 templated pages in the sitemap (likely driver of 46 discovered-not-indexed).
- Changelog entry (correction + the v21 update entry now has a correction entry above it). Sitemap: /child-benefit-calculator dated 2026-11-24; 237 changed pages asserted in tests/lastModified.test.ts. LAST_REVIEWED still 24 November 2026.
- 154 tests, 352 HTML files. Includes v13–v21.
