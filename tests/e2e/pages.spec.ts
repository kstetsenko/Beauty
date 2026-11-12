import { test, expect } from "@playwright/test";
import { PROCEDURES, GOAL_LABELS } from "../../lib/procedures";
import { expectNoOverflow, setup, typical, withProfile } from "./helpers";

const pages = [
  "/", "/goals", "/procedures", "/compare?goal=lines", "/insights", "/sources", "/privacy", "/terms", "/report",
  ...Object.keys(GOAL_LABELS).map((g) => `/goals/${g}?city=nyc`),
  ...PROCEDURES.flatMap((p) => [`/procedures/${p.id}?city=nyc`, `/procedures/${p.id}?city=miami`]),
];

test.describe("every page loads cleanly", () => {
  for (const path of pages)
    test(path, async ({ page }) => {
      const errors = await setup(page);
      await withProfile(page, typical);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      await expectNoOverflow(page);
      expect(errors).toEqual([]);
    });
});

test("removed and out-of-scope pages return 404", async ({ page }) => {
  for (const gone of ["/procedures/lip-filler", "/procedures/tretinoin", "/procedures/masseter", "/goals/contour", "/api/lead"]) {
    const res = await page.goto(gone);
    expect(res?.status(), gone).toBe(404);
  }
});
