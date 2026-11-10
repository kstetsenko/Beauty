"use client";
import { useMemo, useState } from "react";
import { CITY_LABELS } from "@/lib/clinics";
import { matchProcedures } from "@/lib/match";
import { GOAL_LABELS } from "@/lib/procedures";
import type { Budget, Caution, City, Downtime, Goal } from "@/lib/types";
import { ProcedureCard } from "./ProcedureCard";
import { Question } from "./Question";
import { Summary } from "./Summary";

type Step = "city" | "goal" | "budget" | "downtime" | "pregnant" | "health" | "browse" | "done";
const QUIZ: Step[] = ["city", "goal", "budget", "downtime", "pregnant", "health"];

/**
 * One tap per screen. Answers live in React state only (data minimization):
 * nothing is stored or sent, and closing the tab discards them.
 */
export function Guide() {
  const [history, setHistory] = useState<Step[]>(["city"]);
  const step = history[history.length - 1];
  const [city, setCity] = useState<City>();
  const [goal, setGoal] = useState<Goal>();
  const [budget, setBudget] = useState<Budget>();
  const [downtime, setDowntime] = useState<Downtime>();
  const [pregnant, setPregnant] = useState<"yes" | "no">();
  const [health, setHealth] = useState<"yes" | "no">();
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);

  const go = (s: Step) => setHistory((h) => [...h, s]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  const matches = useMemo(() => {
    if (!goal || !budget || !downtime) return [];
    const cautions: Caution[] = [];
    if (pregnant === "yes") cautions.push("pregnancy");
    if (health === "yes") cautions.push("active-skin", "isotretinoin", "blood-thinners");
    return matchProcedures({ goals: [goal], budget, downtime, cautions });
  }, [goal, budget, downtime, pregnant, health]);

  const startBrowsing = () => {
    setIndex(0);
    setSaved([]);
    go("browse");
  };
  const next = (save: boolean) => {
    const id = matches[index].procedure.id;
    if (save) setSaved((s) => (s.includes(id) ? s : [...s, id]));
    if (index + 1 >= matches.length) go("done");
    else setIndex(index + 1);
  };

  const quizPos = QUIZ.indexOf(step);
  const progress =
    quizPos >= 0 ? (quizPos + 1) / (QUIZ.length + 1) : step === "browse" && matches.length ? 0.86 + (0.14 * index) / matches.length : 1;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-3 mb-8 h-6">
        {history.length > 1 && step !== "done" ? (
          <button type="button" onClick={back} aria-label="Back" className="text-muted hover:text-ink text-xl leading-none -ml-1 px-1">
            ←
          </button>
        ) : (
          <span className="w-5" />
        )}
        <div className="flex-1 h-1 rounded-full bg-line overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <div className="h-full bg-rose transition-all duration-300" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {step === "city" && (
        <Question
          key="city"
          title="Where are you?"
          options={(Object.keys(CITY_LABELS) as City[]).map((c) => ({ value: c, label: CITY_LABELS[c] }))}
          selected={city}
          onPick={(v) => {
            setCity(v);
            go("goal");
          }}
        />
      )}

      {step === "goal" && (
        <Question
          key="goal"
          title="What would you like to improve?"
          columns={2}
          options={(Object.keys(GOAL_LABELS) as Goal[]).map((g) => ({ value: g, label: GOAL_LABELS[g] }))}
          selected={goal}
          onPick={(v) => {
            setGoal(v);
            go("budget");
          }}
        />
      )}

      {step === "budget" && (
        <Question<Budget>
          key="budget"
          title="Budget per visit?"
          options={[
            { value: 1, label: "Under $500" },
            { value: 2, label: "Up to $1,500" },
            { value: 3, label: "Open to anything" },
          ]}
          selected={budget}
          onPick={(v) => {
            setBudget(v);
            go("downtime");
          }}
        />
      )}

      {step === "downtime" && (
        <Question<Downtime>
          key="downtime"
          title="Okay with a few days of redness or swelling?"
          options={[
            { value: "any", label: "Yes" },
            { value: "none", label: "No, I need to look normal the same day" },
          ]}
          selected={downtime}
          onPick={(v) => {
            setDowntime(v);
            go("pregnant");
          }}
        />
      )}

      {step === "pregnant" && (
        <Question
          key="pregnant"
          title="Are you pregnant or nursing?"
          sub="Private — stays on your device."
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
          selected={pregnant}
          onPick={(v) => {
            setPregnant(v as "yes" | "no");
            go("health");
          }}
        />
      )}

      {step === "health" && (
        <Question
          key="health"
          title="Any skin irritation right now, Accutane this year, or blood thinners?"
          sub="Private — stays on your device."
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
          selected={health}
          onPick={(v) => {
            setHealth(v as "yes" | "no");
            startBrowsing();
          }}
        />
      )}

      {step === "browse" && city &&
        (matches.length === 0 ? (
          <section className="animate-in text-center">
            <h1 className="text-2xl font-semibold mb-2">No matches</h1>
            <p className="text-sm text-muted mb-6">Try a bigger budget or allow a little recovery time.</p>
            <button type="button" onClick={() => setHistory(["city", "goal", "budget"])} className="btn-main">Change answers</button>
          </section>
        ) : (
          <>
            <p className="text-xs text-muted mb-3 text-center">
              {index + 1} of {matches.length} · swipe or tap
            </p>
            <ProcedureCard key={matches[index].procedure.id} match={matches[index]} city={city} onSave={() => next(true)} onSkip={() => next(false)} />
          </>
        ))}

      {step === "done" && city && (
        <Summary
          city={city}
          saved={matches.filter((m) => saved.includes(m.procedure.id))}
          onBrowseAgain={() => {
            setIndex(0);
            setHistory((h) => h.slice(0, -1));
          }}
          onRestart={() => {
            setHistory(["city"]);
            setGoal(undefined);
            setBudget(undefined);
            setDowntime(undefined);
            setPregnant(undefined);
            setHealth(undefined);
            setSaved([]);
          }}
        />
      )}
    </div>
  );
}
