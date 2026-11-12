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
    const clicks = await between("clicks", from, to);
    const ids = new Set(clicks.map((c) => c.clinic).filter(Boolean) as string[]);
    const clinics = [...ids].map((id) => {
      const c = clicks.filter((r) => r.clinic === id);
      const treatments: Record<string, number> = {};
      for (const r of c) if (r.treatment) treatments[String(r.treatment)] = (treatments[String(r.treatment)] ?? 0) + 1;
      return {
        id,
        name: CLINICS.find((x) => x.id === id)?.name ?? id,
        code: CLINICS.find((x) => x.id === id)?.code ?? "",
        visitors: new Set(c.map((r) => r.tab).filter(Boolean)).size,
        website: count(c, (r) => r.kind === "site"),
        booking: count(c, (r) => r.kind === "book"),
        calls: count(c, (r) => r.kind === "call"),
        directions: count(c, (r) => r.kind === "directions"),
        reviews: count(c, (r) => r.kind === "reviews"),
        treatments: Object.entries(treatments).sort((x, y) => y[1] - x[1]),
      };
    }).sort((x, y) => y.visitors - x.visitors);
    // Demand: clinic searches in the app and Google Maps taps.
    const demand: Record<string, number> = {};
    for (const r of clicks.filter((r) => r.kind === "maps" || r.kind === "finder")) {
      const k = [r.city ?? "?", r.treatment ?? "?", r.area ?? "any area"].join(" | ");
      demand[k] = (demand[k] ?? 0) + 1;
    }
    return NextResponse.json({
      month,
      totals: { taps: count(clicks, (r) => !!r.clinic), searches: count(clicks, (r) => r.kind === "finder" || r.kind === "maps"), visitors: new Set(clicks.map((r) => r.tab).filter(Boolean)).size },
      clinics,
      demand: Object.entries(demand).sort((x, y) => y[1] - x[1]).slice(0, 50),
    });
  } catch {
    return NextResponse.json({ error: "Couldn't read the data. Check the Supabase settings." }, { status: 502 });
  }
}
