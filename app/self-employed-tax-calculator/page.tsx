import type { Metadata } from "next";
import Link from "next/link";
import { Byline } from "@/components/Byline";
import SelfEmployedCalculator from "@/components/SelfEmployedCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { selfEmployedTax, SE_YEAR, CLASS2 } from "@/lib/selfEmployed";
import { gbp } from "@/lib/tax";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

const PATH = "/self-employed-tax-calculator";

export const metadata: Metadata = {
  title: shortTitle("/self-employed-tax-calculator"),
  description:
    "Self-employed tax calculator 2026/27: enter your income and expenses to see Income Tax, Class 4 National Insurance, take-home profit and payments on account.",
  alternates: { canonical: PATH },
};

const at = (profit: number) => selfEmployedTax({ income: profit, expenses: 0 });
const e30 = at(30000);

const faqs = [
  {
    q: "How much tax do I pay when self-employed?",
    a: `You pay Income Tax on your profit (income minus allowable expenses) at the same rates as employees, plus Class 4 National Insurance of 6% on profits between £12,570 and £50,270 and 2% above. On a profit of £30,000 that is ${gbp(e30.incomeTax)} Income Tax and ${gbp(e30.class4)} Class 4 NI, leaving ${gbp(e30.takeHome)}.`,
  },
  {
    q: "How much should I set aside for tax?",
    a: `Many sole traders put aside 20% to 30% of their profit. The calculator shows the exact monthly amount for your figures: on £30,000 profit it is about ${gbp(e30.setAsideMonthly, 0)} a month. In your first year, also allow for the first payment on account, which is due at the same time as your first bill.`,
  },
  {
    q: "What are payments on account?",
    a: "Payments towards next year's bill, each half of this year's Income Tax and Class 4 NI, due on 31 January and 31 July. You don't make them if that tax was under £1,000, or if over 80% of your tax was already paid through PAYE. Student loan repayments are not included in them.",
  },
  {
    q: "Do I still pay Class 2 National Insurance?",
    a: `No. Since April 2024, Class 2 is treated as paid if your profits are £${CLASS2.smallProfitsThreshold.toLocaleString("en-GB")} or more, so the year still counts for your State Pension. Below that you can choose to pay voluntary Class 2 at £${CLASS2.weekly} a week.`,
  },
  {
    q: "What is the trading allowance?",
    a: "You can earn up to £1,000 a year from self-employment tax-free without telling HMRC. Above that, you can deduct either your actual expenses or the £1,000 allowance, whichever is higher, but not both.",
  },
  {
    q: "I have a job and a side business. How is that taxed?",
    a: "Your salary uses up your Personal Allowance first, so side profit is usually taxed at 20% or more from the first pound. Class 4 NI is worked out on your self-employed profit alone. Enter your salary in the calculator to see the extra tax due through Self Assessment.",
  },
  {
    q: "When do I pay my 2026/27 tax?",
    a: "The tax return and any balance for 2026/27 are due by 31 January 2028. If payments on account apply, the first one for 2027/28 is due on the same day and the second on 31 July 2028.",
  },
  {
    q: "Does Making Tax Digital apply to me?",
    a: "From 6 April 2026, sole traders and landlords with qualifying income (turnover before expenses) over £50,000 must keep digital records and send quarterly updates. The threshold falls to £30,000 from April 2027 and £20,000 from April 2028.",
  },
];

const EXAMPLES = [15000, 20000, 25000, 30000, 40000, 50000, 60000, 80000, 100000];

export default function SelfEmployedPage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("Self-Employed Tax Calculator", `${SITE_URL}${PATH}`, "FinanceApplication")]} />
      <h1>Self-Employed Tax Calculator {SE_YEAR}</h1>
      <Byline />
      <p className="lead">
        Enter your income and expenses to see your Income Tax, Class 4 National Insurance and take-home profit as a sole
        trader, and when you need to pay.
      </p>
      <SelfEmployedCalculator />
      <div className="prose">
        <h2>Self-employed tax on common profits ({SE_YEAR})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Profit</th><th>Income Tax</th><th>Class 4 NI</th><th>Take-home</th><th>Per month</th></tr></thead>
            <tbody>
              {EXAMPLES.map((p) => {
                const r = at(p);
                return (
                  <tr key={p}><td>{gbp(p, 0)}</td><td>{gbp(r.incomeTax)}</td><td>{gbp(r.class4)}</td><td>{gbp(r.takeHome)}</td><td>{gbp(r.takeHome / 12)}</td></tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">England, Wales and Northern Ireland, no other income and no student loan.</p>
        <h2>Self-employed vs employed on the same money</h2>
        <p>
          A sole trader with £30,000 profit keeps {gbp(e30.takeHome, 0)}. Class 4 NI at 6% is lower than the 8% employees pay,
          but there is no employer pension contribution, sick pay or holiday pay. Compare with the{" "}
          <Link href="/salary/30000-after-tax">£30,000 salary take-home</Link>, or see the{" "}
          <Link href="/national-insurance-calculator">National Insurance calculator</Link> for employees.
        </p>
        <p>
          Running a limited company instead? Use the <Link href="/corporation-tax-calculator">Corporation Tax calculator</Link>{" "}
          and the <Link href="/dividend-tax-calculator">dividend tax calculator</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          Sources: GOV.UK &quot;Self-employed National Insurance rates&quot;, &quot;Income Tax rates and Personal
          Allowances&quot;, &quot;Understand your Self Assessment tax bill&quot; and &quot;Sign up for Making Tax Digital for
          Income Tax&quot;. Assumes no pension contributions, losses, capital allowances or other income. Guidance only, not
          tax advice.
        </p>
      </div>
    </>
  );
}
