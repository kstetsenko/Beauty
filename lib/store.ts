import { appendFile, mkdir, readFile } from "node:fs/promises";

/**
 * Where tracking rows are saved.
 * - Supabase (free plan) when SUPABASE_URL and SUPABASE_SERVICE_KEY are set. Tables: supabase/tracking.sql.
 * - A local file in .data/ (git-ignored) for development, or when TRACKING_LOCAL_FILE=1.
 * - Otherwise nothing is saved (the site still works).
 */
export type Table = "clicks";

const url = () => process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = () => process.env.SUPABASE_SERVICE_KEY;
const localFile = () => process.env.NODE_ENV !== "production" || process.env.TRACKING_LOCAL_FILE === "1";

export function storageReady() {
  return Boolean((url() && key()) || localFile());
}

export async function insert(table: Table, row: Record<string, unknown>): Promise<boolean> {
  if (url() && key()) {
    const res = await fetch(`${url()}/rest/v1/${table}`, {
      method: "POST",
      headers: { apikey: key()!, Authorization: `Bearer ${key()}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`store ${table}: ${res.status}`);
    return true;
  }
  if (localFile()) {
    await mkdir(".data", { recursive: true });
    await appendFile(`.data/${table}.jsonl`, JSON.stringify(row) + "\n");
    return true;
  }
  return false;
}

/** Rows with `at` in [from, to). */
export async function between(table: Table, from: string, to: string): Promise<Record<string, unknown>[]> {
  if (url() && key()) {
    const rows: Record<string, unknown>[] = [];
    for (let offset = 0; ; offset += 1000) {
      const q = `${url()}/rest/v1/${table}?select=*&at=gte.${encodeURIComponent(from)}&at=lt.${encodeURIComponent(to)}&order=at.asc`;
      const res = await fetch(q, {
        headers: { apikey: key()!, Authorization: `Bearer ${key()}`, Range: `${offset}-${offset + 999}` },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`read ${table}: ${res.status}`);
      const page = (await res.json()) as Record<string, unknown>[];
      rows.push(...page);
      if (page.length < 1000) return rows;
    }
  }
  if (localFile()) {
    const text = await readFile(`.data/${table}.jsonl`, "utf8").catch(() => "");
    return text
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as Record<string, unknown>)
      .filter((r) => String(r.at) >= from && String(r.at) < to);
  }
  return [];
}
