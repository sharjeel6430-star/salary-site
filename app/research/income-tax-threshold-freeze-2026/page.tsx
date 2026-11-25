import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Byline } from "@/components/Byline";
import { AUTHOR, ORG_ID, PERSON_ID, SITE_NAME, SITE_URL } from "@/lib/site";
import {
  FREEZE_YEARS, FROZEN, extraCost, fortyPercentLine, minimumWageRows, nlwTaxIndexed, sameRealPay, thresholdsFor,
} from "@/lib/thresholdFreeze";

const RESEARCH_PATH = "/research/income-tax-threshold-freeze-2026";
const FILES = "/research/data/threshold-freeze-2026"; // public/research/data/threshold-freeze-2026/ (not the page path, so they never clash)
const PUBLISHED = "2026-11-20";
const H1 = "The £39,317 line: how the tax freeze turned inflation-matching pay rises into higher-rate tax bills";
const TITLE = "Income Tax Threshold Freeze 2026: The £39,317 Line";
const DESCRIPTION =
  "If your pay has only kept up with prices since 2021 you may now pay 40% tax. What the frozen thresholds cost at every salary in 2026/27 and 2027/28, with free data.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: RESEARCH_PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: RESEARCH_PATH, type: "article", images: [`${FILES}/chart1_extra_tax_by_salary.png`] },
};

const gbp = (n: number) => (n < 0 ? "–" : "") + "£" + Math.round(Math.abs(n)).toLocaleString("en-GB");
const higherFrom = FROZEN.pa + FROZEN.brl;

const CHARTS = [
  { file: "chart1_extra_tax_by_salary.png", alt: "Bar chart of extra income tax paid because of the threshold freeze by salary: £702 at £20,000 to £50,000 in 2026/27 rising to £816 in 2027/28, and £3,544 at £70,000 to £125,000 rising to £4,112.", caption: "Extra income tax by salary, 2026/27 and 2027/28" },
  { file: "chart2_thresholds.png", alt: "Line charts of the personal allowance and 40% threshold, frozen at £12,570 and £50,270 since 2021/22, against £16,650 and £66,750 by 2027/28 if uprated with CPI.", caption: "Frozen vs inflation-linked thresholds, 2021/22 to 2027/28" },
  { file: "chart3_minimum_wage_weeks.png", alt: "Bar chart of weeks of full-time National Living Wage work covered by the £12,570 allowance: 37.6 weeks in 2021/22 falling to 26.4 in 2026/27 and 25.4 in 2027/28.", caption: "Weeks of minimum-wage work covered by the tax-free allowance" },
];

const DOWNLOADS = [
  { file: "freeze_data_pack.zip", label: "Full data pack (ZIP: four CSV files, three charts and a README)" },
  { file: "thresholds_frozen_vs_indexed.csv", label: "Thresholds, frozen vs indexed (CSV)" },
  { file: "freeze_cost_by_salary.csv", label: "Tax and NI by salary, frozen vs indexed (CSV)" },
  { file: "same_real_pay_worker.csv", label: "Same real pay, higher tax band (CSV)" },
  { file: "minimum_wage_and_allowance.csv", label: "Minimum-wage workers (CSV)" },
];

