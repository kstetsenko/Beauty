import { insert } from "@/lib/store";
import { limited } from "@/lib/rateLimit";
import { areaOf, clinicById, isCity, isKind, token, treatmentId } from "@/lib/trackRules";

/**
 * Logs one tap on a clinic, Maps, directory or license link (see lib/tracking.ts).
 * Always answers 204 so tracking can never break navigation.
 */
export async function POST(req: Request) {
  const done = new Response(null, { status: 204 });
  if (limited(req, "track", 120, 10 * 60_000)) return done;
  const raw = await req.text();
  if (raw.length > 1500) return done;
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw);
  } catch {
    return done;
  }
  if (!isKind(b.kind)) return done;
  const clinic = clinicById(b.clinic);
  const city = isCity(b.city) ? b.city : clinic?.city ?? null;
  try {
    await insert("clicks", {
      at: new Date().toISOString(),
      kind: b.kind,
      clinic: clinic?.id ?? null,
      treatment: treatmentId(b.treatment),
      city,
      area: areaOf(city, b.area),
      page: typeof b.page === "string" && /^\/[a-z0-9\-/]*$/i.test(b.page) ? b.page.slice(0, 100) : null,
      tab: token(b.tab, 16),
      click: token(b.click, 16),
    });
  } catch {
    console.error("track: store failed");
  }
  return done;
}
