import { CLINICS, directoryLinks } from "@/lib/clinics";
import type { City } from "@/lib/types";

export function ClinicList({ city, area, procedureIds }: { city: City; area: string; procedureIds: string[] }) {
  const clinics = CLINICS.filter((c) => c.city === city)
    .map((c) => ({ c, hits: c.offers.filter((o) => procedureIds.includes(o)).length }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits || (b.c.rating ?? 0) - (a.c.rating ?? 0));

  return (
    <section aria-labelledby="clinics-h" className="space-y-4">
      <div>
        <h2 id="clinics-h" className="text-xl font-semibold">Find a Qualified Provider</h2>
        <p className="text-xs text-neutral-500">
          Listings are informational, not endorsements or referrals. Always verify credentials and licensing yourself.
        </p>
      </div>

      {clinics.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {clinics.map(({ c }) => (
            <li key={c.id} className="bg-white rounded-2xl border border-neutral-200 p-4">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-xs text-neutral-500 mb-2">{c.neighborhood} · {c.credential}</p>
              {c.rating !== null && c.ratingCheckedAt && (
                <p className="text-sm mb-2">
                  <span aria-hidden="true">★</span> {c.rating.toFixed(1)} on Google
                  {c.reviewCount !== null && <span className="text-neutral-500"> ({c.reviewCount.toLocaleString("en-US")} reviews)</span>}
                  <span className="block text-xs text-neutral-400">as of {c.ratingCheckedAt}</span>
                </p>
              )}
              <div className="flex gap-3 text-sm">
                <a href={c.website} target="_blank" rel="noopener noreferrer nofollow" className="underline">Website ↗</a>
                <a href={c.googleUrl} target="_blank" rel="noopener noreferrer nofollow" className="underline">Google reviews ↗</a>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <h3 className="font-medium mb-2 text-sm">Search trusted directories</h3>
        <ul className="space-y-2">
          {directoryLinks(city, area).map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm underline font-medium">
                {l.label} ↗
              </a>
              <span className="block text-xs text-neutral-500">{l.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
