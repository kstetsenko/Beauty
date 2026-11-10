"use client";
import { useState } from "react";
import { CITY_LABELS } from "@/lib/clinics";
import type { City, Location } from "@/lib/types";

const HINTS: Record<City, string> = {
  nyc: "e.g. 10012 or Upper East Side",
  miami: "e.g. 33139 or Brickell",
};

export function CityStep({ initial, onNext }: { initial: Location | null; onNext: (l: Location) => void }) {
  const [city, setCity] = useState<City | null>(initial?.city ?? null);
  const [area, setArea] = useState(initial?.area ?? "");

  return (
    <section aria-labelledby="city-h">
      <h2 id="city-h" className="text-2xl font-semibold mb-1">Where are you looking?</h2>
      <p className="text-sm text-neutral-600 mb-5">Pick a city to see local price ranges and where to find vetted providers.</p>

      <div className="grid grid-cols-2 gap-3 mb-5" role="radiogroup" aria-label="City">
        {(Object.keys(CITY_LABELS) as City[]).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={city === c}
            onClick={() => setCity(c)}
            className={
              "rounded-2xl border p-4 text-left transition-colors " +
              (city === c ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white hover:border-neutral-400")
            }
          >
            <span className="block text-2xl mb-1" aria-hidden="true">{c === "nyc" ? "🗽" : "🌴"}</span>
            <span className="font-medium">{CITY_LABELS[c]}</span>
          </button>
        ))}
      </div>

      <label className="block mb-6">
        <span className="block text-sm font-medium mb-1">ZIP code or neighborhood <span className="text-neutral-400 font-normal">(optional)</span></span>
        <input
          value={area}
          onChange={(e) => setArea(e.target.value.slice(0, 60))}
          placeholder={city ? HINTS[city] : "e.g. 10012 or Brickell"}
          autoComplete="off"
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        <span className="block text-xs text-neutral-500 mt-1">Used only on your device to build map searches. Never stored.</span>
      </label>

      <button
        type="button"
        disabled={!city}
        onClick={() => city && onNext({ city, area: area.trim() })}
        className="w-full sm:w-auto px-8 bg-neutral-900 text-white font-medium py-3 rounded-xl hover:bg-neutral-800 disabled:opacity-40"
      >
        Continue
      </button>
    </section>
  );
}
