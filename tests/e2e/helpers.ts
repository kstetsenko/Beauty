import { expect, type Page } from "@playwright/test";

/** Skip the first-visit notice and collect console errors for the page. */
export async function setup(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.addInitScript(() => localStorage.setItem("disclaimer_acknowledged_v2", new Date().toISOString()));
  // Never hit real clinic, Google or research sites from tests.
  await page.context().route(/^https?:\/\/(?!localhost)/, (r) => r.fulfill({ status: 200, body: "ok" }));
  return errors;
}

/** No sideways scroll at the current width. */
export async function expectNoOverflow(page: Page) {
  const { sw, vw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: window.innerWidth }));
  expect(sw).toBeLessThanOrEqual(vw);
}

/** Save a profile in the tab, as the quiz does. */
export async function withProfile(page: Page, profile: Record<string, unknown>) {
  await page.addInitScript((p) => sessionStorage.setItem("aesthetic_guide_profile", JSON.stringify(p)), profile);
}

export const typical = { city: "nyc", goals: ["lines", "texture"], age: "35-49", tone: "light", flags: [], had: [] };

/** Complete the 5-question quiz by tapping, in the order people see it. */
export async function takeQuiz(
  page: Page,
  o: { goals: string[]; city?: string; age?: string; tone?: string; flags?: string[]; had?: string[] },
) {
  for (const g of o.goals) await page.getByRole("button", { name: g, exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: o.city ?? "New York City", exact: true }).click();
  await page.getByRole("radio", { name: o.age ?? "35-49" }).click();
  await page.getByRole("radio", { name: o.tone ?? "Light — burns easily" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  for (const f of o.flags ?? []) await page.getByRole("button", { name: f }).click();
  await page.getByRole("button", { name: o.flags?.length ? "Continue" : "None of these", exact: true }).click();
  if (o.had?.length) {
    for (const h of o.had) await page.getByRole("button", { name: h, exact: true }).click();
    await page.getByRole("button", { name: "See my options" }).click();
  } else await page.getByRole("button", { name: "None — see my options" }).click();
  await expect(page.getByRole("heading", { name: "Your matches" })).toBeVisible();
}
