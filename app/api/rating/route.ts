import { clinicById } from "@/lib/trackRules";

/**
 * Optional live Google rating for a listed clinic (off unless GOOGLE_PLACES_API_KEY is set).
 * Receives only a clinic id from our own list; nothing about the visitor is sent to Google.
 * Not stored: Google's terms limit caching of Places content, so each answer is fetched fresh
 * and shown with "from Google" attribution.
 */
export async function GET(req: Request) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const clinic = clinicById(new URL(req.url).searchParams.get("id"));
  if (!key || !clinic) return new Response(null, { status: 204 });
  try {
    const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.rating,places.userRatingCount,places.googleMapsUri" },
      body: JSON.stringify({ textQuery: `${clinic.name} ${clinic.address ?? clinic.neighborhood}`, maxResultCount: 1 }),
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) return new Response(null, { status: 204 });
    const p = (await r.json()).places?.[0];
    if (typeof p?.rating !== "number") return new Response(null, { status: 204 });
    return Response.json({ rating: p.rating, count: p.userRatingCount ?? null, url: p.googleMapsUri ?? clinic.googleUrl });
  } catch {
    return new Response(null, { status: 204 });
  }
}
