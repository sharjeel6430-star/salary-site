import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AUTHOR, CONTACT_EMAIL, ORG_ID, PERSON_ID, SITE_NAME, SITE_URL } from "@/lib/site";
import { LAST_REVIEWED } from "@/lib/sources";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/author/sharjeel"),
  description: `${AUTHOR.name} builds and checks every calculator and guide on ${SITE_NAME}. What he covers, how he checks the figures and how to contact him.`,
  alternates: { canonical: AUTHOR.path },
};

const TOPICS = ["UK Income Tax", "National Insurance", "Student loan repayments", "NHS Agenda for Change pay", "Salary sacrifice"];

export default function AuthorPage() {
  return (
    <div className="prose">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${SITE_URL}${AUTHOR.path}`,
          mainEntity: {
            "@type": "Person",
            "@id": PERSON_ID,
            name: AUTHOR.name,
            jobTitle: AUTHOR.jobTitle,
            worksFor: { "@id": ORG_ID },
            url: `${SITE_URL}${AUTHOR.path}`,
            image: `${SITE_URL}${AUTHOR.image}`,
            sameAs: [AUTHOR.linkedin],
            alumniOf: { "@type": "CollegeOrUniversity", name: "Bahauddin Zakariya University" },
            hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "MBA in Marketing" },
            knowsAbout: TOPICS,
          },
        }}
      />
      <div className="author-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AUTHOR.image} alt={`${AUTHOR.name}, founder of ${SITE_NAME}`} width={120} height={120} className="author-photo" />
        <div>
          <h1>{AUTHOR.name}</h1>
          <p className="lead">
            Founder and editor of {SITE_NAME}. I build, write and check every calculator and guide on the site.
          </p>
          <p>
            <a href={AUTHOR.linkedin} target="_blank" rel="noopener noreferrer me">LinkedIn profile</a>
          </p>
        </div>
      </div>

      <h2>Background</h2>
      <p>
        I have an MBA in Marketing from Bahauddin Zakariya University and 16 years of experience in sales and marketing,
        where pay, targets and take-home figures were part of everyday work. I started {SITE_NAME} in 2026 to give people
        clear, checkable answers about their own pay.
      </p>

      <h2>What I do</h2>
      <p>
        I started {SITE_NAME} because most salary calculators hide how they get their numbers. Every tool on this site
        shows its working, uses only official published rates, and is checked by automated tests before any change goes
        live.
      </p>
      <p>
        When the rates change, each April and after every Budget, I update the calculators, the written figures and the
        tests together. The site was last reviewed on {LAST_REVIEWED}.
      </p>

      <h2>Topics I cover</h2>
      <ul>
        {TOPICS.map((t) => (
          <li key={t}>{t}</li>
        ))}
        <li>Teacher and doctor pay scales, minimum wage rates and the cost of living in UK cities</li>
      </ul>

      <h2>How I check the figures</h2>
      <p>
        Every rate comes from GOV.UK, HMRC, the Scottish Government, NHS Employers, the Department for Education or another
        official source, and each page lists the sources it uses. The full method is on the{" "}
        <Link href="/methodology">how we calculate</Link> page.
      </p>

      <h2>Contact</h2>
      <p>
        Found a mistake or have a question about a figure? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        I read every message. {SITE_NAME} gives general information, not financial or tax advice, and is not affiliated
        with HMRC.
      </p>
    </div>
  );
}
