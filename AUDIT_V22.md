# Audit v22 — uksalarytools.co.uk source (24 Nov 2026)

Audited from the v21 zip (source-v22 working copy). Baseline before fixes: `npm test` 154/154 pass, `npm run build` 352 HTML files, sitemap 344 URLs, search index 344 pages. After fixes: same counts, still green. Nothing deployed live.

## 1. Issues found

### Critical — none

### High

| # | File:line | Issue | Status |
|---|---|---|---|
| H1 | `public/_redirects:57` (old) | Redirect sent the real page `/salary/175000-after-tax` to `/salary/170000-after-tax`, which does not exist (SALARY_PAGES has 175000, not 170000). On Cloudflare Pages `_redirects` wins over static files, so £175k 404'd. The links audit wrongly reported "all 48 targets are real". | **FIXED** — redirect deleted |
| H2 | `app/salary/[amount]/page.tsx:17,50`, `app/take-home/[slug]/page.tsx:14,42`, `app/hourly/[slug]/page.tsx:18,49` | Any URL outside the pre-built lists 404s (`dynamicParams = false`): plausible amounts like £15,250, £60,500, £151k–£159k; take-home £1,000/£1,100/£6,500/£9,000 a month; hourly £11.25/£13.75/£22.75/£55. Only `/salary/` had any redirects. Live-verified 404s: `/salary/15250-after-tax`, `/take-home/1000-a-month`. This is the most likely cause of GSC's 30×404. | **PARTLY FIXED** — 16 new redirects added (see below). A full fix (widen the page lists) would add pages, not redirects |
| H3 | `app/sitemap.ts:12-30` | 285 of 344 sitemap URLs are near-duplicate templated pages (194 salary + 54 hourly + 37 take-home) differing only in figures; only 20 salary / 20 hourly have hand-written sections. Most plausible driver of GSC's 46 discovered-not-indexed. No code defect. | **NOT CHANGED** — needs a decision (see §4) |
| H4 | `lib/costOfLiving.ts:6-8,35,47` | City page energy figure uses the Ofgem Oct–Dec 2026 cap and goes stale 1 Jan 2027; rents are September 2026 (one ONS release behind: October 2026 bulletin published 18 Nov 2026, UK £1,411 +3.8%, London £2,350 +3.8%). | **NOT CHANGED** — Ofgem Jan–Mar 2027 cap is announced 25 Nov 2026 (update after publication, never from a forecast); city 1-bed October figures need the ONS local dataset, not the headline |
| H5 | `lib/site.ts:5,41,43`, `lib/pageCopy.ts:13`, `lib/salaryInsights.ts`, `lib/hourlyInsights.ts`, `content/guides/*.md` | ~273 hard-coded `2026/27` strings and hand-written 2026/27 copy across app/lib/components; `COPY_CHECKED` date line goes stale in December. All guarded by tests designed to fail each April (intended tripwires). | **NOT CHANGED** — April 2027 job, see §4 |
| H6 | `lib/childBenefit.ts:21-23` | Yearly Child Benefit used 52 weeks; 2026/27 has 53 (see §2). Every yearly Child Benefit figure on the site was ~1.9% low, and every HICBC charge was low. | **FIXED** (see §2) |

### Medium

