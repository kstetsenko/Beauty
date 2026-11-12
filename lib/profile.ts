import { useSyncExternalStore } from "react";
import { matchProcedures, type Hidden, type Match } from "./match";
import { GOAL_LABELS, PROCEDURES } from "./procedures";
import type { AgeBand, Caution, City, Condition, Goal, Procedure, QuizAnswers, Recent, SkinTone } from "./types";

/**
 * The person's quiz answers ("parameters"). Every list in the app is filtered
 * by them. Kept only in this browser tab (sessionStorage) and cleared when the
 * tab closes; never sent anywhere.
 */
export type Flag = Caution | Condition | "no-downtime";
export interface Profile {
  city: City;
  goals: Goal[];
  age: AgeBand;
  tone: SkinTone;
  flags: Flag[];
  /** Treatment ids had in the last 6 months. */
  had: string[];
}

const KEY = "aesthetic_guide_profile";
const CONDITIONS: Condition[] = ["melasma", "rosacea", "cold-sores"];
let memory: Profile | null = null;
let cachedRaw: string | null | undefined;
const listeners = new Set<() => void>();

function read(): Profile | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      memory = raw ? (JSON.parse(raw) as Profile) : null;
      // Drop goals that no longer exist (e.g. a tab saved before a goal was retired).
      if (memory) memory = { ...memory, goals: (memory.goals ?? []).filter((g) => g in GOAL_LABELS), had: memory.had ?? [] };
    }
  } catch {
    /* storage blocked: keep in-memory copy */
  }
  return memory;
}

/** Current profile, read once (for prefilling the quiz). */
export function readProfileOnce(): Profile | null {
  return read();
}

export function saveProfile(p: Profile) {
  memory = p;
  try {
    const raw = JSON.stringify(p);
    sessionStorage.setItem(KEY, raw);
    cachedRaw = raw;
  } catch {}
  listeners.forEach((l) => l());
}

export function clearProfile() {
  memory = null;
  try {
    sessionStorage.removeItem(KEY);
    cachedRaw = null;
  } catch {}
  listeners.forEach((l) => l());
}

export function useProfile(): Profile | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => null,
  );
}

const SKIN_PROCEDURES = new Set(["microneedling"]);
/** Groups past treatments into the categories our timing notes use (lib/advice.ts). */
export function recentFrom(had: string[]): Recent[] {
  const out = new Set<Recent>();
  for (const id of had) {
    const p = PROCEDURES.find((x) => x.id === id);
    if (!p) continue;
    if (p.approach === "toxin") out.add("botox");
    else if (p.approach === "ha" || p.approach === "biostim") out.add("filler");
    else if (p.approach === "energy") out.add("energy");
    else if (p.approach === "laser") out.add("laser");
    else if (SKIN_PROCEDURES.has(p.id)) out.add("peel");
  }
  return [...out];
}

export function toAnswers(p: Profile, goals: Goal[] = p.goals): QuizAnswers {
  return {
    goals,
    downtime: p.flags.includes("no-downtime") ? "none" : "any",
    cautions: p.flags.filter((f): f is Caution => f !== "no-downtime" && !CONDITIONS.includes(f as Condition)),
    conditions: p.flags.filter((f): f is Condition => CONDITIONS.includes(f as Condition)),
    age: p.age,
    tone: p.tone,
    recent: recentFrom(p.had ?? []),
    had: p.had ?? [],
  };
}

/** Everything for the given goals, split into: fits you / hidden for safety / outside your downtime. */
export function personalize(p: Profile, goals: Goal[]): { shown: Match[]; hidden: Hidden[]; outside: Procedure[] } {
  const { shown, hidden } = matchProcedures(toAnswers(p, goals));
  const shownIds = new Set(shown.map((m) => m.procedure.id));
  const hiddenIds = new Set(hidden.map((h) => h.procedure.id));
  const outside = PROCEDURES.filter((x) => x.goals.some((g) => goals.includes(g)) && !shownIds.has(x.id) && !hiddenIds.has(x.id));
  return { shown, hidden, outside };
}
