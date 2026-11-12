"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { CITY_LABELS } from "@/lib/clinics";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, GOAL_LABELS, ONSET_LABELS, PAIN_LABELS, PROCEDURES, RESULT_LABELS } from "@/lib/procedures";
import { EVIDENCE_LABELS, RESEARCH, priceChecked } from "@/lib/research";
import type { City, Goal, Procedure } from "@/lib/types";
import { Dots } from "./ProcedureFacts";
import { personalize, type Profile } from "@/lib/profile";
import { NotShown, ProfileBar, ProfileGate } from "./ProfileGate";

const ROWS: { label: string; cell: (p: Procedure, c: City) => React.ReactNode }[] = [
  { label: "Price", cell: (p, c) => <>{usd(p.cost[c][0])}–{usd(p.cost[c][1]).replace("$", "")}<span className="block text-[11px] text-muted">{p.priceUnit}{priceChecked(p.id, c) ? "" : " · estimate"}</span></> },
  { label: "Research", cell: (p) => <><Dots value={RESEARCH[p.id].evidence} max={3} label="Evidence" /><span className="block text-[11px] text-muted mt-1">{EVIDENCE_LABELS[RESEARCH[p.id].evidence]}</span></> },
  { label: "Results", cell: (p) => <><Dots value={p.results} max={3} label="Results" /><span className="block text-[11px] text-muted mt-1">{RESULT_LABELS[p.results]}</span></> },
  { label: "Pain", cell: (p) => <><Dots value={p.pain} max={5} label="Pain" /><span className="block text-[11px] text-muted mt-1">{PAIN_LABELS[p.pain]}</span></> },
  { label: "Recovery", cell: (p) => downtimeShort(p.downtimeDays) },
  { label: "Results show", cell: (p) => ONSET_LABELS[p.onset] },
  { label: "Sessions", cell: (p) => p.sessions },
  { label: "Lasts", cell: (p) => p.lasts },
  { label: "How it works", cell: (p) => APPROACHES[p.approach].label },
];

const isGoal = (g: string | null): g is Goal => !!g && g in GOAL_LABELS;
const pill = (on: boolean) =>
  "rounded-full px-3.5 py-1.5 text-sm border " + (on ? "bg-ink text-white border-ink" : "bg-white border-line hover:border-ink");

/**
 * Side-by-side comparison, limited to treatments for the same goal so people
 * only compare like with like (e.g. wrinkle options with wrinkle options).
 */
export function CompareView() {
  return <ProfileGate what="compare treatments">{(profile) => <CompareFor profile={profile} />}</ProfileGate>;
}

