import { NextResponse } from "next/server";
import { PROCEDURES } from "@/lib/procedures";

// Must match CONSENT_TEXT in components/LeadCaptureForm.tsx, so the exact
// wording a person agreed to is recorded with their sign-up.
const CONSENT_PREFIX = "I agree to receive educational guides and updates.";
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/;
const IDS = new Set(PROCEDURES.map((p) => p.id));

// Best-effort per-instance rate limit. Use a shared store (e.g. Upstash) for strict limits.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 415 });
  }
  const raw = await req.text();
  if (raw.length > 4000) return NextResponse.json({ error: "Invalid request." }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled: pretend success, store nothing.
  if (typeof body.website === "string" && body.website !== "") return NextResponse.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (body.consent !== true || typeof body.consentText !== "string" || !body.consentText.startsWith(CONSENT_PREFIX)) {
    return NextResponse.json({ error: "Consent is required." }, { status: 400 });
  }
  const city = body.city === "nyc" || body.city === "miami" ? body.city : null;
  const procedureIds = Array.isArray(body.procedureIds)
    ? body.procedureIds.filter((x): x is string => typeof x === "string" && IDS.has(x)).slice(0, 20)
    : [];

  // Data minimization: only these fields are kept. No health answers, no IP.
  const record = {
    email,
    city,
    procedureIds,
    consent: { text: body.consentText.slice(0, 500), at: new Date().toISOString() },
  };

  const url = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (!url) {
    // No provider configured yet: acknowledge without storing anything.
    return NextResponse.json({ ok: true, stored: false });
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SUBSCRIBE_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.SUBSCRIBE_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    // Never log the email address.
    console.error("subscribe: webhook delivery failed");
    return NextResponse.json({ error: "We couldn't save that right now. Please try again later." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, stored: true });
}
