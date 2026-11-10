"use client";
import { useState } from "react";
import { CAUTIONS } from "@/lib/cautions";
import { GOAL_LABELS } from "@/lib/procedures";
import type { Budget, Caution, Downtime, Goal, QuizAnswers } from "@/lib/types";

const BUDGETS: { v: Budget; label: string; desc: string }[] = [
  { v: 1, label: "$", desc: "Under ~$500 per session" },
  { v: 2, label: "$$", desc: "Up to ~$1,500" },
  { v: 3, label: "$$$", desc: "Open to premium options" },
];
const DOWNTIMES: { v: Downtime; label: string; desc: string }[] = [
  { v: "none", label: "None", desc: "Back to normal the same day" },
  { v: "short", label: "Up to a week", desc: "Some redness or swelling is OK" },
  { v: "any", label: "Flexible", desc: "Recovery time isn't a concern" },
];

function chip(active: boolean) {
  return (
    "rounded-xl border px-3 py-2.5 text-sm text-left transition-colors " +
    (active ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white hover:border-neutral-400")
  );
}

export function QuizStep({
  initial,
  onBack,
  onNext,
}: {
  initial: QuizAnswers | null;
  onBack: () => void;
  onNext: (a: QuizAnswers) => void;
}) {
  const [goals, setGoals] = useState<Goal[]>(initial?.goals ?? []);
  const [budget, setBudget] = useState<Budget>(initial?.budget ?? 2);
  const [downtime, setDowntime] = useState<Downtime>(initial?.downtime ?? "short");
  const [cautions, setCautions] = useState<Caution[]>(initial?.cautions ?? []);

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <section aria-labelledby="quiz-h" className="space-y-7">
      <div>
        <h2 id="quiz-h" className="text-2xl font-semibold mb-1">What are you hoping to improve?</h2>
        <p className="text-sm text-neutral-600">Choose one or more goals.</p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium mb-2">Goals</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
            <button key={g} type="button" aria-pressed={goals.includes(g)} onClick={() => setGoals(toggle(goals, g))} className={chip(goals.includes(g))}>
              {GOAL_LABELS[g]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium mb-2">Budget per session</legend>
        <div className="grid grid-cols-3 gap-2" role="radiogroup">
          {BUDGETS.map((b) => (
            <button key={b.v} type="button" role="radio" aria-checked={budget === b.v} onClick={() => setBudget(b.v)} className={chip(budget === b.v)}>
              <span className="block font-semibold">{b.label}</span>
              <span className="block text-xs opacity-75">{b.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium mb-2">Downtime you can accept</legend>
        <div className="grid grid-cols-3 gap-2" role="radiogroup">
          {DOWNTIMES.map((d) => (
            <button key={d.v} type="button" role="radio" aria-checked={downtime === d.v} onClick={() => setDowntime(d.v)} className={chip(downtime === d.v)}>
              <span className="block font-semibold">{d.label}</span>
              <span className="block text-xs opacity-75">{d.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <legend className="text-sm font-medium px-1">Do any of these apply? <span className="font-normal text-neutral-500">(optional, private)</span></legend>
        <p className="text-xs text-neutral-600 mb-3">
          We use this only on your device to flag procedures that usually need extra caution. It is never saved or sent.
        </p>
        <div className="space-y-2">
          {(Object.keys(CAUTIONS) as Caution[]).map((c) => (
            <label key={c} className="flex items-start gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" checked={cautions.includes(c)} onChange={() => setCautions(toggle(cautions, c))} className="mt-0.5 h-4 w-4 shrink-0 accent-neutral-900" />
              <span>{CAUTIONS[c].label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="px-6 py-3 rounded-xl border border-neutral-300 bg-white font-medium hover:border-neutral-500">
          Back
        </button>
        <button
          type="button"
          disabled={goals.length === 0}
          onClick={() => onNext({ goals, budget, downtime, cautions })}
          className="flex-1 sm:flex-none sm:px-8 bg-neutral-900 text-white font-medium py-3 rounded-xl hover:bg-neutral-800 disabled:opacity-40"
        >
          See My Results
        </button>
      </div>
    </section>
  );
}
