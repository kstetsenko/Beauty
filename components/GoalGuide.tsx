"use client";
import { CITY_LABELS } from "@/lib/clinics";
import { APPROACH_ORDER, GOAL_GUIDE, SUNSCREEN } from "@/lib/learn";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, GOAL_LABELS, PROCEDURES } from "@/lib/procedures";
import { EVIDENCE_LABELS, RESEARCH } from "@/lib/research";
import { TRENDS } from "@/lib/trends";
import { personalize } from "@/lib/profile";
import type { City, Goal } from "@/lib/types";
import { NotShown, ProfileBar, ProfileGate } from "./ProfileGate";
import { Disclosure } from "./Disclosure";
import { Dots } from "./ProcedureFacts";

/** All options for one goal, ordered least → most involved, each linking to its page. */
export function GoalGuide({ goal }: { goal: Goal; city?: City }) {
  return (
    <ProfileGate what={`see your options for ${GOAL_LABELS[goal].toLowerCase()}`}>
      {(profile) => <GoalGuideFor goal={goal} profile={profile} />}
    </ProfileGate>
  );
}

function GoalGuideFor({ goal, profile }: { goal: Goal; profile: import("@/lib/profile").Profile }) {
  const city = profile.city;
  const g = GOAL_GUIDE[goal];
  const { shown, hidden, outside } = personalize(profile, [goal]);
  const options = shown.map((m) => m.procedure);
  const groups = APPROACH_ORDER.map((a) => ({ a, list: options.filter((p) => p.approach === a) })).filter((x) => x.list.length);
  const trends = TRENDS.filter((t) => t.goals.includes(goal));

  return (
    <article className="animate-in space-y-5">
      <a href="/goals" className="text-muted hover:text-ink text-sm">← All goals</a>
      <ProfileBar profile={profile} />
      <div>
        <h1 className="text-2xl font-semibold mb-2">{GOAL_LABELS[goal]}: your options</h1>
        <p className="text-sm leading-relaxed">{g.intro}</p>
      </div>

      <p className="text-xs text-muted px-1">{options.length} option{options.length === 1 ? "" : "s"} that fit your answers ({CITY_LABELS[city]} prices), from least to most involved. Tap a group to see them.</p>

      <div className="space-y-2.5">
        {g.foundation && (
          <Disclosure tone="soft" title="Start here: daily basics" hint="What dermatologists recommend first">
            <p className="text-sm leading-relaxed">
              Broad-spectrum SPF 30+ every day, and a retinoid at night — before and alongside any procedure.
            </p>
            <div className="flex flex-col gap-1 mt-2 text-sm">
              <a href={`/procedures/tretinoin?city=${city}`} className="underline">Prescription retinoid (tretinoin) →</a>
              <a href={SUNSCREEN.url} target="_blank" rel="noopener noreferrer" className="underline">{SUNSCREEN.label} ↗</a>
            </div>
          </Disclosure>
        )}

        {groups.map(({ a, list }) => (
          <Disclosure key={a} title={APPROACHES[a].label} hint={`${list.length} option${list.length > 1 ? "s" : ""} · ${APPROACHES[a].hint}`}>
            <ul className="divide-y divide-line -mx-5 border-t border-line">
              {list.map((p) => (
                <li key={p.id}>
                  <a href={`/procedures/${p.id}?city=${city}`} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-sand">
                    <span className="min-w-0">
                      <span className="block font-medium">{p.name}</span>
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-muted">
                        <span className="flex items-center gap-1.5">Research <Dots value={RESEARCH[p.id].evidence} max={3} label="Evidence" /> {EVIDENCE_LABELS[RESEARCH[p.id].evidence]}</span>
                        <span>Recovery: {downtimeShort(p.downtimeDays).toLowerCase()}</span>
                      </span>
                    </span>
                    <span className="text-sm shrink-0 text-right">
                      from {usd(p.cost[city][0])}
                      <span className="block text-muted" aria-hidden="true">›</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Disclosure>
        ))}

        {trends.map((t) => (
          <Disclosure key={t.id} title={`Trending: ${t.name}`} hint={`${t.status} — tap before you try it`}>
            <p className="text-sm leading-relaxed mb-2">{t.why}</p>
            <ul className="space-y-1">
              {t.links.map((l) => (
                <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm underline">{l.label} ↗</a></li>
              ))}
            </ul>
          </Disclosure>
        ))}

        <NotShown hidden={hidden} outside={outside} />

        <Disclosure title="Learn more" hint="Dermatologist-written guides">
          <ul className="space-y-1.5">
            {g.learn.map((l) => (
              <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm underline">{l.label} ↗</a></li>
            ))}
          </ul>
        </Disclosure>
      </div>

      <a href="/" className="btn-main block text-center">See my ranked matches</a>
      <p className="text-[11px] text-muted text-center">
        Educational information only — not medical advice. Prices are typical ranges, not quotes. <a href="/sources" className="underline">How we research</a>
      </p>
    </article>
  );
}

export function GoalIndex() {
  return (
    <ProfileGate what="explore treatments by goal">
      {(profile) => {
        const all = Object.keys(GOAL_LABELS) as Goal[];
        const mine = all.filter((g) => profile.goals.includes(g));
        const others = all.filter((g) => !profile.goals.includes(g));
        const Tile = ({ g }: { g: Goal }) => (
          <a href={`/goals/${g}`} className="tile">
            <span className="font-medium">{GOAL_LABELS[g]}</span>
            <span className="block text-xs text-muted mt-0.5">{(() => { const n = personalize(profile, [g]).shown.length; return `${n} option${n === 1 ? "" : "s"} for you`; })()}</span>
          </a>
        );
        return (
          <section className="animate-in">
            <h1 className="text-2xl font-semibold mb-1.5">Explore by goal</h1>
            <p className="text-sm text-muted mb-4">Every option for a concern that fits your answers, with the research behind each.</p>
            <ProfileBar profile={profile} />
            <p className="text-sm font-medium mb-2">Your goals</p>
            <div className="grid grid-cols-2 gap-2.5 mb-6">{mine.map((g) => <Tile key={g} g={g} />)}</div>
            <p className="text-sm font-medium mb-2">Other goals</p>
            <div className="grid grid-cols-2 gap-2.5">{others.map((g) => <Tile key={g} g={g} />)}</div>
          </section>
        );
      }}
    </ProfileGate>
  );
}
