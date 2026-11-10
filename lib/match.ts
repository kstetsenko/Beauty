import { PROCEDURES } from "./procedures";
import type { Procedure, QuizAnswers } from "./types";

const MAX_DOWNTIME = { none: 1, short: 7, any: Infinity } as const;

export interface Match {
  procedure: Procedure;
  score: number;
  flagged: QuizAnswers["cautions"];
}

/** Rank procedures against quiz answers. Pure function, runs in the browser. */
export function matchProcedures(a: QuizAnswers): Match[] {
  return PROCEDURES.filter(
    (p) => p.tier <= a.budget && p.downtimeDays[1] <= MAX_DOWNTIME[a.downtime],
  )
    .map((p) => ({
      procedure: p,
      score: p.goals.filter((g) => a.goals.includes(g)).length,
      flagged: p.contraindications.filter((c) => a.cautions.includes(c)),
    }))
    .filter((m) => m.score > 0)
    .sort((x, y) => y.score - x.score || x.flagged.length - y.flagged.length || x.procedure.tier - y.procedure.tier);
}

export function usd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function downtimeShort([lo, hi]: [number, number]) {
  if (hi === 0) return "None";
  if (lo === 0 && hi === 1) return "Up to 1 day";
  return `${lo || 1}–${hi} days`;
}
