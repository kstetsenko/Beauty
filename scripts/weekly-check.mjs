// Weekly data check. Run by .github/workflows/weekly-data-check.yml (or `npm run data-check`).
// It never edits app data: it reports what a person should review.
//  1. Source links: every URL in lib/*.ts is requested; broken or moved ones are listed.
//  2. New research: PubMed is searched for each treatment, for papers added in the last 7 days.
//  3. Freshness: warns when the "checked" date in lib/research.ts is older than 90 days.
// Output: a Markdown report (stdout, and data-check-report.md). With GITHUB_TOKEN and
// GITHUB_REPOSITORY set (as in GitHub Actions), it also opens a GitHub issue labeled "data-check".
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const UA = "AestheticGuide-DataCheck/1.0 (+weekly link and literature check)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lib = readdirSync("lib").filter((f) => f.endsWith(".ts")).map((f) => [f, readFileSync(`lib/${f}`, "utf8")]);
const all = lib.map(([, s]) => s).join("\n");

// ---- 1. Collect URLs (plain URLs plus the pm()/pmc() helpers in research.ts)
const urls = new Set();
for (const m of all.matchAll(/https?:\/\/[^\s"'`)]+/g)) if (!/\$\{|example\.com|\.\.|…/.test(m[0])) urls.add(m[0].replace(/[.,]$/, ""));
for (const m of all.matchAll(/pm\("(\d+)"\)/g)) urls.add(`https://pubmed.ncbi.nlm.nih.gov/${m[1]}/`);
for (const m of all.matchAll(/pmc\("(PMC\d+)"\)/g)) urls.add(`https://www.ncbi.nlm.nih.gov/pmc/articles/${m[1]}/`);

async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, { method, redirect: "follow", headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
      if (res.ok) return { url, ok: true, status: res.status, moved: res.url !== url ? res.url : "" };
      if (method === "GET") return { url, ok: false, status: res.status };
    } catch (e) {
      if (method === "GET") return { url, ok: false, status: e.name === "TimeoutError" ? "timeout" : "error" };
    }
  }
}

// ---- 2. Treatments to search on PubMed (names parsed from lib/procedures.ts)
// Exact search phrases where a product name alone is ambiguous (e.g. "IPL" also means a brain region).
const TERMS = {
  ipl: ["intense pulsed light", "BBL photofacial"],
  co2: ["fractional CO2 laser", "carbon dioxide laser resurfacing"],
  botox: ["botulinum toxin", "onabotulinumtoxinA", "daxibotulinumtoxinA"],
  masseter: ["masseter botulinum"],
  pdl: ["pulsed dye laser"],
  pico: ["picosecond laser"],
  erbium: ["erbium laser resurfacing", "Er:YAG resurfacing"],
  peel: ["chemical peel"],
  prp: ["platelet-rich plasma microneedling"],
  "rx-redness": ["oxymetazoline", "brimonidine gel"],
  "melasma-cream": ["triple combination cream melasma", "hydroquinone melasma"],
  azelaic: ["azelaic acid"],
  tretinoin: ["tretinoin photoaging", "topical tretinoin"],
  "lip-filler": ["lip augmentation hyaluronic acid"],
  "cheek-filler": ["midface volume hyaluronic acid", "cheek augmentation filler"],
  "under-eye": ["infraorbital hollow filler", "tear trough filler"],
  "nose-filler": ["nonsurgical rhinoplasty"],
  threads: ["thread lift", "polydioxanone thread"],
  led: ["light-emitting diode photobiomodulation skin"],
  "laser-genesis": ["microsecond Nd:YAG"],
};
// Keep results to skin / cosmetic research.
const CONTEXT = "(skin[tiab] OR facial[tiab] OR face[tiab] OR cosmetic[tiab] OR aesthetic[tiab] OR rejuvenation[tiab] OR wrinkle*[tiab] OR scar*[tiab] OR melasma[tiab] OR rosacea[tiab] OR photoaging[tiab] OR dermatol*[tiab])";
const procedures = [...readFileSync("lib/procedures.ts", "utf8").matchAll(/\n    id: "([a-z0-9-]+)", name: "([^"]+)"/g)].map((m) => ({
  id: m[1],
  terms: TERMS[m[1]] ?? m[2].split(" / ").map((t) => t.replace(/\(.*?\)/g, "").trim()),
}));
const since = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10).replace(/-/g, "/");
const today = new Date().toISOString().slice(0, 10).replace(/-/g, "/");

