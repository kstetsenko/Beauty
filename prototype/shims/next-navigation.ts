import { useSyncExternalStore } from "react";
import { fromHash, navigate, subscribe } from "../router";

/** Stand-ins for next/navigation, backed by the prototype's hash router. */
export function useSearchParams() {
  const hash = useSyncExternalStore(subscribe, () => location.hash, () => "");
  const r = fromHash(hash);
  const q = new URLSearchParams();
  if ("city" in r) q.set("city", r.city);
  if (r.name === "compare") q.set("ids", r.ids.join(","));
  return q;
}

export function useRouter() {
  return { replace: (url: string) => navigate(url), push: (url: string) => navigate(url) };
}

export function notFound(): never {
  throw new Error("not found");
}
