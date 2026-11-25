import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import StepsCalculator from "@/components/StepsCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { stepsToDistance } from "@/lib/health";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";
import { NOINDEX } from "@/lib/tools";

export const metadata: Metadata = {
  title: shortTitle("/steps-to-miles-calculator"),
  robots: NOINDEX,
  description: "Convert steps to miles or km using your height and pace. See how far 5,000, 10,000 and 20,000 steps really are for you.",
  alternates: { canonical: "/steps-to-miles-calculator" },
};

const faqs = [
  { q: "How far is 10,000 steps?", a: "About 4 to 5 miles for most adults, or 6.5 to 8 km. It depends on your stride length, which depends mainly on your height." },
  { q: "How many steps are in a mile?", a: "Between about 2,000 and 2,500 walking steps for most adults. Taller people take fewer steps per mile." },
  {
    q: "How long does it take to walk 10,000 steps?",
    a: "Roughly 1 hour 30 to 1 hour 45 minutes at a normal pace, usually spread across the day.",
  },
  {
    q: "Do I need 10,000 steps a day?",
    a: "It is a popular target rather than a medical threshold. NHS guidance is framed as at least 150 minutes of moderate activity a week, and brisk walking counts.",
  },
  { q: "Why does my phone show a different distance?", a: "Phones and watches use their own stride estimate or GPS, so small differences are normal." },
];

const HEIGHTS = [
  { cm: 152, label: "152 cm (5 ft 0)" },
  { cm: 160, label: "160 cm (5 ft 3)" },
  { cm: 170, label: "170 cm (5 ft 7)" },
  { cm: 180, label: "180 cm (5 ft 11)" },
  { cm: 188, label: "188 cm (6 ft 2)" },
];
const STEPS = [1000, 2000, 5000, 7500, 10000, 15000, 20000];
// Average of the two walking stride factors (0.413 and 0.415).
const stride = (cm: number) => (cm / 100) * 0.414;

export default function Page() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("Steps to Miles Calculator", `${SITE_URL}/steps-to-miles-calculator`, "HealthApplication")]} />
      <h1>Steps to Miles Calculator</h1>
      <Byline />
      <p className="lead">
        Enter your step count and height. The calculator estimates your stride length and converts your steps into miles and kilometres, or turns a distance
        back into steps.
      </p>
      <StepsCalculator />

      <div className="prose">
        <h2>How many steps are in a mile?</h2>
        <p>
          For most adults, between 2,000 and 2,500 walking steps. The exact figure depends on your stride, which depends mainly on your height and how fast you
          are moving.
        </p>

        <h2>The calculation</h2>
        <ol>
          <li>
            <strong>Estimate stride length.</strong> Walking stride is roughly height × 0.413 for women and height × 0.415 for men.
          </li>
          <li>
            <strong>Work out steps per mile.</strong> A mile is 1,609 metres, so divide 1,609 by your stride in metres.
          </li>
          <li>
            <strong>Convert.</strong> Divide your step count by your steps per mile.
          </li>
        </ol>
        <p>
          <strong>Example:</strong> someone 170 cm tall has a stride of about 0.70 m. That is about{" "}
          {Math.round(stepsToDistance(1, stride(170)).stepsPerMile / 10) * 10} steps per mile, so 10,000 steps is roughly{" "}
          <strong>{stepsToDistance(10000, stride(170)).miles.toFixed(1)} miles</strong>.
        </p>

        <h2>Steps to miles by height</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Height</th>
                <th>Steps per mile</th>
                <th>5,000 steps</th>
                <th>10,000 steps</th>
              </tr>
            </thead>
            <tbody>
              {HEIGHTS.map((h) => {
                const s = stride(h.cm);
                return (
                  <tr key={h.cm}>
                    <td>{h.label}</td>
                    <td>about {(Math.round(stepsToDistance(1, s).stepsPerMile / 10) * 10).toLocaleString("en-GB")}</td>
                    <td>{stepsToDistance(5000, s).miles.toFixed(1)} miles</td>
                    <td>{stepsToDistance(10000, s).miles.toFixed(1)} miles</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2>Steps to miles and km (170 cm walker)</h2>
        <table>
          <thead>
            <tr>
              <th>Steps</th>
              <th>Miles</th>
              <th>Kilometres</th>
            </tr>
          </thead>
          <tbody>
            {STEPS.map((n) => {
              const d = stepsToDistance(n, stride(170));
              return (
                <tr key={n}>
                  <td>{n.toLocaleString("en-GB")}</td>
                  <td>{d.miles.toFixed(1)}</td>
                  <td>{d.km.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted">All figures are estimates from average stride length.</p>

        <h2>Walking versus running</h2>
        <p>
          Your stride lengthens when you run, so you take fewer steps to cover the same ground, often 1,400 to 1,700 per mile. Pick Running in the calculator for
          a closer figure.
        </p>

        <h2>Measure your own stride</h2>
        <p>
          For a more accurate result, walk 20 normal steps in a straight line, measure the distance in centimetres and divide by 20. Enter that as your stride
          length.
        </p>
        <p>
          Related: the <Link href="/tdee-calculator">TDEE calculator</Link> estimates the calories you burn in a day, and the{" "}
          <Link href="/as-the-crow-flies-distance-calculator">distance calculator</Link> measures the straight line between two places.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
