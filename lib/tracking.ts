/**
 * Referral tracking (client side). Records which clinic links people tap so
 * partner clinics can be shown how many visitors we send them.
 *
 * What is sent: event kind, clinic id, treatment id, city, neighborhood (only if
 * picked from our list), page path, a random id for this browser tab, and a
 * random click id. Never sent: quiz answers, health answers, typed ZIP codes,
 * IP addresses (the server does not store them).
 */
export type TrackKind = "finder" | "maps" | "site" | "call" | "book" | "directory" | "license" | "lead";

export interface TrackEvent {
  kind: TrackKind;
  clinic?: string;
  treatment?: string;
  city?: string;
  area?: string;
}

const PROTO = process.env.NEXT_PUBLIC_PROTOTYPE === "1";
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz"; // no 0/o/1/l/i look-alikes

export function randomId(len = 10) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

function tabId() {
  try {
    let id = sessionStorage.getItem("ag_tab");
    if (!id) sessionStorage.setItem("ag_tab", (id = randomId(12)));
    return id;
  } catch {
    return "";
  }
}

/** Fire-and-forget; never blocks or breaks the link the person tapped. Returns the click id. */
export function track(ev: TrackEvent): string {
  const click = randomId(10);
  if (PROTO || typeof window === "undefined") return click;
  try {
    const body = JSON.stringify({ ...ev, click, tab: tabId(), page: location.pathname });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/track", blob)) {
      fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {
    /* tracking must never get in the way */
  }
  return click;
}

/**
 * Adds standard UTM tags (shown in the clinic's own Google Analytics as source
 * "aestheticguide") plus our click id, so a booking can be matched to the tap.
 */
export function tagUrl(url: string, treatment?: string, click?: string) {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "aestheticguide");
    u.searchParams.set("utm_medium", "referral");
    if (treatment) u.searchParams.set("utm_campaign", treatment);
    if (click) u.searchParams.set("ag_click", click);
    return u.toString();
  } catch {
    return url;
  }
}
