import { test, expect, type Page } from "@playwright/test";
import { GOAL_LABELS } from "../../lib/procedures";
import { expectNoOverflow, setup, takeQuiz, typical, withProfile } from "./helpers";

const cards = (page: Page) => page.locator("ol li a.font-semibold");

/** Tap every plan, sort, filter and goal tab; each must leave at least one result and no errors. */
async function clickEveryOption(page: Page) {
  const plans = page.locator("section > div.grid button[aria-pressed]");
  expect(await plans.count(), "plans found").toBeGreaterThan(0);
  for (let i = 0; i < (await plans.count()); i++) {
    const label = (await plans.nth(i).textContent()) ?? "";
    await plans.nth(i).click();
    expect(await cards(page).count(), `plan ${label}`).toBeGreaterThan(0);
    await plans.nth(i).click();
  }
  const sorts = page.getByRole("radiogroup", { name: "Sort" }).getByRole("radio");
  for (let i = 0; i < (await sorts.count()); i++) {
    await sorts.nth(i).click();
    expect(await cards(page).count()).toBeGreaterThan(0);
  }
  await sorts.first().click();
  const chips = page.locator("button[aria-pressed]").filter({ hasText: /\(\d+\)$/ });
  const n = await chips.count();
  expect(n, "filter chips found").toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    const chip = page.locator("button[aria-pressed]").filter({ hasText: /\(\d+\)$/ }).nth(i);
    const label = (await chip.textContent()) ?? "";
    const expected = Number(label.match(/\((\d+)\)$/)?.[1]);
    await chip.click();
    expect(await cards(page).count(), `filter ${label}`).toBe(expected);
    await page.locator("button[aria-pressed='true']").filter({ hasText: label.replace(/ \(\d+\)$/, "") }).click();
  }
  const tabs = page.getByRole("tablist", { name: "Your goals" }).getByRole("tab");
  for (let i = 0; i < (await tabs.count()); i++) {
    await tabs.nth(i).click();
    expect(await cards(page).count()).toBeGreaterThan(0);
  }
}

test.describe("every option on the results page, for every goal", () => {
  for (const goal of Object.values(GOAL_LABELS))
    test(goal, async ({ page }) => {
      const errors = await setup(page);
      await page.goto("/");
      await takeQuiz(page, { goals: [goal] });
      await clickEveryOption(page);
      await expectNoOverflow(page);
      expect(errors).toEqual([]);
    });

  test("three goals, deep skin, Miami", async ({ page }) => {
    const errors = await setup(page);
    await page.goto("/");
    await takeQuiz(page, { goals: ["Texture & Pores", "Acne Scars", "Breakouts"], city: "Miami", tone: "Deep brown or Black" });
    await clickEveryOption(page);
    expect(errors).toEqual([]);
  });
});

test.describe("every button on the main pages works without errors", () => {
  const pages = ["/about", "/goals", "/goals/lines?city=nyc", "/procedures", "/compare?goal=lines", "/insights", "/procedures/botox?city=nyc", "/clinics?t=botox&city=nyc", "/sources"];
  for (const path of pages)
    test(path, async ({ page }) => {
      const errors = await setup(page);
      await withProfile(page, typical);
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      // Open every fold-out and tap every in-page button (links are covered by the page tests).
      for (const s of await page.locator("main summary").all()) if (await s.isVisible()) await s.click();
      const buttons = page.locator("main button:visible");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        const b = buttons.nth(i);
        if (!(await b.isVisible()) || (await b.isDisabled())) continue;
        const text = (await b.textContent()) ?? "";
        if (/feedback|send|start over|clear/i.test(text)) continue;
        await b.click({ trial: false }).catch(() => {});
        if (page.url().includes(path.split("?")[0]) === false) await page.goBack();
      }
      await expectNoOverflow(page);
      expect(errors).toEqual([]);
    });

  test("All treatments shows your goals first, all goals on request", async ({ page }) => {
    await setup(page);
    await withProfile(page, { ...typical, goals: ["redness"] });
    await page.goto("/procedures");
    await expect(page.getByText(/treatments for redness fit your answers/)).toBeVisible();
    const mine = await page.locator("main ul li a").count();
    await page.getByRole("tab", { name: /All goals/ }).click();
    await expect(page.getByText(/of \d+ treatments fit your answers/)).toBeVisible();
    const all = await page.locator("main ul li a").count();
    expect(mine).toBeGreaterThan(0);
    expect(all).toBeGreaterThan(mine);
  });
});

