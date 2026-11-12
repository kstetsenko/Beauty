import { describe, expect, it } from "vitest";
import { PROCEDURES, RESULT_LABELS, RESULT_MEANING } from "../../lib/procedures";
import { RESEARCH } from "../../lib/research";
import { matchProcedures } from "../../lib/match";
import { GOAL_LABELS } from "../../lib/procedures";


describe("expected results", () => {
  it("every treatment has a level with a label and a meaning", () => {
    for (const p of PROCEDURES) {
      expect([1, 2, 3], p.id).toContain(p.results);
      expect(RESULT_LABELS[p.results]).toBeTruthy();
      expect(RESULT_MEANING[p.results]).toMatch(/\.$/);
    }
  });
  it("low-certainty treatments never claim dramatic results", () => {
    for (const p of PROCEDURES) if (RESEARCH[p.id].evidence === 1) expect(p.results, p.id).toBeLessThan(3);
  });
});

describe("reason wording", () => {
  it("no reason starts with punctuation such as '!' and none ends with a full stop (the card adds it)", () => {
    for (const goal of Object.keys(GOAL_LABELS)) {
      for (const tone of ["light", "medium", "deep"] as const) {
        const { shown } = matchProcedures({ goals: [goal], downtime: "any", cautions: [], tone, had: ["sofwave"], recent: ["filler"], conditions: ["melasma", "rosacea"] } as never);
        for (const m of shown) for (const t of [...m.why.good, ...m.why.watch]) {
          expect(t, t).toMatch(/^[A-Z]/);
          expect(t.endsWith("."), t).toBe(false);
        }
      }
    }
  });
});

describe("no instructions to the person", () => {
  const DIRECTIVE = /\b(tell your provider|ask your provider|tell the provider|you should|avoid |plan the timing|choose an?|mention it|is standard|usually not needed|comes first)\b/i;
  it("treatment data, notes and goal guides only describe; they never instruct", async () => {
    const { notesFor } = await import("../../lib/advice");
    const { GOAL_GUIDE } = await import("../../lib/learn");
    const texts: string[] = [];
    for (const p of PROCEDURES) texts.push(p.notes, p.sessions, p.summary, RESEARCH[p.id].sideEffects ?? "");
    for (const g of Object.values(GOAL_GUIDE)) texts.push(g.intro);
    for (const p of PROCEDURES)
      for (const tone of ["light", "medium", "deep"] as const)
        for (const n of notesFor(p, { goals: p.goals, downtime: "any", cautions: ["isotretinoin"], tone, conditions: ["melasma", "rosacea", "cold-sores"], recent: ["botox", "filler", "energy", "laser", "peel"], had: [p.id] } as never)) texts.push(n.text);
    for (const t of texts) expect(t, t).not.toMatch(DIRECTIVE);
  });
});
