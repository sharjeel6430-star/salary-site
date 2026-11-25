import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import GradeCalculator from "@/components/GradeCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { overallAverage, requiredFinalYear } from "@/lib/grades";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";
import { NOINDEX } from "@/lib/tools";

export const metadata: Metadata = {
  title: shortTitle("/university-grade-calculator"),
  robots: NOINDEX,
  description:
    "Enter your module marks and credits to see your weighted average and predicted degree class. Find out what you need in final year for a First or 2:1.",
  alternates: { canonical: "/university-grade-calculator" },
};

const faqs = [
  {
    q: "Does first year count towards my degree?",
    a: "At most UK universities, no. You need to pass it to progress, but the mark is not part of the classification. A minority of courses give it a small weight.",
  },
  {
    q: "Is 69.5% a First?",
    a: "It depends on your university's rounding and borderline policy. Many round to the nearest whole number, which would make it 70. Others do not round but consider borderline cases individually.",
  },
  { q: "What is a 2:1 as a percentage?", a: "An overall weighted average of 60 to 69%." },
  {
    q: "Can I still get a 2:1 after a poor second year?",
    a: "Often, yes, because final year usually carries more weight. Enter your second-year modules, leave the final year average blank, and the calculator shows the final-year average you need.",
  },
  {
    q: "Do employers care about the difference between a 2:1 and a 2:2?",
    a: "Many graduate schemes set a 2:1 as a minimum entry requirement, though a growing number have dropped it. Check the entry criteria for the roles you are aiming at.",
  },
];

const SECOND_YEAR = [50, 55, 58, 62, 65, 68];

export default function Page() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("University Grade Calculator", `${SITE_URL}/university-grade-calculator`, "EducationalApplication")]} />
      <h1>Uni Grade Calculator: Work Out Your Degree Classification</h1>
      <Byline />
      <p className="lead">
        Enter your module marks and credits to see your weighted average and the degree class it points to. Leave the final year blank to find out what you need
        to score for the grade you want.
      </p>
      <GradeCalculator />

      <div className="prose">
        <h2>How UK degree classifications work</h2>
        <p>Most UK undergraduate honours degrees are graded on the same scale:</p>
        <table>
          <thead>
            <tr>
              <th>Classification</th>
              <th>Usual mark</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>First class (1st)</td>
              <td>70% and above</td>
            </tr>
            <tr>
              <td>Upper second (2:1)</td>
              <td>60 to 69%</td>
            </tr>
            <tr>
              <td>Lower second (2:2)</td>
              <td>50 to 59%</td>
            </tr>
            <tr>
              <td>Third class (3rd)</td>
              <td>40 to 49%</td>
            </tr>
            <tr>
              <td>Fail</td>
              <td>Below 40%</td>
            </tr>
          </tbody>
        </table>
        <p>
          Your final classification is not a simple average of every mark you have ever received. It is a weighted average, and two things set the weights: how
          many credits each module carries, and how much each year of study counts.
        </p>

        <h2>Step 1: Weight each module by its credits</h2>
        <p>
          A full-time year is normally 120 credits, split into modules of 15, 20, 30 or 40 credits. A 40-credit dissertation counts twice as much as a 20-credit
          module. To get your average for a year, multiply each module mark by its credits, add the results together, and divide by the total credits.
        </p>
        <p>
          <strong>Example:</strong> three modules in one year.
        </p>
        <ul>
          <li>Module A: 68% at 20 credits = 1,360</li>
          <li>Module B: 72% at 20 credits = 1,440</li>
          <li>Dissertation: 64% at 40 credits = 2,560</li>
        </ul>
        <p>
          Total 5,360 divided by 80 credits = <strong>67%</strong>, a 2:1.
        </p>

        <h2>Step 2: Weight each year</h2>
        <p>
          At most universities the first year has to be passed but does not count towards your classification. The second and final years count, and the final
          year usually counts for more. Splits such as 40/60 or 33/67 are common, and some universities use 25/75 or count the two years equally.
        </p>
        <p>
          <strong>Example:</strong> 62% in second year and 68% in final year on a 40/60 split gives (62 × 0.4) + (68 × 0.6) ={" "}
          <strong>{overallAverage(62, 68, 0.4).toFixed(1)}%</strong>, a 2:1. The same marks on a 25/75 split give {overallAverage(62, 68, 0.25).toFixed(1)}%. The
          weighting matters, so check your course handbook before you rely on any number.
        </p>

        <h2>What do I need for a 2:1 or a First?</h2>
        <p>
          Work backwards from your target. Take the mark you want, subtract what you have already banked, and divide by the weight still to come. The table shows
          the final-year average needed on a 40/60 split.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Second year average</th>
                <th>Needed for a 2:2 (50%)</th>
                <th>Needed for a 2:1 (60%)</th>
                <th>Needed for a First (70%)</th>
              </tr>
            </thead>
            <tbody>
              {SECOND_YEAR.map((s) => (
                <tr key={s}>
                  <td>{s}%</td>
                  {[50, 60, 70].map((t) => {
                    const need = requiredFinalYear(s, 0.4, t)!;
                    return <td key={t}>{need > 100 ? "Not reachable" : `${need.toFixed(1)}%`}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Why your university&apos;s result may differ</h2>
        <p>A calculator gives a prediction, not a guarantee. Universities apply their own rules on top of the basic average:</p>
        <ul>
          <li>
            <strong>Borderline rules.</strong> Many universities will lift a student sitting just below a boundary, for example 68 or 69%, if enough of their
            credits are in the higher class.
          </li>
          <li>
            <strong>Dropping the lowest marks.</strong> Some discount your weakest 10 to 20 credits.
          </li>
          <li>
            <strong>Two methods, best result.</strong> Some run more than one algorithm and award whichever is higher.
          </li>
          <li>
            <strong>Placement and study-abroad years</strong> are often pass or fail, or carry a small weight.
          </li>
          <li>
            <strong>Integrated master&apos;s degrees</strong> spread the weighting across three counted years.
          </li>
          <li>
            <strong>Scotland.</strong> Four-year honours degrees usually count only the last two years.
          </li>
        </ul>
        <p>Your course handbook or academic regulations will state the exact method.</p>

        <h2>After you graduate</h2>
        <p>
          Once you have a job offer, see what it pays after tax with the <Link href="/">take home pay calculator</Link>, or check how your student loan affects
          your pay in the <Link href="/monthly-salary-calculator">monthly salary calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
