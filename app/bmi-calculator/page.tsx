import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import BmiCalculator from "@/components/BmiCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { bmi, healthyWeightRange, kgToStones } from "@/lib/health";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";
import { NOINDEX } from "@/lib/tools";

export const metadata: Metadata = {
  title: shortTitle("/bmi-calculator"),
  robots: NOINDEX,
  description:
    "Check your BMI in kg and cm or stones and feet. See the healthy range for adults, how age and sex affect the result, and what BMI misses.",
  alternates: { canonical: "/bmi-calculator" },
};

const faqs = [
  { q: "What is a healthy BMI for a woman?", a: "18.5 to 24.9, the same as for men. The NHS uses one set of ranges for all adults." },
  { q: "What is a healthy BMI for a man?", a: "18.5 to 24.9. Men typically carry more muscle than women at the same BMI, but the ranges are the same." },
  {
    q: "What is a healthy weight for my height?",
    a: "The calculator shows it for your height. For someone 1.75 m tall it is roughly 57 to 76 kg.",
  },
  { q: "Is BMI accurate if I lift weights?", a: "Less so, because BMI cannot tell muscle from fat. Use your waist measurement or body fat percentage alongside it." },
  {
    q: "Can I use BMI for my child?",
    a: "Only with a child-specific centile calculator that takes age and sex into account, such as the NHS one. The adult ranges do not apply under 18.",
  },
];

const HEIGHTS = [150, 155, 160, 165, 170, 175, 180, 185, 190];
const st = (kg: number) => {
  const s = kgToStones(kg);
  return `${s.stones} st ${s.lb} lb`;
};

export default function Page() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("BMI Calculator", `${SITE_URL}/bmi-calculator`, "HealthApplication")]} />
      <h1>BMI Calculator for Men and Women</h1>
      <Byline />
      <p className="lead">
        Enter your height, weight, age and sex, in metric or imperial. You will see your body mass index, the category it falls in and the weight range that
        counts as healthy for your height.
      </p>
      <BmiCalculator />

      <div className="prose">
        <h2>How BMI is calculated</h2>
        <p>BMI is your weight in kilograms divided by your height in metres squared.</p>
        <p>
          <strong>Example:</strong> 70 kg and 1.75 m tall. 1.75 × 1.75 = 3.06, and 70 ÷ 3.06 = <strong>{bmi(70, 175).toFixed(1)}</strong>.
        </p>
        <p>In imperial units the calculator converts for you: 1 stone is 6.35 kg and 1 inch is 2.54 cm.</p>

        <h2>BMI ranges for adults</h2>
        <table>
          <thead>
            <tr>
              <th>BMI</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Below 18.5</td>
              <td>Underweight</td>
            </tr>
            <tr>
              <td>18.5 to 24.9</td>
              <td>Healthy weight</td>
            </tr>
            <tr>
              <td>25 to 29.9</td>
              <td>Overweight</td>
            </tr>
            <tr>
              <td>30 to 39.9</td>
              <td>Obese</td>
            </tr>
            <tr>
              <td>40 and above</td>
              <td>Severely obese</td>
            </tr>
          </tbody>
        </table>
        <p>These are the ranges the NHS uses for adults.</p>

        <h2>Healthy weight by height</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Height</th>
                <th>Healthy weight (kg)</th>
                <th>Healthy weight (stones)</th>
              </tr>
            </thead>
            <tbody>
              {HEIGHTS.map((h) => {
                const r = healthyWeightRange(h);
                return (
                  <tr key={h}>
                    <td>{h} cm</td>
                    <td>
                      {r.minKg.toFixed(0)} to {r.maxKg.toFixed(0)} kg
                    </td>
                    <td>
                      {st(r.minKg)} to {st(r.maxKg)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">A BMI from 18.5 up to 25, for adults.</p>

        <h2>Is BMI different for men and women?</h2>
        <p>
          The formula and the ranges are the same. What differs is body composition: at the same BMI, women typically carry more body fat than men, and men more
          muscle. That is why sex is useful context for reading the result even though it does not change the number.
        </p>

        <h2>Does age change your BMI?</h2>
        <ul>
          <li>
            <strong>Adults 18 and over:</strong> the same ranges apply at every age. In older adults BMI can understate body fat because muscle is lost with age.
          </li>
          <li>
            <strong>Children and teenagers (2 to 17):</strong> BMI is compared with others of the same age and sex and reported as a centile, not against the
            adult ranges.
          </li>
        </ul>

        <h2>Ethnic background</h2>
        <p>
          People from Asian, Black African, African-Caribbean and Middle Eastern backgrounds face a higher risk of conditions such as type 2 diabetes at a lower
          BMI. For these groups UK guidance uses 23 as the threshold for increased risk and 27.5 for high risk. Tick the box in the calculator to apply them.
        </p>

        <h2>What BMI does not tell you</h2>
        <ul>
          <li>It cannot separate muscle from fat, so athletes can score as overweight.</li>
          <li>It says nothing about where fat sits. Waist size is a useful second check: aim for a waist below half your height.</li>
          <li>It is not valid during pregnancy.</li>
        </ul>
        <p>BMI is a screening measure, not a diagnosis. If your result worries you, talk to your GP.</p>
        <p>
          Related: estimate your daily calories with the <Link href="/tdee-calculator">TDEE calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
