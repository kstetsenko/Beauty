import { defineConfig } from "@playwright/test";

const PORT = 3127;
/** Browser tests at phone and desktop widths. Run `npm run build` first; CI does this for you. */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  projects: [
    { name: "phone", use: { viewport: { width: 390, height: 844 } } },
    { name: "desktop", use: { viewport: { width: 1100, height: 900 } } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