| # | File:line | Issue | Status |
|---|---|---|---|
| M1 | `lib/nhs.ts` + `lib/nhsTakeHome.ts:6` + `components/NhsCalculator.tsx:70-74` | NHS calculator offers a Scotland toggle but always uses England AfC bands and England & Wales pension tiers. Scotland Band 5 entry is £34,544 (not £32,073); Scotland NHS Pension has 9 tiers, 5.7%–12.7%. Real error on the Scotland path only. | **NOT FIXED** — needs Scotland pay/pension data files, not a constant change |
| M2 | `public/_redirects` + `next.config.mjs` | Apex domain serves the site with no apex→www redirect (live fetch of `https://uksalarytools.co.uk/` returned 200). Canonicals/sitemap point to www, so Google should consolidate, but every URL exists twice. | **NOT FIXED** — needs a Cloudflare rule + live check |
| M3 | `lib/changelog.ts:10-52` | Discipline broken: 8 entries for 17 versions; v13–v17 collapsed into one 2026-11-19 entry, v19+v20 merged, v14/v15/v17 missing as distinct entries. | **PARTLY** — v22 correction entry added; history not backfilled (risk of inventing dates) |
| M4 | `lib/lastModified.ts:11,45` + `tests/lastModified.test.ts:7-18` | Sitemap dates are a second manual ledger alongside changelog + LAST_REVIEWED; any content change that doesn't edit this file breaks the test (by design). | **NOT CHANGED** — process issue, see §4 |
| M5 | `lib/sources.ts:2-46` | No per-source "last checked" date, only site-wide LAST_REVIEWED. `onsRents` says "October 2026" vs `COL_RENTS_MONTH` "September 2026" (bulletin month vs data month — confusing, not wrong). `ofgemCap` has no date. | **NOT CHANGED** |
| M6 | `lib/thresholdFreeze.ts:15-23` | Freeze model ends 2027/28; after April 2027 the research page needs September 2027 CPI + new NLW. Page hard-codes "20 November 2026" / "October 2026 Budget" prose. | **NOT CHANGED** — April 2027 job |

### Low

| # | File:line | Issue | Status |
|---|---|---|---|
| L1 | `app/salary/[amount]/page.tsx:68` | "Similar salaries" linked the 12 lowest within ±25%, not the 12 nearest (£146,000 linked £110,000–£121,000). | **FIXED** — sorted by distance |
| L2 | `lib/tools.ts:40-41` | Comment said noindex tools "stay in /calculators and site search", but the search-index script skips noindex pages — they are not in site search. | **FIXED** — comment corrected |
| L3 | `lib/ssp.ts:38-39` | `pence()` rounds to nearest; CIPP summary of the 6 Apr 2026 rules says SSP rounds up to the nearest penny. Max impact 1p. Evidence is secondary, not HMRC text. | **NOT CHANGED** — confirm against HMRC guidance first |
| L4 | `lib/nationalInsurance.ts:21-27` | Categories J/Z (deferred) and Freeport/Investment Zone letters (E, F, I, K, L, N, S) absent — those users get no result. Rates for listed letters all correct. | **NOT CHANGED** — scope gap |
| L5 | `lib/capitalGains.ts:13` | `BADR_LIFETIME_LIMIT = £1,000,000` defined but never enforced (no prior-claims input). Correct for 2026/27; drops to £500,000 on 6 Apr 2027. | **NOT CHANGED** |
| L6 | `lib/costOfLiving.ts:6-8` | ONS rents one release stale (see H4). | **NOT CHANGED** — see H4 |
| L7 | `KEYWORDS.md:3,§2,§3,§4` | 20 Oct 2026 Semrush research; §4 "not built yet" fully superseded (all four built in v2); §2 "about 190 pages" vs 194; §3 cites 2025 NLW £12.21. | **FIXED** — §4 marked built/superseded, stale figures noted in the file |
| L8 | `lib/site.ts:43` + `tests/tools2.test.ts:27-30` | MIN_WAGE duplicates `lib/minimumWage.ts`; the test pins MIN_WAGE to 2026/27 rates, so the April update must change the test too. | **NOT CHANGED** — April job |
| L9 | `lib/tools.ts:39-47` + `app/calculators/page.tsx:23` | 5 noindex everyday tools still linked from `/calculators` and footers, maintained (health/grades/distance libs, 13 tests, postcode API dependency) with no SEO return. Halfway state: live + linked, but noindexed. | **NOT CHANGED** — decision needed, see §4 |
| L10 | `tsconfig.tsbuildinfo`, dated comments | 128 KB build artifact in the repo root; `lib/stampDuty.ts:1` "as at November 2026", `lib/titleOverrides.ts:1` "(v17, 19 Nov 2026)" will read stale. | **NOT CHANGED** — cosmetic |

## 2. What was fixed (with evidence)

