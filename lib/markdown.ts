// Renders a guide written in Markdown (content/guides/*.md) at build time, and pulls out its FAQs for schema.
// Server-only: reads files from disk during the static build.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export function readGuideMarkdown(file: string): string {
  return fs.readFileSync(path.join(process.cwd(), "content", "guides", file), "utf8");
}

const plain = (md: string) =>
  md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_]/g, "")
    .trim();

// FAQs are written as paragraphs of the form "**Question?** Answer" under a "Frequently asked questions" heading.
export function guideFaqs(md: string): { q: string; a: string }[] {
  const at = md.search(/^##+ Frequently asked questions/m);
  if (at < 0) return [];
  const faqs: { q: string; a: string }[] = [];
  for (const block of md.slice(at).split(/\n\s*\n/)) {
    const m = block.replace(/^#.*$/gm, "").trim().match(/^\*\*(.+?\?)\*\*\s+([\s\S]+)$/);
    if (m) faqs.push({ q: plain(m[1]), a: plain(m[2].replace(/\n/g, " ")) });
  }
  return faqs;
}

export function renderGuideMarkdown(md: string): string {
  const html = marked.parse(md, { async: false, gfm: true }) as string;
  // Wide tables scroll sideways on phones instead of widening the page; outside links open safely.
  return html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<a href="(https?:\/\/[^"]+)">/g, '<a href="$1" target="_blank" rel="noopener noreferrer">');
}
