"use client";
import { notesFor } from "@/lib/advice";
import { safetyReasons } from "@/lib/match";
import { GOAL_LABELS } from "@/lib/procedures";
import { toAnswers, useProfile } from "@/lib/profile";
import type { Procedure } from "@/lib/types";

const MAX_DOWNTIME = { none: 1, short: 7, any: Infinity } as const;

/** How this treatment fits the person's saved answers (or a prompt to answer first). */
export function ForYou({ p }: { p: Procedure }) {
  const profile = useProfile();
  if (!profile) {
    return (
      <a href="/" className="block rounded-2xl border border-line bg-white p-4 text-sm mt-4">
        <span className="font-medium">Is this right for you?</span>{" "}
        <span className="text-muted">Answer 5 quick questions to check it against your skin, health notes and past treatments →</span>
      </a>
    );
  }
  const a = toAnswers(profile);
  const reasons = safetyReasons(p, a);
  const forGoals = p.goals.filter((g) => profile.goals.includes(g));
  const outside = p.downtimeDays[1] > MAX_DOWNTIME[a.downtime];
  const notes = notesFor(p, a);

  return (
    <section className={"rounded-2xl p-4 mt-4 text-sm " + (reasons.length ? "border border-ink bg-white" : "bg-blush")}>
      <p className="text-[11px] text-muted mb-1">For you, based on your answers · <a href="/?edit=1" className="underline">Edit</a></p>
      {reasons.length > 0 ? (
        <p><strong className="font-semibold">Usually not advised for you:</strong> {reasons.join(" · ")}. A dermatologist can tell you if there are exceptions.</p>
      ) : (
        <p>
          {outside ? "Safe with your answers, but more downtime than you wanted." : "Fits your answers."}{" "}
          {forGoals.length > 0
            ? `Used for your goal${forGoals.length > 1 ? "s" : ""}: ${forGoals.map((g) => GOAL_LABELS[g].toLowerCase()).join(", ")}.`
            : "It isn't used for any of your goals."}
        </p>
      )}
      {!reasons.length && notes.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {notes.map((n) => (
            <li key={n.text}>
              {n.text}
              {n.source && <a href={n.source.url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted underline">{n.source.label} ↗</a>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
