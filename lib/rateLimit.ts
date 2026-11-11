/** Small in-memory limiter (per server instance). Keys are hashed in memory only; IPs are never stored. */
const hits = new Map<string, number[]>();

export function limited(req: Request, bucket: string, max: number, windowMs: number) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const k = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(k) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(k, recent);
  if (hits.size > 20000) hits.clear();
  return recent.length > max;
}
