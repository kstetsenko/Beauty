import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { between } from "@/lib/store";
import { limited } from "@/lib/rateLimit";
import { CLINICS } from "@/lib/clinics";

/** Owner-only monthly referral report. Needs the REPORT_KEY set in the hosting settings. */
function authorized(req: Request) {
  const want = process.env.REPORT_KEY ?? "";
  const got = req.headers.get("x-report-key") ?? "";
  if (want.length < 16 || got.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

type Row = Record<string, unknown>;
const count = (rows: Row[], f: (r: Row) => boolean) => rows.filter(f).length;

export async function GET(req: Request) {
  if (limited(req, "report", 20, 10 * 60_000)) return NextResponse.json({ error: "Too many tries." }, { status: 429 });
  if (!authorized(req)) return NextResponse.json({ error: "Wrong or missing report key." }, { status: 401 });
  const month = new URL(req.url).searchParams.get("month") ?? "";
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return NextResponse.json({ error: "Pick a month." }, { status: 400 });
  const [y, m] = month.split("-").map(Number);
  const from = new Date(Date.UTC(y, m - 1, 1)).toISOString();
  const to = new Date(Date.UTC(y, m, 1)).toISOString();

  try {
    const [clicks, leads] = await Promise.all([between("clicks", from, to), between("leads", from, to)]);
    const ids = new Set([...clicks.map((c) => c.clinic), ...leads.map((l) => l.clinic)].filter(Boolean) as string[]);
    const clinics = [...ids].map((id) => {
      const c = clicks.filter((r) => r.clinic === id);
      const l = leads.filter((r) => r.clinic === id);
      return {
        id,
        name: CLINICS.find((x) => x.id === id)?.name ?? id,
        visitors: new Set(c.map((r) => r.tab).filter(Boolean)).size,
        website: count(c, (r) => r.kind === "site"),
        calls: count(c, (r) => r.kind === "call"),
        booking: count(c, (r) => r.kind === "book"),
        leads: l.map((r) => ({ ref: r.ref, at: r.at, treatment: r.treatment, name: r.name, email: r.email, phone: r.phone, preferred_time: r.preferred_time, status: r.status })),
      };
    });
    // Demand: Google Maps searches people started from the app (no clinic involved).
    const demand: Record<string, number> = {};
    for (const r of clicks.filter((r) => r.kind === "maps")) {
      const k = [r.city ?? "?", r.treatment ?? "dermatologist", r.area ?? "near me"].join(" | ");
      demand[k] = (demand[k] ?? 0) + 1;
    }
    return NextResponse.json({
      month,
      totals: { taps: clicks.length, maps: count(clicks, (r) => r.kind === "maps"), leads: leads.length },
      clinics,
      demand: Object.entries(demand).sort((a, b) => b[1] - a[1]).slice(0, 50),
    });
  } catch {
    return NextResponse.json({ error: "Couldn't read the data. Check the Supabase settings." }, { status: 502 });
  }
}
