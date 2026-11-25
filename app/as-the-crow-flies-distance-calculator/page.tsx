import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import DistanceCalculator from "@/components/DistanceCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { distance, findPlace } from "@/lib/distance";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";
import { NOINDEX } from "@/lib/tools";

export const metadata: Metadata = {
  title: shortTitle("/as-the-crow-flies-distance-calculator"),
  robots: NOINDEX,
  description:
    "Find the straight-line distance between two UK postcodes, towns or coordinates in miles and km, and see how it compares with the road distance.",
  alternates: { canonical: "/as-the-crow-flies-distance-calculator" },
};

const faqs = [
  {
    q: "Is as the crow flies the same as a straight line on a map?",
    a: "Nearly. On a flat map the true shortest path can look slightly curved over long distances, but across the UK the difference is negligible.",
  },
  {
    q: "How accurate is a postcode-based distance?",
    a: "A postcode covers about 15 addresses on average, so the result is accurate to roughly the size of a street. Use coordinates if you need more.",
  },
  { q: "How do I convert the result to nautical miles?", a: "Divide miles by 1.151. The calculator shows nautical miles for you. They are used at sea and in aviation." },
  { q: "Can I use this for mileage claims?", a: "No. HMRC business mileage is based on the miles you actually drive, not the straight-line distance." },
  {
    q: "Where does the postcode location come from?",
    a: "Postcodes are looked up with postcodes.io, a free service built on open Ordnance Survey and ONS data. Town names and coordinates are worked out in your browser.",
  },
];

const PAIRS: [string, string][] = [
  ["London", "Edinburgh"],
  ["London", "Manchester"],
  ["London", "Birmingham"],
  ["London", "Cardiff"],
  ["Manchester", "Glasgow"],
  ["Bristol", "Leeds"],
  ["Belfast", "Liverpool"],
  ["Land's End", "John o' Groats"],
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[faqSchema(faqs), webAppSchema("As the Crow Flies Distance Calculator", `${SITE_URL}/as-the-crow-flies-distance-calculator`)]}
      />
      <h1>As the Crow Flies Distance Calculator</h1>
      <Byline />
      <p className="lead">
        Enter two UK postcodes, towns or sets of coordinates. The calculator returns the straight-line distance between them in miles and kilometres.
      </p>
      <DistanceCalculator />

      <div className="prose">
        <h2>What &quot;as the crow flies&quot; means</h2>
        <p>
          It is the shortest distance between two points over the Earth&apos;s surface, ignoring roads, rivers, hills and buildings. It is always shorter than,
          or equal to, the distance you would actually travel.
        </p>

        <h2>How it is calculated</h2>
        <p>
          Each location is turned into a latitude and longitude. The calculator then applies the haversine formula, which finds the length of the arc between two
          points on a sphere, using an Earth radius of 6,371 km (3,959 miles).
        </p>
        <p>The Earth is slightly flattened, so the result can be out by up to about 0.5%. Over UK distances that is a few hundred metres at most.</p>

        <h2>Straight-line distances between UK cities</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Miles</th>
                <th>Kilometres</th>
              </tr>
            </thead>
            <tbody>
              {PAIRS.map(([a, b]) => {
                const d = distance(findPlace(a)!, findPlace(b)!);
                return (
                  <tr key={a + b}>
                    <td>{a}</td>
                    <td>{b}</td>
                    <td>{d.miles.toFixed(0)}</td>
                    <td>{d.km.toFixed(0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">Measured between city centres.</p>

        <h2>Straight line versus road distance</h2>
        <p>
          Road routes in the UK usually come out 20 to 40% longer than the straight line, and more where there is water or high ground in the way. London to
          Edinburgh is about {distance(findPlace("London")!, findPlace("Edinburgh")!).miles.toFixed(0)} miles as the crow flies and around 400 miles by road.
        </p>

        <h2>When straight-line distance is the one that matters</h2>
        <ul>
          <li>
            <strong>School admissions.</strong> Many councils measure home-to-school distance in a straight line when ranking applications. Some use walking
            routes instead, so check your council&apos;s policy.
          </li>
          <li>
            <strong>Job adverts and contracts.</strong> &quot;Within 30 miles of the office&quot; clauses and relocation rules are often read as a radius.
          </li>
          <li>
            <strong>Delivery and service areas.</strong> Businesses commonly set a radius from their base.
          </li>
          <li>
            <strong>Drones, radio and flying.</strong> Range limits are straight-line by nature.
          </li>
          <li>
            <strong>Planning and licensing.</strong> Rules about distance from a site are usually measured point to point.
          </li>
        </ul>
        <p>
          For travel cost, use the road distance in the <Link href="/fuel-cost-calculator">fuel cost calculator</Link>. For work journeys, see the{" "}
          <Link href="/mileage-calculator">mileage calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
