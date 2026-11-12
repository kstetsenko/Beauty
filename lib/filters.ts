import type { Match } from "./match";
import { RESEARCH } from "./research";
import type { City, Goal, Procedure } from "./types";

/**
 * Result-list sorting, filters and one-tap plans (pure functions, unit-tested).
 * Rule: an option is only offered when it leaves at least one result, so a tap never ends in an empty list.
 */
export type Sort = "match" | "evidence" | "price" | "downtime";
export type Filter = "event" | "gentle" | "lasting" | "under500" | "strong" | "collagen" | "now" | "nodowntime" | "noneedles" | "lowpain";

export const SORTS: [Sort, string][] = [
  ["match", "Best match"],
  ["evidence", "Strongest research"],
  ["price", "Lowest price"],
  ["downtime", "Least downtime"],
];
export const FILTERS: [Filter, string][] = [
  ["strong", "Strong research only"],
  ["under500", "Starts under $500"],
  ["lasting", "Lasts a year or more"],
  ["collagen", "Builds your own collagen"],
  ["now", "Results right away"],
  ["nodowntime", "No downtime"],
  ["lowpain", "Low pain"],
  ["noneedles", "No needles"],
];
export const PLANS: { label: string; hint: string; filters: Filter[]; sort: Sort }[] = [
  { label: "Event in 2 weeks", hint: "Shows within days, at most a day of recovery", filters: ["event"], sort: "match" },
  { label: "First time", hint: "Low pain, short recovery, not permanent", filters: ["gentle"], sort: "evidence" },
  { label: "Best value", hint: "Starts under $500, best research first", filters: ["under500"], sort: "evidence" },
  { label: "Long-lasting", hint: "Results that last a year or more", filters: ["lasting"], sort: "evidence" },
];

const PERMANENT = new Set(["bellafill"]);
const LASTING = /^(about 1 year|1–2 years|1 year|years|long-lasting|up to about 2 years|about 12–18 months)/i;
const NEEDLES = new Set(["microneedling", "prp", "morpheus8", "subcision"]);
const hasNeedles = (p: Procedure) => ["toxin", "ha", "biostim", "threads"].includes(p.approach) || NEEDLES.has(p.id);

export function passes(p: Procedure, f: Filter, city: City): boolean {
  switch (f) {
    case "event": return p.downtimeDays[1] <= 1 && p.onset <= 2;
    case "gentle": return p.pain <= 2 && p.downtimeDays[1] <= 3 && !PERMANENT.has(p.id);
    case "lasting": return LASTING.test(p.lasts);
    case "under500": return p.cost[city][0] < 500;
    case "strong": return RESEARCH[p.id].evidence === 3;
    case "collagen": return !!p.collagen;
    case "now": return p.onset === 1;
    case "nodowntime": return p.downtimeDays[1] === 0;
    case "lowpain": return p.pain <= 2;
    case "noneedles": return !hasNeedles(p);
  }
}

/** Matches for one goal (or all, when goal is null) that pass every active filter. */
export function applyFilters(matches: Match[], filters: Filter[], city: City, goal: Goal | null = null) {
  return matches.filter((m) => (!goal || m.procedure.goals.includes(goal)) && filters.every((f) => passes(m.procedure, f, city)));
}

export function sortMatches(list: Match[], sort: Sort, city: City) {
  const ev = (m: Match) => RESEARCH[m.procedure.id].evidence;
  const out = [...list];
  if (sort === "evidence") out.sort((a, b) => ev(b) - ev(a) || b.score - a.score);
  if (sort === "price") out.sort((a, b) => a.procedure.cost[city][0] - b.procedure.cost[city][0]);
  if (sort === "downtime") out.sort((a, b) => a.procedure.downtimeDays[1] - b.procedure.downtimeDays[1] || ev(b) - ev(a));
  return out;
}

/** Filter chips worth showing now: active ones, plus those that would still leave results. With counts. */
export function availableFilters(matches: Match[], active: Filter[], city: City, goal: Goal | null = null) {
  return FILTERS.map(([f, label]) => ({ f, label, on: active.includes(f), count: applyFilters(matches, active.includes(f) ? active : [...active, f], city, goal).length }))
    .filter((x) => x.on || x.count > 0);
}

/** Plans that would leave at least one result for the current goal tab. */
export function availablePlans(matches: Match[], city: City, goal: Goal | null = null) {
  return PLANS.map((p) => ({ ...p, count: applyFilters(matches, p.filters, city, goal).length })).filter((p) => p.count > 0);
}
