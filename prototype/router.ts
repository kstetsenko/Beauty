/**
 * Hash router for the shareable single-file prototype. Converts the app's
 * normal paths (/procedures/sofwave?city=miami) into plain #names
 * (#p-sofwave-miami) because the prototype host only passes simple hashes.
 */
export type Route =
  | { name: "home" | "procedures" | "sources" | "privacy" | "terms" }
  | { name: "goals" }
  | { name: "goal"; goal: string; city: "nyc" | "miami" }
  | { name: "procedure"; id: string; city: "nyc" | "miami" }
  | { name: "compare"; ids: string[]; city: "nyc" | "miami" };

const cityOf = (c: string | null) => (c === "miami" ? "miami" : "nyc");

export function toHash(href: string): string {
  const url = new URL(href, "https://x.invalid/");
  const parts = url.pathname.split("/").filter(Boolean);
  const city = cityOf(url.searchParams.get("city"));
  if (parts[0] === "procedures" && parts[1]) return `p-${parts[1]}-${city}`;
  if (parts[0] === "goals" && parts[1]) return `g-${parts[1]}-${city}`;
  if (parts[0] === "goals") return "goals";
  if (parts[0] === "compare") {
    const ids = (url.searchParams.get("ids") || "").split(",").filter(Boolean);
    return `compare-${city}` + ids.map((i) => `--${i}`).join("");
  }
  if (["procedures", "sources", "privacy", "terms"].includes(parts[0])) return parts[0];
  return "home";
}

export function fromHash(hash: string): Route {
  const h = hash.replace(/^#/, "");
  const m = h.match(/^p-(.+)-(nyc|miami)$/);
  if (m) return { name: "procedure", id: m[1], city: m[2] as "nyc" | "miami" };
  const g = h.match(/^g-(.+)-(nyc|miami)$/);
  if (g) return { name: "goal", goal: g[1], city: g[2] as "nyc" | "miami" };
  if (h === "goals") return { name: "goals" };
  if (h.startsWith("compare-")) {
    const [head, ...ids] = h.split("--");
    return { name: "compare", city: cityOf(head.replace("compare-", "")), ids };
  }
  if (h === "procedures" || h === "sources" || h === "privacy" || h === "terms") return { name: h };
  return { name: "home" };
}

export function navigate(href: string) {
  const next = toHash(href);
  if (location.hash.replace(/^#/, "") === next) return;
  location.hash = next;
}

export function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}
