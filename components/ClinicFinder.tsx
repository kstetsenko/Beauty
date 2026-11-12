"use client";
import { useEffect, useState } from "react";
import { CITY_LABELS, LISTING_NOTE, NEIGHBORHOODS, PARTNER_NOTE, ZIPS, clinicsFor, directoryLinks, mapsTerm } from "@/lib/clinics";
import { PROCEDURES } from "@/lib/procedures";
import { track } from "@/lib/tracking";
import type { City } from "@/lib/types";
import { ClinicCard } from "./ClinicCard";
import { TrackedLink } from "./TrackedLink";
import { Disclosure } from "./Disclosure";

/**
 * In-app clinic finder. People contact clinics directly (website, booking, call, directions);
 * we never collect their names or contact details. Every tap is counted, website and booking
 * links are tagged, and each clinic has a booking code — so visits can be traced to the guide.
 */
export function ClinicFinder({ treatment, city: initialCity, area: initialArea = "" }: { treatment: string; city: City; area?: string }) {
  const p = PROCEDURES.find((x) => x.id === treatment);
  const [city, setCity] = useState<City>(initialCity);
  const [area, setArea] = useState(NEIGHBORHOODS[initialCity].includes(initialArea) ? initialArea : "");
  const [zip, setZip] = useState("");
  const [zipNote, setZipNote] = useState("");

  // Count each search (treatment + city + neighborhood) so demand is visible to the owner.
  useEffect(() => {
    if (PROCEDURES.some((x) => x.id === treatment)) track({ kind: "finder", treatment, city, area });
  }, [treatment, city, area]);

  if (!p) return <p className="text-sm">Pick a treatment first. <a href="/procedures" className="underline">See treatments</a></p>;

  const name = p.name.split(" / ")[0];
  const { partners, listed } = clinicsFor(city, p.id, area);
  const inArea = [...partners, ...listed].filter((c) => c.neighborhood === area).length;
  const links = directoryLinks(city, area, [mapsTerm(p)]);
  const other: City = city === "nyc" ? "miami" : "nyc";

  // ZIP is matched to a neighborhood here on the device and never sent anywhere.
  const onZip = (v: string) => {
    const z = v.replace(/\D/g, "").slice(0, 5);
    setZip(z);
    if (z.length < 5) return setZipNote("");
    const hit = ZIPS.nyc[z] ? { c: "nyc" as City, n: ZIPS.nyc[z] } : ZIPS.miami[z] ? { c: "miami" as City, n: ZIPS.miami[z] } : null;
    if (hit) {
      setCity(hit.c);
      setArea(hit.n);
      setZipNote(`${z} → ${hit.n}`);
    } else setZipNote(`We don't have ${z} mapped yet — pick a neighborhood below.`);
  };

  return (
    <section className="animate-in space-y-6">
      <div>
        <a href={`/procedures/${p.id}?city=${city}`} className="text-muted hover:text-ink text-sm">← {name}</a>
        <h1 className="text-2xl font-semibold mt-3 mb-1.5">Find a clinic for {name}</h1>
        <p className="text-sm text-muted">
          Contact clinics directly — we don&apos;t ask for your name or details. Check credentials, reviews and prices yourself before booking.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 text-sm">
          <span className="rounded-full bg-ink text-white px-3.5 py-1.5">{CITY_LABELS[city]}</span>
          <button type="button" onClick={() => { setCity(other); setArea(""); setZip(""); setZipNote(""); }} className="rounded-full border border-line bg-white px-3.5 py-1.5 hover:border-ink">
            {CITY_LABELS[other]}
          </button>
        </div>
        <label className="block">
          <span className="sr-only">ZIP code</span>
          <input value={zip} onChange={(e) => onZip(e.target.value)} inputMode="numeric" autoComplete="postal-code" placeholder="Your ZIP code (stays on your device)"
            className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm focus:outline-none focus:border-ink" />
        </label>
        {zipNote && <p className="text-xs text-muted -mt-1 px-2">{zipNote}</p>}
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 [scrollbar-width:none]">
          {NEIGHBORHOODS[city].map((n) => (
            <button key={n} type="button" onClick={() => { setArea(area === n ? "" : n); setZip(""); setZipNote(""); }} aria-pressed={area === n}
              className={"shrink-0 rounded-full border px-3 py-1.5 text-xs " + (area === n ? "bg-ink text-white border-ink" : "bg-white border-line")}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {partners.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">Partner clinics</h2>
          <ul className="space-y-2.5">{partners.map((c) => <ClinicCard key={c.id} c={c} treatment={p.id} />)}</ul>
          <p className="text-[11px] text-muted mt-2">{PARTNER_NOTE}</p>
        </div>
      )}

      <div>
        <h2 className="font-semibold mb-1">Clinics offering {name}{area ? ` near ${area}` : ` in ${CITY_LABELS[city]}`}</h2>
        {area && listed.length > 0 && inArea === 0 && (
          <p className="text-xs text-muted mb-2">None listed in {area} yet — showing the rest of {CITY_LABELS[city]}.</p>
        )}
        {listed.length > 0 ? (
          <>
            <ul className="space-y-2.5 mt-2">{listed.map((c) => <ClinicCard key={c.id} c={c} treatment={p.id} />)}</ul>
            <p className="text-[11px] text-muted mt-2">{LISTING_NOTE} <a href="/sources#clinics" className="underline">Our criteria</a></p>
          </>
        ) : (
          <p className="rounded-2xl bg-blush p-4 text-sm mt-2">
            We haven&apos;t listed a clinic for {name} in {CITY_LABELS[city]} yet. Search Google Maps below, and check the doctor&apos;s board certification.
          </p>
        )}
      </div>

      <Disclosure title="Search on your own" hint="Google Maps, board-certification directories, license lookup">
        <div className="grid gap-2.5">
          <TrackedLink href={links.byProcedure[0].href} ev={{ kind: "maps", treatment: p.id, city, area }} className="text-sm underline">
            {name} near {area || "me"} on Google Maps ↗
          </TrackedLink>
          {links.directories.map((l) => (
            <TrackedLink key={l.href} href={l.href} ev={{ kind: "directory", city }} className="text-sm underline">{l.short} ↗</TrackedLink>
          ))}
          <TrackedLink href={links.license.href} ev={{ kind: "license", city }} className="text-sm underline">{links.license.short} ↗</TrackedLink>
        </div>
        <p className="text-[11px] text-muted mt-3">Google Maps results and ratings come from Google, not from us.</p>
      </Disclosure>

      <p className="text-[11px] text-muted">Clinics are independent businesses; we don&apos;t provide or supervise care. Educational information only — not medical advice.</p>
    </section>
  );
}