function CompareFor({ profile }: { profile: Profile }) {
  const params = useSearchParams();
  const router = useRouter();
  const city: City = profile.city;
  const rawIds = (params.get("ids") || "").split(",").filter((id) => PROCEDURES.some((p) => p.id === id));
  const first = PROCEDURES.find((p) => p.id === rawIds[0]);
  // Goal: from the link, or the only goal of the first treatment.
  const goalParam = params.get("goal");
  // Only the person's own goals can be compared; for a linked treatment, the goals it shares with them.
  const myGoals = first ? first.goals.filter((g) => profile.goals.includes(g)) : profile.goals;
  const goal: Goal | null = isGoal(goalParam) && profile.goals.includes(goalParam) ? goalParam : myGoals.length === 1 ? myGoals[0] : null;
  const fit = goal ? personalize(profile, [goal]) : { shown: [], hidden: [], outside: [] };
  const allowed = new Set(fit.shown.map((m) => m.procedure.id));
  const ids = goal ? rawIds.filter((id) => allowed.has(id)).slice(0, 3) : [];
  const dropped = goal ? rawIds.length - ids.length : 0;
  const chosen = ids.map((id) => PROCEDURES.find((p) => p.id === id)!);
  const options = fit.shown.map((m) => m.procedure).filter((p) => !ids.includes(p.id));

  const go = (next: { goal?: Goal | null; ids?: string[] }) => {
    const g = next.goal === undefined ? goal : next.goal;
    const q = new URLSearchParams();
    if (g) q.set("goal", g);
    const list = next.ids ?? ids;
    if (list.length) q.set("ids", list.join(","));
    q.set("city", city);
    router.replace(`/compare?${q.toString()}`, { scroll: false });
  };

  // Step 1: choose which of your goals to compare for.
  if (!goal) {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-semibold mb-1.5">Compare treatments</h1>
        <p className="text-sm text-muted mb-4">
          {first && myGoals.length === 0
            ? `${first.name} isn't used for any of your goals. Pick one of your goals, or edit your answers.`
            : "Which of your goals are you comparing treatments for? You'll only see options that fit your answers."}
        </p>
        <ProfileBar profile={profile} />
        <div className="grid grid-cols-2 gap-2.5">
          {(myGoals.length ? myGoals : profile.goals).map((g) => {
            const list = personalize(profile, [g]).shown;
            if (list.length < 2) {
              return (
                <div key={g} className="tile opacity-60">
                  <span className="font-medium">{GOAL_LABELS[g]}</span>
                  <span className="block text-xs text-muted mt-0.5">
                    {list.length === 0 ? "No options fit your answers" : "Only 1 option fits — nothing to compare"}
                  </span>
                  {list.length === 1 && (
                    <a href={`/procedures/${list[0].procedure.id}?city=${city}`} className="block text-xs underline mt-1">{list[0].procedure.name} →</a>
                  )}
                </div>
              );
            }
            return (
              <button key={g} type="button" onClick={() => go({ goal: g, ids: first && myGoals.includes(g) ? [first.id] : [] })} className="tile">
                <span className="font-medium">{GOAL_LABELS[g]}</span>
                <span className="block text-xs text-muted mt-0.5">{list.length} options for you</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <h1 className="text-2xl font-semibold mb-1.5">Compare: {GOAL_LABELS[goal]}</h1>
      <p className="text-sm text-muted mb-4">
        Up to 3 treatments for the same goal that fit your answers. Prices for {CITY_LABELS[city]}.{" "}
        {profile.goals.length > 1 && <button type="button" onClick={() => go({ goal: null, ids: [] })} className="underline">Change goal</button>}
      </p>
      <ProfileBar profile={profile} />
      {dropped > 0 && (
        <p className="text-xs rounded-2xl bg-blush p-3 mb-4">
          {dropped} treatment{dropped > 1 ? "s were" : " was"} left out because {dropped > 1 ? "they don't" : "it doesn't"} fit {GOAL_LABELS[goal].toLowerCase()} or your answers.
        </p>
      )}

      <label className="block mb-5">
        <span className="sr-only">Add a treatment</span>
        <select
          value=""
          disabled={ids.length >= 3 || options.length === 0}
          onChange={(e) => e.target.value && go({ ids: [...ids, e.target.value] })}
          className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm disabled:opacity-50"
        >
          <option value="">
            {ids.length >= 3 ? "Remove one to add another" : options.length === 0 ? "No other options for this goal" : `+ Add a ${GOAL_LABELS[goal].toLowerCase()} treatment`}
          </option>
          {options.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>

      {chosen.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">Add treatments above to see them side by side.</p>
      ) : (
        <div className="rounded-3xl bg-white border border-line overflow-hidden">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[26%] p-3 text-left text-[11px] font-normal text-muted align-bottom">Treatment</th>
                {chosen.map((p) => (
                  <th key={p.id} className="p-3 text-left align-top font-semibold">
                    <a href={`/procedures/${p.id}?city=${city}`} className="block leading-snug break-words">{p.name}</a>
                    <button type="button" onClick={() => go({ ids: ids.filter((x) => x !== p.id) })} className="text-[11px] text-muted underline font-normal mt-1">
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-3 text-left text-[11px] font-normal text-muted align-top">{r.label}</th>
                  {chosen.map((p) => <td key={p.id} className="p-3 align-top break-words">{r.cell(p, city)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {chosen.length > 0 && (
        <section className="mt-5 rounded-3xl bg-blush p-5">
          <h2 className="font-semibold">Next: find a clinic</h2>
          <p className="text-xs text-muted mt-1 mb-3">Clinics near you that offer each option, with prices to ask about and your booking code.</p>
          <div className="grid gap-2">
            {chosen.map((p) => (
              <a key={p.id} href={`/clinics?t=${p.id}&city=${city}`} className="btn-main block text-center text-sm">
                Find a clinic for {p.name.split(" / ")[0]} →
              </a>
            ))}
          </div>
        </section>
      )}
      <div className="mt-4"><NotShown hidden={fit.hidden} outside={fit.outside} /></div>
      <p className="text-[11px] text-muted text-center mt-3">
        Typical ranges, not quotes or guarantees.{" "}
        <a href="/sources" className="underline">How we research</a>
      </p>
    </div>
  );
}
