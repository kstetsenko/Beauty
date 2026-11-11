"use client";
import { useMemo, useState } from "react";
import { CITY_LABELS } from "@/lib/clinics";
import { matchProcedures } from "@/lib/match";
import { GOAL_LABELS, PROCEDURES } from "@/lib/procedures";
import type { AgeBand, Budget, Caution, City, Condition, Goal, Recent, SkinTone } from "@/lib/types";
import { Chips } from "./Chips";
import { ProcedureCard } from "./ProcedureCard";
import { Question } from "./Question";
import { Summary } from "./Summary";

type Step = "city" | "goals" | "about" | "safety" | "recent" | "budget" | "browse" | "done";
const QUIZ: Step[] = ["city", "goals", "about", "safety", "recent", "budget"];

type Flag = Caution | Condition | "no-downtime";
const SAFETY: { value: Flag; label: string }[] = [
  { value: "pregnancy", label: "Pregnant or nursing" },
  { value: "no-downtime", label: "Need zero downtime" },
  { value: "melasma", label: "Melasma" },
  { value: "rosacea", label: "Rosacea or easy flushing" },
  { value: "cold-sores", label: "Get cold sores" },
  { value: "keloid", label: "Keloid scars" },
  { value: "blood-thinners", label: "Blood thinners" },
  { value: "isotretinoin", label: "On Accutane now" },
  { value: "active-skin", label: "Rash or infection now" },
  { value: "autoimmune", label: "Autoimmune / neuromuscular condition" },
];
const RECENT: { value: Recent; label: string }[] = [
  { value: "botox", label: "Botox / Dysport" },
  { value: "filler", label: "Filler" },
  { value: "energy", label: "Ultherapy, Sofwave, Thermage or Morpheus8" },
  { value: "laser", label: "Laser or IPL" },
  { value: "peel", label: "Peel or microneedling" },
];
const AGES: AgeBand[] = ["18-21", "22-34", "35-49", "50-64", "65+"];
const TONES: { value: SkinTone; label: string }[] = [
  { value: "light", label: "Light — burns easily" },
  { value: "medium", label: "Medium — tans" },
  { value: "deep", label: "Deep brown or Black" },
];
const CONDITIONS: Condition[] = ["melasma", "rosacea", "cold-sores"];

