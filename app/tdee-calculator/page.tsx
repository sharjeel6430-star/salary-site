import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import TdeeCalculator from "@/components/TdeeCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { ACTIVITY_LEVELS, bmr } from "@/lib/health";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";
import { NOINDEX } from "@/lib/tools";

export const metadata: Metadata = {
  title: shortTitle("/tdee-calculator"),
  robots: NOINDEX,
  description:
    "Free TDEE calculator using the Mifflin-St Jeor formula. Enter age, height, weight and activity to see your BMR and maintenance calories.",
  alternates: { canonical: "/tdee-calculator" },
};

const faqs = [
  {
    q: "What is the difference between BMR and TDEE?",
    a: "BMR is what you burn at complete rest. TDEE adds everything else you do in a day, so it is always higher.",
  },
  {
    q: "Which TDEE formula is best?",
    a: "Mifflin-St Jeor is the most widely used for the general population. Katch-McArdle can be closer if you know your body fat percentage.",
  },
  {
    q: "How does this compare with NHS guidance?",
    a: "The NHS uses 2,000 calories a day for women and 2,500 for men as a general guide. TDEE personalises that to your size and activity.",
  },
  {
    q: "How accurate is a TDEE calculator?",
    a: "It is an estimate built from population averages, so your true figure can sit a few hundred calories either side. Most people also overrate their activity level.",
  },
  { q: "Should I recalculate after my weight changes?", a: "Yes. A lighter body burns less and a heavier one burns more, so rerun the numbers every 4 to 5 kg." },
];

export default function Page() {
  const exBmr = bmr({ sex: "female", kg: 65, cm: 165, age: 30 });
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("TDEE Calculator", `${SITE_URL}/tdee-calculator`, "HealthApplication")]} />
      <h1>Free TDEE Calculator: How Many Calories Do You Burn a Day?</h1>
      <Byline />
      <p className="lead">
        Enter your age, sex, height, weight and activity level. The calculator shows your basal metabolic rate (BMR) and your total daily energy expenditure
        (TDEE), the calories you burn in a typical day.
      </p>
      <TdeeCalculator />

      <div className="prose">
        <h2>What TDEE means</h2>
        <p>
          TDEE is the energy your body uses over 24 hours. It has two parts: BMR, the calories needed to keep you alive at rest, and the calories you burn moving,
          working, exercising and digesting food. Eat roughly your TDEE and your weight stays about the same.
        </p>

        <h2>The TDEE formula</h2>
        <p>This calculator uses the Mifflin-St Jeor equation, with weight in kg, height in cm and age in years.</p>
        <ul>
          <li>
            <strong>Men:</strong> BMR = (10 × weight) + (6.25 × height) − (5 × age) + 5
          </li>
          <li>
            <strong>Women:</strong> BMR = (10 × weight) + (6.25 × height) − (5 × age) − 161
          </li>
        </ul>
        <p>Then multiply BMR by an activity factor:</p>
        <table>
          <thead>
            <tr>
              <th>Activity level</th>
              <th>Description</th>
              <th>Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITY_LEVELS.map((a) => (
              <tr key={a.id}>
                <td>{a.label}</td>
                <td>{a.description}</td>
                <td>{a.factor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <strong>Example:</strong> a 30-year-old woman, 65 kg, 165 cm, lightly active. BMR = 650 + 1,031 − 150 − 161 ={" "}
          {Math.round(exBmr).toLocaleString("en-GB")} calories. TDEE = {Math.round(exBmr).toLocaleString("en-GB")} × 1.375 ={" "}
          <strong>about {Math.round(exBmr * 1.375).toLocaleString("en-GB")} calories a day</strong>.
        </p>

        <h2>How accurate is it?</h2>
        <p>
          It is an estimate. Equations like this are built from population averages, so your true figure can sit a few hundred calories either side. Most people
          also overrate their activity level. Treat the result as a starting point, see how your weight behaves over two to three weeks, and adjust.
        </p>

        <h2>Using your number</h2>
        <ul>
          <li>
            <strong>Maintain weight:</strong> eat around your TDEE.
          </li>
          <li>
            <strong>Lose weight:</strong> eat somewhat below it. A moderate, steady change is easier to keep up than a severe one.
          </li>
          <li>
            <strong>Gain weight:</strong> eat somewhat above it, alongside strength training if the aim is muscle.
          </li>
        </ul>
        <p>
          Speak to a GP or registered dietitian before changing your diet if you are pregnant, under 18, managing a medical condition or have a history of
          disordered eating.
        </p>
        <p>
          Related: check your <Link href="/bmi-calculator">BMI</Link>, or convert your daily steps with the{" "}
          <Link href="/steps-to-miles-calculator">steps to miles calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
