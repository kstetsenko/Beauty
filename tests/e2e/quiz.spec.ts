import { test, expect } from "@playwright/test";
import { expectNoOverflow, setup, takeQuiz } from "./helpers";

test("goals come first; results are about those goals, with reasons", async ({ page }) => {
  const errors = await setup(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "What would you like to improve?" })).toBeVisible();
  // Can't continue without a goal.
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeDisabled();
  await takeQuiz(page, { goals: ["Spots & Even Tone", "Redness"], tone: "Medium — tans", flags: ["Melasma"] });

  await expect(page.getByText(/for spots & even tone, redness that fit your answers/)).toBeVisible();
  await expect(page.getByRole("tab", { name: /All your goals/ })).toBeVisible();
  await expect(page.getByText("How we rank")).toBeVisible();
  await expect(page.getByText("Best for each of your goals")).toBeVisible();
  await expect(page.locator("ol li a.font-semibold").first()).toHaveText(/Laser Toning/);
  // Every listed treatment treats one of the chosen goals: switching to one goal narrows the list.
  const all = await page.locator("ol li a.font-semibold").count();
  await page.getByRole("tab", { name: /^Redness/ }).click();
  const red = await page.locator("ol li a.font-semibold").count();
  expect(red).toBeGreaterThan(0);
  expect(red).toBeLessThan(all);
  await expectNoOverflow(page);

  await page.getByRole("tab", { name: /All your goals/ }).click();
  await page.locator("button[aria-label^='Save']").first().click();
  await page.getByRole("button", { name: /Your list \(1\)/ }).click();
  await expect(page.getByRole("heading", { name: "Your list" })).toBeVisible();
  await page.locator("a[href^='/clinics']").first().click();
  await expect(page.getByRole("heading", { name: /Find a clinic for/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("recent treatments search finds brand names", async ({ page }) => {
  await setup(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Lines & Wrinkles", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Miami", exact: true }).click();
  await page.getByRole("radio", { name: "35-49" }).click();
  await page.getByRole("radio", { name: "Light — burns easily" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "None of these", exact: true }).click();
  await page.getByPlaceholder(/Search, e.g/).fill("dysport");
  await page.getByRole("button", { name: "Botox", exact: true }).click();
  await page.getByRole("button", { name: "See my options" }).click();
  await expect(page.getByText(/You had this recently/).first()).toBeVisible();
});

test("health questions hide treatments their labels rule out", async ({ page }) => {
  await setup(page);
  await page.goto("/");
  await takeQuiz(page, { goals: ["Lifting & Firmness"], age: "50-64", flags: ["Pacemaker or implanted device"] });
  await expect(page.locator("ol li a.font-semibold", { hasText: "Thermage" })).toHaveCount(0);
});
