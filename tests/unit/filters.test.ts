// Every plan, filter and goal tab offered on the results page must lead to at least one result.
import { describe, expect, it } from "vitest";
import { applyFilters, availableFilters, availablePlans, sortMatches, SORTS } from "@/lib/filters";
import { personalize, type Profile } from "@/lib/profile";
import { GOAL_LABELS } from "@/lib/procedures";
import type { City, Goal } from "@/lib/types";
import { filterFitsGoals, flagsForGoals } from "@/lib/relevance";
import { PROCEDURES } from "@/lib/procedures";

const goals = Object.keys(GOAL_LABELS) as Goal[];
const base: Profile = { city: "nyc", goals: [], age: "35-49", tone: "light", flags: [], had: [] };
const profiles: Partial<Profile>[] = [
  {}, { tone: "deep" }, { age: "18-21" }, { flags: ["pregnancy"] }, { flags: ["melasma", "rosacea"] },
  { flags: ["no-downtime"] }, { flags: ["blood-thinners", "keloid", "severe-allergy"] }, { age: "65+", tone: "medium" },
];
// Single goals plus every pair of goals.
const goalSets: Goal[][] = [...goals.map((g) => [g]), ...goals.flatMap((a, i) => goals.slice(i + 1).map((b) => [a, b]))];

describe("results options never lead to an empty list", () => {
  for (const city of ["nyc", "miami"] as City[])
    for (const over of profiles)
      it(`${city} ${JSON.stringify(over)}: all goal sets`, () => {
        for (const gs of goalSets) {
          const { shown } = personalize({ ...base, ...over, city, goals: gs }, gs);
          if (!shown.length) continue;
          const tabs: (Goal | null)[] = [null, ...gs.filter((g) => shown.some((m) => m.procedure.goals.includes(g)))];
          for (const tab of tabs) {
            for (const p of availablePlans(shown, city, tab, gs)) {
              for (const f of p.filters) expect(filterFitsGoals(f, tab ? [tab] : gs), `${gs} ${tab} plan ${p.label} off-topic`).toBe(true);
              expect(p.count, `${gs} ${tab} plan ${p.label}`).toBeGreaterThan(0);
              expect(applyFilters(shown, p.filters, city, tab).length).toBe(p.count);
            }
            // Every offered chip, and every chip offered after that one, still leaves results (two levels deep).
            for (const c1 of availableFilters(shown, [], city, tab, gs)) {
              expect(filterFitsGoals(c1.f, tab ? [tab] : gs), `${gs} ${tab} ${c1.f} off-topic`).toBe(true);
              expect(c1.count, `${gs} ${tab} ${c1.f}`).toBeGreaterThan(0);
              expect(applyFilters(shown, [c1.f], city, tab).length).toBe(c1.count);
              for (const c2 of availableFilters(shown, [c1.f], city, tab, gs))
                expect(applyFilters(shown, c2.on ? [c1.f] : [c1.f, c2.f], city, tab).length, `${gs} ${tab} ${c1.f}+${c2.f}`).toBeGreaterThan(0);
            }
            for (const [s] of SORTS) expect(sortMatches(applyFilters(shown, [], city, tab), s, city).length).toBeGreaterThan(0);
          }
        }
      });
});

describe("every step stays connected to the goals", () => {
  it("never offers collagen, long-lasting or right-away options for breakouts", () => {
    const { shown } = personalize({ ...base, goals: ["breakouts"] }, ["breakouts"]);
    const chips = availableFilters(shown, [], "nyc", null, ["breakouts"]).map((c) => c.f);
    expect(chips).not.toContain("collagen");
    expect(chips).not.toContain("lasting");
    expect(chips).not.toContain("now");
    expect(availablePlans(shown, "nyc", null, ["breakouts"]).map((p) => p.label)).not.toContain("Long-lasting");
  });

  it("offers collagen-building for lines and acne scars", () => {
    for (const g of ["lines", "acne"] as Goal[]) {
      const { shown } = personalize({ ...base, goals: [g] }, [g]);
      expect(availableFilters(shown, [], "nyc", null, [g]).map((c) => c.f)).toContain("collagen");
    }
  });

  it("asks only health questions that affect a treatment for the chosen goals", () => {
    for (const g of goals) {
      const flags = flagsForGoals([g]);
      const procs = PROCEDURES.filter((p) => p.goals.includes(g));
      for (const c of ["bovine-collagen", "implant-device", "light-sensitivity", "severe-allergy", "keloid"] as const)
        expect(flags.has(c), `${g} ${c}`).toBe(procs.some((p) => p.contraindications.includes(c)));
    }
    expect(flagsForGoals(["breakouts"]).has("bovine-collagen")).toBe(false);
    expect(flagsForGoals(["acne"]).has("bovine-collagen")).toBe(true);
    expect(flagsForGoals(["breakouts"]).has("light-sensitivity")).toBe(true);
    expect(flagsForGoals(["lift"]).has("implant-device")).toBe(true);
    expect(flagsForGoals(["pigment"]).has("melasma")).toBe(true);
    expect(flagsForGoals(["redness"]).has("rosacea")).toBe(true);
  });
});
