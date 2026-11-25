/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { JsonLd, Faqs, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { SalaryNeededChart, CostBreakdownChart } from "@/components/CityCharts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { calculate, gbp } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";
import {
  cityResults,
  COL_ASSUMPTIONS,
  COL_PHOTOS,
  COL_RENTS_MONTH,
  COL_UPDATED,
  COL_UPDATED_ISO,
  ENERGY_MONTHLY,
} from "@/lib/costOfLiving";

const PATH = "/salary-needed-to-live-uk-cities";
const URL = SITE_URL + PATH;
const TITLE = "Salary Needed to Live in UK Cities 2026/27: London vs 9 Cities";

export const metadata: Metadata = {
  title: shortTitle("/salary-needed-to-live-uk-cities"),
  description:
    "How much you need to earn to live alone in London, Manchester, Birmingham, Edinburgh, Cardiff and 5 more UK cities in 2026/27. Rent, bills and pay compared.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "What salary do you need to live in UK cities? (2026/27)",
    description: "Rent, council tax, energy and take-home pay for 10 UK cities, from ONS and Ofgem data.",
    url: PATH,
    type: "article",
    images: [{ url: COL_PHOTOS.hero.src, width: COL_PHOTOS.hero.width, height: COL_PHOTOS.hero.height, alt: COL_PHOTOS.hero.alt }],
  },
};

const pounds = (n: number) => gbp(n, 0);
const net = (gross: number, region: "ruk" | "scotland") => calculate({ gross, region }).takeHome;

