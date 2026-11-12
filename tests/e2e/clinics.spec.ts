import { test, expect } from "@playwright/test";
import { expectNoOverflow, setup } from "./helpers";

test("clinic finder: ZIP stays local, links are tagged, no personal-data form", async ({ page, context }) => {
  const errors = await setup(page);
  await page.goto("/clinics?t=botox&city=nyc");
  await expect(page.getByRole("heading", { name: "Find a clinic for Botox" })).toBeVisible();
  // No name/email/phone fields anywhere: only the ZIP box.
  await expect(page.locator("main input")).toHaveCount(1);

  await page.getByPlaceholder(/ZIP/).fill("10012");
  await expect(page.getByText("10012 → SoHo")).toBeVisible();
  await expect(page.locator("ul > li p.font-medium").first()).toHaveText("Spring Street Dermatology");
  await expect(page.getByText("AG-SPRING")).toBeVisible();

  const sent: string[] = [];
  page.on("request", (r) => { if (r.url().includes("/api/track")) sent.push(r.postData() ?? ""); });
  const [popup] = await Promise.all([context.waitForEvent("page"), page.getByRole("link", { name: "Website ↗" }).first().click()]);
  await popup.waitForLoadState();
  const url = new URL(popup.url());
  expect(url.searchParams.get("utm_source")).toBe("aestheticguide");
  expect(url.searchParams.get("ag_click")).toBeTruthy();
  // The typed ZIP is never sent.
  await page.waitForTimeout(300);
  expect(sent.join(" ")).not.toContain("10012");

  await expectNoOverflow(page);
  expect(errors).toEqual([]);
});

test("every treatment gets a result in both cities", async ({ page }) => {
  await setup(page);
  await page.goto("/clinics?t=aerolase&city=miami");
  await expect(page.getByRole("link", { name: /on Google Maps/ }).first()).toBeVisible();
  await expect(page.getByText(/Not checked by us/)).toBeVisible();
});
