"use client";
import { useEffect, useState } from "react";
import { CITY_LABELS, CONNECT_PROMISE, NEIGHBORHOODS, PARTNER_NOTE, directoryLinks, mapsTerm, partnersFor } from "@/lib/clinics";
import { PROCEDURES } from "@/lib/procedures";
import type { City } from "@/lib/types";
import { PartnerClinics } from "./PartnerClinics";
import { LeadRequestForm } from "./LeadRequestForm";
import { TrackedLink } from "./TrackedLink";
import { track } from "@/lib/tracking";
import { Disclosure } from "./Disclosure";

/**
 * In-app clinic finder. Everything starts here (not on Google Maps) so each
 * referral is traceable: partner clinics first, then a "connect me" request
 * with a reference number, then — last — searching Google Maps yourself.
 */
export function ClinicFinder({ treatment, city: initialCity, area: initialArea = "" }: { treatment: string; city: City; area?: string }) {
  const p = PROCEDURES.find((x) => x.id === treatment);
  const [city, setCity] = useState<City>(initialCity);
  const [area, setArea] = useState(NEIGHBORHOODS[initialCity].includes(initialArea) ? initialArea : "");
  const [asking, setAsking] = useState(false);
  // Count each search (treatment + city + area) so demand is visible even before partners join.
  useEffect(() => {
    if (PROCEDURES.some((x) => x.id === treatment)) track({ kind: "finder", treatment, city, area });
  }, [treatment, city, area]);
  if (!p) return <p className="text-sm">Pick a treatment first. <a href="/procedures" className="underline">See treatments</a></p>;

  const name = p.name.split(" / ")[0];
  const partners = partnersFor(city, [p.id], area);
  const links = directoryLinks(city, area, [mapsTerm(p)]);
  const other: City = city === "nyc" ? "miami" : "nyc";

  return (
    <section className="animate-in space-y-6">
      <div>
        <a href={`/procedures/${p.id}?city=${city}`} className="text-muted hover:text-ink text-sm">← {name}</a>
        <h1 className="text-2xl font-semibold mt-3 mb-1.5">Find a clinic for {name}</h1>
        <p className="text-sm text-muted">
          Pick an area, then contact a partner clinic or ask us to connect you. Always check a provider&apos;s credentials yourself.
        </p>
      </div>

      <div>
        <div className="flex gap-2 mb-3 text-sm">
          <span className="rounded-full bg-ink text-white px-3.5 py-1.5">{CITY_LABELS[city]}</span>
          <button type="button" onClick={() => { setCity(other); setArea(""); }} className="rounded-full border border-line bg-white px-3.5 py-1.5 hover:border-ink">
            {CITY_LABELS[other]}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 [scrollbar-width:none]">
          {NEIGHBORHOODS[city].map((n) => (
            <button key={n} type="button" onClick={() => setArea(area === n ? "" : n)} aria-pressed={area === n}
              className={"shrink-0 rounded-full border px-3 py-1.5 text-xs " + (area === n ? "bg-ink text-white border-ink" : "bg-white border-line")}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {partners.length > 0 ? (
        <PartnerClinics city={city} treatment={p.id} area={area} />
      ) : (
        <p className="rounded-2xl bg-blush p-4 text-sm">
          We don&apos;t have a partner clinic for {name} in {area || CITY_LABELS[city]} yet.
        </p>
      )}

      <div className="rounded-3xl bg-white border border-line p-5">
        <h2 className="font-semibold">Ask us to connect you</h2>
        <p className="text-sm text-muted mt-1">{CONNECT_PROMISE} Free, no obligation.</p>
        {asking ? (
          <LeadRequestForm treatment={p.id} city={city} area={area} />
        ) : (
          <button type="button" onClick={() => setAsking(true)} className="btn-main w-full text-sm mt-4">Connect me with a clinic</button>
        )}
      </div>

      <Disclosure title="Search on your own" hint="Google Maps, board-certification directories, license lookup">
        <div className="grid gap-2.5">
          <TrackedLink href={links.byProcedure[0].href} ev={{ kind: "maps", treatment: p.id, city, area }} className="text-sm underline">
            {p.approach === "topical" ? "Dermatologists" : name} near {area || "me"} on Google Maps ↗
          </TrackedLink>
          {links.directories.map((l) => (
            <TrackedLink key={l.href} href={l.href} ev={{ kind: "directory", city }} className="text-sm underline">{l.short} ↗</TrackedLink>
          ))}
          <TrackedLink href={links.license.href} ev={{ kind: "license", city }} className="text-sm underline">{links.license.short} ↗</TrackedLink>
        </div>
        <p className="text-[11px] text-muted mt-3">Google Maps results and ratings come from Google, not from us.</p>
      </Disclosure>

      <p className="text-[11px] text-muted">{partners.length ? "" : PARTNER_NOTE + " "}Clinics are independent businesses; we don&apos;t provide or supervise care. Educational information only — not medical advice.</p>
    </section>
  );
}
