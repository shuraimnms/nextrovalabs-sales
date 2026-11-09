import { defineConfig, devices } from "@playwright/test";

// E2E expects a running app + seeded DB (see docs/SETUP.md).
// E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD must be a Super Admin or Admin account.
// PW_CHROMIUM_PATH can point at an existing Chromium (useful in sandboxes).
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000", trace: "retain-on-failure", launchOptions: { executablePath } },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    { name: "desktop", dependencies: ["setup"], testIgnore: /auth\.setup/, use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } } },
    { name: "mobile", dependencies: ["setup"], testMatch: /a11y/, use: { ...devices["Pixel 7"], launchOptions: { executablePath } } },
  ],
  webServer: process.env.E2E_NO_SERVER ? undefined : { command: "npm run start", url: "http://localhost:3000/login", reuseExistingServer: true, timeout: 120_000 },
});