const pill = (on: boolean) =>
  "rounded-full border px-4 py-2.5 text-sm transition-colors " + (on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink");

/**
 * Six quick screens (about 45–70 seconds). Answers live in React state only:
 * nothing is stored or sent, and closing the tab discards them.
 */
export function Guide() {
  const [history, setHistory] = useState<Step[]>(["city"]);
  const step = history[history.length - 1];
  const [city, setCity] = useState<City>();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [age, setAge] = useState<AgeBand>();
  const [tone, setTone] = useState<SkinTone>();
  const [flags, setFlags] = useState<Flag[]>([]);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [budget, setBudget] = useState<Budget>();
  const [onsetFilter, setOnsetFilter] = useState<"all" | "now" | "gradual">("all");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);

  const go = (s: Step) => setHistory((h) => [...h, s]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  const all = useMemo(() => {
    if (!goals.length || !budget) return [];
    return matchProcedures({
      goals,
      budget,
      downtime: flags.includes("no-downtime") ? "none" : "any",
      cautions: flags.filter((f): f is Caution => !CONDITIONS.includes(f as Condition) && f !== "no-downtime"),
      conditions: flags.filter((f): f is Condition => CONDITIONS.includes(f as Condition)),
      age,
      tone,
      recent,
    });
  }, [goals, budget, flags, age, tone, recent]);
  const matches = all.filter(
    (m) => onsetFilter === "all" || (onsetFilter === "now" ? m.procedure.onset === 1 : m.procedure.onset === 3),
  );

  const startBrowsing = () => {
    setIndex(0);
    setSaved([]);
    setOnsetFilter("all");
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
        <>
          <Question
            key="city"
            title="Where are you?"
            sub="About 1 minute · 6 quick questions"
            options={(Object.keys(CITY_LABELS) as City[]).map((c) => ({ value: c, label: CITY_LABELS[c] }))}
            selected={city}
            onPick={(v) => {
              setCity(v);
              go("goals");
            }}
          />
          <p className="mt-8 text-center text-sm text-muted">
            Or <a href="/goals" className="underline">explore by goal</a> · <a href="/procedures" className="underline">browse all {PROCEDURES.length} treatments</a> ·{" "}
            <a href="/insights" className="underline">core insights</a>
          </p>
        </>
      )}

      {step === "goals" && (
        <section className="animate-in">
          <h1 className="text-2xl font-semibold leading-tight mb-1.5">What would you like to improve?</h1>
          <p className="text-sm text-muted mb-6">Pick up to 3.</p>
          <div className="grid grid-cols-2 gap-2.5">
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => {
              const on = goals.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={on}
                  disabled={!on && goals.length >= 3}
                  onClick={() => setGoals(on ? goals.filter((x) => x !== g) : [...goals, g])}
                  className={"tile disabled:opacity-40 " + (on ? "!border-ink bg-blush" : "")}
                >
                  <span className="font-medium">{on ? "✓ " : ""}{GOAL_LABELS[g]}</span>
                </button>
              );
            })}
          </div>
          <button type="button" disabled={!goals.length} onClick={() => go("about")} className="btn-main mt-6">
            Continue
          </button>
        </section>
      )}

      {step === "about" && (
        <section className="animate-in">
          <h1 className="text-2xl font-semibold leading-tight mb-1.5">A little about you</h1>
          <p className="text-sm text-muted mb-6">Private — stays on your device. Both affect which treatments are safe.</p>
          <p className="text-sm font-medium mb-2">Age</p>
          <div className="flex flex-wrap gap-2 mb-6" role="radiogroup" aria-label="Age">
            {AGES.map((v) => (
              <button key={v} type="button" role="radio" aria-checked={age === v} onClick={() => setAge(v)} className={pill(age === v)}>
                {v}
              </button>
            ))}
          </div>
          <p className="text-sm font-medium mb-2">Skin tone</p>
          <div className="grid gap-2" role="radiogroup" aria-label="Skin tone">
            {TONES.map((t) => (
              <button key={t.value} type="button" role="radio" aria-checked={tone === t.value} onClick={() => setTone(t.value)} className={"tile py-3 " + (tone === t.value ? "!border-ink bg-blush" : "")}>
                <span className="font-medium text-sm">{t.label}</span>
              </button>
            ))}
          </div>
          <button type="button" disabled={!age || !tone} onClick={() => go("safety")} className="btn-main mt-6">
            Continue
          </button>
        </section>
      )}

      {step === "safety" && (
        <section className="animate-in">
          <h1 className="text-2xl font-semibold leading-tight mb-1.5">Does anything apply?</h1>
          <p className="text-sm text-muted mb-6">Tap all that apply. Private — stays on your device.</p>
          <Chips options={SAFETY} selected={flags} onChange={setFlags} />
          <button type="button" onClick={() => go("recent")} className="btn-main mt-6">
            {flags.length ? "Continue" : "None of these"}
          </button>
        </section>
      )}

      {step === "recent" && (
        <section className="animate-in">
          <h1 className="text-2xl font-semibold leading-tight mb-1.5">Any treatments in the last 6 months?</h1>
          <p className="text-sm text-muted mb-6">Helps us flag timing to discuss with your provider.</p>
          <Chips options={RECENT} selected={recent} onChange={setRecent} />
          <button type="button" onClick={() => go("budget")} className="btn-main mt-6">
            {recent.length ? "Continue" : "None — first time"}
          </button>
        </section>
      )}

      {step === "budget" && (
        <Question<Budget>
          key="budget"
          title="Budget per visit?"
          options={[
            { value: 1, label: "$", hint: "Under about $500" },
            { value: 2, label: "$$", hint: "Up to about $1,500" },
            { value: 3, label: "$$$", hint: "Open to premium options" },
          ]}
          selected={budget}
          onPick={(v) => {
            setBudget(v);
            startBrowsing();
          }}
        />
      )}

      {step === "browse" && city && (
        <>
          <div className="flex gap-2 justify-center mb-3" role="radiogroup" aria-label="When results show">
            {([["all", "All"], ["now", "Results right away"], ["gradual", "Gradual"]] as const).map(([v, l]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={onsetFilter === v}
                onClick={() => {
                  setOnsetFilter(v);
                  setIndex(0);
                }}
                className={"rounded-full px-3 py-1 text-xs border " + (onsetFilter === v ? "bg-ink text-white border-ink" : "bg-white border-line")}
              >
                {l}
              </button>
            ))}
          </div>
          {matches.length === 0 ? (
            <section className="animate-in text-center">
              <h1 className="text-2xl font-semibold mb-2">No matches</h1>
              <p className="text-sm text-muted mb-6">Try another filter, a bigger budget, or allowing a little downtime.</p>
              <button type="button" onClick={() => setHistory(["city", "goals", "about", "safety", "recent", "budget"])} className="btn-main">
                Change answers
              </button>
            </section>
          ) : (
            <>
              <p className="text-xs text-muted mb-3 text-center">
                {index + 1} of {matches.length} · swipe or tap
              </p>
              <ProcedureCard
                key={matches[index].procedure.id}
                match={matches[index]}
                city={city}
                budget={budget}
                onSave={() => next(true)}
                onSkip={() => next(false)}
              />
            </>
          )}
        </>
      )}

      {step === "done" && city && (
        <Summary
          city={city}
          budget={budget}
          goals={goals}
          saved={all.filter((m) => saved.includes(m.procedure.id))}
          onBrowseAgain={() => {
            setIndex(0);
            setHistory((h) => h.slice(0, -1));
          }}
          onRestart={() => {
            setHistory(["city"]);
            setGoals([]);
            setAge(undefined);
            setTone(undefined);
            setFlags([]);
            setRecent([]);
            setBudget(undefined);
            setSaved([]);
          }}
        />
      )}
    </div>
  );
}
