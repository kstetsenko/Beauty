"use client";
import { useEffect, useMemo, useState } from "react";
import { CITY_LABELS } from "@/lib/clinics";
import { clearProfile, personalize, readProfileOnce, saveProfile, type Flag } from "@/lib/profile";
import { GOAL_LABELS, PROCEDURES } from "@/lib/procedures";
import type { AgeBand, City, Goal, SkinTone } from "@/lib/types";
import { Chips } from "./Chips";
import { ResultsList } from "./ResultsList";
import { Question } from "./Question";
import { Summary } from "./Summary";
import { PastTreatments } from "./PastTreatments";

type Step = "city" | "goals" | "about" | "safety" | "recent" | "browse" | "done";
const QUIZ: Step[] = ["city", "goals", "about", "safety", "recent"];

const SAFETY: { value: Flag; label: string }[] = [
  { value: "pregnancy", label: "Pregnant or nursing" },
  { value: "no-downtime", label: "Need zero downtime" },
  { value: "melasma", label: "Melasma" },
  { value: "rosacea", label: "Rosacea or easy flushing" },
  { value: "cold-sores", label: "Get cold sores" },
  { value: "keloid", label: "Keloid scars" },
  { value: "blood-thinners", label: "Blood thinners or bleeding disorder" },
  { value: "isotretinoin", label: "On Accutane now" },
  { value: "active-skin", label: "Rash or infection now" },
  { value: "autoimmune", label: "Autoimmune / neuromuscular condition" },
  { value: "severe-allergy", label: "Severe allergies or lidocaine allergy" },
  { value: "bovine-collagen", label: "Allergy to cow (bovine) collagen" },
  { value: "implant-device", label: "Pacemaker or implanted device" },
  { value: "light-sensitivity", label: "Porphyria or light sensitivity" },
];
const AGES: AgeBand[] = ["18-21", "22-34", "35-49", "50-64", "65+"];
const TONES: { value: SkinTone; label: string }[] = [
  { value: "light", label: "Light — burns easily" },
  { value: "medium", label: "Medium — tans" },
  { value: "deep", label: "Deep brown or Black" },
];

const pill = (on: boolean) =>
  "rounded-full border px-4 py-2.5 text-sm transition-colors " + (on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink");

/**
 * Five quick screens (about 45–70 seconds). When finished, answers are saved as
 * the person's profile in this browser tab only (cleared when the tab closes,
 * never sent) so every other page can use the same parameters.
 */
export function Guide() {
  const [history, setHistory] = useState<Step[]>(["city"]);
  const step = history[history.length - 1];
  const [city, setCity] = useState<City>();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [age, setAge] = useState<AgeBand>();
  const [tone, setTone] = useState<SkinTone>();
  const [flags, setFlags] = useState<Flag[]>([]);
  const [had, setHad] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const p = readProfileOnce();
    if (!p) return;
    setCity(p.city);
    setGoals(p.goals);
    setAge(p.age);
    setTone(p.tone);
    setFlags(p.flags);
    setHad(p.had ?? []);
  }, []);

  const go = (s: Step) => setHistory((h) => [...h, s]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  const result = useMemo(() => {
    if (!city || !goals.length || !age || !tone) return { shown: [], hidden: [], outside: [] };
    return personalize({ city, goals, age, tone, flags, had }, goals);
  }, [city, goals, flags, age, tone, had]);
  const all = result.shown;
  const matches = all;

  const startBrowsing = () => {
    setSaved([]);
    go("browse");
  };
  const toggleSave = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const finish = () => {
    // Nothing saved: take the top three matches to the clinic step.
    if (!saved.length) setSaved(matches.slice(0, 3).map((m) => m.procedure.id));
    go("done");
  };


  const quizPos = QUIZ.indexOf(step);
  const progress =
    quizPos >= 0 ? (quizPos + 1) / (QUIZ.length + 1) : 1;

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
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-muted mb-2">Aesthetic Guide · NYC &amp; Miami</p>
            <p className="text-xl font-semibold leading-snug mb-3">Every in-clinic face treatment, ranked for your skin — with the evidence.</p>
            <ul className="space-y-1.5 text-sm">
              <li>✓ {PROCEDURES.length} treatments, from facials to lasers and injectables, filtered for your skin tone, health and recent treatments</li>
              <li>✓ Research strength, local prices, recovery and risks for each, with sources</li>
              <li>✓ No paid rankings: clinics can&apos;t buy a higher spot</li>
            </ul>
          </div>
          <Question
            key="city"
            title="Where are you?"
            sub="About 1 minute · 5 quick questions"
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
          <p className="text-sm text-muted mb-6">Tap all that apply. Private — stays on your device. We only ask about things that FDA labels or medical guidelines say change which treatments are safe; your provider will ask about your full health history.</p>
          <Chips options={SAFETY} selected={flags} onChange={setFlags} />
          <button type="button" onClick={() => go("recent")} className="btn-main mt-6">
            {flags.length ? "Continue" : "None of these"}
          </button>
        </section>
      )}

      {step === "recent" && (
        <section className="animate-in">
          <h1 className="text-2xl font-semibold leading-tight mb-1.5">Any treatments in the last 6 months?</h1>
          <p className="text-sm text-muted mb-6">Tap all you&apos;ve had. We&apos;ll flag timing to discuss with your provider. Private — stays on your device.</p>
          <PastTreatments selected={had} onChange={setHad} />
          <button
            type="button"
            onClick={() => {
              if (city && age && tone) saveProfile({ city, goals, age, tone, flags, had });
              startBrowsing();
            }}
            className="btn-main mt-6"
          >
            {had.length ? "See my options" : "None — see my options"}
          </button>
        </section>
      )}

      {step === "browse" && city && (
        matches.length === 0 ? (
          <section className="animate-in text-center">
            <h1 className="text-2xl font-semibold mb-2">No matches</h1>
            <p className="text-sm text-muted mb-6">
              Try allowing a little downtime.
              {result.hidden.length > 0 && ` ${result.hidden.length} treatment${result.hidden.length > 1 ? "s were" : " was"} hidden because of your safety answers.`}
            </p>
            <button type="button" onClick={() => setHistory(["city", "goals", "about", "safety", "recent"])} className="btn-main">
              Change answers
            </button>
          </section>
        ) : (
          <ResultsList matches={matches} goals={goals} city={city} saved={saved} onToggle={toggleSave} onDone={finish} hiddenCount={result.hidden.length} />
        )
      )}

      {step === "done" && city && (
        <Summary
          city={city}
          goals={goals}
          hidden={result.hidden}
          saved={all.filter((m) => saved.includes(m.procedure.id))}
          onBrowseAgain={() => setHistory((h) => h.slice(0, -1))}
          onRestart={() => {
            clearProfile();
            setHistory(["city"]);
            setGoals([]);
            setAge(undefined);
            setTone(undefined);
            setFlags([]);
            setHad([]);
            setSaved([]);
          }}
        />
      )}
    </div>
  );
}
