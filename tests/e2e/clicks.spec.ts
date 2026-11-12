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
    const mine = await page.locator("main ul li a").count();
    await page.getByRole("tab", { name: /All goals/ }).click();
    const all = await page.locator("main ul li a").count();
    expect(mine).toBeGreaterThan(0);
    expect(all).toBeGreaterThan(mine);
  });
});
