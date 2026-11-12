import { test, expect } from "@playwright/test";
import { expectNoOverflow, setup } from "./helpers";

test("quiz → ranked results with reasons → list → clinic finder", async ({ page }) => {
  const errors = await setup(page);
  await page.goto("/");
  await page.getByRole("button", { name: "New York City", exact: true }).click();
  await page.getByRole("button", { name: "Spots & Even Tone", exact: true }).click();
  await page.getByRole("button", { name: "Redness", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("radio", { name: "35-49" }).click();
  await page.getByRole("radio", { name: "Medium — tans" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Melasma" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByPlaceholder(/Search, e.g/).fill("dysport");
  await page.getByRole("button", { name: "Botox", exact: true }).click();
  await page.getByRole("button", { name: "See my options" }).click();

  await expect(page.getByRole("heading", { name: "Your matches" })).toBeVisible();
  await expect(page.getByText("How we rank")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Your top/ })).toBeVisible();
  await expect(page.getByText("Best for each of your goals")).toBeVisible();
  // The melasma-specific option leads, with its reason shown.
  await expect(page.locator("ol li a.font-semibold").first()).toHaveText(/Laser Toning/);
  await expect(page.getByText("✓ Used specifically for melasma").first()).toBeVisible();
  await expectNoOverflow(page);

  await page.getByRole("button", { name: /Event in 2 weeks/ }).click();
  await expect(page.locator("ol li a.font-semibold").first()).toBeVisible();
  await page.getByRole("button", { name: /Event in 2 weeks/ }).click();

  await page.locator("button[aria-label^='Save']").first().click();
  await page.getByRole("button", { name: /Your list \(1\)/ }).click();
  await expect(page.getByRole("heading", { name: "Your list" })).toBeVisible();
  await page.locator("a[href^='/clinics']").first().click();
  await expect(page.getByRole("heading", { name: /Find a clinic for/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("health questions hide treatments their labels rule out", async ({ page }) => {
  await setup(page);
  await page.goto("/");
  await page.getByRole("button", { name: "New York City", exact: true }).click();
  await page.getByRole("button", { name: "Lifting & Firmness", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("radio", { name: "50-64" }).click();
  await page.getByRole("radio", { name: "Light — burns easily" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Pacemaker or implanted device" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "None — see my options" }).click();
  await expect(page.getByRole("heading", { name: "Your matches" })).toBeVisible();
  await expect(page.locator("ol li a.font-semibold", { hasText: "Thermage" })).toHaveCount(0);
});
