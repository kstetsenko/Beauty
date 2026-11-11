"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { CITY_LABELS } from "@/lib/clinics";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, GOAL_LABELS, ONSET_LABELS, PAIN_LABELS, PROCEDURES, RESULT_LABELS } from "@/lib/procedures";
import { EVIDENCE_LABELS, RESEARCH, priceChecked } from "@/lib/research";
import type { City, Goal, Procedure } from "@/lib/types";
import { Dots } from "./ProcedureFacts";

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
  const params = useSearchParams();
  const router = useRouter();
  const city: City = params.get("city") === "miami" ? "miami" : "nyc";
  const rawIds = (params.get("ids") || "").split(",").filter((id) => PROCEDURES.some((p) => p.id === id));
  const first = PROCEDURES.find((p) => p.id === rawIds[0]);
  // Goal: from the link, or the only goal of the first treatment.
  const goalParam = params.get("goal");
  const goal: Goal | null = isGoal(goalParam) ? goalParam : first && first.goals.length === 1 ? first.goals[0] : null;
  const ids = goal ? rawIds.filter((id) => PROCEDURES.find((p) => p.id === id)!.goals.includes(goal)).slice(0, 3) : [];
  const dropped = goal ? rawIds.length - ids.length : 0;
  const chosen = ids.map((id) => PROCEDURES.find((p) => p.id === id)!);
  const options = goal ? PROCEDURES.filter((p) => p.goals.includes(goal) && !ids.includes(p.id)) : [];

  const go = (next: { goal?: Goal | null; ids?: string[]; city?: City }) => {
    const g = next.goal === undefined ? goal : next.goal;
    const q = new URLSearchParams();
    if (g) q.set("goal", g);
    const list = next.ids ?? ids;
    if (list.length) q.set("ids", list.join(","));
    q.set("city", next.city ?? city);
    router.replace(`/compare?${q.toString()}`, { scroll: false });
  };

  // Step 1: choose what you're comparing for.
  if (!goal) {
    const choices = first ? first.goals : (Object.keys(GOAL_LABELS) as Goal[]);
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-semibold mb-1.5">Compare treatments</h1>
        <p className="text-sm text-muted mb-5">
          {first ? `${first.name} is used for more than one goal. Compare it for:` : "What are you comparing treatments for? You'll only see options for that goal."}
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {choices.map((g) => (
            <button key={g} type="button" onClick={() => go({ goal: g, ids: first ? [first.id] : [] })} className="tile">
              <span className="font-medium">{GOAL_LABELS[g]}</span>
              <span className="block text-xs text-muted mt-0.5">{PROCEDURES.filter((p) => p.goals.includes(g)).length} options</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <h1 className="text-2xl font-semibold mb-1.5">Compare: {GOAL_LABELS[goal]}</h1>
      <p className="text-sm text-muted mb-4">
        Up to 3 treatments for the same goal. Prices for {CITY_LABELS[city]}.{" "}
        <button type="button" onClick={() => go({ goal: null, ids: [] })} className="underline">Change goal</button>
      </p>
      {dropped > 0 && (
        <p className="text-xs rounded-2xl bg-blush p-3 mb-4">
          {dropped} treatment{dropped > 1 ? "s were" : " was"} left out because {dropped > 1 ? "they aren't" : "it isn't"} used for {GOAL_LABELS[goal].toLowerCase()}.
        </p>
      )}

      <div className="flex gap-2 mb-3">
        {(Object.keys(CITY_LABELS) as City[]).map((c) => (
          <button key={c} type="button" onClick={() => go({ city: c })} aria-pressed={city === c} className={pill(city === c)}>
            {CITY_LABELS[c]}
          </button>
        ))}
      </div>

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
      <p className="text-[11px] text-muted text-center mt-3">
        Typical ranges, not quotes or guarantees. Check each treatment&apos;s safety section for whether it suits you.{" "}
        <a href="/sources" className="underline">How we research</a>
      </p>
    </div>
  );
}
