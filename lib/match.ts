import { GOAL_LABELS, PROCEDURES } from "./procedures";
import { LIGHT, belowMinAge, notesFor, type Note } from "./advice";
import { basisFor } from "./basis";
import { CAUTIONS } from "./cautions";
import { RESEARCH } from "./research";
import type { Procedure, QuizAnswers } from "./types";

const MAX_DOWNTIME = { none: 1, short: 7, any: Infinity } as const;

export interface Match {
  procedure: Procedure;
  score: number;
  /** Plain-language reasons behind the score: what fits, and what to weigh. */
  why: { good: string[]; watch: string[] };
  /** Set when a similar treatment was had recently and is still settling: shown under "Later", with this reason. */
  later?: string;
  flagged: QuizAnswers["cautions"];
  notes: Note[];
}

export interface Hidden {
  procedure: Procedure;
  reasons: string[];
}

/** Why a procedure is not shown to this person (empty = safe to show). */
export function safetyReasons(p: Procedure, a: QuizAnswers): string[] {
  const r = p.contraindications.filter((c) => a.cautions.includes(c)).map((c) => CAUTIONS[c].short);
  if (belowMinAge(p, a)) r.push(`FDA-authorized for ages ${p.minAge}+`);
  if (p.id === "ipl" && a.tone === "deep") r.push("Generally advised against for deep skin tones (burn and dark-mark risk)");
  return r;
}

/**
 * Rank procedures against quiz answers. Treatments that conflict with the
 * person's safety answers are removed from `shown` and listed in `hidden`
 * with the reason. Pure function, runs in the browser.
 */
export function matchProcedures(a: QuizAnswers): { shown: Match[]; hidden: Hidden[] } {
  const relevant = PROCEDURES.filter((p) => p.goals.some((g) => a.goals.includes(g)));
  const hidden: Hidden[] = [];
  const shown: Match[] = [];
  for (const p of relevant) {
    const reasons = safetyReasons(p, a);
    if (reasons.length) {
      hidden.push({ procedure: p, reasons });
      continue;
    }
    if (p.downtimeDays[1] > MAX_DOWNTIME[a.downtime]) continue;
    const { score, why } = rank(p, a);
    shown.push({ procedure: p, score, why, flagged: [], notes: notesFor(p, a), later: laterReason(p, a) });
  }
  shown.sort((x, y) => y.score - x.score || x.why.watch.length - y.why.watch.length || RESEARCH[y.procedure.id].evidence - RESEARCH[x.procedure.id].evidence || x.procedure.tier - y.procedure.tier);
  return { shown, hidden };
}

export const PRICE_UNKNOWN = "Price not available at the moment";

/** Lowest typical price, or Infinity when no price is published (sorts last, never "under $500"). */
export function priceLow(p: Procedure, city: "nyc" | "miami") {
  return p.cost[city]?.[0] ?? Infinity;
}
/** "from $350", or "Price not available". */
export function priceFrom(p: Procedure, city: "nyc" | "miami") {
  const c = p.cost[city];
  return c ? `from ${usd(c[0])}` : "Price not available";
}
/** "$350–600", or "Not available". */
export function priceRange(p: Procedure, city: "nyc" | "miami") {
  const c = p.cost[city];
  return c ? `${usd(c[0])}–${usd(c[1]).replace("$", "")}` : "Not available";
}

export function usd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function downtimeShort([lo, hi]: [number, number]) {
  if (hi === 0) return "None";
  if (lo === 0 && hi === 1) return "Up to 1 day";
  return `${lo || 1}–${hi} days`;
}

/**
 * How results are ranked — the same rules are explained on the results page (RANK_RULES).
 * Points: +3 per goal of yours it treats · +2 per research level (1–3) · +1 per typical-results level (1–3), counted
 * only when research is at least "Some"
 * · +3 if it specifically targets a condition you have · −2/−3 when your answers raise a known risk.
 */
/**
 * Single-session treatments whose results keep building for months (see each treatment's "results in" data).
 * After one of these, a similar treatment from the same group is usually not needed yet.
 */
