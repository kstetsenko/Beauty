// Every plan, filter and goal tab offered on the results page must lead to at least one result.
import { describe, expect, it } from "vitest";
import { applyFilters, availableFilters, availablePlans, sortMatches, SORTS } from "@/lib/filters";
import { personalize, type Profile } from "@/lib/profile";
import { GOAL_LABELS } from "@/lib/procedures";
import type { City, Goal } from "@/lib/types";

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
            for (const p of availablePlans(shown, city, tab)) {
              expect(p.count, `${gs} ${tab} plan ${p.label}`).toBeGreaterThan(0);
              expect(applyFilters(shown, p.filters, city, tab).length).toBe(p.count);
            }
            // Every offered chip, and every chip offered after that one, still leaves results (two levels deep).
            for (const c1 of availableFilters(shown, [], city, tab)) {
              expect(c1.count, `${gs} ${tab} ${c1.f}`).toBeGreaterThan(0);
              expect(applyFilters(shown, [c1.f], city, tab).length).toBe(c1.count);
              for (const c2 of availableFilters(shown, [c1.f], city, tab))
                expect(applyFilters(shown, c2.on ? [c1.f] : [c1.f, c2.f], city, tab).length, `${gs} ${tab} ${c1.f}+${c2.f}`).toBeGreaterThan(0);
            }
            for (const [s] of SORTS) expect(sortMatches(applyFilters(shown, [], city, tab), s, city).length).toBeGreaterThan(0);
          }
        }
      });
});
