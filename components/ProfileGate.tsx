"use client";
import { CITY_LABELS } from "@/lib/clinics";
import { useProfile, type Profile } from "@/lib/profile";
import type { Hidden } from "@/lib/match";
import type { Procedure } from "@/lib/types";
import { Disclosure } from "./Disclosure";
import { HiddenReasons } from "./HiddenReasons";

const TONE = { light: "Light skin", medium: "Medium skin", deep: "Deep skin" } as const;

/** One-line summary of the person's parameters, with a link to change them. */
export function ProfileBar({ profile }: { profile: Profile }) {
  const cautions = profile.flags.filter((f) => f !== "no-downtime").length;
  const bits = [
    CITY_LABELS[profile.city],
    profile.age,
    TONE[profile.tone],
    cautions ? `${cautions} health note${cautions > 1 ? "s" : ""}` : null,
    profile.flags.includes("no-downtime") ? "No downtime" : null,
    profile.had?.length ? `${profile.had.length} recent treatment${profile.had.length > 1 ? "s" : ""}` : null,
  ].filter(Boolean);
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-blush px-4 py-2.5 text-xs mb-5">
      <span className="min-w-0"><span className="text-muted">Based on your answers: </span>{bits.join(" · ")}</span>
      <a href="/?edit=1" className="underline shrink-0">Edit</a>
    </div>
  );
}

/** Pages that list or compare treatments need the person's parameters first. */
export function ProfileGate({ children, what }: { children: (p: Profile) => React.ReactNode; what: string }) {
  const profile = useProfile();
  if (!profile) {
    return (
      <section className="animate-in text-center py-6">
        <h1 className="text-2xl font-semibold mb-2">First, 5 quick questions</h1>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          To {what}, we need your goals, age, skin tone, health notes and recent treatments — so we only show treatments that
          are safe and realistic for you. It takes about a minute, and your answers stay in this browser tab.
        </p>
        <a href="/" className="btn-main block">Start the quiz</a>
        <a href="/insights" className="block text-sm text-muted underline mt-4">Or read the core insights</a>
      </section>
    );
  }
  return <>{children(profile)}</>;
}

/** Shared "why some treatments aren't listed" footer. */
export function NotShown({ hidden, outside }: { hidden: Hidden[]; outside: Procedure[] }) {
  if (!hidden.length && !outside.length) return null;
  return (
    <div className="space-y-2.5">
      {hidden.length > 0 && (
        <Disclosure title={`Hidden for your safety (${hidden.length})`} hint="Usually not advised with your answers">
          <ul className="space-y-2">
            {hidden.map(({ procedure: p, reasons, sources }) => (
              <li key={p.id} className="text-sm">
                <span className="font-medium">{p.name}</span>
                <HiddenReasons reasons={reasons} sources={sources} />
              </li>
            ))}
          </ul>
        </Disclosure>
      )}
      {outside.length > 0 && (
        <Disclosure title={`Outside your downtime (${outside.length})`} hint="Change your answers to include these">
          <ul className="space-y-1 text-sm">
            {outside.map((p) => <li key={p.id}>{p.name}</li>)}
          </ul>
          <a href="/?edit=1" className="block text-sm underline mt-2">Edit my answers</a>
        </Disclosure>
      )}
    </div>
  );
}
