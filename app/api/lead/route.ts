import { NextResponse } from "next/server";
import { insert, storageReady } from "@/lib/store";
import { limited } from "@/lib/rateLimit";
import { areaOf, clinicById, isCity, token, treatmentId } from "@/lib/trackRules";
import { CONNECT_CONSENT, LEAD_CONSENT } from "@/lib/clinics";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function reference() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "AG-" + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/**
 * A consultation request to one partner clinic. Saved with a reference number
 * (shown to the person and the clinic) so every referral can be traced.
 * Only what the person typed is saved; quiz and health answers are never sent.
 */
export async function POST(req: Request) {
  if (limited(req, "lead", 5, 60 * 60_000)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  const raw = await req.text();
  if (raw.length > 4000) return NextResponse.json({ error: "Request too long." }, { status: 413 });
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof b.website === "string" && b.website) return NextResponse.json({ ok: true, ref: reference() }); // honeypot

  // Either a request to one partner clinic, or "connect me" (we pick a partner clinic near the person).
  const connect = b.connect === true;
  const clinic = connect ? undefined : clinicById(b.clinic);
  if (!connect && !clinic?.partner) return NextResponse.json({ error: "This clinic isn't taking requests through us." }, { status: 400 });
  const city = clinic?.city ?? (isCity(b.city) ? b.city : null);
  if (!city) return NextResponse.json({ error: "Pick a city." }, { status: 400 });
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");
  const name = str(b.name, 80);
  const email = str(b.email, 120);
  const phone = str(b.phone, 30);
  const when = str(b.when, 80);
  if (name.length < 2) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  const emailOk = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email);
  const phoneOk = (phone.match(/\d/g) ?? []).length >= 10 && /^[+\d\s().-]+$/.test(phone);
  if (!emailOk && !phoneOk) return NextResponse.json({ error: "Please add a valid email or phone number." }, { status: 400 });
  if (b.consent !== true) return NextResponse.json({ error: "Please tick the consent box." }, { status: 400 });
  if (!storageReady()) return NextResponse.json({ error: "Requests aren't open yet. Please contact the clinic directly." }, { status: 503 });

  const ref = reference();
  try {
    await insert("leads", {
      at: new Date().toISOString(),
      ref,
      clinic: clinic?.id ?? null,
      city,
      area: areaOf(city, b.area),
      treatment: treatmentId(b.treatment),
      name,
      email: emailOk ? email : null,
      phone: phoneOk ? phone : null,
      preferred_time: when || null,
      consent_text: clinic ? LEAD_CONSENT : CONNECT_CONSENT,
      tab: token(b.tab, 16),
      status: "new",
    });
  } catch {
    console.error("lead: store failed");
    return NextResponse.json({ error: "We couldn't send that right now. Please try again later." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, ref });
}