test.describe("expected results, notes and provider wording", () => {
  test("cards show an expected-results tag and grammatical notes", async ({ page }) => {
    const errors = await setup(page);
    await page.goto("/");
    await takeQuiz(page, { goals: ["Lines & Wrinkles"], tone: "Deep brown or Black" });
    await expect(page.getByText(/Expected results: (subtle|noticeable|dramatic)/).first()).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/(^|\n)\s*! /);
    expect(text).toMatch(/Note: /);
    expect(errors).toEqual([]);
  });

  test("a treatment page defers instructions to the provider and shows expected results", async ({ page }) => {
    const errors = await setup(page);
    await page.goto("/procedures/botox?city=nyc");
    await expect(page.getByText("Often combined with")).toHaveCount(0);
    await page.getByText("Results & recovery").click();
    await expect(page.getByText(/Your provider will give you before-treatment and aftercare instructions/)).toBeVisible();
    await expect(page.getByText(/Expected results/).first()).toBeVisible();
    await expectNoOverflow(page);
    expect(errors).toEqual([]);
  });
});

test.describe("finding the right treatment and clinic without Google", () => {
  test("goals are explained in everyday words and search finds brands and concerns", async ({ page }) => {
    const errors = await setup(page);
    await page.goto("/");
    await page.getByPlaceholder(/Search a treatment or a concern/).fill("morpheus");
    await expect(page.getByRole("link", { name: /Morpheus8/ }).first()).toBeVisible();
    await page.getByPlaceholder(/Search a treatment or a concern/).fill("sun spots");
    await expect(page.getByRole("link", { name: /Options for spots/i })).toBeVisible();
    await page.getByPlaceholder(/Search a treatment or a concern/).fill("zzzz");
    await expect(page.getByText(/Not in our guide/)).toBeVisible();
    await page.getByRole("button", { name: "New York City", exact: true }).click();
    await expect(page.getByText("Sun spots, dark patches, uneven tone")).toBeVisible();
    await expectNoOverflow(page);
    expect(errors).toEqual([]);
  });

  test("your list shows clinics that offer it, costs, and a share link without health answers", async ({ page }) => {
    const errors = await setup(page);
    await page.goto("/");
    await takeQuiz(page, { goals: ["Lines & Wrinkles"], flags: [] });
    await page.getByRole("button", { name: /Find clinics for my top matches/ }).click();
    const clinics = page.getByRole("list", { name: "Clinics that offer your list" });
    await expect(clinics.getByText(/\d of \d/).first()).toBeVisible();
    const href = await page.getByRole("link", { name: "Printable page" }).getAttribute("href");
    expect(href).toMatch(/^\/list\?city=nyc&ids=[a-z0-9,-]+$/);
    await page.goto(href!);
    await expect(page.getByRole("heading", { name: "Treatment shortlist" })).toBeVisible();
    await expect(page.getByText(/not recommendations or medical advice/)).toBeVisible();
    await expectNoOverflow(page);
    expect(errors).toEqual([]);
  });

  test("clinic cards in the finder show other treatments from your list", async ({ page }) => {
    const errors = await setup(page);
    await page.addInitScript(() => sessionStorage.setItem("aesthetic_guide_list", JSON.stringify(["botox", "sofwave", "fraxel"])));
    await page.goto("/clinics?t=botox&city=nyc");
    await expect(page.getByText(/Also offers from your list: .*Sofwave/).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("off-label treatments are not the top match for lines and texture", async ({ page }) => {
    await setup(page);
    await page.goto("/");
    await takeQuiz(page, { goals: ["Lines & Wrinkles", "Texture & Pores"], tone: "Medium — tans" });
    await expect(page.locator("ol li a.font-semibold").first()).not.toHaveText(/Photodynamic/);
  });
});