1. **Child Benefit 53 weeks** — `lib/childBenefit.ts`: added `CB_WEEKS = {"2026/27": 53, "2025/26": 52}`; `childBenefitYearly` uses it. Basis: ITEPA 2003 s681H (a Child Benefit week starts on a Monday); 6 Apr 2026 and 5 Apr 2027 are both Mondays (verified with `date`); HMRC's own Child Benefit tax calculator returns £2,382.35 for two children in 2026/27. New yearly figures: 1 child £1,433.65, 2 children £2,382.35, 3 children £3,331.05. `hicbcCharge` now floors the benefit base to whole pounds first (s681C): at £70,000 with two children the charge is £1,191 (was £1,168); at £80,000 it is £2,382, keeping £0.35. Updated: `tests/tools2.test.ts` (yearly amounts, charge steps, pension test charge 350→357 / kept 2025.35, marginal rate 54%→53.5%), `lib/salaryInsights.ts` (£70k £1,191; £65k £2,382 / roughly £596). Verified in built output: child-benefit page FAQ "you receive £2,382.35, the charge is £1,191 and you keep £1,191.35 a year".
2. **£175k redirect bug** — deleted the `_redirects` rule sending `/salary/175000-after-tax` to non-existent `/salary/170000-after-tax`.
3. **16 new redirects** (`public/_redirects`, now 64 rules): salary £15,250→£15,000, £60,500→£60,000, £151k/£155k→£150k, £225k→£200k, £275k→£250k, £350k→£300k, £450k→£400k; take-home £1,000/£1,100→£1,200, £6,500→£6,000, £9,000→£8,000 a month; hourly £11.25→£11, £13.75→£13.50, £22.75→£22.50, £55→£50. Every target verified against the built sitemap. (No redirect for £175,000: it is a real page, so none is needed.)
4. **Similar salaries nearest-first** — `app/salary/[amount]/page.tsx`. Verified in built output: £146,000 page now links £140,000–£147,000 (was £110,000–£121,000).
5. **Docs** — `lib/tools.ts` comment, `KEYWORDS.md` §4, `lib/changelog.ts` v22 correction entry, `lib/lastModified.ts` (+`/child-benefit-calculator`, 2026-11-24; test count 236→237), `PROJECT_NOTES.md` v22 entry.


## 3. Verified correct (spot-checked against published sources)

`lib/tax.ts` (PA £12,570; Scottish bands; NI 8%/2%; Plan 1 £26,900, Plan 2 £29,385, Plan 4 £33,795, Plan 5 £25,000, PGL £21,000), `lib/nhs.ts` (all AfC points, pension tiers), `lib/teachers.ts` (all 36 points, TPS tiers), `lib/business.ts` (corp tax 19%/25%; dividends 10.75%/35.75%/39.35% — additional rate correctly stays 39.35%), `lib/minimumWage.ts` (2026/27 £12.71/£10.85/£8.00; 2027/28 £13.21/£11.27/£8.31), `lib/redundancy.ts` (£751/£783), `lib/pension.ts` (State Pension £241.30/wk; LSA £268,275), `lib/ssp.ts` (£123.25, day one, no LEL, 28 weeks), `lib/nationalInsurance.ts` (per-period thresholds; Category B 1.85%), `lib/selfEmployed.ts` (Class 4 6%/2%; Class 2 SPT £7,105; MTD dates), `lib/companyCar.ts` (EIM24705 table; fuel multiplier £29,200), `lib/capitalGains.ts` (18%/24%; BADR 18%), `lib/stampDuty.ts` (SDLT/LBTT/LTT + GOV.UK examples), `lib/mileage.ts` (55p/25p), `lib/ev.ts` (BIK 4%), `lib/thresholdFreeze.ts` (Sept CPI 3.1/10.1/6.7/1.7/3.8/3.5).

Sitemap/redirects: 344 sitemap URLs = 344 built files; every route in `app/` is in the sitemap except the 5 noindex tools and `/search` (by design); zero literal internal hrefs to missing pages; 44 short titles unique and ≤60 chars; no duplicate titles/descriptions. `/data/` CSV route exports correctly (11,366 bytes); research data files all present.

## 4. Improvements recommended (prioritised)