async function pubmed(terms) {
  const q = `(${terms.map((t) => `"${t}"[Title/Abstract]`).join(" OR ")}) AND ${CONTEXT}`;
  const base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
  const s = await fetch(`${base}/esearch.fcgi?db=pubmed&retmode=json&retmax=5&datetype=edat&mindate=${since}&maxdate=${today}&term=${encodeURIComponent(q)}`, { headers: { "User-Agent": UA } });
  const ids = (await s.json()).esearchresult?.idlist ?? [];
  if (!ids.length) return [];
  await sleep(400);
  const d = await fetch(`${base}/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}`, { headers: { "User-Agent": UA } });
  const r = (await d.json()).result ?? {};
  return ids.map((id) => ({ id, title: r[id]?.title ?? "(title unavailable)", type: (r[id]?.pubtype ?? []).join(", ") }));
}

// ---- 3. Freshness
const checked = (readFileSync("lib/research.ts", "utf8").match(/export const CHECKED = "([^"]+)"/) || [])[1] || "unknown";
const checkedDate = new Date(checked.replace(/^(\w+) (\d{4})$/, "1 $1 $2"));
const ageDays = isNaN(checkedDate) ? null : Math.round((Date.now() - checkedDate) / 864e5);

// ---- Run
const lines = [`# Weekly data check — ${new Date().toISOString().slice(0, 10)}`, ""];
lines.push(`Prices and research were last checked: **${checked}**${ageDays !== null ? ` (${ageDays} days ago)` : ""}.`);
if (ageDays !== null && ageDays > 90) lines.push("", "⚠️ **Over 90 days old — re-check prices against clinic pages and update `CHECKED` in lib/research.ts.**");

const linkResults = [];
for (const url of urls) {
  linkResults.push(await check(url));
  await sleep(250);
}
const broken = linkResults.filter((r) => !r.ok);
const moved = linkResults.filter((r) => r.ok && r.moved);
lines.push("", `## Source links (${urls.size} checked)`);
if (!broken.length) lines.push("All links responded.");
for (const r of broken) lines.push(`- ❌ ${r.status} — ${r.url}${[401, 403, 429].includes(r.status) ? " (site may block automated checks — open it manually)" : ""}`);
if (moved.length) {
  lines.push("", "Redirected (review whether the content still matches):");
  for (const r of moved) lines.push(`- ↪ ${r.url} → ${r.moved}`);
}

lines.push("", `## New PubMed papers (added ${since} – ${today})`, "Review before adding: only cite peer-reviewed studies that change the evidence summary.");
let found = 0;
for (const p of procedures) {
  try {
    const papers = await pubmed(p.terms);
    if (papers.length) {
      found += papers.length;
      lines.push("", `**${p.id}**`);
      for (const x of papers) lines.push(`- ${x.title} — https://pubmed.ncbi.nlm.nih.gov/${x.id}/${x.type ? ` (${x.type})` : ""}`);
    }
  } catch {
    lines.push(`- (PubMed search failed for ${p.id})`);
  }
  await sleep(400);
}
if (!found) lines.push("No new papers this week.");

const report = lines.join("\n");
writeFileSync("data-check-report.md", report);
console.log(report);

if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY && !process.argv.includes("--no-issue")) {
  const res = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify({ title: `Weekly data check — ${new Date().toISOString().slice(0, 10)}`, body: report.slice(0, 60000), labels: ["data-check"] }),
  });
  console.log(`Issue: ${res.status}`);
}