export default function FreezeResearch() {
  const now = thresholdsFor("2026/27");
  const next = thresholdsFor("2027/28");
  const line = Math.round(fortyPercentLine("2026/27"));
  const lineNext = Math.round(fortyPercentLine("2027/28"));
  const basic = extraCost(30000, "2026/27");
  const basicNext = extraCost(30000, "2027/28");
  const high = extraCost(80000, "2026/27");
  const highNext = extraCost(80000, "2027/28");
  const mw = minimumWageRows();
  const mwFirst = mw[0], mwNow = mw.find((m) => m.year === "2026/27")!, mwNext = mw.find((m) => m.year === "2027/28")!;
  const real = [20000, 30000, 40000, 50000].map(sameRealPay);
  const url = `${SITE_URL}${RESEARCH_PATH}`;

  const table2026 = [
    { label: "£15,000", c: extraCost(15000, "2026/27") },
    { label: "£20,000–£50,000", c: extraCost(30000, "2026/27") },
    { label: "£55,000", c: extraCost(55000, "2026/27") },
    { label: "£60,000", c: extraCost(60000, "2026/27") },
    { label: "£65,000–£125,000", c: extraCost(80000, "2026/27") },
    { label: "£150,000", c: extraCost(150000, "2026/27") },
  ];
  const table2027 = [
    { label: "£20,000–£50,000", c: extraCost(30000, "2027/28") },
    { label: "£60,000", c: extraCost(60000, "2027/28") },
    { label: "£70,000–£125,000", c: extraCost(80000, "2027/28") },
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: H1,
            description: DESCRIPTION,
            url,
            mainEntityOfPage: url,
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
            image: CHARTS.map((c) => `${SITE_URL}${FILES}/${c.file}`),
            author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR.name, url: `${SITE_URL}${AUTHOR.path}` },
            publisher: { "@id": ORG_ID },
          },
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "UK income tax threshold freeze: extra tax by salary, 2021/22 to 2027/28",
            description:
              "Personal allowance and 40% threshold frozen vs uprated by September CPI each year since 2021; extra income tax and employee NI paid because of the freeze at each salary in 2026/27 and 2027/28; extra tax over five years for pay that tracked inflation; and how far the allowance covers full-time National Living Wage work. England, Wales and Northern Ireland.",
            url,
            creator: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: SITE_URL },
            isAccessibleForFree: true,
            license: "https://creativecommons.org/licenses/by/4.0/",
            datePublished: PUBLISHED,
            temporalCoverage: "2021-04-06/2028-04-05",
            spatialCoverage: { "@type": "Place", name: "England, Wales and Northern Ireland" },
            keywords: ["income tax threshold freeze", "fiscal drag", "personal allowance", "higher rate threshold", "National Living Wage", "CPI"],
            distribution: DOWNLOADS.map((d) => ({
              "@type": "DataDownload",
              encodingFormat: d.file.endsWith(".zip") ? "application/zip" : "text/csv",
              contentUrl: `${SITE_URL}${FILES}/${d.file}`,
            })),
          },
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Income tax threshold freeze 2026", url },
          ]),
        ]}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › Research
      </nav>
      <article className="prose research">
        <p className="data-kicker">Research · 20 November 2026</p>
        <h1>{H1}</h1>
        <Byline />
        <p className="lead">
          Income tax thresholds have been frozen since April 2021 and will stay frozen until April 2031. We modelled what
          workers would pay if the thresholds had risen with inflation, as the law would normally require. The answer:{" "}
          {gbp(basic.extraTax)} a year more income tax for every basic-rate taxpayer earning over about £16,000, more than
          £3,500 for many higher earners, and a 40% tax bill for people whose pay has only kept up with prices.
        </p>

        <h2>Key findings</h2>
        <ol className="findings">
          <li>
            <strong>The {gbp(line)} line.</strong> Anyone who earned more than {gbp(line)} in 2021/22 and whose pay has since
            risen exactly in line with inflation now earns more than {gbp(higherFrom)} and pays 40% tax on part of their
            income. If thresholds had been uprated with inflation, the 40% band would start at {gbp(now.higherFrom)} and they
            would still be basic-rate taxpayers. From April 2027 that line drops to {gbp(lineNext)}.
          </li>
          <li>
            <strong>{gbp(basic.extraTax)} more for every basic-rate taxpayer.</strong> Everyone earning between about £16,000
            and {gbp(higherFrom)} pays {gbp(basic.extraTax)} more income tax in 2026/27 than they would with inflation-linked
            thresholds, plus {gbp(basic.extraNI)} more National Insurance: {gbp(basic.total)} in total. From April 2027 this
            rises to {gbp(basicNext.extraTax)} in tax and {gbp(basicNext.total)} including NI.
          </li>
          <li>
            <strong>Higher earners hit hardest.</strong> Workers earning £65,000 to £125,000 pay {gbp(high.extraTax)} more
            income tax this year. From April 2027 those earning {gbp(next.higherFrom)} to £125,000 pay {gbp(highNext.extraTax)}{" "}
            more. (The frozen NI upper limit saves them {gbp(-high.extraNI)} in NI, so their net extra cost is{" "}
            {gbp(high.total)} this year.)
          </li>
          <li>
            <strong>Minimum wage: 11 fewer tax-free weeks.</strong> In 2021/22 a full-time National Living Wage worker earned{" "}
            {mwFirst.weeksTaxFree.toFixed(1)} weeks of pay before reaching the £12,570 allowance. Today it is{" "}
            {mwNow.weeksTaxFree.toFixed(1)} weeks, and from April 2027 it will be {mwNext.weeksTaxFree.toFixed(1)} weeks.
            Income tax now takes {mwNow.taxShare.toFixed(1)}% of their gross pay, up from {mwFirst.taxShare.toFixed(1)}% in
            2021/22.
          </li>
          <li>
            <strong>Five years of extra tax.</strong> A worker on £30,000 in 2021/22 whose pay tracked inflation has paid{" "}
            {gbp(real[1].extraTax5yrs)} more income tax over the five tax years from 2022/23 to 2026/27. A worker who started
            on £50,000 has paid {gbp(real[3].extraTax5yrs)} more.
          </li>
        </ol>

        <h2>The story</h2>
        <p>
          When the personal allowance was frozen at £12,570 in April 2021, inflation was low. Then prices rose 10.1% in the
          year to September 2022 and 6.7% in the year to September 2023. Under the normal rule, the allowance and the 40%
          threshold rise each April by the previous September&apos;s inflation rate. That rule was switched off, so the
          thresholds stayed where they were while wages and prices moved up.
        </p>
        <p>
          The November 2025 Budget extended the freeze to April 2031, ten years in total, and the October 2026 Budget left
          it in place. Inflation of 3.5% in the year to September 2026 is the figure that would have set the thresholds for
          April 2027. Without the freeze, the personal allowance would be {gbp(now.pa)} today and {gbp(next.pa)} next April.
          The 40% threshold would be {gbp(now.higherFrom)} today and {gbp(next.higherFrom)} next April.
        </p>
        <p>
          The gap is now so wide that someone whose pay has done nothing more than keep up with prices can find themselves
          in a higher tax band than before. They are no better off in real terms, but they pay a bigger share of their pay in
          tax.
        </p>

        <figure className="research-chart">
          <img src={`${FILES}/${CHARTS[1].file}`} alt={CHARTS[1].alt} width={1800} height={1012} loading="lazy" />
          <figcaption>{CHARTS[1].caption}. Free to use with a credit and link to uksalarytools.co.uk.</figcaption>
        </figure>

        <h2>What the freeze costs you this year (2026/27)</h2>
        <div className="table-wrap">
          <table className="breakdown compact">
            <thead><tr><th scope="col">Salary</th><th scope="col">Extra income tax</th><th scope="col">Extra NI</th><th scope="col">Total extra</th></tr></thead>
            <tbody>
              {table2026.map((r) => (
                <tr key={r.label}><th scope="row">{r.label}</th><td>{gbp(r.c.extraTax)}</td><td>{gbp(r.c.extraNI)}</td><td><b>{gbp(r.c.total)}</b></td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>What it will cost from April 2027 (2027/28)</h2>
        <div className="table-wrap">
          <table className="breakdown compact">
            <thead><tr><th scope="col">Salary</th><th scope="col">Extra income tax</th><th scope="col">Extra NI</th><th scope="col">Total extra</th></tr></thead>
            <tbody>
              {table2027.map((r) => (
                <tr key={r.label}><th scope="row">{r.label}</th><td>{gbp(r.c.extraTax)}</td><td>{gbp(r.c.extraNI)}</td><td><b>{gbp(r.c.total)}</b></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">A minus figure means the frozen NI upper earnings limit saves that much NI.</p>

        <figure className="research-chart">
          <img src={`${FILES}/${CHARTS[0].file}`} alt={CHARTS[0].alt} width={1800} height={1012} loading="lazy" />
          <figcaption>{CHARTS[0].caption}. Free to use with a credit and link to uksalarytools.co.uk.</figcaption>
        </figure>

        <h2>Same real pay, higher tax band</h2>
        <div className="table-wrap">
          <table className="breakdown compact">
            <thead>
              <tr><th scope="col">Salary in 2021/22</th><th scope="col">Same pay in 2026/27 (inflation-matched)</th><th scope="col">Tax band now</th><th scope="col">Tax band if thresholds indexed</th><th scope="col">Extra income tax, 2022/23 to 2026/27</th></tr>
            </thead>
            <tbody>
              {real.map((r) => (
                <tr key={r.base}><th scope="row">{gbp(r.base)}</th><td>{gbp(r.now)}</td><td>{r.bandNow}</td><td>{r.bandIndexed}</td><td><b>{gbp(r.extraTax5yrs)}</b></td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Minimum-wage workers</h2>
        <div className="table-wrap">
          <table className="breakdown compact">
            <thead>
              <tr><th scope="col">Tax year</th><th scope="col">National Living Wage</th><th scope="col">Weeks of full-time work before tax</th><th scope="col">Income tax share of full-time pay</th></tr>
            </thead>
            <tbody>
              {mw.map((m) => (
                <tr key={m.year}><th scope="row">{m.year}</th><td>£{m.nlw.toFixed(2)}</td><td>{m.weeksTaxFree.toFixed(1)}</td><td>{m.taxShare.toFixed(1)}%</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          A full-time minimum-wage worker pays {gbp(mwNow.tax)} income tax this year. With inflation-linked thresholds it
          would be {gbp(nlwTaxIndexed("2026/27"))}.
        </p>
        <p className="muted">
          Full time is 37.5 hours a week. The National Living Wage applied from age 23 until March 2024 and from age 21
          since April 2024.
        </p>

        <figure className="research-chart">
          <img src={`${FILES}/${CHARTS[2].file}`} alt={CHARTS[2].alt} width={1800} height={1012} loading="lazy" />
          <figcaption>{CHARTS[2].caption}. Free to use with a credit and link to uksalarytools.co.uk.</figcaption>
        </figure>

        <h2>Check your own figure</h2>
        <p>
          Use our <Link href="/">salary calculator</Link> to see your take-home pay under today&apos;s frozen thresholds, or
          see the <Link href="/data/uk-take-home-pay-2026-27">take-home pay for every salary from £15k to £150k</Link>.
        </p>

        <h2 id="data">Download the data</h2>
        <p>
          Free to use with a credit and link to uksalarytools.co.uk (
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>).
        </p>
        <ul>
          {DOWNLOADS.map((d) => (
            <li key={d.file}><a href={`${FILES}/${d.file}`} download>{d.label}</a></li>
          ))}
        </ul>

        <h2>How we worked it out</h2>
        <ul>
          <li>
            Thresholds are uprated each April by the previous September&apos;s CPI, as income tax law sets by default: the
            allowance rounded up to the next £10 and the basic rate band to the next £100. CPI used:{" "}
            {FREEZE_YEARS.filter((y) => y.cpiSeptBefore !== null).map((y) => `${y.year} ${y.cpiSeptBefore}%`).join(", ")}.
          </li>
          <li>England, Wales and Northern Ireland income tax. Scotland sets its own bands, but the personal allowance freeze applies there too.</li>
          <li>Today&apos;s rates in every year: 20%, 40% and 45% income tax, 8% and 2% employee NI. No pension, student loan or other deductions.</li>
          <li>The £100,000 allowance taper point and the £125,140 additional-rate threshold stay as they are, since the law does not index them.</li>
          <li>NI thresholds move with the allowance and the 40% threshold, as they have been aligned since 2022/23.</li>
          <li>&quot;Pay tracked inflation&quot; means pay rose each year by the same CPI figure used to uprate the thresholds.</li>
        </ul>
        <p className="note">
          Sources: ONS consumer price inflation; GOV.UK income tax rates and thresholds; GOV.UK policy paper on maintaining
          thresholds until 5 April 2031; GOV.UK National Minimum Wage and National Living Wage rates. Questions or
          corrections: see <Link href="/methodology#corrections">how we calculate</Link>.
        </p>
      </article>
    </>
  );
}
