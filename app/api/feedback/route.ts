import { NextResponse } from "next/server";

/**
 * Visitor feedback. Delivered, in order of preference, to:
 * 1. a GitHub issue (labeled "feedback") in FEEDBACK_GITHUB_REPO using FEEDBACK_GITHUB_TOKEN
 *    (a fine-grained token with Issues: read & write on that repo only), or
 * 2. FEEDBACK_WEBHOOK_URL (e.g. Slack/Zapier/email service), or
 * 3. nowhere (acknowledged but not stored) when neither is configured.
 * We never store IP addresses. Email is only included if the person typed it.
 */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  const raw = await req.text();
  if (raw.length > 6000) return NextResponse.json({ error: "Message too long." }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true }); // honeypot

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";
  if (message.length < 3) return NextResponse.json({ error: "Please write a little more." }, { status: 400 });
  const email = typeof body.email === "string" && /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(body.email.trim()) ? body.email.trim() : "";
  const page = typeof body.page === "string" ? body.page.slice(0, 200) : "";
  const text = `${message}\n\n---\nPage: ${page || "unknown"}${email ? `\nReply to: ${email}` : ""}\nReceived: ${new Date().toISOString()}`;

  const repo = process.env.FEEDBACK_GITHUB_REPO; // e.g. "kstetsenko/beauty"
  const token = process.env.FEEDBACK_GITHUB_TOKEN;
  try {
    if (repo && token) {
      const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
        body: JSON.stringify({ title: `Feedback: ${message.slice(0, 60)}`, body: text, labels: ["feedback"] }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(String(res.status));
      return NextResponse.json({ ok: true, stored: true });
    }
    if (process.env.FEEDBACK_WEBHOOK_URL) {
      const res = await fetch(process.env.FEEDBACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(String(res.status));
      return NextResponse.json({ ok: true, stored: true });
    }
  } catch {
    console.error("feedback: delivery failed");
    return NextResponse.json({ error: "We couldn't send that right now. Please try again later." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, stored: false });
}