const SETTLING_GROUPS: { label: string; ids: string[] }[] = [
  { label: "skin-tightening", ids: ["sofwave", "ultherapy", "thermage", "xerf"] },
  { label: "deep resurfacing", ids: ["co2", "erbium"] },
  { label: "collagen-stimulating injectable", ids: ["sculptra", "radiesse", "bellafill"] },
  { label: "thread lift", ids: ["threads"] },
];

export function laterReason(p: Procedure, a: QuizAnswers): string | undefined {
  for (const g of SETTLING_GROUPS) {
    if (!g.ids.includes(p.id)) continue;
    const had = (a.had ?? []).find((id) => g.ids.includes(id));
    if (!had) continue;
    const name = PROCEDURES.find((x) => x.id === had)?.name.split(" / ")[0] ?? had;
    return had === p.id
      ? `You had ${name} recently. Its results keep building for months, so repeating it now is usually not needed.`
      : `You had ${name} recently. Its results keep building for months, so another ${g.label} treatment now is usually not needed.`;
  }
  return undefined;
}

export const RANK_RULES = [
  "How many of your goals it is used for (biggest factor)",
  "Strength of the research behind it",
  "How noticeable typical results are — counted only when research backs it",
  "Fit with your skin tone, conditions and recent treatments",
];

const RESULT_WORD = ["", "subtle", "noticeable", "dramatic"];

export function rank(p: Procedure, a: QuizAnswers): { score: number; why: { good: string[]; watch: string[] } } {
  const good: string[] = [];
  const watch: string[] = [];
  let score = 0;

  const hit = p.goals.filter((g) => a.goals.includes(g));
  score += 3 * hit.length;
  if (hit.length > 1) good.push(`Used for ${hit.length} of your goals: ${hit.map((g) => GOAL_LABELS[g].toLowerCase()).join(", ")}`);
  else if (hit.length === 1) good.push(`Used for your goal: ${GOAL_LABELS[hit[0]].toLowerCase()}`);
  // Official basis (FDA approval/clearance) for one of the person's goals goes first.
  const basis = basisFor(p.id, hit);
  if (basis) good.unshift(basis.text);

  const ev = RESEARCH[p.id].evidence;
  score += 2 * ev;
  if (ev === 3) good.push("Strong research (randomized trials)");
  else if (ev === 2) good.push("Some research");

  // Result size only counts when there's research to back it; otherwise we say it isn't well studied.
  if (ev === 1) watch.push("Little research, so how well it works isn't well known");
  else {
    score += p.results;
    if (p.results === 3) good.push("Dramatic results possible");
    else if (p.results === 1) watch.push("Subtle results");
    else good.push(`Typically ${RESULT_WORD[p.results]} results`);
  }

  const melasma = a.conditions?.includes("melasma");
  const rosacea = a.conditions?.includes("rosacea");
  if (melasma && p.id === "laser-toning") { score += 3; good.unshift("Used specifically for melasma"); }
  if (melasma && p.id === "peel") { score += 1; good.push("Has evidence for melasma"); }
  if (melasma && p.id === "sylfirm-x") { score += 1; good.push("Studied for melasma"); }
  if (rosacea && ["pdl", "ktp", "ipl"].includes(p.id)) { score += 3; good.unshift("Targets rosacea redness"); }
  if (melasma && LIGHT.has(p.id) && !["pdl", "laser-genesis"].includes(p.id)) { score -= 3; watch.unshift("Can make melasma darker"); }
  if (a.tone && a.tone !== "light" && LIGHT.has(p.id)) { score -= a.tone === "deep" ? 3 : 2; watch.push("Higher risk of dark marks on your skin tone"); }
  if (a.had?.includes(p.id)) watch.push("You had this recently — plan the timing");
  if (a.recent?.includes("filler") && p.id === "ultherapy") { score -= 2; watch.push("Recent filler: a study suggests waiting about 4 weeks"); }

  return { score, why: { good, watch } };
}
