// Site search: scoring used by the header search box and the /search page.
// The index (/search-index.json) is made after every build by scripts/build-search-index.mjs,
// from the real page titles, descriptions, headings and text.

export interface IndexEntry {
  u: string; // URL path
  t: string; // title
  d: string; // meta description
  h: string; // headings (h1–h3), joined
  x: string; // page text (shortened)
}

export interface Prepared extends IndexEntry {
  nt: string;
  nd: string;
  nh: string;
  nx: string;
}

export interface Hit {
  entry: Prepared;
  score: number;
  snippet: string;
}

/** Lower-case, drop £ and thousands commas, turn "30k" into "30000", collapse spaces. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/£/g, " ")
    .replace(/(\d),(?=\d{3}\b)/g, "$1")
    .replace(/\b(\d+(?:\.\d+)?)k\b/g, (_, n: string) => String(Math.round(parseFloat(n) * 1000)))
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\.(?=\s|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(q: string): string[] {
  const words = normalize(q).split(" ").filter(Boolean);
  const stop = new Set(["a", "an", "the", "of", "to", "in", "for", "and", "on", "my", "is", "uk"]);
  const kept = words.filter((w) => !stop.has(w));
  return kept.length ? kept : words;
}

export function prepare(index: IndexEntry[]): Prepared[] {
  return index.map((e) => ({ ...e, nt: normalize(e.t), nd: normalize(e.d), nh: normalize(e.h), nx: normalize(e.x) }));
}

// Numbers must match a whole number ("35000" should not match "135000"); words can match the start of a word.
const isNum = (tok: string) => /^\d/.test(tok);
const wholeWord = (hay: string, tok: string) => (" " + hay + " ").includes(" " + tok + " ");
const wordStart = (hay: string, tok: string) =>
  isNum(tok) ? wholeWord(hay, tok) : hay.startsWith(tok) || hay.includes(" " + tok);
const contains = (hay: string, tok: string) => (isNum(tok) ? wholeWord(hay, tok) : hay.includes(tok));

// Everyday words people type, mapped to the words the site uses.
const SYNONYMS: Record<string, string[]> = {
  nurse: ["nhs band 5", "nhs"], nurses: ["nhs band 5", "nhs"], nursing: ["nhs"], midwife: ["nhs"], paramedic: ["nhs"],
  gp: ["doctor"], junior: ["doctor"], wage: ["salary", "hourly"], wages: ["salary", "hourly"],
  pay: ["salary"], ni: ["national insurance"], teachers: ["teacher"], teaching: ["teacher"],
  scottish: ["scotland"], parttime: ["pro rata"], dividends: ["dividend"], pension: ["sacrifice"],
  nlw: ["minimum wage"], hicbc: ["child benefit"], redundant: ["redundancy"], retirement: ["pension"], retire: ["pension"],
  borrow: ["mortgage"], paye: ["take home pay"], ssp: ["statutory sick pay"], sick: ["sick pay"], taxcode: ["tax code"],
  petrol: ["fuel"], diesel: ["fuel"], calories: ["tdee"], calorie: ["tdee"], degree: ["university grade"], uni: ["university grade"],
  walking: ["steps"], postcode: ["distance"], amap: ["mileage"], expenses: ["mileage"],
};

function snippetFor(e: Prepared, toks: string[]): string {
  const text = e.x;
  const lower = text.toLowerCase();
  for (const t of toks) {
    const i = lower.indexOf(t);
    if (i >= 0) {
      const start = Math.max(0, i - 60);
      const end = Math.min(text.length, i + 100);
      return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
    }
  }
  return e.d || text.slice(0, 150);
}

export function search(index: Prepared[], query: string, limit = 8): Hit[] {
  const toks = tokens(query);
  if (!toks.length) return [];
  const phrase = toks.join(" ");
  const hits: Hit[] = [];
  for (const e of index) {
    let score = 0;
    let all = true;
    for (const t of toks) {
      let s = 0;
      for (const [alt, weight] of [[t, 1], ...(SYNONYMS[t] || []).map((x, i) => [x, 0.9 - i * 0.1] as const)] as const) {
        let a = 0;
        if (wordStart(e.nt, alt)) a += 12;
        else if (contains(e.nt, alt)) a += 6;
        if (wordStart(e.nd, alt)) a += 4;
        if (wordStart(e.nh, alt)) a += 3;
        if (contains(e.nx, alt)) a += 1;
        s = Math.max(s, a * weight);
      }
      if (!s) {
        all = false;
        break;
      }
      score += s;
    }
    if (!all) continue;
    if (toks.length > 1 && e.nt.includes(phrase)) score += 20;
    if (e.nt.startsWith(phrase)) score += 10;
    score -= e.nt.length / 100; // prefer short, focused titles
    hits.push({ entry: e, score, snippet: snippetFor(e, toks) });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

let cache: Promise<Prepared[]> | null = null;
/** Loads and prepares the index once per page view. */
export function loadIndex(): Promise<Prepared[]> {
  if (!cache) {
    cache = fetch("/search-index.json")
      .then((r) => {
        if (!r.ok) throw new Error("Search index not found");
        return r.json() as Promise<IndexEntry[]>;
      })
      .then(prepare)
      .catch((err) => {
        cache = null;
        throw err;
      });
  }
  return cache;
}
