// Recent treatments change the recommendation: similar single-session treatments wait until results settle.
import { describe, expect, it } from "vitest";
import { laterReason } from "@/lib/match";
import { personalize, toAnswers, type Profile } from "@/lib/profile";
import { PROCEDURES } from "@/lib/procedures";

const base: Profile = { city: "nyc", goals: ["lift"], age: "50-64", tone: "light", flags: [], had: [] };
const proc = (id: string) => PROCEDURES.find((p) => p.id === id)!;

describe("recent treatments", () => {
  it("moves similar skin-tightening treatments to Later after Sofwave", () => {
    const a = toAnswers({ ...base, had: ["sofwave"] });
    for (const id of ["sofwave", "ultherapy", "thermage", "xerf"]) expect(laterReason(proc(id), a), id).toMatch(/Sofwave recently/);
    expect(laterReason(proc("threads"), a)).toBeUndefined();
  });

  it("keeps the top recommendations free of still-settling treatments", () => {
    const { shown } = personalize({ ...base, had: ["ultherapy"] }, ["lift"]);
    const now = shown.filter((m) => !m.later).map((m) => m.procedure.id);
    expect(now).not.toContain("sofwave");
    expect(shown.find((m) => m.procedure.id === "sofwave")?.later).toMatch(/Ultherapy recently/);
  });

  it("applies to deep resurfacing and collagen injectables too, but not to series or touch-up treatments", () => {
    expect(laterReason(proc("erbium"), toAnswers({ ...base, had: ["co2"] }))).toBeTruthy();
    expect(laterReason(proc("radiesse"), toAnswers({ ...base, had: ["sculptra"] }))).toBeTruthy();
    expect(laterReason(proc("botox"), toAnswers({ ...base, had: ["botox"] }))).toBeUndefined();
    expect(laterReason(proc("microneedling"), toAnswers({ ...base, had: ["microneedling"] }))).toBeUndefined();
  });

  it("changes nothing without recent treatments", () => {
    for (const p of PROCEDURES) expect(laterReason(p, toAnswers(base))).toBeUndefined();
  });
});
