// Runs automatically after `npm run build` (the "postbuild" script).
// Reads every built page in out/ and writes out/search-index.json for the site search box.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
const SKIP = new Set(["/404", "/_not-found", "/search"]);
const MAX_TEXT = 1200;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === "_next" ? [] : walk(p);
    return p.endsWith(".html") ? [p] : [];
  });
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&pound;/g, "£")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

const strip = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

const entries = [];
for (const file of walk(OUT)) {
  const rel = "/" + relative(OUT, file).split(sep).join("/").replace(/\.html$/, "");
  const url = rel === "/index" ? "/" : rel;
  if (SKIP.has(url) || /^\/google[0-9a-f]+$/.test(url)) continue;

  const html = readFileSync(file, "utf8");
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) continue;

  const title = strip((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "").replace(/\s*\|\s*UK Salary Tools$/, "");
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || "");
  let main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || "";
  main = main
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<aside class="page-footer-info"[\s\S]*?<\/aside>/i, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<p class="col-credit"[\s\S]*?<\/p>/gi, " ");
  const headings = [...main.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((m) => strip(m[1])).filter(Boolean);
  const text = strip(main).slice(0, MAX_TEXT);
  if (!title) continue;
  entries.push({ u: url, t: title, d: desc, h: [...new Set(headings)].slice(0, 25).join(" · "), x: text });
}

entries.sort((a, b) => a.u.localeCompare(b.u));
writeFileSync(join(OUT, "search-index.json"), JSON.stringify(entries));
console.log(`Search index: ${entries.length} pages written to ${OUT}/search-index.json`);
