import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import path from "node:path";

const file = path.resolve("prototype/dist/index.html");

test("shareable prototype runs the quiz and clinic finder offline", async ({ page }) => {
  test.skip(!existsSync(file), "run `npm run prototype` first");
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("file://" + file);
  await page.locator("[role=dialog] input").check();
  await page.getByRole("button", { name: "I understand" }).click();
  await page.getByRole("button", { name: "New York City", exact: true }).click();
  await page.getByRole("button", { name: "Lines & Wrinkles", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("radio", { name: "35-49" }).click();
  await page.getByRole("radio", { name: "Light — burns easily" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "None of these" }).click();
  await page.getByRole("button", { name: "None — see my options" }).click();
  await expect(page.getByRole("heading", { name: "Your matches" })).toBeVisible();
  await page.goto("file://" + file + "#c-botox-nyc-a4");
  await expect(page.getByRole("heading", { name: "Find a clinic for Botox" })).toBeVisible();
  expect(errors).toEqual([]);
});
