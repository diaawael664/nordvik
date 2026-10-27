/**
 * End-to-end tests: `npm run test:e2e`
 *
 * The tests run against the static export in /out (exactly what you deploy),
 * served on port 4321. Run `npm run build` first.
 *
 * Browsers: run `npx playwright install chromium` once, or use an installed
 * Chrome with `PW_CHANNEL=chrome npm run test:e2e`.
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4321",
    channel: process.env.PW_CHANNEL || undefined,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      testIgnore: /mobile\.spec\.ts/,
    },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
  ],
  webServer: {
    command: "npx serve out -l 4321",
    url: "http://localhost:4321",
    reuseExistingServer: true,
  },
});