1. **25 Nov 2026 (tomorrow):** Ofgem announces the Jan–Mar 2027 cap — update `lib/costOfLiving.ts` energy rates + `tests/costOfLiving.test.ts:7` (£115) the same day. Do not use Cornwall Insight forecasts.
2. **Dec 2026:** ONS October 2026 rents — update city 1-bed figures from the ONS local dataset (headline UK/London figures are not enough for per-city pages). Also refresh `COL_RENTS_MONTH` and the `onsRents` source date.
3. **Dec 2026:** NHS Scotland — build Scotland AfC bands + 9-tier pension into the NHS calculator, or remove the Scotland toggle (currently it silently shows England figures to Scottish users).
4. **Dec 2026:** Apex→www 301 via a Cloudflare rule; verify live that `uksalarytools.co.uk` redirects instead of serving.
5. **Dec 2026:** Decide the 285 templated sitemap pages — either add hand-written sections to more of them (the 20+20 insight model works) or drop the thinnest from the sitemap / deprioritise them. This is the likely fix for the 46 discovered-not-indexed.
6. **Dec 2026:** Decide the 5 noindex everyday tools — keep deliberately as a `/calculators` feature or remove them; the current halfway state pays maintenance for no SEO return. (Note: mileage + fuel cost stay indexed — they are work-travel tools.)
7. **Jan 2027:** Confirm SSP rounding (nearest vs round-up) against HMRC guidance; add NI categories J/Z + Freeport letters if the calculator is to cover them.
8. **6 Apr 2027 (big job):** full rate update — `lib/tax.ts` (new TAX_YEAR), `lib/site.ts` (tagline, MEDIAN when ASHE April 2027 lands ~Oct 2027, MIN_WAGE → £13.21/£11.27/£8.31), `lib/minimumWage.ts`, `lib/childBenefit.ts` (2027/28 rates £28.00/£18.55, 52 weeks), `lib/redundancy.ts`, `lib/pension.ts` (State Pension £250.70/wk), `lib/ssp.ts`, `lib/payslip.ts`, `lib/mileage.ts` (over-10,000 miles 25p→35p), `lib/companyCar.ts` (fuel multiplier £29,200→£30,200), `lib/capitalGains.ts` (BADR limit £1m→£500k), `lib/selfEmployed.ts` (trading allowance £1,000→£3,000), `lib/nhs.ts`, `lib/teachers.ts`, `lib/ev.ts` (BIK 5%), `lib/thresholdFreeze.ts` (add 2028/29, September 2027 CPI), plus the April-tripwire tests and the ~273 hard-coded `2026/27` strings. Put the April checklist in code (e.g. a comment block in `lib/tax.ts`), not only in PROJECT_NOTES. Also: Plan 1 student-loan threshold rises to £28,005 in 2027/28 while Plan 2 freezes at £29,385.
9. **Process:** enforce one changelog entry per release (not one per month); keep `LAST_REVIEWED` + `lib/lastModified.ts` in step on every release — three ledgers, currently kept in step only by memory.

## 5. Not needed right now

- **New calculators (Phase 3 backlog):** maternity pay calculator (KD 43 — the hardest in the backlog), pay rise calculator, bonus tax calculator, second job tax calculator, weekly pay and NI calculators, gross vs net pay guide. The site already has 352 pages and 4 clicks in 28 days — the constraint is ranking/traffic, not page count. Do not add calculators until the existing pages rank.
- **/embed page (free embeddable calculator):** useful for links later, but it is a distribution play that only pays off once the site has authority; revisit after the first backlinks land.
- **More salary/hourly/take-home programmatic pages:** 285 templated pages already exist and 46 are not indexed. Adding more thin pages makes the indexation problem worse, not better.
- **Bing Webmaster Tools / directory listings / Reddit-Quora posting (PROJECT_NOTES roadmap):** low return vs the GSC 404/indexation fixes and the Ofgem/rent refreshes above.
- **AdSense review:** planned for mid-November; only ~4 clicks in 28 days — traffic is not there yet. Wait for ranking improvements from the backlink campaign.
- **Deleting the noindex everyday tools today:** they cost little and the decision can wait for the December review (see §4.6). Do not delete working calculators.
- **SSP rounding change:** 1p max impact, secondary source only — not worth a release on its own.
- **Rewriting KEYWORDS.md volumes:** Semrush re-pull is a nice-to-have; the file is now honestly marked as superseded where it matters.
