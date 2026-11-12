// Exhaustive logic check: every goal × a range of profiles. Run with `npm run check`.
// Fails (exit 1) if any unsafe treatment is shown, a shown treatment doesn't match the goal,
// a treatment lacks research/learning data, or a goal has too few options for a typical profile.
import { safetyReasons } from "../lib/match";
import { LEARN } from "../lib/learn";
import { personalize, toAnswers, type Profile } from "../lib/profile";
import { GOAL_LABELS, PROCEDURES } from "../lib/procedures";
import { RESEARCH } from "../lib/research";
import { CLINICS } from "../lib/clinics";
import type { Goal } from "../lib/types";

const base: Profile = { city: "nyc", goals: [], age: "35-49", tone: "light", flags: [], had: [] };
const profiles: [string, Partial<Profile>][] = [
  ["typical", {}],
  ["had Botox+filler", { had: ["botox", "cheek-filler"] }],
  ["pregnant", { flags: ["pregnancy"] }],
  ["deep skin", { tone: "deep" }],
  ["age 18-21", { age: "18-21" }],
  ["melasma", { flags: ["melasma"] }],
  ["rosacea", { flags: ["rosacea"] }],
  ["on Accutane", { flags: ["isotretinoin"] }],
  ["blood thinners + keloids", { flags: ["blood-thinners", "keloid"] }],
  ["zero downtime", { flags: ["no-downtime"] }],
  ["allergy+implant+light", { flags: ["severe-allergy", "bovine-collagen", "implant-device", "light-sensitivity"] }],
];

let failures = 0;
const fail = (m: string) => {
  failures++;
  console.log("  ✗ " + m);
};

// Data completeness
for (const p of PROCEDURES) {
  if (!RESEARCH[p.id]) fail(`${p.id}: no research entry`);
  if (!LEARN[p.id]?.length) fail(`${p.id}: no learning links`);
  for (const c of [p.cost.nyc, p.cost.miami]) if (c && c[0] > c[1]) fail(`${p.id}: price range reversed`);
  if (!p.goals.length) fail(`${p.id}: no goals`);
}

const goals = Object.keys(GOAL_LABELS) as Goal[];
const header = ["goal".padEnd(22), ...profiles.map(([n]) => n.slice(0, 11).padStart(12))].join("");
console.log(`\n${PROCEDURES.length} treatments, ${goals.length} goals. Shown options per goal and profile:\n`);
console.log(header);
for (const g of goals) {
  const row = [GOAL_LABELS[g].slice(0, 21).padEnd(22)];
  for (const [name, over] of profiles) {
    const profile = { ...base, ...over, goals: [g] } as Profile;
    const { shown, hidden, outside } = personalize(profile, [g]);
    for (const m of shown) {
      if (!m.procedure.goals.includes(g)) fail(`${g}/${name}: ${m.procedure.id} shown but not for this goal`);
      const r = safetyReasons(m.procedure, toAnswers(profile, [g]));
      if (r.length) fail(`${g}/${name}: unsafe ${m.procedure.id} shown (${r.join(", ")})`);
    }
    for (const h of hidden) if (!h.reasons.length) fail(`${g}/${name}: ${h.procedure.id} hidden without a reason`);
    const total = PROCEDURES.filter((p) => p.goals.includes(g)).length;
    if (shown.length + hidden.length + outside.length !== total) fail(`${g}/${name}: counts don't add up`);
    if (name === "typical" && shown.length < 4) fail(`${g}: only ${shown.length} options for a typical profile`);
    row.push(String(shown.length).padStart(12));
  }
  console.log(row.join(""));
}
// Clinic coverage (report only): treatments with no checked clinic fall back to a Google Maps search.
for (const city of ["nyc", "miami"] as const) {
  const miss = PROCEDURES.filter((p) => !CLINICS.some((c) => c.city === city && c.offers.includes(p.id))).map((p) => p.id);
  console.log(`Clinic coverage ${city}: ${PROCEDURES.length - miss.length}/${PROCEDURES.length}${miss.length ? " — Google Maps fallback for: " + miss.join(", ") : ""}`);
}
for (const c of CLINICS) for (const o of c.offers) if (!PROCEDURES.some((p) => p.id === o)) fail(`clinic ${c.id} lists unknown treatment ${o}`);
console.log(failures ? `\n${failures} problem(s) found.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
