// API routes: only validated, non-personal data is stored; the report needs the owner's key.
import { beforeEach, describe, expect, it, vi } from "vitest";

const rows: Record<string, unknown>[] = [];
vi.mock("@/lib/store", () => ({
  insert: vi.fn(async (_t: string, row: Record<string, unknown>) => { rows.push(row); return true; }),
  between: vi.fn(async () => rows),
  storageReady: () => true,
}));

const post = (body: unknown, ip = "1.1.1.1") =>
  new Request("http://x/api/track", { method: "POST", body: JSON.stringify(body), headers: { "x-forwarded-for": ip } });

describe("/api/track", () => {
  beforeEach(() => { rows.length = 0; });

  it("stores a valid tap with known values only", async () => {
    const { POST } = await import("@/app/api/track/route");
    const res = await POST(post({ kind: "site", clinic: "spring-street-derm", treatment: "botox", city: "nyc", area: "SoHo", tab: "abc", click: "def", page: "/clinics" }));
    expect(res.status).toBe(204);
    expect(rows[0]).toMatchObject({ kind: "site", clinic: "spring-street-derm", treatment: "botox", city: "nyc", area: "SoHo" });
  });

  it("never stores free text such as a typed address or ZIP", async () => {
    const { POST } = await import("@/app/api/track/route");
    await POST(post({ kind: "maps", city: "nyc", area: "10012 my home", treatment: "<script>", page: "javascript:x", tab: "BAD!" }, "2.2.2.2"));
    expect(rows[0]).toMatchObject({ area: null, treatment: null, page: null, tab: null, clinic: null });
  });

  it("ignores unknown event kinds and broken JSON", async () => {
    const { POST } = await import("@/app/api/track/route");
    await POST(post({ kind: "lead" }, "3.3.3.3"));
    await POST(new Request("http://x/api/track", { method: "POST", body: "{nope", headers: { "x-forwarded-for": "3.3.3.3" } }));
    expect(rows.length).toBe(0);
  });
});

describe("/api/report", () => {
  it("rejects a missing or wrong key and accepts the right one", async () => {
    process.env.REPORT_KEY = "a-long-test-report-key-123";
    const { GET } = await import("@/app/api/report/route");
    const req = (key?: string) => new Request("http://x/api/report?month=2026-11", { headers: key ? { "x-report-key": key, "x-forwarded-for": "9.9.9.9" } : { "x-forwarded-for": "9.9.9.8" } });
    expect((await GET(req())).status).toBe(401);
    expect((await GET(req("wrong-key-wrong-key-12345"))).status).toBe(401);
    const ok = await GET(req("a-long-test-report-key-123"));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toHaveProperty("totals");
  });
});
