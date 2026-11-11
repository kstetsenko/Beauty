// Exhaustive logic check: every goal × a range of profiles. Run with `npm run check`.
// Fails (exit 1) if any unsafe treatment is shown, a shown treatment doesn't match the goal,
// a treatment lacks research/learning data, or a goal has too few options for a typical profile.
import { safetyReasons } from "../lib/match";
import { LEARN } from "../lib/learn";
import { personalize, toAnswers, type Profile } from "../lib/profile";
import { GOAL_LABELS, PROCEDURES } from "../lib/procedures";
import { RESEARCH } from "../lib/research";
import { QUESTIONS } from "../lib/questions";
import type { Goal } from "../lib/types";

const base: Profile = { city: "nyc", goals: [], age: "35-49", tone: "light", flags: [], recent: [], budget: 3 };
const profiles: [string, Partial<Profile>][] = [
  ["typical ($$$)", {}],
  ["budget $", { budget: 1 }],
  ["budget $$", { budget: 2 }],
  ["pregnant", { flags: ["pregnancy"] }],
  ["deep skin", { tone: "deep" }],
  ["age 18-21", { age: "18-21" }],
  ["melasma", { flags: ["melasma"] }],
  ["rosacea", { flags: ["rosacea"] }],
  ["on Accutane", { flags: ["isotretinoin"] }],
  ["blood thinners + keloids", { flags: ["blood-thinners", "keloid"] }],
  ["zero downtime", { flags: ["no-downtime"] }],
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
  if (p.cost.nyc[0] > p.cost.nyc[1] || p.cost.miami[0] > p.cost.miami[1]) fail(`${p.id}: price range reversed`);
  if (!p.goals.length) fail(`${p.id}: no goals`);
  if ((QUESTIONS[p.id]?.length ?? 0) < 3) fail(`${p.id}: fewer than 3 provider questions`);
}
for (const id of Object.keys(QUESTIONS)) if (!PROCEDURES.some((p) => p.id === id)) fail(`questions for unknown treatment ${id}`);
// Same question on many treatments = generic, not tailored.
const seen = new Map<string, number>();
for (const qs of Object.values(QUESTIONS)) for (const q of qs) seen.set(q, (seen.get(q) ?? 0) + 1);
for (const [q, n] of seen) if (n > 1) fail(`question repeated on ${n} treatments: "${q.slice(0, 60)}"`);
{
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
    if (name === "typical ($$$)" && shown.length < 4) fail(`${g}: only ${shown.length} options for a typical profile`);
    row.push(String(shown.length).padStart(12));
  }
  console.log(row.join(""));
}
console.log(failures ? `\n${failures} problem(s) found.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
