"use client";
import { useEffect, useRef, useState } from "react";
import type { Location, QuizAnswers } from "@/lib/types";
import { CityStep } from "./CityStep";
import { QuizStep } from "./QuizStep";
import { Results } from "./Results";
import { Steps } from "./Steps";

/**
 * Answers live in React state only (data minimization): nothing is written to
 * storage or sent anywhere, and closing the tab discards them.
 */
export function Guide() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<Location | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  return (
    <div ref={top} className="scroll-mt-4">
      <Steps current={step} />
      {step === 1 && (
        <CityStep
          initial={location}
          onNext={(l) => {
            setLocation(l);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <QuizStep
          initial={answers}
          onBack={() => setStep(1)}
          onNext={(a) => {
            setAnswers(a);
            setStep(3);
          }}
        />
      )}
      {step === 3 && location && answers && (
        <Results
          location={location}
          answers={answers}
          onEdit={() => setStep(2)}
          onRestart={() => {
            setLocation(null);
            setAnswers(null);
            setStep(1);
          }}
        />
      )}
    </div>
  );
}