export default function SalaryNeededPage() {
  const results = cityResults();
  const top = results[0];
  const second = results[1];
  const bottom = results[results.length - 1];
  const london = results.find((r) => r.slug === "london")!;
  const manchester = results.find((r) => r.slug === "manchester")!;
  const outside = results.filter((r) => r.slug !== "london");
  const avgOutside = Math.round(outside.reduce((s, r) => s + r.comfortableSalary, 0) / outside.length / 100) * 100;
  const fastest = [...results].sort((a, b) => b.rentChange - a.rentChange)[0];
  const scot = results.filter((r) => r.region === "scotland");
  const scotSalary = scot[0]?.comfortableSalary ?? 45000;
  const scotGap = (g: number) => net(g, "ruk") - net(g, "scotland");
  const under30k = results.filter((r) => r.comfortableSalary <= 30000).map((r) => r.name);
  const minUnder30k = results.filter((r) => r.minSalary <= 30000).length;

  const faqs = [
    {
      q: "What salary do you need to live alone in London in 2026?",
      a: `About ${pounds(london.comfortableSalary)} a year to live comfortably alone in a one-bed flat, and at least ${pounds(london.minSalary)} just to cover essentials. Rent alone averages ${pounds(london.rentOneBed)} a month for a one-bedroom home (ONS, ${COL_RENTS_MONTH}).`,
    },
    {
      q: "Which UK city needs the lowest salary?",
      a: `${bottom.name}, at about ${pounds(bottom.comfortableSalary)} a year for a comfortable single life, because one-bed rents average ${pounds(bottom.rentOneBed)} a month.`,
    },
    {
      q: "How much do you need to earn to live in Manchester?",
      a: `About ${pounds(manchester.comfortableSalary)} a year to live comfortably alone, with essentials of about ${pounds(manchester.essentials)} a month including ${pounds(manchester.rentOneBed)} rent for a one-bed.`,
    },
    {
      q: "Is £30,000 a good salary outside London?",
      a: `£30,000 gives take-home pay of about ${gbp(net(30000, "ruk") / 12, 0)} a month in England in 2026/27. That covers the minimum in ${minUnder30k} of the 10 cities in our table${under30k.length ? `, and is enough to live comfortably alone in ${under30k.join(" and ")}` : ", but is below the comfortable level in all of them"}.`,
    },
    {
      q: "How is the salary needed worked out?",
      a: "We add up monthly essentials (rent, council tax, energy, water, broadband, groceries and transport), then use the 50/30/20 rule: essentials should be no more than half of take-home pay. We then work back from that take-home pay to the gross salary, using 2026/27 Income Tax and National Insurance.",
    },
    {
      q: "Do Scottish cities need a higher salary because of tax?",
      a: `Slightly, at higher incomes. On ${pounds(scotSalary)} a Scottish taxpayer takes home about ${pounds(scotGap(scotSalary))} a year less than someone in England, mostly because the 42% higher rate starts at £43,663.`,
    },
  ];

  const embedCode = `<a href="${URL}">Salary needed to live in UK cities (2026/27)</a> – source: ${SITE_NAME}`;

  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Guides", url: `${SITE_URL}/guides` },
            { name: "Salary needed to live in UK cities", url: URL },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Salary Needed to Live in UK Cities (2026/27)",
            datePublished: COL_UPDATED_ISO,
            dateModified: COL_UPDATED_ISO,
            image: COL_PHOTOS.hero.src,
            author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            mainEntityOfPage: URL,
          },
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Salary needed to live in 10 UK cities, 2026/27",
            description: "Monthly essential costs and the gross salary needed for one adult renting a one-bed home in 10 UK cities.",
            url: URL,
            dateModified: COL_UPDATED_ISO,
            creator: { "@type": "Organization", name: SITE_NAME },
            license: "https://creativecommons.org/licenses/by/4.0/",
          },
        ]}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › <Link href="/guides">Guides</Link>
      </nav>

      <header className="col-hero">
        <img
          src={COL_PHOTOS.hero.src}
          alt={COL_PHOTOS.hero.alt}
          width={COL_PHOTOS.hero.width}
          height={COL_PHOTOS.hero.height}
          fetchPriority="high"
        />
        <div className="col-hero-text">
          <p className="col-kicker">2026/27 cost of living data</p>
          <h1>What salary do you need to live in UK cities?</h1>
          <Byline />
          <p>
            Rent, bills and take-home pay for one person living alone in 10 UK cities, from the latest ONS rent data and
            the 2026/27 tax rates.
          </p>
        </div>
        <p className="col-credit">
          Photo: <a href={COL_PHOTOS.hero.photoUrl}>London</a> by <a href={COL_PHOTOS.hero.creditUrl}>{COL_PHOTOS.hero.credit}</a> on Unsplash
        </p>
      </header>
      <p className="muted col-meta">
        By {SITE_NAME} · Updated <time dateTime={COL_UPDATED_ISO}>{COL_UPDATED}</time> · Rents to {COL_RENTS_MONTH}
      </p>

      <div className="prose">
        <h2>Key findings</h2>
        <div className="summary-cards">
          <div className="hl">
            <span>Live comfortably alone in London</span>
            <strong>{pounds(london.comfortableSalary)}</strong>
          </div>
          <div>
            <span>Average of the 9 other cities</span>
            <strong>{pounds(avgOutside)}</strong>
          </div>
          <div>
            <span>{bottom.name}, the lowest in our list</span>
            <strong>{pounds(bottom.comfortableSalary)}</strong>
          </div>
        </div>
        <ul>
          <li>
            {top.name} needs {pounds(top.comfortableSalary - bottom.comfortableSalary)} a year more than {bottom.name}. Rent
            explains almost all of the gap.
          </li>
          <li>
            Rent is {Math.round((london.rentOneBed / london.comfortableMonthlyNet) * 100)}% of a comfortable take-home pay
            in London, against {Math.round((bottom.rentOneBed / bottom.comfortableMonthlyNet) * 100)}% in {bottom.name}.
          </li>
          <li>
            {second.name} is the most expensive city outside London, with one-bed rents of {pounds(second.rentOneBed)} and
            rents up {second.rentChange}% in a year.
          </li>
        </ul>

        <h2>Salary needed in each city</h2>
        <p>
          The <strong>minimum</strong> salary covers essentials with 20% of take-home pay left over. The{" "}
          <strong>comfortable</strong> salary follows the 50/30/20 rule: essentials take half your pay, leaving 30% for
          things you want and 20% for savings.
        </p>
      </div>

      <SalaryNeededChart data={results} />

      <div className="prose">
        <div className="table-scroll">
          <table>
            <caption className="col-caption">Monthly costs and salary needed, one adult in a one-bed home, 2026/27</caption>
            <thead>
              <tr>
                <th scope="col">City</th>
                <th scope="col">1-bed rent</th>
                <th scope="col">Council tax</th>
                <th scope="col">All essentials</th>
                <th scope="col">Minimum salary</th>
                <th scope="col">Comfortable salary</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.slug}>
                  <th scope="row">{r.name}</th>
                  <td>{pounds(r.rentOneBed)}</td>
                  <td>{pounds(r.councilTax)}</td>
                  <td>{pounds(r.essentials)}</td>
                  <td>{pounds(r.minSalary)}</td>
                  <td><strong>{pounds(r.comfortableSalary)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">
          Salaries are gross (before tax), rounded up to the nearest £100, with no student loan or pension. Edinburgh and
          Glasgow use Scottish Income Tax.
        </p>
        <div className="card trust-box">
          <p>
            <strong>See your own numbers.</strong> Use the <Link href="/">take home pay calculator</Link> to check a
            salary, or the <Link href="/net-to-gross-salary-calculator">net to gross calculator</Link> to work back from
            the monthly pay you need. Living in Scotland? Try the <Link href="/scotland-salary-calculator">Scotland salary calculator</Link>.
          </p>
        </div>

        <h2>Where the money goes</h2>
        <p>
          Rent is the biggest cost everywhere. Energy (about {pounds(ENERGY_MONTHLY)} a month under the Ofgem price cap) and
          groceries cost about the same in every city, so the difference between cities is mostly rent, plus council tax
          and transport.
        </p>
      </div>

      <CostBreakdownChart data={results} />

      <div className="prose">
        <h2>London vs the rest of the UK</h2>
        <p>
          A one-bed home in London costs {pounds(london.rentOneBed)} a month on average, and the average for all property
          sizes is {pounds(london.rentAll)}. You need about {pounds(london.comfortableSalary - avgOutside)} a year more to
          live comfortably in London than the average of the other nine cities.
        </p>
        <figure className="col-photo">
          <img
            src={COL_PHOTOS.manchester.src}
            alt={COL_PHOTOS.manchester.alt}
            width={COL_PHOTOS.manchester.width}
            height={COL_PHOTOS.manchester.height}
            loading="lazy"
          />
          <figcaption className="muted">
            Manchester, where a comfortable single life needs about {pounds(manchester.comfortableSalary)}. Photo by{" "}
            <a href={COL_PHOTOS.manchester.creditUrl}>{COL_PHOTOS.manchester.credit}</a> on{" "}
            <a href={COL_PHOTOS.manchester.photoUrl}>Unsplash</a>.
          </figcaption>
        </figure>
        <p>
          A one-bed in Manchester costs {Math.round((manchester.rentOneBed / london.rentOneBed) * 100)}% of the London
          price, and in {bottom.name} just {Math.round((bottom.rentOneBed / london.rentOneBed) * 100)}%. {fastest.name} had
          the fastest rent rise in our list, up {fastest.rentChange}% in a year.
        </p>

        <h2>Scotland: lower council tax, higher income tax</h2>
        <p>
          Edinburgh and Glasgow have some of the lowest council tax in our list, but Scottish taxpayers pay 21% from
          £29,527 and 42% from £43,663. On £45,000 you take home about {pounds(scotGap(45000))} a year less than in
          England. Scottish rent figures cover the wider Lothian and Greater Glasgow areas.
        </p>

        <h2>How we worked it out</h2>
        <ul>
          {COL_ASSUMPTIONS.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <p>
          Tax is worked out with the same engine as our <Link href="/">salary calculator</Link>: the £12,570 Personal
          Allowance, 20%/40%/45% Income Tax (Scottish rates in Scotland) and employee National Insurance of 8% between
          £12,570 and £50,270, then 2%.
        </p>

        <div className="card col-embed">
          <h2>Use this data</h2>
          <p>
            Journalists, bloggers and students are welcome to use these figures and charts. Please credit {SITE_NAME} and
            link to this page:
          </p>
          <pre>
            <code>{embedCode}</code>
          </pre>
        </div>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
