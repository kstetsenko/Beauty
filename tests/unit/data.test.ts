// Data integrity: every treatment is complete, sourced and internally consistent.
import { describe, expect, it } from "vitest";
import { GOAL_LABELS, PROCEDURES } from "@/lib/procedures";
import { RESEARCH } from "@/lib/research";
import { LEARN, GOAL_GUIDE } from "@/lib/learn";
import { QUESTIONS } from "@/lib/questions";
import { CAUTIONS } from "@/lib/cautions";
import { SAFETY } from "@/lib/safety";

const ids = PROCEDURES.map((p) => p.id);

describe("treatments", () => {
  it("have unique ids", () => expect(new Set(ids).size).toBe(ids.length));

  it.each(PROCEDURES.map((p) => [p.id, p] as const))("%s is complete and consistent", (_id, p) => {
    expect(p.goals.length).toBeGreaterThan(0);
    for (const g of p.goals) expect(GOAL_LABELS[g]).toBeTruthy();
    expect(p.cost.nyc[0]).toBeLessThanOrEqual(p.cost.nyc[1]);
    expect(p.cost.miami[0]).toBeLessThanOrEqual(p.cost.miami[1]);
    expect(p.downtimeDays[0]).toBeLessThanOrEqual(p.downtimeDays[1]);
    expect(p.pain).toBeGreaterThanOrEqual(1);
    expect(p.pain).toBeLessThanOrEqual(5);
    expect([1, 2, 3]).toContain(p.results);
    for (const c of p.contraindications) expect(CAUTIONS[c]).toBeTruthy();
  });

  it.each(ids)("%s has research with studies and an evidence level", (id) => {
    const r = RESEARCH[id];
    expect(r).toBeTruthy();
    expect([1, 2, 3]).toContain(r.evidence);
    // No studies is allowed only when research is rated "Limited" (and the card says so).
    if (r.evidence > 1) expect(r.studies.length).toBeGreaterThan(0);
    for (const s of [...r.studies, ...r.prices]) expect(s.url).toMatch(/^https:\/\//);
  });

  it.each(ids)("%s has learning links and at least 3 tailored questions", (id) => {
    expect(LEARN[id]?.length).toBeGreaterThan(0);
    expect(QUESTIONS[id]?.length).toBeGreaterThanOrEqual(3);
  });

  it("has no orphan research, learning, question or safety entries", () => {
    for (const map of [RESEARCH, LEARN, QUESTIONS, SAFETY]) for (const k of Object.keys(map)) expect(ids).toContain(k);
  });

  it("never repeats a provider question across treatments", () => {
    const all = Object.values(QUESTIONS).flat();
    expect(new Set(all).size).toBe(all.length);
  });

  it("has a goal guide for every goal", () => {
    for (const g of Object.keys(GOAL_LABELS)) expect(GOAL_GUIDE[g as keyof typeof GOAL_GUIDE]).toBeTruthy();
  });

  it("keeps scope: no removed or out-of-scope treatments", () => {
    for (const gone of ["lip-filler", "nose-filler", "masseter", "tretinoin", "azelaic", "laser-hair", "coolsculpting"]) expect(ids).not.toContain(gone);
  });
});
