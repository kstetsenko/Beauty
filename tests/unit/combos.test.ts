import { describe, expect, it } from "vitest";
import { COMBOS, combosFor } from "../../lib/combos";
import { PROCEDURES, RESULT_LABELS, RESULT_MEANING } from "../../lib/procedures";
import { RESEARCH } from "../../lib/research";
import { matchProcedures } from "../../lib/match";
import { GOAL_LABELS } from "../../lib/procedures";

const ids = new Set(PROCEDURES.map((p) => p.id));

describe("combinations", () => {
  it("only link treatments in the guide, each with a PubMed or PMC source", () => {
    for (const c of COMBOS) {
      for (const id of c.ids) expect(ids.has(id), id).toBe(true);
      expect(c.ids[0]).not.toBe(c.ids[1]);
      expect(c.source.url).toMatch(/^https:\/\/(pubmed\.ncbi\.nlm\.nih\.gov|pmc\.ncbi\.nlm\.nih\.gov|www\.ncbi\.nlm\.nih\.gov\/pmc)\//);
      expect(c.text.endsWith(".")).toBe(true);
    }
  });
  it("work in both directions", () => {
    for (const c of COMBOS) {
      expect(combosFor(c.ids[0]).map((x) => x.partner)).toContain(c.ids[1]);
      expect(combosFor(c.ids[1]).map((x) => x.partner)).toContain(c.ids[0]);
    }
  });
});

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
