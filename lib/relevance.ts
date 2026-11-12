import { ENERGY, LIGHT, RESURFACING } from "./advice";
import type { Filter } from "./filters";
import type { Flag } from "./profile";
import { PROCEDURES } from "./procedures";
import type { Goal } from "./types";

/**
 * Keeps every step connected to the person's goals: a filter or health question is only offered
 * when it can matter for at least one of the goals they picked.
 */

/** Filters that only make sense for some goals (others apply to every goal). */
const FILTER_GOALS: Partial<Record<Filter, Goal[]>> = {
  // Collagen-building matters for aging and scars, not for active breakouts, redness or spots.
  collagen: ["lines", "lift", "volume", "texture", "acne"],
  // "Lasts a year or more" matters for structural results; acne and facials need ongoing care.
  lasting: ["lines", "lift", "volume", "texture", "acne", "pigment", "redness"],
  // "Results right away" is about visible change in shape, lines or glow.
  now: ["lines", "lift", "volume", "glow"],
};

export function filterFitsGoals(f: Filter, goals: Goal[]) {
  const only = FILTER_GOALS[f];
  return !only || goals.length === 0 || goals.some((g) => only.includes(g));
}

const CONDITION_TARGETS: Partial<Record<Flag, (id: string) => boolean>> = {
  melasma: (id) => LIGHT.has(id) || ["peel", "laser-toning"].includes(id),
  rosacea: (id) => ["pdl", "ktp", "ipl", "laser-genesis"].includes(id),
  "cold-sores": (id) => RESURFACING.has(id),
  isotretinoin: (id) => ["peel", "fraxel", "halo", "moxi", "clear-brilliant"].includes(id),
};

/** Health questions that change advice or safety for at least one treatment for these goals. */
export function flagsForGoals(goals: Goal[]): Set<Flag> {
  const procs = PROCEDURES.filter((p) => p.goals.some((g) => goals.includes(g)));
  const out = new Set<Flag>(["no-downtime"]);
  for (const p of procs) for (const c of p.contraindications) out.add(c);
  for (const [flag, hits] of Object.entries(CONDITION_TARGETS) as [Flag, (id: string) => boolean][])
    if (procs.some((p) => hits(p.id))) out.add(flag);
  if (procs.some((p) => ENERGY.has(p.id) || LIGHT.has(p.id))) out.add("no-downtime");
  return out;
}
