import { describe, expect, it } from "vitest";
import { searchAll } from "../../components/TreatmentSearch";
import { COURSE, PER_YEAR, courseCost, yearlyCost } from "../../lib/cost";
import { GOAL_EVERYDAY, GOAL_LABELS, GOAL_WORDS, PROCEDURES } from "../../lib/procedures";

describe("search", () => {
  it("finds treatments by brand name", () => {
    expect(searchAll("morpheus").treatments.map((p) => p.id)).toContain("morpheus8");
    expect(searchAll("Dysport").treatments.map((p) => p.id)).toContain("botox");
    expect(searchAll("juvederm").treatments.length).toBeGreaterThan(0);
  });
  it("finds goals by everyday words", () => {
    expect(searchAll("sun spots").goals).toContain("pigment");
    expect(searchAll("sagging jawline").goals).toContain("lift");
    expect(searchAll("pimples").goals).toContain("breakouts");
  });
  it("every goal has everyday words", () => {
    for (const g of Object.keys(GOAL_LABELS)) {
      expect(GOAL_EVERYDAY[g]).toBeTruthy();
      expect(GOAL_WORDS[g].length).toBeGreaterThan(2);
    }
  });
});

describe("course and yearly cost", () => {
  const ids = new Set(PROCEDURES.map((p) => p.id));
  it("only covers known treatments, never both for one treatment", () => {
    for (const id of [...Object.keys(COURSE), ...Object.keys(PER_YEAR)]) expect(ids.has(id), id).toBe(true);
    for (const id of Object.keys(COURSE)) expect(PER_YEAR[id], id).toBeUndefined();
  });
  it("is price times sessions", () => {
    const botox = PROCEDURES.find((p) => p.id === "botox");
    const c = botox?.cost.nyc as [number, number];
    expect(yearlyCost(botox as never, "nyc")).toBe(`$${(c[0] * 3).toLocaleString("en-US")}–$${(c[1] * 4).toLocaleString("en-US")}`);
    const ultra = PROCEDURES.find((p) => p.id === "ultraclear");
    expect(courseCost(ultra as never, "nyc")).toBeUndefined(); // no published price, no made-up total
  });
});
