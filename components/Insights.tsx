import { INTENSITY, FACTS, TIMELINE, intensity } from "@/lib/insights";
import { PROCEDURES } from "@/lib/procedures";
import { TRENDS } from "@/lib/trends";

const nameOf = (id: string) => PROCEDURES.find((p) => p.id === id)?.name ?? id;

export function Insights() {
  return (
    <article className="animate-in space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1.5">Core insights</h1>
        <p className="text-sm text-muted">What&apos;s proven, what&apos;s new, and how intensive each option is. Every fact links to its source.</p>
      </div>

      <section>
        <h2 className="font-semibold mb-3">Fast facts</h2>
        <ul className="space-y-2.5">
          {FACTS.map((f) => (
            <li key={f.fact} className="rounded-2xl bg-white border border-line p-4">
              <p className="text-sm leading-relaxed">{f.fact}</p>
              <a href={f.source.url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted underline mt-1">{f.source.label} ↗</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-1">How long has it been around?</h2>
        <p className="text-xs text-muted mb-4">First U.S. approval or clearance. Longer track records mean more safety data — newer isn&apos;t automatically better.</p>
        <ol className="relative border-l border-line ml-2 space-y-5">
          {TIMELINE.map((m) => (
            <li key={m.year + m.title} className="pl-5 relative">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-rose" aria-hidden="true" />
              <p className="text-xs font-semibold text-muted">{m.year}</p>
              <p className="font-medium leading-snug">{m.title}</p>
              <p className="text-sm text-muted leading-snug mt-0.5">{m.detail}</p>
              <p className="text-sm mt-1 flex flex-wrap gap-x-3">
                {m.ids.map((id) => (
                  <a key={id} href={`/procedures/${id}`} className="underline">{nameOf(id)}</a>
                ))}
              </p>
              <a href={m.source.url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted underline mt-0.5">{m.source.label} ↗</a>
            </li>
          ))}
          <li className="pl-5 relative">
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-ink bg-sand" aria-hidden="true" />
            <p className="text-xs font-semibold text-muted">Now</p>
            <p className="font-medium leading-snug">Trending, but not FDA-approved</p>
            {TRENDS.map((t) => (
              <p key={t.id} className="text-sm text-muted leading-snug mt-0.5">
                {t.name}: {t.why}{" "}
                <a href={t.links[0].url} target="_blank" rel="noopener noreferrer" className="underline">FDA ↗</a>
              </p>
            ))}
          </li>
        </ol>
        <p className="text-[11px] text-muted mt-4">
          We list only dates we could confirm. Some popular treatments (for example HydraFacial, Halo, Moxi, thread lifts) are
          left off until verified.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-1">How intensive is it?</h2>
        <p className="text-xs text-muted mb-3">Based on typical recovery time and pain in our data — your provider and settings change this.</p>
        {([1, 2, 3] as const).map((level) => (
          <div key={level} className="mb-4">
            <p className="text-sm font-medium mb-2">{INTENSITY[level]}</p>
            <div className="flex flex-wrap gap-2">
              {PROCEDURES.filter((p) => intensity(p) === level).map((p) => (
                <a key={p.id} href={`/procedures/${p.id}`} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm hover:border-ink">{p.name}</a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="text-[11px] text-muted text-center">
        Educational information only — not medical advice. <a href="/sources" className="underline">How we research</a>
      </p>
    </article>
  );
}
