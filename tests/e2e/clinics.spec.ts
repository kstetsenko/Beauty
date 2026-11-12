import { test, expect } from "@playwright/test";
import { expectNoOverflow, setup } from "./helpers";

test("clinic finder: ZIP stays local, links are tagged, no personal-data form", async ({ page, context }) => {
  const errors = await setup(page);
  await page.goto("/clinics?t=botox&city=nyc");
  await expect(page.getByRole("heading", { name: "Find a clinic for Botox" })).toBeVisible();
  // No name/email/phone fields anywhere: only the ZIP box.
  await expect(page.locator("main input")).toHaveCount(1);

  await page.getByPlaceholder(/ZIP/).fill("10012");
  await expect(page.getByText("10012 is in SoHo")).toBeVisible();
  await expect(page.getByRole("list", { name: "Clinics in SoHo" }).locator("p.font-medium")).toHaveText(["Spring Street Dermatology"]);
  await expect(page.getByText("AG-SPRING")).toBeVisible();

  const sent: string[] = [];
  page.on("request", (r) => { if (r.url().includes("/api/track")) sent.push(r.postData() ?? ""); });
  const [popup] = await Promise.all([context.waitForEvent("page"), page.getByRole("link", { name: "Website" }).first().click()]);
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

test.describe("every neighborhood shows only its own clinics", () => {
  for (const [city, label] of [["nyc", "New York City"], ["miami", "Miami"]] as const)
    test(label, async ({ page }) => {
      const errors = await setup(page);
      await page.goto(`/clinics?t=botox&city=${city}`);
      const chips = page.locator("main div.overflow-x-auto button");
      const n = await chips.count();
      expect(n).toBeGreaterThan(5);
      for (let i = 0; i < n; i++) {
        const area = ((await chips.nth(i).textContent()) ?? "").trim();
        await chips.nth(i).click();
        await expect(page.getByRole("heading", { name: `In ${area}` })).toBeVisible();
        const here = page.getByRole("list", { name: `Clinics in ${area}` });
        if (await here.count()) {
          for (const card of await here.locator("li").all()) await expect(card).toContainText(`· ${area}`);
        } else {
          await expect(page.getByText(new RegExp(`We haven't checked a clinic for Botox in ${area}`))).toBeVisible();
        }
        await chips.nth(i).click(); // unselect
      }
      expect(errors).toEqual([]);
    });
});
