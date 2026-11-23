"use client";
import { useState } from "react";
import type { City } from "@/lib/types";

/** sessionStorage key for the shortlist in this tab (treatment ids only). */
export const LIST_KEY = "aesthetic_guide_list";
export function readList(): string[] {
  try { const v = JSON.parse(sessionStorage.getItem(LIST_KEY) ?? "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; } catch { return []; }
}

/** Link to the list: only treatment ids and the city. No health answers, goals or personal details. */
export const listHref = (city: City, ids: string[]) => `/list?city=${city}&ids=${ids.join(",")}`;

export function ShareList({ city, ids }: { city: City; ids: string[] }) {
  const [note, setNote] = useState("");
  if (!ids.length) return null;
  const share = async () => {
    const url = new URL(listHref(city, ids), location.origin).toString();
    try {
      if (navigator.share) await navigator.share({ title: "My treatment shortlist", url });
      else { await navigator.clipboard.writeText(url); setNote("Link copied."); }
    } catch {
      setNote(url);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={share} className="btn-soft text-sm">Share my list</button>
        <a href={listHref(city, ids)} className="btn-soft text-sm text-center">Printable page</a>
      </div>
      <p className="text-[11px] text-muted mt-2">The link only contains the treatment names and your city, never your health answers.</p>
      {note && <p className="text-xs mt-1 break-all" aria-live="polite">{note}</p>}
    </div>
  );
}
