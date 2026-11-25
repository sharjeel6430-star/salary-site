import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Byline } from "@/components/Byline";
import { TakeHomeChart, ScotlandChart, TakeHomeTable } from "@/components/TakeHomeDataExplorer";
import { ORG_ID, SITE_NAME, SITE_URL } from "@/lib/site";
import { LAST_REVIEWED_ISO } from "@/lib/sources";
import { DATA_CSV_PATH, DATA_PATH, headlineFacts, takeHomeTable } from "@/lib/takeHomeData";

const TITLE = "UK Take-Home Pay 2026/27: Every Salary £15k–£150k";
const DESCRIPTION =
  "Free dataset: Income Tax, NI, take-home pay, marginal rate, Scotland and student loans for 136 UK salaries from £15,000 to £150,000 in 2026/27. CSV download.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: DATA_PATH },
};

const gbp = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");

export default function TakeHomeData() {
  const rows = takeHomeTable();
  const fx = headlineFacts();
  const url = `${SITE_URL}${DATA_PATH}`;
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "UK take-home pay 2026/27 for every salary from £15,000 to £150,000",
            description:
              "Annual Income Tax, employee National Insurance, take-home pay (yearly and monthly), effective and marginal tax rates, Scottish take-home pay and the difference from the rest of the UK, and Plan 2 and Plan 5 student loan repayments, for each £1,000 of salary from £15,000 to £150,000 in the 2026/27 UK tax year. Standard 1257L tax code, no pension or other deductions. Calculated with HMRC rates and thresholds.",
            url,
            sameAs: url,
            keywords: ["UK take-home pay", "salary after tax", "Income Tax", "National Insurance", "marginal tax rate", "Scottish income tax", "student loan repayments", "2026/27"],
            creator: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: SITE_URL },
            publisher: { "@id": ORG_ID },
            isAccessibleForFree: true,
            license: "https://creativecommons.org/licenses/by/4.0/",
            dateModified: LAST_REVIEWED_ISO,
            temporalCoverage: "2026-04-06/2027-04-05",
            spatialCoverage: { "@type": "Place", name: "United Kingdom" },
            variableMeasured: [
              "Gross salary (£)", "Income Tax (£)", "Employee National Insurance (£)", "Take-home pay (£ a year)",
              "Take-home pay (£ a month)", "Effective rate (%)", "Marginal rate, tax + NI (%)", "Scottish take-home pay (£)",
              "Scotland minus rest of UK (£)", "Plan 2 student loan repayment (£)", "Plan 5 student loan repayment (£)",
            ],
            isBasedOn: [
              "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027",
              "https://www.gov.uk/scottish-income-tax",
              "https://www.gov.uk/repaying-your-student-loan/what-you-pay",
            ],
            distribution: [{ "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${SITE_URL}${DATA_CSV_PATH}` }],
          },
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Salary after tax", url: `${SITE_URL}/salary` },
            { name: "Take-home pay data 2026/27", url },
          ]),
        ]}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › <Link href="/salary">Salary after tax</Link> › Data
      </nav>
      <article className="data-page">
        <p className="data-kicker">Data · 2026/27 tax year</p>
        <h1>UK take-home pay for every salary from £15,000 to £150,000</h1>
        <Byline />
        <p className="lead">
          {rows.length} salaries, worked out using official HMRC rates: Income Tax, National Insurance, the £100k allowance
          taper, Scotland and student loans. Free to republish with a link.
        </p>
        <p>
          <a className="button" href={DATA_CSV_PATH} download>Download the CSV</a>
        </p>

        <div className="data-facts">
          <div><b>{fx.taperMarginal}%</b><span>marginal rate between £100,000 and £125,140, the highest in the UK system</span></div>
          <div><b>{gbp(fx.taperGain)}</b><span>extra take-home from a £25,140 rise, £100k → £125,140 ({fx.taperKeepPence}p in each £1)</span></div>
          <div><b>{gbp(fx.scotlandCrossover)}</b><span>salary where Scottish taxpayers start paying more than the rest of the UK</span></div>
          <div><b>{fx.doublingRatio}×</b><span>doubling pay from £30k to £60k raises take-home by only {fx.doublingRatio}×</span></div>
        </div>

        <h2>Take-home pay and marginal tax rate</h2>
        <div className="card"><TakeHomeChart rows={rows} /></div>

        <h2>Scotland vs the rest of the UK</h2>
        <div className="card"><ScotlandChart rows={rows} /></div>
        <p className="muted">
          Below {gbp(fx.scotlandCrossover)}, Scotland&apos;s 19% starter rate means Scottish taxpayers keep slightly more. Above it they
          pay more, and the gap widens sharply once the 42% higher rate starts. See the{" "}
          <Link href="/scotland-salary-calculator">Scotland take-home pay calculator</Link>.
        </p>

        <h2>Full table</h2>
        <TakeHomeTable rows={rows} />

        <h2>Use this data</h2>
        <p>
          You&apos;re welcome to quote, chart or republish these figures, including commercially, under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. Please credit{" "}
          {SITE_NAME} with a link to this page. <a href={DATA_CSV_PATH} download>Download the CSV</a> (136 rows, 11 columns).
          For any salary not listed, use the <Link href="/">salary calculator</Link>.
        </p>
        <p className="note">
          Assumptions: 2026/27 tax year, standard 1257L tax code, employee Class 1 National Insurance, no pension or other
          deductions. Student loan columns show the annual repayment for that plan only. &quot;Marginal&quot; is combined Income Tax and
          NI on the next pound. Sources: GOV.UK Rates and thresholds for employers 2026 to 2027; GOV.UK Scottish Income Tax;
          GOV.UK Repaying your student loan. <Link href="/methodology">How we calculate</Link>.
        </p>
      </article>
    </>
  );
}
