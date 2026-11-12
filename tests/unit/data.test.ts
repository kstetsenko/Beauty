// Data integrity: every treatment is complete, sourced and internally consistent.
import { describe, expect, it } from "vitest";
import { GOAL_LABELS, PROCEDURES } from "@/lib/procedures";
import { RESEARCH } from "@/lib/research";
import { LEARN, GOAL_GUIDE } from "@/lib/learn";
import { CAUTIONS } from "@/lib/cautions";
import { SAFETY } from "@/lib/safety";
import { PLAIN, STUDY_KIND } from "@/lib/plain";
import { BASIS } from "@/lib/basis";

const ids = PROCEDURES.map((p) => p.id);

describe("treatments", () => {
  it("have unique ids", () => expect(new Set(ids).size).toBe(ids.length));

  it.each(PROCEDURES.map((p) => [p.id, p] as const))("%s is complete and consistent", (_id, p) => {
    expect(p.goals.length).toBeGreaterThan(0);
    for (const g of p.goals) expect(GOAL_LABELS[g]).toBeTruthy();
    for (const c of [p.cost.nyc, p.cost.miami]) if (c) expect(c[0]).toBeLessThanOrEqual(c[1]);
    // A published price needs a price source; an unpublished one is shown as "Price not published".
    if (p.cost.nyc || p.cost.miami) expect(p.priceUnit.length).toBeGreaterThan(0);
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

  it.each(ids)("%s has learning links", (id) => {
    expect(LEARN[id]?.length).toBeGreaterThan(0);
  });

  it("has no orphan research, learning or safety entries", () => {
    for (const map of [RESEARCH, LEARN, SAFETY]) for (const k of Object.keys(map)) expect(ids).toContain(k);
  });

  it.each(ids)("%s has a plain-language research summary, and every study type is explained", (id) => {
    expect(PLAIN[id]?.works.length).toBeGreaterThan(10);
    for (const st of RESEARCH[id].studies) expect(STUDY_KIND[st.kind], st.kind).toBeTruthy();
  });

  it.each(ids)("%s has a confirmed FDA status with a source (only FDA-approved or cleared treatments are listed)", (id) => {
    expect(BASIS[id]?.length, id).toBeGreaterThan(0);
    for (const b of BASIS[id]) expect(b.url).toMatch(/^https:\/\//);
  });

  it("has no orphan plain summaries", () => {
    for (const k of Object.keys(PLAIN)) expect(ids).toContain(k);
  });

  it("has a goal guide for every goal", () => {
    for (const g of Object.keys(GOAL_LABELS)) expect(GOAL_GUIDE[g as keyof typeof GOAL_GUIDE]).toBeTruthy();
  });

  it("keeps scope: no removed or out-of-scope treatments", () => {
    for (const gone of ["lip-filler", "nose-filler", "masseter", "tretinoin", "azelaic", "laser-hair", "coolsculpting", "dermaplaning", "peel", "hydrafacial", "prp"]) expect(ids).not.toContain(gone);
  });
});

describe("plain study summary", () => {
  it("reads as a correct English sentence", async () => {
    const { studySummary } = await import("@/lib/plain");
    expect(studySummary([])).toBe("We found no published clinical studies.");
    expect(studySummary(["Clinical study"])).toBe("Based on one published study: a clinical study.");
    expect(studySummary(["Randomized trial", "Meta-analysis", "Randomized trial"])).toBe("Based on 3 published studies: 1 meta-analysis and 2 randomized controlled trials.");
  });
});
