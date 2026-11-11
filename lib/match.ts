import { PROCEDURES } from "./procedures";
import { belowMinAge, notesFor, type Note } from "./advice";
import { CAUTIONS } from "./cautions";
import type { Procedure, QuizAnswers } from "./types";

const MAX_DOWNTIME = { none: 1, short: 7, any: Infinity } as const;

export interface Match {
  procedure: Procedure;
  score: number;
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
    if (p.tier > a.budget || p.downtimeDays[1] > MAX_DOWNTIME[a.downtime]) continue;
    shown.push({
      procedure: p,
      score: p.goals.filter((g) => a.goals.includes(g)).length,
      flagged: [],
      notes: notesFor(p, a),
    });
  }
  shown.sort((x, y) => y.score - x.score || x.procedure.tier - y.procedure.tier);
  return { shown, hidden };
}

export function usd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function downtimeShort([lo, hi]: [number, number]) {
  if (hi === 0) return "None";
  if (lo === 0 && hi === 1) return "Up to 1 day";
  return `${lo || 1}–${hi} days`;
}
