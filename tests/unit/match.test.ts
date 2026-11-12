// Personalization and safety: unsafe options are never shown, ranking follows the published rules.
import { describe, expect, it } from "vitest";
import { matchProcedures, rank, safetyReasons } from "@/lib/match";
import { personalize, recentFrom, toAnswers, type Profile } from "@/lib/profile";
import { GOAL_LABELS, PROCEDURES } from "@/lib/procedures";
import type { Goal } from "@/lib/types";

const base: Profile = { city: "nyc", goals: [], age: "35-49", tone: "light", flags: [], had: [] };
const goals = Object.keys(GOAL_LABELS) as Goal[];
const profiles: [string, Partial<Profile>][] = [
  ["typical", {}],
  ["pregnant", { flags: ["pregnancy"] }],
  ["deep skin", { tone: "deep" }],
  ["age 18-21", { age: "18-21" }],
  ["melasma + rosacea", { flags: ["melasma", "rosacea"] }],
  ["accutane", { flags: ["isotretinoin"] }],
  ["bleeding + keloid", { flags: ["blood-thinners", "keloid"] }],
  ["allergy + implant + light", { flags: ["severe-allergy", "bovine-collagen", "implant-device", "light-sensitivity"] }],
  ["zero downtime", { flags: ["no-downtime"] }],
];

describe("matching", () => {
  for (const [name, over] of profiles)
    for (const g of goals)
      it(`${name} / ${g}: shows only safe options for the goal, hides with reasons`, () => {
        const p = { ...base, ...over, goals: [g] } as Profile;
        const { shown, hidden, outside } = personalize(p, [g]);
        for (const m of shown) {
          expect(m.procedure.goals).toContain(g);
          expect(safetyReasons(m.procedure, toAnswers(p, [g]))).toEqual([]);
        }
        for (const h of hidden) expect(h.reasons.length).toBeGreaterThan(0);
        expect(shown.length + hidden.length + outside.length).toBe(PROCEDURES.filter((x) => x.goals.includes(g)).length);
      });

  it.each(goals)("typical profile gets at least 4 options for %s", (g) => {
    expect(personalize({ ...base, goals: [g] }, [g]).shown.length).toBeGreaterThanOrEqual(4);
  });

  it("hides IPL for deep skin and fillers under 22", () => {
    const deep = matchProcedures(toAnswers({ ...base, tone: "deep", goals: ["pigment"] }));
    expect(deep.shown.map((m) => m.procedure.id)).not.toContain("ipl");
    const young = matchProcedures(toAnswers({ ...base, age: "18-21", goals: ["volume"] }));
    expect(young.shown.map((m) => m.procedure.id)).not.toContain("cheek-filler");
  });

  it("hides label-contraindicated treatments for the new health questions", () => {
    const shownFor = (flag: Profile["flags"][number], g: Goal) =>
      personalize({ ...base, flags: [flag], goals: [g] }, [g]).shown.map((m) => m.procedure.id);
    expect(shownFor("implant-device", "lift")).not.toContain("thermage");
    expect(shownFor("light-sensitivity", "breakouts")).not.toContain("pdt");
    expect(shownFor("bovine-collagen", "acne")).not.toContain("bellafill");
    expect(shownFor("severe-allergy", "volume")).not.toContain("cheek-filler");
  });
});

describe("ranking", () => {
  it("weights goals, research and results, and explains itself", () => {
    const botox = PROCEDURES.find((p) => p.id === "botox")!;
    const r = rank(botox, toAnswers({ ...base, goals: ["lines"] }));
    expect(r.score).toBe(3 + 2 * 3 + botox.results);
    expect(r.why.good[0]).toMatch(/your goal/);
  });

  it("puts laser toning first for melasma and warns on lasers that can darken it", () => {
    const { shown } = personalize({ ...base, tone: "medium", flags: ["melasma"], goals: ["pigment"] }, ["pigment"]);
    expect(shown[0].procedure.id).toBe("laser-toning");
    const fraxel = shown.find((m) => m.procedure.id === "fraxel");
    expect(fraxel?.why.watch.join(" ")).toMatch(/melasma darker/);
  });

  it("is sorted by score, then fewer cautions", () => {
    const { shown } = personalize({ ...base, tone: "medium", flags: ["melasma", "rosacea"], goals: ["pigment", "redness"] }, ["pigment", "redness"]);
    for (let i = 1; i < shown.length; i++) {
      const a = shown[i - 1], b = shown[i];
      expect(a.score > b.score || (a.score === b.score && a.why.watch.length <= b.why.watch.length)).toBe(true);
    }
  });

  it("groups recent treatments into timing categories", () => {
    expect(recentFrom(["botox", "cheek-filler", "sofwave", "fraxel", "peel", "unknown"]).sort()).toEqual(["botox", "energy", "filler", "laser", "peel"]);
  });
});
