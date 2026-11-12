// Clinic listings: valid data, fair ordering, ZIP matching and tagged links.
import { describe, expect, it } from "vitest";
import { CLINICS, NEIGHBORHOODS, ZIPS, clinicsFor, directoryLinks, splitByArea } from "@/lib/clinics";
import { PROCEDURES } from "@/lib/procedures";
import { tagUrl } from "@/lib/tracking";

describe("clinic data", () => {
  it("has unique ids and booking codes", () => {
    expect(new Set(CLINICS.map((c) => c.id)).size).toBe(CLINICS.length);
    expect(new Set(CLINICS.map((c) => c.code)).size).toBe(CLINICS.length);
  });

  it.each(CLINICS.map((c) => [c.id, c] as const))("%s meets the listing criteria fields", (_id, c) => {
    expect(NEIGHBORHOODS[c.city]).toContain(c.neighborhood);
    expect(c.offers.length).toBeGreaterThan(0);
    for (const o of c.offers) expect(PROCEDURES.some((p) => p.id === o)).toBe(true);
    expect(c.website).toMatch(/^https:\/\//);
    expect(c.credentialSource).toMatch(/^https:\/\//);
    expect(c.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(c.code).toMatch(/^AG-[A-Z0-9]+$/);
    // Ratings are never copied without a check date.
    if (c.rating !== null) expect(c.ratingCheckedAt).toBeTruthy();
  });

  it("orders the chosen neighborhood first, then A–Z, never by fee", () => {
    const { listed } = clinicsFor("nyc", "botox", "SoHo");
    expect(listed[0].neighborhood).toBe("SoHo");
    const rest = listed.slice(1).map((c) => c.name);
    expect(rest).toEqual([...rest].sort((a, b) => a.localeCompare(b)));
  });

  it("maps ZIP codes only to known neighborhoods", () => {
    for (const city of ["nyc", "miami"] as const)
      for (const [zip, n] of Object.entries(ZIPS[city])) {
        expect(zip).toMatch(/^\d{5}$/);
        expect(NEIGHBORHOODS[city]).toContain(n);
      }
  });
});

describe("links", () => {
  it("tags clinic links with source, treatment and click id", () => {
    const u = new URL(tagUrl("https://example.com/page?x=1", "botox", "abc123"));
    expect(u.searchParams.get("utm_source")).toBe("aestheticguide");
    expect(u.searchParams.get("utm_campaign")).toBe("botox");
    expect(u.searchParams.get("ag_click")).toBe("abc123");
    expect(u.searchParams.get("x")).toBe("1");
  });

  it("builds near-me and neighborhood Google Maps searches", () => {
    expect(directoryLinks("nyc", "", ["Botox"]).byProcedure[0].href).toContain(encodeURIComponent("Botox near me"));
    expect(decodeURIComponent(directoryLinks("miami", "Brickell", ["Botox"]).byProcedure[0].href)).toContain("near Brickell, Miami, FL");
  });
});

describe("neighborhoods", () => {
  it("never shows a clinic under a neighborhood it isn't in", () => {
    for (const city of ["nyc", "miami"] as const)
      for (const area of NEIGHBORHOODS[city])
        for (const p of PROCEDURES) {
          const { listed } = clinicsFor(city, p.id, area);
          const { here, elsewhere } = splitByArea(listed, area);
          for (const c of here) expect(c.neighborhood, `${city} ${area} ${p.id}`).toBe(area);
          for (const c of elsewhere) expect(c.neighborhood).not.toBe(area);
          expect(here.length + elsewhere.length).toBe(listed.length);
          // Only clinics that list the treatment on their own pages.
          for (const c of listed) expect(c.offers).toContain(p.id);
        }
  });

  it("labels what kind of place each clinic is", () => {
    for (const c of CLINICS) expect(["Dermatology practice", "University medical center", "Plastic surgery practice", "Medical spa"]).toContain(c.kind);
  });
});
