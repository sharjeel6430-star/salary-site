# UK Salary Calculator (2026/27)

A fast, SEO-ready UK take-home pay calculator built with Next.js.

## What's inside

| Page | URL |
|---|---|
| Main calculator (tax, NI, student loan, pension, bonus) | `/` |
| Scotland calculator | `/scotland-salary-calculator` |
| NHS take home pay calculator + 11 band pages | `/nhs-take-home-pay-calculator`, `/nhs-pay-bands/band-5` |
| Pro rata salary calculator | `/pro-rata-salary-calculator` |
| Salary sacrifice calculator | `/salary-sacrifice-calculator` |
| Hourly ↔ salary converter + 50 hourly rate pages | `/hourly-to-salary`, `/hourly/12-71-an-hour` |
| Salary table (all salaries) | `/salary` |
| ~190 "£X after tax" SEO pages | `/salary/30000-after-tax` etc. |

See `KEYWORDS.md` for the Semrush keyword research behind every page.
| Guides (tax bands, NI, student loans, pensions) | `/guides` |
| About, Privacy, sitemap.xml, robots.txt | |

All tax rates live in **one file**: `lib/tax.ts`. Each April, update the numbers there and run `npm test`.

## 1. Run it on your computer

You need [Node.js](https://nodejs.org) (LTS version) installed.

```bash
cd Documents/uk-salary-calculator
npm install
npm run dev
```

Open http://localhost:3000.

## 2. Put it live — free on Cloudflare Pages

The site is a **static export** (plain HTML files), so it can be hosted free on Cloudflare Pages (unlimited bandwidth on the free plan).

1. Build it: `npm run build`. This creates the `out` folder. Zip the **contents** of `out` (a ready-made zip, `uksalarytools-upload.zip`, is already in your Documents folder).
2. Create a free account at **dash.cloudflare.com**, then go to **Workers & Pages → Create → Pages → Upload assets**.
3. Name the project `uksalarytools`, drag in the zip and click **Deploy**. You get a free `uksalarytools.pages.dev` address.
4. In the project, open **Custom domains → Set up a domain** and add `www.uksalarytools.co.uk` and `uksalarytools.co.uk`. Follow the DNS steps. Moving the domain's nameservers to Cloudflare is easiest.
5. Turn on free, cookieless visitor stats under **Web Analytics**.

To update the site later, run `npm run build` again and upload the new zip as a new deployment.

## 3. After launch (SEO)

1. Add the site to **Google Search Console** and submit `https://yourdomain/sitemap.xml`.
2. Enable **Cloudflare Web Analytics** (free, no cookies).
3. Once you have traffic, apply for **Google AdSense**. The About and Privacy pages are already included; add a cookie consent banner before ads go live.

## Change the brand name

Edit `lib/site.ts` → `SITE_NAME`.

## Commands

- `npm run dev` — local preview
- `npm run build` — production build
- `npm test` — checks the tax maths against known HMRC results
